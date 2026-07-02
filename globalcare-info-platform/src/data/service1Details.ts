// Detail content for WhatWeDo card 1 ("Company Setup & Market Access Services").
// Only EN / ZH are populated — this card's expanded detail view is not localized to AR yet.

export interface Service1DetailItem {
  id: string;
  title: { EN: string; ZH: string };
  description: { EN: string; ZH: string };
  support: { EN: string[]; ZH: string[] };
}

export const service1Details: Service1DetailItem[] = [
  {
    id: "company-setup",
    title: {
      EN: "One-stop Company Setup",
      ZH: "一站式公司设立"
    },
    description: {
      EN: "Helping companies choose the appropriate Free Zone or Mainland setup path based on their business activity, and coordinating company registration, trade license, visa, PRO and office address arrangements.",
      ZH: "协助企业根据业务类型选择 Free Zone 或 Mainland 设立路径，并协调公司注册、经营范围、营业执照、签证、PRO、办公地址等基础落地事项。"
    },
    support: {
      EN: [
        "Free Zone / Mainland setup coordination",
        "Company name and business activity confirmation",
        "Trade License application coordination",
        "Registered address / Flexi Desk / office solution coordination",
        "Establishment Card coordination",
        "Investor and employee visa coordination",
        "Emirates ID / Medical Test process coordination",
        "PRO government affairs coordination",
        "Renewal reminders and company document management"
      ],
      ZH: [
        "Free Zone / Mainland 设立路径协调",
        "公司名称及经营范围确认",
        "Trade License 营业执照办理协调",
        "注册地址 / Flexi Desk / 办公室方案协调",
        "Establishment Card 协调",
        "投资人及员工签证协调",
        "Emirates ID / Medical Test 流程协调",
        "PRO 政府事务协调",
        "公司续期及文件管理提醒"
      ]
    }
  },
  {
    id: "business-visit",
    title: {
      EN: "Business Visit Arrangement",
      ZH: "商务考察安排"
    },
    description: {
      EN: "Arranging Free Zone, office, warehouse, showroom, market, banking, tax, legal and industry service provider visits based on the client's landing objectives.",
      ZH: "根据企业落地目标，安排自贸区、办公室、仓库、展厅、市场、银行、税务、法律及行业服务商的走访与会议，帮助企业在正式落地前了解真实环境与执行路径。"
    },
    support: {
      EN: [
        "Free Zone / Mainland setup visit coordination",
        "Office, warehouse and showroom visits",
        "Banking, tax, accounting and legal service provider meetings",
        "Market, business district and wholesale market visits",
        "Certification, access and compliance service provider meetings",
        "Business itinerary planning, translation and escort coordination",
        "Meeting notes and follow-up suggestions",
        "Past business visit and activity materials may be shared during follow-up discussions when appropriate"
      ],
      ZH: [
        "自贸区 / Mainland 设立路径考察",
        "办公室、仓库、展厅资源走访",
        "银行、税务、会计、法律服务商会议协调",
        "市场、商圈、批发市场及行业资源走访",
        "认证、准入、合规服务商对接",
        "商务行程规划、翻译及陪同协调",
        "会议纪要及后续跟进建议",
        "过往商务考察及活动资料，可在后续沟通中根据情况展示"
      ]
    }
  },
  {
    id: "product-access",
    title: {
      EN: "Product Access & Certification Support",
      ZH: "产品准入与认证支持"
    },
    description: {
      EN: "Coordinating with certification bodies, registration service providers and compliance advisors based on the product category to support certification, registration, labeling, testing and import compliance requirements.",
      ZH: "根据产品类别，协调相关认证机构、注册服务商及合规顾问，协助客户梳理进入阿联酋及区域市场所涉及的认证、备案、标签、检测及进口合规要求。"
    },
    support: {
      EN: [
        "Halal certification coordination",
        "Product registration and filing coordination",
        "Food, beverage, cosmetics and personal care product access support",
        "ECAS / RoHS coordination for electrical and electronic products",
        "TDRA pathway coordination for wireless, Bluetooth and communication products",
        "Label, packaging and instruction document compliance coordination",
        "Test report, specification sheet and certification file coordination",
        "Importer, distributor and product clearance document coordination"
      ],
      ZH: [
        "清真认证协调",
        "产品注册与备案协调",
        "食品、饮料、化妆品、日化产品准入支持",
        "电子电器产品 ECAS / RoHS 等合规协调",
        "无线、蓝牙、通信类产品 TDRA 路径协调",
        "标签、包装及说明文件合规协调",
        "检测报告、规格书及认证文件整理协调",
        "进口商、经销商及产品放行相关文件协调"
      ]
    }
  },
  {
    id: "licensing",
    title: {
      EN: "Industry Licensing & Approval Coordination",
      ZH: "行业许可与审批协调"
    },
    description: {
      EN: "Certain business activities in the UAE may require industry authority approval, qualification registration, professional licensing or regulated activity clearance. GCI coordinates with Free Zones, authorities and licensed service providers based on the client's business activity.",
      ZH: "不同行业在阿联酋开展业务，可能涉及行业主管部门、资质登记、人员资质、活动许可或专项审批。GCI 可根据企业业务类型，协调自由区、政府部门及持牌服务商，协助客户梳理路径并推进对接。"
    },
    support: {
      EN: [
        "Construction, engineering and fit-out activity licensing coordination",
        "Contractor, consultant and related qualification pathway coordination",
        "Logistics, warehousing, import/export and re-export activity licensing coordination",
        "Food, restaurant and food trading activity coordination",
        "E-commerce, platform and delivery business activity pathway coordination",
        "Education, training, medical and health-related approval pathway coordination",
        "Boundary review coordination for regulated activities such as finance, investment and consulting"
      ],
      ZH: [
        "建筑、工程、装修类活动许可协调",
        "承包商、工程顾问及相关行业资质路径协调",
        "物流、仓储、进出口、转口贸易相关许可协调",
        "食品、餐饮、食品贸易相关许可协调",
        "电商、平台、配送业务活动路径协调",
        "教育、培训、医疗、健康相关审批路径协调",
        "金融、投资、咨询等受监管活动边界判断协调"
      ]
    }
  },
  {
    id: "tax-accounting",
    title: {
      EN: "Tax & Accounting Compliance",
      ZH: "财税与会计合规"
    },
    description: {
      EN: "Coordinating with UAE accounting, tax, audit and compliance service providers to support VAT, Corporate Tax, bookkeeping, audit, tax filing and e-invoicing readiness.",
      ZH: "协调阿联酋本地会计、税务、审计及合规服务商，为企业提供 VAT、企业税、记账、审计、税务申报及电子发票准备等持续合规支持。"
    },
    support: {
      EN: [
        "VAT registration and filing coordination",
        "Corporate Tax registration and filing coordination",
        "Monthly / quarterly bookkeeping coordination",
        "Annual audit service coordination",
        "Invoice, contract and expense document process guidance",
        "Tax agent and compliance advisor coordination",
        "E-invoicing readiness support",
        "Tax reminders and compliance timeline follow-up"
      ],
      ZH: [
        "VAT 注册与申报协调",
        "Corporate Tax 企业税注册与申报协调",
        "月度 / 季度会计记账协调",
        "年度审计服务协调",
        "发票、合同、成本单据整理流程建议",
        "税务代理及合规顾问协调",
        "电子发票准备支持",
        "税务提醒及合规节点跟进"
      ]
    }
  },
  {
    id: "bank-account",
    title: {
      EN: "Bank Account Coordination",
      ZH: "银行开户协调"
    },
    description: {
      EN: "Supporting companies with bank account direction, KYC logic, business model explanation, bank appointment coordination and follow-up communication. Account opening decisions are made independently by the bank based on compliance review.",
      ZH: "协助企业梳理银行开户方向、KYC 逻辑、业务模式说明、开户资料准备、银行预约及补件沟通。银行开户结果由银行根据合规审查独立决定，GCI 不承诺开户结果。"
    },
    support: {
      EN: [
        "Bank selection direction",
        "KYC logic review",
        "Business model explanation",
        "Shareholder and company background coordination",
        "Expected transaction countries, customer and supplier explanation coordination",
        "Bank appointment coordination",
        "Supplementary document follow-up",
        "Ongoing account compliance reminders"
      ],
      ZH: [
        "银行选择方向建议",
        "KYC 逻辑梳理",
        "业务模式说明整理",
        "股东及公司背景资料协调",
        "预计交易国家、客户、供应商说明协调",
        "银行预约协调",
        "补件沟通与进度跟进",
        "后续账户合规提醒"
      ]
    }
  }
];

export const service1DetailDisclaimer = {
  EN: "Specific requirements, documents, timelines and feasibility will be confirmed based on the client's business activity, industry, product category, target market and the requirements of relevant authorities or service providers.",
  ZH: "具体办理要求、所需资料、周期及可行性，将根据客户业务类型、所属行业、产品类别、目标市场及相关主管部门或服务机构要求进一步确认。"
};

export const service1DetailLabels = {
  serviceDesc: { EN: "Service Overview", ZH: "服务说明" },
  supportContent: { EN: "What's Included", ZH: "具体支持内容" },
  notes: { EN: "Notes", ZH: "注意事项" },
  cta: { EN: "Submit Requirement", ZH: "提交需求" },
  close: { EN: "Close", ZH: "关闭" }
};
