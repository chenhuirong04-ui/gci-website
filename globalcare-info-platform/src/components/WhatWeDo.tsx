import React, { useState } from "react";
import { LanguagePack } from "../data/corporateData";
import { Layers, ShieldCheck, Landmark, CheckCircle, Cpu, ChevronRight } from "lucide-react";
import { service1Details } from "../data/service1Details";
import ServiceDetailDrawer from "./ServiceDetailDrawer";

interface WhatWeDoProps {
  lang: "EN" | "ZH" | "AR";
  pack: LanguagePack;
}

export default function WhatWeDo({ lang, pack }: WhatWeDoProps) {
  const isRtl = lang === "AR";
  const [activeDetailIndex, setActiveDetailIndex] = useState<number | null>(null);

  const handleSubmitRequirement = () => {
    setActiveDetailIndex(null);
    const el = document.getElementById("contact-section");
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const services = [
    {
      idx: "01",
      icon: <Layers className="w-6 h-6 text-brand-gold-400" />,
      title: pack.service1Title,
      desc: pack.service1Desc,
      bullets: pack.service1Bullets || [],
      footer: pack.service1Footer,
      badgeLabel: pack.service1Footer,
      detailsBtn: pack.service1DetailsBtn,
      interactive: lang !== "AR"
    },
    {
      idx: "02",
      icon: <ShieldCheck className="w-6 h-6 text-brand-gold-400" />,
      title: pack.service2Title,
      desc: pack.service2Desc,
      bullets: pack.service2Bullets || [],
      footer: pack.service2Footer
    },
    {
      idx: "03",
      icon: <Landmark className="w-6 h-6 text-brand-gold-400" />,
      title: pack.service3Title,
      desc: pack.service3Desc,
      bullets: pack.service3Bullets || [],
      footer: pack.service3Footer,
      footerUrl: "https://www.coolhomegcc.com"
    },
    {
      idx: "04",
      icon: <Cpu className="w-6 h-6 text-brand-gold-400" />,
      title: pack.service4Title,
      desc: pack.service4Desc,
      bullets: pack.service4Bullets || [],
      footer: pack.service4Footer,
      footerUrl: "https://asoracore.com"
    }
  ];

  return (
    <section id="what-we-do" className="py-20 md:py-24 bg-[#030611] border-b border-brand-gold-500/10">
      <div className="max-w-7xl mx-auto px-6" dir={isRtl ? "rtl" : "ltr"}>
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-16 ${isRtl ? "text-right" : "text-left"}`}>
          <div className="flex items-center gap-2 mb-4 justify-start">
            <span className="h-[1px] w-8 bg-brand-gold-500" />
            <span className="text-sm tracking-wide font-sans text-brand-gold-400 font-medium uppercase">
              {pack.whatWeDoLabel}
            </span>
          </div>
          <h2 id="whatwedo-title" className="text-3xl md:text-4xl font-display font-semibold text-brand-gold-100 tracking-wide leading-snug">
            {pack.whatWeDoTitle}
          </h2>
          <p className="mt-4 text-base text-brand-gold-200/80 max-w-2xl font-light leading-relaxed">
            {pack.whatWeDoSubtitle}
          </p>
        </div>

        {/* Dynamic 4-Column Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {services.map((svc) => (
            <div 
              key={svc.idx}
              className="p-6 sm:p-8 bg-[#050a15] rounded-2xl border border-brand-gold-500/10 hover:border-brand-gold-500/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Floating digit indicator */}
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-brand-gold-500/5 rounded-lg border border-brand-gold-500/10 group-hover:bg-brand-gold-500/15 group-hover:border-brand-gold-500/25 transition-all">
                    {svc.icon}
                  </div>
                  <span className="text-sm font-sans font-bold text-brand-gold-500/50 font-mono">
                    {svc.idx}
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="text-lg font-serif font-semibold text-brand-gold-100 tracking-wide mb-4 min-h-[3.2rem] flex items-center">
                  {svc.title}
                </h3>

                {/* Service Description */}
                <p className="text-xs sm:text-sm text-brand-gold-200/90 font-light leading-relaxed mb-6 min-h-[4.5rem]">
                  {svc.desc}
                </p>

                {/* Sub-elements bullet checklist */}
                <ul className={`border-t border-brand-gold-500/10 pt-5 text-xs sm:text-sm font-light text-brand-gold-200/80 ${svc.interactive ? "space-y-1" : "space-y-3.5"}`}>
                  {svc.bullets.map((bullet, k) =>
                    svc.interactive ? (
                      <li key={k}>
                        <button
                          type="button"
                          onClick={() => setActiveDetailIndex(k)}
                          className="group/item w-full flex items-center justify-between gap-2 text-left rtl:text-right -mx-2.5 px-2.5 py-2 rounded-lg hover:bg-brand-gold-500/10 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-500 shrink-0" />
                            <span className="text-brand-gold-200/90 group-hover/item:text-brand-gold-100 transition-colors">{bullet}</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-brand-gold-500/40 group-hover/item:text-brand-gold-400 group-hover/item:translate-x-0.5 rtl:group-hover/item:-translate-x-0.5 rtl:rotate-180 transition-all shrink-0" />
                        </button>
                      </li>
                    ) : (
                      <li key={k} className="flex gap-2.5 items-start leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-brand-gold-500 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Minimal Bottom Hover Element */}
              {svc.interactive ? (
                <button
                  type="button"
                  onClick={() => setActiveDetailIndex(0)}
                  className="mt-8 pt-4 border-t border-brand-gold-500/10 flex items-center justify-between gap-1.5 text-brand-gold-400 hover:text-brand-gold-300 text-xs sm:text-sm font-sans font-medium transition-colors text-left rtl:text-right"
                >
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-brand-gold-500/20 bg-brand-gold-500/5 text-[10px] sm:text-xs tracking-wide uppercase">
                    {svc.badgeLabel}
                  </span>
                  <span>{svc.detailsBtn}</span>
                </button>
              ) : svc.footerUrl ? (
                <a
                  href={svc.footerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 pt-4 border-t border-brand-gold-500/10 flex items-center gap-1.5 text-brand-gold-400 group-hover:text-brand-gold-300 text-xs sm:text-sm font-sans font-medium transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-500/40 group-hover:bg-brand-gold-400 group-hover:animate-ping" />
                  <span>{svc.footer}</span>
                </a>
              ) : (
                <div className="mt-8 pt-4 border-t border-brand-gold-500/10 flex items-center gap-1.5 text-brand-gold-400 group-hover:text-brand-gold-300 text-xs sm:text-sm font-sans font-medium transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-500/40 group-hover:bg-brand-gold-400 group-hover:animate-ping" />
                  <span>{svc.footer}</span>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>

      {activeDetailIndex !== null && service1Details[activeDetailIndex] && (
        <ServiceDetailDrawer
          lang={lang}
          item={service1Details[activeDetailIndex]}
          onClose={() => setActiveDetailIndex(null)}
          onSubmitRequirement={handleSubmitRequirement}
        />
      )}
    </section>
  );
}
