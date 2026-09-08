// GCI Insights generator — replaces the old Make.com "GCI Insights" scenario.
//
// Daily run flow: keep trying candidates, one per country, until either 3 are published
// or 8 have been attempted (whichever comes first) — see runDailyLoop() below.
//
// Per-candidate flow (mirrors the old scenario's real business logic, confirmed from its
// exported blueprint — see the audit report, not re-derived from memory):
//   1. GET  https://www.globalcareinfo.com/api/intelligence-next-target
//      -> target_country, existing_titles, existing_source_urls (unchanged, reused as-is)
//   2. POST https://api.openai.com/v1/responses (model gpt-5-mini + web_search tool)
//      -> one candidate article as JSON text
//   3. Gate: skip:true, relevance_score < 7, or an exact-match duplicate -> skip candidate
//   4. POST https://api.notion.com/v1/pages into the existing Insights database
//      -> Status = "Published", Published = true (same as the old scenario)
// A candidate failing at any step (timeout, retries exhausted, bad JSON, Notion write
// error) only skips that candidate — it never aborts the rest of the day's run.
//
// Run with `--dry-run` (or DRY_RUN=1) to build and print a single OpenAI request body and
// (if NOTION_TOKEN is set) probe the Notion database schema, without calling OpenAI or
// writing to Notion, and without looping.
//
// Run with `--simulate` to exercise the full 8-attempt loop's control flow (country
// rotation, no-repeat guard, in-run dedup, publish/attempt caps, summary) against the
// real /api/intelligence-next-target endpoint (read-only) but with OpenAI and Notion
// calls replaced by a scripted mock — no real OpenAI or Notion calls are made.

const NEXT_TARGET_URL = "https://www.globalcareinfo.com/api/intelligence-next-target";
const OPENAI_URL = "https://api.openai.com/v1/responses";
const NOTION_VERSION = "2022-06-28";
const DB_ID = "931a8a5bc40a4e1cb0ce65491fa0ccf5"; // same Insights database as api/insights.ts

const OPENAI_MODEL = "gpt-5-mini";
const OPENAI_MAX_OUTPUT_TOKENS = 6000; // widened vs the old 3000: schema now includes 4 long-form fields
const OPENAI_TIMEOUT_MS = 55_000; // old Make setup failed at 40s; give real headroom for web_search + gpt-5-mini
const MAX_ATTEMPTS = 3; // per-candidate: 1 initial + 2 retries
const RETRY_DELAYS_MS = [3000, 8000];
const RELEVANCE_THRESHOLD = 7;

const MAX_PUBLISHED_PER_RUN = 3; // daily target
const MAX_ATTEMPTS_PER_RUN = 8; // hard ceiling so a bad day can't loop forever

// Public-facing Category — unchanged, matches the Notion select options and the
// frontend's mapCategory() in api/insights.ts. Do not add values here without also
// updating the frontend.
const CATEGORY_VALUES = ["Regulatory Updates", "Market News", "Trade Notes", "GCI Insights"] as const;

// Internal-only classification field (not a Notion property) — widened alongside the
// broader search scope below. Free to change without touching Notion or the frontend.
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

// Enforced via the Responses API's structured-output mode (text.format below) so a
// malformed/partial model reply is rejected by OpenAI itself instead of surfacing as a
// JSON.parse crash or a silently-wrong Notion write here. All properties must be listed as
// required in strict mode, so the "skip" case still returns every key with null values.
const INSIGHT_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    skip: { type: "boolean" },
    title_en: { type: ["string", "null"] },
    title_zh: { type: ["string", "null"] },
    title_ar: { type: ["string", "null"] },
    summary_en: { type: ["string", "null"] },
    summary_zh: { type: ["string", "null"] },
    summary_ar: { type: ["string", "null"] },
    source_url: { type: ["string", "null"] },
    source_name: { type: ["string", "null"] },
    category: { type: ["string", "null"], enum: [...CATEGORY_VALUES, null] },
    country: { type: ["string", "null"] },
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
    "skip", "title_en", "title_zh", "title_ar",
    "summary_en", "summary_zh", "summary_ar",
    "source_url", "source_name", "category", "country", "business_area",
    "relevance_score", "is_official_source", "date",
    "business_impact", "gci_recommendation",
    "website_content_en", "website_content_zh",
  ],
} as const;

