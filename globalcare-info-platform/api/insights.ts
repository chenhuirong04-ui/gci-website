import type { VercelRequest, VercelResponse } from "@vercel/node";

// This route only ever reads published=true rows, which the public-read RLS policy already
// allows for anon/authenticated — so it uses the publishable key, not service_role. The
// service_role key is reserved for the GitHub Actions generator's writes and never touches
// this codepath. Still server-side only (Vercel function env), never a VITE_* var.
const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || "";

function mapCategory(name?: string | null): string {
  const map: Record<string, string> = {
    "Regulatory Updates": "regulatory",
    "Market News": "market",
    "Trade Notes": "trade",
    "GCI Insights": "gci",
  };
  return (name && map[name]) || "gci";
}

interface GciInsightRow {
  id: string;
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
}

const SELECT_FIELDS = [
  "id", "title_en", "title_zh", "title_ar",
  "summary_en", "summary_zh", "summary_ar",
  "website_content_en", "website_content_zh",
  "country", "category",
  "source_url", "source_name", "source_date",
  "business_impact", "gci_recommendation",
  "published_at",
].join(",");

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    console.error("[api/insights] SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY not set");
    return res.status(200).json([]);
  }

  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/gci_insights?select=${SELECT_FIELDS}&published=eq.true&order=published_at.desc&limit=1000`,
      {
        headers: {
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        },
      }
    );

    if (!r.ok) {
      // Log status + a short, secret-free error body only — never the request URL/headers.
      const errText = await r.text().catch(() => "");
      console.error(`[api/insights] Supabase query failed: HTTP ${r.status} ${errText.slice(0, 300)}`);
      return res.status(200).json([]);
    }

    const rows: GciInsightRow[] = await r.json();

    const articles = rows.map((row) => {
      const titleEN = row.title_en || "";
      const summaryEN = row.summary_en || "";
      const summaryZH = row.summary_zh || summaryEN;
      const summaryAR = row.summary_ar || summaryEN;
      const countryEN = (row.country || "Global").trim();

      const titleZH = row.title_zh || titleEN;
      const titleAR = row.title_ar || titleEN;

      // Historical rows can have NULL long-form content — fall back to the summary rather
      // than writing placeholder text anywhere (never persisted, computed only at serve time).
      const contentEN = row.website_content_en || summaryEN;
      const contentZH = row.website_content_zh || summaryZH || summaryEN;

      const sourceDate = row.source_date || "";
      const publishedAt = row.published_at || "";
      const sortAt = publishedAt || sourceDate;

      return {
        id: row.id,
        category: mapCategory(row.category),
        titleEN,
        titleZH,
        titleAR,
        countryEN,
        countryZH: countryEN,
        countryAR: countryEN,
        date: sourceDate,
        sourceDate,
        publishedAt,
        sortAt,
        summaryEN,
        summaryZH,
        summaryAR,
        // No cover_image column in Supabase — RegulatoryUpdates.tsx's resolveArticleImg()
        // always prefers its own COUNTRY_COVER_MAP[countryEN] first (covers every pool
        // country including "Global"), so this is never actually rendered.
        coverImage: "",
        ...(row.source_url && { sourceUrl: row.source_url }),
        ...(row.source_name && { sourceName: row.source_name }),
        ...(row.business_impact && { businessImpact: row.business_impact }),
        ...(row.gci_recommendation && { gciRecommendation: row.gci_recommendation }),
        contentEN,
        contentZH,
      };
    });

    return res.status(200).json(articles);
  } catch (err) {
    console.error("[api/insights] unexpected error:", err instanceof Error ? err.message : String(err));
    return res.status(200).json([]);
  }
}
