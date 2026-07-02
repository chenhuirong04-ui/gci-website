import React, { useEffect } from "react";
import { X, CheckCircle2, ArrowRight } from "lucide-react";
import { Service1DetailItem, service1DetailDisclaimer, service1DetailLabels } from "../data/service1Details";

interface ServiceDetailDrawerProps {
  lang: "EN" | "ZH" | "AR";
  item: Service1DetailItem;
  onClose: () => void;
  onSubmitRequirement: () => void;
}

export default function ServiceDetailDrawer({ lang, item, onClose, onSubmitRequirement }: ServiceDetailDrawerProps) {
  const l = lang === "ZH" ? "ZH" : "EN";
  const isRtl = lang === "AR";

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#020408]/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className="relative h-full w-full sm:w-[480px] bg-[#050a15] border-l border-brand-gold-500/20 shadow-2xl overflow-y-auto animate-[slideIn_0.25s_ease-out]"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <style>{`
          @keyframes slideIn { from { transform: translateX(${isRtl ? "-100%" : "100%"}); } to { transform: translateX(0); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>

        <div className="sticky top-0 bg-[#050a15]/95 backdrop-blur border-b border-brand-gold-500/10 px-6 sm:px-8 py-5 flex items-start justify-between gap-4">
          <h3 className="text-lg sm:text-xl font-serif font-semibold text-brand-gold-100 tracking-wide leading-snug">
            {item.title[l]}
          </h3>
          <button
            onClick={onClose}
            aria-label={service1DetailLabels.close[l]}
            className="shrink-0 p-2 rounded-lg border border-brand-gold-500/15 text-brand-gold-300 hover:text-brand-gold-100 hover:border-brand-gold-500/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 sm:px-8 py-6 space-y-8">
          {/* 1. Service Overview */}
          <div>
            <span className="text-xs font-sans font-bold tracking-wide uppercase text-brand-gold-400">
              {service1DetailLabels.serviceDesc[l]}
            </span>
            <p className="mt-3 text-sm text-brand-gold-200/90 font-light leading-relaxed">
              {item.description[l]}
            </p>
          </div>

          {/* 2. Support Content */}
          <div>
            <span className="text-xs font-sans font-bold tracking-wide uppercase text-brand-gold-400">
              {service1DetailLabels.supportContent[l]}
            </span>
            <ul className="mt-3 space-y-3 border-t border-brand-gold-500/10 pt-4">
              {item.support[l].map((point, i) => (
                <li key={i} className="flex gap-2.5 items-start text-sm text-brand-gold-200/85 font-light leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold-500 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Notes */}
          <div>
            <span className="text-xs font-sans font-bold tracking-wide uppercase text-brand-gold-400">
              {service1DetailLabels.notes[l]}
            </span>
            <p className="mt-3 text-xs text-brand-gold-200/70 font-light leading-relaxed border-t border-brand-gold-500/10 pt-4">
              {service1DetailDisclaimer[l]}
            </p>
          </div>

          {/* 4. CTA */}
          <button
            onClick={onSubmitRequirement}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 hover:from-brand-gold-400 hover:to-brand-gold-500 text-[#030611] font-sans font-bold text-sm tracking-wide py-4 rounded-xl transition-all shadow-md shadow-brand-gold-500/15 active:scale-[0.98]"
          >
            <span>{service1DetailLabels.cta[l]}</span>
            <ArrowRight className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