const isDryRun = process.argv.includes("--dry-run") || process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
const isSimulate = process.argv.includes("--simulate") || process.env.SIMULATE === "1" || process.env.SIMULATE === "true";

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
// Step 1: next-target rotation + dedup lists (existing endpoint, unchanged)
// ---------------------------------------------------------------------------

interface NextTargetResponse {
  target_country: string;
  phase: string;
  current_count: number;
  counts: Record<string, number>;
  existing_source_urls: string[];
  existing_titles: string[];
}

async function getNextTarget(): Promise<NextTargetResponse> {
  const r = await fetch(NEXT_TARGET_URL);
  if (!r.ok) {
    throw new Error(`intelligence-next-target returned HTTP ${r.status}`);
  }
  const data = await r.json();
  if (!data.target_country) {
    throw new Error("intelligence-next-target response missing target_country");
  }
  return data;
}

// Read-only mirror of api/intelligence-next-target.ts's own rotation constants and
// selection algorithm (that file is NOT modified — see the migration scope). This is
// only used as a same-run override: /api/intelligence-next-target queries Notion live on
// every call, so under normal circumstances a fresh call after a successful publish
// already reflects the new count and naturally rotates away. This exists purely as a
// deterministic fallback for the rare case where that read lags behind the just-completed
// write, so "no repeat country in one run" is a guarantee, not a hope. If the pool or
// priority lists in that file ever change, this copy should be updated to match.
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

function pickFallbackCountry(target: NextTargetResponse, usedCountries: Set<string>): string | null {
  const unused = COUNTRY_POOL.filter((c) => !usedCountries.has(c));
  if (unused.length === 0) return null;

  const allAboveThreshold = COUNTRY_POOL.every((c) => (target.counts[c] ?? 0) >= PHASE1_THRESHOLD);
  const priority = allAboveThreshold ? PHASE2_PRIORITY : PHASE1_PRIORITY;
  const minCount = Math.min(...unused.map((c) => target.counts[c] ?? 0));

  return priority.find((c) => unused.includes(c) && (target.counts[c] ?? 0) === minCount) ?? unused[0];
}

// ---------------------------------------------------------------------------
// Step 2: OpenAI Responses API (prompt reconstructed from the old Make scenario,
// extended only with the additional fields requested for this migration — see
// the report handed to the user before this file was written)
// ---------------------------------------------------------------------------

