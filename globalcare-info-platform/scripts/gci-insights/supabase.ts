// Shared Supabase (PostgREST) helper for the GCI Insights automation.
//
// Raw fetch against PostgREST, no SDK — matches this codebase's existing style (every
// api/*.ts file uses plain fetch, no client libraries). Only the service_role key is ever
// used here (server-side only); this file is never imported by anything the browser loads.

const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function assertConfigured() {
  if (!SUPABASE_URL) throw new Error("SUPABASE_URL not set");
  if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY not set");
}

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    ...extra,
  };
}

// Mirrors public.normalize_title() in the Supabase migration exactly.
export function normalizeTitle(t: string): string {
  return t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export interface GciInsightInsert {
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
  business_area: string | null;
  source_url: string | null;
  source_name: string | null;
  source_date: string | null;
  business_impact: string | null;
  gci_recommendation: string | null;
  relevance_score: number | null;
  is_official_source: boolean | null;
}

export type InsertResult =
  | { ok: true; id: string }
  | { ok: false; duplicate: true }
  | { ok: false; duplicate: false; error: string };

/** Counts published rows per country, for the ones in `countryPool` (others ignored). */
export async function getCountryCounts(countryPool: string[]): Promise<Record<string, number>> {
  assertConfigured();
  const counts: Record<string, number> = {};
  for (const c of countryPool) counts[c] = 0;

  const pageSize = 1000;
  let offset = 0;
  while (true) {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/gci_insights?select=country&published=eq.true&limit=${pageSize}&offset=${offset}`,
      { headers: authHeaders() }
    );
    if (!r.ok) throw new Error(`Supabase country-count query failed: HTTP ${r.status}`);
    const rows: Array<{ country: string }> = await r.json();
    for (const row of rows) {
      if (row.country in counts) counts[row.country]++;
    }
    if (rows.length < pageSize) break;
    offset += pageSize;
  }
  return counts;
}

/** Most recent `limit` published rows' titles + source URLs, for the prompt's small dedup hint window. */
export async function getRecentDedupWindow(limit: number): Promise<{ titles: string[]; urls: string[] }> {
  assertConfigured();
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/gci_insights?select=title_en,source_url&published=eq.true&order=published_at.desc&limit=${limit}`,
    { headers: authHeaders() }
  );
  if (!r.ok) throw new Error(`Supabase recent-window query failed: HTTP ${r.status}`);
  const rows: Array<{ title_en: string; source_url: string | null }> = await r.json();
  return {
    titles: rows.map((row) => row.title_en).filter(Boolean),
    urls: rows.map((row) => row.source_url).filter((u): u is string => Boolean(u)),
  };
}

/**
 * Inserts one row. The database's UNIQUE constraints (source_url, title_fingerprint) are the
 * real source of truth for dedup — a 409/unique_violation here is reported back as a normal
 * "duplicate" outcome, not an exception, so the caller can log-and-skip without failing the run.
 */
export async function insertInsight(row: GciInsightInsert): Promise<InsertResult> {
  assertConfigured();
  const r = await fetch(`${SUPABASE_URL}/rest/v1/gci_insights`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json", Prefer: "return=representation" }),
    body: JSON.stringify({
      ...row,
      status: "Published",
      published: true,
      // published_at intentionally omitted — defaults to now() at the moment of the real insert
    }),
  });

  if (r.status === 409) {
    return { ok: false, duplicate: true };
  }
  if (!r.ok) {
    const errText = await r.text().catch(() => "");
    return { ok: false, duplicate: false, error: `HTTP ${r.status} ${errText.slice(0, 300)}` };
  }
  const rows = await r.json();
  return { ok: true, id: rows?.[0]?.id ?? "(unknown id)" };
}
