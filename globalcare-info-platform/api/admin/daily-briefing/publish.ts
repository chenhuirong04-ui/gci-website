import { timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export interface PublisherItem {
  briefing_date: string;
  title: string;
  country: string;
  sector: string;
  category: string;
  summary: string;
  why_it_matters: string;
  gci_opportunity: string;
  stage: string;
  source_name: string;
  source_url: string;
  sort_order: number;
  is_featured: boolean;
}

interface StoredItem extends PublisherItem {
  id?: string;
  normalized_title: string;
  status: "approved" | "published" | "draft";
  published_at: string | null;
}

interface PublisherDependencies {
  supabaseUrl: string;
  serviceRoleKey: string;
  siteOrigin: string;
  fetchFn?: typeof fetch;
  now?: () => Date;
  today?: string;
}

export interface PublisherResult {
  briefing_date: string;
  approved_count: number;
  published_count: number;
  items_count: number;
  duplicate_check: { ok: true; same_day: "clear" | "idempotent"; recent_7_days: "clear" };
  source_check: { ok: true; checked: number };
  api_check: { ok: true; status: number; items_count: number };
  homepage_check: { ok: true; status: number };
  daily_page_check: { ok: true; status: number };
  idempotent: boolean;
}

export class PublisherError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

const REQUIRED_TEXT_FIELDS: Array<keyof PublisherItem> = [
  "briefing_date", "title", "country", "sector", "category", "summary",
  "why_it_matters", "gci_opportunity", "stage", "source_name", "source_url",
];

export function normalizeTitle(title: string) {
  return title.trim().replace(/\s+/g, " ").toLowerCase();
}

function dubaiDate(now: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dubai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function dateOffset(date: string, days: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}

function validateItems(input: unknown, today: string): PublisherItem[] {
  const items = Array.isArray(input)
    ? input
    : input && typeof input === "object" && Array.isArray((input as { items?: unknown }).items)
      ? (input as { items: unknown[] }).items
      : null;
  if (!items?.length) throw new PublisherError(400, "INVALID_PAYLOAD", "Payload must contain a non-empty items array");

  const validated = items as PublisherItem[];
  const identities = new Set<string>();
  for (const [index, item] of validated.entries()) {
    if (!item || typeof item !== "object") {
      throw new PublisherError(400, "INVALID_ITEM", `Item ${index + 1} must be an object`);
    }
    const missing = REQUIRED_TEXT_FIELDS.filter((field) => typeof item[field] !== "string" || !(item[field] as string).trim());
    if (missing.length) {
      throw new PublisherError(400, "MISSING_FIELDS", `Item ${index + 1} is missing required fields`, missing);
    }
    if (!isValidDate(item.briefing_date) || item.briefing_date !== today) {
      throw new PublisherError(400, "INVALID_DATE", `Item ${index + 1} briefing_date must equal ${today}`);
    }
    if (!Number.isInteger(item.sort_order) || item.sort_order < 1 || typeof item.is_featured !== "boolean") {
      throw new PublisherError(400, "INVALID_ITEM", `Item ${index + 1} has invalid sort_order or is_featured`);
    }
    let source: URL;
    try {
      source = new URL(item.source_url);
    } catch {
      throw new PublisherError(400, "INVALID_SOURCE", `Item ${index + 1} source_url is invalid`);
    }
    if (source.protocol !== "https:") {
      throw new PublisherError(400, "INVALID_SOURCE", `Item ${index + 1} source_url must use HTTPS`);
    }
    const identity = normalizeTitle(item.title);
    if (identities.has(identity)) {
      throw new PublisherError(409, "DUPLICATE_TITLE", `Duplicate title in payload: ${item.title}`);
    }
    identities.add(identity);
  }

  const orders = validated.map((item) => item.sort_order).sort((a, b) => a - b);
  if (orders.some((order, index) => order !== index + 1)) {
    throw new PublisherError(400, "INVALID_SORT_ORDER", "sort_order must be unique and continuous from 1");
  }
  return validated.map((item) => ({
    briefing_date: item.briefing_date,
    title: item.title.trim(),
    country: item.country.trim(),
    sector: item.sector.trim(),
    category: item.category.trim(),
    summary: item.summary.trim(),
    why_it_matters: item.why_it_matters.trim(),
    gci_opportunity: item.gci_opportunity.trim(),
    stage: item.stage.trim(),
    source_name: item.source_name.trim(),
    source_url: item.source_url.trim(),
    sort_order: item.sort_order,
    is_featured: item.is_featured,
  }));
}

function samePublishedContent(existing: StoredItem[], items: PublisherItem[]) {
  if (existing.length !== items.length) return false;
  const byTitle = new Map(existing.map((item) => [item.normalized_title, item]));
  return items.every((item) => {
    const stored = byTitle.get(normalizeTitle(item.title));
    return stored?.status === "published" && (Object.keys(item) as Array<keyof PublisherItem>)
      .every((key) => stored[key] === item[key]);
  });
}

function serviceHeaders(serviceRoleKey: string, extra: Record<string, string> = {}) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    ...extra,
  };
}

