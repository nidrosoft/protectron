import { Danger, Warning2, InfoCircle, TickCircle } from "iconsax-react";

// ============================================
// TYPES & INTERFACES
// ============================================

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

export type RiskLevel = "prohibited" | "high" | "limited" | "minimal";
export type GapPriority = "critical" | "important" | "recommended";

export interface DetectedAISystem {
  id: string;
  name: string;
  type: string;
  category: string;
  annexCategory?: string;
  riskLevel: RiskLevel;
  riskReason: string;
  requirementsCount: number;
  documentsNeeded: string[];
  deadline: string;
  estimatedEffort: string;
}

export interface ComplianceGap {
  id: string;
  title: string;
  description: string;
  articleRef: string;
  priority: GapPriority;
  systemsAffected: number;
}

export interface ApplicableArticle {
  id: string;
  number: string;
  title: string;
  officialText: string;
  plainExplanation: string;
  requirements: ArticleRequirement[];
  documentsNeeded: string[];
  estimatedHours: number;
  appliesToRiskLevels: RiskLevel[];
}

export interface ArticleRequirement {
  id: string;
  title: string;
  description: string;
}

export interface RoadmapPhase {
  id: string;
  phase: number;
  title: string;
  timeframe: string;
  steps: RoadmapStep[];
}

export interface RoadmapStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  protectronFeature: string;
  estimatedMinutes: number;
}

export interface RiskResult {
  level: RiskLevel;
  count: number;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: typeof Danger;
}

export interface ScoreBreakdown {
  category: string;
  points: number;
  reason: string;
  isPositive: boolean;
}

export interface EnhancedAssessmentResults {
  // Basic results
  results: RiskResult[];
  complianceScore: number;
  hasEUExposure: boolean;
  totalSystems: number;
  
  // Enhanced data
  detectedSystems: DetectedAISystem[];
  complianceGaps: ComplianceGap[];
  applicableArticles: ApplicableArticle[];
  roadmapPhases: RoadmapPhase[];
  scoreBreakdown: ScoreBreakdown[];
  
  // Summary stats
  totalRequirements: number;
  totalDocuments: number;
  estimatedWeeks: number;
  deadlineDate: Date;
  daysUntilDeadline: number;
}

// ============================================
// CONSTANTS & MAPPINGS
// ============================================

const AI_SYSTEM_TYPE_LABELS: Record<string, string> = {
  "chatbot": "Chatbots & Virtual Assistants",
  "ml-model": "Machine Learning Models",
  "genai": "Generative AI",
  "recommendation": "Recommendation Systems",
  "analytics": "Predictive Analytics",
  "automation": "Intelligent Process Automation",
  "vision": "Computer Vision",
  "nlp": "Natural Language Processing",
  "speech": "Speech Recognition & Synthesis",
  "biometric": "Biometric Systems",
  "autonomous": "Autonomous Systems",
  "fraud": "Fraud Detection & Security",
};

const USE_CASE_LABELS: Record<string, { label: string; annexCategory: string; risk: RiskLevel }> = {
  "hiring": { label: "Recruitment & Hiring AI", annexCategory: "Employment (Annex III, Section 4)", risk: "high" },
  "healthcare": { label: "Healthcare & Medical AI", annexCategory: "Essential Services (Annex III, Section 5)", risk: "high" },
  "finance": { label: "Credit & Financial Services AI", annexCategory: "Essential Services (Annex III, Section 5)", risk: "high" },
  "legal": { label: "Legal & Law Enforcement AI", annexCategory: "Law Enforcement (Annex III, Section 6)", risk: "high" },
  "education": { label: "Education & Training AI", annexCategory: "Education (Annex III, Section 3)", risk: "high" },
  "critical-infra": { label: "Critical Infrastructure AI", annexCategory: "Critical Infrastructure (Annex III, Section 2)", risk: "high" },
  "biometric-id": { label: "Biometric Identification AI", annexCategory: "Biometrics (Annex III, Section 1)", risk: "high" },
  "customer-service": { label: "Customer Service AI", annexCategory: "Chatbot (Article 50)", risk: "limited" },
  "marketing": { label: "Marketing & Personalization AI", annexCategory: "Recommendation System", risk: "limited" },
  "content-mod": { label: "Content Moderation AI", annexCategory: "Content Filtering", risk: "limited" },
  "internal": { label: "Internal Operations AI", annexCategory: "Internal Use Only", risk: "minimal" },
  "research": { label: "Research & Development AI", annexCategory: "R&D / Experimentation", risk: "minimal" },
};

const HIGH_RISK_DATA_TYPES = ["biometric", "health", "financial", "criminal", "children"];
const LIMITED_RISK_SYSTEM_TYPES = ["chatbot", "genai", "recommendation", "speech", "nlp"];
const MINIMAL_RISK_SYSTEM_TYPES = ["analytics", "automation", "fraud", "ml-model", "vision"];
const HIGH_RISK_USE_CASES = ["hiring", "healthcare", "finance", "legal", "education", "critical-infra", "biometric-id"];

