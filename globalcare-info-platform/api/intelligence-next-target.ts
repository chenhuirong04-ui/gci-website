import type { VercelRequest, VercelResponse } from "@vercel/node";

const DB_ID = "931a8a5bc40a4e1cb0ce65491fa0ccf5";

const COUNTRY_POOL = [
  "UAE / Dubai",
  "Saudi Arabia",
  "Qatar",
  "Bahrain",
  "Oman",
  "Kuwait",
  "Kenya",
  "Tanzania",
  "Nigeria",
  "Morocco",
  "China",
  "Brazil",
  "Global",
];

// Phase 1: building up sparse countries first
const PHASE1_PRIORITY = [
  "Bahrain", "Oman", "Kuwait", "Tanzania", "Nigeria",
  "Morocco", "China", "Qatar", "Kenya", "Brazil",
  "Global", "UAE / Dubai", "Saudi Arabia",
];

// Phase 2: balanced rotation — GCC + Africa first, then others
const PHASE2_PRIORITY = [
  "UAE / Dubai", "Saudi Arabia", "Qatar", "Bahrain", "Oman",
  "Kuwait", "Kenya", "Tanzania", "Nigeria", "Morocco",
  "China", "Brazil", "Global",
];

const PHASE1_THRESHOLD = 5;

function extractCountry(p: any): string {
  return (
    p.Country?.select?.name ||
    p.Country?.multi_select?.[0]?.name ||
    p.Country?.rich_text?.[0]?.plain_text ||
    "Global"
  ).trim();
}

interface PageSummary {
  country: string;
  sourceUrl: string;
  title: string;
}

async function queryAllPublished(token: string): Promise<PageSummary[]> {
  const pages: PageSummary[] = [];
  let cursor: string | undefined;

  do {
    const body: Record<string, unknown> = {
      filter: { property: "Published", checkbox: { equals: true } },
      sorts: [{ property: "Date", direction: "descending" }],
      page_size: 100,
    };
    if (cursor) body.start_cursor = cursor;

    const r = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await r.json();
    if (!data.results) break;

    for (const page of data.results) {
      const p = page.properties;
      pages.push({
        country: extractCountry(p),
        sourceUrl: p["Source URL"]?.url || "",
        title: p.Title?.title?.[0]?.plain_text || "",
      });
    }

    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return pages;
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const token = process.env.NOTION_TOKEN;
  if (!token) return res.status(500).json({ error: "NOTION_TOKEN not set" });

  try {
    const allPages = await queryAllPublished(token);

    // Build count map — initialize all pool countries to 0
    const counts: Record<string, number> = {};
    for (const c of COUNTRY_POOL) counts[c] = 0;
    for (const { country } of allPages) {
      if (country in counts) counts[country]++;
    }

    const allAboveThreshold = COUNTRY_POOL.every(c => counts[c] >= PHASE1_THRESHOLD);
    const phase = allAboveThreshold ? "balanced_rotation" : "database_building";
    const priority = allAboveThreshold ? PHASE2_PRIORITY : PHASE1_PRIORITY;

    const minCount = Math.min(...COUNTRY_POOL.map(c => counts[c]));
    const target = priority.find(c => counts[c] === minCount) ?? priority[0];

    // Dedup helpers for Make.com — most recent 100 articles, no blanks
    const existing_source_urls = [...new Set(
      allPages.slice(0, 100).map(p => p.sourceUrl).filter(Boolean)
    )];
    const existing_titles = [...new Set(
      allPages.slice(0, 100).map(p => p.title).filter(Boolean)
    )];

    return res.status(200).json({
      target_country: target,
      phase,
      current_count: counts[target],
      counts,
      existing_source_urls,
      existing_titles,
    });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
