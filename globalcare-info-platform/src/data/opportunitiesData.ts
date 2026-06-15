export interface Opportunity {
  id: string;
  slug: string;
  titleEN: string;
  titleZH: string;
  titleAR: string;
  country: string;
  countryZH: string;
  countryAR: string;
  status: "Active" | "Under Development" | "Opportunity";
  statusZH: string;
  statusAR: string;
  tags: string[];
  tagsZH: string[];
  tagsAR: string[];
  image: string;
  youtubeUrl: string;
  overviewEN: string;
  overviewZH: string;
  overviewAR: string;
  currentFocusEN: string[];
  currentFocusZH: string[];
  currentFocusAR: string[];
  potentialOpportunitiesEN: string[];
  potentialOpportunitiesZH: string[];
  potentialOpportunitiesAR: string[];
  whoShouldContactEN: string[];
  whoShouldContactZH: string[];
  whoShouldContactAR: string[];
}

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    slug: "morocco-development-opportunity",
    titleEN: "Morocco Development Opportunity",
    titleZH: "摩洛哥开发项目机会",
    titleAR: "فرصة التطوير في المغرب",
    country: "Morocco",
    countryZH: "摩洛哥",
    countryAR: "المغرب",
    status: "Under Development",
    statusZH: "开发中",
    statusAR: "قيد التطوير",
    tags: ["Real Estate", "Supplier Development", "Investment"],
    tagsZH: ["房地产", "供应商开发", "投资"],
    tagsAR: ["العقارات", "تطوير الموردين", "الاستثمار"],
    image: "/images/countries/country-morocco.jpg",
    youtubeUrl: "",
    overviewEN: "GCI is actively facilitating connections and commercial coordination for a development opportunity in Morocco. This engagement focuses on supporting real estate-linked supply chain requirements and identifying qualified suppliers for large-scale project delivery. Morocco's accelerating infrastructure development, combined with its strategic position as a gateway between Africa and Europe, creates significant upstream and downstream commercial opportunities for qualified partners.",
    overviewZH: "GCI 正积极促进摩洛哥一项开发机会的商业联络与协调工作。本项目重点支持与房地产相关的供应链需求，并为大型项目交付寻找合格供应商。摩洛哥持续加速的基础设施建设，加之其作为非洲与欧洲之间战略门户的独特地位，为合格合作伙伴创造了重要的上下游商业机遇。",
    overviewAR: "تعمل GCI بنشاط على تسهيل الاتصالات والتنسيق التجاري لفرصة تطوير في المغرب. يركز هذا التعاون على دعم متطلبات سلسلة التوريد المرتبطة بالعقارات وتحديد موردين مؤهلين لتنفيذ مشاريع واسعة النطاق.",
    currentFocusEN: [
      "Coordinating supplier qualification and procurement matching",
      "Supporting logistics and import planning for project materials",
      "Facilitating commercial introductions between project stakeholders",
      "Assessing FF&E and construction material sourcing requirements"
    ],
    currentFocusZH: [
      "协调供应商资质审核与采购匹配",
      "支持项目物资的物流与进口规划",
      "促进项目利益相关方之间的商业对接",
      "评估家具设备及建筑材料的采购需求"
    ],
    currentFocusAR: [
      "تنسيق تأهيل الموردين ومطابقة المشتريات",
      "دعم التخطيط اللوجستي والاستيراد لمواد المشروع",
      "تسهيل التعريف التجاري بين أصحاب المصلحة في المشروع",
      "تقييم متطلبات مصادر الأثاث والمعدات ومواد البناء"
    ],
    potentialOpportunitiesEN: [
      "Supplier and manufacturer partnerships for construction materials",
      "FF&E sourcing and procurement coordination",
      "Logistics and freight forwarding services",
      "Local market entry support for international suppliers"
    ],
    potentialOpportunitiesZH: [
      "建筑材料供应商和制造商合作",
      "家具设备采购协调",
      "物流和货运代理服务",
      "为国际供应商提供本地市场进入支持"
    ],
    potentialOpportunitiesAR: [
      "شراكات الموردين والمصنعين لمواد البناء",
      "تنسيق مصادر الأثاث والمعدات والمشتريات",
      "خدمات اللوجستيات وشحن البضائع",
      "دعم دخول السوق المحلي للموردين الدوليين"
    ],
    whoShouldContactEN: [
      "Construction material manufacturers and exporters",
      "FF&E suppliers with international delivery capability",
      "Logistics and freight companies with Africa/Europe experience",
      "Investors interested in Morocco's development sector"
    ],
    whoShouldContactZH: [
      "建筑材料制造商和出口商",
      "具备国际配送能力的家具设备供应商",
      "拥有非洲/欧洲经验的物流和货运公司",
      "对摩洛哥开发领域感兴趣的投资者"
    ],
    whoShouldContactAR: [
      "مصنعو ومصدرو مواد البناء",
      "موردو الأثاث والمعدات ذوو قدرة التسليم الدولي",
      "شركات اللوجستيات والشحن ذات خبرة في أفريقيا/أوروبا",
      "المستثمرون المهتمون بقطاع التطوير في المغرب"
    ]
  },
  {
    id: "opp-2",
    slug: "cambodia-industrial-park",
    titleEN: "Cambodia Industrial Park Opportunity",
    titleZH: "柬埔寨工业园机会",
    titleAR: "فرصة المنطقة الصناعية في كمبوديا",
    country: "Cambodia",
    countryZH: "柬埔寨",
    countryAR: "كمبوديا",
    status: "Active",
    statusZH: "进行中",
    statusAR: "نشط",
    tags: ["Industrial Park", "Manufacturing", "Investment"],
    tagsZH: ["工业园区", "制造业", "投资"],
    tagsAR: ["منطقة صناعية", "تصنيع", "استثمار"],
    image: "/images/opportunities/cambodia-industrial.jpg",
    youtubeUrl: "",
    overviewEN: "GCI is supporting commercial coordination and partner matching for an active industrial park development opportunity in Cambodia. This engagement targets manufacturers and industrial operators seeking to establish or expand production facilities in Southeast Asia, taking advantage of Cambodia's competitive manufacturing environment, preferential trade agreements, and growing regional demand. The opportunity covers factory setup, supply chain integration, and go-to-market coordination.",
    overviewZH: "GCI 正为柬埔寨一项进行中的工业园开发机会提供商业协调和合作伙伴匹配支持。本项目面向希望在东南亚建立或扩大生产设施的制造商和工业运营商，借助柬埔寨具有竞争力的制造环境、优惠贸易协定及不断增长的区域需求。机会涵盖工厂设立、供应链整合和市场进入协调。",
    overviewAR: "تدعم GCI التنسيق التجاري ومطابقة الشركاء لفرصة تطوير منطقة صناعية نشطة في كمبوديا. تستهدف هذه المشاركة المصنعين والمشغلين الصناعيين الراغبين في إنشاء أو توسيع مرافق الإنتاج في جنوب شرق آسيا.",
    currentFocusEN: [
      "Matching manufacturers with available industrial land and facilities",
      "Coordinating factory setup and operational requirements",
      "Supporting supply chain and raw material procurement",
      "Facilitating investment coordination and commercial introductions"
    ],
    currentFocusZH: [
      "将制造商与可用工业用地和设施进行匹配",
      "协调工厂设立和运营需求",
      "支持供应链和原材料采购",
      "促进投资协调和商业对接"
    ],
    currentFocusAR: [
      "مطابقة المصنعين مع الأراضي الصناعية والمرافق المتاحة",
      "تنسيق إعداد المصانع ومتطلبات التشغيل",
      "دعم سلسلة التوريد وشراء المواد الخام",
      "تسهيل تنسيق الاستثمار والتعريفات التجارية"
    ],
    potentialOpportunitiesEN: [
      "Industrial land and factory leasing or ownership",
      "Manufacturing partnerships and joint ventures",
      "Supply chain setup for regional or global distribution",
      "Investment into industrial infrastructure"
    ],
    potentialOpportunitiesZH: [
      "工业用地和工厂租赁或所有权",
      "制造业合伙和合资企业",
      "面向区域或全球分销的供应链建立",
      "工业基础设施投资"
    ],
    potentialOpportunitiesAR: [
      "تأجير الأراضي الصناعية والمصانع أو تملكها",
      "شراكات التصنيع والمشاريع المشتركة",
      "إنشاء سلسلة التوريد للتوزيع الإقليمي أو العالمي",
      "الاستثمار في البنية التحتية الصناعية"
    ],
    whoShouldContactEN: [
      "Manufacturers seeking Southeast Asia production base",
      "Industrial investors looking for emerging market exposure",
      "Companies planning supply chain relocation or diversification",
      "Trading companies with regional distribution networks"
    ],
    whoShouldContactZH: [
      "寻求东南亚生产基地的制造商",
      "寻找新兴市场敞口的工业投资者",
      "计划供应链迁移或多元化的企业",
      "拥有区域分销网络的贸易公司"
    ],
    whoShouldContactAR: [
      "المصنعون الباحثون عن قاعدة إنتاج في جنوب شرق آسيا",
      "المستثمرون الصناعيون الباحثون عن التعرض لأسواق ناشئة",
      "الشركات التي تخطط لنقل سلسلة التوريد أو تنويعها",
      "شركات التداول ذات شبكات التوزيع الإقليمية"
    ]
  },
  {
    id: "opp-3",
    slug: "cambodia-halal-industrial-park",
    titleEN: "Cambodia Halal Industrial Park",
    titleZH: "柬埔寨清真工业园",
    titleAR: "المنطقة الصناعية الحلال في كمبوديا",
    country: "Cambodia",
    countryZH: "柬埔寨",
    countryAR: "كمبوديا",
    status: "Active",
    statusZH: "进行中",
    statusAR: "نشط",
    tags: ["Halal Industry", "Food Processing", "Investment"],
    tagsZH: ["清真产业", "食品加工", "投资"],
    tagsAR: ["الصناعة الحلال", "معالجة الأغذية", "الاستثمار"],
    image: "/images/opportunities/cambodia-halal.jpg",
    youtubeUrl: "",
    overviewEN: "GCI is coordinating commercial engagement for a dedicated Halal Industrial Park opportunity in Cambodia, designed specifically for food processing, packaging, and halal-certified manufacturing operations. With increasing demand for halal products across Southeast Asia, the Middle East, and global Muslim markets, this opportunity positions manufacturers and food processors to tap into a rapidly growing supply chain ecosystem with access to ASEAN trade corridors and GCC export pathways.",
    overviewZH: "GCI 正为柬埔寨一个专属清真工业园机会协调商业接触，该工业园专为食品加工、包装及清真认证制造业设计。随着东南亚、中东及全球穆斯林市场对清真产品需求持续增长，该机会帮助制造商和食品加工企业进入快速成长的供应链生态系统，并可接入东盟贸易走廊及海湾国家出口通道。",
    overviewAR: "تنسق GCI التعاون التجاري لفرصة منطقة صناعية حلال مخصصة في كمبوديا، مصممة خصيصاً لعمليات معالجة الأغذية والتعبئة والتصنيع المعتمد حلالاً. مع تزايد الطلب على المنتجات الحلال عبر جنوب شرق آسيا والشرق الأوسط والأسواق الإسلامية العالمية.",
    currentFocusEN: [
      "Identifying halal food manufacturers and processors for park placement",
      "Coordinating halal certification pathway and compliance advisory",
      "Supporting export market connections to GCC and Southeast Asia",
      "Facilitating packaging, cold chain and logistics infrastructure"
    ],
    currentFocusZH: [
      "识别适合入驻园区的清真食品制造商和加工商",
      "协调清真认证流程和合规咨询",
      "支持与海湾国家及东南亚出口市场的连接",
      "促进包装、冷链和物流基础设施建设"
    ],
    currentFocusAR: [
      "تحديد مصنعي الأغذية الحلال ومعالجيها لوضعهم في المنطقة",
      "تنسيق مسار الشهادات الحلال والاستشارات الامتثالية",
      "دعم روابط السوق التصديرية لدول الخليج وجنوب شرق آسيا",
      "تسهيل التغليف وسلسلة البرودة والبنية التحتية اللوجستية"
    ],
    potentialOpportunitiesEN: [
      "Halal food production and processing facilities",
      "Packaging and cold storage infrastructure",
      "Halal certification and export compliance services",
      "Distribution partnerships for GCC and Muslim-majority markets"
    ],
    potentialOpportunitiesZH: [
      "清真食品生产和加工设施",
      "包装和冷藏基础设施",
      "清真认证和出口合规服务",
      "面向海湾国家及穆斯林主体市场的分销合作"
    ],
    potentialOpportunitiesAR: [
      "مرافق إنتاج الأغذية الحلال ومعالجتها",
      "البنية التحتية للتغليف والتخزين البارد",
      "خدمات الشهادات الحلال وامتثال التصدير",
      "شراكات التوزيع لدول الخليج وأسواق الأغلبية المسلمة"
    ],
    whoShouldContactEN: [
      "Halal food manufacturers and processors",
      "Food & beverage companies seeking ASEAN production base",
      "Investors in halal economy and food industry",
      "Exporters targeting GCC and Muslim-majority markets"
    ],
    whoShouldContactZH: [
      "清真食品制造商和加工商",
      "寻求东盟生产基地的食品饮料公司",
      "清真经济和食品行业投资者",
      "面向海湾国家和穆斯林主体市场的出口商"
    ],
    whoShouldContactAR: [
      "مصنعو الأغذية الحلال ومعالجوها",
      "شركات الأغذية والمشروبات الباحثة عن قاعدة إنتاج آسيان",
      "المستثمرون في الاقتصاد الحلال وصناعة الأغذية",
      "المصدرون المستهدفون لدول الخليج وأسواق الأغلبية المسلمة"
    ]
  },
  {
    id: "opp-4",
    slug: "dubai-land-opportunity",
    titleEN: "Dubai Land Opportunity",
    titleZH: "迪拜土地机会",
    titleAR: "فرصة أراضي دبي",
    country: "United Arab Emirates",
    countryZH: "阿联酋",
    countryAR: "الإمارات العربية المتحدة",
    status: "Opportunity",
    statusZH: "待接洽",
    statusAR: "فرصة",
    tags: ["Land", "Industrial", "Logistics"],
    tagsZH: ["土地", "工业", "物流"],
    tagsAR: ["أراضي", "صناعي", "لوجستيات"],
    image: "/images/countries/country-uae.jpg",
    youtubeUrl: "",
    overviewEN: "GCI is facilitating preliminary commercial coordination around a land opportunity in Dubai suitable for industrial, logistics, or light manufacturing use. Dubai's world-class logistics infrastructure, free zone ecosystem, and connectivity to global trade routes make it an ideal location for companies seeking a Middle East operational hub. GCI is supporting qualified parties in understanding the opportunity framework and coordinating appropriate commercial introductions.",
    overviewZH: "GCI 正在围绕迪拜一块适合工业、物流或轻型制造用途的土地机会进行初步商业协调。迪拜世界一流的物流基础设施、自由区生态系统及与全球贸易路线的连接，使其成为寻求中东运营枢纽的企业的理想选址。GCI 正在协助合格方了解机会框架并协调适当的商业对接。",
    overviewAR: "تسهل GCI التنسيق التجاري الأولي حول فرصة أراضٍ في دبي مناسبة للاستخدام الصناعي أو اللوجستي أو التصنيع الخفيف. تجعل البنية التحتية اللوجستية على مستوى عالمي لدبي ونظام المناطق الحرة واتصالها بطرق التجارة العالمية منها موقعاً مثالياً.",
    currentFocusEN: [
      "Qualifying interested parties for commercial engagement",
      "Providing framework overview to suitable investors and operators",
      "Coordinating introductions and preliminary discussions",
      "Supporting due diligence coordination for interested parties"
    ],
    currentFocusZH: [
      "对感兴趣方进行资质审核以进行商业接触",
      "为合适的投资者和运营商提供框架概述",
      "协调引荐和初步讨论",
      "为感兴趣方提供尽职调查协调支持"
    ],
    currentFocusAR: [
      "تأهيل الأطراف المهتمة للمشاركة التجارية",
      "تقديم نظرة عامة على الإطار للمستثمرين والمشغلين المناسبين",
      "تنسيق التعريفات والمناقشات الأولية",
      "دعم تنسيق العناية الواجبة للأطراف المهتمة"
    ],
    potentialOpportunitiesEN: [
      "Industrial and logistics land acquisition or leasing",
      "Light manufacturing facility development",
      "Warehouse and distribution hub development",
      "Free zone entity setup and operational coordination"
    ],
    potentialOpportunitiesZH: [
      "工业和物流土地收购或租赁",
      "轻型制造设施开发",
      "仓库和分销枢纽开发",
      "自由区实体设立和运营协调"
    ],
    potentialOpportunitiesAR: [
      "الاستحواذ على الأراضي الصناعية واللوجستية أو استئجارها",
      "تطوير مرافق التصنيع الخفيف",
      "تطوير مركز المستودعات والتوزيع",
      "إنشاء كيانات المناطق الحرة والتنسيق التشغيلي"
    ],
    whoShouldContactEN: [
      "Industrial operators and manufacturers seeking UAE base",
      "Logistics companies looking for Dubai hub",
      "Investors in industrial real estate or free zones",
      "Companies planning Middle East operational expansion"
    ],
    whoShouldContactZH: [
      "寻求阿联酋基地的工业运营商和制造商",
      "寻找迪拜枢纽的物流公司",
      "工业房地产或自由区投资者",
      "计划中东运营扩张的企业"
    ],
    whoShouldContactAR: [
      "المشغلون الصناعيون والمصنعون الباحثون عن قاعدة في الإمارات",
      "شركات اللوجستيات الباحثة عن مركز في دبي",
      "المستثمرون في العقارات الصناعية أو المناطق الحرة",
      "الشركات التي تخطط للتوسع التشغيلي في الشرق الأوسط"
    ]
  },
  {
    id: "opp-5",
    slug: "concrete-batching-plant-opportunity",
    titleEN: "Concrete Batching Plant Opportunity",
    titleZH: "混凝土搅拌站机会",
    titleAR: "فرصة محطة خلط الخرسانة",
    country: "United Arab Emirates",
    countryZH: "阿联酋",
    countryAR: "الإمارات العربية المتحدة",
    status: "Opportunity",
    statusZH: "待接洽",
    statusAR: "فرصة",
    tags: ["Construction", "Industrial Asset", "Investment"],
    tagsZH: ["建筑", "工业资产", "投资"],
    tagsAR: ["البناء", "الأصول الصناعية", "الاستثمار"],
    image: "/images/opportunities/concrete-plant.jpg",
    youtubeUrl: "",
    overviewEN: "GCI is coordinating an opportunity involving a concrete batching plant asset in the UAE, targeting investors, operators, or construction companies looking to acquire or operate industrial construction infrastructure. The UAE's sustained construction activity — driven by major development programs, expo legacies, and Vision 2031 infrastructure targets — continues to generate strong demand for concrete production assets strategically positioned within the market.",
    overviewZH: "GCI 正在协调阿联酋一项涉及混凝土搅拌站资产的机会，面向希望收购或运营工业建筑基础设施的投资者、运营商或建筑公司。阿联酋在重大开发计划、世博遗产及2031愿景基础设施目标的推动下，持续旺盛的建筑活动为战略性布局市场的混凝土生产资产创造了强劲需求。",
    overviewAR: "تنسق GCI فرصة تتعلق بأصل محطة خلط الخرسانة في الإمارات، تستهدف المستثمرين أو المشغلين أو شركات البناء الراغبين في الاستحواذ على بنية تحتية صناعية للبناء أو تشغيلها.",
    currentFocusEN: [
      "Coordinating introductions for qualified investors and operators",
      "Supporting technical and operational assessment facilitation",
      "Matching construction companies with asset acquisition opportunities",
      "Providing market context and commercial framework overview"
    ],
    currentFocusZH: [
      "为合格投资者和运营商协调引荐",
      "支持技术和运营评估的协调工作",
      "将建筑公司与资产收购机会进行匹配",
      "提供市场背景和商业框架概述"
    ],
    currentFocusAR: [
      "تنسيق التعريفات للمستثمرين والمشغلين المؤهلين",
      "دعم تسهيل التقييم الفني والتشغيلي",
      "مطابقة شركات البناء مع فرص الاستحواذ على الأصول",
      "تقديم السياق السوقي ونظرة عامة على الإطار التجاري"
    ],
    potentialOpportunitiesEN: [
      "Acquisition of existing concrete batching plant asset",
      "Operational partnership or management agreement",
      "Supply agreements with major construction projects",
      "Industrial asset investment in UAE construction sector"
    ],
    potentialOpportunitiesZH: [
      "收购现有混凝土搅拌站资产",
      "运营合作或管理协议",
      "与重大建筑项目的供应协议",
      "阿联酋建筑行业工业资产投资"
    ],
    potentialOpportunitiesAR: [
      "الاستحواذ على أصل محطة خلط الخرسانة الحالية",
      "شراكة تشغيلية أو اتفاقية إدارة",
      "اتفاقيات التوريد مع مشاريع البناء الكبرى",
      "استثمار الأصول الصناعية في قطاع البناء الإماراتي"
    ],
    whoShouldContactEN: [
      "Construction companies and contractors in UAE",
      "Industrial asset investors and private equity",
      "Concrete and building materials operators",
      "Companies planning UAE construction sector entry"
    ],
    whoShouldContactZH: [
      "阿联酋建筑公司和承包商",
      "工业资产投资者和私募股权",
      "混凝土和建筑材料运营商",
      "计划进入阿联酋建筑行业的企业"
    ],
    whoShouldContactAR: [
      "شركات البناء والمقاولون في الإمارات",
      "مستثمرو الأصول الصناعية والأسهم الخاصة",
      "مشغلو الخرسانة ومواد البناء",
      "الشركات التي تخطط لدخول قطاع البناء في الإمارات"
    ]
  }
];