function buildPrompt(target: NextTargetResponse): string {
  const today = new Date().toISOString().slice(0, 10);

  return `You are GCI Intelligence Engine for GlobalCare Info.

Today: ${today}
Country: ${target.target_country}
Avoid titles: ${JSON.stringify(target.existing_titles)}
Avoid URLs: ${JSON.stringify(target.existing_source_urls)}

Find ONE recent and verifiable business intelligence update for this exact country, published within the last 7 days.

Use web search briefly. After finding one suitable source, stop searching and return the structured result immediately.

Relevant topics (any one of these six areas qualifies):
1. AI & Digital Economy — AI, data centers, cloud, digital infrastructure, AI regulation, automation, enterprise AI.
2. Construction & Project Intelligence — construction, infrastructure, major projects, EPC, developers, real estate, hospitality projects, industrial parks, transport, utilities.
3. Investment & Business — investment, FDI, M&A, sovereign funds, market entry, free zones, corporate expansion, business regulation.
4. Workforce & Labor Market — workforce, recruitment, labor market, work permits, visa/immigration policy, employment regulation, wage regulation, skills shortages, construction labor demand.
5. Trade & Supply Chain — trade, customs, logistics, ports, supply chain, manufacturing, project supply, building materials, FF&E.
6. Energy & Industrial Development — energy, power, renewable energy, oil & gas, industrial development, manufacturing, mining.

Source rules: prefer official or institutional sources first — government, ministry, authority, customs, free zone, port authority, chamber, sovereign fund, state-owned enterprise, major exchange, official investment agency. If no official primary source exists, a reliable international or regional business/industry outlet is acceptable (major business media, construction/project-industry trade press, or a developer's/EPC contractor's own press release) — but the source must be verifiable. Do not use low-quality reprint sites, SEO content farms, or any page whose original source cannot be confirmed.

Do not use duplicate titles or duplicate source URLs.
If no verified article from the last 7 days is found, set skip to true and leave every other field null — do not fabricate one just to fill the fields.

Rules when skip is false:
category must be one of: Regulatory Updates, Market News, Trade Notes, GCI Insights.
business_area must be one of: AI & Digital Economy, Construction & Infrastructure, Investment & Business, Workforce & Labor Market, Trade & Supply Chain, Market Entry & Regulation, Project Supply & FF&E, Energy & Industrial Development.
relevance_score must be an integer from 1 to 10.
date must be the article publication date in YYYY-MM-DD format.
is_official_source=true only for official or institutional sources.
country must be exactly "${target.target_country}".
title_zh and summary_zh must be written in Simplified Chinese, matching the meaning of title_en and summary_en.
title_ar and summary_ar must be written in Modern Standard Arabic, matching the meaning of title_en and summary_en.
business_impact must be 2-3 sentences in English explaining why this development matters for companies operating in or entering this market.
gci_recommendation must be 1-2 sentences in English giving a concrete, practical recommendation for GCI clients related to this development.
website_content_en must be a 150-250 word article body in English, in GCI's professional advisory tone, expanding on summary_en with context and implications.
website_content_zh must be a 400-600 Chinese character article body in Simplified Chinese, matching the meaning of website_content_en (not a literal translation, but equivalent content and length).`;
}

function buildOpenAIRequestBody(target: NextTargetResponse) {
  return {
    model: OPENAI_MODEL,
    tools: [{ type: "web_search", search_context_size: "low" }],
    max_output_tokens: OPENAI_MAX_OUTPUT_TOKENS,
    parallel_tool_calls: false,
    input: buildPrompt(target),
    text: {
      format: {
        type: "json_schema",
        name: "gci_insight",
        schema: INSIGHT_JSON_SCHEMA,
        strict: true,
      },
    },
  };
}

interface OpenAIInsight {
  skip: boolean;
  title_en: string | null;
  title_zh: string | null;
  title_ar: string | null;
  summary_en: string | null;
  summary_zh: string | null;
  summary_ar: string | null;
  source_url: string | null;
  source_name: string | null;
  category: string | null;
  country: string | null;
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
  if (!messageItem) {
    throw new Error("no 'message' item in OpenAI response output array");
  }
  const textPart = (messageItem.content || []).find((part: any) => typeof part.text === "string");
  if (!textPart) {
    throw new Error("message item has no text content part");
  }
  return textPart.text;
}

