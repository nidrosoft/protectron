import { Danger, Warning2, InfoCircle, TickCircle } from "iconsax-react";

export interface AssessmentData {
  companyName: string;
  industry: string;
  companySize: string;
  country: string;
  hasEUCustomers: boolean;
  hasEUOperations: boolean;
  processesEUData: boolean;
  aiSystemTypes: string[];
  useCases: string[];
  dataTypes: string[];
  decisionImpact: string;
  automationLevel: string;
}

export interface RiskResult {
  level: "prohibited" | "high" | "limited" | "minimal";
  count: number;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof Danger;
}

export function calculateRiskResults(data: AssessmentData): {
  results: RiskResult[];
  complianceScore: number;
  hasEUExposure: boolean;
  totalSystems: number;
} {
  const results: RiskResult[] = [];
  let complianceScore = 100;
  
  const hasEUExposure = data.hasEUCustomers || data.hasEUOperations || data.processesEUData;
  
  // Check for prohibited practices
  const prohibitedCount = 0;
  if (prohibitedCount > 0) {
    results.push({
      level: "prohibited",
      count: prohibitedCount,
      label: "Prohibited",
      description: "Must stop immediately",
      color: "text-error-600",
      bgColor: "bg-error-50",
      borderColor: "border-error-200",
      icon: Danger,
    });
    complianceScore -= 30;
  }

  // Check for high-risk AI systems
  const highRiskUseCases = ["hiring", "healthcare", "finance", "legal", "education", "critical-infra", "biometric-id"];
  const highRiskCount = data.useCases.filter(uc => highRiskUseCases.includes(uc)).length;
  const hasHighRiskData = data.dataTypes.some(dt => ["biometric", "health", "financial", "criminal", "children"].includes(dt));
  const highRiskTotal = highRiskCount + (hasHighRiskData && (data.decisionImpact === "high" || data.decisionImpact === "critical") ? 1 : 0);
  
  if (highRiskTotal > 0) {
    results.push({
      level: "high",
      count: highRiskTotal,
      label: "High Risk",
      description: "Requires conformity assessment",
      color: "text-warning-600",
      bgColor: "bg-warning-50",
      borderColor: "border-warning-200",
      icon: Warning2,
    });
    complianceScore -= highRiskTotal * 8;
  }

  // Check for limited-risk AI systems
  const limitedRiskTypes = ["chatbot", "genai", "recommendation", "speech", "nlp"];
  const limitedRiskCount = data.aiSystemTypes.filter(t => limitedRiskTypes.includes(t)).length;
  
  if (limitedRiskCount > 0) {
    results.push({
      level: "limited",
      count: limitedRiskCount,
      label: "Limited Risk",
      description: "Transparency obligations",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: InfoCircle,
    });
    complianceScore -= limitedRiskCount * 3;
  }

  // Minimal risk systems
  const minimalRiskTypes = ["analytics", "automation", "fraud", "ml-model", "vision"];
  const minimalRiskCount = data.aiSystemTypes.filter(t => minimalRiskTypes.includes(t)).length + 
    data.useCases.filter(uc => ["internal", "research"].includes(uc)).length;
  
  if (minimalRiskCount > 0 || results.length === 0) {
    results.push({
      level: "minimal",
      count: Math.max(minimalRiskCount, 1),
      label: "Minimal Risk",
      description: "Voluntary best practices",
      color: "text-success-600",
      bgColor: "bg-success-50",
      borderColor: "border-success-200",
      icon: TickCircle,
    });
  }

  // Adjust score based on automation level
  if ((data.automationLevel === "fully-automated" || data.automationLevel === "automated-override") && highRiskTotal > 0) {
    complianceScore -= 10;
  } else if (data.automationLevel === "human-in-loop" || data.automationLevel === "advisory-only") {
    complianceScore += 5;
  }

  complianceScore = Math.max(0, Math.min(100, complianceScore));
  const totalSystems = data.aiSystemTypes.length + data.useCases.length;

  return { results, complianceScore, hasEUExposure, totalSystems };
}

export function getScoreColor(score: number) {
  if (score >= 70) return "text-success-500";
  if (score >= 40) return "text-warning-500";
  return "text-error-500";
}

export function getScoreLabel(score: number) {
  if (score >= 80) return { label: "Excellent", color: "text-success-600", bg: "bg-success-50" };
  if (score >= 60) return { label: "Good", color: "text-success-600", bg: "bg-success-50" };
  if (score >= 40) return { label: "Needs Work", color: "text-warning-600", bg: "bg-warning-50" };
  return { label: "Critical", color: "text-error-600", bg: "bg-error-50" };
}
