// Static high-end database and translations for GCI Corporate Website
// Completely aligned with the real GCI corporate advisory & local execution business.

export interface LanguagePack {
  navHome: string;
  navWhoWeAre: string;
  navWhatWeDo: string;
  navWhereWeOperate: string;
  navWhyGCI: string;
  navMedia: string;
  navInsights: string;
  navContact: string;
  contactBtn: string;
  
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDesc: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroHoverTip: string;
  
  whoWeAreLabel: string;
  whoWeAreTitle: string;
  whoWeAreDesc1: string;
  whoWeAreDesc2: string;
  whoWeAreTargetTitle: string;
  whoWeAreTargets: string[];
  whoWeAreMarketTitle: string;
  whoWeAreMarkets: string[];

  whatWeDoLabel: string;
  whatWeDoTitle: string;
  whatWeDoSubtitle: string;
  
  service1Title: string;
  service1Desc: string;
  service1Bullets: string[];
  service1Footer: string;
  
  service2Title: string;
  service2Desc: string;
  service2Bullets: string[];
  service2Footer: string;
  
  service3Title: string;
  service3Desc: string;
  service3Bullets: string[];
  service3Footer: string;
  
  service4Title: string;
  service4Desc: string;
  service4Bullets: string[];
  service4Footer: string;
  
  whereWeOperateLabel: string;
  whereWeOperateTitle: string;
  whereWeOperateSubtitle: string;
  whereWeOperateBtn: string;

  whyGCILabel: string;
  whyGCITitle: string;
  whyGCIAdv1Title: string;
  whyGCIAdv1Desc: string;
  whyGCIAdv2Title: string;
  whyGCIAdv2Desc: string;
  whyGCIAdv3Title: string;
  whyGCIAdv3Desc: string;
  whyGCIAdv4Title: string;
  whyGCIAdv4Desc: string;
  
  whyGciFormTitle: string;
  whyGciFormLabel1: string;
  whyGciFormLabel2: string;
  whyGciFormLabel3: string;
  whyGciFormPlaceholder: string;
  whyGciFormSubmitBtn: string;
  whyGciFormSubmitting: string;
  whyGciFormNotice: string;
  
  visualLabel: string;
  visualTitle: string;
  visualSubtitle: string;
  visualTab1: string;
  visualTab2: string;
  visualTab3: string;
  visualPlayText: string;

  contactLabel: string;
  contactTitle: string;
  contactSubtitle: string;
  contactFormName: string;
  contactFormEmail: string;
  contactFormCompany: string;
  contactFormCorridor: string;
  contactFormMsg: string;
  contactFormSubmit: string;
  contactFormSuccess: string;
  contactWhatsApp: string;
  contactEmailUs: string;
  contactCallUs: string;
  contactOffice: string;
}

