export type BriefingStatus = "draft" | "approved" | "published";

export interface DailyBriefingItem {
  id: string;
  briefing_date: string;
  title: string;
  country: string | null;
  sector: string | null;
  category: string | null;
  summary: string | null;
  why_it_matters: string | null;
  gci_opportunity: string | null;
  stage: string | null;
  source_name: string | null;
  source_url: string | null;
  image_url: string | null;
  sort_order: number | null;
  is_featured: boolean;
  status: BriefingStatus;
  published_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface DailyBriefingResponse {
  briefing_date: string | null;
  published_at: string | null;
  available_dates: string[];
  items: DailyBriefingItem[];
}

export function normalizeBriefingTitle(title: string): string {
  return title.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function sortBriefingItems(items: DailyBriefingItem[]): DailyBriefingItem[] {
  return [...items].sort((a, b) => {
    const orderA = a.sort_order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.sort_order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return a.title.localeCompare(b.title);
  });
}

export function selectPublishedBriefing(
  rows: DailyBriefingItem[],
  today: string,
  requestedDate?: string,
): DailyBriefingResponse {
  const published = rows.filter((item) => item.status === "published");
  const available_dates = [...new Set(published.map((item) => item.briefing_date))].sort().reverse();
  const selectedDate = requestedDate && available_dates.includes(requestedDate)
    ? requestedDate
    : available_dates.includes(today)
      ? today
      : available_dates[0] ?? null;
  const items = selectedDate
    ? sortBriefingItems(published.filter((item) => item.briefing_date === selectedDate))
    : [];
  const published_at = items.reduce<string | null>((latest, item) => {
    if (!item.published_at) return latest;
    return !latest || item.published_at > latest ? item.published_at : latest;
  }, null);
  return { briefing_date: selectedDate, published_at, available_dates, items };
}

export function validateBriefingItem(
  item: Partial<DailyBriefingItem>,
  requirePublishFields = false,
): string[] {
  const missing: string[] = [];
  if (!item.briefing_date) missing.push("briefing_date");
  if (!item.title?.trim()) missing.push("title");
  if (item.status && !["draft", "approved", "published"].includes(item.status)) missing.push("status");
  if (requirePublishFields) {
    for (const field of ["summary", "why_it_matters", "gci_opportunity", "source_name", "source_url"] as const) {
      if (!item[field]?.trim()) missing.push(field);
    }
  }
  return missing;
}
