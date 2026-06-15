import { useState, useEffect, MouseEvent } from "react";
import { VideoOff, Briefcase, Play } from "lucide-react";

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return m ? m[1] : null;
}
import { OPPORTUNITIES, Opportunity } from "../data/opportunitiesData";

interface BusinessOpportunitiesProps {
  lang: "EN" | "ZH" | "AR";
}

const t = {
  sectionLabel: { EN: "BUSINESS OPPORTUNITIES HUB", ZH: "商业机会平台", AR: "منصة فرص الأعمال" },
  sectionTitle: { EN: "ACTIVE BUSINESS OPPORTUNITIES", ZH: "活跃商业机会", AR: "فرص الأعمال النشطة" },
  subtitle: {
    EN: "Explore active business opportunities currently being developed, supported, or facilitated by GCI across global markets.",
    ZH: "探索 GCI 正在参与、推动及协调的国际商业机会。",
    AR: "استكشف الفرص التجارية النشطة التي تطورها GCI أو تدعمها أو تيسرها حالياً عبر الأسواق العالمية."
  },
  placeholderText: { EN: "Video Coming Soon", ZH: "视频即将发布", AR: "الفيديو قريباً" },
  tagsLabel: { EN: "Key Sectors", ZH: "核心领域", AR: "القطاعات الرئيسية" },
  contactBtn: { EN: "Contact GCI to Explore →", ZH: "联系 GCI 了解详情 →", AR: "← تواصل مع GCI" },
  detailBtn: { EN: "View Full Details →", ZH: "查看完整详情 →", AR: "← عرض التفاصيل" },
  backToAll: { EN: "← Back to Opportunities", ZH: "← 返回机会列表", AR: "العودة للفرص →" },
  overviewTitle: { EN: "Opportunity Overview", ZH: "机会概述", AR: "نظرة عامة" },
  currentFocusTitle: { EN: "Current Focus", ZH: "当前重点", AR: "التركيز الحالي" },
  potentialTitle: { EN: "Potential Opportunities", ZH: "潜在合作机会", AR: "الفرص المحتملة" },
  whoTitle: { EN: "Who Should Contact Us", ZH: "适合参与企业", AR: "من يجب التواصل" },
};

function getTitle(opp: Opportunity, lang: "EN" | "ZH" | "AR") {
  return lang === "ZH" ? opp.titleZH : lang === "AR" ? opp.titleAR : opp.titleEN;
}
function getCountry(opp: Opportunity, lang: "EN" | "ZH" | "AR") {
  return lang === "ZH" ? opp.countryZH : lang === "AR" ? opp.countryAR : opp.country;
}
function getStatus(opp: Opportunity, lang: "EN" | "ZH" | "AR") {
  return lang === "ZH" ? opp.statusZH : lang === "AR" ? opp.statusAR : opp.status;
}
function getTags(opp: Opportunity, lang: "EN" | "ZH" | "AR") {
  return lang === "ZH" ? opp.tagsZH : lang === "AR" ? opp.tagsAR : opp.tags;
}
function getOverview(opp: Opportunity, lang: "EN" | "ZH" | "AR") {
  return lang === "ZH" ? opp.overviewZH : lang === "AR" ? opp.overviewAR : opp.overviewEN;
}
function getCurrentFocus(opp: Opportunity, lang: "EN" | "ZH" | "AR") {
  return lang === "ZH" ? opp.currentFocusZH : lang === "AR" ? opp.currentFocusAR : opp.currentFocusEN;
}
function getPotential(opp: Opportunity, lang: "EN" | "ZH" | "AR") {
  return lang === "ZH" ? opp.potentialOpportunitiesZH : lang === "AR" ? opp.potentialOpportunitiesAR : opp.potentialOpportunitiesEN;
}
function getWhoShouldContact(opp: Opportunity, lang: "EN" | "ZH" | "AR") {
  return lang === "ZH" ? opp.whoShouldContactZH : lang === "AR" ? opp.whoShouldContactAR : opp.whoShouldContactEN;
}

