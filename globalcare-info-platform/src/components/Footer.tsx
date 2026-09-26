import { LanguagePack, LanguageCode } from "../data/corporateData";

interface FooterProps {
  lang: LanguageCode;
  pack: LanguagePack;
}

export default function Footer({ lang, pack }: FooterProps) {
  const isRtl = lang === "AR";
  const platform = lang === "ES" ? "Plataforma de ejecución empresarial transfronteriza" : "Cross-Border Business Execution Platform";
  const summary = lang === "ES" ? "Acceso a mercados, cadena de suministro, ejecución de proyectos y operaciones empresariales entre China, Oriente Medio, África y Europa." : "Market access, supply chain, project execution and business operations across China, the Middle East and Europe.";
  const rights = lang === "ES" ? "Todos los derechos reservados." : "All Rights Reserved.";

  return (
    <footer className="bg-[#02040a] border-t border-brand-gold-500/10 py-12 text-brand-gold-300/40 text-xs font-light">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6" dir={isRtl ? "rtl" : "ltr"}>
        
        {/* Brand trademark */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start gap-1">
          <span className="text-sm font-serif font-bold text-brand-gold-200 uppercase tracking-wider">
            GlobalCare Info (GCI)
          </span>
          <span className="text-xs font-sans text-[#DFBA6B] block">
            {platform}
          </span>
        </div>

        {/* Legal disclosures and copyrights */}
        <div className="text-center md:text-right max-w-md">
          <p className="text-xs leading-relaxed text-brand-gold-300/50 mb-1.5 font-sans">
            {summary}
          </p>
          <p className="text-xs font-sans text-brand-gold-300/50">
            © {new Date().getFullYear()} GlobalCare Info Group. {rights}
          </p>
        </div>

      </div>
    </footer>
  );
}