// EU AI Act Article definitions
const EU_AI_ACT_ARTICLES: ApplicableArticle[] = [
  {
    id: "art-9",
    number: "9",
    title: "Risk Management System",
    officialText: "High-risk AI systems shall be subject to a risk management system that shall be established, implemented, documented, and maintained.",
    plainExplanation: "You must create and maintain a documented process for identifying, analyzing, and mitigating risks throughout your AI system's lifecycle.",
    requirements: [
      { id: "art-9-1", title: "Risk Management System", description: "Establish, implement, document and maintain a risk management system throughout the AI system lifecycle." },
      { id: "art-9-2", title: "Risk Identification", description: "Identify and analyze known and reasonably foreseeable risks associated with the AI system." },
      { id: "art-9-3", title: "Risk Mitigation Measures", description: "Implement appropriate risk mitigation measures to address identified risks." },
      { id: "art-9-4", title: "Residual Risk Assessment", description: "Evaluate residual risks after mitigation and ensure they are acceptable." },
    ],
    documentsNeeded: ["Risk Assessment Report", "Risk Mitigation Plan", "Risk Management Policy"],
    estimatedHours: 3,
    appliesToRiskLevels: ["high", "limited"],
  },
  {
    id: "art-10",
    number: "10",
    title: "Data and Data Governance",
    officialText: "High-risk AI systems which make use of techniques involving the training of models with data shall be developed on the basis of training, validation and testing data sets that meet quality criteria.",
    plainExplanation: "Your training data must be relevant, representative, and free from errors. You must document data governance practices and conduct bias assessments.",
    requirements: [
      { id: "art-10-1", title: "Data Governance Framework", description: "Establish data governance and management practices for training, validation and testing datasets." },
      { id: "art-10-2", title: "Training Data Quality", description: "Ensure training datasets are relevant, representative, free of errors and complete." },
      { id: "art-10-3", title: "Bias Examination", description: "Examine datasets for possible biases that could lead to discrimination." },
      { id: "art-10-4", title: "Data Documentation", description: "Document data collection processes, data preparation, and labeling procedures." },
    ],
    documentsNeeded: ["Data Governance Policy", "Training Data Documentation", "Bias Assessment Report"],
    estimatedHours: 4,
    appliesToRiskLevels: ["high"],
  },
  {
    id: "art-11",
    number: "11",
    title: "Technical Documentation",
    officialText: "The technical documentation of a high-risk AI system shall be drawn up before that system is placed on the market or put into service and shall be kept up-to-date.",
    plainExplanation: "You must create comprehensive documentation describing your AI system, how it works, its capabilities and limitations, and how it was developed and tested.",
    requirements: [
      { id: "art-11-1", title: "Technical Documentation", description: "Draw up technical documentation before the AI system is placed on the market or put into service." },
      { id: "art-11-2", title: "System Description", description: "Document general description of the AI system including intended purpose and functionality." },
      { id: "art-11-3", title: "Development Process", description: "Document the design specifications and development process of the AI system." },
    ],
    documentsNeeded: ["AI System Description", "Design and Development Specification", "Model Card", "Testing and Validation Report"],
    estimatedHours: 4,
    appliesToRiskLevels: ["high", "limited"],
  },
  {
    id: "art-12",
    number: "12",
    title: "Record-keeping",
    officialText: "High-risk AI systems shall technically allow for the automatic recording of events ('logs') over the lifetime of the system.",
    plainExplanation: "Your AI system must automatically log events to ensure traceability. This includes input data, decisions made, and outputs generated.",
    requirements: [
      { id: "art-12-1", title: "Automatic Logging", description: "Design AI systems to automatically record events (logs) throughout their lifetime." },
      { id: "art-12-2", title: "Log Traceability", description: "Ensure logs enable traceability of AI system functioning and decisions." },
      { id: "art-12-3", title: "Log Retention", description: "Retain logs for an appropriate period commensurate with the intended purpose." },
    ],
    documentsNeeded: ["Logging Policy", "Audit Trail Samples", "Log Retention Documentation"],
    estimatedHours: 2,
    appliesToRiskLevels: ["high"],
  },
  {
    id: "art-13",
    number: "13",
    title: "Transparency and User Information",
    officialText: "High-risk AI systems shall be designed and developed in such a way to ensure that their operation is sufficiently transparent to enable deployers to interpret the system's output and use it appropriately.",
    plainExplanation: "You must provide clear instructions for use that explain what your AI system does, its capabilities, limitations, and how humans should oversee it.",
    requirements: [
      { id: "art-13-1", title: "Transparency Obligations", description: "Design AI systems to be sufficiently transparent to enable users to interpret outputs." },
      { id: "art-13-2", title: "Instructions for Use", description: "Provide clear instructions for use including identity of provider, system characteristics, and limitations." },
      { id: "art-13-3", title: "Human Oversight Information", description: "Inform users about human oversight measures and how to use them effectively." },
    ],
    documentsNeeded: ["Instructions for Use", "Deployer Information Package", "User Notification Templates"],
    estimatedHours: 2,
    appliesToRiskLevels: ["high", "limited"],
  },
  {
    id: "art-14",
    number: "14",
    title: "Human Oversight",
    officialText: "High-risk AI systems shall be designed and developed in such a way...that they can be effectively overseen by natural persons during the period in which they are in use.",
    plainExplanation: "Your AI system must include mechanisms for human oversight, including the ability to monitor, intervene, and override AI decisions when necessary.",
    requirements: [
      { id: "art-14-1", title: "Human Oversight Design", description: "Design AI systems to be effectively overseen by natural persons during use." },
      { id: "art-14-2", title: "Oversight Measures", description: "Implement appropriate human-machine interface tools for oversight." },
      { id: "art-14-3", title: "Override Capability", description: "Enable human operators to override or reverse AI system outputs when necessary." },
      { id: "art-14-4", title: "Intervention Capability", description: "Allow human operators to intervene in the operation of the AI system or interrupt it." },
    ],
    documentsNeeded: ["Human Oversight Procedures", "Intervention Protocols", "Operator Training Records"],
    estimatedHours: 3,
    appliesToRiskLevels: ["high"],
  },
  {
    id: "art-15",
    number: "15",
    title: "Accuracy, Robustness and Cybersecurity",
    officialText: "High-risk AI systems shall be designed and developed in such a way that they achieve...an appropriate level of accuracy, robustness and cybersecurity.",
    plainExplanation: "Your AI system must perform accurately, handle errors gracefully, and be protected against security threats and adversarial attacks.",
    requirements: [
      { id: "art-15-1", title: "Accuracy Requirements", description: "Achieve appropriate levels of accuracy for the AI system intended purpose." },
      { id: "art-15-2", title: "Robustness", description: "Design AI systems to be resilient against errors, faults, and inconsistencies." },
      { id: "art-15-3", title: "Cybersecurity Measures", description: "Implement appropriate cybersecurity measures to protect against unauthorized access." },
    ],
    documentsNeeded: ["Accuracy Test Results", "Robustness Testing Documentation", "Security Assessment Report"],
    estimatedHours: 4,
    appliesToRiskLevels: ["high"],
  },
  {
    id: "art-26",
    number: "26",
    title: "Deployer Obligations",
    officialText: "Deployers of high-risk AI systems shall take appropriate technical and organisational measures to ensure they use such systems in accordance with the instructions for use.",
    plainExplanation: "If you deploy (use) high-risk AI systems, you must follow the provider's instructions, assign competent human oversight, and report serious incidents.",
    requirements: [
      { id: "art-26-1", title: "Deployer Compliance", description: "Ensure AI systems are used in accordance with instructions for use." },
      { id: "art-26-2", title: "Human Oversight Assignment", description: "Assign human oversight to natural persons with necessary competence and authority." },
      { id: "art-26-3", title: "Input Data Relevance", description: "Ensure input data is relevant and sufficiently representative for the intended purpose." },
      { id: "art-26-4", title: "Monitoring Obligations", description: "Monitor the operation of the AI system based on instructions for use." },
      { id: "art-26-5", title: "Incident Reporting", description: "Report serious incidents to providers and relevant authorities." },
    ],
    documentsNeeded: ["Deployer Compliance Checklist", "Incident Reporting Procedures", "Monitoring Log"],
    estimatedHours: 2,
    appliesToRiskLevels: ["high", "limited"],
  },
  {
    id: "art-50",
    number: "50",
    title: "Transparency for Limited Risk",
    officialText: "Providers shall ensure that AI systems intended to interact directly with natural persons are designed and developed in such a way that the natural persons concerned are informed that they are interacting with an AI system.",
    plainExplanation: "Users must be clearly informed when they are interacting with an AI system (like a chatbot) and when content is AI-generated.",
    requirements: [
      { id: "art-50-1", title: "AI Interaction Disclosure", description: "Inform natural persons that they are interacting with an AI system." },
      { id: "art-50-2", title: "Synthetic Content Marking", description: "Mark AI-generated synthetic audio, image, video or text content." },
    ],
    documentsNeeded: ["AI Disclosure Notice", "Synthetic Content Policy"],
    estimatedHours: 1,
    appliesToRiskLevels: ["limited", "minimal"],
  },
];

