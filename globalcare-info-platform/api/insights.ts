import type { VercelRequest, VercelResponse } from "@vercel/node";

const DB_ID = "931a8a5bc40a4e1cb0ce65491fa0ccf5";

function mapCategory(name?: string): string {
  const map: Record<string, string> = {
    "Regulatory Updates": "regulatory",
    "Market News": "market",
    "Trade Notes": "trade",
    "GCI Insights": "gci",
  };
  return (name && map[name]) || "gci";
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const token = process.env.NOTION_TOKEN;
  if (!token) return res.status(200).json([]);

  try {
    const r = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { property: "Published", checkbox: { equals: true } },
        sorts: [{ property: "Date", direction: "descending" }],
        page_size: 50,
      }),
    });

    const data = await r.json();
    if (!data.results) return res.status(200).json([]);

    const articles = data.results.map((page: any) => {
      const p = page.properties;
      const titleEN = p.Title?.title?.[0]?.plain_text || "";
      const summaryEN = p["Summary EN"]?.rich_text?.[0]?.plain_text || "";
      const summaryZH = p["Summary ZH"]?.rich_text?.[0]?.plain_text || summaryEN;
      const countryEN = (
        p.Country?.select?.name ||
        p.Country?.multi_select?.[0]?.name ||
        p.Country?.rich_text?.[0]?.plain_text ||
        "Global"
      ).trim();

      // Optional fields — silently empty if the Notion DB doesn't have them yet
      const titleAR = p["Title AR"]?.rich_text?.[0]?.plain_text || titleEN;
      const summaryAR = p["Summary AR"]?.rich_text?.[0]?.plain_text || summaryEN;
      const sourceUrl = p["Source URL"]?.url || undefined;
      const businessImpact = p["Business Impact"]?.rich_text?.[0]?.plain_text || undefined;
      const gciRecommendation = p["GCI Recommendation"]?.rich_text?.[0]?.plain_text || undefined;
      const content =
        p["Website Content"]?.rich_text?.[0]?.plain_text ||
        p["WeChat Content"]?.rich_text?.[0]?.plain_text ||
        summaryZH ||
        summaryEN ||
        "该市场情报正文正在整理中，请稍后查看。";

      return {
        id: page.id,
        category: mapCategory(p.Category?.select?.name),
        titleEN,
        titleZH: p["Title ZH"]?.rich_text?.[0]?.plain_text || titleEN,
        titleAR,
        countryEN,
        countryZH: countryEN,
        countryAR: countryEN,
        date: p.Date?.date?.start || "",
        summaryEN,
        summaryZH,
        summaryAR,
        coverImage: p["Cover Image URL"]?.url || "",
        ...(sourceUrl && { sourceUrl }),
        ...(businessImpact && { businessImpact }),
        ...(gciRecommendation && { gciRecommendation }),
        content,
      };
    });

    return res.status(200).json(articles);
  } catch {
    return res.status(200).json([]);
  }
}
