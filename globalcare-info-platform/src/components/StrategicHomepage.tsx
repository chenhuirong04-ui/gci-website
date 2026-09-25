import { ArrowRight, Building2, CarFront, CircuitBoard, Construction, Factory, Globe2, Landmark, PackageSearch, PlaneTakeoff, Radar, Route, Ship } from "lucide-react";

type Lang = "EN" | "ZH" | "AR";

const content = {
  EN: {
    directionLabel: "Cross-Border Model", directionTitle: "ONE PLATFORM.\nTWO DIRECTIONS.",
    directionIntro: "One cross-border platform connecting market access, resources and execution capabilities in both directions.",
    chinaGlobal: "CHINA → GLOBAL", chinaGlobalDesc: "Helping Chinese companies enter overseas markets and move from market access to coordinated local execution.", chinaGlobalItems: ["Market Access", "Local Partnerships", "Supply Chain", "Project Execution", "Business Operations Support"],
    globalChina: "GLOBAL → CHINA", globalChinaDesc: "Helping international companies connect with China’s suppliers, manufacturing, technology and commercial resources, while coordinating procurement, supply chains and cross-border projects.", globalChinaItems: ["Suppliers & Manufacturing", "Products & Technology", "Commercial Partners", "Procurement Coordination", "Supply Chain & Projects"],
    marketsLabel: "Core Markets & Opportunity Network", marketsTitle: "WHERE WE OPERATE", marketsIntro: "GCI serves four core markets through market coverage, partner networks and execution capabilities. Latin America remains focused on opportunity development.",
    sectorsLabel: "Sector Focus", sectorsTitle: "SIX PRIORITY SECTORS", sectorsIntro: "Across these sectors, GCI supports market access, resource connection, supply chain coordination, project execution and business operations.",
    casesLabel: "Proof of Capability", casesTitle: "EXECUTION IN PRACTICE", casesIntro: "Representative capability scenarios. Client names, contract values and unverified performance claims are intentionally excluded.",
    europeLabel: "Europe Market Entry", europeTitle: "CHINA × EUROPE", europeSubtitle: "Connecting Chinese capabilities with European markets — starting with Spain.", europeCta: "Explore Europe Market",
    intelligenceLabel: "GCI Market Intelligence", intelligenceTitle: "SIGNALS FOR CROSS-BORDER DECISIONS", intelligenceIntro: "A focused front-end entry point for the markets, sectors and operating shifts that shape expansion decisions.", intelligenceCta: "Discuss an Intelligence Need"
  },
  ZH: {
    directionLabel: "跨境商业模型", directionTitle: "一个平台。\n两个方向。", directionIntro: "一个跨境商业平台，双向连接市场准入、商业资源与执行能力。",
    chinaGlobal: "中国 → 全球", chinaGlobalDesc: "帮助中国企业进入海外市场，从市场准入推进到协调一致的本地执行。", chinaGlobalItems: ["市场准入", "本地合作伙伴", "供应链", "项目执行", "企业运营支持"],
    globalChina: "全球 → 中国", globalChinaDesc: "帮助海外企业连接中国的供应商、制造能力、技术、产品和商业资源，并协调采购、供应链与跨境项目执行。", globalChinaItems: ["供应商与制造能力", "产品与技术", "商业伙伴", "采购协调", "供应链与项目"],
    marketsLabel: "核心市场与机会网络", marketsTitle: "我们的市场", marketsIntro: "GCI 通过市场覆盖、合作伙伴网络与执行能力服务四大核心市场；拉丁美洲继续聚焦机会开发。",
    sectorsLabel: "重点行业", sectorsTitle: "六大重点行业", sectorsIntro: "在这六大行业中，GCI 提供市场进入、资源连接、供应链协调、项目执行与企业运营支持。",
    casesLabel: "能力证明", casesTitle: "执行实践", casesIntro: "以下为匿名能力场景，不使用未经确认的客户名称、合同金额或绩效数据。",
    europeLabel: "欧洲市场进入", europeTitle: "中国 × 欧洲", europeSubtitle: "连接中国能力与欧洲市场——从西班牙开始。", europeCta: "探索欧洲市场",
    intelligenceLabel: "GCI 市场情报", intelligenceTitle: "支持跨境决策的市场信号", intelligenceIntro: "围绕影响市场拓展决策的区域、行业与运营变化建立前端情报入口。", intelligenceCta: "沟通情报需求"
  },
  AR: {
    directionLabel: "نموذج عابر للحدود", directionTitle: "منصة واحدة.\nاتجاهان.", directionIntro: "منصة أعمال عابرة للحدود تربط دخول السوق والموارد وقدرات التنفيذ في الاتجاهين.",
    chinaGlobal: "الصين ← العالم", chinaGlobalDesc: "مساعدة الشركات الصينية على دخول الأسواق الخارجية والانتقال من الوصول إلى السوق إلى التنفيذ المحلي المنسق.", chinaGlobalItems: ["الوصول إلى السوق", "الشراكات المحلية", "سلسلة الإمداد", "تنفيذ المشاريع", "دعم عمليات الأعمال"],
    globalChina: "العالم ← الصين", globalChinaDesc: "مساعدة الشركات الدولية على التواصل مع الموردين وقدرات التصنيع والتكنولوجيا والمنتجات والموارد التجارية في الصين، مع تنسيق المشتريات وسلاسل الإمداد والمشاريع العابرة للحدود.", globalChinaItems: ["الموردون والتصنيع", "المنتجات والتكنولوجيا", "الشركاء التجاريون", "تنسيق المشتريات", "سلسلة الإمداد والمشاريع"],
    marketsLabel: "الأسواق الأساسية وشبكة الفرص", marketsTitle: "أين نعمل", marketsIntro: "تخدم GCI أربعة أسواق أساسية من خلال تغطية السوق وشبكات الشركاء وقدرات التنفيذ، بينما تواصل أمريكا اللاتينية التركيز على تطوير الفرص.",
    sectorsLabel: "القطاعات ذات الأولوية", sectorsTitle: "ستة قطاعات ذات أولوية", sectorsIntro: "تدعم GCI في هذه القطاعات دخول السوق وربط الموارد وتنسيق سلاسل الإمداد وتنفيذ المشاريع وعمليات الأعمال.",
    casesLabel: "إثبات القدرة", casesTitle: "التنفيذ في الواقع", casesIntro: "نماذج قدرة مجهولة الهوية دون أسماء عملاء أو قيم عقود أو ادعاءات غير مؤكدة.",
    europeLabel: "دخول السوق الأوروبية", europeTitle: "الصين × أوروبا", europeSubtitle: "ربط القدرات الصينية بالأسواق الأوروبية — بدءاً من إسبانيا.", europeCta: "استكشف سوق أوروبا",
    intelligenceLabel: "معلومات أسواق GCI", intelligenceTitle: "إشارات لقرارات عابرة للحدود", intelligenceIntro: "بوابة مركزة للأسواق والقطاعات والتحولات التشغيلية التي تشكل قرارات التوسع.", intelligenceCta: "ناقش احتياجات المعلومات"
  }
} as const;