// ============================================
// MAIN CALCULATION FUNCTION
// ============================================

export function calculateEnhancedResults(data: AssessmentData): EnhancedAssessmentResults {
  const scoreBreakdown: ScoreBreakdown[] = [];
  let baseScore = 100;
  
  // Calculate EU exposure
  const hasEUExposure = data.hasEUCustomers || data.hasEUOperations || data.processesEUData;
  
  if (hasEUExposure) {
    scoreBreakdown.push({
      category: "EU Exposure",
      points: 0,
      reason: "Your organization has EU exposure (customers, operations, or data processing)",
      isPositive: false,
    });
  }
  
  // Detect AI systems from assessment data
  const detectedSystems = detectAISystems(data);
  
  // Calculate risk results
  const results = calculateRiskResults(detectedSystems, data, scoreBreakdown);
  
  // Calculate compliance score
  const complianceScore = calculateComplianceScore(baseScore, scoreBreakdown, data);
  
  // Determine applicable articles based on detected systems
  const applicableArticles = determineApplicableArticles(detectedSystems);
  
  // Generate compliance gaps
  const complianceGaps = generateComplianceGaps(detectedSystems, applicableArticles);
  
  // Generate roadmap
  const roadmapPhases = generateRoadmap(detectedSystems, applicableArticles);
  
  // Calculate summary stats
  const totalRequirements = applicableArticles.reduce((sum, art) => sum + art.requirements.length, 0);
  const totalDocuments = [...new Set(applicableArticles.flatMap(art => art.documentsNeeded))].length;
  const estimatedHours = applicableArticles.reduce((sum, art) => sum + art.estimatedHours, 0);
  const estimatedWeeks = Math.ceil(estimatedHours / 20); // Assuming 20 hours/week dedicated
  
  // Deadline calculation
  const deadlineDate = new Date("2026-08-02");
  const today = new Date();
  const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    results,
    complianceScore,
    hasEUExposure,
    totalSystems: detectedSystems.length,
    detectedSystems,
    complianceGaps,
    applicableArticles,
    roadmapPhases,
    scoreBreakdown,
    totalRequirements,
    totalDocuments,
    estimatedWeeks,
    deadlineDate,
    daysUntilDeadline,
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function detectAISystems(data: AssessmentData): DetectedAISystem[] {
  const systems: DetectedAISystem[] = [];
  let systemIndex = 1;
  
  // Create systems from high-risk use cases
  for (const useCase of data.useCases) {
    const useCaseInfo = USE_CASE_LABELS[useCase];
    if (!useCaseInfo) continue;
    
    const isHighRisk = HIGH_RISK_USE_CASES.includes(useCase);
    const riskLevel: RiskLevel = isHighRisk ? "high" : useCaseInfo.risk;
    
    systems.push({
      id: `sys-${systemIndex}`,
      name: useCaseInfo.label,
      type: useCase,
      category: useCaseInfo.annexCategory,
      annexCategory: isHighRisk ? useCaseInfo.annexCategory : undefined,
      riskLevel,
      riskReason: getRiskReason(useCase, riskLevel),
      requirementsCount: getRequirementsCount(riskLevel),
      documentsNeeded: getDocumentsNeeded(riskLevel),
      deadline: riskLevel === "high" ? "August 2, 2026" : "August 2, 2027",
      estimatedEffort: getEstimatedEffort(riskLevel),
    });
    systemIndex++;
  }
  
  // Create systems from AI system types (if not already covered by use cases)
  for (const systemType of data.aiSystemTypes) {
    // Skip if we already have a high-risk system that covers this
    const existingHighRisk = systems.some(s => s.riskLevel === "high");
    
    let riskLevel: RiskLevel = "minimal";
    if (LIMITED_RISK_SYSTEM_TYPES.includes(systemType)) {
      riskLevel = "limited";
    } else if (MINIMAL_RISK_SYSTEM_TYPES.includes(systemType)) {
      riskLevel = "minimal";
    }
    
    // Check if high-risk data types elevate the risk
    const hasHighRiskData = data.dataTypes.some(dt => HIGH_RISK_DATA_TYPES.includes(dt));
    const hasHighImpact = data.decisionImpact === "high" || data.decisionImpact === "critical";
    
    if (hasHighRiskData && hasHighImpact && !existingHighRisk) {
      riskLevel = "high";
    }
    
    systems.push({
      id: `sys-${systemIndex}`,
      name: AI_SYSTEM_TYPE_LABELS[systemType] || systemType,
      type: systemType,
      category: getCategoryForSystemType(systemType),
      riskLevel,
      riskReason: getRiskReasonForSystemType(systemType, riskLevel, hasHighRiskData, hasHighImpact),
      requirementsCount: getRequirementsCount(riskLevel),
      documentsNeeded: getDocumentsNeeded(riskLevel),
      deadline: riskLevel === "high" ? "August 2, 2026" : "August 2, 2027",
      estimatedEffort: getEstimatedEffort(riskLevel),
    });
    systemIndex++;
  }
  
  // Ensure at least one system if none detected
  if (systems.length === 0) {
    systems.push({
      id: "sys-1",
      name: "General AI System",
      type: "general",
      category: "General Purpose",
      riskLevel: "minimal",
      riskReason: "No specific high-risk use cases or system types identified",
      requirementsCount: 2,
      documentsNeeded: ["AI Disclosure Notice"],
      deadline: "August 2, 2027",
      estimatedEffort: "30-60 minutes",
    });
  }
  
  return systems;
}

function getRiskReason(useCase: string, riskLevel: RiskLevel): string {
  const reasons: Record<string, string> = {
    "hiring": "AI systems used in recruitment and hiring decisions are classified as high-risk under Annex III because they significantly impact people's access to employment and livelihood opportunities.",
    "healthcare": "AI systems used for medical diagnosis or treatment recommendations are classified as high-risk because they directly affect patient health and safety.",
    "finance": "AI systems used for credit scoring or financial decisions are classified as high-risk because they affect people's access to essential financial services.",
    "legal": "AI systems used in legal or law enforcement contexts are classified as high-risk due to their impact on fundamental rights and access to justice.",
    "education": "AI systems used for educational assessment or admissions are classified as high-risk because they affect access to education and future opportunities.",
    "critical-infra": "AI systems managing critical infrastructure are classified as high-risk due to potential impacts on public safety and essential services.",
    "biometric-id": "AI systems using biometric identification are classified as high-risk due to privacy implications and potential for misuse.",
    "customer-service": "Customer-facing AI systems require transparency disclosures under Article 50 to inform users they are interacting with AI.",
    "marketing": "AI recommendation systems require transparency about how personalization works.",
    "content-mod": "Content moderation AI requires transparency about automated decision-making.",
    "internal": "Internal-use AI systems have minimal regulatory requirements but best practices still apply.",
    "research": "R&D AI systems are generally exempt from most requirements but should follow ethical guidelines.",
  };
  
  return reasons[useCase] || `This AI system is classified as ${riskLevel} risk based on its use case and potential impact.`;
}

function getRiskReasonForSystemType(systemType: string, riskLevel: RiskLevel, hasHighRiskData: boolean, hasHighImpact: boolean): string {
  if (riskLevel === "high" && hasHighRiskData && hasHighImpact) {
    return "This system processes sensitive data types (biometric, health, financial, or children's data) and makes high-impact decisions, elevating it to high-risk classification.";
  }
  
  if (LIMITED_RISK_SYSTEM_TYPES.includes(systemType)) {
    return "This system type requires transparency disclosures under Article 50 to inform users they are interacting with AI or viewing AI-generated content.";
  }
  
  return "This system type has minimal regulatory requirements under the EU AI Act, but voluntary best practices are recommended.";
}

function getCategoryForSystemType(systemType: string): string {
  const categories: Record<string, string> = {
    "chatbot": "Conversational AI (Article 50)",
    "genai": "Generative AI (Article 50)",
    "recommendation": "Recommendation System",
    "speech": "Speech Processing",
    "nlp": "Natural Language Processing",
    "analytics": "Predictive Analytics",
    "automation": "Process Automation",
    "fraud": "Security & Fraud Detection",
    "ml-model": "Machine Learning Model",
    "vision": "Computer Vision",
    "biometric": "Biometric Processing",
    "autonomous": "Autonomous Systems",
  };
  
  return categories[systemType] || "General AI System";
}

function getRequirementsCount(riskLevel: RiskLevel): number {
  switch (riskLevel) {
    case "prohibited": return 0;
    case "high": return 31; // Sum of all high-risk article requirements
    case "limited": return 8; // Articles 9, 11, 13, 26, 50
    case "minimal": return 2; // Article 50 only
    default: return 0;
  }
}

function getDocumentsNeeded(riskLevel: RiskLevel): string[] {
  switch (riskLevel) {
    case "high":
      return [
        "Risk Assessment Report",
        "Technical Documentation",
        "Data Governance Policy",
        "Human Oversight Procedures",
        "Instructions for Use",
        "Accuracy Test Results",
        "Security Assessment",
      ];
    case "limited":
      return [
        "Technical Documentation",
        "Instructions for Use",
        "AI Disclosure Notice",
        "Risk Management Summary",
      ];
    case "minimal":
      return ["AI Disclosure Notice"];
    default:
      return [];
  }
}

function getEstimatedEffort(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case "high": return "3-6 hours";
    case "limited": return "1-2 hours";
    case "minimal": return "30-60 minutes";
    default: return "Unknown";
  }
}

