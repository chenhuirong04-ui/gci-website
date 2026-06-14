import type { VercelRequest, VercelResponse } from "@vercel/node";

// TEMPORARY DEBUG ENDPOINT — remove after diagnosis
// Safe: never returns NOTION_TOKEN, only returns sanitized property names & values

const DB_ID = "931a8a5bc40a4e1cb0ce65491fa0ccf5";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const token = process.env.NOTION_TOKEN;

  // Step 1: token check (never expose the value)
  if (!token) {
    return res.status(200).json({
      ok: false,
      step: "token_check",
      error: "NOTION_TOKEN env var is not set or empty",
    });
  }

  // Step 2: query without any filter — just get the latest 5 records
  let raw: any;
  try {
    const r = await fetch(`https://api.notion.com/v1/databases/${DB_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_size: 5,
        sorts: [{ property: "Date", direction: "descending" }],
      }),
    });

    raw = await r.json();
  } catch (err: any) {
    return res.status(200).json({
      ok: false,
      step: "fetch",
      error: err?.message || "fetch threw an exception",
    });
  }

  // Step 3: check Notion-level errors (wrong DB ID, no integration access, etc.)
  if (raw.object === "error") {
    return res.status(200).json({
      ok: false,
      step: "notion_error",
      notion_code: raw.code,
      notion_message: raw.message,
      db_id: DB_ID,
      hint:
        raw.code === "object_not_found"
          ? "DB not found or Integration not connected — go to Notion → DB page → ··· → Connections → add GCI Website integration"
          : raw.code === "unauthorized"
          ? "NOTION_TOKEN has no access to this DB — check token is valid and DB is shared with the integration"
          : "See notion_code + notion_message above",
    });
  }

  // Step 4: results array missing
  if (!Array.isArray(raw.results)) {
    return res.status(200).json({
      ok: false,
      step: "results_missing",
      raw_keys: Object.keys(raw),
    });
  }

  // Step 5: list what we got
  const rows = raw.results.map((page: any) => {
    const p = page.properties;
    // List every property name so we can see what the DB actually has
    const allKeys = Object.keys(p);

    return {
      page_id: page.id,
      all_property_keys: allKeys,
      title: p.Title?.title?.[0]?.plain_text ?? "(empty / field missing)",
      published: p.Published?.checkbox ?? "(no Published checkbox field)",
      category: p.Category?.select?.name ?? "(no Category select field)",
      date: p.Date?.date?.start ?? "(no Date field)",
    };
  });

  return res.status(200).json({
    ok: true,
    db_id: DB_ID,
    total_returned: raw.results.length,
    has_more: raw.has_more,
    rows,
  });
}
