import imgRoboticsDubai from "../assets/images/case_robotics_dubai_1780768291268.png";
import imgGlobalHub from "../assets/images/gci_global_hub_connection_1780768265492.png";

export interface Opportunity {
  id: string;
  slug: string;
  titleEN: string;
  titleZH: string;
  titleAR: string;
  country: string;
  countryZH: string;
  countryAR: string;
  status: string;
  statusZH: string;
  statusAR: string;
  opportunityType: "Market Opportunity" | "Active GCI Opportunity";
  opportunityTypeZH: string;
  opportunityTypeAR: string;
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
    slug: "al-maktoum-airport-expansion",
    titleEN: "Al Maktoum International Airport Expansion",
    titleZH: "阿勒马克图姆国际机场扩建",
    titleAR: "توسعة مطار آل مكتوم الدولي",
    country: "UAE / Dubai",
    countryZH: "阿联酋·迪拜",
    countryAR: "الإمارات / دبي",
    status: "Under Development",
    statusZH: "开发中",
    statusAR: "قيد التطوير",
    opportunityType: "Market Opportunity",
    opportunityTypeZH: "市场机会",
    opportunityTypeAR: "فرصة سوقية",
    tags: ["Aviation", "Infrastructure", "Construction"],
    tagsZH: ["航空", "基础设施", "建筑"],
    tagsAR: ["الطيران", "البنية التحتية", "البناء"],
    image: "/images/countries/country-uae.jpg",
    youtubeUrl: "",
    overviewEN: "The expansion of Al Maktoum International Airport is creating long-term opportunities across aviation infrastructure, construction, project supply, equipment, logistics and workforce support. GCI is tracking the project as a major UAE market opportunity.",
    overviewZH: "迪拜阿勒马克图姆国际机场扩建正在持续推进，未来将形成大量航空基础设施、建筑施工、项目供应、设备、物流及劳动力配套需求。GCI 将其作为重点市场机会持续关注。",
    overviewAR: "تخلق توسعة مطار آل مكتوم الدولي فرصاً طويلة الأمد في البنية التحتية للطيران والبناء وتوريد المشاريع والمعدات واللوجستيات ودعم القوى العاملة. تتابع GCI هذا المشروع باعتباره فرصة سوقية رئيسية في الإمارات.",
    currentFocusEN: [
      "Monitoring project phasing and public tender announcements",
      "Mapping construction and materials supply requirements",
      "Identifying equipment and logistics partners active in the project",
      "Assessing workforce and project-support demand as the expansion progresses",
    ],
    currentFocusZH: [
      "跟踪项目分期进展及公开招标信息",
      "梳理建筑与材料供应需求",
      "识别参与该项目的设备与物流合作方",
      "评估随扩建推进而产生的劳动力及项目支持需求",
    ],
    currentFocusAR: [
      "متابعة مراحل المشروع وإعلانات المناقصات العامة",
      "رصد متطلبات توريد مواد ومعدات البناء",
      "تحديد شركاء المعدات واللوجستيات الفاعلين في المشروع",
      "تقييم الطلب على القوى العاملة والدعم المشروعي مع تقدم التوسعة",
    ],
    potentialOpportunitiesEN: [
      "Construction & Infrastructure",
      "Building Materials & Project Supply",
      "Equipment & Logistics",
      "Workforce & Project Support",
    ],
    potentialOpportunitiesZH: [
      "建筑与基础设施",
      "建筑材料与项目供应",
      "设备与物流",
      "劳动力与项目支持",
    ],
    potentialOpportunitiesAR: [
      "البناء والبنية التحتية",
      "مواد البناء وتوريد المشاريع",
      "المعدات واللوجستيات",
      "القوى العاملة والدعم المشروعي",
    ],
    whoShouldContactEN: [
      "Construction and infrastructure contractors with aviation-sector experience",
      "Building materials and equipment suppliers",
      "Logistics and freight companies serving major UAE projects",
      "Workforce and project-support service providers",
    ],
    whoShouldContactZH: [
      "具备航空领域经验的建筑与基础设施承包商",
      "建筑材料与设备供应商",
      "服务阿联酋重大项目的物流货运公司",
      "劳动力与项目支持服务提供商",
    ],
    whoShouldContactAR: [
      "مقاولو البناء والبنية التحتية ذوو الخبرة في قطاع الطيران",
      "موردو مواد البناء والمعدات",
      "شركات اللوجستيات والشحن العاملة في المشاريع الكبرى بالإمارات",
      "مزودو خدمات القوى العاملة والدعم المشروعي",
    ],
  },
  {
    id: "opp-2",
    slug: "dubai-walk-master-plan",
    titleEN: "Dubai Walk Master Plan",
    titleZH: "迪拜步行系统总体规划",
    titleAR: "المخطط الرئيسي لمشروع Dubai Walk",
    country: "UAE / Dubai",
    countryZH: "阿联酋·迪拜",
    countryAR: "الإمارات / دبي",
    status: "Programme Development / Implementation",
    statusZH: "计划推进与实施中",
    statusAR: "قيد التطوير والتنفيذ",
    opportunityType: "Market Opportunity",
    opportunityTypeZH: "市场机会",
    opportunityTypeAR: "فرصة سوقية",
    tags: ["Urban Infrastructure", "Public Realm"],
    tagsZH: ["城市基础设施", "公共空间"],
    tagsAR: ["البنية التحتية الحضرية", "الفضاء العام"],
    image: imgRoboticsDubai,
    youtubeUrl: "",
    overviewEN: "Dubai Walk is expanding Dubai's pedestrian and public-realm infrastructure, creating opportunities across urban works, landscaping, lighting, street furniture, construction materials and supporting supply.",
    overviewZH: "Dubai Walk 旨在持续扩展迪拜步行网络和公共空间体系，将带来城市基础设施、景观、照明、城市家具、建材及施工配套等长期市场机会。",
    overviewAR: "يهدف مشروع Dubai Walk إلى توسيع شبكة المشي والفضاء العام في دبي، مما يخلق فرصاً في الأعمال الحضرية والمناظر الطبيعية والإضاءة وأثاث الشوارع ومواد البناء والتوريد الداعم.",
    currentFocusEN: [
      "Tracking programme rollout phases across Dubai's pedestrian network",
      "Mapping landscaping, lighting and street-furniture requirements",
      "Identifying suppliers for public-realm construction materials",
      "Assessing partnership potential with programme delivery contractors",
    ],
    currentFocusZH: [
      "跟踪迪拜步行网络各阶段推进情况",
      "梳理景观、照明及城市家具相关需求",
      "识别公共空间建筑材料供应商",
      "评估与项目实施承包商的合作潜力",
    ],
    currentFocusAR: [
      "متابعة مراحل تنفيذ البرنامج عبر شبكة المشي في دبي",
      "رصد متطلبات المناظر الطبيعية والإضاءة وأثاث الشوارع",
      "تحديد موردي مواد البناء للفضاء العام",
      "تقييم إمكانية الشراكة مع مقاولي تنفيذ البرنامج",
    ],
    potentialOpportunitiesEN: [
      "Urban Infrastructure",
      "Landscaping & Public Realm",
      "Lighting & Urban Furniture",
      "Construction Materials & Supporting Supply",
    ],
    potentialOpportunitiesZH: [
      "城市基础设施",
      "景观与公共空间",
      "照明与城市家具",
      "建筑材料与配套供应",
    ],
    potentialOpportunitiesAR: [
      "البنية التحتية الحضرية",
      "المناظر الطبيعية والفضاء العام",
      "الإضاءة وأثاث المدينة",
      "مواد البناء والتوريد الداعم",
    ],
    whoShouldContactEN: [
      "Landscaping and public-realm contractors",
      "Lighting and urban furniture suppliers",
      "Construction materials suppliers for civic infrastructure",
      "Companies with Dubai municipal or programme delivery experience",
    ],
    whoShouldContactZH: [
      "景观与公共空间承包商",
      "照明与城市家具供应商",
      "市政基础设施建筑材料供应商",
      "具备迪拜市政或项目实施经验的企业",
    ],
    whoShouldContactAR: [
      "مقاولو المناظر الطبيعية والفضاء العام",
      "موردو الإضاءة وأثاث المدينة",
      "موردو مواد البناء للبنية التحتية المدنية",
      "الشركات ذات الخبرة في بلدية دبي أو تنفيذ البرامج",
    ],
  },
  {
    id: "opp-3",
    slug: "dubai-blue-green-spaces-programme",
    titleEN: "Dubai Blue & Green Spaces Programme",
    titleZH: "迪拜蓝绿空间计划",
    titleAR: "برنامج المساحات الزرقاء والخضراء في دبي",
    country: "UAE / Dubai",
    countryZH: "阿联酋·迪拜",
    countryAR: "الإمارات / دبي",
    status: "Programme Development",
    statusZH: "计划推进中",
    statusAR: "قيد التطوير",
    opportunityType: "Market Opportunity",
    opportunityTypeZH: "市场机会",
    opportunityTypeAR: "فرصة سوقية",
    tags: ["Urban Development", "Landscaping", "Infrastructure"],
    tagsZH: ["城市发展", "景观", "基础设施"],
    tagsAR: ["التطوير الحضري", "تنسيق المناظر الطبيعية", "البنية التحتية"],
    image: imgGlobalHub,
    youtubeUrl: "",
    overviewEN: "Dubai's continued investment in blue and green spaces, public environments and urban infrastructure is opening opportunities for landscaping, outdoor solutions, lighting, materials and project supply.",
    overviewZH: "迪拜持续推进蓝绿空间、公共环境与城市基础设施建设，为景观、公共空间、户外设施、照明、建材及项目供应带来新的市场机会。",
    overviewAR: "يفتح استثمار دبي المستمر في المساحات الزرقاء والخضراء والبيئات العامة والبنية التحتية الحضرية فرصاً في تنسيق المناظر الطبيعية والحلول الخارجية والإضاءة والمواد وتوريد المشاريع.",
    currentFocusEN: [
      "Monitoring blue-green infrastructure programme announcements",
      "Mapping landscaping and outdoor-solutions requirements",
      "Identifying materials and project supply needs for public spaces",
      "Assessing lighting and irrigation infrastructure opportunities",
    ],
    currentFocusZH: [
      "跟踪蓝绿基础设施计划相关公告",
      "梳理景观与户外设施相关需求",
      "识别公共空间材料与项目供应需求",
      "评估照明与灌溉基础设施相关机会",
    ],
    currentFocusAR: [
      "متابعة إعلانات برنامج البنية التحتية الزرقاء والخضراء",
      "رصد متطلبات المناظر الطبيعية والحلول الخارجية",
      "تحديد احتياجات المواد وتوريد المشاريع للفضاءات العامة",
      "تقييم فرص البنية التحتية للإضاءة والري",
    ],
    potentialOpportunitiesEN: [
      "Landscape & Public Space",
      "Urban Infrastructure",
      "Lighting & Outdoor Solutions",
      "Materials & Project Supply",
    ],
    potentialOpportunitiesZH: [
      "景观与公共空间",
      "城市基础设施",
      "照明与户外设施",
      "材料与项目供应",
    ],
    potentialOpportunitiesAR: [
      "المناظر الطبيعية والفضاء العام",
      "البنية التحتية الحضرية",
      "الإضاءة والحلول الخارجية",
      "المواد وتوريد المشاريع",
    ],
    whoShouldContactEN: [
      "Landscape design and construction companies",
      "Outdoor lighting and irrigation solution providers",
      "Materials suppliers for public and green-space infrastructure",
      "Contractors with Dubai urban development experience",
    ],
    whoShouldContactZH: [
      "景观设计与施工公司",
      "户外照明与灌溉解决方案供应商",
      "公共及绿地基础设施材料供应商",
      "具备迪拜城市开发经验的承包商",
    ],
    whoShouldContactAR: [
      "شركات تصميم وتنفيذ المناظر الطبيعية",
      "مزودو حلول الإضاءة والري الخارجية",
      "موردو المواد للبنية التحتية العامة والخضراء",
      "المقاولون ذوو الخبرة في التطوير الحضري بدبي",
    ],
  },
  {
    id: "opp-4",
    slug: "uae-labour-camp-workforce-accommodation",
    titleEN: "UAE Labour Camp & Workforce Accommodation Opportunity",
    titleZH: "阿联酋劳工营与人员住宿机会",
    titleAR: "فرصة مخيمات العمال وإسكان القوى العاملة في الإمارات",
    country: "UAE",
    countryZH: "阿联酋",
    countryAR: "الإمارات",
    status: "Active",
    statusZH: "进行中",
    statusAR: "نشط",
    opportunityType: "Active GCI Opportunity",
    opportunityTypeZH: "GCI 活跃机会",
    opportunityTypeAR: "فرصة نشطة لدى GCI",
    tags: ["Workforce", "Accommodation", "Project Support"],
    tagsZH: ["劳动力", "住宿", "项目支持"],
    tagsAR: ["القوى العاملة", "الإسكان", "الدعم المشروعي"],
    image: "/images/countries/country-uae.jpg",
    youtubeUrl: "",
    overviewEN: "GCI is actively exploring workforce accommodation opportunities in the UAE, including labour camp development, leasing, workforce housing solutions, operations and supporting services for large-scale projects.",
    overviewZH: "围绕阿联酋大型建筑、工业及项目用工需求，GCI 正在关注并推进劳工营、员工住宿、租赁、运营及配套服务相关合作机会。",
    overviewAR: "تعمل GCI بنشاط على استكشاف فرص إسكان القوى العاملة في الإمارات، بما في ذلك تطوير مخيمات العمال، والتأجير، وحلول إسكان القوى العاملة، والتشغيل والخدمات الداعمة للمشاريع الكبرى.",
    currentFocusEN: [
      "Evaluating labour camp sites and accommodation capacity across the UAE",
      "Coordinating with operators on leasing and workforce housing models",
      "Assessing operational and supporting-service requirements",
      "Engaging with project owners on workforce accommodation needs",
    ],
    currentFocusZH: [
      "评估阿联酋各地劳工营选址及住宿容量",
      "与运营方协调租赁及员工住宿方案",
      "评估运营及配套服务需求",
      "与项目业主对接员工住宿相关需求",
    ],
    currentFocusAR: [
      "تقييم مواقع مخيمات العمال والقدرة الاستيعابية للإسكان في الإمارات",
      "التنسيق مع المشغلين حول نماذج التأجير وإسكان القوى العاملة",
      "تقييم متطلبات التشغيل والخدمات الداعمة",
      "التواصل مع أصحاب المشاريع حول احتياجات إسكان القوى العاملة",
    ],
    potentialOpportunitiesEN: [
      "Labour Camp Development",
      "Accommodation Leasing",
      "Workforce Housing Solutions",
      "Operation & Supporting Services",
    ],
    potentialOpportunitiesZH: [
      "劳工营开发",
      "住宿租赁",
      "员工住宿解决方案",
      "运营与配套服务",
    ],
    potentialOpportunitiesAR: [
      "تطوير مخيمات العمال",
      "تأجير الإسكان",
      "حلول إسكان القوى العاملة",
      "التشغيل والخدمات الداعمة",
    ],
    whoShouldContactEN: [
      "Labour camp developers and operators",
      "Accommodation leasing and property management companies",
      "Large-scale project owners with workforce housing needs",
      "Facilities management and support-services providers",
    ],
    whoShouldContactZH: [
      "劳工营开发商及运营商",
      "住宿租赁及物业管理公司",
      "有员工住宿需求的大型项目业主",
      "设施管理及配套服务提供商",
    ],
    whoShouldContactAR: [
      "مطورو ومشغلو مخيمات العمال",
      "شركات تأجير الإسكان وإدارة الممتلكات",
      "أصحاب المشاريع الكبرى ذوو احتياجات إسكان القوى العاملة",
      "مزودو خدمات إدارة المرافق والدعم",
    ],
  },
];
