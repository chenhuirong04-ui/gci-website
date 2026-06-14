import React, { useState, useEffect } from "react";
import { BookOpen, FolderSync, ShieldAlert, Newspaper, ArrowRight, ArrowLeft, Layers, Sparkles, Filter, MapPin } from "lucide-react";

// Vite production-safe image imports (raw /src/assets paths break after build hashing)
import imgSolarRiyadh from "../assets/images/case_solar_riyadh_1780768308627.png";
import imgRoboticsDubai from "../assets/images/case_robotics_dubai_1780768291268.png";
import imgMedicalMombasa from "../assets/images/case_medical_mombasa_1780768328334.png";
import imgGlobalHub from "../assets/images/gci_global_hub_connection_1780768265492.png";
import imgPortShenzhen from "../assets/images/case_port_shenzhen_1780768345006.png";

const IMG_MAP: Record<string, string> = {
  "/src/assets/images/case_solar_riyadh_1780768308627.png": imgSolarRiyadh,
  "/src/assets/images/case_robotics_dubai_1780768291268.png": imgRoboticsDubai,
  "/src/assets/images/case_medical_mombasa_1780768328334.png": imgMedicalMombasa,
  "/src/assets/images/gci_global_hub_connection_1780768265492.png": imgGlobalHub,
  "/src/assets/images/case_port_shenzhen_1780768345006.png": imgPortShenzhen,
};

// Country → unique Unsplash image for the country grid (Level 1 — each country must be distinct)
const COUNTRY_GRID_IMG: Record<string, string> = {
  "UAE / Dubai":  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",  // Dubai Marina aerial
  "Saudi Arabia": "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=600&q=80",  // Riyadh KAFD skyline
  "Qatar":        "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80",      // Doha skyline
  "Bahrain":      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80",   // Bahrain/Gulf modern architecture
  "Oman":         "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80",      // Muscat Sultan Qaboos mosque
  "Kuwait":       "https://images.unsplash.com/photo-1563201515-adbe35c669c5?w=600&q=80",      // Kuwait City modern skyline
  "Kenya":        "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80",      // Nairobi skyline
  "Tanzania":     "https://images.unsplash.com/photo-1615209853186-e4bd66602508?w=600&q=80",   // Dar es Salaam port / East Africa trade
  "Nigeria":      "https://images.unsplash.com/photo-1583416750470-965b2707b355?w=600&q=80",   // Lagos business district
  "Morocco":      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",      // Casablanca / Morocco cityscape
  "China":        "https://images.unsplash.com/photo-1474990349564-ca4de5c8bb0f?w=600&q=80",   // Shanghai Pudong / port
  "Brazil":       "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=600&q=80",   // Rio de Janeiro / Santos port
  "Global":       "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",   // Earth from space
};

// Country → local warm-gold image (overrides any external URL from Notion)
const COUNTRY_COVER_MAP: Record<string, string> = {
  "Saudi Arabia":  imgSolarRiyadh,
  "UAE / Dubai":   imgRoboticsDubai,
  "Kenya":         imgMedicalMombasa,
  "Tanzania":      imgMedicalMombasa,
  "Nigeria":       imgMedicalMombasa,
  "Morocco":       imgGlobalHub,
  "Qatar":         imgSolarRiyadh,
  "Bahrain":       imgRoboticsDubai,
  "Oman":          imgRoboticsDubai,
  "Kuwait":        imgSolarRiyadh,
  "China":         imgPortShenzhen,
  "Brazil":        imgPortShenzhen,
  "Global":        imgGlobalHub,
};

function resolveImg(path: string): string {
  return IMG_MAP[path] ?? path;
}

function resolveArticleImg(coverImage: string, countryEN: string): string {
  // Always prefer country-mapped local image for visual consistency
  return COUNTRY_COVER_MAP[countryEN] ?? resolveImg(coverImage);
}

interface RegulatoryUpdatesProps {
  lang: "EN" | "ZH" | "AR";
}

interface Article {
  id: string;
  category: "regulatory" | "market" | "trade" | "gci";
  titleEN: string;
  titleZH: string;
  titleAR: string;
  countryEN: string;
  countryZH: string;
  countryAR: string;
  date: string;
  summaryEN: string;
  summaryZH: string;
  summaryAR: string;
  coverImage: string;
  // Optional fields — present when Notion DB has them, undefined otherwise
  sourceUrl?: string;
  businessImpact?: string;
  gciRecommendation?: string;
}

