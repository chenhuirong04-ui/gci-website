import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, ExternalLink, MapPin } from "lucide-react";
import imgGlobalHub from "../assets/images/gci_global_hub_connection_1780768265492.png";
import { resolveCountryArticleImage } from "../data/insightImages";
import type { DailyBriefingItem, DailyBriefingResponse } from "../data/dailyBriefing";

type Lang = "EN" | "ZH" | "AR";

const copy = {
  label: { EN: "DAILY INTELLIGENCE", ZH: "每日商业情报", AR: "معلومات السوق اليومية" },
  title: { EN: "CURRENT OPPORTUNITIES & MARKET INTELLIGENCE", ZH: "当前机会与市场情报", AR: "الفرص الحالية ومعلومات السوق" },
  subtitle: {
    EN: "Selected from the latest market, project, procurement and investment intelligence.",
    ZH: "从最新市场、项目、采购与投资动态中筛选。",
    AR: "مختارات من أحدث معلومات السوق والمشاريع والمشتريات والاستثمار.",
  },
  opportunity: { EN: "GCI OPPORTUNITY", ZH: "GCI 机会判断", AR: "فرصة GCI" },
  stage: { EN: "STAGE", ZH: "阶段", AR: "المرحلة" },
  source: { EN: "SOURCE", ZH: "查看来源", AR: "المصدر" },
  all: { EN: "VIEW DAILY BRIEFING", ZH: "查看完整每日晨报", AR: "عرض الإحاطة اليومية" },
  latest: { EN: "LATEST PUBLISHED BRIEFING", ZH: "最近发布晨报", AR: "أحدث إحاطة منشورة" },
  updated: { EN: "UPDATED", ZH: "更新时间", AR: "آخر تحديث" },
};

function displayTimestamp(value: string | null): string | null {
  if (!value) return null;
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dubai",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function itemImage(item: DailyBriefingItem): string {
  return item.image_url || resolveCountryArticleImage(item.country || "Global", imgGlobalHub);
}

function Meta({ item }: { item: DailyBriefingItem }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono uppercase tracking-wider text-brand-gold-300/75">
      {item.country && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{item.country}</span>}
      {item.sector && <span>{item.sector}</span>}
      {item.category && <span>{item.category}</span>}
    </div>
  );
}

export default function CurrentIntelligence({ lang }: { lang: Lang }) {
  const [data, setData] = useState<DailyBriefingResponse | null>(null);

  useEffect(() => {
    fetch("/api/daily-briefing")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("unavailable")))
      .then(setData)
      .catch(() => setData({ briefing_date: null, published_at: null, available_dates: [], items: [] }));
  }, []);

  const ordered = useMemo(() => data?.items ?? [], [data]);
  const featured = useMemo(() => {
    const promoted = ordered.filter((item) => item.is_featured);
    return [...promoted, ...ordered.filter((item) => !item.is_featured)].slice(0, 3);
  }, [ordered]);
  const featuredIds = new Set(featured.map((item) => item.id));
  const compact = ordered.filter((item) => !featuredIds.has(item.id));

  if (!data || ordered.length === 0) return null;
  const isRtl = lang === "AR";

  return (
    <section id="current-intelligence" className="border-t border-brand-gold-500/10 bg-[#030712] py-12 md:py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6" dir={isRtl ? "rtl" : "ltr"}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px w-8 bg-brand-gold-500" />
              <span className="text-xs font-mono font-bold tracking-[0.18em] text-brand-gold-400">{copy.label[lang]}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-none tracking-tight text-brand-gold-100">{copy.title[lang]}</h2>
            <p className="mt-3 text-sm md:text-base text-brand-gold-200/75">{copy.subtitle[lang]}</p>
          </div>
          <div className="shrink-0 text-xs font-mono text-slate-400">
            <span className="block text-brand-gold-400/70">{copy.latest[lang]}</span>
            <span className="mt-1 inline-flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5" />{data.briefing_date}</span>
            {displayTimestamp(data.published_at) && <span className="mt-1 block text-[10px]">{copy.updated[lang]} · {displayTimestamp(data.published_at)} GST</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {featured.map((item) => (
            <article key={item.id} className="group overflow-hidden rounded-xl border border-brand-gold-500/15 bg-[#071022]">
              <div className="h-32 overflow-hidden">
                <img src={itemImage(item)} alt="" className="h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-90" />
              </div>
              <div className="p-5">
                <Meta item={item} />
                <h3 className="mt-3 text-lg font-serif font-bold leading-snug text-brand-gold-100">{item.title}</h3>
                {item.summary && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-300">{item.summary}</p>}
                {item.gci_opportunity && (
                  <p className="mt-4 border-l border-brand-gold-500/40 pl-3 text-xs leading-relaxed text-brand-gold-200/85">
                    <span className="block mb-1 font-mono font-bold text-brand-gold-400">{copy.opportunity[lang]}</span>
                    {item.gci_opportunity}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-brand-gold-500/10 pt-3 text-xs">
                  {item.stage ? <span className="text-slate-400">{copy.stage[lang]} · {item.stage}</span> : <span />}
                  {item.source_url && <a href={item.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-brand-gold-400 hover:text-brand-gold-300">{copy.source[lang]}<ExternalLink className="h-3 w-3" /></a>}
                </div>
              </div>
            </article>
          ))}
        </div>

        {compact.length > 0 && (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
            {compact.map((item) => (
              <article key={item.id} className="grid grid-cols-[88px_1fr] gap-4 rounded-xl border border-brand-gold-500/10 bg-[#060c1a] p-3">
                <img src={itemImage(item)} alt="" className="h-full min-h-24 w-full rounded-lg object-cover opacity-75" />
                <div className="min-w-0 py-1">
                  <Meta item={item} />
                  <h3 className="mt-2 text-sm font-serif font-bold leading-snug text-brand-gold-100">{item.title}</h3>
                  {item.summary && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">{item.summary}</p>}
                  <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
                    <span className="truncate text-brand-gold-300/75">{item.gci_opportunity}</span>
                    {item.source_url && <a href={item.source_url} target="_blank" rel="noreferrer" aria-label={`${copy.source[lang]}: ${item.title}`} className="shrink-0 text-brand-gold-400"><ExternalLink className="h-3.5 w-3.5" /></a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <a href="/intelligence/daily" className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-brand-gold-400 hover:text-brand-gold-300">{copy.all[lang]}<ArrowRight className="h-4 w-4" /></a>
        </div>
      </div>
    </section>
  );
}
