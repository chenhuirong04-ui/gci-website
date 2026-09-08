// One-time migration: Notion "GCI Website — Insights" database -> Supabase public.gci_insights.
//
// Not part of daily automation — run manually, once, then this file can stay in the repo as a
// historical record. Safe to re-run: existing rows are detected (by source_url when present, by
// title_fingerprint otherwise/always) and skipped rather than duplicated or overwritten.
//
// No AI calls, no field backfill. Whatever Notion doesn't have becomes NULL in Supabase — this
// script never invents content. Notion itself is never written to.
//
// Usage:
//   npx tsx scripts/gci-insights/migrate-notion-to-supabase.ts --dry-run
//   npx tsx scripts/gci-insights/migrate-notion-to-supabase.ts
//
// Requires a globalcare-info-platform/.env file (gitignored) with:
//   NOTION_TOKEN=...
//   SUPABASE_URL=...
//   SUPABASE_SERVICE_ROLE_KEY=...

import "dotenv/config";

const NOTION_DB_ID = "931a8a5bc40a4e1cb0ce65491fa0ccf5"; // same "GCI Website — Insights" DB as api/insights.ts
const NOTION_VERSION = "2022-06-28";

const NOTION_TOKEN = process.env.NOTION_TOKEN || "";
// Accept either the bare project origin or a URL that already includes /rest/v1 —
// normalize to the bare origin so ${SUPABASE_URL}/rest/v1/... below never double-appends.
const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const isDryRun = process.argv.includes("--dry-run");

function log(...args: unknown[]) {
  console.log(`[migrate ${new Date().toISOString()}]`, ...args);
}

function fail(message: string): never {
  console.error(`[migrate] FATAL: ${message}`);
  process.exit(1);
}