const CATEGORIES = {
  regulatory: {
    EN: "Regulatory Updates",
    ZH: "法律法规更新",
    AR: "التحديثات والأنظمة",
    subcategories: {
      EN: ["Entity Setup Policy", "Import Regulations", "Customs Rules", "Tax Protocols", "Market Access Requirements"],
      ZH: ["公司设立政策", "进口法规", "海关要求", "税务政策", "行业准入要求"],
      AR: ["سياسة تأسيس الشركات", "لوائح الاستيراد", "متطلبات الجمارك", "السياسات الضريبية", "متطلبات دخول الأسواق"]
    }
  },
  market: {
    EN: "Market News",
    ZH: "市场动态",
    AR: "أخبار ومؤشرات السوق",
    subcategories: {
      EN: ["GCC Market Opportunities", "Saudi Mega-projects", "UAE Business Landscape", "East Africa Ports Info", "Emerging Market Watch"],
      ZH: ["GCC市场机会", "沙特项目动态", "UAE商业环境", "肯尼亚市场信息", "新兴市场观察"],
      AR: ["فرص أسواق الخليج", "مشاريع السعودية الكبرى", "بيئة الأعمال بالإمارات", "معلومات أسواق كينيا", "مرصد الأسواق الناشئة"]
    }
  },
  trade: {
    EN: "Trade & Supply Chain Notes",
    ZH: "贸易与供应链提示",
    AR: "إرشادات التجارة وسلاسل الإمداد",
    subcategories: {
      EN: ["Clearance Roadblocks", "Freight Log Changes", "Overseas Warehousing", "Local Distribution Channels"],
      ZH: ["清关注意事项", "物流变化", "海外仓政策", "分销渠道变化"],
      AR: ["تنبيهات التخليص الجمركي", "تغيرات الشحن واللوجستيات", "سياسات المستودعات الخارجية", "قنوات التوزيع المحلية"]
    }
  },
  gci: {
    EN: "GCI Insights",
    ZH: "GCI观察",
    AR: "رؤى وبصائر GCI",
    subcategories: {
      EN: ["Market Entry Advice", "Localization Handbooks", "Partner FAQs", "Investment Risk Warning"],
      ZH: ["市场进入建议", "本地化落地经验", "客户常见问题", "出海风险提示"],
      AR: ["نصائح دخول السوق", "خبرات التوطين الميداني", "الأسئلة الشائعة للشركاء", "تنبيهات مخاطر الاستثمار"]
    }
  }
};

