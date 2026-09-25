import { useState } from "react";
import { LANGUAGES, LanguagePack } from "./data/corporateData";
import Header from "./components/Header";
import Hero from "./components/Hero";
import WhatWeDo from "./components/WhatWeDo";
import StrategicHomepage from "./components/StrategicHomepage";
import BusinessOpportunities from "./components/BusinessOpportunities";
import RegulatoryUpdates from "./components/RegulatoryUpdates";
import CommercialNetwork from "./components/CommercialNetwork";
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

        {/* 2. Three core execution capabilities */}
        <WhatWeDo lang={lang} pack={pack} />

        {/* 3. Live business opportunities */}
        <BusinessOpportunities lang={lang} />

        {/* 4—5. Execution proofs and core markets */}
        <StrategicHomepage lang={lang} sections={["execution"]} />
        <StrategicHomepage lang={lang} sections={["markets"]} />

        {/* 6—7. Market updates, commercial network and media */}
        <RegulatoryUpdates lang={lang} />
        <CommercialNetwork lang={lang} pack={pack} />

        {/* 8—10. Europe entry point, platform logic and sector strip */}
        <StrategicHomepage lang={lang} sections={["europe"]} />
        <StrategicHomepage lang={lang} sections={["platform"]} />
        <StrategicHomepage lang={lang} sections={["sectors"]} />

        {/* 11. Direction-led final CTA & contact */}
        <ContactSection lang={lang} pack={pack} />
      </main>

      {/* Prestige Legal Footer */}
      <Footer lang={lang} pack={pack} />

    </div>
  );
}