// Mirrors public.normalize_title() in the Supabase migration exactly — used here only to
// pre-check collisions client-side for reporting; the database's generated column + unique
// constraint is the actual source of truth.
function normalizeTitle(t: string): string {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// Notion read (read-only — nothing here ever writes back to Notion)
// ---------------------------------------------------------------------------

interface NotionInsight {
  title_en: string;
  title_zh: string | null;
  title_ar: string | null;
  summary_en: string | null;
  summary_zh: string | null;
  summary_ar: string | null;
  website_content_en: string | null;
  website_content_zh: string | null;
  country: string;
  category: string;
  source_url: string | null;
  source_name: string | null;
  source_date: string | null;
  business_impact: string | null;
  gci_recommendation: string | null;
  published_at: string;
  created_at: string;
  updated_at: string;
}

function richText(prop: any): string | null {
  const t = prop?.rich_text?.[0]?.plain_text;
  return t && t.length > 0 ? t : null;
}

function extractCountry(p: any): string {
  return (
    p.Country?.select?.name ||
    p.Country?.multi_select?.[0]?.name ||
    p.Country?.rich_text?.[0]?.plain_text ||
    "Global"
  ).trim();
}

async function queryAllPublishedNotionPages(): Promise<any[]> {
  const pages: any[] = [];
  let cursor: string | undefined;

  do {
    const body: Record<string, unknown> = {
      filter: { property: "Published", checkbox: { equals: true } },
      page_size: 100,
    };
    if (cursor) body.start_cursor = cursor;

    const r = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const errText = await r.text().catch(() => "");
      throw new Error(`Notion query failed: HTTP ${r.status} ${errText.slice(0, 300)}`);
    }
    const data = await r.json();
    pages.push(...(data.results || []));
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return pages;
}

function mapNotionPage(page: any): NotionInsight {
  const p = page.properties;
  return {
    title_en: p.Title?.title?.[0]?.plain_text || "",
    title_zh: richText(p["Title ZH"]),
    title_ar: richText(p["Title AR"]),
    summary_en: richText(p["Summary EN"]),
    summary_zh: richText(p["Summary ZH"]),
    summary_ar: richText(p["Summary AR"]),
    website_content_en: richText(p["Website Content EN"]),
    // Fallback chain matches the site's current live-read behavior in api/insights.ts — this
    // picks whichever real historical field already holds the content, it does not invent any.
    website_content_zh: richText(p["Website Content ZH"]) || richText(p["Website Content"]) || richText(p["WeChat Content"]),
    country: extractCountry(p),
    category: p.Category?.select?.name || "GCI Insights",
    source_url: p["Source URL"]?.url || null,
    source_name: richText(p["Source Name"]) || p["Source Name"]?.title?.[0]?.plain_text || null,
    source_date: p.Date?.date?.start || null,
    business_impact: richText(p["Business Impact"]),
    gci_recommendation: richText(p["GCI Recommendation"]),
    published_at: page.created_time,
    created_at: page.created_time,
    updated_at: page.last_edited_time,
  };
}

// ---------------------------------------------------------------------------
// Supabase read/write (PostgREST, raw fetch — matches this codebase's no-SDK style)
// ---------------------------------------------------------------------------

async function fetchExistingKeys(): Promise<{ urls: Set<string>; fingerprints: Set<string> }> {
  const urls = new Set<string>();
  const fingerprints = new Set<string>();
  const pageSize = 1000;
  let offset = 0;

  while (true) {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/gci_insights?select=source_url,title_fingerprint&limit=${pageSize}&offset=${offset}`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    );
    if (!r.ok) throw new Error(`Supabase existing-keys query failed: HTTP ${r.status}`);
    const rows: Array<{ source_url: string | null; title_fingerprint: string | null }> = await r.json();
    for (const row of rows) {
      if (row.source_url) urls.add(row.source_url);
      if (row.title_fingerprint) fingerprints.add(row.title_fingerprint);
    }
    if (rows.length < pageSize) break;
    offset += pageSize;
  }

  return { urls, fingerprints };
}

async function insertRow(insight: NotionInsight): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/gci_insights`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      title_en: insight.title_en,
      title_zh: insight.title_zh,
      title_ar: insight.title_ar,
      summary_en: insight.summary_en,
      summary_zh: insight.summary_zh,
      summary_ar: insight.summary_ar,
      website_content_en: insight.website_content_en,
      website_content_zh: insight.website_content_zh,
      country: insight.country,
      category: insight.category,
      business_area: null,
      source_url: insight.source_url,
      source_name: insight.source_name,
      source_date: insight.source_date,
      business_impact: insight.business_impact,
      gci_recommendation: insight.gci_recommendation,
      relevance_score: null,
      is_official_source: null,
      status: "Published",
      published: true,
      published_at: insight.published_at,
      created_at: insight.created_at,
      updated_at: insight.updated_at,
    }),
  });

  if (!r.ok) {
    const errText = await r.text().catch(() => "");
    return { ok: false, error: `HTTP ${r.status} ${errText.slice(0, 300)}` };
  }
  const rows = await r.json();
  return { ok: true, id: rows?.[0]?.id ?? "(unknown id)" };
}

async function getFinalCount(): Promise<number> {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/gci_insights?select=id`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: "count=exact",
      Range: "0-0",
    },
  });
  const contentRange = r.headers.get("content-range"); // e.g. "0-0/42"
  const total = contentRange?.split("/")[1];
  return total ? parseInt(total, 10) : NaN;
}

async function fetchSampleRows(limit: number): Promise<any[]> {
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/gci_insights?select=title_en,country,category,source_date,source_url,published_at&order=published_at.desc&limit=${limit}`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  );
  if (!r.ok) return [];
  return r.json();
}

// ---------------------------------------------------------------------------
// Entrypoint
// ---------------------------------------------------------------------------

