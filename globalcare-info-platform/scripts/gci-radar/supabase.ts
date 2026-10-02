import type { ProcessedRadarItem, RecentRadarContext, StoredRadarItem } from "./types";

export interface RadarRunRow {
  id: string;
  run_date: string;
  status: "running" | "success" | "failed" | "partial";
  telegram_count: number;
}

export interface RunMetrics {
  status: RadarRunRow["status"];
  completed_at?: string;
  sources_checked?: number;
  candidates_found?: number;
  qualified_count?: number;
  rejected_count?: number;
  duplicate_count?: number;
  telegram_count?: number;
  ai_calls?: number;
  ai_input_tokens?: number;
  ai_output_tokens?: number;
  error_summary?: string | null;
}

export class RadarDatabase {
  private readonly baseUrl: string;

  constructor(supabaseUrl: string, private readonly secretKey: string, private readonly fetchFn: typeof fetch = fetch) {
    this.baseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
    if (!this.baseUrl || !secretKey) throw new Error("Supabase server credentials are not configured");
  }

  private headers(extra: Record<string, string> = {}) {
    return { apikey: this.secretKey, Authorization: `Bearer ${this.secretKey}`, ...extra };
  }

  private async json<T>(response: Response, label: string): Promise<T> {
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`${label} failed: HTTP ${response.status} ${detail.slice(0, 240)}`);
    }
    return response.json() as Promise<T>;
  }

  async getRun(date: string): Promise<RadarRunRow | null> {
    const response = await this.fetchFn(
      `${this.baseUrl}/rest/v1/gci_radar_runs?select=id,run_date,status,telegram_count&run_date=eq.${date}&limit=1`,
      { headers: this.headers() },
    );
    const rows = await this.json<RadarRunRow[]>(response, "Radar run lookup");
    return rows[0] ?? null;
  }

  async startRun(date: string): Promise<RadarRunRow> {
    const existing = await this.getRun(date);
    if (existing?.status === "success") return existing;
    if (existing) {
      const response = await this.fetchFn(`${this.baseUrl}/rest/v1/gci_radar_runs?id=eq.${existing.id}`, {
        method: "PATCH",
        headers: this.headers({ "Content-Type": "application/json", Prefer: "return=representation" }),
        body: JSON.stringify({ status: "running", started_at: new Date().toISOString(), completed_at: null, error_summary: null }),
      });
      return (await this.json<RadarRunRow[]>(response, "Radar run restart"))[0];
    }
    const response = await this.fetchFn(`${this.baseUrl}/rest/v1/gci_radar_runs`, {
      method: "POST",
      headers: this.headers({ "Content-Type": "application/json", Prefer: "return=representation" }),
      body: JSON.stringify({ run_date: date, status: "running" }),
    });
    return (await this.json<RadarRunRow[]>(response, "Radar run create"))[0];
  }

  async updateRun(id: string, metrics: RunMetrics): Promise<void> {
    const response = await this.fetchFn(`${this.baseUrl}/rest/v1/gci_radar_runs?id=eq.${id}`, {
      method: "PATCH",
      headers: this.headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(metrics),
    });
    if (!response.ok) throw new Error(`Radar run update failed: HTTP ${response.status}`);
  }

  async recentContext(date: string): Promise<RecentRadarContext[]> {
    const from = new Date(`${date}T00:00:00Z`);
    from.setUTCDate(from.getUTCDate() - 7);
    const fields = "radar_date,title,event_key,milestone_type,fingerprint,source_url";
    const response = await this.fetchFn(
      `${this.baseUrl}/rest/v1/gci_business_radar?select=${fields}&radar_date=gte.${from.toISOString().slice(0, 10)}&radar_date=lt.${date}&status=eq.qualified&order=radar_date.desc&limit=100`,
      { headers: this.headers() },
    );
    return this.json<RecentRadarContext[]>(response, "Recent Radar context lookup");
  }

  async insertItems(runId: string, items: ProcessedRadarItem[]): Promise<StoredRadarItem[]> {
    if (!items.length) return [];
    const payload = items.map(({ semantic_duplicate: _semanticDuplicate, duplicate_reason: _duplicateReason, ...item }) => ({
      ...item,
      run_id: runId,
    }));
    const response = await this.fetchFn(`${this.baseUrl}/rest/v1/gci_business_radar?on_conflict=fingerprint`, {
      method: "POST",
      headers: this.headers({
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=representation",
      }),
      body: JSON.stringify(payload),
    });
    return this.json<StoredRadarItem[]>(response, "Radar item insert");
  }

  async pendingItems(runId: string): Promise<StoredRadarItem[]> {
    const response = await this.fetchFn(
      `${this.baseUrl}/rest/v1/gci_business_radar?select=*&run_id=eq.${runId}&status=eq.qualified&telegram_delivery_status=eq.pending&order=opportunity_score.desc`,
      { headers: this.headers() },
    );
    return this.json<StoredRadarItem[]>(response, "Pending Radar lookup");
  }

  async resetFailedDeliveries(runId: string): Promise<void> {
    const response = await this.fetchFn(
      `${this.baseUrl}/rest/v1/gci_business_radar?run_id=eq.${runId}&status=eq.qualified&telegram_delivery_status=eq.failed`,
      {
        method: "PATCH",
        headers: this.headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({ telegram_delivery_status: "pending" }),
      },
    );
    if (!response.ok) throw new Error(`Radar failed-delivery reset failed: HTTP ${response.status}`);
  }

  private idFilter(ids: string[]) {
    return `(${ids.join(",")})`;
  }

  async markSending(ids: string[]): Promise<void> {
    if (!ids.length) return;
    const response = await this.fetchFn(
      `${this.baseUrl}/rest/v1/gci_business_radar?id=in.${encodeURIComponent(this.idFilter(ids))}&telegram_delivery_status=eq.pending`,
      {
        method: "PATCH",
        headers: this.headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({ telegram_delivery_status: "sending" }),
      },
    );
    if (!response.ok) throw new Error(`Radar sending lock failed: HTTP ${response.status}`);
  }

  async markDelivered(ids: string[], messageId: number, publishedAt: string): Promise<void> {
    if (!ids.length) return;
    const response = await this.fetchFn(
      `${this.baseUrl}/rest/v1/gci_business_radar?id=in.${encodeURIComponent(this.idFilter(ids))}&telegram_delivery_status=eq.sending`,
      {
        method: "PATCH",
        headers: this.headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          telegram_delivery_status: "delivered",
          telegram_message_id: messageId,
          telegram_published_at: publishedAt,
        }),
      },
    );
    if (!response.ok) throw new Error(`Radar delivery record failed: HTTP ${response.status}`);
  }

  async markFailed(ids: string[]): Promise<void> {
    if (!ids.length) return;
    await this.fetchFn(
      `${this.baseUrl}/rest/v1/gci_business_radar?id=in.${encodeURIComponent(this.idFilter(ids))}&telegram_delivery_status=eq.sending`,
      {
        method: "PATCH",
        headers: this.headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({ telegram_delivery_status: "failed" }),
      },
    );
  }
}
