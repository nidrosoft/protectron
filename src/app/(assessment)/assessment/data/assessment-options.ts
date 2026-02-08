import { Building04, Globe01, Server01, Users01, ShieldTick, File06, Settings01, AlertCircle } from "@untitledui/icons";

// Step definitions with rich descriptions
export const stepDefinitions = [
  {
    id: 1,
    title: "Company Details",
    description: "Share your company name, industry, size, and location. This helps us tailor compliance requirements to your specific business context.",
    icon: Building04,
  },
  {
    id: 2,
    title: "EU Presence",
    description: "Identify your organization's connection to the European Union through customers, operations, or data processing activities.",
    icon: Globe01,
  },
  {
    id: 3,
    title: "AI Systems",
    description: "Select the types of AI technologies your organization currently uses or is developing, from chatbots to machine learning models.",
    icon: Server01,
  },
  {
    id: 4,
    title: "Use Cases",
    description: "Describe how AI systems are applied in your business operations, including any high-risk applications like hiring or healthcare.",
    icon: Users01,
  },
  {
    id: 5,
    title: "Data Types",
    description: "Specify the categories of data your AI systems process, including sensitive information like biometrics or health records.",
    icon: File06,
  },
  {
    id: 6,
    title: "Decision Impact",
    description: "Evaluate how AI-generated outputs affect individuals and the level of human oversight in your decision-making processes.",
    icon: ShieldTick,
  },
  {
    id: 7,
    title: "Compliance Readiness",
    description: "Tell us about your existing compliance measures, quality management, and incident response capabilities.",
    icon: Settings01,
  },
  {
    id: 8,
    title: "Risk & Deployment",
    description: "Describe your AI deployment context, including whether you develop or deploy AI, your public service role, and monitoring capabilities.",
    icon: AlertCircle,
  },
];

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
  // Step 7: Compliance Readiness (new)
  hasExistingQMS: boolean;
  hasIncidentResponsePlan: boolean;
  hasPostMarketMonitoring: boolean;
  existingCompliance: string[];
  // Step 8: Risk & Deployment Context (new)
  aiRole: string; // "provider" | "deployer" | "both"
  servesPublicSector: boolean;
  hasVulnerableGroups: boolean;
  deploymentEnvironment: string;
}

export const initialAssessmentData: AssessmentData = {
  companyName: "",
  industry: "",
  companySize: "",
  country: "",
  hasEUCustomers: false,
  hasEUOperations: false,
  processesEUData: false,
  aiSystemTypes: [],
  useCases: [],
  dataTypes: [],
  decisionImpact: "",
  automationLevel: "",
  // Step 7
  hasExistingQMS: false,
  hasIncidentResponsePlan: false,
  hasPostMarketMonitoring: false,
  existingCompliance: [],
  // Step 8
  aiRole: "",
  servesPublicSector: false,
  hasVulnerableGroups: false,
  deploymentEnvironment: "",
};

// AI System types options
export const aiSystemTypes = [
  { id: "chatbot", label: "Chatbots & Virtual Assistants", desc: "AI-powered customer service bots, support agents, or conversational interfaces" },
  { id: "ml-model", label: "Machine Learning Models", desc: "Custom-trained models for classification, regression, or pattern recognition" },
  { id: "genai", label: "Generative AI", desc: "Large language models (GPT, Claude), image generators (DALL-E, Midjourney), or code assistants" },
  { id: "recommendation", label: "Recommendation Systems", desc: "Personalized content, product suggestions, or algorithmic feeds" },
  { id: "analytics", label: "Predictive Analytics", desc: "Forecasting, demand prediction, risk scoring, or trend analysis" },
  { id: "automation", label: "Intelligent Process Automation", desc: "RPA with AI components, workflow automation, or decision automation" },
  { id: "vision", label: "Computer Vision", desc: "Image recognition, video analysis, OCR, or visual inspection systems" },
  { id: "nlp", label: "Natural Language Processing", desc: "Text analysis, sentiment detection, translation, or document processing" },
  { id: "speech", label: "Speech Recognition & Synthesis", desc: "Voice assistants, transcription services, or text-to-speech systems" },
  { id: "biometric", label: "Biometric Systems", desc: "Facial recognition, fingerprint analysis, or behavioral biometrics" },
  { id: "autonomous", label: "Autonomous Systems", desc: "Self-driving vehicles, drones, or robotic systems with AI decision-making" },
  { id: "fraud", label: "Fraud Detection & Security", desc: "Anomaly detection, threat identification, or security monitoring" },
];

