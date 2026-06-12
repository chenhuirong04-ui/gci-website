import { LanguagePack } from "../data/corporateData";

interface FooterProps {
  lang: "EN" | "ZH" | "AR";
  pack: LanguagePack;
}

export default function Footer({ lang, pack }: FooterProps) {
  const isRtl = lang === "AR";

  return (
    <footer className="bg-[#02040a] border-t border-brand-gold-500/10 py-12 text-brand-gold-300/40 text-xs font-light">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6" dir={isRtl ? "rtl" : "ltr"}>
        
        {/* Brand trademark */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start gap-1">
          <span className="text-sm font-serif font-bold text-brand-gold-200 uppercase tracking-wider">
            GlobalCare Info (GCI)
          </span>
          <span className="text-xs font-sans text-[#DFBA6B] block">
            Dubai-Based Market Access & License Execution Entity
          </span>
        </div>

        {/* Legal disclosures and copyrights */}
        <div className="text-center md:text-right max-w-md">
          <p className="text-xs leading-relaxed text-brand-gold-300/50 mb-1.5 font-sans">
            Official registration coordinated under UAE DET and Riyadh MISA licensing protocols. Direct on-ground custom warehouse properties leased and maintained securely.
          </p>
          <p className="text-xs font-sans text-brand-gold-300/50">
            © {new Date().getFullYear()} GlobalCare Info Group. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
