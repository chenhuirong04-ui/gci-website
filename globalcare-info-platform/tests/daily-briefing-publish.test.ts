import assert from "node:assert/strict";
import test from "node:test";
import handler, { PublisherError, PublisherItem, normalizeTitle, publishDailyBriefing } from "../api/admin/daily-briefing/publish";

const token = "TEST-UAT-PUBLISH-TOKEN";
const today = "2026-09-29";

function items(): PublisherItem[] {
  return Array.from({ length: 7 }, (_, index) => ({
    briefing_date: today,
    title: `TEST-UAT Daily Briefing ${index + 1}`,
    country: "TEST-UAT Country",
    sector: "TEST-UAT Sector",
    category: "TEST-UAT Category",
    summary: `TEST-UAT Summary ${index + 1}`,
    why_it_matters: `TEST-UAT Why ${index + 1}`,
    gci_opportunity: `TEST-UAT Opportunity ${index + 1}`,
    stage: "TEST-UAT Stage",
    source_name: "TEST-UAT Source",
    source_url: `https://example.com/TEST-UAT-${index + 1}`,
    sort_order: index + 1,
    is_featured: index < 3,
  }));
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
}

function fakeEnvironment(options: { failApi?: boolean } = {}) {
  const rows: any[] = [];
  const fakeFetch: typeof fetch = async (input, init: RequestInit = {}) => {
    const url = new URL(String(input));
    if (url.hostname === "supabase.test") {
      if ((init.method ?? "GET") === "GET") {
        let found = [...rows];
        const date = url.searchParams.get("briefing_date");
        if (date?.startsWith("eq.")) found = found.filter((row) => row.briefing_date === date.slice(3));
        if (date?.startsWith("gte.")) found = found.filter((row) => row.briefing_date >= date.slice(4) && row.briefing_date < today);
        return json(found.sort((a, b) => a.sort_order - b.sort_order));
      }
      if (init.method === "POST") {
        const payload = JSON.parse(String(init.body));
        for (const item of payload) {
          const normalized_title = normalizeTitle(item.title);
          const existing = rows.find((row) => row.briefing_date === item.briefing_date && row.normalized_title === normalized_title);
          if (existing) Object.assign(existing, item, { normalized_title });
          else rows.push({ ...item, normalized_title, id: `TEST-UAT-${rows.length + 1}` });
        }
        return json(payload.map((item: any) => ({ ...item, normalized_title: normalizeTitle(item.title) })), 201);
      }
      if (init.method === "PATCH") {
        const body = JSON.parse(String(init.body));
        const date = url.searchParams.get("briefing_date")?.replace(/^eq\./, "");
        const status = url.searchParams.get("status")?.replace(/^eq\./, "");
        const publishedAt = url.searchParams.get("published_at")?.replace(/^eq\./, "");
        const changed = rows.filter((row) => row.briefing_date === date && (!status || row.status === status) && (!publishedAt || row.published_at === decodeURIComponent(publishedAt)));
        changed.forEach((row) => Object.assign(row, body));
        return json(changed);
      }
    }
    if (url.pathname === "/api/daily-briefing") {
      if (options.failApi) return json({ error: "TEST-UAT self-check failure" }, 502);
      const published = rows.filter((row) => row.status === "published").sort((a, b) => a.sort_order - b.sort_order);
      return json({ briefing_date: published[0]?.briefing_date ?? null, items: published });
    }
    return new Response("TEST-UAT page", { status: 200 });
  };
  return { rows, fakeFetch };
}

function dependencies(fakeFetch: typeof fetch) {
  return {
    supabaseUrl: "https://supabase.test",
    serviceRoleKey: "TEST-UAT-SERVICE-KEY",
    siteOrigin: "https://site.test",
    fetchFn: fakeFetch,
    now: () => new Date("2026-09-29T05:00:00.000Z"),
    today,
  };
}

function mockResponse() {
  let statusCode = 200;
  let body: any;
  const response: any = {
    status(code: number) { statusCode = code; return response; },
    json(value: unknown) { body = value; return response; },
    setHeader() { return response; },
  };
  return { response, read: () => ({ statusCode, body }) };
}

test("1. missing token returns 401", async () => {
  process.env.GCI_DAILY_BRIEFING_PUBLISH_TOKEN = token;
  const res = mockResponse();
  await handler({ method: "POST", headers: {}, body: items() } as any, res.response);
  assert.equal(res.read().statusCode, 401);
});

test("2. wrong token returns 401", async () => {
  process.env.GCI_DAILY_BRIEFING_PUBLISH_TOKEN = token;
  const res = mockResponse();
  await handler({ method: "POST", headers: { authorization: "Bearer wrong" }, body: items() } as any, res.response);
  assert.equal(res.read().statusCode, 401);
});

test("3. valid 7-item payload publishes 7", async () => {
  const env = fakeEnvironment();
  const result = await publishDailyBriefing(items(), dependencies(env.fakeFetch));
  assert.equal(result.published_count, 7);
  assert.equal(env.rows.filter((row) => row.status === "published").length, 7);
});

test("4. duplicate title is rejected", async () => {
  const env = fakeEnvironment();
  const input = items();
  input[1].title = input[0].title;
  await assert.rejects(() => publishDailyBriefing(input, dependencies(env.fakeFetch)), (error: PublisherError) => error.code === "DUPLICATE_TITLE");
  assert.equal(env.rows.length, 0);
});

test("5. missing source is not published", async () => {
  const env = fakeEnvironment();
  const input = items();
  input[0].source_url = "";
  await assert.rejects(() => publishDailyBriefing(input, dependencies(env.fakeFetch)), (error: PublisherError) => error.code === "MISSING_FIELDS");
  assert.equal(env.rows.length, 0);
});

test("6. invalid sort order is not published", async () => {
  const env = fakeEnvironment();
  const input = items();
  input[6].sort_order = 9;
  await assert.rejects(() => publishDailyBriefing(input, dependencies(env.fakeFetch)), (error: PublisherError) => error.code === "INVALID_SORT_ORDER");
  assert.equal(env.rows.length, 0);
});

test("7. failed public self-check rolls back to approved", async () => {
  const env = fakeEnvironment({ failApi: true });
  await assert.rejects(() => publishDailyBriefing(items(), dependencies(env.fakeFetch)), (error: PublisherError) => error.code === "SELF_CHECK_FAILED");
  assert.equal(env.rows.filter((row) => row.status === "published").length, 0);
  assert.equal(env.rows.filter((row) => row.status === "approved").length, 7);
});

test("8. identical resubmission is idempotent", async () => {
  const env = fakeEnvironment();
  await publishDailyBriefing(items(), dependencies(env.fakeFetch));
  const second = await publishDailyBriefing(items(), dependencies(env.fakeFetch));
  assert.equal(second.idempotent, true);
  assert.equal(env.rows.length, 7);
});
