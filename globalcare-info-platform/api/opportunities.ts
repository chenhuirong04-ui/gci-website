import type { VercelRequest, VercelResponse } from "@vercel/node";

const DB_ID = "3a5aac13550348deb37bf4d8cb6e06da";

export interface OpportunityOverlay {
  slug: string;
  youtubeUrl: string | null;
  coverImageUrl: string | null;
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
      body: JSON.stringify({ page_size: 50 }),
    });

    const data = await r.json();
    if (!data.results) return res.status(200).json([]);

    const overlays: OpportunityOverlay[] = data.results.map((page: any) => {
      const p = page.properties;
      return {
        slug: p["Slug"]?.rich_text?.[0]?.plain_text || "",
        youtubeUrl: p["YouTube URL"]?.url || null,
        coverImageUrl: p["Cover Image URL"]?.url || null,
      };
    }).filter((o: OpportunityOverlay) => o.slug);

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(overlays);
  } catch {
    return res.status(200).json([]);
  }
}
