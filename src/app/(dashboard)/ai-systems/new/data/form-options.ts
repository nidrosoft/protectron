import type { SelectItemType } from "@/components/base/select/select";

// Form state type
export interface FormData {
  // Step 1
  name: string;
  description: string;
  provider: string;
  modelName: string;
  deploymentStatus: string;
  // Step 2
  useCase: string;
  makesDecisions: boolean;
  decisionType: string;
  impactLevel: string;
  // Step 3
  dataTypes: string[];
  dataSubjects: string[];
  // Step 4
  servesEU: boolean;
  processesInEU: boolean;
  establishedInEU: boolean;
}

// Provider options
export const providers: SelectItemType[] = [
  { id: "openai", label: "OpenAI" },
  { id: "anthropic", label: "Anthropic" },
  { id: "google", label: "Google" },
  { id: "microsoft", label: "Microsoft" },
  { id: "meta", label: "Meta" },
  { id: "custom", label: "Custom / In-house" },
  { id: "other", label: "Other" },
];

// Deployment status options
export const deploymentStatuses: SelectItemType[] = [
  { id: "development", label: "In Development" },
  { id: "testing", label: "Testing" },
  { id: "production", label: "Production" },
];

// Use case categories
export const useCaseCategories: SelectItemType[] = [
  { id: "customer-service", label: "Customer Service / Chatbots" },
  { id: "content-generation", label: "Content Generation" },
  { id: "data-analysis", label: "Data Analysis / BI" },
  { id: "hiring", label: "Hiring / Recruitment ⚠️" },
  { id: "healthcare", label: "Healthcare / Medical ⚠️" },
  { id: "finance", label: "Finance / Credit ⚠️" },
  { id: "education", label: "Education / Training" },
  { id: "security", label: "Security / Fraud Detection" },
  { id: "marketing", label: "Marketing / Personalization" },
  { id: "legal", label: "Legal / Compliance" },
  { id: "other", label: "Other" },
];

// Decision automation options
export const decisionTypes: SelectItemType[] = [
  { id: "automated", label: "Fully Automated" },
  { id: "human-in-loop", label: "Human-in-the-Loop" },
  { id: "advisory", label: "Advisory Only (Human Decides)" },
];

// Impact levels
export const impactLevels: SelectItemType[] = [
  { id: "low", label: "Low - Minor convenience impact" },
  { id: "medium", label: "Medium - Affects access to services" },
  { id: "high", label: "High - Significant life impact ⚠️" },
];

// Data types
export const dataTypes = [
  { id: "pii", label: "Personal Identifiable Info (PII)", warning: false },
  { id: "biometric", label: "Biometric Data", warning: true },
  { id: "health", label: "Health Data", warning: true },
  { id: "financial", label: "Financial Data", warning: false },
  { id: "location", label: "Location Data", warning: false },
  { id: "public", label: "Public Data Only", warning: false },
  { id: "synthetic", label: "Synthetic / Anonymized Data", warning: false },
];

// Data subjects
export const dataSubjects = [
  { id: "employees", label: "Employees" },
  { id: "customers", label: "Customers" },
  { id: "eu-residents", label: "EU Residents", warning: true },
  { id: "general-public", label: "General Public" },
];

// Risk calculation function
export function calculateRiskLevel(data: FormData): {
  level: "prohibited" | "high" | "limited" | "minimal";
  reasons: string[];
  requirements: number;
} {
  const reasons: string[] = [];
  
  // Check for high-risk indicators
  const highRiskUseCases = ["hiring", "healthcare", "finance"];
  const highRiskDataTypes = ["biometric", "health"];
  
  const isHighRiskUseCase = highRiskUseCases.includes(data.useCase);
  const hasHighRiskData = data.dataTypes.some(dt => highRiskDataTypes.includes(dt));
  const hasHighImpact = data.impactLevel === "high";
  const isAutomated = data.decisionType === "automated";
  const affectsEU = data.servesEU || data.processesInEU || data.establishedInEU;
  const affectsEUResidents = data.dataSubjects.includes("eu-residents");
  
  if (isHighRiskUseCase) reasons.push(`High-risk use case: ${data.useCase}`);
  if (hasHighRiskData) reasons.push("Processes sensitive data types");
  if (hasHighImpact) reasons.push("High impact on individuals");
  if (isAutomated && data.makesDecisions) reasons.push("Automated decision-making");
  
  // Determine risk level
  if ((isHighRiskUseCase || hasHighRiskData) && affectsEU) {
    return { level: "high", reasons, requirements: 24 };
  }
  
  if (data.makesDecisions && affectsEU) {
    return { level: "limited", reasons: ["Makes decisions affecting people", "EU exposure"], requirements: 8 };
  }
  
  if (affectsEU || affectsEUResidents) {
    return { level: "limited", reasons: ["EU market exposure"], requirements: 8 };
  }
  
  return { level: "minimal", reasons: ["No high-risk indicators"], requirements: 2 };
}

// Initial form state
export const initialFormData: FormData = {
  name: "",
  description: "",
  provider: "",
  modelName: "",
  deploymentStatus: "",
  useCase: "",
  makesDecisions: false,
  decisionType: "",
  impactLevel: "",
  dataTypes: [],
  dataSubjects: [],
  servesEU: false,
  processesInEU: false,
  establishedInEU: false,
};