export const LANGUAGES: Record<"EN" | "ZH" | "AR", LanguagePack> = {
  EN: {
    navHome: "Home",
    navWhoWeAre: "About GCI",
    navWhatWeDo: "Capabilities",
    navWhereWeOperate: "Markets",
    navWhyGCI: "Projects",
    navMedia: "Commercial Network",
    navInsights: "Insights",
    navContact: "Contact",
    contactBtn: "Book Consultation",
    
    heroBadge: "Sino-Global Corporate Outbound Blueprint",
    heroTitle: "China Resources.\nGLOBAL EXECUTION.",
    heroSubtitle: "We connect resources. We coordinate execution. We make things happen.",
    heroDesc: "GCI helps companies connect resources, enter markets and execute projects across the Middle East, Africa and selected global markets.",
    heroCtaPrimary: "Book Consultation",
    heroCtaSecondary: "Explore Our Network",
    heroHoverTip: "Hover over key regional intersections to view GCI bilateral corridors",
    
    whoWeAreLabel: "About GCI",
    whoWeAreTitle: "LOCAL KNOWLEDGE.\nREGIONAL NETWORK.\nEXECUTION CAPABILITY.",
    whoWeAreDesc1: "GCI is a Dubai-based business execution platform serving manufacturers, brand owners, project developers and trading companies expanding into regional and international markets.\n\nWe combine local market knowledge, regional business networks and cross-border execution experience to help projects move from opportunity to execution.",
    whoWeAreDesc2: "Our strength comes from practical execution.\n\nThrough trusted commercial networks, industry partners and regional resources, GCI helps businesses establish market presence, develop channels, coordinate supply chains and support project delivery across regional and global markets.",
    whoWeAreTargetTitle: "Who We Serve",
    whoWeAreTargets: ["Manufacturers", "Brand Owners", "Project Developers", "Trading Companies", "Investors", "Strategic Partners"],
    whoWeAreMarketTitle: "Where We Operate",
    whoWeAreMarkets: ["UAE", "Saudi Arabia", "Bahrain", "Oman", "Kenya", "China", "Vietnam", "Cambodia", "Indonesia", "Morocco", "Brazil"],

    whatWeDoLabel: "Capabilities",
    whatWeDoTitle: "FOUR CORE BUSINESS CAPABILITIES",
    whatWeDoSubtitle: "GCI connects resources, coordinates execution and supports business growth across regional and global markets through four core business capabilities.",
    
    service1Title: "Market Entry & Business Services",
    service1Desc: "Helping companies establish market presence and develop commercial opportunities across regional and international markets.",
    service1Bullets: [
      "Market Opportunity Assessment",
      "Business Matching",
      "Channel Development",
      "Business Visit Coordination",
      "Partner Introductions",
      "Commercial Support"
    ],
    service1Footer: "Business Development",
    
    service2Title: "Trade & Supply Chain Solutions",
    service2Desc: "Connecting China supply resources with regional market demand through coordinated sourcing, logistics and distribution support.",
    service2Bullets: [
      "Supplier Sourcing",
      "Procurement Coordination",
      "Logistics Coordination",
      "Distribution Support",
      "Warehousing Resources",
      "Trade Facilitation"
    ],
    service2Footer: "Supply Chain Network",
    
    service3Title: "Project & Living Solutions",
    service3Desc: "Supporting hospitality, residential, workplace and commercial projects through integrated project supply solutions.",
    service3Bullets: [
      "FF&E Solutions",
      "Furniture Supply",
      "Building Materials",
      "Interior Finishes",
      "Hospitality Projects",
      "Workplace Solutions"
    ],
    service3Footer: "Explore COOLHOME GCC →",
    
    service4Title: "Digital & AI Solutions",
    service4Desc: "Helping businesses improve sales, operations and management through AI-powered workflow systems.",
    service4Bullets: [
      "AI Lead Management",
      "AI Customer Service",
      "AI Knowledge Base",
      "Workflow Automation",
      "Operations Management",
      "Executive Dashboards"
    ],
    service4Footer: "Explore AsoraCore →",
    
    whereWeOperateLabel: "Markets",
    whereWeOperateTitle: "Bilateral Corridor Network",
    whereWeOperateSubtitle: "Explore our physical commercial hubs, liaison offices, and customs clearance gates bridging China supplies with active Gulf economies.",
    whereWeOperateBtn: "Coordinate Local Path",

    whyGCILabel: "Projects",
    whyGCITitle: "Strategic Suite & Access Navigator",
    whyGCIAdv1Title: "Riyadh Operations Desks",
    whyGCIAdv1Desc: "Direct on-ground capabilities coordinating municipal permits and compliance clearance.",
    whyGCIAdv2Title: "Dubai Showrooms",
    whyGCIAdv2Desc: "Dedicated exhibit and warehousing channels to expose components to accredited wholesale guilds.",
    whyGCIAdv3Title: "The COOLHOME GCC Proof",
    whyGCIAdv3Desc: "We operate our own live furniture and supply chain business, proving we master actual container logistics and B2B distribution.",
    whyGCIAdv4Title: "AI Access Accelerator",
    whyGCIAdv4Desc: "Custom-trained database matching target exporters with regional wholesale importers in seconds.",
    
    whyGciFormTitle: "Active Corridor Diagnostic Tool",
    whyGciFormLabel1: "Target Destination Market",
    whyGciFormLabel2: "Your Exporter Profile",
    whyGciFormLabel3: "On-Ground Objectives",
    whyGciFormPlaceholder: "E.g., High-end industrial equipment manufacturer seeking vetted distributors, warehouse allocation, and local representation desk in Saudi Arabia.",
    whyGciFormSubmitBtn: "Generate Strategic Access Outline",
    whyGciFormSubmitting: "Querying GCI Local Database...",
    whyGciFormNotice: "Disclaimer: This analytical overview is powered by GCI's in-country databases to fast-track bilateral trade paths.",
    
    visualLabel: "Media Center",
    visualTitle: "Field Investigations & Physical Footprints",
    visualSubtitle: "Raw, unedited footage of GCI's active physical showrooms, corporate outbound delegations, and port inspections.",
    visualTab1: "Showrooms & Showcase Floors",
    visualTab2: "Outbound Delegations",
    visualTab3: "Port Investigations",
    visualPlayText: "Watch Walkthrough Footage",

    contactLabel: "Get In Touch",
    contactTitle: "Initiate Your Outbound Expansion",
    contactSubtitle: "Establish immediate, secure connections with GCI's Dubai and Riyadh directors to coordinate your local execution blueprint.",
    contactFormName: "Contact Name",
    contactFormEmail: "Corporate Email Address",
    contactFormCompany: "Company Name",
    contactFormCorridor: "Target Market Corridor",
    contactFormMsg: "Project Profile & On-Ground Requirements",
    contactFormSubmit: "Submit Outbound Inquiry",
    contactFormSuccess: "Thank you. Your corporate inquiry has been safely received. Our Dubai headquarters will respond within 12 hours.",
    contactWhatsApp: "WhatsApp Live Chat",
    contactEmailUs: "Official Email Inquiry",
    contactCallUs: "Dubai HQ Phone Call",
    contactOffice: "Dubai Headquarters Address"
  },
  ZH: {
    navHome: "首页",
    navWhoWeAre: "关于GCI",
    navWhatWeDo: "服务能力",
    navWhereWeOperate: "市场网络",
    navWhyGCI: "执行案例",
    navMedia: "商业网络",
    navInsights: "法规与市场动态",
    navContact: "联系我们",
    contactBtn: "预订商务会谈",
    
    heroBadge: "全球企业出海在岸服务网络",
    heroTitle: "China Resources.\nGLOBAL EXECUTION.",
    heroSubtitle: "We connect resources. We coordinate execution. We make things happen. (对接全球资源，协同在岸执行。)",
    heroDesc: "GCI 协助企业对接资源、进入市场，并在中东、非洲及精选全球市场执行项目。",
    heroCtaPrimary: "预约高管咨询",
    heroCtaSecondary: "探索服务网络",
    heroHoverTip: "鼠标悬停在主要区域，查看 GCI 双边在岸服务走廊",
    
    whoWeAreLabel: "关于GCI",
    whoWeAreTitle: "本土认知。\n区域网络。\n在岸执行。",
    whoWeAreDesc1: "GCI 是一家总部位于迪拜的商务执行平台，服务于拓展至区域和国际市场的制造商、品牌所有者、项目开发商和贸易公司。\n\n我们将本土市场认知、区域商业网络和跨界执行经验相结合，协助项目从商机走向实际执行。",
    whoWeAreDesc2: "我们的优势源于务实的执行力。\n\n通过值得信赖的商业网络、行业合作伙伴与区域资源，GCI 协助企业拓展市场版图、开发本地渠道、协同供应链并为整个区域及全球市场的项目交付提供全力支持。",
    whoWeAreTargetTitle: "服务对象",
    whoWeAreTargets: ["制造商", "品牌商", "项目开发商", "贸易公司", "投资者", "战略合作伙伴"],
    whoWeAreMarketTitle: "业务区域",
    whoWeAreMarkets: ["阿联酋", "沙特阿拉伯", "巴林", "阿曼", "肯尼亚", "中国", "越南", "柬埔寨", "印尼", "摩洛哥", "巴西"],

    whatWeDoLabel: "服务能力",
    whatWeDoTitle: "四大核心业务能力",
    whatWeDoSubtitle: "GCI通过四大核心业务能力，对接资源，协同执行，支持区域及全球市场的业务增长。",
    
    service1Title: "1. Market Entry & Business Services",
    service1Desc: "帮助企业在区域及国际市场建立市场存在并开拓商业机会。",
    service1Bullets: [
      "市场机会评估",
      "商业匹配对接",
      "渠道开发建设",
      "商务考察协调",
      "合作伙伴引荐",
      "商业落地支持"
    ],
    service1Footer: "Business Development",
    
    service2Title: "2. Trade & Supply Chain Solutions",
    service2Desc: "通过协同采购、物流与分销支持，将中国供应资源与区域市场需求相连接。",
    service2Bullets: [
      "供应商资源开发",
      "采购协同对接",
      "全程物流协调",
      "本地分销支持",
      "仓储资源对接",
      "贸易便利化支持"
    ],
    service2Footer: "Supply Chain Network",
    
    service3Title: "3. Project & Living Solutions",
    service3Desc: "通过集成式的项目供应解决方案，支持酒店、住宅、办公及商业项目的建设与交付。",
    service3Bullets: [
      "空间软装解决方案 (FF&E Solutions)",
      "全案家具供应",
      "环保建筑建材",
      "室内硬装高阶面料",
      "酒店及文旅项目交付",
      "办公与企业空间规划"
    ],
    service3Footer: "Explore COOLHOME GCC →",
    
    service4Title: "4. Digital & AI Solutions",
    service4Desc: "通过自主研发的 AI 赋能工作流系统，帮助企业提升销售业绩、优化日常运营并增强执行管理。",
    service4Bullets: [
      "AI 销售线索管理",
      "AI 智能客户服务",
      "AI 企业知识库设计",
      "业务工作流自动化",
      "数字化日常运营管理",
      "决策层高管看板集成"
    ],
    service4Footer: "Explore AsoraCore →",
    
    whereWeOperateLabel: "市场网络",
    whereWeOperateTitle: "双向极速合规走廊",
    whereWeOperateSubtitle: "考察我们在中东海湾国家、中国主要起运地和全球高成长转运枢纽的自营网点，畅享一站式出海极速通途。",
    whereWeOperateBtn: "规划在岸路径",

    whyGCILabel: "执行案例",
    whyGCITitle: "案例展示 & 智能落地诊断系统",
    whyGCIAdv1Title: "沙特利雅得办事处",
    whyGCIAdv1Desc: "直接派驻我们熟悉海关与市政执照的阿拉伯代表，上门跑腿打通本地商用牌照及免税申报准入。",
    whyGCIAdv2Title: "阿联酋迪拜展示间",
    whyGCIAdv2Desc: "配备特装展架样机陈列与专业的大宗考察接待室，供本地区域一级批发商与零售商公会现场看样下单。",
    whyGCIAdv3Title: "自营 COOLHOME GCC 实业资质",
    whyGCIAdv3Desc: "我们在海湾自营着高体量实业，验证了我们在在岸开户、关税流转、物流运力等方面有着极其顺畅的通道。",
    whyGCIAdv4Title: "AI 跨境智能引擎",
    whyGCIAdv4Desc: "通过专有税则及本地大进口商匹配算法，几秒内对准特定出海品类的最佳分销渠道与落地步骤规划。",
    
    whyGciFormTitle: "智能出海在岸落地诊断系统",
    whyGciFormLabel1: "目标目的地市场",
    whyGciFormLabel2: "中国出海主体性质",
    whyGciFormLabel3: "本地化核心诉求",
    whyGciFormPlaceholder: "例如：中国高端智能制造品牌方，寻找沙特和阿联酋的实体展示间租赁、本地物流配送以及 vetted 大分销买单对接...",
    whyGciFormSubmitBtn: "一键生成落地方案大纲",
    whyGciFormSubmitting: "在岸合规库实时检索中...",
    whyGciFormNotice: "声明：此报告通过 GCI 专属中东业务网络及 AI 底层知识图谱检索生成，旨在帮助企业打通落地第一步。",
    
    visualLabel: "纪实中心",
    visualTitle: "现场考察、考察成果与物理展示间",
    visualSubtitle: "毫无滤镜的实战影像，记录我们在岸样机展厅、接待出海高管团队洽谈、并前往海关自贸物流园区清关理货实操。",
    visualTab1: "在岸物理特装展示厅",
    visualTab2: "中国出海政企高管代表团",
    visualTab3: "边境港区及海外仓储理货",
    visualPlayText: "播放现场实操记录片",

    contactLabel: "联系商务团队",
    contactTitle: "现在开启中东及全球大门",
    contactSubtitle: "预留您的出海意向，直接链接迪拜和沙特的执行团队高管，12个工作小时内为您排班安排沟通会议。",
    contactFormName: "联系人姓名",
    contactFormEmail: "企业邮箱",
    contactFormCompany: "公司名称",
    contactFormCorridor: "目标市场/Corridor",
    contactFormMsg: "出海产品特点及最紧迫的在岸执行需求",
    contactFormSubmit: "提呈出海业务意向",
    contactFormSuccess: "您的意向书已成功提呈！GCI 驻迪拜合伙人及沙特项目负责人将在12个工作小时内直接与您联系。",
    contactWhatsApp: "WhatsApp 在岸直连",
    contactEmailUs: "咨询邮箱 (Email)",
    contactCallUs: "迪拜总部电话 (Dubai HQ)",
    contactOffice: "迪拜管理总部物理定位"
  },
  AR: {
    navHome: "الرئيسية",
    navWhoWeAre: "من نحن",
    navWhatWeDo: "خدماتنا",
    navWhereWeOperate: "شبكة النفوذ",
    navWhyGCI: "لماذا GCI",
    navMedia: "الشبكة التجارية",
    navInsights: "التحديثات واللوائح",
    navContact: "اتصل بنا",
    contactBtn: "حجز استشارة",
    
    heroBadge: "خطة التوسع العالمي للشركات",
    heroTitle: "China Resources.\nGLOBAL EXECUTION.",
    heroSubtitle: "نحن نربط الموارد. ننسق العمليات الميدانية. نحقق النتائج للمجموعات.",
    heroDesc: "تساعد GCI الشركات على ربط الموارد ودخول الأسواق وتنفيذ المشاريع في الشرق الأوسط وأفريقيا وأسواق عالمية مختارة.",
    heroCtaPrimary: "احجز جلسة استشارة",
    heroCtaSecondary: "استكشف الأسواق والممرات",
    heroHoverTip: "ضع المؤشر على العقد اللوجستية لاستكشاف الممرات الثنائية المتاحة لـ GCI",
    
    whoWeAreLabel: "من نحن",
    whoWeAreTitle: "معرفة محلية.\nشبكة إقليمية.\nقدرة على التنفيذ.",
    whoWeAreDesc1: "GCI هي منصة تنفيذ تجاري مقرها دبي، تخدم الشركات المصنعة، وأصحاب العلامات التجارية، ومطوري المشاريع، وشركات التجارة التي تتوسع في الأسواق الإقليمية والدولية.\n\nنحن نجمع بين المعرفة بالسوق المحلية، وشبكات الأعمال الإقليمية، وخبرة التنفيذ عبر الحدود لمساعدة المشاريع على الانتقال من مرحلة الفرص إلى حيز التنفيذ.",
    whoWeAreDesc2: "قوتنا تكمن في التنفيذ العملي.\n\nمن خلال شبكات تجارية موثوقة، وشركاء الصناعة، والموارد الإقليمية، تساعد GCI الشركات على تأسيس حضورها في السوق، وتطوير القنوات، وتنسيق سلاسل الإمداد، ودعم تسليم المشاريع عبر الأسواق الإقليمية والعالمية.",
    whoWeAreTargetTitle: "من نخدمهم",
    whoWeAreTargets: ["الشركات المصنعة", "أصحاب العلامات التجارية", "مطورو المشاريع", "شركات التجارة", "المستثمرون", "الشركاء الاستراتيجيون"],
    whoWeAreMarketTitle: "نطاق عملياتنا",
    whoWeAreMarkets: ["الإمارات العربية المتحدة", "المملكة العربية السعودية", "البحرين", "سلطنة عُمان", "كينيا", "الصين", "فيتنام", "كمبوديا", "إندونيسيا", "المغرب", "البرازيل"],

    whatWeDoLabel: "مستويات الخدمة",
    whatWeDoTitle: "أربع قدرات تجارية أساسية",
    whatWeDoSubtitle: "تربط GCI الموارد وتنسق التنفيذ وتدعم نمو الأعمال في الأسواق الإقليمية والعالمية من خلال أربع قدرات رئيسية.",
    
    service1Title: "1. Market Entry & Business Services",
    service1Desc: "مساعدة الشركات على تأسيس حضورها التجاري وتطوير الفرص الاستثمارية في الأسواق الإقليمية والدولية.",
    service1Bullets: [
      "تقييم فرص السوق وتحديد الثغرات",
      "مطابقة وتنسيق المقابلات والأعمال",
      "تطوير القنوات وشبكات التوزيع",
      "تنسيق الزيارات والوفود الاستكشافية",
      "التعريف والربط المباشر بالشركاء",
      "تقديم الدعم التجاري والتشغيلي"
    ],
    service1Footer: "Business Development",
    
    service2Title: "2. Trade & Supply Chain Solutions",
    service2Desc: "ربط مصادر الإمداد الصينية بالطلب في الأسواق الإقليمية من خلال تنسيق التوريد والخدمات اللوجستية والدعم التوزيعي.",
    service2Bullets: [
      "البحث عن الموردين والجمع اللوجستي",
      "التنسيق الفعال لكافة المشتريات",
      "تسهيل الشحن والخدمات اللوجستية المتعددة",
      "تأمين قنوات الدعم والتوزيع المحلي",
      "توجيه وتسهيل موارد التخزين المتنوعة",
      "دعم وتسهيل انسيابية الحركة التجارية"
    ],
    service2Footer: "Supply Chain Network",
    
    service3Title: "3. Project & Living Solutions",
    service3Desc: "دعم مشاريع الضيافة، الحلول السكنية، المساحات المكتبية والمنشآت التجارية عبر حلول التوريد المتكاملة للمشاريع.",
    service3Bullets: [
      "توفير متممات وحلول FF&E للمشاريع",
      "توريد الأثاث والمفروشات المتكاملة",
      "توريد مواد البناء والحلول الهيكلية",
      "توفير التشطيبات الداخلية والديكورات",
      "دعم توريد مشاريع الضيافة والفنادق",
      "حلول وتخطيط المساحات المكتبية والبيئات"
    ],
    service3Footer: "Explore COOLHOME GCC →",
    
    service4Title: "4. Digital & AI Solutions",
    service4Desc: "تمكين الشركات من رفع مبيعاتها وتحسين عملياتها اليومية والإدارية من خلال أنظمة ذكية لإدارة سير العمل.",
    service4Bullets: [
      "إدارة العملاء والصفقات بالذكاء الاصطناعي",
      "أنظمة خدمة العملاء والمحادثة الذكية",
      "تأسيس قواعد المعرفة المؤسسية الشاملة",
      "أتمتة وتطوير تدفق وسير العمل",
      "الرقابة الرقمية على العمليات والتشغيل",
      "لوحات بيانات القيادة لصناع القرار"
    ],
    service4Footer: "Explore AsoraCore →",
    
    whereWeOperateLabel: "مواقع عملياتنا",
    whereWeOperateTitle: "الممرات النشطة والشبكة العالمية",
    whereWeOperateSubtitle: "نربط موارد الصين بسوق مجلس التعاون الخليجي، وموانئ شرق إفريقيا، ومناطق التوسع الصاعدة بالبرازيل والمغرب.",
    whereWeOperateBtn: "تنسيق ممر محلي",

    whyGCILabel: "لماذا GCI",
    whyGCITitle: "فارق التنفيذ الفعلي على الأرض وتملك الأصول التشغيلية",
    whyGCIAdv1Title: "مقر إدارة دبي",
    whyGCIAdv1Desc: "نتحكم في عملياتنا من دبي بقدرة اتصال وتواصل فورية ومباشرة مع الموانئ والجمارك والمشتريات المحلية.",
    whyGCIAdv2Title: "قنوات التوزيع الموثقة",
    whyGCIAdv2Desc: "عقود مباشرة وشبكات حية تشمل كبار المستوردين والموزعين وجماعات التجزئة بدول الخليج العربي.",
    whyGCIAdv3Title: "أصول COOLHOME GCC الحية",
    whyGCIAdv3Desc: "لسنا مجرد شركة استشارية: ندير عملنا ومستودعاتنا وتجارتنا على الأرض كدليل قاطع على تسليم اللوجستيات بكفاءة.",
    whyGCIAdv4Title: "أنظمتنا الذكية للتحليل",
    whyGCIAdv4Desc: "قواعد بيانات مؤتمتة تختصر أسابيع من البحث عما يخص التعرفة الجمركية ومطابقة التراخيص في دول الخليج.",
    
    whyGciFormTitle: "معالج تقييم وتلاؤم ممرات GCI اللوجستية",
    whyGciFormLabel1: "الوجهة التشغيلية المستهدفة",
    whyGciFormLabel2: "هوية الكيان المصدر",
    whyGciFormLabel3: "أهداف ومطالب التشغيل",
    whyGciFormPlaceholder: "مثال: مجمع لتصنيع المعدات يبحث عن مساحات تخزين لوجستية معتمدة ووكلاء توزيع معتمدين وجلسة تنسيق في الرياض.",
    whyGciFormSubmitBtn: "إصدار التقرير المبدئي للتأسيس والتوجيه",
    whyGciFormSubmitting: "جار البحث بقاعدة البيانات الميدانية...",
    whyGciFormNotice: "ملاحظة: هذا التقرير يصدر بناء على قواعد معلوماتنا وعقودنا المحلية بالموانئ بدول الخليج لتقليل زمن الدخول.",
    
    visualLabel: "المركز الإعلامي",
    visualTitle: "التوثيق الميداني والأصول الملموسة",
    visualSubtitle: "لقطات واقعية من صالات العرض للمنتجات، واستقبال وفود رجال الأعمال والمصنعين، والتحقق الجمركي بالموانئ.",
    visualTab1: "صالات العرض المادية GCI",
    visualTab2: "وفود أعمال ومجموعات مصاحبة",
    visualTab3: "زيارات التحقق والتخليص بالموانئ",
    visualPlayText: "تشغيل ملف الفيديو التوثيقي عالي الدقة",

    contactLabel: "تواصل مع المكاتب",
    contactTitle: "ابدأ توسعك الآن وافتح بوابتك التجارية",
    contactSubtitle: "تواصل في الحال مع كادرنا القيادي في دبي والرياض لتنسيق وحجز خطة تأسيس الممر والوفد الميداني.",
    contactFormName: "الاسم الكريم",
    contactFormEmail: "البريد الإلكتروني المهني",
    contactFormCompany: "اسم المؤسسة / المصنع",
    contactFormCorridor: "ممر مستهدف مخصص",
    contactFormMsg: "أهداف التوسع التصديري وأكثر المطالب الميدانية إلحاحاً",
    contactFormSubmit: "إرسال خطاب الرغبة التشغيلية",
    contactFormSuccess: "تم الاستلام بنجاح. تواصلك مأخوذ بالاعتبار وسنراجع التوافق مع أحد مستشارينا الميدانيين والرد في غضون 12 ساعة كحد أقصى.",
    contactWhatsApp: "محادثة مباشرة واتساب",
    contactEmailUs: "البريد الرسمي للمعاملات",
    contactCallUs: "هاتف المقر الرئيسي دبي",
    contactOffice: "الموقع الجغرافي والمبنى المقر"
  }
};

