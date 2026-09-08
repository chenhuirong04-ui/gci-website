// GCI Insights generator — GitHub Actions -> OpenAI Responses API + web_search -> Supabase.
//
// Notion no longer participates in daily generation (see migrate-notion-to-supabase.ts for
// the one-time historical migration). This script never reads or writes Notion, and never
// uses NOTION_TOKEN.
//
// Daily flow:
//   1. Query Supabase for per-country published counts -> pick 3 distinct target markets
//      using the same rotation algorithm the old /api/intelligence-next-target used
//      (COUNTRY_POOL / PHASE1_PRIORITY / PHASE2_PRIORITY / PHASE1_THRESHOLD, unchanged).
//   2. For EACH market, independently: one OpenAI call for ONE insight -> gate -> dedup ->
//      Supabase insert. 3 markets = 3 logical calls, one each — no batching multiple markets
//      into a single request.
//      (A prior version tried batching all 3 markets into one request to save tokens; in a
//      real production run every attempt of that batched call timed out — larger prompts +
//      3x the generation work apparently pushed it past what web_search + gpt-5-mini could
//      reliably finish inside the timeout. Reverted to one market per call for reliability;
//      still far below the original per-country-loop design's worst case of 8 calls/day.)
//   3. Gate each item: skip, country-mismatch, missing fields, relevance_score >= 7, then a
//      small recent-window dedup hint check.
//   4. Insert into Supabase; a UNIQUE-constraint conflict (source_url or title_fingerprint)
//      is treated as "duplicate", not an error — Supabase is the final dedup authority.
// A failure on any one market (timeout, skip, low relevance, duplicate, insert error) never
// affects the other markets — each runs fully independently. There is no supplemental call
// and no swapping in a 4th backup market: if a market ends up unpublished, the day simply
// publishes fewer than 3, with an explicit reason in the summary.
//
// Run with `--dry-run` for a single-request preview (no OpenAI/Supabase writes, only a
// read-only Supabase query to build a realistic preview for the first target market).
// Run with `--simulate` to exercise the real per-market control flow against the live
// Supabase rotation/dedup queries (read-only) with OpenAI and the Supabase insert replaced
// by a scripted mock — no real OpenAI call or Supabase write happens. Set SIMULATE_SCENARIO
// to one of: all_success (default), one_timeout, one_duplicate, one_low_relevance, one_skip.

import "dotenv/config";
import * as supabase from "./supabase";

const OPENAI_URL = "https://api.openai.com/v1/responses";
const OPENAI_MODEL = "gpt-5-mini";
const OPENAI_MAX_OUTPUT_TOKENS = 4000; // single insight per call now, not a 3-item batch
const OPENAI_TIMEOUT_MS = 55_000;
const MAX_ATTEMPTS = 3; // per market: 1 initial + 2 retries (transient failures only), no more
const RETRY_DELAYS_MS = [3000, 8000];
const RELEVANCE_THRESHOLD = 7;

const TARGET_MARKETS_COUNT = 3; // = number of markets picked, = number of logical OpenAI calls/day
const DEDUP_WINDOW_SIZE = 25; // recent titles/URLs sent to the model, not the full history

const isDryRun = process.argv.includes("--dry-run") || process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
const isSimulate = process.argv.includes("--simulate") || process.env.SIMULATE === "1" || process.env.SIMULATE === "true";

const CATEGORY_VALUES = ["Regulatory Updates", "Market News", "Trade Notes", "GCI Insights"] as const;
const BUSINESS_AREA_VALUES = [
  "AI & Digital Economy",
  "Construction & Infrastructure",
  "Investment & Business",
  "Workforce & Labor Market",
  "Trade & Supply Chain",
  "Market Entry & Regulation",
  "Project Supply & FF&E",
  "Energy & Industrial Development",
] as const;

