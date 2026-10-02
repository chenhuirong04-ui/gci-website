export type RadarRegion = "SPAIN" | "GCC / MIDDLE EAST" | "AFRICA" | "CHINA OUTBOUND";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RadarStatus = "qualified" | "rejected" | "duplicate";

export interface RadarCandidate {
  radar_date: string;
  region: RadarRegion;
  country: string;
  city: string | null;
  sector: string;
  title: string;
  what_happened: string;
  key_companies: string[];
  why_it_matters: string;
  gci_role: string;
  next_action: string;
  target_organisation: string;
  source_name: string;
  source_url: string;
  opportunity_score: number;
  risk_level: RiskLevel;
  milestone_type: string;
  event_key: string;
  semantic_duplicate?: boolean;
  duplicate_reason?: string | null;
}

export interface ProcessedRadarItem extends RadarCandidate {
  fingerprint: string;
  status: RadarStatus;
  rejection_reason: string | null;
  telegram_delivery_status: "not_applicable" | "pending" | "sending" | "delivered" | "failed";
}

export interface RecentRadarContext {
  radar_date: string;
  title: string;
  event_key: string;
  milestone_type: string;
  fingerprint: string;
  source_url: string;
}

export interface AiUsage {
  calls: number;
  inputTokens: number;
  outputTokens: number;
}

export interface GeneratedBatch {
  candidates: RadarCandidate[];
  usage: AiUsage;
}

export interface StoredRadarItem extends ProcessedRadarItem {
  id: string;
  run_id: string;
  telegram_message_id: number | null;
  telegram_published_at: string | null;
}