const markets = {
  EN: [
    { region: "MIDDLE EAST", focus: "", detail: "Market Entry · Project Execution · Supply Chain · Local Execution Network", scope: "CORE MARKET · EXECUTION & PARTNER NETWORK", icon: Landmark, opportunity: false },
    { region: "AFRICA", focus: "", detail: "Construction & Infrastructure · Workforce & Site Resources · Supply Chain & Procurement · Local Project Coordination", scope: "CORE MARKET · EXECUTION & PARTNER NETWORK", icon: Route, opportunity: false },
    { region: "EUROPE", focus: "CURRENT FOCUS · SPAIN / BARCELONA / CATALONIA", detail: "Market Entry · Local Partnerships · Industrial & Project Opportunities · Supply Chain & Procurement · Local Execution Network", scope: "CORE MARKET · MARKET COVERAGE & PARTNER NETWORK", icon: Globe2, opportunity: false },
    { region: "CHINA", focus: "", detail: "Suppliers & Manufacturing · Technology & Products · Commercial Partners · Supply Chain Resources", scope: "CORE MARKET · MANUFACTURING & COMMERCIAL NETWORK", icon: Factory, opportunity: false },
    { region: "LATIN AMERICA", focus: "", detail: "Opportunity Development · Partner Network", scope: "OPPORTUNITY DEVELOPMENT · PARTNER NETWORK", icon: Globe2, opportunity: true }
  ],
  ZH: [
    { region: "中东", focus: "", detail: "市场进入 · 项目执行 · 供应链 · 本地执行网络", scope: "核心市场 · 执行与合作伙伴网络", icon: Landmark, opportunity: false },
    { region: "非洲", focus: "", detail: "建筑与基础设施 · 劳动力与现场资源 · 供应链与采购 · 本地项目协调", scope: "核心市场 · 执行与合作伙伴网络", icon: Route, opportunity: false },
    { region: "欧洲", focus: "当前重点 · 西班牙 / 巴塞罗那 / 加泰罗尼亚", detail: "市场进入 · 本地合作伙伴 · 工业与项目机会 · 供应链与采购 · 本地执行网络", scope: "核心市场 · 市场覆盖与合作伙伴网络", icon: Globe2, opportunity: false },
    { region: "中国", focus: "", detail: "供应商与制造能力 · 技术与产品 · 商业伙伴 · 供应链资源", scope: "核心市场 · 制造与商业网络", icon: Factory, opportunity: false },
    { region: "拉丁美洲", focus: "", detail: "机会开发 · 合作伙伴网络", scope: "机会开发 · 合作伙伴网络", icon: Globe2, opportunity: true }
  ],
  AR: [
    { region: "الشرق الأوسط", focus: "", detail: "دخول السوق · تنفيذ المشاريع · سلسلة الإمداد · شبكة التنفيذ المحلي", scope: "سوق أساسي · شبكة التنفيذ والشركاء", icon: Landmark, opportunity: false },
    { region: "أفريقيا", focus: "", detail: "البناء والبنية التحتية · موارد القوى العاملة والموقع · سلسلة الإمداد والمشتريات · تنسيق المشاريع المحلية", scope: "سوق أساسي · شبكة التنفيذ والشركاء", icon: Route, opportunity: false },
    { region: "أوروبا", focus: "التركيز الحالي · إسبانيا / برشلونة / كاتالونيا", detail: "دخول السوق · الشراكات المحلية · الفرص الصناعية والمشاريع · سلسلة الإمداد والمشتريات · شبكة التنفيذ المحلي", scope: "سوق أساسي · تغطية السوق وشبكة الشركاء", icon: Globe2, opportunity: false },
    { region: "الصين", focus: "", detail: "الموردون والتصنيع · التكنولوجيا والمنتجات · الشركاء التجاريون · موارد سلسلة الإمداد", scope: "سوق أساسي · شبكة التصنيع والتجارة", icon: Factory, opportunity: false },
    { region: "أمريكا اللاتينية", focus: "", detail: "تطوير الفرص · شبكة الشركاء", scope: "تطوير الفرص · شبكة الشركاء", icon: Globe2, opportunity: true }
  ]
} as const;

