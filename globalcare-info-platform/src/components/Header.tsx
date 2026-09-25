import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { LanguagePack } from "../data/corporateData";
import gciLogo from "../assets/gci-logo-header-transparent.png";

interface HeaderProps {
  lang: "EN" | "ZH" | "AR";
  setLang: (lang: "EN" | "ZH" | "AR") => void;
  pack: LanguagePack;
}

const NAV_COPY = {
  EN: { about: "About", capabilities: "Capabilities", markets: "Markets", sectors: "Sectors", insights: "Insights", contact: "Contact", marketEntry: "Market Entry", supply: "Supply Chain & Projects", ai: "AI & Business Operations", middleEast: "Middle East", europe: "Europe", china: "China", talk: "Talk to GCI" },
  ZH: { about: "关于", capabilities: "核心能力", markets: "市场", sectors: "行业", insights: "市场情报", contact: "联系", marketEntry: "市场进入", supply: "供应链与项目", ai: "AI 与企业运营", middleEast: "中东", europe: "欧洲", china: "中国", talk: "联系 GCI" },
  AR: { about: "من نحن", capabilities: "القدرات", markets: "الأسواق", sectors: "القطاعات", insights: "المعلومات", contact: "اتصل بنا", marketEntry: "دخول السوق", supply: "سلسلة الإمداد والمشاريع", ai: "الذكاء الاصطناعي والعمليات", middleEast: "الشرق الأوسط", europe: "أوروبا", china: "الصين", talk: "تحدث مع GCI" }
} as const;