async function main() {
  if (!NOTION_TOKEN) fail("NOTION_TOKEN not set (expected in globalcare-info-platform/.env)");
  if (!SUPABASE_URL) fail("SUPABASE_URL not set (expected in globalcare-info-platform/.env)");
  if (!SUPABASE_SERVICE_ROLE_KEY) fail("SUPABASE_SERVICE_ROLE_KEY not set (expected in globalcare-info-platform/.env)");

  log(isDryRun ? "DRY RUN — reading Notion + Supabase only, no writes" : "starting real migration");

  const notionPages = await queryAllPublishedNotionPages();
  const notionInsights = notionPages.map(mapNotionPage);
  const withUrl = notionInsights.filter((i) => i.source_url);
  const withoutUrl = notionInsights.filter((i) => !i.source_url);

  log(`Notion Published total: ${notionInsights.length}`);
  log(`  with Source URL: ${withUrl.length}`);
  log(`  without Source URL: ${withoutUrl.length}`);

  const { urls: existingUrls, fingerprints: existingFingerprints } = await fetchExistingKeys();
  log(`Supabase existing rows: source_url keys=${existingUrls.size}, title_fingerprint keys=${existingFingerprints.size}`);

  let wouldInsert = 0;
  let dupUrlCount = 0;
  let collisionCount = 0;
  const collisionTitles: string[] = [];
  let inserted = 0;
  let errorCount = 0;
  const errors: string[] = [];

  const seenUrlsThisRun = new Set(existingUrls);
  const seenFingerprintsThisRun = new Set(existingFingerprints);

  for (const insight of notionInsights) {
    const fingerprint = normalizeTitle(insight.title_en);

    if (insight.source_url && seenUrlsThisRun.has(insight.source_url)) {
      dupUrlCount++;
      continue;
    }
    if (seenFingerprintsThisRun.has(fingerprint)) {
      collisionCount++;
      collisionTitles.push(insight.title_en);
      continue;
    }

    wouldInsert++;
    if (isDryRun) {
      seenFingerprintsThisRun.add(fingerprint);
      if (insight.source_url) seenUrlsThisRun.add(insight.source_url);
      continue;
    }

    const result = await insertRow(insight);
    if (result.ok === true) {
      inserted++;
      seenFingerprintsThisRun.add(fingerprint);
      if (insight.source_url) seenUrlsThisRun.add(insight.source_url);
    } else {
      errorCount++;
      errors.push(`"${insight.title_en}" — ${result.error}`);
      log(`insert failed for "${insight.title_en}": ${result.error}`);
    }
  }

  console.log("");
  console.log(isDryRun ? "--- DRY RUN SUMMARY ---" : "--- MIGRATION SUMMARY ---");
  console.log(`Notion Published total: ${notionInsights.length}`);
  console.log(`  with Source URL: ${withUrl.length}`);
  console.log(`  without Source URL: ${withoutUrl.length}`);
  console.log(`would-insert / inserted: ${isDryRun ? wouldInsert : inserted}`);
  console.log(`source_url duplicates skipped: ${dupUrlCount}`);
  console.log(`title_fingerprint collisions skipped: ${collisionCount}`);
  if (collisionTitles.length > 0) {
    console.log("collision titles:");
    for (const t of collisionTitles) console.log(`  - ${t}`);
  }
  if (!isDryRun) {
    console.log(`errors: ${errorCount}`);
    if (errors.length > 0) {
      console.log("error details:");
      for (const e of errors) console.log(`  - ${e}`);
    }
    const finalCount = await getFinalCount();
    console.log(`Supabase final total row count: ${Number.isNaN(finalCount) ? "(could not read count)" : finalCount}`);

    const sample = await fetchSampleRows(10);
    console.log("\nsample rows for spot-check (most recent 10 by published_at):");
    for (const row of sample) {
      console.log(
        `  - title="${row.title_en}" country="${row.country}" category="${row.category}" source_date=${row.source_date} source_url=${row.source_url} published_at=${row.published_at}`
      );
    }
  }
}

main().catch((err) => fail(err?.message || String(err)));
