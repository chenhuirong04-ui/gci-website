import React, { useState } from "react";
import { LanguagePack } from "../data/corporateData";
import { ArrowRight, Check, Waypoints } from "lucide-react";

interface ContactSectionProps {
  lang: "EN" | "ZH" | "AR";
  pack: LanguagePack;
}

const INQUIRY_TYPES: Record<"EN" | "ZH" | "AR", string[]> = {
  EN: [
    "China → Middle East",
    "China → Europe",
    "Europe → China",
    "Africa → GCC / Global",
    "Cross-Border Projects",
    "AI Business Operations"
  ],
  ZH: [
    "中国 → 中东",
    "中国 → 欧洲",
    "欧洲 → 中国",
    "非洲 → 海湾 / 全球",
    "跨境项目",
    "AI 企业运营"
  ],
  AR: [
    "الصين ← الشرق الأوسط",
    "الصين ← أوروبا",
    "أوروبا ← الصين",
    "أفريقيا ← الخليج / العالم",
    "مشاريع عابرة للحدود",
    "عمليات الأعمال بالذكاء الاصطناعي"
  ]
};

type RouteCopy = {
  title: string;
  start: string;
  end: string;
  value: string;
};

const SELECTOR_COPY: Record<"EN" | "ZH" | "AR", { label: string; title: string; subtitle: string; action: string }> = {
  EN: {
    label: "Market Path Selector",
    title: "Where Is Your Next Market?",
    subtitle: "Choose a corridor. Explore how GCI can connect market access, resources and execution.",
    action: "Select route"
  },
  ZH: {
    label: "市场路径导航",
    title: "您的下一站市场在哪里？",
    subtitle: "选择一条市场路径，查看 GCI 如何连接市场进入、资源与执行。",
    action: "选择路径"
  },
  AR: {
    label: "محدد مسار السوق",
    title: "أين سوقك التالي؟",
    subtitle: "اختر مساراً واكتشف كيف تربط GCI بين دخول السوق والموارد والتنفيذ.",
    action: "اختر المسار"
  }
};

const ROUTES: Record<"EN" | "ZH" | "AR", RouteCopy[]> = {
  EN: [
    { title: "China → Middle East", start: "China", end: "Middle East", value: "Market Entry · Local Partners · Project Execution" },
    { title: "China → Europe", start: "China", end: "Europe", value: "Market Access · Partnerships · Supply Chain" },
    { title: "Europe → China", start: "Europe", end: "China", value: "Suppliers · Manufacturing · Technology" },
    { title: "Africa → GCC / Global", start: "Africa", end: "GCC / Global", value: "Workforce · Project Resources · Supply Chain" },
    { title: "Cross-Border Projects", start: "Project Need", end: "Delivery", value: "Procurement · Coordination · Delivery" },
    { title: "AI Business Operations", start: "Business Process", end: "AI-enabled Operations", value: "Systems · Workflow · AI-enabled Operations" }
  ],
  ZH: [
    { title: "中国 → 中东", start: "中国", end: "中东", value: "市场进入 · 本地合作伙伴 · 项目执行" },
    { title: "中国 → 欧洲", start: "中国", end: "欧洲", value: "市场进入 · 合作伙伴 · 供应链" },
    { title: "欧洲 → 中国", start: "欧洲", end: "中国", value: "供应商 · 制造能力 · 技术" },
    { title: "非洲 → 海湾 / 全球", start: "非洲", end: "海湾 / 全球", value: "劳动力 · 项目资源 · 供应链" },
    { title: "跨境项目", start: "项目需求", end: "交付", value: "采购 · 协调 · 交付" },
    { title: "AI 企业运营", start: "业务流程", end: "AI 赋能运营", value: "系统 · 工作流 · AI 赋能运营" }
  ],
  AR: [
    { title: "الصين ← الشرق الأوسط", start: "الصين", end: "الشرق الأوسط", value: "دخول السوق · شركاء محليون · تنفيذ المشاريع" },
    { title: "الصين ← أوروبا", start: "الصين", end: "أوروبا", value: "الوصول إلى السوق · الشراكات · سلسلة التوريد" },
    { title: "أوروبا ← الصين", start: "أوروبا", end: "الصين", value: "الموردون · التصنيع · التكنولوجيا" },
    { title: "أفريقيا ← الخليج / العالم", start: "أفريقيا", end: "الخليج / العالم", value: "القوى العاملة · موارد المشاريع · سلسلة التوريد" },
    { title: "مشاريع عابرة للحدود", start: "احتياج المشروع", end: "التسليم", value: "المشتريات · التنسيق · التسليم" },
    { title: "عمليات الأعمال بالذكاء الاصطناعي", start: "عمليات الأعمال", end: "عمليات مدعومة بالذكاء الاصطناعي", value: "الأنظمة · سير العمل · عمليات مدعومة بالذكاء الاصطناعي" }
  ]
};

