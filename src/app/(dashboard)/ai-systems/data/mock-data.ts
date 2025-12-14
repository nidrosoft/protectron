import { Warning2, TickCircle, Clock, InfoCircle } from "iconsax-react";
import type { SelectItemType } from "@/components/base/select/select";

// Risk filter options
export const riskFilterOptions: SelectItemType[] = [
  { id: "all", label: "All Risk Levels" },
  { id: "high", label: "High-Risk" },
  { id: "limited", label: "Limited Risk" },
  { id: "minimal", label: "Minimal Risk" },
];

// Status filter options
export const statusFilterOptions: SelectItemType[] = [
  { id: "all", label: "All Statuses" },
  { id: "compliant", label: "Compliant" },
  { id: "in_progress", label: "In Progress" },
  { id: "not_started", label: "Not Started" },
];

// Mock AI Systems data (12 systems)
export const mockAISystems = [
  {
    id: "system-01",
    name: "Customer Support Chatbot",
    riskLevel: "limited" as const,
    provider: "OpenAI GPT-4",
    status: "compliant" as const,
    requirementsComplete: 8,
    requirementsTotal: 8,
    documentsGenerated: 3,
    deadline: null,
  },
  {
    id: "system-02",
    name: "Automated Hiring Screener",
    riskLevel: "high" as const,
    provider: "Custom ML Model",
    status: "in_progress" as const,
    requirementsComplete: 12,
    requirementsTotal: 24,
    documentsGenerated: 5,
    deadline: "Aug 2, 2026",
    daysRemaining: 267,
  },
  {
    id: "system-03",
    name: "Fraud Detection System",
    riskLevel: "high" as const,
    provider: "TensorFlow Custom",
    status: "in_progress" as const,
    requirementsComplete: 18,
    requirementsTotal: 24,
    documentsGenerated: 7,
    deadline: "Aug 2, 2026",
    daysRemaining: 267,
  },
  {
    id: "system-04",
    name: "Content Recommender",
    riskLevel: "minimal" as const,
    provider: "AWS Personalize",
    status: "compliant" as const,
    requirementsComplete: 4,
    requirementsTotal: 4,
    documentsGenerated: 2,
    deadline: null,
  },
  {
    id: "system-05",
    name: "Lead Scoring Model",
    riskLevel: "limited" as const,
    provider: "Salesforce Einstein",
    status: "not_started" as const,
    requirementsComplete: 0,
    requirementsTotal: 8,
    documentsGenerated: 0,
    deadline: null,
  },
  {
    id: "system-06",
    name: "Medical Diagnosis Assistant",
    riskLevel: "high" as const,
    provider: "Google Cloud AI",
    status: "in_progress" as const,
    requirementsComplete: 20,
    requirementsTotal: 30,
    documentsGenerated: 8,
    deadline: "Aug 2, 2026",
    daysRemaining: 267,
  },
  {
    id: "system-07",
    name: "Credit Risk Analyzer",
    riskLevel: "high" as const,
    provider: "IBM Watson",
    status: "compliant" as const,
    requirementsComplete: 24,
    requirementsTotal: 24,
    documentsGenerated: 10,
    deadline: null,
  },
  {
    id: "system-08",
    name: "Email Spam Filter",
    riskLevel: "minimal" as const,
    provider: "Microsoft Azure",
    status: "compliant" as const,
    requirementsComplete: 4,
    requirementsTotal: 4,
    documentsGenerated: 1,
    deadline: null,
  },
  {
    id: "system-09",
    name: "Product Recommendation Engine",
    riskLevel: "limited" as const,
    provider: "Amazon SageMaker",
    status: "in_progress" as const,
    requirementsComplete: 5,
    requirementsTotal: 8,
    documentsGenerated: 2,
    deadline: null,
  },
  {
    id: "system-10",
    name: "Voice Authentication System",
    riskLevel: "high" as const,
    provider: "Nuance AI",
    status: "not_started" as const,
    requirementsComplete: 0,
    requirementsTotal: 24,
    documentsGenerated: 0,
    deadline: "Aug 2, 2026",
    daysRemaining: 267,
  },
  {
    id: "system-11",
    name: "Sentiment Analysis Tool",
    riskLevel: "minimal" as const,
    provider: "Hugging Face",
    status: "compliant" as const,
    requirementsComplete: 4,
    requirementsTotal: 4,
    documentsGenerated: 2,
    deadline: null,
  },
  {
    id: "system-12",
    name: "Document Classification AI",
    riskLevel: "limited" as const,
    provider: "OpenAI GPT-4",
    status: "in_progress" as const,
    requirementsComplete: 6,
    requirementsTotal: 8,
    documentsGenerated: 3,
    deadline: null,
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

export type RiskFilter = "all" | "high" | "limited" | "minimal";
export type StatusFilter = "all" | "compliant" | "in_progress" | "not_started";
export type AISystem = typeof mockAISystems[number];
