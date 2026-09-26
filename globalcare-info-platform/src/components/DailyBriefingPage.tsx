import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { DailyBriefingResponse } from "../data/dailyBriefing";

type Lang = "EN" | "ZH" | "AR";

export default function DailyBriefingPage({ lang }: { lang: Lang }) {
  const [data, setData] = useState<DailyBriefingResponse | null>(null);
  const [date, setDate] = useState<string | undefined>();

  useEffect(() => {
    const query = date ? `?date=${encodeURIComponent(date)}` : "";
    fetch(`/api/daily-briefing${query}`).then((response) => response.json()).then(setData).catch(() => setData(null));
  }, [date]);

  const title = lang === "ZH" ? "GCI 每日商业情报" : "GCI Daily Market Intelligence";
  const back = lang === "ZH" ? "返回首页" : "Back to Home";

  return (
    <main className="min-h-[70vh] bg-[#030611] py-10 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-brand-gold-400"><ArrowLeft className="h-4 w-4" />{back}</a>
        <div className="mt-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-brand-gold-500/15 pb-5">
          <div>
            <p className="text-xs font-mono tracking-[0.18em] text-brand-gold-400">DAILY BRIEFING</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-serif font-bold text-brand-gold-100">{title}</h1>
            <p className="mt-3 text-sm text-slate-400">{data?.briefing_date ?? "—"}</p>
            {data?.published_at && <p className="mt-1 text-xs text-slate-500">{lang === "ZH" ? "发布时间" : "Published"} · {new Date(data.published_at).toLocaleString("en-GB", { timeZone: "Asia/Dubai", dateStyle: "medium", timeStyle: "short" })} GST</p>}
          </div>
          {data && data.available_dates.length > 1 && (
            <label className="text-xs text-slate-400">
              <span className="block mb-2">{lang === "ZH" ? "浏览日期" : "Browse date"}</span>
              <select value={data.briefing_date ?? ""} onChange={(event) => setDate(event.target.value)} className="rounded-lg border border-brand-gold-500/20 bg-[#071022] px-3 py-2 text-brand-gold-100">
                {data.available_dates.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {data?.items.map((item, index) => (
            <article key={item.id} className="rounded-xl border border-brand-gold-500/12 bg-[#071022] p-4 md:p-5">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-brand-gold-400/75">
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.country && <span>{item.country}</span>}
                {item.sector && <span>{item.sector}</span>}
                {item.category && <span>{item.category}</span>}
                {item.stage && <span>{item.stage}</span>}
              </div>
              <h2 className="mt-3 text-xl md:text-2xl font-serif font-bold text-brand-gold-100">{item.title}</h2>
              {item.summary && <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.summary}</p>}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.why_it_matters && <div><p className="text-[10px] font-mono font-bold tracking-wider text-brand-gold-400">WHY IT MATTERS</p><p className="mt-2 text-sm leading-relaxed text-slate-400">{item.why_it_matters}</p></div>}
                {item.gci_opportunity && <div><p className="text-[10px] font-mono font-bold tracking-wider text-brand-gold-400">GCI OPPORTUNITY</p><p className="mt-2 text-sm leading-relaxed text-brand-gold-200/85">{item.gci_opportunity}</p></div>}
              </div>
              {item.source_url && <a href={item.source_url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs text-brand-gold-400 hover:text-brand-gold-300">{item.source_name || "Source"}<ExternalLink className="h-3.5 w-3.5" /></a>}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