async function callOpenAI(apiKey: string, target: NextTargetResponse): Promise<OpenAIInsight> {
  const body = buildOpenAIRequestBody(target);
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      log(`OpenAI call attempt ${attempt}/${MAX_ATTEMPTS} for country="${target.target_country}"`);
      const r = await fetchWithTimeout(
        OPENAI_URL,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
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
      const parsed = JSON.parse(text) as OpenAIInsight;
      return parsed;
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

  throw new Error(`OpenAI call failed after ${MAX_ATTEMPTS} attempts: ${(lastError as Error)?.message}`);
}

// ---------------------------------------------------------------------------
// Step 3: gating (skip / relevance / duplicate) — no typo bug this time
// ---------------------------------------------------------------------------

// The structured-output schema allows every non-skip field to be null (strict mode requires
// listing them all as required, but "required" only means present, not non-null) — so a
// skip:false reply with missing content is still schema-valid and must be caught here.
const REQUIRED_WHEN_PUBLISHING: (keyof OpenAIInsight)[] = [
  "title_en", "title_zh", "title_ar", "summary_en", "summary_zh", "summary_ar",
  "source_url", "source_name", "category", "country", "business_area", "date",
  "business_impact", "gci_recommendation", "website_content_en", "website_content_zh",
];

function shouldSkip(insight: OpenAIInsight, target: NextTargetResponse): string | null {
  if (insight.skip === true) return "model returned skip:true (no verified article found)";

  const missing = REQUIRED_WHEN_PUBLISHING.filter((key) => !insight[key]);
  if (missing.length > 0) return `skip:false but missing required field(s): ${missing.join(", ")}`;

  if (typeof insight.relevance_score !== "number" || insight.relevance_score < RELEVANCE_THRESHOLD) {
    return `relevance_score ${insight.relevance_score} < ${RELEVANCE_THRESHOLD}`;
  }
  if (insight.source_url && target.existing_source_urls.includes(insight.source_url)) {
    return `duplicate source_url: ${insight.source_url}`;
  }
  if (insight.title_en && target.existing_titles.includes(insight.title_en)) {
    return `duplicate title_en: ${insight.title_en}`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Step 4: Notion write — dynamic schema probe so we never assume a property
// exists; anything missing from the live database is logged and skipped
// rather than guessed at or force-created (schema itself is not modified).
// ---------------------------------------------------------------------------

interface NotionPropertyMeta {
  type: string;
}

async function getDatabaseSchema(token: string): Promise<Record<string, NotionPropertyMeta>> {
  const r = await fetch(`https://api.notion.com/v1/databases/${DB_ID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
    },
  });
  if (!r.ok) {
    throw new Error(`Notion database fetch HTTP ${r.status}`);
  }
  const data = await r.json();
  const props: Record<string, NotionPropertyMeta> = {};
  for (const [name, def] of Object.entries<any>(data.properties || {})) {
    props[name] = { type: def.type };
  }
  return props;
}

function chunkText(text: string, maxLen = 1900): string[] {
  if (!text) return [""];
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += maxLen) {
    chunks.push(text.slice(i, i + maxLen));
  }
  return chunks;
}

function richText(text: string | null) {
  return chunkText(text ?? "").map((chunk) => ({ type: "text", text: { content: chunk } }));
}

interface FieldSpec {
  key: keyof OpenAIInsight | "__status__" | "__published__";
  property: string;
  expectedType: string;
  build: (insight: OpenAIInsight) => any;
}

const FIELD_SPECS: FieldSpec[] = [
  { key: "title_zh", property: "Title ZH", expectedType: "rich_text", build: (i) => ({ rich_text: richText(i.title_zh) }) },
  { key: "title_ar", property: "Title AR", expectedType: "rich_text", build: (i) => ({ rich_text: richText(i.title_ar) }) },
  { key: "summary_en", property: "Summary EN", expectedType: "rich_text", build: (i) => ({ rich_text: richText(i.summary_en) }) },
  { key: "summary_zh", property: "Summary ZH", expectedType: "rich_text", build: (i) => ({ rich_text: richText(i.summary_zh) }) },
  { key: "summary_ar", property: "Summary AR", expectedType: "rich_text", build: (i) => ({ rich_text: richText(i.summary_ar) }) },
  { key: "country", property: "Country", expectedType: "select", build: (i) => ({ select: { name: i.country } }) },
  { key: "date", property: "Date", expectedType: "date", build: (i) => ({ date: { start: i.date } }) },
  { key: "category", property: "Category", expectedType: "select", build: (i) => ({ select: { name: i.category } }) },
  { key: "source_url", property: "Source URL", expectedType: "url", build: (i) => ({ url: i.source_url || null }) },
  { key: "source_name", property: "Source Name", expectedType: "rich_text", build: (i) => ({ rich_text: richText(i.source_name) }) },
  { key: "business_impact", property: "Business Impact", expectedType: "rich_text", build: (i) => ({ rich_text: richText(i.business_impact) }) },
  { key: "gci_recommendation", property: "GCI Recommendation", expectedType: "rich_text", build: (i) => ({ rich_text: richText(i.gci_recommendation) }) },
  { key: "website_content_en", property: "Website Content EN", expectedType: "rich_text", build: (i) => ({ rich_text: richText(i.website_content_en) }) },
  { key: "website_content_zh", property: "Website Content ZH", expectedType: "rich_text", build: (i) => ({ rich_text: richText(i.website_content_zh) }) },
  { key: "__status__", property: "Status", expectedType: "select", build: () => ({ select: { name: "Published" } }) },
  { key: "__published__", property: "Published", expectedType: "checkbox", build: () => ({ checkbox: true }) },
];

function buildNotionProperties(insight: OpenAIInsight, schema: Record<string, NotionPropertyMeta>) {
  const properties: Record<string, any> = {};
  const skippedFields: string[] = [];

  // Title is Notion's mandatory title-type property — find it by type, not by
  // assuming its name is literally "Title" (a database owner could rename it).
  const titleProp = Object.entries(schema).find(([, meta]) => meta.type === "title");
  if (!titleProp) {
    throw new Error("Notion database has no title-type property — cannot create a page");
  }
  properties[titleProp[0]] = { title: richText(insight.title_en) };

  for (const spec of FIELD_SPECS) {
    const meta = schema[spec.property];
    if (!meta) {
      skippedFields.push(`${spec.property} (not found in Notion schema)`);
      continue;
    }
    if (meta.type !== spec.expectedType) {
      skippedFields.push(`${spec.property} (schema type is "${meta.type}", expected "${spec.expectedType}")`);
      continue;
    }
    properties[spec.property] = spec.build(insight);
  }

  return { properties, skippedFields };
}

async function createNotionPage(token: string, insight: OpenAIInsight) {
  const schema = await getDatabaseSchema(token);
  const { properties, skippedFields } = buildNotionProperties(insight, schema);

  if (skippedFields.length > 0) {
    log("Notion fields skipped (missing/mismatched in live schema, database left unmodified):");
    for (const f of skippedFields) log(`  - ${f}`);
  }

  const r = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parent: { database_id: DB_ID },
      properties,
    }),
  });

  if (!r.ok) {
    const errText = await r.text().catch(() => "");
    throw new Error(`Notion page create HTTP ${r.status}: ${errText.slice(0, 800)}`);
  }

  return r.json();
}

// ---------------------------------------------------------------------------
// Daily loop: keep trying candidates, one per country, until 3 are published or
// 8 have been attempted — whichever comes first.
// ---------------------------------------------------------------------------

interface AttemptRecord {
  attempt: number;
  country: string;
  outcome: "published" | "skipped" | "failed";
  title?: string;
  reason?: string;
}

async function runDailyLoop(deps: {
  generate: (target: NextTargetResponse) => Promise<OpenAIInsight>;
  publish: (insight: OpenAIInsight) => Promise<{ id: string; url?: string }>;
}): Promise<{ records: AttemptRecord[]; published: number; attempted: number }> {
  const usedCountries = new Set<string>();
  let titlesSoFar: string[] = [];
  let urlsSoFar: string[] = [];
  let seeded = false;
  const records: AttemptRecord[] = [];
  let published = 0;
  let attempted = 0;

  while (published < MAX_PUBLISHED_PER_RUN && attempted < MAX_ATTEMPTS_PER_RUN) {
    attempted++;

    let target: NextTargetResponse;
    try {
      target = await getNextTarget();
    } catch (err) {
      log(`attempt ${attempted}: intelligence-next-target failed — ${(err as Error).message}`);
      records.push({ attempt: attempted, country: "(unknown)", outcome: "failed", reason: `next-target fetch failed: ${(err as Error).message}` });
      continue;
    }

    // Seed the in-run dedup accumulator once, from the first live response. Every
    // subsequent call also returns fresh existing_titles/existing_source_urls, which
    // get unioned in below — this accumulator only matters when a just-completed
    // write hasn't propagated to that fresh read yet.
    if (!seeded) {
      titlesSoFar = [...target.existing_titles];
      urlsSoFar = [...target.existing_source_urls];
      seeded = true;
    }

    let country = target.target_country;
    if (usedCountries.has(country)) {
      const fallback = pickFallbackCountry(target, usedCountries);
      if (!fallback) {
        log(`attempt ${attempted}: every pool country already used this run — stopping early`);
        attempted--;
        break;
      }
      log(`attempt ${attempted}: next-target returned already-used country "${country}" — overriding to "${fallback}"`);
      country = fallback;
    }
    usedCountries.add(country); // reserved regardless of this attempt's eventual outcome

    const runTarget: NextTargetResponse = {
      ...target,
      target_country: country,
      existing_titles: Array.from(new Set([...target.existing_titles, ...titlesSoFar])),
      existing_source_urls: Array.from(new Set([...target.existing_source_urls, ...urlsSoFar])),
    };

    let insight: OpenAIInsight;
    try {
      insight = await deps.generate(runTarget);
    } catch (err) {
      log(`attempt ${attempted} (${country}): candidate generation failed — ${(err as Error).message}`);
      records.push({ attempt: attempted, country, outcome: "failed", reason: (err as Error).message });
      continue;
    }

    const skipReason = shouldSkip(insight, runTarget);
    if (skipReason) {
      log(`attempt ${attempted} (${country}): skipped — ${skipReason}`);
      records.push({ attempt: attempted, country, outcome: "skipped", reason: skipReason });
      continue;
    }

    try {
      const page = await deps.publish(insight);
      published++;
      titlesSoFar.push(insight.title_en!);
      urlsSoFar.push(insight.source_url!);
      log(`attempt ${attempted} (${country}): published — "${insight.title_en}" (${page.id})`);
      records.push({ attempt: attempted, country, outcome: "published", title: insight.title_en! });
    } catch (err) {
      log(`attempt ${attempted} (${country}): Notion write failed — ${(err as Error).message}`);
      records.push({ attempt: attempted, country, outcome: "failed", reason: `Notion write failed: ${(err as Error).message}` });
    }
  }

  return { records, published, attempted };
}

function buildSummary(records: AttemptRecord[], published: number, attempted: number): string {
  const skipped = records.filter((r) => r.outcome === "skipped").length;
  const failed = records.filter((r) => r.outcome === "failed").length;
  const publishedRecords = records.filter((r) => r.outcome === "published");

  const lines: string[] = [
    "",
    "GCI Insights Daily Run Summary",
    "",
    `attempted: ${attempted}`,
    `published: ${published}`,
    `skipped: ${skipped}`,
    `failed: ${failed}`,
    "",
    "published countries:",
    ...publishedRecords.map((r) => `- ${r.country}`),
    "",
    "published titles:",
    ...publishedRecords.map((r) => `- ${r.title}`),
  ];

  if (published < MAX_PUBLISHED_PER_RUN) {
    lines.push(
      "",
      `target: ${MAX_PUBLISHED_PER_RUN}`,
      `published: ${published}`,
      `reason: no additional qualified candidates within ${MAX_ATTEMPTS_PER_RUN} attempts`
    );
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Entrypoint
// ---------------------------------------------------------------------------

async function main() {
  if (isDryRun) {
    log("DRY RUN — single-candidate preview only (no loop, no OpenAI or Notion calls)");
    const target = await getNextTarget().catch((err) => fail(`intelligence-next-target failed: ${err.message}`));
    log(`target_country=${target.target_country} phase=${target.phase} current_count=${target.current_count}`);
    log(`existing_source_urls: ${target.existing_source_urls.length} entries, existing_titles: ${target.existing_titles.length} entries`);

    const body = buildOpenAIRequestBody(target);
    console.log("\n--- OpenAI request body that would be sent (single candidate preview) ---\n");
    console.log(JSON.stringify(body, null, 2));

    const notionToken = process.env.NOTION_TOKEN;
    if (notionToken) {
      log("\nNOTION_TOKEN present — probing live database schema (read-only)");
      try {
        const schema = await getDatabaseSchema(notionToken);
        const wanted = [
          "Title ZH", "Title AR", "Summary EN", "Summary ZH", "Summary AR", "Country", "Date",
          "Category", "Source URL", "Source Name", "Business Impact", "GCI Recommendation",
          "Website Content EN", "Website Content ZH", "Status", "Published",
        ];
        for (const name of wanted) {
          const meta = schema[name];
          log(`  ${name}: ${meta ? `found (type=${meta.type})` : "MISSING from live schema"}`);
        }
      } catch (err) {
        log(`schema probe failed: ${(err as Error).message}`);
      }
    } else {
      log("NOTION_TOKEN not set — skipping live schema probe (set it to also validate Notion field mapping)");
    }

    log("dry run complete, exiting without calling OpenAI or writing to Notion");
    return;
  }

  if (isSimulate) {
    log("SIMULATE — running the real 8-attempt loop against the live next-target endpoint (read-only); OpenAI + Notion calls are scripted mocks, nothing real is written");

    let counter = 0;
    const script: Array<"publish" | "low_relevance" | "skip_true" | "duplicate" | "error"> = [
      "publish", "low_relevance", "skip_true", "error", "publish", "duplicate", "publish", "low_relevance",
    ];

    const { records, published, attempted } = await runDailyLoop({
      generate: async (target) => {
        const kind = script[counter] ?? "low_relevance";
        counter++;
        if (kind === "error") throw new Error("[simulated] OpenAI timeout after 3 attempts");

        const isSkip = kind === "skip_true";
        const reusedUrl = kind === "duplicate" ? "https://example.com/simulated-1" : `https://example.com/simulated-${counter}`;
        const reusedTitle = kind === "duplicate" ? "[SIMULATED] Insight #1" : `[SIMULATED] Insight #${counter}`;

        return {
          skip: isSkip,
          title_en: isSkip ? null : reusedTitle,
          title_zh: isSkip ? null : `[模拟] 情报 #${counter}`,
          title_ar: isSkip ? null : `[محاكاة] #${counter}`,
          summary_en: isSkip ? null : "Simulated summary for control-flow verification.",
          summary_zh: isSkip ? null : "用于验证控制流程的模拟摘要。",
          summary_ar: isSkip ? null : "ملخص محاكى للتحقق من سير العمل.",
          source_url: isSkip ? null : reusedUrl,
          source_name: isSkip ? null : "Simulated Source",
          category: isSkip ? null : "GCI Insights",
          country: target.target_country,
          business_area: isSkip ? null : "Investment & Business",
          relevance_score: isSkip ? null : kind === "low_relevance" ? 5 : 9,
          is_official_source: isSkip ? null : true,
          date: isSkip ? null : new Date().toISOString().slice(0, 10),
          business_impact: isSkip ? null : "Simulated business impact.",
          gci_recommendation: isSkip ? null : "Simulated recommendation.",
          website_content_en: isSkip ? null : "Simulated website content body in English.",
          website_content_zh: isSkip ? null : "模拟网站正文内容。",
        };
      },
      publish: async (insight) => {
        log(`[simulate] would create Notion page: "${insight.title_en}"`);
        return { id: `simulated-${counter}` };
      },
    });

    console.log(buildSummary(records, published, attempted));
    log("simulate complete — no real OpenAI or Notion calls were made");
    return;
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) fail("OPENAI_API_KEY not set");
  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) fail("NOTION_TOKEN not set");

  log(`starting daily run — target ${MAX_PUBLISHED_PER_RUN} published, max ${MAX_ATTEMPTS_PER_RUN} attempts`);

  const { records, published, attempted } = await runDailyLoop({
    generate: (target) => callOpenAI(openaiKey, target),
    publish: (insight) => createNotionPage(notionToken, insight),
  });

  console.log(buildSummary(records, published, attempted));
}

main().catch((err) => fail(err?.message || String(err)));
