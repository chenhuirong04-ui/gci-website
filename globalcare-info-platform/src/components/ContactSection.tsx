import React, { useState } from "react";
import { LanguagePack } from "../data/corporateData";
import { PhoneCall, Check } from "lucide-react";

interface ContactSectionProps {
  lang: "EN" | "ZH" | "AR";
  pack: LanguagePack;
}

export default function ContactSection({ lang, pack }: ContactSectionProps) {
  const isRtl = lang === "AR";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    corridor: "China-UAE Corridor",
    message: ""
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      // Reset form fields
      setFormData({
        name: "",
        email: "",
        company: "",
        corridor: "China-UAE Corridor",
        message: ""
      });
      setTimeout(() => setSubmitted(false), 8000);
    }, 1500);
  };

  return (
    <section id="contact-section" className="py-20 md:py-24 bg-[#030611] border-b border-brand-gold-500/10">
      <div className="max-w-7xl mx-auto px-6 font-sans" dir={isRtl ? "rtl" : "ltr"}>
        
        {/* Section Head */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-[1px] w-8 bg-brand-gold-500" />
            <span className="text-sm tracking-wide font-sans text-brand-gold-400 font-medium uppercase">
              {pack.contactLabel}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-brand-gold-100 tracking-wide leading-snug">
            {pack.contactTitle}
          </h2>
          <p className="mt-4 text-base text-brand-gold-200/80 font-light leading-relaxed">
            {pack.contactSubtitle}
          </p>
        </div>

        {/* Form + Side Info Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch max-w-6xl mx-auto">
          
          {/* Left Block: Premium Corporate Form */}
          <div className="lg:col-span-7 bg-[#050a15] rounded-2xl border border-brand-gold-500/10 p-6 md:p-8 flex flex-col justify-between">
            {submitted ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center select-none animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-6">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h4 className="text-lg font-serif text-brand-gold-100 font-bold mb-3">
                  {lang === "ZH" ? "商业意向安全送达" : "Inbound Inquiry Transmitted"}
                </h4>
                <p className="text-xs text-brand-gold-250 max-w-md leading-relaxed">
                  {pack.contactFormSuccess}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name field */}
                  <div>
                    <label className="text-xs font-sans tracking-wide text-brand-gold-300 block mb-2 font-medium">
                      {pack.contactFormName} *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#030611] border border-brand-gold-500/12 text-brand-gold-100 px-4 py-3.5 rounded-xl text-sm tracking-wide focus:outline-none focus:border-brand-gold-400 font-sans"
                    />
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="text-xs font-sans tracking-wide text-brand-gold-300 block mb-2 font-medium">
                      {pack.contactFormEmail} *
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#030611] border border-brand-gold-500/12 text-brand-gold-100 px-4 py-3.5 rounded-xl text-sm tracking-wide focus:outline-none focus:border-brand-gold-400 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Company field */}
                  <div>
                    <label className="text-xs font-sans tracking-wide text-brand-gold-300 block mb-2 font-medium">
                      {pack.contactFormCompany} *
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-[#030611] border border-brand-gold-500/12 text-brand-gold-100 px-4 py-3.5 rounded-xl text-sm tracking-wide focus:outline-none focus:border-brand-gold-400 font-sans"
                    />
                  </div>

                  {/* Corridor selection field */}
                  <div>
                    <label className="text-xs font-sans tracking-wide text-brand-gold-300 block mb-2 font-medium">
                      {pack.contactFormCorridor}
                    </label>
                    <select
                      value={formData.corridor}
                      onChange={(e) => setFormData({ ...formData, corridor: e.target.value })}
                      className="w-full bg-[#030611] border border-brand-gold-500/12 text-brand-gold-100 px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:border-brand-gold-400 cursor-pointer font-sans"
                    >
                      <option value="China-UAE Corridor">China - UAE Corridor</option>
                      <option value="China-Saudi Corridor">China - Saudi Arabia Corridor</option>
                      <option value="China-East Africa Corridor">China - East Africa Corridor</option>
                      <option value="UAE-GCC Corridor">UAE - GCC Regional Gateway</option>
                    </select>
                  </div>
                </div>

                {/* Message scope field */}
                <div>
                  <label className="text-xs font-sans tracking-wide text-brand-gold-300 block mb-2 font-medium">
                    {pack.contactFormMsg}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#030611] border border-brand-gold-500/12 text-brand-gold-100 p-4 rounded-xl text-sm tracking-wide focus:outline-none focus:border-brand-gold-400 outline-none leading-relaxed font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 hover:from-brand-gold-400 hover:to-brand-gold-500 disabled:opacity-50 text-[#030611] text-sm font-sans font-bold py-4 rounded-xl transition-all shadow-md shadow-brand-gold-500/15 cursor-pointer active:scale-98"
                >
                  {sending ? (lang === "ZH" ? "正在传输至迪拜总部..." : "TRANSMITTING TO DUBAI HQ...") : pack.contactFormSubmit}
                </button>

              </form>
            )}
          </div>

          {/* Right Block: Instant Connection Slots (WhatsApp, Email & Phone) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* WhatsApp Business Slot */}
            <a 
              href="https://wa.me/971507188306" 
              target="_blank" 
              rel="noreferrer"
              className="p-6 bg-[#0c1e13] border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl transition-all duration-300 flex items-center justify-between group cursor-pointer font-sans"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                  💬
                </div>
                <div>
                  <span className="text-xs font-sans tracking-wide text-emerald-400 block font-medium">
                    {pack.contactWhatsApp}
                  </span>
                  <span className="text-base font-sans font-semibold text-[#e8fbf1] block mt-0.5">
                    +971 50 718 8306
                  </span>
                </div>
              </div>
              <span className="text-sm font-sans font-medium text-emerald-400 group-hover:translate-x-1 transition-transform">
                Chat Live →
              </span>
            </a>

            {/* Inquiries Email Slot */}
            <a 
              href="mailto:info@globalcareinfo.com" 
              className="p-6 bg-[#040812] border border-brand-gold-500/10 hover:border-brand-gold-500/25 rounded-2xl transition-all duration-300 flex items-center justify-between group cursor-pointer font-sans"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-brand-gold-500/5 border border-brand-gold-500/15 flex items-center justify-center text-brand-gold-400 font-bold shrink-0">
                  ✉️
                </div>
                <div>
                  <span className="text-xs font-sans tracking-wide text-brand-gold-400 block font-medium">
                    {pack.contactEmailUs}
                  </span>
                  <span className="text-base font-sans font-semibold text-brand-gold-100 block mt-0.5">
                    info@globalcareinfo.com
                  </span>
                </div>
              </div>
              <span className="text-sm font-sans font-medium text-brand-gold-400 group-hover:translate-x-1 transition-transform">
                Email Us →
              </span>
            </a>

            {/* Tel Call Line Slot */}
            <a 
              href="tel:+971507188306" 
              className="p-6 bg-[#040812] border border-brand-gold-500/10 hover:border-brand-gold-500/25 rounded-2xl transition-all duration-300 flex items-center justify-between group cursor-pointer font-sans"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-brand-gold-500/5 border border-brand-gold-500/15 flex items-center justify-center text-brand-gold-400 font-bold shrink-0">
                  📞
                </div>
                <div>
                  <span className="text-xs font-sans tracking-wide text-brand-gold-400 block font-medium">
                    {pack.contactCallUs}
                  </span>
                  <span className="text-base font-sans font-semibold text-brand-gold-100 block mt-0.5">
                    +971 50 718 8306
                  </span>
                </div>
              </div>
              <span className="text-sm font-sans font-medium text-brand-gold-400 group-hover:translate-x-1 transition-transform">
                Call Now →
              </span>
            </a>

            {/* Headquarters address box */}
            <div className="p-6 bg-[#040812] border border-brand-gold-500/5 rounded-2xl text-left font-sans">
              <span className="text-xs font-sans text-brand-gold-400 block mb-2 font-semibold">
                {pack.contactOffice}
              </span>
              <p className="text-sm text-brand-gold-200 font-light leading-relaxed mb-1.5">
                Dubai Silicon Oasis, HQ Building, Wing D, Office 504
              </p>
              <p className="text-xs font-sans font-medium text-brand-gold-500">
                Dubai, United Arab Emirates
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
