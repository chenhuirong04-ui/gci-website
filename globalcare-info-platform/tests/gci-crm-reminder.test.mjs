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
  const row = {
    customer_name: "TEST-UAT CRM Reminder",
    next_follow_up_at: "2026-10-02",
    next_action: "Call on WhatsApp",
    status: "跟进中",
    priority: "A",
    owner: "Chris",
    is_active: true,
  };
  const message = buildMessage([], [row], "2026-10-04", row.customer_name);
  assert.match(message, /TEST-UAT/);
  assert.match(message, /今日跟进/);
  assert.match(message, /状态：跟进中 · 逾期 2 天/);
  assert.match(message, /下一步：Call on WhatsApp/);
  assert.ok(message.length <= 4096);
});