const sectors = {
  EN: [
    { name: "Construction & Infrastructure", description: "Market access, supplier and resource connection, supply chain coordination and project execution support.", icon: Construction },
    { name: "Automotive & New Energy", description: "Market access, product and technology connection, supply chain coordination and business expansion support.", icon: CarFront },
    { name: "Industrial & Manufacturing", description: "Supplier and manufacturing resource connection, procurement coordination and cross-border execution support.", icon: Factory },
    { name: "Interiors, Living & Building Products", description: "Market access, supplier connection, procurement coordination and project resource support.", icon: Building2 },
    { name: "Trade & Logistics", description: "Commercial resource connection, procurement, logistics and cross-border supply chain coordination.", icon: Ship },
    { name: "Technology & AI", description: "Technology connection, process digitization, AI-enabled operations and business systems support.", icon: CircuitBoard }
  ],
  ZH: [
    { name: "建筑与基础设施", description: "提供市场进入、供应商与资源连接、供应链协调及项目执行支持。", icon: Construction },
    { name: "汽车与新能源", description: "提供市场进入、产品与技术连接、供应链协调及业务拓展支持。", icon: CarFront },
    { name: "工业与制造", description: "连接供应商与制造资源，协调采购、供应链与跨境执行。", icon: Factory },
    { name: "室内空间、生活与建筑产品", description: "支持市场进入、供应商连接、采购协调与项目资源对接。", icon: Building2 },
    { name: "贸易与物流", description: "连接商业资源，协调采购、物流与跨境供应链。", icon: Ship },
    { name: "科技与人工智能", description: "连接技术资源，支持流程数字化、AI 赋能运营与企业系统建设。", icon: CircuitBoard }
  ],
  AR: [
    { name: "البناء والبنية التحتية", description: "دخول السوق وربط الموردين والموارد وتنسيق سلاسل الإمداد ودعم تنفيذ المشاريع.", icon: Construction },
    { name: "السيارات والطاقة الجديدة", description: "دخول السوق وربط المنتجات والتكنولوجيا وتنسيق سلاسل الإمداد ودعم توسع الأعمال.", icon: CarFront },
    { name: "الصناعة والتصنيع", description: "ربط الموردين وموارد التصنيع وتنسيق المشتريات ودعم التنفيذ العابر للحدود.", icon: Factory },
    { name: "العقارات والمعيشة", description: "دخول السوق وربط الموردين وتنسيق المشتريات ودعم موارد المشاريع.", icon: Building2 },
    { name: "التجارة والخدمات اللوجستية", description: "ربط الموارد التجارية وتنسيق المشتريات والخدمات اللوجستية وسلاسل الإمداد العابرة للحدود.", icon: Ship },
    { name: "التكنولوجيا والذكاء الاصطناعي", description: "ربط التكنولوجيا ورقمنة العمليات والعمليات المدعومة بالذكاء الاصطناعي وأنظمة الأعمال.", icon: CircuitBoard }
  ]
} as const;