// Map Section Regional Data Definition
export interface RegionDataPack {
  id: "UAE" | "GCC" | "Africa" | "China";
  name: string;
  native: string;
  role: string;
  hubs: string[];
  capacity: string;
  cycle: string;
  objecting: string;
  benchmarks: string[];
}

export const REGIONS_CORRIDOR_DATA: Record<"EN" | "ZH" | "AR", Record<string, RegionDataPack>> = {
  EN: {
    UAE: {
      id: "UAE",
      name: "GCC Active Markets",
      native: "دبي - السعودية - البحرين",
      role: "Core GCC Localization and Local Execution Zone (UAE, Saudi Arabia, Bahrain)",
      hubs: ["GCI Dubai Management HQ", "Riyadh Liaison Office Network", "Bahrain Operations Node"],
      capacity: "12,000+ Sqm Storage Coordinated",
      cycle: "7-12 Days Coordination Cycle",
      objecting: "Coordinating fully responsive local commercial structures, supplier agreements, and boots-on-the-ground client negotiation support. Fully operates GCI's division COOLHOME GCC.",
      benchmarks: ["Direct client contract matchmaking", "Vetted in-country representation setup", "Secured distributor and buyer co-signing", "Dual-office operational representation"]
    },
    GCC: {
      id: "GCC",
      name: "China & SE Asia Source Network",
      native: "الصين والشرق الأقصى",
      role: "Industrial Core & Supply Chain Routing (China, Vietnam, Cambodia, Indonesia)",
      hubs: ["Shenzhen GBA Supply Hub", "Cambodia Representative Desk", "Vietnam Customs Portal Node", "Jakarta Liaison Desk"],
      capacity: "Source-side Quality Audited Capacity",
      cycle: "Immediate Export Dispatch Alignments",
      objecting: "Securing origin-side supply, carrying out strict technological audits, pre-clearance custom categorizations, and dual-currency transaction routing before global distribution.",
      benchmarks: ["Pre-booking prime shipping lines", "Origin supplier auditing and checks", "Tariff code mapping and indexing", "Sino-GCC supply chain optimization"]
    },
    Africa: {
      id: "Africa",
      name: "East African Gateways",
      native: "شرق إفريقيا - كينيا",
      role: "Bilateral Trade Integration & Resource Flow (Kenya Hubs)",
      hubs: ["Nairobi Operations Center", "Mombasa Port Liaison Desk"],
      capacity: "Overland Trucking & Clearing Networks",
      cycle: "10-15 Cargo Clearing Days",
      objecting: "Guiding custom-bonded port monitoring, multi-modal container transport, and matching product parameters directly with East African wholesale/supermarket guilds.",
      benchmarks: ["Dry port customs pre-clearance", "Bilateral trade protocol alignment", "Logistics route planning", "Local enterprise buyer introduction"]
    },
    China: {
      id: "China",
      name: "Global Expansion Markets",
      native: "المغرب - البرازيل - أمريكا اللاتينية",
      role: "High-Potential Future Corridors (Morocco, Brazil, Latin America)",
      hubs: ["Casablanca Operations Portal", "São Paulo Representative Node", "Latin America Coordination Hub"],
      capacity: "Expansion Feasibility & Trade Routing",
      cycle: "On-demand Compliance Setups",
      objecting: "Nurturing high-priority networks in future regional nodes, analyzing feasibility, and lining up potential importers for outbound manufacturing.",
      benchmarks: ["Feasibility audits and trade analysis", "Strategic importer matchmakings", "Local partner due diligences", "Regulatory compliance roadmaps"]
    }
  },
  ZH: {
    UAE: {
      id: "UAE",
      name: "GCC 核心活性市场",
      native: "دبي - السعودية - البحرين",
      role: "GCC成员国在岸深入本土化与交付执行区 (阿联酋、沙特、巴林)",
      hubs: ["GCI 迪拜管理总部", "利雅得业务协调处", "巴林自营分拨网点"],
      capacity: "12,000+ 平米保税仓储协商调配",
      cycle: "7-12 天在岸落地极速协调",
      objecting: "提供专业的在岸商贸落地执行、本土大客户合同谈判随同、保税仓储租赁协助。全权直接运营 GCI 旗下自营出海标杆 division —— COOLHOME GCC。",
      benchmarks: ["真实终端商业大客户匹配", "可靠在岸法务代表日常托管", "本地商超/大型分销直签代理", "双边在岸办事处业务日常督办"]
    },
    GCC: {
      id: "GCC",
      name: "中国与东南亚供应链源头",
      native: "الصين والشرق الأقصى",
      role: "源头供应链整合、审核与产品代码前置核验 (中国、越南、柬埔寨、印尼)",
      hubs: ["深圳大湾区供应链协调总部", "柬埔寨产品配载台", "越南前置清关联络点", "印尼雅加达国际部"],
      capacity: "起运港一站式质量前置核驳与订舱",
      cycle: "当天对接起运海运/航空航线",
      objecting: "在出港前协助企业做产品、制造标准的在岸适配度核准，并解决跨境金融清算路径，大幅缩短目的港可能遭遇的阻滞期。",
      benchmarks: ["海运远洋及干线航空极速配载", "源头供应商经营真实度交叉审核", "税则编码HS Code前置预对齐及分类", "双海关直航绿色前置通行码申报"]
    },
    Africa: {
      id: "Africa",
      name: "东非门户通道",
      native: "شرق إفريقيا - كينيا",
      role: "物资与转口多式联运协调地带 (肯尼亚枢纽)",
      hubs: ["内罗毕业务中心", "蒙巴萨港口前置办事处"],
      capacity: "当地主力转运及卡班运输资源调配",
      cycle: "10-15 工作日快速清关清卡",
      objecting: "主要管理内陆多式联运过境，与本地保税干仓网络合作，并将优质商品直供肯尼亚及相邻商贸国家的核心批发集散网络。",
      benchmarks: ["保税港海关审核前置处理", "符合东非共同体EAC规范测算", "陆运跨境关网卡车运输班列", "当地批发商和商超买家一对一对准"]
    },
    China: {
      id: "China",
      name: "新兴拓展市场",
      native: "المغرب - البرازيل - أمريكا اللاتينية",
      role: "高增长、高潜能战略业务延伸版块 (摩洛哥、巴西、拉丁美洲)",
      hubs: ["卡萨布兰卡业务接口", "巴西圣保罗合作中心", "拉美国际化协调站"],
      capacity: "新兴市场商业准入和分销路径咨询",
      cycle: "按需快速合规筛查和路径诊断",
      objecting: "针对拉美、巴西及北非等高成长外包及转口重点节点，提前进行渠道网络及采购信誉筛查，为后期战略落地提供无痛缓冲。",
      benchmarks: ["地缘政策合规及贸易税则论证", "当地大型活跃买家数据库预扫描", "在地配套仓配仓储资源评估", "首批次商业样品进入流程指引"]
    }
  },
  AR: {
    UAE: {
      id: "UAE",
      name: "أسواق الخليج النشطة",
      native: "دبي - السعودية - البحرين",
      role: "منطقة التوطين الخليجية والتنفيذ الميداني المباشر (الإمارات، السعودية، البحرين)",
      hubs: ["مقر إدارة GCI دبي الرئيسي", "مكتب الرياض اللوجستي التشغيلي", "وحدة المنامة لدعم الموزعين"],
      capacity: "مشاطرة ومزامنة أكثر من ١٢,٠٠٠ متر تخزين",
      cycle: "٧-١٢ أيام عمل لإتمام التنسيق والتراخيص",
      objecting: "توجيه وتوطين العقود ودعم الوفود التجارية الصيفية. كما ندير بشكل مباشر وحدة توريد وبيع وتخزين الأثاث والمعدات التابعة لنا COOLHOME GCC بجدية تامة.",
      benchmarks: ["مطابقة المشترين والربط بنظام الفواتير الموحد", "تخطيط وبناء مكاتب التمثيل والاتصال الموثقة", "عقود التوزيع وتأمين طلبيات كبار الموزعين لبلدانكم", "الربط الفوري بنقاط التوزيع البلدية والمناطق اللوجستية"]
    },
    GCC: {
      id: "GCC",
      name: "مجمع الصين وجنوب شرق آسيا",
      native: "الصين والشرق الأقصى",
      role: "شبكة تصنيف الموارد وتنسيق الشحنات من المصدر (الصين، فيتنام، كمبوديا، إندونيسيا)",
      hubs: ["محور شنتشن لتنسيق الموردين", "مكتب كمبوديا لفحص الجودة والوزن", "معبر فيتنام للتخليص المسبق", "مكتب جاكرتا لإدارة العملات"],
      capacity: "التحقق وتأمين معايير السلع من起运海运",
      cycle: "سرعة شحن فورية من المصدر للخليج",
      objecting: "إجراء وتدقيق الجودة الفنية للصانعين من المصدر ومطابقة كود الجمارك الثنائي وتأمين ممرات المعاملات المالية قبل عبور الشحن.",
      benchmarks: ["حجز مساحات الشحن الاستراتيجية من المصدر", "شروط الفحص من المنبع وتصنيفات السلامة", "خرائط جمركية لتقليل الرسوم بموانئ الخليج", "تنسيق مالي آمن للعمليات وتوطين العملات"]
    },
    Africa: {
      id: "Africa",
      name: "ممرات شرق إفريقيا",
      native: "شرق إفريقيا - كينيا",
      role: "بوابة الربط والتوطين اللوجستي لشرق القارة (كينيا بمنافذها العابرة)",
      hubs: ["مقر نيروبي لإدارة الحاويات", "مكتب مومباسا المالي والبرتي المالي بالموانئ"],
      capacity: "شبكة نقل بري ومقطورات مجهزة للشحن الجمركي",
      cycle: "١٠-١٥ يوما لإنجاز فك الشحن والمناولة",
      objecting: "تنظيم وتملك الشحن الجاف والتحكم في كود الترانزيت وربط بضائعكم مباشرة بكبار ممثلي أسواق التجزئة والسوبر ماركت.",
      benchmarks: ["سرعة التخليص الجمركي بالميناء الجاف المعتمد", "مطابقة شروط EAC الموحدة لشرق إفريقيا", "تخطيط مسارات الشحن البري المتكامل العابر", "ربط الصانعين بكبار عملاء التجزئة للمتاجر والجمعيات"]
    },
    China: {
      id: "China",
      name: "الأسواق التوسعية الصاعدة",
      native: "المغرب - البرازيل - أمريكا اللاتينية",
      role: "ممرات المستقبل ذات النمو المتسارع (المغرب، البرازيل، أمريكا اللاتينية)",
      hubs: ["بوابة الدار البيضاء التجارية", "محور ساو باولو البرازيلي", "مكتب تنمية أمريكا اللاتينية والبيانات"],
      capacity: "دراسات ومطابقة شروط الولوج الاستيرادي",
      cycle: "استشارات وتقييم فوري حسب الطلب",
      objecting: "بناء أسس الحماية والتعريف التشغيلي السريع في عواصم النمو القادم من نيروبي إلى أمريكا اللاتينية والمغرب وتصفية المستوردين.",
      benchmarks: ["دراسات وبحوث الجدوى التشغيلية وتحديد التعريفة", "تصفية وبناء قوائم كبار المستوردين النشطين", "تدقيق الشركاء والوعود القانونية المحلية", "إصدار الرخص الأولية لدخول السلع وعرض النماذج"]
    }
  }
};

