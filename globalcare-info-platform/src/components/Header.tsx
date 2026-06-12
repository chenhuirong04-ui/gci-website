import React from "react";
import { LanguagePack } from "../data/corporateData";
import { ArrowRight, Globe } from "lucide-react";
import gciLogo from "../assets/gci-logo-header.png";

interface HeaderProps {
  lang: "EN" | "ZH" | "AR";
  setLang: (lang: "EN" | "ZH" | "AR") => void;
  pack: LanguagePack;
}

export default function Header({ lang, setLang, pack }: HeaderProps) {
  const isRtl = lang === "AR";

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#030611]/90 backdrop-blur-md border-b border-brand-gold-500/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between" dir={isRtl ? "rtl" : "ltr"}>
        
        {/* Brand Logo & Corporate Mark */}
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-3 group focus:outline-none select-none">
          <img
            src={gciLogo}
            alt="GCI — Global Market Execution Platform"
            className="h-16 w-auto object-contain select-none"
            draggable={false}
          />
        </a>

        {/* Corporate Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <a onClick={(e) => handleNavClick(e, "who-we-are")} href="#who-we-are" className="relative group py-2 text-sm tracking-wide font-medium text-brand-gold-100/90 hover:text-brand-gold-400 transition-all duration-300">
            {pack.navWhoWeAre}
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#dfb256] transition-all duration-300 group-hover:w-full opacity-70" />
          </a>
          <a onClick={(e) => handleNavClick(e, "what-we-do")} href="#what-we-do" className="relative group py-2 text-sm tracking-wide font-medium text-brand-gold-100/90 hover:text-brand-gold-400 transition-all duration-300">
            {pack.navWhatWeDo}
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#dfb256] transition-all duration-300 group-hover:w-full opacity-70" />
          </a>
          <a onClick={(e) => handleNavClick(e, "media-section")} href="#media-section" className="relative group py-2 text-sm tracking-wide font-medium text-brand-gold-100/90 hover:text-brand-gold-400 transition-all duration-300">
            {pack.navMedia}
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#dfb256] transition-all duration-300 group-hover:w-full opacity-70" />
          </a>
          <a onClick={(e) => handleNavClick(e, "insights-section")} href="#insights-section" className="relative group py-2 text-sm tracking-wide font-medium text-brand-gold-100/90 hover:text-brand-gold-400 transition-all duration-300">
            {pack.navInsights}
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#dfb256] transition-all duration-300 group-hover:w-full opacity-70" />
          </a>
          <a onClick={(e) => handleNavClick(e, "contact-section")} href="#contact-section" className="relative group py-2 text-sm tracking-wide font-medium text-brand-gold-100/90 hover:text-brand-gold-400 transition-all duration-300">
            {pack.navContact}
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#dfb256] transition-all duration-300 group-hover:w-full opacity-70" />
          </a>
        </nav>

        {/* Localized HUD Controls + Language & Consultation CTA */}
        <div className="flex items-center gap-6 flex-wrap">
          
          {/* Segmented Controller for Languages */}
          <div className="flex items-center bg-[#070d1d] border border-brand-gold-500/15 p-1 rounded-md font-sans text-xs">
            <button
              onClick={() => setLang("EN")}
              className={`px-2.5 py-1 rounded transition-all duration-300 cursor-pointer font-medium ${lang === "EN" ? "bg-brand-gold-500 text-[#030611] font-bold" : "text-brand-gold-200/60 hover:text-brand-gold-400"}`}
            >
              EN
            </button>
            <span className="text-brand-gold-500/15 px-1">|</span>
            <button
              onClick={() => setLang("ZH")}
              className={`px-2.5 py-1 rounded transition-all duration-300 cursor-pointer font-medium ${lang === "ZH" ? "bg-brand-gold-500 text-[#030611] font-bold" : "text-brand-gold-200/60 hover:text-brand-gold-400"}`}
            >
              中文
            </button>
            <span className="text-brand-gold-500/15 px-1">|</span>
            <button
              onClick={() => setLang("AR")}
              className={`px-2.5 py-1 rounded transition-all duration-300 cursor-pointer font-medium ${lang === "AR" ? "bg-brand-gold-500 text-[#030611] font-bold" : "text-brand-gold-200/60 hover:text-brand-gold-400"}`}
            >
              العربية
            </button>
          </div>

          {/* Consultation Contact Link */}
          <a
            onClick={(e) => handleNavClick(e, "contact-section")}
            href="#contact-section"
            className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-600 to-brand-gold-400 hover:from-brand-gold-500 hover:to-brand-gold-300 text-[#030611] px-5 py-2.5 rounded-lg text-sm font-sans font-bold tracking-wide transition-all duration-300 shadow-md shadow-brand-gold-500/10 active:scale-95"
          >
            <span>{pack.contactBtn}</span>
            <ArrowRight className={`w-4 h-4 stroke-[2.5] ${isRtl ? "rotate-180" : ""}`} />
          </a>
        </div>

      </div>
    </header>
  );
}