const cases = [
  { no: "01", market: "UAE", sector: "Construction Operations", text: "Workforce deployment, project operations and digital management infrastructure supporting large-scale construction delivery." },
  { no: "02", market: "GCC", sector: "Supply Chain", text: "China sourcing, supplier coordination, commercial negotiation and delivery support for building materials, furniture and project products." },
  { no: "03", market: "UAE", sector: "Business Operations", text: "End-to-end digital operating systems covering CRM, procurement, sales, finance approval, production and management workflows." },
  { no: "04", market: "GLOBAL", sector: "Market Intelligence", text: "Continuous identification and qualification of investment, project and partnership opportunities across multiple markets." }
];

const intelligence = ["China–Europe", "Middle East", "Automotive & New Energy", "Construction & Infrastructure", "AI & Digital Transformation", "Trade & Supply Chain"];
const europeCapabilities = ["Market Entry", "Local Partnerships", "Industrial & Project Opportunities", "Supply Chain & Procurement", "Local Execution Network", "AI Business Operations"];

function SectionHead({ label, title, intro }: { label: string; title: string; intro: string }) {
  return <div className="max-w-3xl mb-12 md:mb-16"><div className="flex items-center gap-2 mb-4"><span className="h-px w-8 bg-brand-gold-500"/><span className="text-sm tracking-wide text-brand-gold-400 font-medium uppercase">{label}</span></div><h2 className="text-3xl md:text-4xl font-display font-semibold text-brand-gold-100 tracking-wide leading-snug whitespace-pre-line">{title}</h2><p className="mt-4 text-base text-brand-gold-200/75 font-light leading-relaxed max-w-2xl">{intro}</p></div>;
}