// Same rotation asset as the old api/intelligence-next-target.ts — moved in here verbatim,
// now driven by a Supabase count query instead of an HTTP round-trip. Not redesigned.
const COUNTRY_POOL = [
  "UAE / Dubai", "Saudi Arabia", "Qatar", "Bahrain", "Oman", "Kuwait",
  "Kenya", "Tanzania", "Nigeria", "Morocco", "China", "Brazil", "Global",
];
const PHASE1_PRIORITY = [
  "Bahrain", "Oman", "Kuwait", "Tanzania", "Nigeria",
  "Morocco", "China", "Qatar", "Kenya", "Brazil",
  "Global", "UAE / Dubai", "Saudi Arabia",
];
const PHASE2_PRIORITY = [
  "UAE / Dubai", "Saudi Arabia", "Qatar", "Bahrain", "Oman",
  "Kuwait", "Kenya", "Tanzania", "Nigeria", "Morocco",
  "China", "Brazil", "Global",
];
const PHASE1_THRESHOLD = 5;

function log(...args: unknown[]) {
  console.log(`[gci-insights ${new Date().toISOString()}]`, ...args);
}

function fail(message: string): never {
  console.error(`[gci-insights ${new Date().toISOString()}] FATAL: ${message}`);
  process.exit(1);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Step 1: pick N distinct target markets from Supabase-derived counts
// ---------------------------------------------------------------------------

function pickTargetMarkets(counts: Record<string, number>, n: number): { phase: string; markets: string[] } {
  const allAboveThreshold = COUNTRY_POOL.every((c) => (counts[c] ?? 0) >= PHASE1_THRESHOLD);
  const phase = allAboveThreshold ? "balanced_rotation" : "database_building";
  const priority = allAboveThreshold ? PHASE2_PRIORITY : PHASE1_PRIORITY;

  const chosen: string[] = [];
  const simulated = { ...counts };

  for (let i = 0; i < n; i++) {
    const pool = COUNTRY_POOL.filter((c) => !chosen.includes(c));
    if (pool.length === 0) break;
    const minCount = Math.min(...pool.map((c) => simulated[c] ?? 0));
    const pick = priority.find((c) => pool.includes(c) && (simulated[c] ?? 0) === minCount) ?? pool[0];
    chosen.push(pick);
    simulated[pick] = (simulated[pick] ?? 0) + 1; // so the next pick in this same batch rotates on
  }

  return { phase, markets: chosen };
}

// ---------------------------------------------------------------------------
// Step 2: OpenAI Responses API — one call per market, one insight per call
// ---------------------------------------------------------------------------

const INSIGHT_ITEM_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    skip: { type: "boolean" },
    country: { type: ["string", "null"] },
    title_en: { type: ["string", "null"] },
    title_zh: { type: ["string", "null"] },
    title_ar: { type: ["string", "null"] },
    summary_en: { type: ["string", "null"] },
    summary_zh: { type: ["string", "null"] },
    summary_ar: { type: ["string", "null"] },
    source_url: { type: ["string", "null"] },
    source_name: { type: ["string", "null"] },
    category: { type: ["string", "null"], enum: [...CATEGORY_VALUES, null] },
    business_area: { type: ["string", "null"], enum: [...BUSINESS_AREA_VALUES, null] },
    relevance_score: { type: ["integer", "null"] },
    is_official_source: { type: ["boolean", "null"] },
    date: { type: ["string", "null"], description: "ISO date YYYY-MM-DD" },
    business_impact: { type: ["string", "null"] },
    gci_recommendation: { type: ["string", "null"] },
    website_content_en: { type: ["string", "null"] },
    website_content_zh: { type: ["string", "null"] },
  },
  required: [
    "skip", "country", "title_en", "title_zh", "title_ar",
    "summary_en", "summary_zh", "summary_ar",
    "source_url", "source_name", "category", "business_area",
    "relevance_score", "is_official_source", "date",
    "business_impact", "gci_recommendation",
    "website_content_en", "website_content_zh",
  ],
} as const;

const GCI_BUSINESS_CONTEXT = `
GCI (Global Care Info) helps companies and project owners operate in the UAE and connected
markets across five service lines: market entry & local execution, trade/supply chain &
commercial matching, projects & resource solutions (FF&E, building materials), AI & business
systems, and cross-border workforce recruitment.
`.trim();

