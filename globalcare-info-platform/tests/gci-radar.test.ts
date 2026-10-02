import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  buildRadarDeliveryBatches,
  createFingerprint,
  formatRadarMessages,
  processCandidates,
  safeError,
  validateCandidate,
} from "../scripts/gci-radar/core";
import { sendTelegramMessage } from "../scripts/gci-radar/telegram";
import type { RadarCandidate, RecentRadarContext } from "../scripts/gci-radar/types";

const TODAY = "2026-10-02";

function candidate(overrides: Partial<RadarCandidate> = {}): RadarCandidate {
  return {
    radar_date: TODAY,
    region: "SPAIN",
    country: "Spain",
    city: "Barcelona",
    sector: "Automotive / EV / Battery",
    title: "Chinese battery supplier launches Barcelona procurement programme",
    what_happened: "A verified industrial procurement programme has opened for qualified suppliers.",
    key_companies: ["Example Battery Europe"],
    why_it_matters: "It creates a concrete supplier and local execution opening for GCI.",
    gci_role: "Market Entry / Supplier Identification / Local Execution",
    next_action: "Identify the procurement lead and prepare a qualified supplier shortlist.",
    target_organisation: "Example Battery Europe Procurement",
    source_name: "Official Company Newsroom",
    source_url: "https://official.example.org/news/barcelona-procurement",
    opportunity_score: 91,
    risk_level: "LOW",
    milestone_type: "supplier procurement launch",
    event_key: "example battery barcelona factory",
    semantic_duplicate: false,
    duplicate_reason: null,
    ...overrides,
  };
}

test("1 Spain commercial opportunity qualifies", () => {
  assert.equal(processCandidates([candidate()], [], TODAY)[0].status, "qualified");
});

test("2 GCC commercial opportunity qualifies", () => {
  const item = candidate({ region: "GCC / MIDDLE EAST", country: "Saudi Arabia", city: "Riyadh", event_key: "riyadh logistics hub", source_url: "https://spa.gov.sa/example" });
  assert.equal(processCandidates([item], [], TODAY)[0].status, "qualified");
});

test("3 Africa commercial opportunity qualifies", () => {
  const item = candidate({ region: "AFRICA", country: "Kenya", city: "Mombasa", event_key: "mombasa port procurement", source_url: "https://afdb.org/example" });
  assert.equal(processCandidates([item], [], TODAY)[0].status, "qualified");
});

test("4 China outbound opportunity qualifies", () => {
  const item = candidate({ region: "CHINA OUTBOUND", country: "China", city: null, event_key: "china outbound africa plant", source_url: "https://mofcom.gov.cn/example" });
  assert.equal(processCandidates([item], [], TODAY)[0].status, "qualified");
});

test("5 high Middle East operational trade risk qualifies below opportunity threshold", () => {
  const item = candidate({ region: "GCC / MIDDLE EAST", country: "United Arab Emirates", city: null, sector: "Trade & Logistics Risk", opportunity_score: 35, risk_level: "HIGH", event_key: "strait shipping disruption", milestone_type: "shipping route disruption", source_url: "https://official.example.org/risk" });
  assert.equal(processCandidates([item], [], TODAY)[0].status, "qualified");
});

test("6 low-value news is rejected", () => {
  assert.equal(processCandidates([candidate({ opportunity_score: 40 })], [], TODAY)[0].status, "rejected");
});

test("7 conference-only low-value item is rejected", () => {
  const item = candidate({ opportunity_score: 65, milestone_type: "conference announcement" });
  assert.match(validateCandidate(item, TODAY) || "", /conference-only/);
});

test("8 duplicate media repost is rejected", () => {
  const original = candidate();
  const recent: RecentRadarContext[] = [{ radar_date: "2026-10-01", title: original.title, event_key: original.event_key, milestone_type: original.milestone_type, fingerprint: createFingerprint(original), source_url: "https://another.example.org/repost" }];
  assert.equal(processCandidates([candidate({ source_url: "https://news.example.org/repost" })], recent, TODAY)[0].status, "duplicate");
});