function statusStyle(status: Opportunity["status"]) {
  if (status === "Active") return "text-green-400 bg-green-400/10 border border-green-400/30";
  if (status === "Under Development") return "text-yellow-400 bg-yellow-400/10 border border-yellow-400/30";
  return "text-brand-gold-400 bg-brand-gold-400/10 border border-brand-gold-400/30";
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const pos = el.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({ top: pos, behavior: "smooth" });
  }
}

function DetailView({
  opp,
  lang,
  onBack,
}: {
  opp: Opportunity;
  lang: "EN" | "ZH" | "AR";
  onBack: () => void;
}) {
  const isRtl = lang === "AR";

  const handleContactClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    scrollToSection("contact-section");
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      <button
        onClick={onBack}
        className="mb-8 text-sm text-brand-gold-400 hover:text-brand-gold-300 transition-colors duration-200 flex items-center gap-1"
      >
        {t.backToAll[lang]}
      </button>

      <div className="relative rounded-xl overflow-hidden mb-10 bg-gradient-to-br from-[#070d1d] to-[#0d1a35] border border-brand-gold-500/10">
        <div className="relative h-48 sm:h-64">
          <img
            src={opp.image}
            alt={getTitle(opp, lang)}
            className="w-full h-full object-cover opacity-40"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030611] via-[#030611]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-sm font-medium text-brand-gold-300 bg-[#030611]/60 px-3 py-1 rounded border border-brand-gold-500/20">
                {getCountry(opp, lang)}
              </span>
              <span className={`text-sm font-medium px-3 py-1 rounded ${statusStyle(opp.status)}`}>
                {getStatus(opp, lang)}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {getTitle(opp, lang)}
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-brand-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">
              {t.overviewTitle[lang]}
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              {getOverview(opp, lang)}
            </p>
          </div>
          <div>
            <h3 className="text-brand-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">
              {t.currentFocusTitle[lang]}
            </h3>
            <ul className="space-y-2">
              {getCurrentFocus(opp, lang).map((item, i) => (
                <li key={i} className="flex gap-3 text-slate-300 text-sm sm:text-base">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-brand-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">
              {t.potentialTitle[lang]}
            </h3>
            <ul className="space-y-2">
              {getPotential(opp, lang).map((item, i) => (
                <li key={i} className="flex gap-3 text-slate-300 text-sm sm:text-base">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#070d1d] border border-brand-gold-500/10 rounded-xl p-5">
            <h3 className="text-brand-gold-400 font-semibold text-sm uppercase tracking-widest mb-4">
              {t.whoTitle[lang]}
            </h3>
            <ul className="space-y-2">
              {getWhoShouldContact(opp, lang).map((item, i) => (
                <li key={i} className="flex gap-3 text-slate-300 text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-gold-400/60 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#070d1d] border border-brand-gold-500/10 rounded-xl p-5">
            <div className="flex flex-wrap gap-2">
              {getTags(opp, lang).map((tag) => (
                <span key={tag} className="text-xs text-brand-gold-400/80 bg-brand-gold-500/5 border border-brand-gold-500/20 px-2.5 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={handleContactClick}
            className="w-full bg-gradient-to-r from-brand-gold-600 to-brand-gold-400 hover:from-brand-gold-500 hover:to-brand-gold-300 text-[#030611] px-5 py-3 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 shadow-md shadow-brand-gold-500/10 active:scale-95 text-center"
          >
            {t.contactBtn[lang]}
          </button>
        </div>
      </div>
    </div>
  );
}

interface NotionOverlay {
  slug: string;
  youtubeUrl: string | null;
  coverImageUrl: string | null;
}

export default function BusinessOpportunities({ lang }: BusinessOpportunitiesProps) {
  const [selectedId, setSelectedId] = useState<string>(OPPORTUNITIES[0].id);
  const [showDetail, setShowDetail] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [overlays, setOverlays] = useState<Record<string, NotionOverlay>>({});
  const isRtl = lang === "AR";

  useEffect(() => {
    fetch("/api/opportunities")
      .then((r) => r.json())
      .then((data: NotionOverlay[]) => {
        const map: Record<string, NotionOverlay> = {};
        data.forEach((o) => { map[o.slug] = o; });
        setOverlays(map);
      })
      .catch(() => {});
  }, []);

  const activeOpp = OPPORTUNITIES.find((o) => o.id === selectedId) ?? OPPORTUNITIES[0];
  const activeOverlay = overlays[activeOpp.id];
  const activeYoutubeUrl = activeOverlay?.youtubeUrl || activeOpp.youtubeUrl || "";
  const activeImage = activeOverlay?.coverImageUrl || activeOpp.image;

  const handleTabClick = (id: string) => {
    setSelectedId(id);
    setShowDetail(false);
    setExpanded(false);
  };

  const handleViewDetail = () => {
    setShowDetail(true);
    setTimeout(() => scrollToSection("business-opportunities"), 50);
  };

  const handleBack = () => {
    setShowDetail(false);
    setTimeout(() => scrollToSection("business-opportunities"), 50);
  };

  const handleContactClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    scrollToSection("contact-section");
  };

  return (
    <section id="business-opportunities" className="pt-28 pb-16 md:pt-36 md:pb-20 bg-[#050a15] border-t border-brand-gold-500/10 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-gold-500/4 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-brand-navy-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10" dir={isRtl ? "rtl" : "ltr"}>

        {/* Section header */}
        <div className={`max-w-4xl mb-12 ${isRtl ? "text-right" : "text-left"}`}>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-[1px] w-8 bg-brand-gold-500" />
            <span className="text-sm font-mono text-brand-gold-400 font-medium uppercase tracking-widest">
              {t.sectionLabel[lang]}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-extrabold text-brand-gold-100 tracking-tight leading-none uppercase">
            {t.sectionTitle[lang]}
          </h2>
          <p className="mt-4 text-base md:text-lg text-brand-gold-200/80 font-light leading-relaxed">
            {t.subtitle[lang]}
          </p>
        </div>

        {showDetail ? (
          <DetailView opp={activeOpp} lang={lang} onBack={handleBack} />
        ) : (
          <>
            {/* Tab selector */}
            <div className="mb-10">
              <div className="flex flex-wrap items-center justify-start gap-2 sm:gap-3 bg-[#030611]/50 border border-brand-gold-500/10 p-2 sm:p-3 rounded-2xl backdrop-blur-md">
                {OPPORTUNITIES.map((opp) => {
                  const isActive = opp.id === selectedId;
                  return (
                    <button
                      key={opp.id}
                      onClick={() => handleTabClick(opp.id)}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-sans font-semibold tracking-wide transition-all duration-300 cursor-pointer active:scale-[0.98] flex items-center gap-2 border ${
                        isActive
                          ? "bg-brand-gold-500 text-[#030611] border-brand-gold-400 font-bold shadow-md shadow-brand-gold-500/10"
                          : "bg-[#030611]/60 text-slate-300 border-brand-gold-500/5 hover:border-brand-gold-500/20 hover:text-brand-gold-300"
                      }`}
                    >
                      <Briefcase className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#030611]" : "text-brand-gold-500/60"}`} />
                      <span>{getTitle(opp, lang)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main content area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

              {/* Left: video / image area */}
              <div className="lg:col-span-8 flex flex-col">
                <div className="relative w-full h-full min-h-[320px] rounded-2xl overflow-hidden border border-brand-gold-500/15 bg-[#030611] flex items-center justify-center shadow-2xl">

                  {/* YouTube embed — highest priority */}
                  {activeYoutubeUrl && getYouTubeId(activeYoutubeUrl) ? (
                    <iframe
                      key={activeOpp.id + "-yt"}
                      src={`https://www.youtube.com/embed/${getYouTubeId(activeYoutubeUrl)}?rel=0&modestbranding=1`}
                      title={activeOpp.titleEN}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : activeImage ? (
                    <>
                      <img
                        key={activeOpp.id + "-img"}
                        src={activeImage}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#030611]/80 via-[#030611]/20 to-transparent pointer-events-none" />
                      {/* Country badge top-left */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="inline-flex items-center gap-1.5 bg-[#030611]/85 backdrop-blur-sm border border-brand-gold-500/25 text-brand-gold-300 text-[10px] font-mono font-bold px-3 py-1.5 rounded-full tracking-wide uppercase">
                          {getCountry(activeOpp, lang)}
                        </span>
                      </div>
                      {/* Status badge bottom-left */}
                      <div className="absolute bottom-4 left-4 z-20">
                        <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${statusStyle(activeOpp.status)}`}>
                          {getStatus(activeOpp, lang)}
                        </span>
                      </div>
                      {/* Video coming soon badge bottom-right */}
                      <div className="absolute bottom-4 right-4 z-20">
                        <span className="inline-flex items-center gap-1.5 bg-[#030611]/80 backdrop-blur-sm border border-brand-gold-500/20 text-brand-gold-400/70 text-[10px] font-mono px-3 py-1.5 rounded-full">
                          <Play className="w-2.5 h-2.5" />
                          {t.placeholderText[lang]}
                        </span>
                      </div>
                    </>
                  ) : (
                    /* No image, no video — placeholder */
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0c1426] to-[#040813] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
                      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#C59B3F_1px,transparent_1px)] [background-size:16px_16px]" />
                      <div className="absolute w-[200px] h-[200px] bg-brand-gold-500/5 blur-[50px] rounded-full" />
                      <div className="p-4 rounded-full bg-[#030611]/80 border border-brand-gold-500/10 text-brand-gold-400/40 mb-4 shadow-xl">
                        <VideoOff className="w-8 h-8 stroke-[1.5]" />
                      </div>
                      <span className="text-xs sm:text-sm font-mono text-[#DFBA6B] uppercase font-bold animate-pulse tracking-widest">
                        {t.placeholderText[lang]}
                      </span>
                      <span className="text-[10px] uppercase font-sans text-brand-gold-500/30 tracking-wider mt-1 block font-medium">
                        GCI Business Opportunity
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: info panel */}
              <div className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-8 bg-[#070e20] rounded-2xl border border-brand-gold-500/10 shadow-xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-brand-gold-500/5 pointer-events-none rounded-tr-2xl" />

                <div className="flex flex-col h-full" dir={isRtl ? "rtl" : "ltr"}>
                  <div className="flex-1">
                    {/* Country + status badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="text-[10px] font-mono text-brand-gold-400 uppercase bg-brand-gold-500/5 border border-brand-gold-500/15 px-3 py-1 rounded-lg font-bold tracking-widest">
                        {getCountry(activeOpp, lang)}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-lg ${statusStyle(activeOpp.status)}`}>
                        {getStatus(activeOpp, lang)}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif text-brand-gold-100 font-extrabold tracking-tight mb-4 leading-snug">
                      {getTitle(activeOpp, lang)}
                    </h3>

                    <div className="mb-6 border-l-2 border-brand-gold-500/20 pl-4">
                      <p className={`text-sm text-brand-gold-200/95 font-light leading-relaxed ${expanded ? "" : "line-clamp-4"}`}>
                        {getOverview(activeOpp, lang)}
                      </p>
                      <button
                        onClick={() => setExpanded(!expanded)}
                        className="mt-2 text-xs text-brand-gold-400 hover:text-brand-gold-300 font-medium transition-colors duration-200"
                      >
                        {expanded
                          ? (lang === "ZH" ? "收起 ↑" : lang === "AR" ? "↑ طي" : "Read Less ↑")
                          : (lang === "ZH" ? "阅读更多 ↓" : lang === "AR" ? "↓ اقرأ المزيد" : "Read More ↓")}
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="border-t border-brand-gold-500/10 pt-5 mb-5">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-brand-gold-400 block mb-3 font-semibold">
                      {t.tagsLabel[lang]}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {getTags(activeOpp, lang).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-sans text-brand-gold-200 font-semibold bg-brand-gold-500/5 border border-brand-gold-500/12 rounded-lg px-2.5 py-1.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleViewDetail}
                      className="w-full border border-brand-gold-500/30 hover:border-brand-gold-500/60 text-brand-gold-400 hover:text-brand-gold-300 px-5 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 text-center"
                    >
                      {t.detailBtn[lang]}
                    </button>
                    <button
                      onClick={handleContactClick}
                      className="w-full bg-gradient-to-r from-brand-gold-600 to-brand-gold-400 hover:from-brand-gold-500 hover:to-brand-gold-300 text-[#030611] px-5 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 shadow-md shadow-brand-gold-500/10 active:scale-95 text-center"
                    >
                      {t.contactBtn[lang]}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </section>
  );
}