function buildPrompt(market: string, dedup: { titles: string[]; urls: string[] }): string {
  const today = new Date().toISOString().slice(0, 10);

  return `You are GCI Intelligence Engine for GlobalCare Info.

Today: ${today}

${GCI_BUSINESS_CONTEXT}

Find ONE qualifying business intelligence update, published within the last 7 days, for this
target market: ${market}.

Recently published titles — do not repeat or lightly reword any of these:
${JSON.stringify(dedup.titles)}

Recently published source URLs — do not repeat any of these:
${JSON.stringify(dedup.urls)}

Relevant topics (any one of these six areas qualifies):
1. AI & Digital Economy — AI, data centers, cloud, digital infrastructure, AI regulation, automation, enterprise AI.
2. Construction & Infrastructure — construction, infrastructure, major projects, EPC, developers, real estate, hospitality projects, industrial parks, transport, utilities.
3. Investment & Business — investment, FDI, M&A, sovereign funds, corporate expansion, free zones, business regulation.
4. Workforce & Labor Market — workforce, recruitment, labor market, skills shortage, construction labor demand, work permits, visa/immigration policy, employment regulation, wage regulation.
5. Trade & Supply Chain — trade, customs, logistics, ports, supply chain, manufacturing, project supply, building materials, FF&E.
6. Energy & Industrial Development — power, energy, renewable energy, oil & gas, manufacturing, industrial development, mining.

Source rules: prefer official or institutional sources first — government, ministry, authority, customs, free zone, port authority, chamber, sovereign fund, state-owned enterprise, investment agency, developer, EPC/contractor official announcements. If no official primary source exists, a reliable international or regional business/industry outlet is acceptable (major business media, GCC regional business media, construction/project-industry trade press, or a developer's/EPC contractor's own press release) — but the source must be verifiable. Do not use SEO content farms, unsourced reprints, low-quality aggregator sites, or any page whose original publish date or source cannot be confirmed.

If you cannot find a genuinely new, relevant, verifiable item for ${market} within the last 7 days, set skip to true and leave every other field null — do not fabricate one just to fill the fields.

If you do find one, set skip to false, set country to exactly "${market}", and fill every other field:
category must be one of: Regulatory Updates, Market News, Trade Notes, GCI Insights.
business_area must be one of: AI & Digital Economy, Construction & Infrastructure, Investment & Business, Workforce & Labor Market, Trade & Supply Chain, Market Entry & Regulation, Project Supply & FF&E, Energy & Industrial Development.
relevance_score must be an integer from 1 to 10.
date must be the source article's publication date in YYYY-MM-DD format.
is_official_source=true only for official or institutional sources.
title_zh and summary_zh must be written in Simplified Chinese, matching the meaning of title_en and summary_en.
title_ar and summary_ar must be written in Modern Standard Arabic, matching the meaning of title_en and summary_en.
business_impact must be 2-3 sentences in English explaining why this development matters for companies operating in or entering this market.
gci_recommendation must be 1-2 sentences in English giving a concrete, practical recommendation for GCI clients related to this development.
website_content_en must be a 150-250 word article body in English, in GCI's professional advisory tone.
website_content_zh must be a 400-600 Chinese character article body in Simplified Chinese, matching the meaning of website_content_en (not a literal translation, but equivalent content and length).

Return only the structured result — no extra commentary.`;
}

function buildOpenAIRequestBody(market: string, dedup: { titles: string[]; urls: string[] }) {
  return {
    model: OPENAI_MODEL,
    tools: [{ type: "web_search", search_context_size: "low" }],
    max_output_tokens: OPENAI_MAX_OUTPUT_TOKENS,
    parallel_tool_calls: false,
    input: buildPrompt(market, dedup),
    text: {
      format: {
        type: "json_schema",
        name: "gci_insight",
        schema: INSIGHT_ITEM_SCHEMA,
        strict: true,
      },
    },
  };
}

interface InsightItem {
  skip: boolean;
  country: string | null;
  title_en: string | null;
  title_zh: string | null;
  title_ar: string | null;
  summary_en: string | null;
  summary_zh: string | null;
  summary_ar: string | null;
  source_url: string | null;
  source_name: string | null;
  category: string | null;
  business_area: string | null;
  relevance_score: number | null;
  is_official_source: boolean | null;
  date: string | null;
  business_impact: string | null;
  gci_recommendation: string | null;
  website_content_en: string | null;
  website_content_zh: string | null;
}