export default function StrategicHomepage({ lang }: { lang: Lang }) {
  const c = content[lang];
  const marketItems = markets[lang];
  const sectorItems = sectors[lang];
  const isRtl = lang === "AR";
  return <div dir={isRtl ? "rtl" : "ltr"}>
    <section id="platform-model" className="py-20 md:py-28 bg-[#070b18] border-b border-brand-gold-500/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6"><SectionHead label={c.directionLabel} title={c.directionTitle} intro={c.directionIntro}/>
        <div className="relative grid lg:grid-cols-[1fr_auto_1fr] gap-5 items-stretch">
          {[{title:c.chinaGlobal, desc:c.chinaGlobalDesc, items:c.chinaGlobalItems},{title:c.globalChina, desc:c.globalChinaDesc, items:c.globalChinaItems}].map((d,i)=><div key={d.title} className={`navy-gold-card rounded-2xl p-7 md:p-9 ${i===1 ? "lg:order-3" : ""}`}><div className="flex items-center gap-3 mb-5"><PlaneTakeoff className={`w-5 h-5 text-brand-gold-400 ${i===1 ? "rotate-180" : ""}`}/><h3 className="font-display text-xl text-brand-gold-100">{d.title}</h3></div><p className="text-sm text-brand-gold-200/75 mb-7">{d.desc}</p><div className="flex flex-wrap gap-2">{d.items.map(x=><span key={x} className="px-3 py-1.5 rounded-full border border-brand-gold-500/15 bg-brand-gold-500/5 text-xs text-brand-gold-200/80">{x}</span>)}</div></div>)}
          <div className="lg:order-2 flex lg:flex-col items-center justify-center gap-3 py-3 lg:py-0"><span className="w-12 lg:w-px h-px lg:h-12 bg-gradient-to-r lg:bg-gradient-to-b from-transparent via-brand-gold-500 to-transparent"/><div className="w-16 h-16 rounded-full border border-brand-gold-500/30 bg-[#030611] flex items-center justify-center shadow-[0_0_40px_rgba(194,156,83,.12)]"><span className="font-display text-brand-gold-300 font-semibold">GCI</span></div><span className="w-12 lg:w-px h-px lg:h-12 bg-gradient-to-r lg:bg-gradient-to-b from-transparent via-brand-gold-500 to-transparent"/></div>
        </div>
      </div>
    </section>

    <section id="markets" className="py-20 md:py-24 bg-[#030611] border-b border-brand-gold-500/10"><div className="max-w-7xl mx-auto px-6"><SectionHead label={c.marketsLabel} title={c.marketsTitle} intro={c.marketsIntro}/><div className="grid md:grid-cols-2 gap-px bg-brand-gold-500/10 border border-brand-gold-500/10 rounded-2xl overflow-hidden">{marketItems.map(m=>{const Icon=m.icon;return <article key={m.region} className={`bg-[#050a15] p-7 md:p-9 group ${m.opportunity ? "md:col-span-2" : ""}`}><Icon className="w-5 h-5 text-brand-gold-500 mb-7"/><h3 className="font-display text-lg text-brand-gold-100 mb-3">{m.region}</h3>{m.focus && <p className="w-fit mb-4 rounded-full border border-brand-gold-500/15 bg-brand-gold-500/5 px-2.5 py-1 text-[10px] tracking-[.14em] uppercase text-brand-gold-400/80">{m.focus}</p>}<p className="text-sm text-brand-gold-200/80 leading-relaxed max-w-3xl">{m.detail}</p><p className="mt-5 pt-4 border-t border-brand-gold-500/10 text-[10px] tracking-[.16em] uppercase text-brand-gold-500/65">{m.scope}</p></article>})}</div></div></section>

    <section id="sectors" className="py-20 md:py-24 bg-[#070b18] border-b border-brand-gold-500/10"><div className="max-w-7xl mx-auto px-6"><SectionHead label={c.sectorsLabel} title={c.sectorsTitle} intro={c.sectorsIntro}/><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{sectorItems.map((s,i)=>{const Icon=s.icon;return <article key={s.name} className="min-h-48 rounded-xl border border-brand-gold-500/10 bg-[#030611]/70 p-6 hover:border-brand-gold-500/30 transition-colors"><div className="flex items-center justify-between mb-8"><Icon className="w-5 h-5 text-brand-gold-400"/><span className="text-[10px] font-mono tracking-[.14em] text-brand-gold-500/55">0{i+1}</span></div><h3 className="font-display text-base text-brand-gold-100 mb-3">{s.name}</h3><p className="text-sm leading-relaxed text-brand-gold-200/65">{s.description}</p></article>})}</div></div></section>

    <section id="execution" className="py-20 md:py-24 bg-[#030611] border-b border-brand-gold-500/10"><div className="max-w-7xl mx-auto px-6"><SectionHead label={c.casesLabel} title={c.casesTitle} intro={c.casesIntro}/><div className="grid md:grid-cols-2 gap-6">{cases.map(x=><article key={x.no} className="navy-gold-card navy-gold-card-hover rounded-2xl p-7 md:p-8"><div className="flex items-center justify-between mb-8"><span className="font-mono text-xs text-brand-gold-500">CASE {x.no}</span><span className="px-2.5 py-1 rounded-full bg-brand-gold-500/5 border border-brand-gold-500/15 text-[10px] tracking-widest text-brand-gold-300">{x.market}</span></div><h3 className="font-display text-xl text-brand-gold-100 mb-4">{x.sector}</h3><p className="text-sm text-brand-gold-200/75 leading-relaxed">{x.text}</p></article>)}</div></div></section>

    <section id="europe" className="py-20 md:py-28 bg-[#071021] border-b border-brand-gold-500/10 relative overflow-hidden"><div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(194,156,83,.09),transparent_65%)] pointer-events-none"/><div className="max-w-7xl mx-auto px-6 relative"><div className="grid lg:grid-cols-2 gap-12 items-center"><div><SectionHead label={c.europeLabel} title={c.europeTitle} intro={c.europeSubtitle}/><a href="#contact-section" className="inline-flex items-center gap-2 text-sm font-semibold text-[#030611] bg-brand-gold-400 hover:bg-brand-gold-300 px-6 py-3 rounded-lg transition-colors">{c.europeCta}<ArrowRight className="w-4 h-4"/></a></div><div className="grid sm:grid-cols-2 gap-3">{europeCapabilities.map((x,i)=><div key={x} className="flex items-center gap-3 p-4 border border-brand-gold-500/10 bg-[#030611]/60 rounded-xl"><span className="w-7 h-7 rounded-full bg-brand-gold-500/10 text-brand-gold-400 text-[10px] flex items-center justify-center font-mono">{i+1}</span><span className="text-sm text-brand-gold-100/85">{x}</span></div>)}</div></div></div></section>

    <section id="insights-section" className="py-20 md:py-24 bg-[#030611] border-b border-brand-gold-500/10"><div className="max-w-7xl mx-auto px-6"><SectionHead label={c.intelligenceLabel} title={c.intelligenceTitle} intro={c.intelligenceIntro}/><div className="grid md:grid-cols-[1.25fr_.75fr] gap-6"><div className="grid sm:grid-cols-2 gap-px bg-brand-gold-500/10 border border-brand-gold-500/10 rounded-2xl overflow-hidden">{intelligence.map((x,i)=><div key={x} className="bg-[#050a15] p-5 flex items-center gap-3"><Radar className="w-4 h-4 text-brand-gold-500 shrink-0"/><span className="text-sm text-brand-gold-100/85">{x}</span><span className="ml-auto font-mono text-[9px] text-brand-gold-500/40">0{i+1}</span></div>)}</div><div className="rounded-2xl border border-brand-gold-500/15 bg-gradient-to-br from-brand-gold-500/10 to-transparent p-7 flex flex-col justify-between"><div><PackageSearch className="w-6 h-6 text-brand-gold-400 mb-6"/><p className="text-sm text-brand-gold-200/75 leading-relaxed">Market intelligence is developed around active expansion, sourcing and project decisions. No placeholder news or unverified claims are presented as published analysis.</p></div><a href="#contact-section" className="mt-8 inline-flex items-center gap-2 text-sm text-brand-gold-300 hover:text-brand-gold-100 transition-colors">{c.intelligenceCta}<ArrowRight className="w-4 h-4"/></a></div></div></div></section>
  </div>;
}