const ARTICLES_DATA: Article[] = [
  // 1. Regulatory Updates
  {
    id: "reg-1",
    category: "regulatory",
    titleEN: "Sino-Saudi Investment Protocol & License Exemption Guidelines",
    titleZH: "中沙投资协定与特定行业落地许可豁免指引说明",
    titleAR: "بروتوكول الاستثمار الصيني السعودي وإرشادات الإعفاء من تراخيص معينة",
    countryEN: "Saudi Arabia",
    countryZH: "沙特阿拉伯",
    countryAR: "المملكة العربية السعودية",
    date: "2026-06-11",
    summaryEN: "Official administrative handbook on corporate structure requirements and setup steps. Article to be updated.",
    summaryZH: "关于沙特投资部最新实体设立及运营要求的官方行政指南。Article to be updated。",
    summaryAR: "دليل إداري رسمي حول متطلبات هيكلة الشركات وخطوات التأسيس. Article to be updated.",
    coverImage: "/src/assets/images/case_solar_riyadh_1780768308627.png"
  },
  {
    id: "reg-2",
    category: "regulatory",
    titleEN: "Dubai Customs Import Declaration & HS Code Standardization Updates",
    titleZH: "迪拜海关进口申报要求与大宗建材HS税则归类协调通告",
    titleAR: "تحديثات بيان الاستيراد لجمارك دبي وتنسيق النظام المنسق HS Code",
    countryEN: "UAE / Dubai",
    countryZH: "阿联酋 / 迪拜",
    countryAR: "الإمارات / دبي",
    date: "2026-06-05",
    summaryEN: "Comprehensive breakdown of tax policy adjustments and dual economic clearance requirements. Article to be updated.",
    summaryZH: "关于自贸区关税微调、在岸查验和原产地证流转规则说明。Article to be updated。",
    summaryAR: "تفصيل شامل لتعديلات السياسة الجمركية ومتطلبات التخليص الثنائي. Article to be updated.",
    coverImage: "/src/assets/images/case_robotics_dubai_1780768291268.png"
  },
  {
    id: "reg-3",
    category: "regulatory",
    titleEN: "Mombasa Port Quarantine & East Africa Standards Bureau Regulatory Updates",
    titleZH: "蒙巴萨港口检疫限制与东非标准局(KEBS)进口合规指引",
    titleAR: "لوائح الحجر الصحي في ميناء مومباسا ومتطلبات هيئة المواصفات الكينية KEBS",
    countryEN: "Kenya",
    countryZH: "肯尼亚",
    countryAR: "كينيا",
    date: "2026-05-28",
    summaryEN: "Detailed review of critical product entry declarations and compliance validation steps. Article to be updated.",
    summaryZH: "针对跨境机电设备与大宗农用器具检疫通关规则的重要指引。Article to be updated。",
    summaryAR: "مراجعة مفصلة لتصديق المنتجات وإجراءات التحقق من المطابقة لشرق إفريقيا. Article to be updated.",
    coverImage: "/src/assets/images/case_medical_mombasa_1780768328334.png"
  },

  // 2. Market News
  {
    id: "mkt-1",
    category: "market",
    titleEN: "Bilateral Trade Analysis and Emerging Opportunities inside GCC High-growth Sectors",
    titleZH: "中东海湾国家高增长行业双边商机与大宗供应缺口全面分析",
    titleAR: "تحليل التجارة الثنائية والفرص الصاعدة في القطاعات الخليجية عالية النمو",
    countryEN: "GCC Region",
    countryZH: "GCC 区域",
    countryAR: "منطقة الخليج العربي",
    date: "2026-06-08",
    summaryEN: "Strategic overview highlighting regional investments, supply gaps, and green energy demand. Article to be updated.",
    summaryZH: "针对新能源、绿色基建及高价值工业设备大宗需求与核心缺口分析。Article to be updated。",
    summaryAR: "نظرة عامة استراتيجية تسلط الضوء على الاستثمارات الإقليمية وفجوات المعروض. Article to be updated.",
    coverImage: "/src/assets/images/gci_global_hub_connection_1780768265492.png"
  },
  {
    id: "mkt-2",
    category: "market",
    titleEN: "Riyadh Municipal Expansion and Specialized Subcontracting Market Information",
    titleZH: "利雅得市政新城建设拓展计划与配套专业分包本地供应链动态",
    titleAR: "توسعات أمانة الرياض ومعلومات سوق المقاولات المتخصصة وسلاسل الإمداد",
    countryEN: "Saudi Arabia",
    countryZH: "沙特阿拉伯",
    countryAR: "المملكة العربية السعودية",
    date: "2026-06-02",
    summaryEN: "Outline of high-potential commercial growth sectors and logistics expansion corridors. Article to be updated.",
    summaryZH: "关于沙特智能楼宇、电网扩容及市政装饰工程招投标与本土化准入。Article to be updated。",
    summaryAR: "مخطط لقطاعات النمو التجاري الواعدة وممرات التوسع اللوجستي بوسط المملكة. Article to be updated.",
    coverImage: "/src/assets/images/case_solar_riyadh_1780768308627.png"
  },
  {
    id: "mkt-3",
    category: "market",
    titleEN: "Latin America-Middle East Smart Cargo Flow & Future Corridors",
    titleZH: "拉美大西洋美洲与中东自贸物流走廊海运运力及多式联运动态",
    titleAR: "ممرات الشحن الذكي واللوجستيات بين أمريكا اللاتينية والشرق الأوسط",
    countryEN: "Brazil / LatAm",
    countryZH: "巴西 / 拉美",
    countryAR: "البرازيل / أمريكا اللاتينية",
    date: "2026-05-19",
    summaryEN: "Assessing direct cargo routes, regulatory adjustments, and trade support infrastructure. Article to be updated.",
    summaryZH: "巴西与海湾主航线高精密传感器设备及供应链配套大盘走势监测。Article to be updated。",
    summaryAR: "تقييم خطوط الشحن المباشرة والبنية التحتية الداعمة للتجارة العابرة للقارات. Article to be updated.",
    coverImage: "/src/assets/images/case_port_shenzhen_1780768345006.png"
  },

  // 3. Trade & Supply Chain Notes
  {
    id: "trd-1",
    category: "trade",
    titleEN: "Bilateral Customs Clearance Protocols: Vetted Steps & Anti-demurrage Measures",
    titleZH: "双边在岸通关实务：如何规避滞期费与高昂在岸滞箱费实操提示",
    titleAR: "بروتوكولات التخليص الجمركي الثنائي: خطوات مجربة وتدابير تجنب غرامات التأخير",
    countryEN: "Global Access",
    countryZH: "全球通路",
    countryAR: "المنافذ العالمية",
    date: "2026-06-09",
    summaryEN: "Critical guidelines on coordinating logistics workflows to minimize delivery bottlenecks. Article to be updated.",
    summaryZH: "提供迪拜及吉达主要港区报关预录入、原产地电子校验规避高昂滞港费实战经验。Article to be updated。",
    summaryAR: "إرشادات حاسمة حول تنسيق سير العمل اللوجستي لتقليص معوقات تسليم بضائع المشاريع. Article to be updated.",
    coverImage: "/src/assets/images/case_port_shenzhen_1780768345006.png"
  },
  {
    id: "trd-2",
    category: "trade",
    titleEN: "GCC Free Zone Storage Optimization & Dual-Licensing Distribution Options",
    titleZH: "中东自贸区保税海外仓储存效优化与双牌照在岸分销配套实务",
    titleAR: "تحسين التخزين في المناطق الحرة بدول الخليج وخيارات التوزيع ثنائي المزايا",
    countryEN: "UAE / GCC",
    countryZH: "阿联酋 / GCC",
    countryAR: "الإمارات / الخليج",
    date: "2026-05-25",
    summaryEN: "Overview of warehouse policies, custom bonded rules, and last-mile logistics integrations. Article to be updated.",
    summaryZH: "关于利用迪拜杰贝阿里或硅谷自贸区前置集货、并小批量转口GCC分销建议。Article to be updated。",
    summaryAR: "نظرة عامة على سياسات المستودعات والقواعد الجمركية وتكامل النقل للميل الأخير. Article to be updated.",
    coverImage: "/src/assets/images/case_robotics_dubai_1780768291268.png"
  },

  // 4. GCI Insights
  {
    id: "gci-1",
    category: "gci",
    titleEN: "On-Ground Market Localization Setup: Overcoming Vetted Operational Hurdles",
    titleZH: "在岸商业落地第一课：中国企业出海常犯的六类合规误区与避坑建议",
    titleAR: "توطين الأعمال والعمليات الميدانية: كيفية تجاوز العقبات الإدارية الشائعة",
    countryEN: "Middle East",
    countryZH: "中东市场",
    countryAR: "الشرق الأوسط",
    date: "2026-06-10",
    summaryEN: "Strategic insights into on-ground compliance, joint venture contracts, and resource allocations. Article to be updated.",
    summaryZH: "详析因对法律认知不足、挂靠本地代理流于形式导致的各种合同陷阱和损失。Article to be updated。",
    summaryAR: "رؤى استراتيجية حول الامتثال الميداني وعقود المشاريع المشتركة وتخصيص الموارد. Article to be updated.",
    coverImage: "/src/assets/images/case_solar_riyadh_1780768308627.png"
  },
  {
    id: "gci-2",
    category: "gci",
    titleEN: "Joint Partnerships and Localized Distribution Handbooks in GCC Markets",
    titleZH: "在册渠道开发手册：如何在中东寻找真正有政企消化能力的合规大合伙人",
    titleAR: "الشراكات المتبادلة وأدلة التوزيع المحلية في أسواق مجلس التعاون الخليجي",
    countryEN: "GCC Markets",
    countryZH: "GCC 市场",
    countryAR: "أسواق الخليج",
    date: "2026-05-30",
    summaryEN: "Evaluating local capabilities, project opportunities, and client relationship development. Article to be updated.",
    summaryZH: "中东本地商会、家族办公室引流通道及对等贸易条款谈判常识。Article to be updated。",
    summaryAR: "تقييم القدرات المحلية والفرص الواعدة لتعزيز قنوات نمو العلاقات التجارية. Article to be updated.",
    coverImage: "/src/assets/images/case_port_shenzhen_1780768345006.png"
  }
];