export default function ContactSection({ lang, pack }: ContactSectionProps) {
  const isRtl = lang === "AR";
  const inquiryTypes = INQUIRY_TYPES[lang];
  const selectorCopy = SELECTOR_COPY[lang];
  const routes = ROUTES[lang];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    inquiryTypeIndex: 0,
    message: ""
  });
  const [submitted, setSubmitted] = useState<false | "success" | "error" | "no-endpoint">(false);
  const [sending, setSending] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Always record the inquiry type in English for internal consistency, regardless of the
    // language the visitor filled the form in.
    const inquiryTypeEN = INQUIRY_TYPES.EN[formData.inquiryTypeIndex];
    const subject = encodeURIComponent(`[GCI Inquiry] ${formData.company} — ${inquiryTypeEN}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nInquiry Type: ${inquiryTypeEN}\n\n${formData.message}`
    );
    window.location.href = `mailto:info@globalcareinfo.com?subject=${subject}&body=${body}`;
    setSubmitted("success");
    setFormData({ name: "", email: "", company: "", inquiryTypeIndex: 0, message: "" });
  };

  return (
    <>
      <section id="market-path-selector" className="relative overflow-hidden border-b border-brand-gold-500/10 bg-[#071021] py-10 md:py-12">
        <div className="absolute inset-0 pointer-events-none opacity-70" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_26%,rgba(194,156,83,.12),transparent_24%),radial-gradient(circle_at_82%_64%,rgba(80,118,157,.12),transparent_28%)]" />
          <svg viewBox="0 0 1440 620" className="h-full w-full" preserveAspectRatio="none">
            <path d="M-80 430 C 220 250, 370 520, 650 320 S 1080 110, 1520 260" fill="none" stroke="rgba(194,156,83,.08)" strokeWidth="1" strokeDasharray="5 12" />
            <path d="M-100 180 C 280 360, 480 70, 820 230 S 1160 500, 1510 390" fill="none" stroke="rgba(130,166,196,.07)" strokeWidth="1" />
          </svg>
        </div>

        <div className="relative w-full max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8" dir={isRtl ? "rtl" : "ltr"}>
          <div className="grid gap-4 lg:grid-cols-[.72fr_1.28fr] lg:items-end mb-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[.2em] text-brand-gold-400">
                <Waypoints className="h-4 w-4" />
                <span>{selectorCopy.label}</span>
              </div>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-wide text-brand-gold-100 md:text-4xl">
                {selectorCopy.title}
              </h2>
            </div>
            <p className="max-w-2xl text-sm font-light leading-relaxed text-brand-gold-200/75 lg:justify-self-end">
              {selectorCopy.subtitle}
            </p>
          </div>

          <nav aria-label={selectorCopy.label} className="relative overflow-hidden rounded-[1.75rem] border border-brand-gold-500/10 bg-[#030611]/55 shadow-[0_24px_80px_rgba(0,0,0,.22)]">
            <div className="pointer-events-none absolute left-8 right-8 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-brand-gold-500/15 to-transparent xl:block" aria-hidden="true" />
            <div className="grid md:grid-cols-2 xl:grid-cols-3">
              {routes.map((route, index) => (
                <a
                  key={route.title}
                  href="#contact-section"
                  onClick={() => setFormData((current) => ({ ...current, inquiryTypeIndex: index }))}
                  className={`group relative overflow-hidden px-5 py-3.5 transition-colors duration-300 hover:bg-brand-gold-500/[.045] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-brand-gold-400 ${index % 3 !== 2 ? "xl:border-r xl:border-brand-gold-500/10" : ""} ${index < 3 ? "border-b border-brand-gold-500/10" : index < 4 ? "border-b border-brand-gold-500/10 md:border-b-0" : ""} ${index % 2 === 0 ? "md:border-r md:border-brand-gold-500/10 xl:border-r" : ""}`}
                >
                  <div className="flex items-center justify-between gap-4 text-[9px] uppercase tracking-[.16em] text-brand-gold-500/55">
                    <span>{route.start}</span>
                    <span className="font-mono">0{index + 1}</span>
                    <span>{route.end}</span>
                  </div>

                  <div className="my-4 flex items-center" aria-hidden="true">
                    <span className="h-2 w-2 shrink-0 rounded-full border border-brand-gold-400/70 bg-[#071021] shadow-[0_0_0_4px_rgba(194,156,83,.05)]" />
                    <span className="relative h-px flex-1 bg-brand-gold-500/20 after:absolute after:inset-y-0 after:left-0 after:w-0 after:bg-brand-gold-400 after:transition-all after:duration-300 group-hover:after:w-full" />
                    <ArrowRight className={`h-4 w-4 shrink-0 text-brand-gold-500/65 transition-colors group-hover:text-brand-gold-300 ${isRtl ? "rotate-180" : ""}`} />
                    <span className="h-2 w-2 shrink-0 rounded-full border border-brand-gold-400/70 bg-[#071021] shadow-[0_0_0_4px_rgba(194,156,83,.05)]" />
                  </div>

                  <h3 className="font-display text-lg text-brand-gold-100 transition-colors group-hover:text-brand-gold-50">
                    {route.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-brand-gold-200/65">
                    {route.value}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-2 text-[9px] uppercase tracking-[.16em] text-brand-gold-500/55 transition-colors group-hover:text-brand-gold-300">
                    {selectorCopy.action}
                    <ArrowRight className={`h-3 w-3 ${isRtl ? "rotate-180" : ""}`} />
                  </span>
                </a>
              ))}
            </div>
          </nav>
        </div>
      </section>

    <section id="contact-section" className="py-10 md:py-12 bg-[#030611] border-b border-brand-gold-500/10">
      <div className="w-full max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-8 font-sans" dir={isRtl ? "rtl" : "ltr"}>
        
        {/* Section Head */}
        <div className="max-w-3xl mb-6 text-left">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8 bg-brand-gold-500" />
            <span className="text-sm tracking-wide font-sans text-brand-gold-400 font-medium uppercase">
              {pack.contactLabel}
            </span>
          </div>
          <h2 className="text-3xl font-display font-semibold text-brand-gold-100 tracking-wide leading-snug">
            {pack.contactFormSubmit}
          </h2>
        </div>

        {/* Form + Side Info Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Left Block: Premium Corporate Form */}
          <div className="lg:col-span-7 bg-[#050a15] rounded-2xl border border-brand-gold-500/10 p-4 md:p-5 flex flex-col justify-between">
            {submitted === "success" ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center select-none animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-6">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h4 className="text-lg font-serif text-brand-gold-100 font-bold mb-3">
                  {lang === "ZH" ? "商业意向安全送达" : "Inbound Inquiry Transmitted"}
                </h4>
                <p className="text-xs text-brand-gold-300/80 max-w-md leading-relaxed">
                  {pack.contactFormSuccess}
                </p>
              </div>
            ) : submitted === "no-endpoint" || submitted === "error" ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center select-none">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-6">
                  <span className="text-2xl">⚠</span>
                </div>
                <h4 className="text-base font-serif text-brand-gold-100 font-bold mb-3">
                  {submitted === "error" ? "Submission Failed" : "Form Not Configured"}
                </h4>
                <p className="text-xs text-brand-gold-300/70 max-w-sm leading-relaxed mb-6">
                  Please contact us directly by email or WhatsApp, or configure the Formspree endpoint.
                </p>
                <div className="flex flex-col gap-2 text-xs text-brand-gold-400">
                  <a href="mailto:info@globalcareinfo.com" className="underline underline-offset-2 hover:text-brand-gold-200">info@globalcareinfo.com</a>
                  <a href="https://wa.me/971507188306" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-brand-gold-200">WhatsApp +971 50 718 8306</a>
                </div>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-xs text-brand-gold-500/60 hover:text-brand-gold-400 underline underline-offset-2 cursor-pointer">
                  Try again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-left">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full bg-[#030611] border border-brand-gold-500/12 text-brand-gold-100 px-4 py-3 rounded-xl text-sm tracking-wide focus:outline-none focus:border-brand-gold-400 font-sans"
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
                      className="w-full bg-[#030611] border border-brand-gold-500/12 text-brand-gold-100 px-4 py-3 rounded-xl text-sm tracking-wide focus:outline-none focus:border-brand-gold-400 font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full bg-[#030611] border border-brand-gold-500/12 text-brand-gold-100 px-4 py-3 rounded-xl text-sm tracking-wide focus:outline-none focus:border-brand-gold-400 font-sans"
                    />
                  </div>

                  {/* Corridor selection field */}
                  <div>
                    <label className="text-xs font-sans tracking-wide text-brand-gold-300 block mb-2 font-medium">
                      {pack.contactFormCorridor}
                    </label>
                    <select
                      value={formData.inquiryTypeIndex}
                      onChange={(e) => setFormData({ ...formData, inquiryTypeIndex: Number(e.target.value) })}
                      className="w-full bg-[#030611] border border-brand-gold-500/12 text-brand-gold-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-brand-gold-400 cursor-pointer font-sans"
                    >
                      {inquiryTypes.map((option, i) => (
                        <option key={i} value={i}>{option}</option>
                      ))}
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
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#030611] border border-brand-gold-500/12 text-brand-gold-100 p-4 rounded-xl text-sm tracking-wide focus:outline-none focus:border-brand-gold-400 outline-none leading-relaxed font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 hover:from-brand-gold-400 hover:to-brand-gold-500 disabled:opacity-50 text-[#030611] text-sm font-sans font-bold py-3.5 rounded-xl transition-all shadow-md shadow-brand-gold-500/15 cursor-pointer active:scale-98"
                >
                  {sending ? (lang === "ZH" ? "正在传输至迪拜总部..." : "TRANSMITTING TO DUBAI HQ...") : pack.contactFormSubmit}
                </button>

              </form>
            )}
          </div>

          {/* Right Block: Instant Connection Slots (WhatsApp, Email & Phone) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            
            {/* WhatsApp Business Slot */}
            <a 
              href="https://wa.me/971507188306" 
              target="_blank" 
              rel="noreferrer"
              className="p-4 bg-[#0c1e13] border border-emerald-500/20 hover:border-emerald-500/40 rounded-2xl transition-all duration-300 flex items-center justify-between group cursor-pointer font-sans"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold shrink-0">
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
              className="p-4 bg-[#040812] border border-brand-gold-500/10 hover:border-brand-gold-500/25 rounded-2xl transition-all duration-300 flex items-center justify-between group cursor-pointer font-sans"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-brand-gold-500/5 border border-brand-gold-500/15 flex items-center justify-center text-brand-gold-400 font-bold shrink-0">
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
              className="p-4 bg-[#040812] border border-brand-gold-500/10 hover:border-brand-gold-500/25 rounded-2xl transition-all duration-300 flex items-center justify-between group cursor-pointer font-sans"
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-brand-gold-500/5 border border-brand-gold-500/15 flex items-center justify-center text-brand-gold-400 font-bold shrink-0">
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
            <div className="p-4 bg-[#040812] border border-brand-gold-500/5 rounded-2xl text-left font-sans">
              <span className="text-xs font-sans text-brand-gold-400 block mb-2 font-semibold">
                {pack.contactOffice}
              </span>
              <p className="text-sm text-brand-gold-200 font-light leading-relaxed mb-1.5">
                {lang === "ZH"
                  ? "迪拜 Jebel Ali，Dubai Traders Market，2317-1"
                  : lang === "AR"
                  ? "Dubai Traders Market، 2317-1، جبل علي"
                  : "Dubai Traders Market, 2317-1, Jebel Ali"}
              </p>
              <p className="text-xs font-sans font-medium text-brand-gold-500">
                {lang === "ZH" ? "阿联酋迪拜" : lang === "AR" ? "دبي، الإمارات العربية المتحدة" : "Dubai, United Arab Emirates"}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
    </>
  );
}