// Use case options
export const useCaseOptions = [
  { id: "hiring", label: "Hiring & Recruitment", desc: "Resume screening, candidate ranking, interview scheduling, or employment decisions", risk: "high" },
  { id: "healthcare", label: "Healthcare & Medical", desc: "Diagnosis assistance, treatment recommendations, patient triage, or medical imaging analysis", risk: "high" },
  { id: "finance", label: "Credit & Financial Services", desc: "Credit scoring, loan approvals, insurance underwriting, or fraud detection for financial decisions", risk: "high" },
  { id: "legal", label: "Legal & Law Enforcement", desc: "Evidence analysis, legal research, risk assessment, or judicial decision support", risk: "high" },
  { id: "education", label: "Education & Training", desc: "Student grading, learning assessments, admission decisions, or educational content personalization", risk: "high" },
  { id: "critical-infra", label: "Critical Infrastructure", desc: "Energy grid management, water systems, transportation networks, or emergency services", risk: "high" },
  { id: "biometric-id", label: "Biometric Identification", desc: "Remote biometric identification, emotion recognition, or behavioral analysis", risk: "high" },
  { id: "customer-service", label: "Customer Service & Support", desc: "Chatbots, ticket routing, sentiment analysis, or customer interaction management", risk: "limited" },
  { id: "marketing", label: "Marketing & Personalization", desc: "Ad targeting, content recommendations, lead scoring, or customer segmentation", risk: "limited" },
  { id: "content-mod", label: "Content Moderation", desc: "Automated content filtering, spam detection, or policy enforcement", risk: "limited" },
  { id: "internal", label: "Internal Operations", desc: "Process optimization, resource allocation, inventory management, or workflow automation", risk: "minimal" },
  { id: "research", label: "Research & Development", desc: "Data analysis, experimentation, prototyping, or scientific research applications", risk: "minimal" },
];

// Data type options
export const dataTypeOptions = [
  { id: "biometric", label: "Biometric Data", desc: "Fingerprints, facial features, voice patterns, iris scans, or other unique biological identifiers", risk: "high" },
  { id: "health", label: "Health & Medical Data", desc: "Medical records, diagnoses, prescriptions, genetic information, or mental health data", risk: "high" },
  { id: "financial", label: "Financial Data", desc: "Bank accounts, credit scores, transaction history, income information, or debt records", risk: "high" },
  { id: "criminal", label: "Criminal & Legal Data", desc: "Criminal records, legal proceedings, court decisions, or law enforcement data", risk: "high" },
  { id: "children", label: "Children's Data", desc: "Any personal data relating to individuals under 18 years of age", risk: "high" },
  { id: "personal", label: "Personal Identifiable Info (PII)", desc: "Names, addresses, phone numbers, email addresses, government IDs, or social security numbers", risk: "medium" },
  { id: "behavioral", label: "Behavioral & Preference Data", desc: "Browsing history, purchase patterns, app usage, interests, or lifestyle preferences", risk: "medium" },
  { id: "location", label: "Location & Movement Data", desc: "GPS coordinates, IP-based location, travel patterns, or real-time tracking data", risk: "medium" },
  { id: "employment", label: "Employment Data", desc: "Work history, performance reviews, salary information, or professional qualifications", risk: "medium" },
  { id: "communication", label: "Communication Data", desc: "Emails, messages, call logs, or other communication content and metadata", risk: "medium" },
  { id: "public", label: "Publicly Available Data", desc: "Information from public records, social media profiles, or open datasets", risk: "low" },
  { id: "synthetic", label: "Synthetic & Anonymized Data", desc: "AI-generated data, properly anonymized datasets, or aggregated statistics", risk: "low" },
];

