export type ActiveRegionType = "UAE" | "GCC" | "Africa" | "China";

export interface StatisticMetric {
  value: string;
  label: string;
  description: string;
  category: "execution" | "corridor" | "network";
}

export interface CaseStudy {
  id: string;
  region: ActiveRegionType;
  title: string;
  subtitle: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  duration: string;
  execOfficer: string;
}

export interface RegulatoryStep {
  title: string;
  authority: string;
  requirementDescription: string;
}

export interface MatchResource {
  partnerType: string;
  resourceDetails: string;
  gciMatchValue: string;
}

export interface TimelineMilestone {
  period: string;
  objective: string;
  gciOwnerRoll: string;
}

export interface AIAdvisoryReport {
  executiveSummary: string;
  regulatoryAccessSteps: RegulatoryStep[];
  matchResources: MatchResource[];
  implementationTimeline: TimelineMilestone[];
  gciExecutionAdvantage: string;
}

export interface GCIPartner {
  name: string;
  matchValue: string;
}

export interface GCIRoadmapPhase {
  phase: string;
  action: string;
  gciRole: string;
}

export interface GCILocalRequirement {
  requirement: string;
  gciCoordination: string;
}

export interface GCIMarketAccessReport {
  marketOpportunity: string;
  potentialPartners: GCIPartner[];
  distributionChannels: string[];
  executionRoadmap: GCIRoadmapPhase[];
  localRequirements: GCILocalRequirement[];
}

export type IndustrySector = "Advanced Manufacturing" | "Digital Health & Medical" | "Renewable Infrastructure" | "Logistics & Cross-Border Supply" | "Premium Retail & Logistics";

