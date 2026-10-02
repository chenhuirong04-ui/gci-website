import { safeError } from "./core";

export interface TelegramSendOptions {
  fetchFn?: typeof fetch;
  sleepFn?: (ms: number) => Promise<void>;
  attempts?: number;
}

export interface TelegramSendResult {
  messageId: number;
  sentAt: string;
  attemptsUsed: number;
}

export async function sendTelegramMessage(
  token: string,
  chatId: string,
  text: string,
  options: TelegramSendOptions = {},
): Promise<TelegramSendResult> {
  if (!token || !chatId) throw new Error("Telegram credentials are not configured");
  if (!text || text.length > 4096) throw new Error("Telegram message length is invalid");
  const fetchFn = options.fetchFn ?? fetch;
  const sleepFn = options.sleepFn ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  const attempts = options.attempts ?? 3;
  let lastError = "Telegram send failed";

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetchFn(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      });
      const payload = await response.json().catch(() => null) as any;
      if (response.ok && payload?.ok === true && Number.isInteger(payload.result?.message_id)) {
        return { messageId: payload.result.message_id, sentAt: new Date().toISOString(), attemptsUsed: attempt };
      }
      lastError = `Telegram HTTP ${response.status}: ${payload?.description || "request failed"}`;
      if (response.status < 500 && response.status !== 429) break;
      const retryAfterSeconds = Number(payload?.parameters?.retry_after || 0);
      if (attempt < attempts) await sleepFn(retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : attempt * 2000);
    } catch (error) {
      lastError = safeError(error, [token]);
      if (attempt < attempts) await sleepFn(attempt * 2000);
    }
  }
  throw new Error(safeError(lastError, [token]));
}

export function telegramConnectionTestMessage(dateLabel: string): string {
  return [
    "🌍 GCI GLOBAL BUSINESS RADAR",
    dateLabel,
    "",
    "Telegram connection test: PASS",
    "GCI Intelligence Engine V1",
  ].join("\n");
}
