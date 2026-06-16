import type { VercelRequest, VercelResponse } from "@vercel/node";

const DB_ID = "080ab902a0f94061849337b773846f9b";

function splitTags(str?: string): string[] {
  if (!str) return [];
  return str.split(",").map((t) => t.trim()).filter(Boolean);
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
        filter: { property: "Active", checkbox: { equals: true } },
        sorts: [{ property: "Sort Order", direction: "ascending" }],
      }),
    });

    const data = await r.json();
    if (!data.results) return res.status(200).json([]);

    const countries = data.results.map((page: any) => {
      const p = page.properties;
      const nameEN = p.Country?.title?.[0]?.plain_text || "";
      // Key: first word of country name, lowercased (e.g. "UAE / Dubai" → "uae")
      const key = nameEN.split(/[\s\/]/)[0].toLowerCase();
      return {
        key,
        youtubeUrl: p["YouTube URL"]?.url || null,
        coverImage: p["Cover Image URL"]?.url || null,
        descEN: p["Description EN"]?.rich_text?.[0]?.plain_text || "",
        descZH: p["Description ZH"]?.rich_text?.[0]?.plain_text || "",
        descAR: p["Description AR"]?.rich_text?.[0]?.plain_text || "",
        tagsEN: splitTags(p["Tags EN"]?.rich_text?.[0]?.plain_text),
        tagsZH: splitTags(p["Tags ZH"]?.rich_text?.[0]?.plain_text),
      };
    });

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(countries);
  } catch {
    return res.status(200).json([]);
  }
}
