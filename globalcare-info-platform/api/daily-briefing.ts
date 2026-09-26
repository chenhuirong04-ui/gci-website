import type { VercelRequest, VercelResponse } from "@vercel/node";

interface DailyBriefingItem {
  id: string;
  briefing_date: string;
  title: string;
  country: string | null;
  sector: string | null;
  category: string | null;
  summary: string | null;
  why_it_matters: string | null;
  gci_opportunity: string | null;
  stage: string | null;
  source_name: string | null;
  source_url: string | null;
  image_url: string | null;
  sort_order: number | null;
  is_featured: boolean;
  status: "draft" | "approved" | "published";
  published_at: string | null;
}

function selectPublishedBriefing(rows: DailyBriefingItem[], today: string, requestedDate?: string) {
  const available_dates = [...new Set(rows.map((item) => item.briefing_date))].sort().reverse();
  const briefing_date = requestedDate && available_dates.includes(requestedDate)
    ? requestedDate
    : available_dates.includes(today)
      ? today
      : available_dates[0] ?? null;
  const items = briefing_date
    ? rows
      .filter((item) => item.briefing_date === briefing_date)
      .sort((a, b) => (a.sort_order ?? Number.MAX_SAFE_INTEGER) - (b.sort_order ?? Number.MAX_SAFE_INTEGER) || a.title.localeCompare(b.title))
    : [];
  const published_at = items.reduce<string | null>((latest, item) => {
    if (!item.published_at) return latest;
    return !latest || item.published_at > latest ? item.published_at : latest;
  }, null);
  return { briefing_date, published_at, available_dates, items };
}

const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || "";

function dubaiDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dubai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    return res.status(503).json({ error: "Daily briefing data source is not configured" });
  }

  const requestedDate = typeof req.query.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(req.query.date)
    ? req.query.date
    : undefined;

  try {
    const fields = [
      "id", "briefing_date", "title", "country", "sector", "category", "summary",
      "why_it_matters", "gci_opportunity", "stage", "source_name", "source_url",
      "image_url", "sort_order", "is_featured", "status", "published_at", "created_at", "updated_at",
    ].join(",");
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/gci_daily_briefing?select=${fields}&status=eq.published&order=briefing_date.desc,sort_order.asc,created_at.asc&limit=500`,
      {
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        },
      },
    );
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(`[api/daily-briefing] Supabase HTTP ${response.status}: ${detail.slice(0, 200)}`);
      return res.status(502).json({ error: "Daily briefing data is temporarily unavailable" });
    }
    const rows = await response.json() as DailyBriefingItem[];
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(selectPublishedBriefing(rows, dubaiDate(), requestedDate));
  } catch (error) {
    console.error("[api/daily-briefing] unexpected error", error instanceof Error ? error.message : String(error));
    return res.status(502).json({ error: "Daily briefing data is temporarily unavailable" });
  }
}
