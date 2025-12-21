import type { SelectItemType } from "@/components/base/select/select";

// System type options
export type SystemType = "ai_agent" | "llm_application" | "ml_model" | "automated_decision" | "other";

// Agent framework options
export type AgentFramework = "langchain" | "crewai" | "autogen" | "openai_assistants" | "aws_bedrock" | "google_adk" | "custom";

// Agent capabilities
export type AgentCapability = 
  | "autonomous_decisions" 
  | "external_access" 
  | "sends_communications" 
  | "processes_personal_data" 
  | "financial_actions" 
  | "physical_control" 
  | "hitl_configured";

// Form state type
export interface FormData {
  // Step 1: System Type
  systemType: SystemType | "";
  // Step 2: Basic Info (varies by type)
  name: string;
  description: string;
  provider: string;
  modelName: string;
  deploymentStatus: string;
  // Agent-specific fields
  agentFramework: AgentFramework | "";
  agentCapabilities: AgentCapability[];
  isMultiAgent: boolean;
  // Step 3: Use Case
  useCase: string;
  makesDecisions: boolean;
  decisionType: string;
  impactLevel: string;
  // Step 4: Data & Privacy
  dataTypes: string[];
  dataSubjects: string[];
  // Step 5: EU Exposure
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

// Risk trigger interface for detailed explanations
export interface RiskTrigger {
  criterion: string;
  article: string;
  description: string;
}

// Risk calculation result interface
export interface RiskAssessmentResult {
  level: "prohibited" | "high" | "limited" | "minimal";
  triggers: RiskTrigger[];
  requirements: number;
  articles: { article: string; title: string; items: number }[];
  deadline: string;
  daysRemaining: number;
}

// Risk calculation function - Updated for AI Agents per EU AI Act
export function calculateRiskLevel(data: FormData): RiskAssessmentResult {
  const triggers: RiskTrigger[] = [];
  const isAgent = data.systemType === "ai_agent";
  const isAutomatedDecision = data.systemType === "automated_decision";
  const affectsEU = data.servesEU || data.processesInEU || data.establishedInEU;
  const affectsEUResidents = data.dataSubjects.includes("eu-residents");
  
  // High-risk use cases per Annex III
  const highRiskUseCases = ["hiring", "healthcare", "finance", "education", "legal"];
  const highRiskDataTypes = ["biometric", "health"];
  
  const isHighRiskUseCase = highRiskUseCases.includes(data.useCase);
  const hasHighRiskData = data.dataTypes.some(dt => highRiskDataTypes.includes(dt));
  const hasHighImpact = data.impactLevel === "high";
  const isFullyAutomated = data.decisionType === "automated";

  // ========================================
  // AI AGENT-SPECIFIC RISK TRIGGERS
  // ========================================
  if (isAgent) {
    // Autonomous decision-making capability
    if (data.agentCapabilities.includes("autonomous_decisions")) {
      triggers.push({
        criterion: "Autonomous decision-making capability",
        article: "Article 6(2)",
        description: "Systems making decisions affecting individuals without human approval"
      });
    }
    
    // Processes personal data
    if (data.agentCapabilities.includes("processes_personal_data")) {
      triggers.push({
        criterion: "Processes personal data",
        article: "Annex III (4)",
        description: "AI affecting access to services or processing sensitive data"
      });
    }
    
    // Accesses external systems
    if (data.agentCapabilities.includes("external_access")) {
      triggers.push({
        criterion: "Accesses external systems",
        article: "Article 14",
        description: "Requires enhanced human oversight for external interactions"
      });
    }
    
    // Sends communications on behalf of users
    if (data.agentCapabilities.includes("sends_communications")) {
      triggers.push({
        criterion: "Sends communications autonomously",
        article: "Article 14(4)",
        description: "Agent can send emails, messages, or notifications without approval"
      });
    }
    
    // Makes financial transactions
    if (data.agentCapabilities.includes("financial_actions")) {
      triggers.push({
        criterion: "Makes financial transactions",
        article: "Annex III (5)(b)",
        description: "AI systems used for creditworthiness or financial decisions"
      });
    }
    
    // Controls physical systems
    if (data.agentCapabilities.includes("physical_control")) {
      triggers.push({
        criterion: "Controls physical systems",
        article: "Annex III (2)",
        description: "AI as safety component in machinery or critical infrastructure"
      });
    }
  }

  // ========================================
  // GENERAL RISK TRIGGERS (All System Types)
  // ========================================
  if (isHighRiskUseCase) {
    triggers.push({
      criterion: `High-risk use case: ${data.useCase}`,
      article: "Annex III",
      description: "Use case falls under high-risk categories defined in Annex III"
    });
  }
  
  if (hasHighRiskData) {
    triggers.push({
      criterion: "Processes biometric or health data",
      article: "Annex III (1)",
      description: "Biometric identification or categorization of natural persons"
    });
  }
  
  if (hasHighImpact) {
    triggers.push({
      criterion: "High impact on individuals",
      article: "Article 6(2)",
      description: "Significant effects on health, safety, or fundamental rights"
    });
  }
  
  if (isFullyAutomated && data.makesDecisions) {
    triggers.push({
      criterion: "Fully automated decision-making",
      article: "Article 22 GDPR / Article 14",
      description: "Automated decisions without meaningful human intervention"
    });
  }
  
  if (isAutomatedDecision) {
    triggers.push({
      criterion: "Automated Decision System",
      article: "Article 6(2)",
      description: "Systems that make or support decisions affecting individuals"
    });
  }

  // ========================================
  // DETERMINE RISK LEVEL
  // ========================================
  const deadline = "August 2, 2026";
  const daysRemaining = Math.ceil((new Date("2026-08-02").getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  // AI Agents are typically HIGH RISK if they have autonomous capabilities
  if (isAgent && triggers.length >= 2 && affectsEU) {
    return {
      level: "high",
      triggers,
      requirements: 91,
      articles: [
        { article: "Article 9", title: "Risk Management System", items: 12 },
        { article: "Article 10", title: "Data Governance", items: 14 },
        { article: "Article 11", title: "Technical Documentation", items: 18 },
        { article: "Article 12", title: "Record-Keeping & Logging", items: 15 },
        { article: "Article 13", title: "Transparency", items: 11 },
        { article: "Article 14", title: "Human Oversight", items: 14 },
        { article: "Article 26", title: "Deployer Obligations", items: 7 },
      ],
      deadline,
      daysRemaining
    };
  }
  
  // High-risk for non-agents with high-risk indicators
  if ((isHighRiskUseCase || hasHighRiskData || isAutomatedDecision) && affectsEU) {
    return {
      level: "high",
      triggers,
      requirements: 24,
      articles: [
        { article: "Article 9", title: "Risk Management System", items: 5 },
        { article: "Article 10", title: "Data Governance", items: 5 },
        { article: "Article 11", title: "Technical Documentation", items: 6 },
        { article: "Article 13", title: "Transparency", items: 4 },
        { article: "Article 14", title: "Human Oversight", items: 4 },
      ],
      deadline,
      daysRemaining
    };
  }
  
  // Limited risk
  if ((data.makesDecisions || triggers.length > 0) && (affectsEU || affectsEUResidents)) {
    return {
      level: "limited",
      triggers: triggers.length > 0 ? triggers : [{ 
        criterion: "EU market exposure", 
        article: "Article 52", 
        description: "Transparency obligations for certain AI systems" 
      }],
      requirements: 8,
      articles: [
        { article: "Article 52", title: "Transparency Obligations", items: 4 },
        { article: "Article 13", title: "Transparency", items: 4 },
      ],
      deadline,
      daysRemaining
    };
  }
  
  // Minimal risk
  return {
    level: "minimal",
    triggers: [{ 
      criterion: "No high-risk indicators", 
      article: "N/A", 
      description: "System does not fall under regulated categories" 
    }],
    requirements: 2,
    articles: [
      { article: "Best Practice", title: "Voluntary Compliance", items: 2 },
    ],
    deadline: "N/A",
    daysRemaining: 0
  };
}

// System type display config
export const systemTypeConfig: { id: SystemType; label: string; description: string; warning?: string }[] = [
  { 
    id: "ai_agent", 
    label: "AI Agent", 
    description: "Autonomous systems that take actions, use tools, and make decisions (LangChain, CrewAI, AutoGen, etc.)",
    warning: "Typically classified as HIGH RISK"
  },
  { 
    id: "llm_application", 
    label: "LLM Application", 
    description: "Chatbots, content generators, Q&A systems powered by large language models"
  },
  { 
    id: "ml_model", 
    label: "ML Model", 
    description: "Traditional machine learning models for prediction, classification, or regression tasks"
  },
  { 
    id: "automated_decision", 
    label: "Automated Decision System", 
    description: "Systems that make or support decisions affecting individuals (hiring, credit, benefits, etc.)",
    warning: "Often classified as HIGH RISK"
  },
  { 
    id: "other", 
    label: "Other", 
    description: "Custom or specialized AI systems not fitting the categories above"
  },
];

// Agent framework options
export const agentFrameworks: SelectItemType[] = [
  { id: "langchain", label: "LangChain" },
  { id: "crewai", label: "CrewAI" },
  { id: "autogen", label: "AutoGen" },
  { id: "openai_assistants", label: "OpenAI Assistants" },
  { id: "aws_bedrock", label: "AWS Bedrock Agents" },
  { id: "google_adk", label: "Google ADK" },
  { id: "custom", label: "Custom / Other" },
];

// Agent capabilities config
export const agentCapabilitiesConfig: { id: AgentCapability; label: string; description: string }[] = [
  { id: "autonomous_decisions", label: "Makes autonomous decisions", description: "Agent decides actions without human approval for each step" },
  { id: "external_access", label: "Accesses external systems", description: "Calls APIs, databases, or third-party services" },
  { id: "sends_communications", label: "Sends communications", description: "Sends emails, messages, or notifications on behalf of users" },
  { id: "processes_personal_data", label: "Processes personal data", description: "Handles PII, health data, or sensitive information" },
  { id: "financial_actions", label: "Makes financial transactions", description: "Processes payments, refunds, or transfers" },
  { id: "physical_control", label: "Controls physical systems", description: "Interacts with IoT devices, robotics, or machinery" },
  { id: "hitl_configured", label: "Human-in-the-loop configured", description: "Certain actions require human approval before execution" },
];

// Initial form state
export const initialFormData: FormData = {
  systemType: "",
  name: "",
  description: "",
  provider: "",
  modelName: "",
  deploymentStatus: "",
  agentFramework: "",
  agentCapabilities: [],
  isMultiAgent: false,
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
