import type { RadarRegion } from "./types";

export interface RadarSearchDefinition {
  region: RadarRegion;
  countries: string[];
  focus: string[];
  prioritySources: string[];
}

export const RADAR_SEARCHES: RadarSearchDefinition[] = [
  {
    region: "SPAIN",
    countries: ["Spain"],
    focus: [
      "Barcelona and Catalonia investment, procurement and industrial projects",
      "Madrid and Spain-wide automotive, EV, battery, logistics, ports, AI, manufacturing, construction and market entry",
      "Chinese companies investing in or entering Spain",
    ],
    prioritySources: [
      "accio.gencat.cat", "barcelona.cat", "investinspain.org", "icex.es", "contrataciondelestado.es",
      "portdebarcelona.cat", "adif.es", "aena.es",
    ],
  },
  {
    region: "GCC / MIDDLE EAST",
    countries: ["United Arab Emirates", "Saudi Arabia", "Qatar", "Oman", "Bahrain", "Kuwait"],
    focus: [
      "major projects, tenders, procurement, construction, infrastructure and industrial investment",
      "AI and enterprise digitalisation, logistics, ports, supply chains and China-GCC cooperation",
      "customs, tariffs and trade regulation with operational business impact",
      "Red Sea, Strait of Hormuz and GCC transport disruption with shipping, cost or project impact",
    ],
    prioritySources: [
      "wam.ae", "spa.gov.sa", "qna.org.qa", "omannews.gov.om", "bna.bh", "kuna.net.kw",
      "etimad.sa", "adportsgroup.com", "dpworld.com", "qatarenergy.qa",
    ],
  },
  {
    region: "AFRICA",
    countries: ["Morocco", "Egypt", "Kenya", "Tanzania", "Nigeria", "Ethiopia", "Ghana"],
    focus: [
      "infrastructure, energy, manufacturing, logistics, ports and industrial projects",
      "Chinese investment and China-Africa project milestones",
      "procurement, workforce, supply-chain and market-entry opportunities",
    ],
    prioritySources: [
      "afdb.org", "worldbank.org", "invest.gov.ma", "gafi.gov.eg", "kenyainvest.go.ke",
      "tic.go.tz", "nipc.gov.ng", "investethiopia.gov.et", "gipc.gov.gh",
    ],
  },
  {
    region: "CHINA OUTBOUND",
    countries: ["China", "Spain", "United Arab Emirates", "Saudi Arabia", "Qatar", "Oman", "Bahrain", "Kuwait", "Morocco", "Egypt", "Kenya", "Tanzania", "Nigeria", "Ethiopia", "Ghana"],
    focus: [
      "Chinese overseas factory, investment, joint venture, subsidiary or market entry",
      "distributor, local partner, supplier, procurement, EPC and logistics requirements",
      "overseas digitalisation and operations in Spain, GCC and Africa",
    ],
    prioritySources: [
      "mofcom.gov.cn", "ndrc.gov.cn", "ccpit.org", "sasac.gov.cn", "worldbank.org", "afdb.org",
    ],
  },
];

export const SOURCE_COUNT = new Set(RADAR_SEARCHES.flatMap((entry) => entry.prioritySources)).size;
