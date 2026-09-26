import React from "react";
import { LanguagePack } from "../data/corporateData";
import { ArrowUpRight, BrainCircuit, CheckCircle2, Compass, Network } from "lucide-react";

interface WhatWeDoProps {
  lang: "EN" | "ZH" | "AR";
  pack: LanguagePack;
}

export default function WhatWeDo({ lang }: WhatWeDoProps) {
  const isRtl = lang === "AR";
  const copy = {
    EN: {
      label: "What We Do",
      title: "THREE CAPABILITIES. ONE EXECUTION PLATFORM.",
      subtitle: "GCI brings market access, cross-border resources and operating systems together so opportunities can move into execution.",
      supportingLabel: "Supporting capabilities",
      services: [
        {
          idx: "01", icon: Compass, title: "MARKET ENTRY & BUSINESS EXPANSION",
          desc: "Helping companies enter, establish and expand in new markets through strategy, local partnerships and coordinated execution support.",
          bullets: ["Market Entry Strategy", "Local Partnerships", "Company Establishment Support", "Regulatory & Licensing Coordination", "Business Expansion", "Banking & Tax Coordination", "Business Development & Commercial Coordination", "Ongoing Local Execution Support"],
          note: "GCI coordinates setup, licensing, banking, tax and compliance requirements with qualified local providers; regulated legal, tax and accounting advice remains with licensed professionals."
        },
        {
          idx: "02", icon: Network, title: "SUPPLY CHAIN & PROJECT EXECUTION",
          desc: "Connecting qualified suppliers, procurement resources and site execution support across China, the GCC and cross-border projects.",
          bullets: ["Supplier Sourcing & Procurement", "China / GCC Supply Chain Coordination", "Supplier Identification & Verification", "Project & Site Execution Support", "Workforce & Site Resources", "Building Materials & FF&E", "Logistics / Mobilization Coordination", "Cross-Border Project Coordination"],
          note: "Workforce, accommodation, transportation and site resources are coordinated as one part of wider supply chain and project execution."
        },
        {
          idx: "03", icon: BrainCircuit, title: "AI & BUSINESS OPERATIONS",
          desc: "Helping businesses redesign and digitize how work gets done through AI-enabled operations, connected internal systems and management tools.",
          bullets: ["Business Process Digitization", "AI-enabled Operations", "CRM & Customer Operations", "Workflow & Internal Systems", "Operational Intelligence", "Automation & Management Tools", "Procurement & Project Operations", "Workforce & Management Systems"],
          note: "GCI focuses on operating models and execution efficiency — not standalone software outsourcing."
        }
      ]
    },
    ZH: {
      label: "核心能力", title: "三大能力，一个跨境商业执行平台。", subtitle: "GCI 将市场准入、跨境资源与企业运营系统整合在同一执行框架中。", supportingLabel: "支持性子能力",
      services: [
        { idx: "01", icon: Compass, title: "市场进入与业务拓展", desc: "通过市场进入策略、本地合作伙伴和协调执行支持，帮助企业进入、落地并拓展新市场。", bullets: ["市场进入策略", "本地合作伙伴", "公司设立支持", "监管与许可协调", "业务拓展", "银行与税务协调", "业务开发与商业协调", "持续本地执行支持"], note: "GCI 与具备资质的本地服务机构协调公司设立、许可、银行、税务及合规需求；受监管的法律、税务和会计意见由持牌专业机构提供。" },
        { idx: "02", icon: Network, title: "供应链与项目执行", desc: "连接中国、海湾地区及跨境项目所需的合格供应商、采购资源与现场执行支持。", bullets: ["供应商寻源与采购", "中国 / 海湾供应链协调", "供应商识别与核验", "项目与现场执行支持", "劳动力与现场资源", "建材与 FF&E", "物流 / 动员协调", "跨境项目协调"], note: "劳动力、住宿、交通和现场资源作为供应链与项目执行整体能力的一部分进行协调。" },
        { idx: "03", icon: BrainCircuit, title: "AI 与企业运营", desc: "通过 AI 驱动运营、互联内部系统和管理工具，帮助企业重构并数字化实际工作方式。", bullets: ["业务流程数字化", "AI 驱动运营", "CRM 与客户运营", "工作流与内部系统", "运营智能", "自动化与管理工具", "采购与项目运营", "劳动力与管理系统"], note: "GCI 聚焦运营模式与执行效率提升，而不是单纯的软件外包开发。" }
      ]
    },
    AR: {
      label: "قدراتنا", title: "ثلاث قدرات. منصة تنفيذ واحدة.", subtitle: "تجمع GCI بين دخول الأسواق والموارد العابرة للحدود وأنظمة التشغيل لتحويل الفرص إلى تنفيذ.", supportingLabel: "قدرات داعمة",
      services: [
        { idx: "01", icon: Compass, title: "دخول السوق وتطوير الأعمال", desc: "مساعدة الشركات على دخول الأسواق الجديدة والتأسيس والتوسع عبر الاستراتيجية والشراكات المحلية ودعم التنفيذ المنسق.", bullets: ["استراتيجية دخول السوق", "الشراكات المحلية", "دعم تأسيس الشركات", "تنسيق اللوائح والتراخيص", "تطوير الأعمال", "تنسيق البنوك والضرائب", "تطوير الأعمال والتنسيق التجاري", "دعم التنفيذ المحلي المستمر"], note: "تنسق GCI متطلبات التأسيس والتراخيص والبنوك والضرائب والامتثال مع مزودي خدمات محليين مؤهلين، بينما تبقى الاستشارات المنظمة لدى المهنيين المرخصين." },
        { idx: "02", icon: Network, title: "سلسلة الإمداد وتنفيذ المشاريع", desc: "ربط الموردين المؤهلين وموارد المشتريات ودعم التنفيذ الميداني عبر الصين ودول الخليج والمشاريع العابرة للحدود.", bullets: ["البحث عن الموردين والمشتريات", "تنسيق سلاسل الإمداد بين الصين والخليج", "تحديد الموردين والتحقق منهم", "دعم تنفيذ المشاريع والمواقع", "موارد القوى العاملة والموقع", "مواد البناء وFF&E", "تنسيق اللوجستيات والتعبئة", "تنسيق المشاريع العابرة للحدود"], note: "يتم تنسيق القوى العاملة والسكن والنقل وموارد الموقع كجزء من تنفيذ سلسلة الإمداد والمشروع." },
        { idx: "03", icon: BrainCircuit, title: "الذكاء الاصطناعي وعمليات الأعمال", desc: "مساعدة الشركات على إعادة تصميم ورقمنة العمل من خلال عمليات مدعومة بالذكاء الاصطناعي وأنظمة داخلية مترابطة وأدوات إدارة.", bullets: ["رقمنة عمليات الأعمال", "عمليات مدعومة بالذكاء الاصطناعي", "إدارة العملاء وCRM", "سير العمل والأنظمة الداخلية", "الذكاء التشغيلي", "أدوات الأتمتة والإدارة", "عمليات المشتريات والمشاريع", "أنظمة القوى العاملة والإدارة"], note: "تركز GCI على نماذج التشغيل وكفاءة التنفيذ، وليس على التعهيد البرمجي المستقل." }
      ]
    }
  }[lang];

  return (
    <section id="what-we-do" className="py-10 md:py-12 bg-[#030611] border-b border-brand-gold-500/10">
      <div className="w-full max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8" dir={isRtl ? "rtl" : "ltr"}>
        
        {/* Section Header */}
        <div className={`max-w-3xl mb-7 ${isRtl ? "text-right" : "text-left"}`}>
          <div className="flex items-center gap-2 mb-3 justify-start">
            <span className="h-[1px] w-8 bg-brand-gold-500" />
            <span className="text-sm tracking-wide font-sans text-brand-gold-400 font-medium uppercase">
              {copy.label}
            </span>
          </div>
          <h2 id="whatwedo-title" className="text-3xl md:text-4xl font-display font-semibold text-brand-gold-100 tracking-wide leading-snug">
            {copy.title}
          </h2>
          <p className="mt-3 text-base text-brand-gold-200/80 max-w-2xl font-light leading-relaxed">
            {copy.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {copy.services.map((svc) => {
            const Icon = svc.icon;
            const primaryBullets = svc.bullets.slice(0, 5);
            const supportingBullets = svc.bullets.slice(5);
            return (
            <div
              key={svc.idx}
              className="relative p-4 sm:p-5 bg-[#050a15] rounded-2xl border border-brand-gold-500/10 hover:border-brand-gold-500/35 transition-all duration-300 flex flex-col group overflow-hidden"
            >
              <span className="absolute -right-2 -top-6 text-[7rem] font-display text-brand-gold-500/[0.035] select-none">{svc.idx}</span>
              <div className="relative flex-1">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="p-2.5 bg-brand-gold-500/5 rounded-xl border border-brand-gold-500/15">
                    <Icon className="w-5 h-5 text-brand-gold-400" />
                  </div>
                  <span className="text-xs font-mono text-brand-gold-500/70">{svc.idx}</span>
                </div>
                <h3 className="text-lg font-display font-semibold text-brand-gold-100 tracking-wide leading-snug">{svc.title}</h3>
                <p className="text-[13px] text-brand-gold-200/80 font-light leading-snug mt-3 mb-4">{svc.desc}</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-2 border-t border-brand-gold-500/10 pt-4 text-xs font-medium text-brand-gold-100/85">
                  {primaryBullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2 items-start leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold-500 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-brand-gold-500/[0.07]">
                  <p className="mb-2 text-[9px] uppercase tracking-[0.16em] text-brand-gold-500/40">{copy.supportingLabel}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] leading-snug text-brand-gold-300/45">
                    {supportingBullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2 items-start leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-brand-gold-500/35 shrink-0 mt-1.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="relative mt-3 pt-3 border-t border-brand-gold-500/10 text-[10px] leading-snug text-brand-gold-300/60 flex gap-2">
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0 mt-0.5" />{svc.note}
              </p>
            </div>
          )})}
        </div>

      </div>

    </section>
  );
}
