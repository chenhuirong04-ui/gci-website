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
      const countryEN = p.Country?.select?.name || "Global";
      return {
        id: page.id,
        category: mapCategory(p.Category?.select?.name),
        titleEN,
        titleZH: p["Title ZH"]?.rich_text?.[0]?.plain_text || titleEN,
        titleAR: titleEN,
        countryEN,
        countryZH: countryEN,
        countryAR: countryEN,
        date: p.Date?.date?.start || "",
        summaryEN,
        summaryZH,
        summaryAR: summaryEN,
        coverImage: p["Cover Image URL"]?.url || "",
      };
    });

    return res.status(200).json(articles);
  } catch {
    return res.status(200).json([]);
  }
}
