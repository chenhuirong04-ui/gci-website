import { createHash } from "node:crypto";
import type { ProcessedRadarItem, RadarCandidate, RecentRadarContext, RiskLevel } from "./types";

const RISK_RANK: Record<RiskLevel, number> = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
const PRIORITY_LABEL = (score: number) => score >= 90 ? "🔥 IMMEDIATE ACTION" : score >= 75 ? "🔥 HIGH PRIORITY" : "👀 WATCH";

export function normalizeKey(value: string): string {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
}

export function createFingerprint(candidate: Pick<RadarCandidate, "event_key" | "milestone_type">): string {
  return createHash("sha256")
    .update(`${normalizeKey(candidate.event_key)}|${normalizeKey(candidate.milestone_type)}`)
    .digest("hex");
}

export function validateCandidate(candidate: RadarCandidate, today: string): string | null {
  const required: Array<keyof RadarCandidate> = [
    "radar_date", "region", "country", "sector", "title", "what_happened", "why_it_matters",
    "gci_role", "next_action", "target_organisation", "source_name", "source_url", "risk_level",
    "milestone_type", "event_key",
  ];
  const missing = required.filter((key) => typeof candidate[key] !== "string" || !(candidate[key] as string).trim());
  if (missing.length) return `missing fields: ${missing.join(", ")}`;
  if (candidate.radar_date !== today) return "radar_date is not today";
  if (!Number.isInteger(candidate.opportunity_score) || candidate.opportunity_score < 0 || candidate.opportunity_score > 100) {
    return "invalid opportunity_score";
  }
  if (!Array.isArray(candidate.key_companies)) return "key_companies must be an array";
  if (!(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as string[]).includes(candidate.risk_level)) return "invalid risk_level";
  const limits: Partial<Record<keyof RadarCandidate, number>> = {
    title: 180,
    what_happened: 700,
    why_it_matters: 700,
    gci_role: 180,
    next_action: 500,
    target_organisation: 200,
    source_name: 160,
    milestone_type: 180,
    event_key: 180,
  };
  for (const [field, limit] of Object.entries(limits) as Array<[keyof RadarCandidate, number]>) {
    if (typeof candidate[field] === "string" && (candidate[field] as string).length > limit) return `${field} exceeds ${limit} characters`;
  }
  try {
    const url = new URL(candidate.source_url);
    if (url.protocol !== "https:" || !url.hostname.includes(".")) return "invalid source_url";
  } catch {
    return "invalid source_url";
  }
  const eventText = `${candidate.title} ${candidate.what_happened} ${candidate.milestone_type}`;
  if (/conference|forum|summit|expo|webinar|roadshow|events? schedule/i.test(eventText) && candidate.opportunity_score < 75) {
    return "conference-only item below high-priority threshold";
  }
  if (candidate.opportunity_score < 60 && RISK_RANK[candidate.risk_level] < RISK_RANK.HIGH) {
    return "below opportunity threshold";
  }
  return null;
}

export function processCandidates(
  candidates: RadarCandidate[],
  recent: RecentRadarContext[],
  today: string,
): ProcessedRadarItem[] {
  const recentFingerprints = new Set(recent.map((item) => item.fingerprint));
  const recentEventMilestones = new Set(recent.map((item) => `${normalizeKey(item.event_key)}|${normalizeKey(item.milestone_type)}`));
  const recentUrls = new Set(recent.map((item) => item.source_url));
  const seen = new Set<string>();

  return candidates.map((candidate) => {
    const fingerprint = createFingerprint(candidate);
    const invalid = validateCandidate(candidate, today);
    const eventMilestone = `${normalizeKey(candidate.event_key)}|${normalizeKey(candidate.milestone_type)}`;
    const duplicate = candidate.semantic_duplicate === true
      || recentFingerprints.has(fingerprint)
      || recentEventMilestones.has(eventMilestone)
      || recentUrls.has(candidate.source_url)
      || seen.has(fingerprint);
    seen.add(fingerprint);

    if (invalid) {
      return { ...candidate, fingerprint, status: "rejected", rejection_reason: invalid, telegram_delivery_status: "not_applicable" };
    }
    if (duplicate) {
      return { ...candidate, fingerprint, status: "duplicate", rejection_reason: candidate.duplicate_reason || "same event and milestone already recorded", telegram_delivery_status: "not_applicable" };
    }
    return { ...candidate, fingerprint, status: "qualified", rejection_reason: null, telegram_delivery_status: "pending" };
  });
}

function flagFor(country: string): string {
  const flags: Record<string, string> = {
    Spain: "🇪🇸", "United Arab Emirates": "🇦🇪", UAE: "🇦🇪", "Saudi Arabia": "🇸🇦", Qatar: "🇶🇦",
    Oman: "🇴🇲", Bahrain: "🇧🇭", Kuwait: "🇰🇼", Morocco: "🇲🇦", Egypt: "🇪🇬", Kenya: "🇰🇪",
    Tanzania: "🇹🇿", Nigeria: "🇳🇬", Ethiopia: "🇪🇹", Ghana: "🇬🇭", China: "🇨🇳",
  };
  return flags[country] ?? "🌍";
}