// All intelligence markets — order matters for display
const INTELLIGENCE_MARKETS = [
  { key: "UAE / Dubai",   labelEN: "UAE / Dubai",    labelZH: "阿联酋·迪拜",  labelAR: "الإمارات / دبي",    region: "GCC" },
  { key: "Saudi Arabia",  labelEN: "Saudi Arabia",   labelZH: "沙特阿拉伯",   labelAR: "المملكة العربية السعودية", region: "GCC" },
  { key: "Qatar",         labelEN: "Qatar",          labelZH: "卡塔尔",       labelAR: "قطر",               region: "GCC" },
  { key: "Bahrain",       labelEN: "Bahrain",        labelZH: "巴林",         labelAR: "البحرين",           region: "GCC" },
  { key: "Oman",          labelEN: "Oman",           labelZH: "阿曼",         labelAR: "سلطنة عُمان",       region: "GCC" },
  { key: "Kuwait",        labelEN: "Kuwait",         labelZH: "科威特",       labelAR: "الكويت",            region: "GCC" },
  { key: "Kenya",         labelEN: "Kenya",          labelZH: "肯尼亚",       labelAR: "كينيا",             region: "Africa" },
  { key: "Tanzania",      labelEN: "Tanzania",       labelZH: "坦桑尼亚",     labelAR: "تنزانيا",           region: "Africa" },
  { key: "Nigeria",       labelEN: "Nigeria",        labelZH: "尼日利亚",     labelAR: "نيجيريا",           region: "Africa" },
  { key: "Morocco",       labelEN: "Morocco",        labelZH: "摩洛哥",       labelAR: "المغرب",            region: "Africa" },
  { key: "China",         labelEN: "China",          labelZH: "中国",         labelAR: "الصين",             region: "Asia" },
  { key: "Brazil",        labelEN: "Brazil",         labelZH: "巴西",         labelAR: "البرازيل",          region: "LatAm" },
  { key: "Global",        labelEN: "Global",         labelZH: "全球",         labelAR: "عالمي",             region: "Global" },
];

