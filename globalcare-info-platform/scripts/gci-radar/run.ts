import "dotenv/config";
import { buildRadarDeliveryBatches, formatRadarMessages, processCandidates, safeError } from "./core";
import { generateRadarBatch } from "./openai";
import { RADAR_SEARCHES, SOURCE_COUNT } from "./sources";
import { RadarDatabase } from "./supabase";
import { sendTelegramMessage, telegramConnectionTestMessage } from "./telegram";
import type { AiUsage, RadarCandidate } from "./types";

type RunMode = "dry-run" | "connection-test" | "real";

function dubaiDate(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dubai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function displayDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`));
}

function modeFromArgs(): RunMode {
  const inline = process.argv.find((arg) => arg.startsWith("--mode="))?.split("=")[1];
  const index = process.argv.indexOf("--mode");
  const raw = inline || (index >= 0 ? process.argv[index + 1] : undefined) || process.env.RADAR_MODE || "dry-run";
  if (!(["dry-run", "connection-test", "real"] as string[]).includes(raw)) throw new Error(`Unsupported RADAR_MODE: ${raw}`);
  return raw as RunMode;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function log(message: string) {
  console.log(`[gci-radar ${new Date().toISOString()}] ${message}`);
}

async function generateAll(apiKey: string, today: string, recent: Awaited<ReturnType<RadarDatabase["recentContext"]>>) {
  const candidates: RadarCandidate[] = [];
  const usage: AiUsage = { calls: 0, inputTokens: 0, outputTokens: 0 };
  for (const search of RADAR_SEARCHES) {
    log(`evaluating region=${search.region}`);
    const batch = await generateRadarBatch(apiKey, search, today, recent);
    candidates.push(...batch.candidates);
    usage.calls += batch.usage.calls;
    usage.inputTokens += batch.usage.inputTokens;
    usage.outputTokens += batch.usage.outputTokens;
  }
  return { candidates, usage };
}

async function main() {
  const mode = modeFromArgs();
  const today = dubaiDate();
  const dateLabel = displayDate(today);
  const telegramToken = mode === "dry-run" ? "" : requiredEnv("TELEGRAM_BOT_TOKEN");
  const telegramChatId = mode === "dry-run" ? "" : requiredEnv("TELEGRAM_CHAT_ID");

  if (mode === "connection-test") {
    const result = await sendTelegramMessage(telegramToken, telegramChatId, telegramConnectionTestMessage(dateLabel));
    log(`connection test delivered message_id=${result.messageId}`);
    return;
  }

  const apiKey = requiredEnv("OPENAI_API_KEY");
  const supabaseUrl = requiredEnv("SUPABASE_URL");
  const supabaseSecret = process.env.SUPABASE_SECRET_KEY || requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const database = new RadarDatabase(supabaseUrl, supabaseSecret);
  const recent = await database.recentContext(today);

  if (mode === "dry-run") {
    const generated = await generateAll(apiKey, today, recent);
    const processed = processCandidates(generated.candidates, recent, today);
    const messages = formatRadarMessages(processed, dateLabel);
    log(`DRY_RUN candidates=${generated.candidates.length} qualified=${processed.filter((item) => item.status === "qualified").length} duplicates=${processed.filter((item) => item.status === "duplicate").length} rejected=${processed.filter((item) => item.status === "rejected").length} ai_calls=${generated.usage.calls} input_tokens=${generated.usage.inputTokens} output_tokens=${generated.usage.outputTokens}`);
    messages.forEach((message, index) => console.log(`\n--- RADAR PREVIEW ${index + 1}/${messages.length} ---\n${message}`));
    return;
  }

  const existing = await database.getRun(today);
  if (existing?.status === "success") {
    log(`idempotent exit: successful run already exists for ${today}`);
    return;
  }
  if (existing && (existing.status === "partial" || existing.telegram_count > 0)) {
    throw new Error(`Safe stop: run ${existing.id} already delivered Telegram output but is not fully reconciled`);
  }

  const run = await database.startRun(today);
  let telegramCount = 0;
  let usage: AiUsage = { calls: 0, inputTokens: 0, outputTokens: 0 };
  let processedCount = { candidates: 0, qualified: 0, rejected: 0, duplicate: 0 };

  try {
    const generated = await generateAll(apiKey, today, recent);
    usage = generated.usage;
    const processed = processCandidates(generated.candidates, recent, today);
    processedCount = {
      candidates: processed.length,
      qualified: processed.filter((item) => item.status === "qualified").length,
      rejected: processed.filter((item) => item.status === "rejected").length,
      duplicate: processed.filter((item) => item.status === "duplicate").length,
    };

    await database.insertItems(run.id, processed);
    await database.resetFailedDeliveries(run.id);
    const pending = await database.pendingItems(run.id);
    const batches = buildRadarDeliveryBatches(pending, dateLabel);
    const pendingByFingerprint = new Map(pending.map((item) => [item.fingerprint, item]));

    for (const batch of batches) {
      const ids = batch.items.map((item) => pendingByFingerprint.get(item.fingerprint)?.id).filter((id): id is string => Boolean(id));
      await database.markSending(ids);
      try {
        const sent = await sendTelegramMessage(telegramToken, telegramChatId, batch.text);
        telegramCount++;
        await database.markDelivered(ids, sent.messageId, sent.sentAt);
        log(`Telegram delivered message_id=${sent.messageId} items=${ids.length}`);
      } catch (error) {
        await database.markFailed(ids);
        throw error;
      }
    }

    await database.updateRun(run.id, {
      status: "success",
      completed_at: new Date().toISOString(),
      sources_checked: SOURCE_COUNT,
      candidates_found: processedCount.candidates,
      qualified_count: processedCount.qualified,
      rejected_count: processedCount.rejected,
      duplicate_count: processedCount.duplicate,
      telegram_count: telegramCount,
      ai_calls: usage.calls,
      ai_input_tokens: usage.inputTokens,
      ai_output_tokens: usage.outputTokens,
      error_summary: null,
    });
    log(`REAL_RUN success candidates=${processedCount.candidates} qualified=${processedCount.qualified} rejected=${processedCount.rejected} duplicates=${processedCount.duplicate} telegram_messages=${telegramCount} ai_calls=${usage.calls} input_tokens=${usage.inputTokens} output_tokens=${usage.outputTokens}`);
  } catch (error) {
    const message = safeError(error, [apiKey, telegramToken, supabaseSecret]);
    await database.updateRun(run.id, {
      status: telegramCount > 0 ? "partial" : "failed",
      completed_at: new Date().toISOString(),
      sources_checked: SOURCE_COUNT,
      candidates_found: processedCount.candidates,
      qualified_count: processedCount.qualified,
      rejected_count: processedCount.rejected,
      duplicate_count: processedCount.duplicate,
      telegram_count: telegramCount,
      ai_calls: usage.calls,
      ai_input_tokens: usage.inputTokens,
      ai_output_tokens: usage.outputTokens,
      error_summary: message,
    }).catch(() => undefined);
    throw new Error(message);
  }
}

main().catch((error) => {
  console.error(`[gci-radar] FAILED: ${safeError(error)}`);
  process.exit(1);
});
