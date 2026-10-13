import assert from "node:assert/strict";
import test from "node:test";

import {
  buildMessage,
  dubaiDate,
  isClosedStatus,
  splitCustomers,
} from "../scripts/gci-crm-reminder/run.mjs";

test("Dubai date is independent of the host timezone", () => {
  assert.equal(dubaiDate(new Date("2026-10-03T21:30:00Z")), "2026-10-04");
});

test("closed status matching is case and null safe", () => {
  assert.equal(isClosedStatus(" CLOSED "), true);
  assert.equal(isClosedStatus("已完成"), true);
  assert.equal(isClosedStatus(null), false);
});

test("only active due rows are selected and closed overdue rows are excluded", () => {
  const rows = [
    { customer_name: "Today", next_follow_up_at: "2026-10-04", is_active: true },
    { customer_name: "Late", next_follow_up_at: "2026-10-02", status: null, is_active: true },
    { customer_name: "Done", next_follow_up_at: "2026-10-01", status: "DoNe", is_active: true },
    { customer_name: "Inactive", next_follow_up_at: "2026-10-04", is_active: false },
    { customer_name: "Future", next_follow_up_at: "2026-10-05", is_active: true },
  ];
  const result = splitCustomers(rows, "2026-10-04");
  assert.deepEqual(result.today.map((row) => row.customer_name), ["Today"]);
  assert.deepEqual(result.overdue.map((row) => row.customer_name), ["Late"]);
});

test("message contains required fields, overdue days, and stays below Telegram limit", () => {
  const customer = {
    customer_name: "TEST-UAT CRM Reminder",
    next_follow_up_at: "2026-10-02",
    next_action: "Call on WhatsApp",
    status: "跟进中",
    priority: "A",
    owner: "Chris",
    is_active: true,
  };
  const supplier = {
    supplier_name_display: "TEST-UAT Supplier",
    next_follow_up_at: "2026-10-04",
    next_action: "Confirm recruitment capacity",
    status: "active",
  };
  const message = buildMessage(
    { today: [], overdue: [customer] },
    { today: [supplier], overdue: [] },
    "2026-10-04",
    customer.customer_name,
  );
  assert.match(message, /TEST-UAT/);
  assert.match(message, /① 客户跟进｜Clients/);
  assert.match(message, /② 供应商跟进｜Suppliers/);
  assert.match(message, /到期日期：2026-10-02 · ⚠️ 逾期 2 天/);
  assert.match(message, /下一步行动：Call on WhatsApp/);
  assert.match(message, /TEST-UAT Supplier/);
  assert.match(message, /下一步行动：Confirm recruitment capacity/);
  assert.ok(message.length <= 4096);
});

test("main reads both protected feeds with the same secret and sends one grouped message", async () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };
  const today = dubaiDate();
  const calls = [];
  let telegramText = "";
  process.env.GCI_CRM_REMINDER_ENDPOINT = "https://app.globalcareinfo.com/api/crm/daily-reminder";
  process.env.GCI_SUPPLIER_REMINDER_ENDPOINT = "https://app.globalcareinfo.com/api/suppliers/daily-reminder";
  process.env.GCI_CRM_REMINDER_SECRET = "TEST-UAT-shared-reminder-secret";
  process.env.TELEGRAM_BOT_TOKEN = "TEST-UAT-bot";
  process.env.TELEGRAM_CHAT_ID = "TEST-UAT-chat";
  process.env.DUBAI_TODAY = today;
  delete process.env.UAT_CUSTOMER_NAME;
  delete process.env.GITHUB_OUTPUT;

  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), authorization: init.headers?.Authorization });
    if (String(url).endsWith("/api/crm/daily-reminder")) {
      return Response.json({ ok: true, date: today, today: [{ customer_name: "TEST-UAT Client", next_follow_up_at: today, next_action: "Call client" }], overdue: [] });
    }
    if (String(url).endsWith("/api/suppliers/daily-reminder")) {
      return Response.json({ ok: true, date: today, today: [], overdue: [{ supplier_name_display: "TEST-UAT Supplier", next_follow_up_at: "2026-10-01", next_action: "Call supplier" }] });
    }
    telegramText = JSON.parse(String(init.body)).text;
    return Response.json({ ok: true, result: { message_id: 123 } });
  };

  try {
    const { main } = await import("../scripts/gci-crm-reminder/run.mjs");
    await main();
    assert.equal(calls.length, 3);
    assert.equal(calls[0].authorization, "Bearer TEST-UAT-shared-reminder-secret");
    assert.equal(calls[1].authorization, "Bearer TEST-UAT-shared-reminder-secret");
    assert.match(telegramText, /① 客户跟进｜Clients/);
    assert.match(telegramText, /TEST-UAT Client/);
    assert.match(telegramText, /② 供应商跟进｜Suppliers/);
    assert.match(telegramText, /TEST-UAT Supplier/);
    assert.match(telegramText, /⚠️ 逾期/);
  } finally {
    globalThis.fetch = originalFetch;
    process.env = originalEnv;
  }
});
