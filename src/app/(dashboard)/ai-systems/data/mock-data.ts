import { Warning2, TickCircle, Clock, InfoCircle, Cpu, MessageText, Box1, Judge } from "iconsax-react";
import type { SelectItemType } from "@/components/base/select/select";

// System type options
export const systemTypeOptions: SelectItemType[] = [
  { id: "all", label: "All Types" },
  { id: "ai_agent", label: "AI Agent" },
  { id: "llm_application", label: "LLM Application" },
  { id: "ml_model", label: "ML Model" },
  { id: "automated_decision", label: "Automated Decision" },
  { id: "other", label: "Other" },
];

// Risk filter options
export const riskFilterOptions: SelectItemType[] = [
  { id: "all", label: "All Risk Levels" },
  { id: "high", label: "High-Risk" },
  { id: "limited", label: "Limited Risk" },
  { id: "minimal", label: "Minimal Risk" },
];

// Compliance status filter options
export const statusFilterOptions: SelectItemType[] = [
  { id: "all", label: "All Statuses" },
  { id: "compliant", label: "Compliant" },
  { id: "in_progress", label: "In Progress" },
  { id: "not_started", label: "Not Started" },
];

// Lifecycle status filter options (for agents)
export const lifecycleStatusOptions: SelectItemType[] = [
  { id: "all", label: "All Lifecycle" },
  { id: "draft", label: "Draft" },
  { id: "active", label: "Active" },
  { id: "paused", label: "Paused" },
  { id: "archived", label: "Archived" },
];

// SDK status filter options
export const sdkStatusOptions: SelectItemType[] = [
  { id: "all", label: "All SDK Status" },
  { id: "connected", label: "Connected" },
  { id: "disconnected", label: "Disconnected" },
  { id: "not_applicable", label: "N/A" },
];