function calculateRiskResults(
  systems: DetectedAISystem[],
  data: AssessmentData,
  scoreBreakdown: ScoreBreakdown[]
): RiskResult[] {
  const results: RiskResult[] = [];
  
  const prohibitedCount = systems.filter(s => s.riskLevel === "prohibited").length;
  const highCount = systems.filter(s => s.riskLevel === "high").length;
  const limitedCount = systems.filter(s => s.riskLevel === "limited").length;
  const minimalCount = systems.filter(s => s.riskLevel === "minimal").length;
  
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
    scoreBreakdown.push({
      category: "Prohibited Systems",
      points: -30,
      reason: `${prohibitedCount} prohibited AI practice(s) detected`,
      isPositive: false,
    });
  }
  
  if (highCount > 0) {
    results.push({
      level: "high",
      count: highCount,
      label: "High Risk",
      description: "Requires conformity assessment",
      color: "text-warning-600",
      bgColor: "bg-warning-50",
      borderColor: "border-warning-200",
      icon: Warning2,
    });
    scoreBreakdown.push({
      category: "High-Risk Systems",
      points: -(highCount * 8),
      reason: `${highCount} high-risk AI system(s) require full compliance`,
      isPositive: false,
    });
  }
  
  if (limitedCount > 0) {
    results.push({
      level: "limited",
      count: limitedCount,
      label: "Limited Risk",
      description: "Transparency obligations",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: InfoCircle,
    });
    scoreBreakdown.push({
      category: "Limited-Risk Systems",
      points: -(limitedCount * 3),
      reason: `${limitedCount} limited-risk AI system(s) require transparency`,
      isPositive: false,
    });
  }
  
  if (minimalCount > 0 || results.length === 0) {
    results.push({
      level: "minimal",
      count: Math.max(minimalCount, 1),
      label: "Minimal Risk",
      description: "Voluntary best practices",
      color: "text-success-600",
      bgColor: "bg-success-50",
      borderColor: "border-success-200",
      icon: TickCircle,
    });
  }
  
  // Automation level adjustments
  if (data.automationLevel === "fully-automated" || data.automationLevel === "automated-override") {
    if (highCount > 0) {
      scoreBreakdown.push({
        category: "Automation Level",
        points: -10,
        reason: "Fully automated decisions with high-risk systems increase compliance burden",
        isPositive: false,
      });
    }
  } else if (data.automationLevel === "human-in-loop" || data.automationLevel === "advisory-only") {
    scoreBreakdown.push({
      category: "Human Oversight",
      points: 5,
      reason: "Human-in-the-loop or advisory-only reduces risk",
      isPositive: true,
    });
  }
  
  return results;
}