export default function Header({ lang, setLang }: HeaderProps) {
  const c = NAV_COPY[lang];
  const isRtl = lang === "AR";
  const [openMenu, setOpenMenu] = useState<null | "capabilities" | "markets">(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 88, behavior: "smooth" });
    setOpenMenu(null);
    setMobileOpen(false);
  };

  const links = [
    { label: c.sectors, id: "sectors" },
    { label: c.insights, id: "insights-section" },
    { label: c.contact, id: "contact-section" }
  ];

  return <header ref={headerRef} className="sticky top-0 z-50 bg-[#030611]/95 backdrop-blur-xl border-b border-brand-gold-500/10" dir={isRtl ? "rtl" : "ltr"}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[5.5rem] flex items-center justify-between gap-5">
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="shrink-0 cursor-pointer" aria-label="GCI home">
        <img src={gciLogo} alt="GCI — Cross-Border Business Execution Platform" className="h-14 w-auto object-contain" draggable={false}/>
      </button>
      <nav className="hidden lg:flex items-center gap-1 text-sm text-brand-gold-100/80">
        <button onClick={() => scrollTo("platform-model")} className="px-3 py-3 hover:text-brand-gold-400 transition-colors cursor-pointer">{c.about}</button>
        <div className="relative">
          <button onClick={() => setOpenMenu(openMenu === "capabilities" ? null : "capabilities")} className="px-3 py-3 inline-flex items-center gap-1 hover:text-brand-gold-400 transition-colors cursor-pointer" aria-expanded={openMenu === "capabilities"}>{c.capabilities}<ChevronDown className={`w-3.5 h-3.5 transition-transform ${openMenu === "capabilities" ? "rotate-180" : ""}`}/></button>
          {openMenu === "capabilities" && <div className="absolute top-full left-0 min-w-64 rounded-xl border border-brand-gold-500/15 bg-[#050a15] p-2 shadow-2xl"><button onClick={() => scrollTo("what-we-do")} className="w-full text-left px-4 py-3 rounded-lg hover:bg-brand-gold-500/10">{c.marketEntry}</button><button onClick={() => scrollTo("what-we-do")} className="w-full text-left px-4 py-3 rounded-lg hover:bg-brand-gold-500/10">{c.supply}</button><button onClick={() => scrollTo("what-we-do")} className="w-full text-left px-4 py-3 rounded-lg hover:bg-brand-gold-500/10">{c.ai}</button></div>}
        </div>
        <div className="relative">
          <button onClick={() => setOpenMenu(openMenu === "markets" ? null : "markets")} className="px-3 py-3 inline-flex items-center gap-1 hover:text-brand-gold-400 transition-colors cursor-pointer" aria-expanded={openMenu === "markets"}>{c.markets}<ChevronDown className={`w-3.5 h-3.5 transition-transform ${openMenu === "markets" ? "rotate-180" : ""}`}/></button>
          {openMenu === "markets" && <div className="absolute top-full left-0 min-w-48 rounded-xl border border-brand-gold-500/15 bg-[#050a15] p-2 shadow-2xl"><button onClick={() => scrollTo("markets")} className="w-full text-left px-4 py-3 rounded-lg hover:bg-brand-gold-500/10">{c.middleEast}</button><button onClick={() => scrollTo("europe")} className="w-full text-left px-4 py-3 rounded-lg hover:bg-brand-gold-500/10">{c.europe}</button><button onClick={() => scrollTo("markets")} className="w-full text-left px-4 py-3 rounded-lg hover:bg-brand-gold-500/10">{c.china}</button></div>}
        </div>
        {links.map(x => <button key={x.id} onClick={() => scrollTo(x.id)} className="px-3 py-3 hover:text-brand-gold-400 transition-colors cursor-pointer">{x.label}</button>)}
      </nav>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center bg-[#070d1d] border border-brand-gold-500/15 p-1 rounded-md text-[11px]">
          {(["EN","ZH","AR"] as const).map((value, i) => <span key={value} className="flex items-center"><button onClick={() => setLang(value)} className={`px-2 py-1 rounded cursor-pointer ${lang === value ? "bg-brand-gold-500 text-[#030611] font-bold" : "text-brand-gold-200/60 hover:text-brand-gold-400"}`}>{value === "ZH" ? "中文" : value === "AR" ? "عربي" : value}</button>{i < 2 && <span className="text-brand-gold-500/15 px-0.5">|</span>}</span>)}
        </div>
        <button onClick={() => scrollTo("contact-section")} className="hidden xl:inline-flex bg-brand-gold-500 hover:bg-brand-gold-400 text-[#030611] px-4 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer">{c.talk}</button>
        <button className="lg:hidden p-2 text-brand-gold-200" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation" aria-expanded={mobileOpen}>{mobileOpen ? <X/> : <Menu/>}</button>
      </div>
    </div>
    {mobileOpen && <div className="lg:hidden border-t border-brand-gold-500/10 bg-[#030611] px-5 py-5 max-h-[calc(100vh-5.5rem)] overflow-y-auto">
      <div className="grid gap-1 text-sm">
        <button onClick={() => scrollTo("platform-model")} className="text-left py-3 text-brand-gold-100">{c.about}</button>
        <p className="pt-3 pb-1 text-[10px] uppercase tracking-[.18em] text-brand-gold-500/65">{c.capabilities}</p>
        {[c.marketEntry,c.supply,c.ai].map(x=><button key={x} onClick={() => scrollTo("what-we-do")} className="text-left py-2 pl-3 text-brand-gold-200/75">{x}</button>)}
        <p className="pt-3 pb-1 text-[10px] uppercase tracking-[.18em] text-brand-gold-500/65">{c.markets}</p>
        <button onClick={() => scrollTo("markets")} className="text-left py-2 pl-3 text-brand-gold-200/75">{c.middleEast}</button><button onClick={() => scrollTo("europe")} className="text-left py-2 pl-3 text-brand-gold-200/75">{c.europe}</button><button onClick={() => scrollTo("markets")} className="text-left py-2 pl-3 text-brand-gold-200/75">{c.china}</button>
        {links.map(x=><button key={x.id} onClick={() => scrollTo(x.id)} className="text-left py-3 text-brand-gold-100">{x.label}</button>)}
        <div className="flex sm:hidden gap-2 pt-3">{(["EN","ZH","AR"] as const).map(value=><button key={value} onClick={() => setLang(value)} className={`px-3 py-2 rounded border ${lang===value ? "bg-brand-gold-500 text-[#030611] border-brand-gold-500" : "border-brand-gold-500/15 text-brand-gold-200"}`}>{value}</button>)}</div>
      </div>
    </div>}
  </header>;
}