export default function RegulatoryUpdates({ lang }: RegulatoryUpdatesProps) {
  const [isAllView, setIsAllView] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<"all" | "regulatory" | "market" | "trade" | "gci">("all");
  const [articles, setArticles] = useState<Article[]>(ARTICLES_DATA);
  const isRtl = lang === "AR";

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((data: Article[]) => {
        if (Array.isArray(data) && data.length > 0) {
          const notionIds = new Set(data.map((a: Article) => a.id));
          const fallback = ARTICLES_DATA.filter(a => !notionIds.has(a.id));
          setArticles([...data, ...fallback]);
        }
      })
      .catch(() => {});
  }, []);

  const mainTitleText = {
    EN: "GCI Regulatory & Market Updates",
    ZH: "法规与市场动态",
    AR: "التحديثات والأنظمة والأسواق"
  }[lang];

  const mainDescriptionText = {
    EN: "A curated knowledge base for regulatory changes, market updates and cross-border business insights across GCC and selected growth markets.",
    ZH: "作为 GCI 平台的市场知识库，定期上传 GCC、非洲及重点市场的法律法规、政策变化、进口要求、行业动态和市场机会。",
    AR: "قاعدة معرفية منسقة للتغيرات التنظيمية، وتحديثات السوق، ورؤى الأعمال العابرة للحدود في دول الخليج العربي والأسواق الواعدة."
  }[lang];

  const categoryLabels = {
    all: { EN: "All Intelligence", ZH: "全部情报", AR: "كافة المؤشرات" },
    regulatory: { EN: "Regulatory Updates", ZH: "法律法规更新", AR: "التحديثات والأنظمة" },
    market: { EN: "Market News", ZH: "市场动态", AR: "أخبار ومؤشرات السوق" },
    trade: { EN: "Trade & Supply Notes", ZH: "贸易与供应链提示", AR: "التجارة وسلاسل الإمداد" },
    gci: { EN: "GCI Insights", ZH: "GCI 观察", AR: "رؤى وبصائر GCI" }
  };

  const readMoreText = {
    EN: "Read Full Intelligence Report",
    ZH: "阅读完整市场报告",
    AR: "قراءة التقرير الكامل"
  }[lang];

  const dateLabel = {
    EN: "TRANS. DATE",
    ZH: "发布时间",
    AR: "تاريخ النشر"
  }[lang];

  const viewAllButtonText = {
    EN: "View All Insights →",
    ZH: "查看全部情报动态 →",
    AR: "عرض كافة المؤشرات والتحديثات ←"
  }[lang];

  const backToFeaturedText = {
    EN: "← Back to Featured Insights",
    ZH: "← 返回精选情报",
    AR: "→ العودة إلى التحديثات المميزة"
  }[lang];

  // Logic to separate first 6 articles for Featured Insights display
  const featuredArticles = articles.slice(0, 6);
  // Large Featured Card is the first article
  const leadArticle = featuredArticles[0];
  // Small Companion Cards are the remaining 5
  const companionArticles = featuredArticles.slice(1);

  // Filtered list for "All View" mode
  const filteredArticles = activeCategory === "all"
    ? articles
    : articles.filter(art => art.category === activeCategory);

  return (
    <section id="insights-section" className="py-20 md:py-24 bg-[#030611] border-b border-brand-gold-500/10 relative overflow-hidden">
      {/* Aesthetic layout decorative lighting / glow effects */}
      <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#C59B3F_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-brand-navy-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10" dir={isRtl ? "rtl" : "ltr"}>
        
        {/* SECTION HEADER BLOCK */}
        <div className={`max-w-4xl mb-12 ${isRtl ? "text-right" : "text-left"}`}>
          <div className="flex items-center gap-2 mb-4 justify-start">
            <span className="h-[1px] w-8 bg-brand-gold-500/80" />
            <span className={`text-sm font-sans text-brand-gold-400 font-medium uppercase font-mono ${lang === "EN" ? "tracking-widest" : "tracking-normal"}`}>
              {lang === "EN" ? "Market Intelligence Center" : lang === "ZH" ? "在岸市场特约情报中心" : "مركز الاستشارات والمؤشرات"}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-extrabold text-[#f9f5eb] tracking-tight leading-none uppercase">
              {isAllView ? (isRtl ? "المستودع المعرفي الشامل" : lang === "ZH" ? "完整情报检索库" : "COMPLETE INTELLIGENCE REPOSITORY") : mainTitleText}
            </h2>

            {/* If in All View, show a quick back link in the header */}
            {isAllView && (
              <button
                onClick={() => {
                  if (selectedCountry) {
                    setSelectedCountry(null);
                  } else {
                    setIsAllView(false);
                  }
                  window.scrollTo({ top: document.getElementById("insights-section")?.offsetTop, behavior: "smooth" });
                }}
                className="text-xs sm:text-sm font-sans font-bold text-brand-gold-400 hover:text-brand-gold-300 transition-colors flex items-center gap-2 cursor-pointer self-start"
              >
                {selectedCountry
                  ? (lang === "ZH" ? "← 返回市场列表" : lang === "AR" ? "→ الأسواق" : "← All Markets")
                  : backToFeaturedText}
              </button>
            )}
          </div>

          <p className="mt-4 text-base md:text-lg text-brand-gold-200/80 font-light leading-relaxed">
            {mainDescriptionText}
          </p>
        </div>

        {/* MODE 1: FEATURED INSIGHTS BENTO LAYOUT (max 6 articles: 1 main big card + 5 smaller visual cards) */}
        {!isAllView && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-12">
              
              {/* LARGE FEATURED CARD ( occupying lg:col-span-2, large high contrast visual focus ) */}
              <div 
                className="lg:col-span-2 group flex flex-col justify-between bg-[#070e20]/60 hover:bg-[#0c1834]/80 border border-brand-gold-500/15 hover:border-brand-gold-500/35 rounded-3xl transition-all duration-300 text-left relative overflow-hidden backdrop-blur-sm hover:shadow-2xl hover:shadow-brand-gold-500/5 min-h-[440px]"
              >
                {/* Visual Cover Image — fixed h-52, fallback placeholder if broken */}
                <div className="relative w-full h-52 shrink-0 overflow-hidden border-b border-brand-gold-500/10 bg-[#0a1428]">
                  <img
                    src={resolveArticleImg(leadArticle.coverImage, leadArticle.countryEN)}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 select-none pointer-events-none"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070e20]/80 via-transparent to-transparent pointer-events-none" />
                  {/* Category + location badges — bottom of image, never overlaps title */}
                  <div className="absolute bottom-3 left-4 z-10 flex flex-wrap gap-2">
                    <span className="text-[10px] font-mono font-bold bg-[#C59B3F] text-[#030611] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg">
                      {categoryLabels[leadArticle.category][lang]}
                    </span>
                    <span className="text-[10px] font-sans font-bold bg-[#030611]/85 backdrop-blur text-brand-gold-200 border border-brand-gold-500/20 px-2.5 py-1 rounded-md flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-brand-gold-400 shrink-0" />
                      {lang === "EN" ? leadArticle.countryEN : lang === "ZH" ? leadArticle.countryZH : leadArticle.countryAR}
                    </span>
                  </div>
                </div>

                {/* Content description partition */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Meta line */}
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mb-3 uppercase tracking-wider">
                      <span>{dateLabel}:</span>
                      <span>{leadArticle.date}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif text-[#f9f5eb] font-extrabold group-hover:text-white transition-colors leading-snug tracking-tight mb-4">
                      {lang === "EN" ? leadArticle.titleEN : lang === "ZH" ? leadArticle.titleZH : leadArticle.titleAR}
                    </h3>

                    <p className="text-sm text-brand-gold-200/80 font-sans font-light leading-relaxed mb-6 max-w-2xl">
                      {lang === "EN" ? leadArticle.summaryEN : lang === "ZH" ? leadArticle.summaryZH : leadArticle.summaryAR}
                    </p>
                  </div>

                  {/* High quality footer action */}
                  <div className="border-t border-brand-gold-500/10 pt-5 flex items-center justify-between text-xs font-bold text-[#DFBB6B] group-hover:text-brand-gold-300">
                    <span className={`uppercase ${lang === "EN" ? "tracking-widest" : "tracking-normal"}`}>{readMoreText}</span>
                    <div className="w-8 h-8 rounded-full bg-brand-gold-500/5 group-hover:bg-brand-gold-500/15 flex items-center justify-center transition-colors">
                      <ArrowRight className={`w-4 h-4 stroke-[2] ${isRtl ? "rotate-180" : "group-hover:translate-x-0.5 transition-transform"}`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* COMPANION SECONDARY CARDS Grid Structure ( occuping space elegantly ) */}
              <div className="flex flex-col gap-6 justify-between lg:col-span-1">
                {companionArticles.slice(0, 2).map((article) => {
                  const title = { EN: article.titleEN, ZH: article.titleZH, AR: article.titleAR }[lang];
                  const country = { EN: article.countryEN, ZH: article.countryZH, AR: article.countryAR }[lang];
                  const summary = { EN: article.summaryEN, ZH: article.summaryZH, AR: article.summaryAR }[lang];

                  return (
                    <div
                      key={article.id}
                      className="group flex flex-col justify-between p-5 bg-[#070e20]/60 hover:bg-[#0c1834]/80 border border-brand-gold-500/15 hover:border-brand-gold-500/35 rounded-2xl transition-all duration-300 text-left relative overflow-hidden backdrop-blur-sm flex-1"
                    >
                      {/* Image strip at top of card — fixed h-28 */}
                      <div className="relative w-full h-28 rounded-xl overflow-hidden mb-3 border border-brand-gold-500/10 bg-[#0a1428] shrink-0">
                        <img
                          src={resolveArticleImg(article.coverImage, article.countryEN)}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 select-none pointer-events-none"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070e20]/70 via-transparent to-transparent pointer-events-none" />
                      </div>
                      {/* Meta + title — always below image, never overlapping */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[9px] font-mono bg-brand-gold-500/10 text-brand-gold-400 border border-brand-gold-500/15 px-2 py-0.5 rounded font-bold uppercase">
                            {country}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500">
                            {article.date}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-serif font-bold text-brand-gold-100 group-hover:text-white transition-colors line-clamp-3 leading-snug break-words">
                          {title}
                        </h4>
                      </div>

                      <p className="text-xs text-brand-gold-200/60 font-sans font-light line-clamp-2 mb-3">
                        {summary}
                      </p>

                      <div className="border-t border-brand-gold-500/10 pt-2.5 flex items-center justify-between text-[11px] font-semibold text-brand-gold-400">
                        <span>{readMoreText}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* THREE ADDITIONAL LOWER GRID ROW COMPANIONS IN BENTO MATRIX */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mb-12">
              {companionArticles.slice(2).map((article) => {
                const title = { EN: article.titleEN, ZH: article.titleZH, AR: article.titleAR }[lang];
                const country = { EN: article.countryEN, ZH: article.countryZH, AR: article.countryAR }[lang];
                const summary = { EN: article.summaryEN, ZH: article.summaryZH, AR: article.summaryAR }[lang];

                return (
                  <div
                    key={article.id}
                    className="group flex flex-col justify-between p-5 bg-[#070e20]/60 hover:bg-[#0c1834]/80 border border-brand-gold-500/15 hover:border-brand-gold-500/35 rounded-2xl transition-all duration-300 text-left relative overflow-hidden backdrop-blur-sm shadow-xl"
                  >
                    {/* Visual Card Image — fixed h-40, bottom label overlay */}
                    <div className="relative w-full h-40 shrink-0 rounded-xl overflow-hidden mb-4 border border-brand-gold-500/10 bg-[#0a1428]">
                      <img
                        src={resolveArticleImg(article.coverImage, article.countryEN)}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 select-none pointer-events-none"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070e20]/80 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-2 left-2 z-10 text-[9px] font-mono bg-[#030611]/85 backdrop-blur text-brand-gold-300 border border-brand-gold-500/15 px-2 py-1 rounded">
                        {country}
                      </span>
                    </div>

                    <div>
                      {/* Meta line */}
                      <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 mb-2">
                        <span>{categoryLabels[article.category][lang]}</span>
                        <span>•</span>
                        <span>{article.date}</span>
                      </div>

                      <h4 className="text-sm font-serif font-bold text-brand-gold-100 group-hover:text-white transition-colors line-clamp-2 leading-snug tracking-tight mb-2">
                        {title}
                      </h4>

                      <p className="text-xs text-brand-gold-200/60 font-sans font-light line-clamp-2 leading-relaxed mb-4">
                        {summary}
                      </p>
                    </div>

                    <div className="border-t border-brand-gold-500/10 pt-3 flex items-center justify-between text-[11px] font-semibold text-brand-gold-400 group-hover:text-brand-gold-300 mt-auto">
                      <span>{readMoreText}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* INTERACTIVE LOAD MORE / SWITCH TO DEEP DIRECTORY PORTAL BUTTON */}
            <div className="flex justify-center mt-12">
              <button
                id="btn-view-all-insights"
                onClick={() => {
                  setIsAllView(true);
                  // Scroll to top of the section nicely
                  window.scrollTo({ top: document.getElementById("insights-section")?.offsetTop, behavior: "smooth" });
                }}
                className={`px-8 py-4 bg-gradient-to-r from-brand-gold-500 to-brand-gold-600 hover:from-brand-gold-400 hover:to-brand-gold-500 text-[#030611] font-sans font-bold text-sm ${lang === "EN" ? "tracking-widest" : "tracking-normal"} uppercase rounded-xl transition-all duration-300 shadow-lg shadow-brand-gold-500/10 hover:shadow-brand-gold-500/25 active:scale-95 cursor-pointer flex items-center gap-3 animate-pulse`}
              >
                <span>{viewAllButtonText}</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE 2: COUNTRY GRID → ARTICLE LIST (two-level navigation) */}
        {isAllView && (
          <div>

            {/* ── LEVEL 1: Country Grid (no country selected) ── */}
            {!selectedCountry && (
              <div>
                <p className="text-xs font-mono text-brand-gold-400/60 uppercase tracking-widest mb-8">
                  {lang === "ZH" ? "选择市场，查看该国最新情报" : lang === "AR" ? "اختر السوق لعرض أحدث التقارير" : "Select a market to browse its intelligence reports"}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                  {INTELLIGENCE_MARKETS.map((market) => {
                    const countArticles = articles.filter(a => a.countryEN === market.key).length;
                    const label = lang === "ZH" ? market.labelZH : lang === "AR" ? market.labelAR : market.labelEN;
                    const coverImg = COUNTRY_GRID_IMG[market.key] ?? COUNTRY_COVER_MAP[market.key] ?? imgGlobalHub;

                    return (
                      <button
                        key={market.key}
                        onClick={() => {
                          setSelectedCountry(market.key);
                          setActiveCategory("all");
                          window.scrollTo({ top: document.getElementById("insights-section")?.offsetTop, behavior: "smooth" });
                        }}
                        className="group relative overflow-hidden rounded-2xl border border-brand-gold-500/15 hover:border-brand-gold-500/50 bg-[#070e20]/60 hover:bg-[#0c1834]/80 transition-all duration-300 cursor-pointer text-left shadow-xl hover:shadow-brand-gold-500/10 active:scale-[0.98]"
                      >
                        {/* Country image */}
                        <div className="relative w-full h-32 overflow-hidden">
                          <img
                            src={coverImg}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 select-none pointer-events-none"
                            onError={(e) => { e.currentTarget.src = COUNTRY_COVER_MAP[market.key] ?? imgGlobalHub; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#070e20] via-[#070e20]/40 to-transparent pointer-events-none" />
                          {/* Region badge */}
                          <span className="absolute top-2 right-2 text-[9px] font-mono bg-[#030611]/80 backdrop-blur text-brand-gold-400 border border-brand-gold-500/20 px-2 py-0.5 rounded">
                            {market.region}
                          </span>
                        </div>

                        {/* Country name + article count */}
                        <div className="p-4">
                          <h3 className="text-sm font-serif font-bold text-[#f9f5eb] group-hover:text-white transition-colors leading-snug mb-1">
                            {label}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-brand-gold-400/70">
                              {countArticles > 0
                                ? `${countArticles} ${lang === "ZH" ? "篇情报" : lang === "AR" ? "تقرير" : "reports"}`
                                : lang === "ZH" ? "即将更新" : lang === "AR" ? "قريباً" : "Coming soon"}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-brand-gold-500/50 group-hover:text-brand-gold-400 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Back to Featured */}
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setIsAllView(false);
                      window.scrollTo({ top: document.getElementById("insights-section")?.offsetTop, behavior: "smooth" });
                    }}
                    className="px-6 py-3.5 bg-[#030611]/80 hover:bg-[#070e20] border border-brand-gold-500/30 text-brand-gold-300 hover:text-brand-gold-200 font-sans font-bold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2 active:scale-98"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{backToFeaturedText}</span>
                  </button>
                </div>
              </div>
            )}

            {/* ── LEVEL 2: Articles for selected country ── */}
            {selectedCountry && (() => {
              const market = INTELLIGENCE_MARKETS.find(m => m.key === selectedCountry)!;
              const countryLabel = lang === "ZH" ? market.labelZH : lang === "AR" ? market.labelAR : market.labelEN;
              const countryArticles = articles.filter(a => a.countryEN === selectedCountry);
              const filteredByCategory = activeCategory === "all"
                ? countryArticles
                : countryArticles.filter(a => a.category === activeCategory);

              return (
                <div>
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-2 text-xs font-mono text-brand-gold-400/60 mb-6">
                    <button
                      onClick={() => {
                        setSelectedCountry(null);
                        window.scrollTo({ top: document.getElementById("insights-section")?.offsetTop, behavior: "smooth" });
                      }}
                      className="hover:text-brand-gold-300 transition-colors cursor-pointer"
                    >
                      {lang === "ZH" ? "全部市场" : lang === "AR" ? "كل الأسواق" : "All Markets"}
                    </button>
                    <span>/</span>
                    <span className="text-brand-gold-300 font-bold">{countryLabel}</span>
                    <span className="ml-2 bg-brand-gold-500/10 border border-brand-gold-500/20 text-brand-gold-400 px-2 py-0.5 rounded text-[9px]">
                      {countryArticles.length} {lang === "ZH" ? "篇" : lang === "AR" ? "تقرير" : "reports"}
                    </span>
                  </div>

                  {/* Category Tab Filter */}
                  <div className="mb-8">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 bg-[#050a15]/80 border border-brand-gold-500/10 p-2 rounded-2xl backdrop-blur">
                      {(["all", "regulatory", "market", "trade", "gci"] as const).map((cat) => {
                        const active = activeCategory === cat;
                        const lbl = categoryLabels[cat][lang];
                        const count = cat === "all" ? countryArticles.length : countryArticles.filter(a => a.category === cat).length;
                        const getIcon = () => {
                          if (cat === "all") return <Layers className="w-3.5 h-3.5" />;
                          if (cat === "regulatory") return <BookOpen className="w-3.5 h-3.5" />;
                          if (cat === "market") return <Newspaper className="w-3.5 h-3.5" />;
                          if (cat === "trade") return <FolderSync className="w-3.5 h-3.5" />;
                          return <ShieldAlert className="w-3.5 h-3.5" />;
                        };
                        return (
                          <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-2.5 rounded-xl text-xs font-sans font-semibold transition-all duration-300 cursor-pointer flex items-center justify-between gap-2 border ${
                              active
                                ? "bg-[#DFBB6B] text-[#030611] border-[#C59B3F] font-bold shadow-md"
                                : "bg-[#030611]/80 text-brand-gold-300 border-brand-gold-500/5 hover:border-brand-gold-500/20 hover:text-[#f9f5eb]"
                            }`}
                          >
                            <span className="flex items-center gap-1.5">{getIcon()}<span>{lbl}</span></span>
                            <span className={`text-[9px] font-mono px-1 py-0.5 rounded ${active ? "bg-[#030611]/10" : "bg-brand-gold-500/5 text-brand-gold-400"}`}>{count}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Article Grid */}
                  {filteredByCategory.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch mb-12">
                      {filteredByCategory.map((article) => {
                        const title = { EN: article.titleEN, ZH: article.titleZH, AR: article.titleAR }[lang];
                        const country = { EN: article.countryEN, ZH: article.countryZH, AR: article.countryAR }[lang];
                        const summary = { EN: article.summaryEN, ZH: article.summaryZH, AR: article.summaryAR }[lang];
                        return (
                          <div
                            key={article.id}
                            className="group flex flex-col justify-between p-5 bg-[#070e20]/60 hover:bg-[#0c1834]/80 border border-brand-gold-500/12 hover:border-brand-gold-500/35 rounded-2xl transition-all duration-300 text-left relative overflow-hidden backdrop-blur-sm shadow-xl"
                          >
                            <div className="relative w-full h-44 shrink-0 rounded-xl overflow-hidden mb-4 border border-brand-gold-500/10 bg-[#0a1428]">
                              <img
                                src={resolveArticleImg(article.coverImage, article.countryEN)}
                                alt=""
                                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 select-none pointer-events-none"
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#070e20]/80 via-transparent to-transparent pointer-events-none" />
                              <span className="absolute bottom-2 left-2 z-10 text-[9px] font-mono font-bold bg-[#C59B3F] text-[#030611] px-2 py-1 rounded">
                                {categoryLabels[article.category][lang]}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center justify-between gap-2 text-[9px] font-mono text-slate-500 mb-2.5">
                                <span className="text-brand-gold-400 font-semibold">{country}</span>
                                <span>{article.date}</span>
                              </div>
                              <h4 className="text-base font-serif font-bold text-brand-gold-100 group-hover:text-white transition-colors leading-snug mb-3 break-words">
                                {title}
                              </h4>
                              <p className="text-xs sm:text-sm text-brand-gold-200/60 font-sans font-light leading-relaxed mb-4 line-clamp-3">
                                {summary}
                              </p>
                            </div>
                            <div className="border-t border-brand-gold-500/10 pt-3 flex items-center justify-between text-xs font-semibold text-brand-gold-400 group-hover:text-brand-gold-300 mt-auto">
                              <span>{readMoreText}</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-brand-gold-400/40 font-mono text-sm">
                      {lang === "ZH" ? "该类别暂无文章" : lang === "AR" ? "لا توجد تقارير في هذه الفئة" : "No reports in this category yet"}
                    </div>
                  )}

                  {/* Back to country grid */}
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => {
                        setSelectedCountry(null);
                        window.scrollTo({ top: document.getElementById("insights-section")?.offsetTop, behavior: "smooth" });
                      }}
                      className="px-6 py-3.5 bg-[#030611]/80 hover:bg-[#070e20] border border-brand-gold-500/30 text-brand-gold-300 hover:text-brand-gold-200 font-sans font-bold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer flex items-center gap-2 active:scale-98"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{lang === "ZH" ? "← 返回市场列表" : lang === "AR" ? "→ العودة إلى الأسواق" : "← Back to Markets"}</span>
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        )}

      </div>
    </section>
  );
}
