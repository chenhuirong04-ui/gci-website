import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const PUBLISHER_URL = "https://www.globalcareinfo.com/api/admin/daily-briefing/publish";

type PublisherResult = {
  briefing_date?: string;
  published_count?: number;
  api_check?: { ok?: boolean };
  homepage_check?: { ok?: boolean };
  daily_page_check?: { ok?: boolean };
  error?: string;
  message?: string;
  details?: unknown;
};

export async function publishFinalDailyBriefing(
  finalJson: unknown,
  options: {
    token?: string;
    fetchImpl?: typeof fetch;
  } = {},
) {
  const token = options.token ?? process.env.GCI_DAILY_BRIEFING_PUBLISH_TOKEN;
  if (!token) {
    throw new Error("GCI_DAILY_BRIEFING_PUBLISH_TOKEN is not configured in the execution environment");
  }

  const response = await (options.fetchImpl ?? fetch)(PUBLISHER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(finalJson),
  });

  const result = await response.json().catch(() => ({})) as PublisherResult;
  if (!response.ok) {
    const details = result.details ? ` | ${JSON.stringify(result.details)}` : "";
    throw new Error(`${result.error ?? `HTTP_${response.status}`}: ${result.message ?? "Publisher request failed"}${details}`);
  }

  const websitePass = result.api_check?.ok === true
    && result.homepage_check?.ok === true
    && result.daily_page_check?.ok === true;
  if (!websitePass) {
    throw new Error("PUBLISHER_SELF_CHECK_FAILED: Publisher did not confirm all website checks");
  }

  return {
    briefing_date: result.briefing_date,
    published_count: result.published_count,
    website_verification: "PASS" as const,
  };
}

async function readInput() {
  const filePath = process.argv[2];
  if (filePath) return readFile(filePath, "utf8");

  if (process.stdin.isTTY) {
    throw new Error("FINAL Daily Briefing JSON is required via stdin or a file path argument");
  }

  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf8");
}

async function main() {
  try {
    const raw = await readInput();
    const finalJson = JSON.parse(raw);
    const result = await publishFinalDailyBriefing(finalJson);
    console.log(`briefing_date: ${result.briefing_date}`);
    console.log(`published 数量: ${result.published_count}`);
    console.log("官网验证: PASS");
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Unknown Publisher error");
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main();
}