async function responseJson<T>(response: Response, action: string): Promise<T> {
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new PublisherError(502, "SUPABASE_ERROR", `${action} failed with HTTP ${response.status}`, detail.slice(0, 300));
  }
  return response.json() as Promise<T>;
}

async function loadRows(
  fetchFn: typeof fetch,
  supabaseUrl: string,
  serviceRoleKey: string,
  query: URLSearchParams,
) {
  const response = await fetchFn(`${supabaseUrl}/rest/v1/gci_daily_briefing?${query}`, {
    headers: serviceHeaders(serviceRoleKey),
  });
  return responseJson<StoredItem[]>(response, "Daily briefing lookup");
}

async function checkPage(fetchFn: typeof fetch, url: string, label: string) {
  const response = await fetchFn(url, { headers: { "Cache-Control": "no-cache" } });
  if (!response.ok) throw new PublisherError(502, "SELF_CHECK_FAILED", `${label} returned HTTP ${response.status}`);
  return response.status;
}

async function verifyPublicSurfaces(
  fetchFn: typeof fetch,
  siteOrigin: string,
  date: string,
  expectedTitles: Set<string>,
) {
  const nonce = Date.now().toString(36);
  const apiResponse = await fetchFn(`${siteOrigin}/api/daily-briefing?date=${date}&publisher_check=${nonce}`, {
    headers: { "Cache-Control": "no-cache" },
  });
  if (!apiResponse.ok) throw new PublisherError(502, "SELF_CHECK_FAILED", `Daily briefing API returned HTTP ${apiResponse.status}`);
  const api = await apiResponse.json() as { briefing_date?: string; items?: Array<{ title?: string; status?: string }> };
  const apiTitles = new Set((api.items ?? []).map((item) => normalizeTitle(item.title ?? "")));
  if (api.briefing_date !== date || apiTitles.size !== expectedTitles.size || [...expectedTitles].some((title) => !apiTitles.has(title))) {
    throw new PublisherError(502, "SELF_CHECK_FAILED", "Daily briefing API did not return the newly published set");
  }
  const homepageStatus = await checkPage(fetchFn, `${siteOrigin}/?publisher_check=${nonce}`, "Homepage");
  const dailyStatus = await checkPage(fetchFn, `${siteOrigin}/intelligence/daily?date=${date}&publisher_check=${nonce}`, "Daily page");
  return {
    api_check: { ok: true as const, status: apiResponse.status, items_count: apiTitles.size },
    homepage_check: { ok: true as const, status: homepageStatus },
    daily_page_check: { ok: true as const, status: dailyStatus },
  };
}

