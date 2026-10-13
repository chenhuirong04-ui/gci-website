const CLOSED_STATUSES = new Set(["已关闭", "已完成", "closed", "done"]);
const TELEGRAM_LIMIT = 4096;
const MESSAGE_BUDGET = 3900;

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function dubaiDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dubai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function isClosedStatus(status) {
  return CLOSED_STATUSES.has(String(status ?? "").trim().toLowerCase());
}

export function splitCustomers(rows, today) {
  const active = rows.filter((row) => row?.is_active === true && row.next_follow_up_at);
  return {
    today: active.filter((row) => row.next_follow_up_at === today),
    overdue: active.filter(
      (row) => row.next_follow_up_at < today && !isClosedStatus(row.status),
    ),
  };
}

function daysBetween(earlier, later) {
  const start = Date.parse(`${earlier}T00:00:00Z`);
  const end = Date.parse(`${later}T00:00:00Z`);
  return Math.max(0, Math.round((end - start) / 86_400_000));
}

function clean(value, fallback = "未填写") {
  const text = String(value ?? "").replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
  return text || fallback;
}

function itemLine(row, today, overdue, nameField) {
  const suffix = overdue ? ` · ⚠️ 逾期 ${daysBetween(row.next_follow_up_at, today)} 天` : "";
  return [
    `• ${clean(row[nameField])}`,
    `  到期日期：${clean(row.next_follow_up_at)}${suffix}`,
    `  下一步行动：${clean(row.next_action)}`,
  ].join("\n");
}

export function buildMessage(customerGroups, supplierGroups, today, uatName = "") {
  const title = uatName ? "[TEST-UAT] GCI CRM Daily Reminder" : "GCI CRM Daily Reminder";
  const sections = [title, `Dubai Date: ${today}`, ""];
  const entities = [
    { heading: "① 客户跟进｜Clients", groups: customerGroups, nameField: "customer_name" },
    { heading: "② 供应商跟进｜Suppliers", groups: supplierGroups, nameField: "supplier_name_display" },
  ];
  let omitted = 0;

  for (const entity of entities) {
    sections.push(entity.heading);
    const items = [
      { heading: `今日到期 Today (${entity.groups.today.length})`, rows: entity.groups.today, overdue: false },
      { heading: `已逾期 Overdue (${entity.groups.overdue.length})`, rows: entity.groups.overdue, overdue: true },
    ];
    for (const section of items) {
      sections.push(section.heading);
      if (section.rows.length === 0) {
        sections.push("None", "");
        continue;
      }
      for (let index = 0; index < section.rows.length; index += 1) {
        const block = itemLine(section.rows[index], today, section.overdue, entity.nameField);
        const candidate = [...sections, block, ""].join("\n");
        if (candidate.length > MESSAGE_BUDGET) {
          omitted += section.rows.length - index;
          break;
        }
        sections.push(block, "");
      }
    }
  }

  if (omitted > 0) sections.push(`另有 ${omitted} 条因 Telegram 长度限制未展示。`);
  const message = sections.join("\n").trim();
  if (message.length > TELEGRAM_LIMIT) throw new Error("Telegram message exceeds the hard limit");
  return message;
}

async function fetchReminder(endpoint, secret, label, exactCustomerName = "") {
  let response;
  try {
    response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${secret}` },
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new Error(`${label} reminder endpoint network failure`);
  }
  if (!response.ok) throw new Error(`${label} reminder endpoint failed with HTTP ${response.status}`);
  const payload = await response.json();
  if (payload?.ok !== true || !Array.isArray(payload.today) || !Array.isArray(payload.overdue)) {
    throw new Error(`${label} reminder endpoint returned an unexpected payload`);
  }
  const exact = (rows) => exactCustomerName ? rows.filter((row) => row.customer_name === exactCustomerName) : rows;
  return { date: payload.date, today: exact(payload.today), overdue: exact(payload.overdue) };
}

async function sendTelegram(token, chatId, text) {
  let response;
  try {
    response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new Error("Telegram network failure");
  }
  if (!response.ok) throw new Error(`Telegram send failed with HTTP ${response.status}`);
  const payload = await response.json();
  if (payload?.ok !== true || !Number.isInteger(payload?.result?.message_id)) {
    throw new Error("Telegram send returned an unexpected payload");
  }
  return payload.result.message_id;
}

export async function main() {
  const customerEndpoint = requiredEnv("GCI_CRM_REMINDER_ENDPOINT");
  if (customerEndpoint !== "https://app.globalcareinfo.com/api/crm/daily-reminder") {
    throw new Error("GCI_CRM_REMINDER_ENDPOINT is not the approved GCI APP Production endpoint");
  }
  const supplierEndpoint = requiredEnv("GCI_SUPPLIER_REMINDER_ENDPOINT");
  if (supplierEndpoint !== "https://app.globalcareinfo.com/api/suppliers/daily-reminder") {
    throw new Error("GCI_SUPPLIER_REMINDER_ENDPOINT is not the approved GCI APP Production endpoint");
  }
  const reminderSecret = requiredEnv("GCI_CRM_REMINDER_SECRET");
  const telegramToken = requiredEnv("TELEGRAM_BOT_TOKEN");
  const telegramChatId = requiredEnv("TELEGRAM_CHAT_ID");
  const today = process.env.DUBAI_TODAY?.trim() || dubaiDate();
  const uatName = process.env.UAT_CUSTOMER_NAME?.trim() || "";
  if (uatName && uatName !== "TEST-UAT CRM Reminder") {
    throw new Error("UAT_CUSTOMER_NAME must be the approved TEST-UAT CRM Reminder customer");
  }

  const customers = await fetchReminder(customerEndpoint, reminderSecret, "CRM", uatName);
  const suppliers = uatName
    ? { date: today, today: [], overdue: [] }
    : await fetchReminder(supplierEndpoint, reminderSecret, "Supplier");
  if (customers.date !== today) throw new Error("CRM reminder endpoint Dubai date mismatch");
  if (suppliers.date !== today) throw new Error("Supplier reminder endpoint Dubai date mismatch");
  console.log(`Reminder query complete: clients=${customers.today.length + customers.overdue.length}, suppliers=${suppliers.today.length + suppliers.overdue.length}`);

  if (uatName && customers.today.length + customers.overdue.length !== 1) {
    throw new Error(`TEST-UAT query expected exactly 1 customer, received ${customers.today.length + customers.overdue.length}`);
  }
  const dueCount = customers.today.length + customers.overdue.length + suppliers.today.length + suppliers.overdue.length;
  if (dueCount === 0) {
    console.log("No due client or supplier follow-ups; Telegram send skipped.");
    return;
  }

  const message = buildMessage(customers, suppliers, today, uatName);
  const messageId = await sendTelegram(telegramToken, telegramChatId, message);
  console.log(`Telegram sent successfully: message_id=${messageId}`);
  if (process.env.GITHUB_OUTPUT) {
    const fs = await import("node:fs/promises");
    await fs.appendFile(process.env.GITHUB_OUTPUT, `sent=true\nmessage_id=${messageId}\n`, "utf8");
  }
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`) {
  main().catch((error) => {
    console.error(`GCI CRM reminder failed: ${error.message}`);
    process.exitCode = 1;
  });
}
