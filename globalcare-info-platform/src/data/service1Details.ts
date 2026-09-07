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
    id: "company-setup-licensing",
    title: {
      EN: "Company Setup & Industry Licensing",
      ZH: "公司设立与行业许可"
    },
    description: {
      EN: "Helping companies choose the appropriate Free Zone or Mainland setup path based on their business activity, coordinating company registration, trade license, visa, PRO and office address arrangements, plus any industry authority approval, qualification registration or regulated activity clearance the business activity requires.",
      ZH: "协助企业根据业务类型选择 Free Zone 或 Mainland 设立路径，协调公司注册、经营范围、营业执照、签证、PRO、办公地址等基础落地事项，并按业务类型协调行业主管部门、资质登记及专项审批。"
    },
    support: {
      EN: [
        "Free Zone / Mainland setup coordination",
        "Trade License application coordination",
        "Registered address / Flexi Desk / office solution coordination",
        "Investor and employee visa & Establishment Card coordination",
        "PRO government affairs coordination",
        "Construction, logistics, F&B, e-commerce and other regulated activity licensing coordination",
        "Contractor, consultant and related qualification pathway coordination",
        "Renewal reminders and company document management"
      ],
      ZH: [
        "Free Zone / Mainland 设立路径协调",
        "Trade License 营业执照办理协调",
        "注册地址 / Flexi Desk / 办公室方案协调",
        "投资人及员工签证、Establishment Card 协调",
        "PRO 政府事务协调",
        "建筑、物流、食品、电商等受监管行业许可协调",
        "承包商、工程顾问及相关行业资质路径协调",
        "公司续期及文件管理提醒"
      ]
    }
  },
  {
    id: "product-access",
    title: {
      EN: "Product Market Access & Certification",
      ZH: "产品准入与认证"
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
    id: "compliance-tax",
    title: {
      EN: "Compliance & Tax",
      ZH: "合规与税务"
    },
    description: {
      EN: "Coordinating with UAE accounting, tax, audit and compliance service providers to support VAT, Corporate Tax, bookkeeping, audit, tax filing, e-invoicing readiness and ongoing regulatory compliance.",
      ZH: "协调阿联酋本地会计、税务、审计及合规服务商，为企业提供 VAT、企业税、记账、审计、税务申报、电子发票准备及持续合规支持。"
    },
    support: {
      EN: [
        "VAT registration and filing coordination",
        "Corporate Tax registration and filing coordination",
        "Monthly / quarterly bookkeeping coordination",
        "Annual audit service coordination",
        "Tax agent and compliance advisor coordination",
        "E-invoicing readiness support",
        "Tax reminders and compliance timeline follow-up"
      ],
      ZH: [
        "VAT 注册与申报协调",
        "Corporate Tax 企业税注册与申报协调",
        "月度 / 季度会计记账协调",
        "年度审计服务协调",
        "税务代理及合规顾问协调",
        "电子发票准备支持",
        "税务提醒及合规节点跟进"
      ]
    }
  },
  {
    id: "banking-execution",
    title: {
      EN: "Banking & Local Execution Support",
      ZH: "银行及本地执行支持"
    },
    description: {
      EN: "Supporting companies with bank account direction, KYC logic and bank appointment coordination, plus on-ground business visits to offices, warehouses, showrooms and service providers to support local execution. Account opening decisions are made independently by the bank based on compliance review.",
      ZH: "协助企业梳理银行开户方向、KYC 逻辑及银行预约协调，并安排办公室、仓库、展厅及服务商的实地走访以支持本地执行落地。银行开户结果由银行根据合规审查独立决定，GCI 不承诺开户结果。"
    },
    support: {
      EN: [
        "Bank selection direction and KYC logic review",
        "Business model and shareholder background coordination",
        "Bank appointment coordination and supplementary document follow-up",
        "Office, warehouse and showroom visit coordination",
        "Banking, tax, legal and industry service provider meetings",
        "Business itinerary planning, translation and escort coordination",
        "Ongoing account and compliance reminders"
      ],
      ZH: [
        "银行选择方向建议及 KYC 逻辑梳理",
        "业务模式及股东背景资料协调",
        "银行预约协调及补件沟通",
        "办公室、仓库、展厅走访协调",
        "银行、税务、法律及行业服务商会议协调",
        "商务行程规划、翻译及陪同协调",
        "后续账户及合规提醒"
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