function extractMessageText(responseData: any): string {
  const output: any[] = responseData?.output || [];
  const messageItem = output.find((item) => item.type === "message");
  if (!messageItem) throw new Error("no 'message' item in OpenAI response output array");
  const textPart = (messageItem.content || []).find((part: any) => typeof part.text === "string");
  if (!textPart) throw new Error("message item has no text content part");
  return textPart.text;
}

async function callOpenAIForMarket(apiKey: string, market: string, dedup: { titles: string[]; urls: string[] }): Promise<InsightItem> {
  const body = buildOpenAIRequestBody(market, dedup);
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      log(`OpenAI call attempt ${attempt}/${MAX_ATTEMPTS} for market="${market}"`);
      const r = await fetchWithTimeout(
        OPENAI_URL,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        OPENAI_TIMEOUT_MS
      );
      if (!r.ok) {
        const errText = await r.text().catch(() => "");
        throw new Error(`OpenAI HTTP ${r.status}: ${errText.slice(0, 500)}`);
      }
      const data = await r.json();
      const text = extractMessageText(data);
      return JSON.parse(text) as InsightItem;
    } catch (err) {
      lastError = err;
      const isTimeout = err instanceof Error && err.name === "AbortError";
      log(`attempt ${attempt} failed: ${isTimeout ? "timeout" : (err as Error).message}`);
      if (attempt < MAX_ATTEMPTS) {
        const delay = RETRY_DELAYS_MS[attempt - 1] ?? RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1];
        await sleep(delay);
      }
    }
  }
  // No further retries beyond MAX_ATTEMPTS — this market simply fails for today.
  throw new Error(`OpenAI call failed after ${MAX_ATTEMPTS} attempts: ${(lastError as Error)?.message}`);
}

// ---------------------------------------------------------------------------
// Step 3: per-item gate (skip / country-match / required fields / relevance / recent-window dedup)
// ---------------------------------------------------------------------------

const REQUIRED_WHEN_PUBLISHING: (keyof InsightItem)[] = [
  "title_en", "title_zh", "title_ar", "summary_en", "summary_zh", "summary_ar",
  "source_url", "source_name", "category", "business_area", "date",
  "business_impact", "gci_recommendation", "website_content_en", "website_content_zh",
];