function calculateComplianceScore(baseScore: number, breakdown: ScoreBreakdown[], data: AssessmentData): number {
  let score = baseScore;
  
  for (const item of breakdown) {
    score += item.points;
  }
  
  return Math.max(0, Math.min(100, score));
}

function determineApplicableArticles(systems: DetectedAISystem[]): ApplicableArticle[] {
  const applicableArticleIds = new Set<string>();
  
  for (const system of systems) {
    if (system.riskLevel === "high") {
      // High-risk systems: Articles 9-15, 26
      applicableArticleIds.add("art-9");
      applicableArticleIds.add("art-10");
      applicableArticleIds.add("art-11");
      applicableArticleIds.add("art-12");
      applicableArticleIds.add("art-13");
      applicableArticleIds.add("art-14");
      applicableArticleIds.add("art-15");
      applicableArticleIds.add("art-26");
    } else if (system.riskLevel === "limited") {
      // Limited-risk systems: Articles 9, 11, 13, 26, 50
      applicableArticleIds.add("art-9");
      applicableArticleIds.add("art-11");
      applicableArticleIds.add("art-13");
      applicableArticleIds.add("art-26");
      applicableArticleIds.add("art-50");
    } else if (system.riskLevel === "minimal") {
      // Minimal-risk systems: Article 50 only
      applicableArticleIds.add("art-50");
    }
  }
  
  return EU_AI_ACT_ARTICLES.filter(art => applicableArticleIds.has(art.id));
}

