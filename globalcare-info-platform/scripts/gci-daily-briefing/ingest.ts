// Explicit human-gated ingest for confirmed GCI Daily Briefing JSON.
// Draft/approved rows may be ingested normally. Published rows require --publish-confirmed.
import "dotenv/config";
import { readFile } from "node:fs/promises";
import {
  DailyBriefingItem,
  BriefingStatus,
  normalizeBriefingTitle,
  validateBriefingItem,
} from "../../src/data/dailyBriefing";

const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const publishConfirmed = process.argv.includes("--publish-confirmed");
const inputPath = process.argv.find((arg) => !arg.startsWith("--") && arg.endsWith(".json"));
const rank: Record<BriefingStatus, number> = { draft: 0, approved: 1, published: 2 };

function buildPayload(
  item: Partial<DailyBriefingItem>,
  status: BriefingStatus,
  publishedAt: string | null,
) {
  return {
    briefing_date: item.briefing_date,
    title: item.title?.trim(),
    country: item.country ?? null,
    sector: item.sector ?? null,
    category: item.category ?? null,
    summary: item.summary ?? null,
    why_it_matters: item.why_it_matters ?? null,
    gci_opportunity: item.gci_opportunity ?? null,
    stage: item.stage ?? null,
    source_name: item.source_name ?? null,
    source_url: item.source_url ?? null,
    image_url: item.image_url ?? null,
    sort_order: item.sort_order ?? null,
    is_featured: item.is_featured ?? false,
    status,
    published_at: publishedAt,
  };
}

function fail(message: string): never {
  console.error(`[gci-daily-briefing] ${message}`);
  process.exit(1);
}

function headers(extra: Record<string, string> = {}) {
  return { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, ...extra };
}

async function existingItem(date: string, normalizedTitle: string): Promise<DailyBriefingItem | null> {
  const query = new URLSearchParams({
    select: "*",
    briefing_date: `eq.${date}`,
    normalized_title: `eq.${normalizedTitle}`,
    limit: "1",
  });
  const response = await fetch(`${SUPABASE_URL}/rest/v1/gci_daily_briefing?${query}`, { headers: headers() });
  if (!response.ok) throw new Error(`lookup failed: HTTP ${response.status}`);
  const rows = await response.json() as DailyBriefingItem[];
  return rows[0] ?? null;
}

async function upsert(item: Partial<DailyBriefingItem>) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/gci_daily_briefing?on_conflict=briefing_date,normalized_title`,
    {
      method: "POST",
      headers: headers({
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      }),
      body: JSON.stringify(item),
    },
  );
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`upsert failed: HTTP ${response.status} ${detail.slice(0, 200)}`);
  }
}

async function main() {
  if (!inputPath) fail("Usage: ingest.ts briefing.json [--publish-confirmed]");
  if (!SUPABASE_URL || !SERVICE_KEY) fail("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  const input = JSON.parse(await readFile(inputPath, "utf8")) as Array<Partial<DailyBriefingItem>>;
  if (!Array.isArray(input) || input.length === 0) fail("Input must be a non-empty JSON array");

  const seen = new Set<string>();
  for (const [index, item] of input.entries()) {
    const status = item.status ?? "draft";
    const errors = validateBriefingItem(item, status === "published");
    if (errors.length) fail(`item ${index + 1} missing/invalid: ${errors.join(", ")}`);
    if (status === "published" && !publishConfirmed) {
      fail("Published rows require the explicit --publish-confirmed flag");
    }
    const identity = `${item.briefing_date}|${normalizeBriefingTitle(item.title!)}`;
    if (seen.has(identity)) fail(`duplicate item in input: ${identity}`);
    seen.add(identity);
  }

  let written = 0;
  for (const item of input) {
    const status = item.status ?? "draft";
    const existing = await existingItem(item.briefing_date!, normalizeBriefingTitle(item.title!));
    if (existing && rank[status] < rank[existing.status]) {
      fail(`refusing status downgrade for ${item.briefing_date} / ${item.title}`);
    }
    const published_at = status === "published"
      ? existing?.published_at ?? new Date().toISOString()
      : null;
    const payload = buildPayload(item, status, published_at);
    await upsert(payload);
    written++;
  }
  console.log(`[gci-daily-briefing] upserted=${written} total=${input.length}`);
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)));
