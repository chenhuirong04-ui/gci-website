import { useState } from "react";
import { LANGUAGES, LanguagePack, LanguageCode } from "./data/corporateData";
import Header from "./components/Header";
import Hero from "./components/Hero";
import WhatWeDo from "./components/WhatWeDo";
import BusinessOpportunities from "./components/BusinessOpportunities";
import CurrentIntelligence from "./components/CurrentIntelligence";
import RegulatoryUpdates from "./components/RegulatoryUpdates";
import CommercialNetwork from "./components/CommercialNetwork";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import DailyBriefingPage from "./components/DailyBriefingPage";

export default function App() {
  const [lang, setLang] = useState<LanguageCode>("EN");
  const pack: LanguagePack = LANGUAGES[lang];
  const isDailyBriefing = window.location.pathname === "/intelligence/daily";

  return (
    <div className="min-h-screen bg-[#030611] text-slate-100 flex flex-col font-sans antialiased selection:bg-brand-gold-550 selection:text-[#030611]">
      
      {/* Navigation Header bar */}
      <Header lang={lang} setLang={setLang} pack={pack} />

      {isDailyBriefing ? (
        <DailyBriefingPage lang={lang} />
      ) : (
      /* Main Corporate Core Landing Sections */
      <main className="flex-1">
        {/* 1. Hero with connected trade sphere */}
        <Hero lang={lang} pack={pack} />

        {/* 2. Three core execution capabilities */}
        <WhatWeDo lang={lang} pack={pack} />

        {/* 3. Live business opportunities */}
        <BusinessOpportunities lang={lang} />

        {/* Confirmed daily briefing only — draft/approved rows never reach this API */}
        <CurrentIntelligence lang={lang} />

        {/* 4—5. Market updates, commercial network and media */}
        <RegulatoryUpdates lang={lang} />
        <CommercialNetwork lang={lang} pack={pack} />

        {/* 6—7. Market path selector and final CTA */}
        <ContactSection lang={lang} pack={pack} />
      </main>
      )}

      {/* Prestige Legal Footer */}
      <Footer lang={lang} pack={pack} />

    </div>
  );
}