// Mock AI Systems data (12 systems with new agent fields)
export const mockAISystems = [
  {
    id: "system-01",
    name: "Customer Support Chatbot",
    type: "llm_application" as const,
    riskLevel: "limited" as const,
    provider: "OpenAI GPT-4",
    status: "compliant" as const,
    lifecycleStatus: "active" as const,
    sdkStatus: "not_applicable" as const,
    requirementsComplete: 8,
    requirementsTotal: 8,
    documentsGenerated: 3,
    deadline: null,
    lastActivity: "2 hours ago",
  },
  {
    id: "system-02",
    name: "Automated Hiring Screener",
    type: "automated_decision" as const,
    riskLevel: "high" as const,
    provider: "Custom ML Model",
    status: "in_progress" as const,
    lifecycleStatus: "active" as const,
    sdkStatus: "not_applicable" as const,
    requirementsComplete: 12,
    requirementsTotal: 24,
    documentsGenerated: 5,
    deadline: "Aug 2, 2026",
    daysRemaining: 267,
    lastActivity: "1 day ago",
  },
  {
    id: "system-03",
    name: "Fraud Detection System",
    type: "ml_model" as const,
    riskLevel: "high" as const,
    provider: "TensorFlow Custom",
    status: "in_progress" as const,
    lifecycleStatus: "active" as const,
    sdkStatus: "not_applicable" as const,
    requirementsComplete: 18,
    requirementsTotal: 24,
    documentsGenerated: 7,
    deadline: "Aug 2, 2026",
    daysRemaining: 267,
    lastActivity: "3 hours ago",
  },
  {
    id: "system-04",
    name: "Content Recommender",
    type: "ml_model" as const,
    riskLevel: "minimal" as const,
    provider: "AWS Personalize",
    status: "compliant" as const,
    lifecycleStatus: "active" as const,
    sdkStatus: "not_applicable" as const,
    requirementsComplete: 4,
    requirementsTotal: 4,
    documentsGenerated: 2,
    deadline: null,
    lastActivity: "5 hours ago",
  },
  {
    id: "system-05",
    name: "Lead Scoring Model",
    type: "ml_model" as const,
    riskLevel: "limited" as const,
    provider: "Salesforce Einstein",
    status: "not_started" as const,
    lifecycleStatus: "draft" as const,
    sdkStatus: "not_applicable" as const,
    requirementsComplete: 0,
    requirementsTotal: 8,
    documentsGenerated: 0,
    deadline: null,
    lastActivity: "1 week ago",
  },
  {
    id: "system-06",
    name: "Medical Diagnosis Assistant",
    type: "ai_agent" as const,
    riskLevel: "high" as const,
    provider: "Google Cloud AI",
    agentFramework: "langchain" as const,
    status: "in_progress" as const,
    lifecycleStatus: "active" as const,
    sdkStatus: "connected" as const,
    requirementsComplete: 20,
    requirementsTotal: 30,
    documentsGenerated: 8,
    deadline: "Aug 2, 2026",
    daysRemaining: 267,
    lastActivity: "3 minutes ago",
    eventsLogged: 12847,
  },
  {
    id: "system-07",
    name: "Credit Risk Analyzer",
    type: "automated_decision" as const,
    riskLevel: "high" as const,
    provider: "IBM Watson",
    status: "compliant" as const,
    lifecycleStatus: "active" as const,
    sdkStatus: "not_applicable" as const,
    requirementsComplete: 24,
    requirementsTotal: 24,
    documentsGenerated: 10,
    deadline: null,
    lastActivity: "30 minutes ago",
  },
  {
    id: "system-08",
    name: "Email Spam Filter",
    type: "ml_model" as const,
    riskLevel: "minimal" as const,
    provider: "Microsoft Azure",
    status: "compliant" as const,
    lifecycleStatus: "active" as const,
    sdkStatus: "not_applicable" as const,
    requirementsComplete: 4,
    requirementsTotal: 4,
    documentsGenerated: 1,
    deadline: null,
    lastActivity: "1 hour ago",
  },
  {
    id: "system-09",
    name: "Product Recommendation Engine",
    type: "llm_application" as const,
    riskLevel: "limited" as const,
    provider: "Amazon SageMaker",
    status: "in_progress" as const,
    lifecycleStatus: "active" as const,
    sdkStatus: "not_applicable" as const,
    requirementsComplete: 5,
    requirementsTotal: 8,
    documentsGenerated: 2,
    deadline: null,
    lastActivity: "4 hours ago",
  },
  {
    id: "system-10",
    name: "Voice Authentication System",
    type: "ml_model" as const,
    riskLevel: "high" as const,
    provider: "Nuance AI",
    status: "not_started" as const,
    lifecycleStatus: "draft" as const,
    sdkStatus: "not_applicable" as const,
    requirementsComplete: 0,
    requirementsTotal: 24,
    documentsGenerated: 0,
    deadline: "Aug 2, 2026",
    daysRemaining: 267,
    lastActivity: "2 weeks ago",
  },
  {
    id: "system-11",
    name: "Sentiment Analysis Tool",
    type: "llm_application" as const,
    riskLevel: "minimal" as const,
    provider: "Hugging Face",
    status: "compliant" as const,
    lifecycleStatus: "active" as const,
    sdkStatus: "not_applicable" as const,
    requirementsComplete: 4,
    requirementsTotal: 4,
    documentsGenerated: 2,
    deadline: null,
    lastActivity: "6 hours ago",
  },
  {
    id: "system-12",
    name: "Document Classification AI",
    type: "llm_application" as const,
    riskLevel: "limited" as const,
    provider: "OpenAI GPT-4",
    status: "in_progress" as const,
    lifecycleStatus: "active" as const,
    sdkStatus: "not_applicable" as const,
    requirementsComplete: 6,
    requirementsTotal: 8,
    documentsGenerated: 3,
    deadline: null,
    lastActivity: "2 hours ago",
  },
  {
    id: "system-13",
    name: "Customer Service Agent",
    type: "ai_agent" as const,
    riskLevel: "high" as const,
    provider: "OpenAI GPT-4",
    agentFramework: "langchain" as const,
    status: "in_progress" as const,
    lifecycleStatus: "active" as const,
    sdkStatus: "connected" as const,
    requirementsComplete: 71,
    requirementsTotal: 91,
    documentsGenerated: 12,
    deadline: "Aug 2, 2026",
    daysRemaining: 267,
    lastActivity: "1 minute ago",
    eventsLogged: 28493,
  },
  {
    id: "system-14",
    name: "Data Analysis Agent",
    type: "ai_agent" as const,
    riskLevel: "limited" as const,
    provider: "Anthropic Claude",
    agentFramework: "crewai" as const,
    status: "in_progress" as const,
    lifecycleStatus: "paused" as const,
    sdkStatus: "disconnected" as const,
    requirementsComplete: 5,
    requirementsTotal: 8,
    documentsGenerated: 2,
    deadline: null,
    lastActivity: "2 days ago",
    eventsLogged: 4521,
  },
  {
    id: "system-15",
    name: "Research Assistant Agent",
    type: "ai_agent" as const,
    riskLevel: "limited" as const,
    provider: "OpenAI GPT-4",
    agentFramework: "autogen" as const,
    status: "not_started" as const,
    lifecycleStatus: "draft" as const,
    sdkStatus: "disconnected" as const,
    requirementsComplete: 0,
    requirementsTotal: 8,
    documentsGenerated: 0,
    deadline: null,
    lastActivity: "Never",
    eventsLogged: 0,
  },
];