function generateComplianceGaps(systems: DetectedAISystem[], articles: ApplicableArticle[]): ComplianceGap[] {
  const gaps: ComplianceGap[] = [];
  const highRiskCount = systems.filter(s => s.riskLevel === "high").length;
  const limitedRiskCount = systems.filter(s => s.riskLevel === "limited").length;
  
  // Critical gaps (for high-risk systems)
  if (highRiskCount > 0) {
    gaps.push({
      id: "gap-1",
      title: "Risk Management System not documented",
      description: "Article 9 requires a documented risk management system that identifies, analyzes, and mitigates AI risks.",
      articleRef: "Article 9",
      priority: "critical",
      systemsAffected: highRiskCount,
    });
    
    gaps.push({
      id: "gap-2",
      title: "Technical Documentation not created",
      description: "Article 11 requires comprehensive technical documentation covering system design, data, and performance metrics.",
      articleRef: "Article 11",
      priority: "critical",
      systemsAffected: highRiskCount,
    });
    
    gaps.push({
      id: "gap-3",
      title: "No audit logging implemented",
      description: "Article 12 requires automatic event logging for the lifetime of the AI system.",
      articleRef: "Article 12",
      priority: "critical",
      systemsAffected: highRiskCount,
    });
  }
  
  // Important gaps
  if (highRiskCount > 0) {
    gaps.push({
      id: "gap-4",
      title: "Human oversight procedures not defined",
      description: "Article 14 requires documented human oversight measures.",
      articleRef: "Article 14",
      priority: "important",
      systemsAffected: highRiskCount,
    });
    
    gaps.push({
      id: "gap-5",
      title: "Data governance policy not established",
      description: "Article 10 requires documented data quality and bias assessment procedures.",
      articleRef: "Article 10",
      priority: "important",
      systemsAffected: highRiskCount,
    });
    
    gaps.push({
      id: "gap-6",
      title: "Transparency information not prepared",
      description: "Article 13 requires user-facing instructions for use.",
      articleRef: "Article 13",
      priority: "important",
      systemsAffected: highRiskCount + limitedRiskCount,
    });
  }
  
  // Recommended gaps
  gaps.push({
    id: "gap-7",
    title: "Accuracy testing documentation",
    description: "Document accuracy metrics and testing methodologies for your AI systems.",
    articleRef: "Article 15",
    priority: "recommended",
    systemsAffected: highRiskCount,
  });
  
  gaps.push({
    id: "gap-8",
    title: "Cybersecurity assessment",
    description: "Conduct and document security assessment for AI systems.",
    articleRef: "Article 15",
    priority: "recommended",
    systemsAffected: highRiskCount,
  });
  
  if (limitedRiskCount > 0 || highRiskCount > 0) {
    gaps.push({
      id: "gap-9",
      title: "AI interaction disclosure",
      description: "Implement clear disclosure when users interact with AI systems.",
      articleRef: "Article 50",
      priority: limitedRiskCount > 0 ? "important" : "recommended",
      systemsAffected: limitedRiskCount + highRiskCount,
    });
  }
  
  return gaps;
}

