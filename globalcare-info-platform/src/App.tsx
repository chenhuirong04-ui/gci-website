import { useState } from "react";
import { LANGUAGES, LanguagePack } from "./data/corporateData";
import Header from "./components/Header";
import Hero from "./components/Hero";
import WhoWeAre from "./components/WhoWeAre";
import WhatWeDo from "./components/WhatWeDo";
import CommercialNetwork from "./components/CommercialNetwork";
import RegulatoryUpdates from "./components/RegulatoryUpdates";
import BusinessOpportunities from "./components/BusinessOpportunities";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function App() {
  const [lang, setLang] = useState<"EN" | "ZH" | "AR">("EN");
  const pack: LanguagePack = LANGUAGES[lang];

  return (
    <div className="min-h-screen bg-[#030611] text-slate-100 flex flex-col font-sans antialiased selection:bg-brand-gold-550 selection:text-[#030611]">
      
      {/* Navigation Header bar */}
      <Header lang={lang} setLang={setLang} pack={pack} />

      {/* Main Corporate Core Landing Sections */}
      <main className="flex-1">
        {/* 1. Hero with connected trade sphere */}
        <Hero lang={lang} pack={pack} />

        {/* 2. What We Do Triad */}
        <WhatWeDo lang={lang} pack={pack} />

        {/* 3. GCI Regulatory & Market Updates */}
        <RegulatoryUpdates lang={lang} />

        {/* 4. Business Opportunities Hub */}
        <BusinessOpportunities lang={lang} />

        {/* 5. Commercial Network dynamic selector showcase */}
        <CommercialNetwork lang={lang} pack={pack} />

        {/* 6. Who We Are */}
        <WhoWeAre lang={lang} pack={pack} />

        {/* 7. Contact CTA & Consultations */}
        <ContactSection lang={lang} pack={pack} />
      </main>

      {/* Prestige Legal Footer */}
      <Footer lang={lang} pack={pack} />

    </div>
  );
}