function validateItem(item: InsightItem, market: string, dedup: { titles: string[]; urls: string[] }): string | null {
  if (item.skip === true) return "model returned skip:true (no verified article found for this market)";
  if (item.country !== market) return `country mismatch: expected "${market}", got "${item.country}"`;

  const missing = REQUIRED_WHEN_PUBLISHING.filter((key) => !item[key]);
  if (missing.length > 0) return `skip:false but missing required field(s): ${missing.join(", ")}`;

  if (typeof item.relevance_score !== "number" || item.relevance_score < RELEVANCE_THRESHOLD) {
    return `relevance_score ${item.relevance_score} < ${RELEVANCE_THRESHOLD}`;
  }
  // First-layer hint check against the small recent window. Supabase's UNIQUE constraints
  // (checked at insert time) are the real, full-history source of truth for dedup.
  if (item.source_url && dedup.urls.includes(item.source_url)) {
    return `duplicate source_url (recent window): ${item.source_url}`;
  }
  if (item.title_en && dedup.titles.includes(item.title_en)) {
    return `duplicate title_en (recent window): ${item.title_en}`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Steps 2-4 combined: the daily run — one independent pass per market
// ---------------------------------------------------------------------------

interface AttemptRecord {
  market: string;
  outcome: "published" | "skipped" | "failed";
  title?: string;
  reason?: string;
}

async function runDailyRun(deps: {
  generateOne: (market: string, dedup: { titles: string[]; urls: string[] }) => Promise<InsightItem>;
  insert: (row: supabase.GciInsightInsert) => Promise<supabase.InsertResult>;
}): Promise<{ records: AttemptRecord[]; published: number; targetMarkets: string[]; logicalCalls: number }> {
  const counts = await supabase.getCountryCounts(COUNTRY_POOL);
  const { phase, markets: targetMarkets } = pickTargetMarkets(counts, TARGET_MARKETS_COUNT);
  log(`phase=${phase} target markets=[${targetMarkets.join(", ")}]`);

  const records: AttemptRecord[] = [];
  let published = 0;

  for (const market of targetMarkets) {
    // Fresh dedup window per market so a market processed later in the loop already sees
    // anything an earlier market in this same run just published.
    const dedup = await supabase.getRecentDedupWindow(DEDUP_WINDOW_SIZE);

    let item: InsightItem;
    try {
      item = await deps.generateOne(market, dedup);
    } catch (err) {
      const msg = (err as Error).message;
      log(`market ${market}: OpenAI call failed — ${msg}`);
      records.push({ market, outcome: "failed", reason: `OpenAI call failed: ${msg}` });
      continue;
    }

    const invalidReason = validateItem(item, market, dedup);
    if (invalidReason) {
      log(`market ${market}: skipped — ${invalidReason}`);
      records.push({ market, outcome: "skipped", reason: invalidReason });
      continue;
    }

    const result = await deps.insert({
      title_en: item.title_en!,
      title_zh: item.title_zh,
      title_ar: item.title_ar,
      summary_en: item.summary_en,
      summary_zh: item.summary_zh,
      summary_ar: item.summary_ar,
      website_content_en: item.website_content_en,
      website_content_zh: item.website_content_zh,
      country: market,
      category: item.category!,
      business_area: item.business_area,
      source_url: item.source_url,
      source_name: item.source_name,
      source_date: item.date,
      business_impact: item.business_impact,
      gci_recommendation: item.gci_recommendation,
      relevance_score: item.relevance_score,
      is_official_source: item.is_official_source,
    });

    if (result.ok === true) {
      published++;
      log(`market ${market}: published — "${item.title_en}" (${result.id})`);
      records.push({ market, outcome: "published", title: item.title_en! });
    } else if (result.duplicate === true) {
      log(`market ${market}: skipped — Supabase unique constraint conflict (source_url or title_fingerprint)`);
      records.push({ market, outcome: "skipped", reason: "Supabase unique constraint conflict (duplicate)" });
    } else {
      log(`market ${market}: failed — Supabase insert error: ${result.error}`);
      records.push({ market, outcome: "failed", reason: `Supabase insert failed: ${result.error}` });
    }
  }

  return { records, published, targetMarkets, logicalCalls: targetMarkets.length };
}

function buildSummary(records: AttemptRecord[], published: number, targetMarkets: string[], logicalCalls: number): string {
  const skipped = records.filter((r) => r.outcome === "skipped").length;
  const failed = records.filter((r) => r.outcome === "failed").length;
  const publishedRecords = records.filter((r) => r.outcome === "published");

  const lines: string[] = [
    "",
    "GCI Insights Daily Run Summary",
    "",
    `target markets: ${targetMarkets.join(", ")}`,
    `logical calls used: ${logicalCalls}`,
    `published: ${published}`,
    `skipped: ${skipped}`,
    `failed: ${failed}`,
    "",
    "published countries:",
    ...publishedRecords.map((r) => `- ${r.market}`),
    "",
    "published titles:",
    ...publishedRecords.map((r) => `- ${r.title}`),
  ];

  if (published < TARGET_MARKETS_COUNT) {
    lines.push(
      "",
      `target: ${TARGET_MARKETS_COUNT}`,
      `published: ${published}`,
      `reason: not every market produced a qualified candidate today (no supplemental/backup market is used — see per-market outcomes above)`
    );
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Entrypoint
// ---------------------------------------------------------------------------

async function main() {
  if (isDryRun) {
    log("DRY RUN — single-request preview only (no loop, no OpenAI or Supabase writes)");
    const counts = await supabase.getCountryCounts(COUNTRY_POOL);
    const { phase, markets } = pickTargetMarkets(counts, TARGET_MARKETS_COUNT);
    log(`phase=${phase} target markets=[${markets.join(", ")}]`);
    log(`counts: ${JSON.stringify(counts)}`);

    const dedup = await supabase.getRecentDedupWindow(DEDUP_WINDOW_SIZE);
    log(`recent dedup window: ${dedup.titles.length} titles, ${dedup.urls.length} urls`);

    const body = buildOpenAIRequestBody(markets[0], dedup);
    console.log(`\n--- OpenAI request body that would be sent (market 1 of ${markets.length}: "${markets[0]}") ---\n`);
    console.log(JSON.stringify(body, null, 2));

    log("dry run complete, exiting without calling OpenAI or writing to Supabase");
    return;
  }

  if (isSimulate) {
    const scenario = process.env.SIMULATE_SCENARIO || "all_success";
    log(`SIMULATE (scenario="${scenario}") — running the real per-market control flow against live Supabase rotation/dedup queries (read-only); OpenAI + insert are scripted mocks, nothing real is written`);

    type Kind = "publish" | "timeout" | "duplicate" | "low_relevance" | "skip_true";
    const SCENARIOS: Record<string, Kind[]> = {
      all_success: ["publish", "publish", "publish"],
      one_timeout: ["timeout", "publish", "publish"],
      one_duplicate: ["duplicate", "publish", "publish"],
      one_low_relevance: ["low_relevance", "publish", "publish"],
      one_skip: ["skip_true", "publish", "publish"],
    };
    const script = SCENARIOS[scenario] ?? SCENARIOS.all_success;

    let marketIdx = 0;
    const mockGenerateOne = async (market: string, _dedup: { titles: string[]; urls: string[] }): Promise<InsightItem> => {
      const kind = script[marketIdx] ?? "publish";
      marketIdx++;

      if (kind === "timeout") {
        throw new Error("[simulated] OpenAI request timed out after 3 attempts");
      }
      if (kind === "skip_true") {
        return {
          skip: true, country: null, title_en: null, title_zh: null, title_ar: null,
          summary_en: null, summary_zh: null, summary_ar: null, source_url: null, source_name: null,
          category: null, business_area: null, relevance_score: null, is_official_source: null,
          date: null, business_impact: null, gci_recommendation: null, website_content_en: null, website_content_zh: null,
        };
      }
      return {
        skip: false,
        country: market,
        title_en: `[SIMULATED] ${market} insight (${kind})`,
        title_zh: `[模拟] ${market} 情报`,
        title_ar: `[محاكاة] ${market}`,
        summary_en: "Simulated summary for control-flow verification.",
        summary_zh: "用于验证控制流程的模拟摘要。",
        summary_ar: "ملخص محاكى للتحقق من سير العمل.",
        source_url: kind === "duplicate" ? "https://example.com/simulated-duplicate" : `https://example.com/simulated-${market.replace(/[^a-z0-9]+/gi, "-")}`,
        source_name: "Simulated Source",
        category: "GCI Insights",
        business_area: "Investment & Business",
        relevance_score: kind === "low_relevance" ? 5 : 9,
        is_official_source: true,
        date: new Date().toISOString().slice(0, 10),
        business_impact: "Simulated business impact.",
        gci_recommendation: "Simulated recommendation.",
        website_content_en: "Simulated website content body in English.",
        website_content_zh: "模拟网站正文内容。",
      };
    };

    let insertCount = 0;
    const mockInsert = async (row: supabase.GciInsightInsert): Promise<supabase.InsertResult> => {
      insertCount++;
      if (row.source_url === "https://example.com/simulated-duplicate") {
        log(`[simulate] would-be insert for "${row.title_en}" — simulating Supabase unique conflict`);
        return { ok: false, duplicate: true };
      }
      log(`[simulate] would insert: "${row.title_en}"`);
      return { ok: true, id: `simulated-${insertCount}` };
    };

    const { records, published, targetMarkets, logicalCalls } = await runDailyRun({
      generateOne: mockGenerateOne,
      insert: mockInsert,
    });

    console.log(buildSummary(records, published, targetMarkets, logicalCalls));
    log("simulate complete — no real OpenAI call or Supabase write was made");
    return;
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) fail("OPENAI_API_KEY not set");

  log(`starting daily run — ${TARGET_MARKETS_COUNT} target markets, one independent OpenAI call each`);

  const { records, published, targetMarkets, logicalCalls } = await runDailyRun({
    generateOne: (market, dedup) => callOpenAIForMarket(openaiKey, market, dedup),
    insert: (row) => supabase.insertInsight(row),
  });

  console.log(buildSummary(records, published, targetMarkets, logicalCalls));
}

main().catch((err) => fail(err?.message || String(err)));
