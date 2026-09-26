import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { DailyBriefingItem } from "../src/data/dailyBriefing";
import { selectPublishedBriefing } from "../src/data/dailyBriefing";

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