export const MEDIA_SHOWCASE_DATA = [
  {
    id: 1,
    image: "/src/assets/images/case_robotics_dubai_1780768291268.png",
    category: "PHYSICAL SHOWROOMS",
    title: "GCI Active Representational Fabric",
    titleZh: "GCI 在岸实体样机及仓配大楼",
    titleAr: "صالات العرض والأصول الميدانية GCI",
    desc: "Physical industrial, machinery, and products demonstration spaces inside our coordinated logistics hubs in Dubai, showcasing standard outbound setups.",
    descZh: "立足迪拜自建实体展厅与仓配基地。供中国出海制造企业、品牌商陈列展示重型样机及工业物料，并提供即时在岸发货保障，大买家可现场实操并签约。",
    descAr: "صالات وقاعات مجهزة بالكامل لعرض النماذج والمعدات للمشترين وتجار الجملة مباشرة مع توفير الفحص اللوجستي."
  },
  {
    id: 2,
    image: "/src/assets/images/case_solar_riyadh_1780768308627.png",
    category: "CLIENT DELEGATIONS",
    title: "Outbound Delegation & Business Matches",
    titleZh: "中东大区出海代表团在岸商务洽谈",
    titleAr: "الوفود ومجموعات التنسيق المصاحبة",
    desc: "Active client delegation forums and strategic executive matchmaking sessions to clear target distribution agreements on-site.",
    descZh: "由 GCI 核心合伙人与中东本地大区负责人全程带队，带领出海企业高层直通商务会同现场，面对面商议本土代销、干仓共享与经销承诺，避免纸上谈兵。",
    descAr: "الاستضافة والربط التجاري وعقد الحلقات النقاشية والتعريفية للتأكد من فاعلية الموزعين في الرياض وجدة."
  },
  {
    id: 3,
    image: "/src/assets/images/case_medical_mombasa_1780768328334.png",
    category: "LOGISTICS FIELD INSPECTIONS",
    title: "On-Ground Port & Depot Investigations",
    titleZh: "保税仓、港区与多式联运实物视察",
    titleAr: "جولات المطابقة الجمركية لتدفق سلاسل الإمداد",
    desc: "GCI trade directors inspecting physical container discharging, seals conformity, and route dispatching on-ground to safeguard client goods.",
    descZh: "GCI 驻地报关员与现场物流主管亲临海空枢纽自贸港口、保税拼箱货理库、返空堆栈等核心现场，全流程实地督办，杜绝一切理论瓶垒物差，保障时效。",
    descAr: "جولات طاقمنا الميداني لمطابقة الشحنات وصالات الفحص الجمركي وتفقد المستودعات لتأمين سلامة عبور البضائع."
  }
];