export const riskLevelConfig = {
  high: { label: "High-Risk", color: "warning" as const, icon: Warning2 },
  limited: { label: "Limited Risk", color: "blue" as const, icon: InfoCircle },
  minimal: { label: "Minimal Risk", color: "success" as const, icon: TickCircle },
};

export const statusConfig = {
  compliant: { label: "Compliant", color: "success" as const, icon: TickCircle },
  in_progress: { label: "In Progress", color: "warning" as const, icon: Clock },
  not_started: { label: "Not Started", color: "gray" as const, icon: Clock },
};

export const systemTypeConfig = {
  ai_agent: { label: "AI Agent", shortLabel: "Agent", icon: Cpu, color: "brand" as const },
  llm_application: { label: "LLM Application", shortLabel: "LLM App", icon: MessageText, color: "purple" as const },
  ml_model: { label: "ML Model", shortLabel: "ML Model", icon: Box1, color: "blue" as const },
  automated_decision: { label: "Automated Decision", shortLabel: "Auto Decision", icon: Judge, color: "warning" as const },
  other: { label: "Other", shortLabel: "Other", icon: Box1, color: "gray" as const },
};

export const lifecycleStatusConfig = {
  draft: { label: "Draft", color: "gray" as const, dotColor: "bg-gray-400" },
  active: { label: "Active", color: "success" as const, dotColor: "bg-success-500" },
  paused: { label: "Paused", color: "warning" as const, dotColor: "bg-warning-500" },
  archived: { label: "Archived", color: "gray" as const, dotColor: "bg-gray-400" },
};

export const sdkStatusConfig = {
  connected: { label: "Connected", color: "success" as const, dotColor: "bg-success-500" },
  disconnected: { label: "Disconnected", color: "error" as const, dotColor: "bg-error-500" },
  not_applicable: { label: "N/A", color: "gray" as const, dotColor: "bg-gray-400" },
};

export const agentFrameworkConfig = {
  langchain: { label: "LangChain" },
  crewai: { label: "CrewAI" },
  autogen: { label: "AutoGen" },
  openai_assistants: { label: "OpenAI Assistants" },
  aws_bedrock: { label: "AWS Bedrock" },
  google_adk: { label: "Google ADK" },
  custom: { label: "Custom" },
};

export type SystemType = "ai_agent" | "llm_application" | "ml_model" | "automated_decision" | "other";
export type LifecycleStatus = "draft" | "active" | "paused" | "archived";
export type SdkStatus = "connected" | "disconnected" | "not_applicable";
export type AgentFramework = "langchain" | "crewai" | "autogen" | "openai_assistants" | "aws_bedrock" | "google_adk" | "custom";
export type RiskFilter = "all" | "high" | "limited" | "minimal";
export type StatusFilter = "all" | "compliant" | "in_progress" | "not_started";
export type TypeFilter = "all" | SystemType;
export type AISystem = typeof mockAISystems[number];
