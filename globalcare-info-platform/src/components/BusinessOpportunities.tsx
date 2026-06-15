import { useState, MouseEvent } from "react";
import { OPPORTUNITIES, Opportunity } from "../data/opportunitiesData";

interface BusinessOpportunitiesProps {
  lang: "EN" | "ZH" | "AR";
}

type ViewState = "home" | "list" | "detail";

const t = {
  sectionLabel: { EN: "BUSINESS OPPORTUNITIES HUB", ZH: "商业机会平台", AR: "منصة فرص الأعمال" },
  sectionTitle: { EN: "ACTIVE BUSINESS OPPORTUNITIES", ZH: "活跃商业机会", AR: "فرص الأعمال النشطة" },
  subtitle: {
    EN: "Explore active business opportunities currently being developed, supported, or facilitated by GCI across global markets.",
    ZH: "探索 GCI 正在参与、推动及协调的国际商业机会。",
    AR: "استكشف الفرص التجارية النشطة التي تطورها GCI أو تدعمها أو تيسرها حالياً عبر الأسواق العالمية."
  },
  viewAll: { EN: "View All Opportunities →", ZH: "查看全部机会 →", AR: "← عرض جميع الفرص" },
  backToAll: { EN: "← All Opportunities", ZH: "← 全部机会", AR: "جميع الفرص →" },
  exploreBtn: { EN: "Explore Opportunity →", ZH: "了解详情 →", AR: "← استكشف الفرصة" },
  contactBtn: { EN: "Contact GCI to Explore This Opportunity →", ZH: "联系 GCI 了解此机会 →", AR: "← تواصل مع GCI لاستكشاف هذه الفرصة" },
  overviewTitle: { EN: "Opportunity Overview", ZH: "机会概述", AR: "نظرة عامة على الفرصة" },
  currentFocusTitle: { EN: "Current Focus", ZH: "当前重点", AR: "التركيز الحالي" },
  potentialTitle: { EN: "Potential Opportunities", ZH: "潜在合作机会", AR: "الفرص المحتملة" },
  whoTitle: { EN: "Who Should Contact Us", ZH: "适合参与企业", AR: "من يجب أن يتصل بنا" },
  allOppsTitle: { EN: "ALL BUSINESS OPPORTUNITIES", ZH: "全部商业机会", AR: "جميع فرص الأعمال" },
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

interface OpportunityCardProps {
  key?: string | number;
  opp: Opportunity;
  lang: "EN" | "ZH" | "AR";
  onSelect: (opp: Opportunity) => void;
}

function OpportunityCard({
  opp,
  lang,
  onSelect,
}: OpportunityCardProps) {
  const isRtl = lang === "AR";
  return (
    <div
      className="group bg-[#070d1d] border border-brand-gold-500/10 hover:border-brand-gold-500/40 rounded-xl overflow-hidden flex flex-col transition-all duration-300 cursor-pointer"
      dir={isRtl ? "rtl" : "ltr"}
      onClick={() => onSelect(opp)}
    >
      {/* Card image */}
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-[#070d1d] to-[#0d1a35]">
        <img
          src={opp.image}
          alt={getTitle(opp, lang)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.classList.add("bg-gradient-to-br", "from-[#070d1d]", "to-[#0d1a35]");
            }
          }}
        />
        {/* Country overlay */}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-medium tracking-wide text-brand-gold-300 bg-[#030611]/70 backdrop-blur-sm px-2 py-1 rounded">
            {getCountry(opp, lang)}
          </span>
        </div>
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-medium px-2 py-1 rounded ${statusStyle(opp.status)}`}>
            {getStatus(opp, lang)}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-white font-semibold text-base leading-snug group-hover:text-brand-gold-300 transition-colors duration-200">
          {getTitle(opp, lang)}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {getTags(opp, lang).slice(0, 3).map((tag) => (
            <span key={tag} className="text-[11px] text-brand-gold-400/70 bg-brand-gold-500/5 border border-brand-gold-500/15 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Explore button */}
        <div className="mt-auto pt-2">
          <span className="text-sm text-brand-gold-400 font-medium group-hover:text-brand-gold-300 transition-colors duration-200">
            {t.exploreBtn[lang]}
          </span>
        </div>
      </div>
    </div>
  );
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
    const el = document.getElementById("contact-section");
    if (el) {
      const offset = 80;
      const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: pos, behavior: "smooth" });
    }
  };

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-8 text-sm text-brand-gold-400 hover:text-brand-gold-300 transition-colors duration-200 flex items-center gap-1"
      >
        {t.backToAll[lang]}
      </button>

      {/* Hero banner */}
      <div className="relative rounded-xl overflow-hidden mb-10 bg-gradient-to-br from-[#070d1d] to-[#0d1a35] border border-brand-gold-500/10">
        <div className="relative h-48 sm:h-64">
          <img
            src={opp.image}
            alt={getTitle(opp, lang)}
            className="w-full h-full object-cover opacity-40"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
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

      {/* Content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div>
            <h3 className="text-brand-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">
              {t.overviewTitle[lang]}
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              {getOverview(opp, lang)}
            </p>
          </div>

          {/* Current Focus */}
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

          {/* Potential Opportunities */}
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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Who Should Contact */}
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

          {/* Tags */}
          <div className="bg-[#070d1d] border border-brand-gold-500/10 rounded-xl p-5">
            <div className="flex flex-wrap gap-2">
              {getTags(opp, lang).map((tag) => (
                <span key={tag} className="text-xs text-brand-gold-400/80 bg-brand-gold-500/5 border border-brand-gold-500/20 px-2.5 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
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

function ListView({
  lang,
  onSelect,
  onBack,
}: {
  lang: "EN" | "ZH" | "AR";
  onSelect: (opp: Opportunity) => void;
  onBack: () => void;
}) {
  const isRtl = lang === "AR";
  return (
    <div dir={isRtl ? "rtl" : "ltr"}>
      <button
        onClick={onBack}
        className="mb-8 text-sm text-brand-gold-400 hover:text-brand-gold-300 transition-colors duration-200"
      >
        {t.backToAll[lang]}
      </button>
      <div className="mb-10">
        <p className="text-brand-gold-400 text-xs font-medium tracking-widest uppercase mb-2">
          {t.sectionLabel[lang]}
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white uppercase">
          {t.allOppsTitle[lang]}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {OPPORTUNITIES.map((opp) => (
          <OpportunityCard key={opp.id} opp={opp} lang={lang} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

export default function BusinessOpportunities({ lang }: BusinessOpportunitiesProps) {
  const [view, setView] = useState<ViewState>("home");
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const isRtl = lang === "AR";

  const handleSelectOpp = (opp: Opportunity) => {
    setSelectedOpp(opp);
    setView("detail");
    // Scroll to section top
    setTimeout(() => {
      const el = document.getElementById("business-opportunities");
      if (el) {
        const offset = 80;
        const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: pos, behavior: "smooth" });
      }
    }, 50);
  };

  const handleBack = () => {
    if (view === "detail") {
      setView("list");
      setSelectedOpp(null);
    } else {
      setView("home");
    }
    setTimeout(() => {
      const el = document.getElementById("business-opportunities");
      if (el) {
        const offset = 80;
        const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: pos, behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <section id="business-opportunities" className="bg-[#030611] py-20 sm:py-28 border-t border-brand-gold-500/8">
      <div className="max-w-7xl mx-auto px-6">
        {view === "home" && (
          <div dir={isRtl ? "rtl" : "ltr"}>
            {/* Section header */}
            <div className="mb-12">
              <p className="text-brand-gold-400 text-xs font-medium tracking-widest uppercase mb-3">
                {t.sectionLabel[lang]}
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold text-white uppercase mb-4 leading-tight">
                {t.sectionTitle[lang]}
              </h2>
              <p className="text-slate-400 text-base max-w-2xl leading-relaxed">
                {t.subtitle[lang]}
              </p>
            </div>

            {/* Cards grid — 3 + 2 layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {OPPORTUNITIES.slice(0, 3).map((opp) => (
                <OpportunityCard key={opp.id} opp={opp} lang={lang} onSelect={handleSelectOpp} />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 lg:max-w-[66.666%]">
              {OPPORTUNITIES.slice(3, 5).map((opp) => (
                <OpportunityCard key={opp.id} opp={opp} lang={lang} onSelect={handleSelectOpp} />
              ))}
            </div>

            {/* View all button */}
            <div className={`flex ${isRtl ? "justify-end" : "justify-start"}`}>
              <button
                onClick={() => setView("list")}
                className="inline-flex items-center gap-2 border border-brand-gold-500/30 hover:border-brand-gold-500/60 text-brand-gold-400 hover:text-brand-gold-300 px-6 py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-300"
              >
                {t.viewAll[lang]}
              </button>
            </div>
          </div>
        )}

        {view === "list" && (
          <ListView lang={lang} onSelect={handleSelectOpp} onBack={handleBack} />
        )}

        {view === "detail" && selectedOpp && (
          <DetailView opp={selectedOpp} lang={lang} onBack={handleBack} />
        )}
      </div>
    </section>
  );
}