test("9 same project with new milestone is accepted", () => {
  const original = candidate();
  const recent: RecentRadarContext[] = [{ radar_date: "2026-10-01", title: original.title, event_key: original.event_key, milestone_type: "investment announcement", fingerprint: createFingerprint({ event_key: original.event_key, milestone_type: "investment announcement" }), source_url: "https://official.example.org/investment" }];
  assert.equal(processCandidates([original], recent, TODAY)[0].status, "qualified");
});

test("10 zero-opportunity day produces status message", () => {
  const messages = formatRadarMessages([], "02 Oct 2026");
  assert.equal(messages.length, 1);
  assert.match(messages[0], /今日未发现达到推送标准/);
  assert.match(messages[0], /Spain ✓/);
});

test("11 Telegram opportunity format is mobile-readable", () => {
  const message = formatRadarMessages(processCandidates([candidate()], [], TODAY), "02 Oct 2026")[0];
  assert.match(message, /GCI GLOBAL BUSINESS RADAR/);
  assert.match(message, /NEXT ACTION/);
  assert.match(message, /Score: 91\/100/);
});

test("12 long Telegram output splits only between items", () => {
  const items = Array.from({ length: 6 }, (_, index) => processCandidates([candidate({ title: `Unique opportunity ${index}`, event_key: `unique project ${index}`, source_url: `https://official.example.org/item-${index}` })], [], TODAY)[0]);
  const batches = buildRadarDeliveryBatches(items, "02 Oct 2026", 900);
  assert.ok(batches.length > 1);
  for (const item of items) assert.equal(batches.filter((batch) => batch.text.includes(item.title)).length, 1);
});

test("13 Telegram retry succeeds without duplicate successful sends", async () => {
  let calls = 0;
  const fakeFetch = async () => {
    calls++;
    if (calls === 1) return new Response(JSON.stringify({ ok: false, description: "temporary" }), { status: 500 });
    return new Response(JSON.stringify({ ok: true, result: { message_id: 321 } }), { status: 200 });
  };
  const result = await sendTelegramMessage("secret-token", "-100123", "test", { fetchFn: fakeFetch as typeof fetch, sleepFn: async () => undefined });
  assert.equal(result.messageId, 321);
  assert.equal(result.attemptsUsed, 2);
  assert.equal(calls, 2);
});

test("14 same-run duplicate candidates are idempotently classified", () => {
  const first = candidate();
  const second = candidate({ title: "Reworded media title", source_url: "https://news.example.org/reworded" });
  const result = processCandidates([first, second], [], TODAY);
  assert.deepEqual(result.map((item) => item.status), ["qualified", "duplicate"]);
});

test("15 semantic duplicate flag prevents unsafe automatic push", () => {
  const item = candidate({ semantic_duplicate: true, duplicate_reason: "same announcement" });
  assert.equal(processCandidates([item], [], TODAY)[0].status, "duplicate");
});

test("16 invalid source URL is rejected", () => {
  assert.match(validateCandidate(candidate({ source_url: "http://invalid.example.org" }), TODAY) || "", /source_url/);
});

test("17 secret redaction removes Telegram token and tokenized URL", () => {
  const token = "123456:TOPSECRET";
  const redacted = safeError(`failed ${token} https://api.telegram.org/bot${token}/sendMessage`, [token]);
  assert.doesNotMatch(redacted, /TOPSECRET/);
  assert.match(redacted, /\[redacted\]/);
});

test("18 Radar runner never references Daily Briefing table", () => {
  const source = readFileSync(new URL("../scripts/gci-radar/run.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /gci_daily_briefing/);
});

test("19 Radar runner never references Insights table", () => {
  const source = readFileSync(new URL("../scripts/gci-radar/run.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /gci_insights/);
});

test("20 Radar implementation contains no public website route", () => {
  const source = readFileSync(new URL("../scripts/gci-radar/run.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /\/api\/|CurrentIntelligence|DailyBriefingPage/);
});