export async function publishDailyBriefing(input: unknown, dependencies: PublisherDependencies): Promise<PublisherResult> {
  const fetchFn = dependencies.fetchFn ?? fetch;
  const now = dependencies.now?.() ?? new Date();
  const today = dependencies.today ?? dubaiDate(now);
  const supabaseUrl = dependencies.supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  const siteOrigin = dependencies.siteOrigin.replace(/\/$/, "");
  if (!supabaseUrl || !dependencies.serviceRoleKey || !siteOrigin) {
    throw new PublisherError(503, "NOT_CONFIGURED", "Publisher dependencies are not configured");
  }

  const items = validateItems(input, today);
  const date = items[0].briefing_date;
  if (items.some((item) => item.briefing_date !== date)) {
    throw new PublisherError(400, "MIXED_DATES", "All items must use the same briefing_date");
  }
  const expectedTitles = new Set(items.map((item) => normalizeTitle(item.title)));
  const select = "id,briefing_date,title,normalized_title,country,sector,category,summary,why_it_matters,gci_opportunity,stage,source_name,source_url,sort_order,is_featured,status,published_at";
  const sameDay = await loadRows(fetchFn, supabaseUrl, dependencies.serviceRoleKey, new URLSearchParams({
    select,
    briefing_date: `eq.${date}`,
    order: "sort_order.asc",
  }));

  if (samePublishedContent(sameDay, items)) {
    const checks = await verifyPublicSurfaces(fetchFn, siteOrigin, date, expectedTitles);
    return {
      briefing_date: date,
      approved_count: 0,
      published_count: items.length,
      items_count: items.length,
      duplicate_check: { ok: true, same_day: "idempotent", recent_7_days: "clear" },
      source_check: { ok: true, checked: items.length },
      ...checks,
      idempotent: true,
    };
  }
  if (sameDay.some((item) => item.status === "published")) {
    throw new PublisherError(409, "PUBLISHED_CONFLICT", "Published content for this date is immutable");
  }
  const sameDayTitles = new Set(sameDay.map((item) => item.normalized_title));
  if (sameDay.length && (sameDay.length !== items.length || [...expectedTitles].some((title) => !sameDayTitles.has(title)))) {
    throw new PublisherError(409, "SAME_DAY_CONFLICT", "The date already contains a different briefing set");
  }

  const recent = await loadRows(fetchFn, supabaseUrl, dependencies.serviceRoleKey, new URLSearchParams({
    select: "briefing_date,title,normalized_title,status",
    briefing_date: `gte.${dateOffset(date, -7)}`,
    and: `(briefing_date.lt.${date})`,
  }));
  const recentDuplicate = recent.find((item) => expectedTitles.has(item.normalized_title));
  if (recentDuplicate) {
    throw new PublisherError(409, "RECENT_DUPLICATE", `Title already appeared within 7 days: ${recentDuplicate.title}`);
  }

  const approvedPayload = items.map((item) => ({ ...item, status: "approved", published_at: null }));
  const approvedResponse = await fetchFn(
    `${supabaseUrl}/rest/v1/gci_daily_briefing?on_conflict=briefing_date,normalized_title`,
    {
      method: "POST",
      headers: serviceHeaders(dependencies.serviceRoleKey, {
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      }),
      body: JSON.stringify(approvedPayload),
    },
  );
  const approved = await responseJson<StoredItem[]>(approvedResponse, "Approved write");
  if (approved.length !== items.length) throw new PublisherError(502, "SELF_CHECK_FAILED", "Approved count mismatch");

  const prePublish = await loadRows(fetchFn, supabaseUrl, dependencies.serviceRoleKey, new URLSearchParams({
    select,
    briefing_date: `eq.${date}`,
    order: "sort_order.asc",
  }));
  const preTitles = new Set(prePublish.map((item) => item.normalized_title));
  if (prePublish.length !== items.length || prePublish.some((item) => item.status !== "approved") || [...expectedTitles].some((title) => !preTitles.has(title))) {
    throw new PublisherError(502, "SELF_CHECK_FAILED", "Approved dataset failed pre-publish verification");
  }

  await checkPage(fetchFn, `${siteOrigin}/`, "Homepage");
  await checkPage(fetchFn, `${siteOrigin}/intelligence/daily?date=${date}`, "Daily page");

  const publishedAt = now.toISOString();
  let published: StoredItem[] = [];
  try {
    const publishResponse = await fetchFn(
      `${supabaseUrl}/rest/v1/gci_daily_briefing?briefing_date=eq.${date}&status=eq.approved`,
      {
        method: "PATCH",
        headers: serviceHeaders(dependencies.serviceRoleKey, {
          "Content-Type": "application/json",
          Prefer: "return=representation",
        }),
        body: JSON.stringify({ status: "published", published_at: publishedAt }),
      },
    );
    published = await responseJson<StoredItem[]>(publishResponse, "Publish transition");
    if (published.length !== items.length) {
      throw new PublisherError(502, "SELF_CHECK_FAILED", "Published count mismatch");
    }
    const checks = await verifyPublicSurfaces(fetchFn, siteOrigin, date, expectedTitles);
    return {
      briefing_date: date,
      approved_count: approved.length,
      published_count: published.length,
      items_count: items.length,
      duplicate_check: { ok: true, same_day: "clear", recent_7_days: "clear" },
      source_check: { ok: true, checked: items.length },
      ...checks,
      idempotent: false,
    };
  } catch (error) {
    const rollback = await fetchFn(
      `${supabaseUrl}/rest/v1/gci_daily_briefing?briefing_date=eq.${date}&status=eq.published&published_at=eq.${encodeURIComponent(publishedAt)}`,
      {
        method: "PATCH",
        headers: serviceHeaders(dependencies.serviceRoleKey, { "Content-Type": "application/json" }),
        body: JSON.stringify({ status: "approved", published_at: null }),
      },
    ).catch(() => null);
    if (!rollback?.ok) {
      throw new PublisherError(500, "ROLLBACK_FAILED", "Publish self-check failed and automatic rollback could not be confirmed");
    }
    throw error;
  }
}

export function validToken(provided: string | undefined, expected: string | undefined) {
  if (!provided || !expected) return false;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}

function bearerToken(req: VercelRequest) {
  const authorization = typeof req.headers.authorization === "string" ? req.headers.authorization : "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1];
}

function requestOrigin(req: VercelRequest) {
  const hostHeader = req.headers["x-forwarded-host"] ?? req.headers.host;
  const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;
  const protoHeader = req.headers["x-forwarded-proto"];
  const proto = (Array.isArray(protoHeader) ? protoHeader[0] : protoHeader) || "https";
  return host ? `${proto}://${host}` : "https://www.globalcareinfo.com";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!validToken(bearerToken(req), process.env.GCI_DAILY_BRIEFING_PUBLISH_TOKEN)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ error: "Publisher data source is not configured" });
  }

  try {
    const result = await publishDailyBriefing(req.body, {
      supabaseUrl,
      serviceRoleKey,
      siteOrigin: requestOrigin(req),
    });
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(result);
  } catch (error) {
    const publisherError = error instanceof PublisherError
      ? error
      : new PublisherError(500, "PUBLISH_FAILED", error instanceof Error ? error.message : "Unknown publisher error");
    return res.status(publisherError.status).json({
      error: publisherError.code,
      message: publisherError.message,
      details: publisherError.details,
    });
  }
}