// Decision impact options
export const decisionImpactOptions = [
  { value: "critical", label: "Critical Impact", desc: "Decisions directly affect fundamental rights, safety, legal status, or access to essential services", badge: "Highest Risk" },
  { value: "high", label: "High Impact", desc: "Decisions significantly affect people's opportunities, finances, reputation, or quality of life", badge: "High Risk" },
  { value: "medium", label: "Moderate Impact", desc: "Decisions affect user experience or convenience, but individuals can easily seek alternatives", badge: null },
  { value: "low", label: "Low Impact", desc: "Decisions have minimal direct effect on individuals, primarily affecting internal operations", badge: null },
];

// Automation level options
export const automationLevelOptions = [
  { value: "fully-automated", label: "Fully Automated", desc: "AI makes and executes decisions autonomously without human review", badge: "Highest Risk" },
  { value: "automated-override", label: "Automated with Override", desc: "AI makes decisions automatically, but humans can review and override after the fact", badge: "High Risk" },
  { value: "human-in-loop", label: "Human-in-the-Loop", desc: "AI provides recommendations, but a human must approve before any decision is finalized", badge: null },
  { value: "human-on-loop", label: "Human-on-the-Loop", desc: "AI operates with continuous human monitoring and intervention capability", badge: null },
  { value: "advisory-only", label: "Advisory Only", desc: "AI provides information only. All decisions are made entirely by humans", badge: null },
  { value: "no-ai-decisions", label: "No AI Decisions", desc: "AI is not involved in any decision-making processes affecting individuals", badge: null },
];

// Existing compliance options (Step 7)
export const existingComplianceOptions = [
  { id: "iso-9001", label: "ISO 9001 (Quality Management)", desc: "Your organization is certified or working toward ISO 9001 quality management standards" },
  { id: "iso-27001", label: "ISO 27001 (Information Security)", desc: "Your organization follows ISO 27001 information security management practices" },
  { id: "iso-42001", label: "ISO/IEC 42001 (AI Management)", desc: "Your organization is certified or working toward the AI management system standard" },
  { id: "gdpr", label: "GDPR Compliance", desc: "You have documented GDPR compliance measures including DPO, DPIA, and data processing records" },
  { id: "soc2", label: "SOC 2 Compliance", desc: "Your organization has completed SOC 2 Type I or Type II certification" },
  { id: "nist-ai-rmf", label: "NIST AI RMF", desc: "You follow the NIST Artificial Intelligence Risk Management Framework" },
  { id: "none", label: "No existing compliance frameworks", desc: "Your organization has not yet implemented formal compliance frameworks" },
];

// AI Role options (Step 8)
export const aiRoleOptions = [
  { value: "provider", label: "AI Provider", desc: "You develop and make AI systems available on the market or put them into service under your name/trademark" },
  { value: "deployer", label: "AI Deployer", desc: "You use AI systems developed by third parties in your business operations" },
  { value: "both", label: "Both Provider & Deployer", desc: "You both develop your own AI systems and use third-party AI solutions" },
];

// Deployment environment options (Step 8)
export const deploymentEnvironmentOptions = [
  { value: "production", label: "Production (Live)", desc: "AI systems are actively used in production with real users and data", badge: "Active" },
  { value: "pilot", label: "Pilot / Limited Release", desc: "AI systems are being tested with a limited group of users before full deployment", badge: null },
  { value: "development", label: "Development / Testing", desc: "AI systems are still in development or internal testing phases", badge: null },
  { value: "planning", label: "Planning Stage", desc: "You are planning to implement AI systems but have not started development yet", badge: null },
];

// Industry options
export const industries = ["Technology", "Healthcare", "Finance", "Retail", "Manufacturing", "Education", "Legal", "Other"];

// Company size options
export const companySizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];

// Country options
export const countries = ["United States", "United Kingdom", "Germany", "France", "Netherlands", "Other EU", "Other Non-EU"];