function generateRoadmap(systems: DetectedAISystem[], articles: ApplicableArticle[]): RoadmapPhase[] {
  const hasHighRisk = systems.some(s => s.riskLevel === "high");
  const systemCount = systems.length;
  
  const phases: RoadmapPhase[] = [
    {
      id: "phase-1",
      phase: 1,
      title: "Foundation",
      timeframe: "Week 1-2",
      steps: [
        {
          id: "step-1",
          stepNumber: 1,
          title: "Register all AI systems in Protectron",
          description: `Add the ${systemCount} AI system(s) we've identified, plus any others you may have. Each system needs individual compliance tracking.`,
          protectronFeature: "Protectron will auto-generate your requirements checklist",
          estimatedMinutes: 30,
        },
        {
          id: "step-2",
          stepNumber: 2,
          title: "Complete risk classification for each system",
          description: "Verify the risk level we've assigned and provide additional details about each AI system's use case and data types.",
          protectronFeature: "This determines which articles and requirements apply",
          estimatedMinutes: 45,
        },
        {
          id: "step-3",
          stepNumber: 3,
          title: "Assign compliance owners",
          description: "Designate team members responsible for each AI system's compliance. Typically: CTO, Legal, Product Manager.",
          protectronFeature: "They'll receive notifications and deadline reminders",
          estimatedMinutes: 15,
        },
      ],
    },
    {
      id: "phase-2",
      phase: 2,
      title: "Documentation",
      timeframe: "Week 3-6",
      steps: [
        {
          id: "step-4",
          stepNumber: 4,
          title: "Generate Risk Management Documentation",
          description: "Use Protectron's AI-powered document generator to create Risk Assessment Report, Risk Mitigation Plan, and Risk Management Policy.",
          protectronFeature: "Answer guided questions, review drafts, customize",
          estimatedMinutes: 120,
        },
        {
          id: "step-5",
          stepNumber: 5,
          title: "Create Technical Documentation",
          description: "Generate comprehensive system documentation including AI System Description, Model Card, Design Specification, and Testing Report.",
          protectronFeature: "Required for Article 11 compliance",
          estimatedMinutes: 180,
        },
        {
          id: "step-6",
          stepNumber: 6,
          title: "Establish Data Governance",
          description: "Document your data practices including Data Governance Policy, Training Data Documentation, and Bias Assessment Report.",
          protectronFeature: "Required for Article 10 compliance",
          estimatedMinutes: 120,
        },
        {
          id: "step-7",
          stepNumber: 7,
          title: "Define Human Oversight Procedures",
          description: "Create oversight documentation including Human Oversight Procedures, Intervention Protocols, and Operator Training Materials.",
          protectronFeature: "Required for Article 14 compliance",
          estimatedMinutes: 90,
        },
        {
          id: "step-8",
          stepNumber: 8,
          title: "Prepare Transparency Documentation",
          description: "Create user-facing materials including Instructions for Use, Deployer Information Package, and User Notification Templates.",
          protectronFeature: "Required for Article 13 compliance",
          estimatedMinutes: 60,
        },
      ],
    },
    {
      id: "phase-3",
      phase: 3,
      title: "Implementation",
      timeframe: "Week 7-10",
      steps: [
        {
          id: "step-9",
          stepNumber: 9,
          title: "Implement audit logging",
          description: "Technical implementation for Article 12: Integrate Protectron SDK for automatic logging, or implement custom logging per specifications.",
          protectronFeature: "Protectron SDK handles this automatically",
          estimatedMinutes: 240,
        },
        {
          id: "step-10",
          stepNumber: 10,
          title: "Conduct accuracy and security testing",
          description: "Gather evidence for Article 15: Run accuracy tests, conduct security assessment, and document results.",
          protectronFeature: "Evidence links directly to requirements",
          estimatedMinutes: 180,
        },
        {
          id: "step-11",
          stepNumber: 11,
          title: "Upload supporting evidence",
          description: "Gather and organize all compliance evidence: Link documents to requirements, upload test results, add external certifications.",
          protectronFeature: "Evidence Management tracks everything",
          estimatedMinutes: 60,
        },
      ],
    },
    {
      id: "phase-4",
      phase: 4,
      title: "Verification",
      timeframe: "Week 11-12",
      steps: [
        {
          id: "step-12",
          stepNumber: 12,
          title: "Complete gap analysis",
          description: "Review compliance status: Check all requirements marked complete, verify all documents generated, ensure all evidence uploaded.",
          protectronFeature: "Dashboard shows overall readiness",
          estimatedMinutes: 60,
        },
        {
          id: "step-13",
          stepNumber: 13,
          title: "Generate compliance report",
          description: "Create audit-ready documentation: Full Compliance Report, Executive Summary, and Evidence Index.",
          protectronFeature: "One-click export for stakeholders",
          estimatedMinutes: 30,
        },
        {
          id: "step-14",
          stepNumber: 14,
          title: "Prepare EU Declaration of Conformity",
          description: "Final compliance declaration: Review conformity checklist, sign declaration, register in EU database (if required).",
          protectronFeature: "Ready for August 2026 deadline",
          estimatedMinutes: 45,
        },
      ],
    },
  ];
  
  // If no high-risk systems, simplify the roadmap
  if (!hasHighRisk) {
    return phases.filter(p => p.phase <= 2).map(p => ({
      ...p,
      steps: p.steps.filter(s => 
        !s.title.includes("Human Oversight") && 
        !s.title.includes("Data Governance") &&
        !s.title.includes("audit logging")
      ),
    }));
  }
  
  return phases;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function getScoreColor(score: number): string {
  if (score >= 70) return "text-success-500";
  if (score >= 40) return "text-warning-500";
  return "text-error-500";
}

export function getScoreLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: "Excellent", color: "text-success-600", bg: "bg-success-50" };
  if (score >= 60) return { label: "Good", color: "text-success-600", bg: "bg-success-50" };
  if (score >= 40) return { label: "Needs Work", color: "text-warning-600", bg: "bg-warning-50" };
  return { label: "Critical", color: "text-error-600", bg: "bg-error-50" };
}

export function formatDeadlineCountdown(days: number): string {
  if (days < 0) return "Deadline passed";
  if (days === 0) return "Deadline is today";
  if (days === 1) return "1 day remaining";
  if (days < 30) return `${days} days remaining`;
  if (days < 60) return `${Math.floor(days / 7)} weeks remaining`;
  return `${Math.floor(days / 30)} months remaining`;
}

export function getRiskLevelBadge(level: RiskLevel): { text: string; bg: string; text_color: string; border: string } {
  switch (level) {
    case "prohibited":
      return { text: "PROHIBITED", bg: "bg-error-100", text_color: "text-error-700", border: "border-error-300" };
    case "high":
      return { text: "HIGH RISK", bg: "bg-warning-100", text_color: "text-warning-700", border: "border-warning-300" };
    case "limited":
      return { text: "LIMITED RISK", bg: "bg-blue-100", text_color: "text-blue-700", border: "border-blue-300" };
    case "minimal":
      return { text: "MINIMAL RISK", bg: "bg-success-100", text_color: "text-success-700", border: "border-success-300" };
    default:
      return { text: "UNKNOWN", bg: "bg-gray-100", text_color: "text-gray-700", border: "border-gray-300" };
  }
}
