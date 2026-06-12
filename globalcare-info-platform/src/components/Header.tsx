import React from "react";
import { LanguagePack } from "../data/corporateData";
import { ArrowRight, Globe } from "lucide-react";

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
        <a href="#" className="flex items-center gap-3 group focus:outline-none select-none">
          <svg viewBox="0 0 320 80" className="h-[46px] w-[200px] sm:w-[220px]" fill="none" xmlns="http://www.w3.org/2000/svg">
             <defs>
              {/* High-fidelity Multi-stop Metallic Gold Gradient for bright, reflecting faces */}
              <linearGradient id="header-gci-gold-bright" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9E782F" />
                <stop offset="15%" stopColor="#DFBB6B" />
                <stop offset="50%" stopColor="#FFF2D1" />
                <stop offset="85%" stopColor="#EAD292" />
                <stop offset="100%" stopColor="#C59B3F" />
              </linearGradient>
              {/* Medium gold for dynamic intermediate faces */}
              <linearGradient id="header-gci-gold-mid" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A88232" />
                <stop offset="50%" stopColor="#DFBB6B" />
                <stop offset="100%" stopColor="#8A6A24" />
              </linearGradient>
              {/* Deeper, richer gold/bronze for 3D depth and shadow faces */}
              <linearGradient id="header-gci-gold-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3C2A08" />
                <stop offset="30%" stopColor="#5E4311" />
                <stop offset="70%" stopColor="#8A6A24" />
                <stop offset="100%" stopColor="#3C2A08" />
              </linearGradient>
            </defs>

            {/* Authentic 3D Premium Folded Gateway Logo (Corporate Sovereign Look) */}
            <g transform="translate(6, 2)">
              {/* Left Pillar / Outward Face (Bright high-fidelity metal) */}
              <path d="M 12,20 L 22,23 L 22,57 L 12,54 Z" fill="url(#header-gci-gold-bright)" />
              
              {/* Left Pillar / Inside Turn (Shadow deep bronze contrast) */}
              <path d="M 22,23 L 28,26 L 28,51 L 22,57 Z" fill="url(#header-gci-gold-dark)" />
              
              {/* Lintel Top Overlook (Shimmering medium gold) */}
              <path d="M 12,20 L 46,26 L 38,30 L 28,26 Z" fill="url(#header-gci-gold-mid)" />
              
              {/* Right Pillar / Open Leaf Portal (Bright gold showing entrance depth) */}
              <path d="M 46,26 L 46,55 L 34,62 L 34,31 Z" fill="url(#header-gci-gold-bright)" />
              
              {/* Deep Connecting Passageway Inside (Shadow dark metal) */}
              <path d="M 34,31 L 34,62 L 28,51 L 28,26 Z" fill="url(#header-gci-gold-dark)" />
            </g>

            {/* "GCI" Branding Display */}
            <text x="64" y="34" fill="url(#header-gci-gold-bright)" fontWeight="800" fontSize="24" letterSpacing="0.05em" style={{ fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
              GCI
            </text>

            {/* Subtitle match */}
            <text x="64" y="47" fill="#dfbb5a" fontSize="7" fontWeight="600" letterSpacing="0.08em" opacity="0.9" style={{ fontFamily: 'var(--font-sans)', textTransform: 'uppercase' }}>
              Global Market Execution Platform
            </text>

            {/* Elegant Golden Divider Line with Diamond Center */}
            <line x1="8" y1="58" x2="148" y2="58" stroke="#dfb256" strokeWidth="0.8" opacity="0.4" />
            <polygon points="152,58 155,55 158,58 155,61" fill="url(#header-gci-gold-bright)" />
            <line x1="162" y1="58" x2="310" y2="58" stroke="#dfb256" strokeWidth="0.8" opacity="0.4" />
          </svg>
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