export function formatRadarItem(item: ProcessedRadarItem): string {
  const location = [item.country.toUpperCase(), item.city?.toUpperCase()].filter(Boolean).join(" | ");
  if (RISK_RANK[item.risk_level] >= RISK_RANK.HIGH && item.opportunity_score < 60) {
    return [
      "⚠️ TRADE & LOGISTICS RISK",
      `🔴 ${item.risk_level} | ${location}`,
      item.title,
      "",
      `发生了什么：\n${item.what_happened}`,
      "",
      `业务影响：\n${item.why_it_matters}`,
      "",
      `建议关注：\n${item.next_action}`,
      "",
      `目标：${item.target_organisation}`,
      `Source: ${item.source_name} — ${item.source_url}`,
    ].join("\n");
  }
  return [
    PRIORITY_LABEL(item.opportunity_score),
    `${flagFor(item.country)} ${location}`,
    item.title,
    "",
    `发生了什么：\n${item.what_happened}`,
    "",
    `商业价值：\n${item.why_it_matters}`,
    "",
    `GCI切入：${item.gci_role}`,
    "",
    `NEXT ACTION：\n${item.next_action}`,
    "",
    `目标：${item.target_organisation}`,
    `Score: ${item.opportunity_score}/100`,
    `Source: ${item.source_name} — ${item.source_url}`,
  ].join("\n");
}

export interface RadarDeliveryBatch {
  text: string;
  items: ProcessedRadarItem[];
}

export function buildRadarDeliveryBatches(items: ProcessedRadarItem[], dateLabel: string, maxLength = 3900): RadarDeliveryBatch[] {
  const qualified = items.filter((item) => item.status === "qualified")
    .sort((a, b) => b.opportunity_score - a.opportunity_score || RISK_RANK[b.risk_level] - RISK_RANK[a.risk_level])
    .slice(0, 8);
  const heading = `🌍 GCI GLOBAL BUSINESS RADAR\n${dateLabel}`;
  if (!qualified.length) {
    return [{ text: [
      heading,
      "",
      "今日未发现达到推送标准的高价值新增商业机会。",
      "",
      "系统状态：",
      "Spain ✓",
      "GCC ✓",
      "Africa ✓",
      "China Outbound ✓",
    ].join("\n"), items: [] }];
  }

  const itemBlocks = qualified.map(formatRadarItem);
  const immediate = qualified.filter((item) => item.opportunity_score >= 90).length;
  const high = qualified.filter((item) => item.opportunity_score >= 75 && item.opportunity_score < 90).length;
  const watch = qualified.filter((item) => item.opportunity_score >= 60 && item.opportunity_score < 75).length;
  const risks = qualified.filter((item) => RISK_RANK[item.risk_level] >= RISK_RANK.HIGH).length;
  const summary = [
    "📊 TODAY",
    `New Opportunities: ${qualified.filter((item) => item.opportunity_score >= 60).length}`,
    `Immediate Action: ${immediate}`,
    `High Priority: ${high}`,
    `Watch: ${watch}`,
    `Risk Alerts: ${risks}`,
  ].join("\n");

  const batches: RadarDeliveryBatch[] = [];
  let current = heading;
  let currentItems: ProcessedRadarItem[] = [];
  for (const [index, block] of itemBlocks.entries()) {
    const addition = `\n\n${block}`;
    if (current.length + addition.length > maxLength && current !== heading) {
      batches.push({ text: current, items: currentItems });
      current = `${heading}\n\n${block}`;
      currentItems = [qualified[index]];
    } else {
      current += addition;
      currentItems.push(qualified[index]);
    }
  }
  if (current.length + summary.length + 2 > maxLength) {
    batches.push({ text: current, items: currentItems });
    current = `${heading}\n\n${summary}`;
    currentItems = [];
  } else {
    current += `\n\n${summary}`;
  }
  batches.push({ text: current, items: currentItems });
  return batches.map((batch, index) => ({
    ...batch,
    text: batches.length > 1 ? `${batch.text}\n\n[${index + 1}/${batches.length}]` : batch.text,
  }));
}

export function formatRadarMessages(items: ProcessedRadarItem[], dateLabel: string, maxLength = 3900): string[] {
  return buildRadarDeliveryBatches(items, dateLabel, maxLength).map((batch) => batch.text);
}

export function safeError(value: unknown, secrets: string[] = []): string {
  let message = value instanceof Error ? value.message : String(value);
  for (const secret of secrets.filter(Boolean)) message = message.replaceAll(secret, "[redacted]");
  return message.replace(/https:\/\/api\.telegram\.org\/bot[^/\s]+/gi, "https://api.telegram.org/bot[redacted]").slice(0, 500);
}
