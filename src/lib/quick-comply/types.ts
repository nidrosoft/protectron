/**
 * Quick Comply - TypeScript Types
 *
 * Core types for the Quick Comply conversational compliance feature.
 * Used across API routes, tools, hooks, and UI components.
 */

import { z } from "zod";

// ============================================================================
// Section Definitions
// ============================================================================

export type SectionId =
  | "company_info"
  | "ai_system_details"
  | "risk_and_data"
  | "human_oversight"
  | "testing_metrics"
  | "transparency"
  | "review_generate";

export type SectionStatus = "not_started" | "in_progress" | "completed";

export interface Section {
  id: SectionId;
  name: string;
  description: string;
  icon: string;
  weight: number; // Percentage weight for overall progress
  estimatedMinutes: number;
  questionCount: number;
}

// ============================================================================
// Form Data Schemas (Zod for validation)
// ============================================================================

export const CompanyInfoSchema = z.object({
  company_name: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  company_size: z.string().nullable().optional(),
  contact_name: z.string().nullable().optional(),
  contact_email: z.string().nullable().optional(),
});

export const AISystemDetailsSchema = z.object({
  system_name: z.string().nullable().optional(),
  primary_purpose: z.string().nullable().optional(),
  purpose_category: z.string().nullable().optional(),
  detailed_description: z.string().nullable().optional(),
  technology_stack: z.array(z.string()).nullable().optional(),
  llm_provider: z.string().nullable().optional(),
  deployment_status: z.string().nullable().optional(),
  eu_exposure: z.boolean().nullable().optional(),
  eu_exposure_details: z.string().nullable().optional(),
  intended_users: z.array(z.string()).nullable().optional(),
});

export const RiskAndDataSchema = z.object({
  use_case_category: z.string().nullable().optional(),
  annex_reference: z.string().nullable().optional(),
  decision_scope: z.string().nullable().optional(),
  data_types: z.array(z.string()).optional().default([]),
  data_subjects: z.array(z.string()).optional().default([]),
  data_volume: z.string().nullable().optional(),
  data_retention: z.string().nullable().optional(),
  sensitive_data: z.boolean().optional().default(false),
  special_categories: z.array(z.string()).optional().default([]),
});

export const HumanOversightSchema = z.object({
  review_process: z.string().nullable().optional(),
  intervention_capability: z.string().nullable().optional(),
  escalation_procedures: z.string().nullable().optional(),
  override_mechanism: z.string().nullable().optional(),
  monitoring_frequency: z.string().nullable().optional(),
  human_in_loop: z.boolean().optional().default(false),
  oversight_documentation: z.string().nullable().optional(),
});

export const TestingMetricsSchema = z.object({
  accuracy_metrics: z.string().nullable().optional(),
  testing_methodology: z.string().nullable().optional(),
  validation_procedures: z.string().nullable().optional(),
  known_limitations: z.string().nullable().optional(),
  failure_modes: z.string().nullable().optional(),
  bias_testing: z.string().nullable().optional(),
  performance_benchmarks: z.string().nullable().optional(),
});

export const TransparencySchema = z.object({
  user_notification_method: z.string().nullable().optional(),
  ai_disclosure: z.string().nullable().optional(),
  limitations_communicated: z.boolean().nullable().optional(),
  feedback_mechanism: z.string().nullable().optional(),
  transparency_documentation: z.string().nullable().optional(),
});

// ============================================================================
// Complete Form Data
// ============================================================================

export interface QuickComplyFormData {
  company_info: z.infer<typeof CompanyInfoSchema>;
  ai_system_details: z.infer<typeof AISystemDetailsSchema>;
  risk_and_data: z.infer<typeof RiskAndDataSchema>;
  human_oversight: z.infer<typeof HumanOversightSchema>;
  testing_metrics: z.infer<typeof TestingMetricsSchema>;
  transparency: z.infer<typeof TransparencySchema>;
}

// ============================================================================
// Progress Types
// ============================================================================

export interface Progress {
  overall: number;
  sections: Record<
    SectionId,
    {
      status: SectionStatus;
      progress: number;
    }
  >;
  documentsReady: number;
  totalDocuments: number;
  estimatedTimeRemaining: number; // minutes
}

// ============================================================================
// Session Types
// ============================================================================

export interface QuickComplySession {
  id: string;
  organizationId: string;
  userId: string;
  aiSystemId: string | null;
  status: "active" | "completed" | "abandoned";
  currentSection: SectionId;
  progressPercentage: number;
  formData: QuickComplyFormData;
  sectionsCompleted: SectionId[];
  riskClassification: "prohibited" | "high" | "limited" | "minimal" | null;
  applicableArticles: string[];
  documentsGenerated: GeneratedDocument[];
  subscriptionTier: string;
  tokensUsed: number;
  startedAt: string;
  completedAt: string | null;
  lastActivityAt: string;
}

// ============================================================================
// Document Types
// ============================================================================

export interface GeneratedDocument {
  id: string;
  type: string;
  title: string;
  status: "pending" | "generating" | "ready" | "error";
  downloadUrl?: string;
  previewUrl?: string;
  generatedAt?: string;
}

// ============================================================================
// Tool Input / Output Types
// ============================================================================

export interface SelectionOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface ToolShowSelectionArgs {
  question: string;
  options: SelectionOption[];
  fieldKey: string;
  section: SectionId;
  allowOther?: boolean;
}

export interface ToolShowTextInputArgs {
  question: string;
  fieldKey: string;
  section: SectionId;
  placeholder?: string;
  multiline?: boolean;
  inputType?: "text" | "email" | "url";
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
  };
}

export interface ToolShowMultiSelectArgs {
  question: string;
  options: SelectionOption[];
  fieldKey: string;
  section: SectionId;
  minSelections?: number;
  maxSelections?: number;
}

export interface ToolDocumentPreviewArgs {
  documentType: string;
  documentTitle: string;
  sections: {
    title: string;
    content: string;
  }[];
}

export interface ToolProgressUpdateArgs {
  section: SectionId;
  status: SectionStatus;
  percentComplete: number;
}

export interface ToolCaptureResponseResult {
  saved: boolean;
  fieldKey: string;
  section: string;
  formDataId?: string;
  error?: string;
}

export interface ToolCreateAISystemResult {
  created: boolean;
  aiSystemId?: string;
  aiSystemName?: string;
  formDataId?: string;
  error?: string;
}

export interface ToolGenerateDocumentsResult {
  generated: boolean;
  documents?: GeneratedDocument[];
  message?: string;
  error?: string;
}

// ============================================================================
// API Types
// ============================================================================

export interface QuickComplySystemData {
  sessionId: string;
  aiSystemId?: string;
  organizationId: string;
  userId: string;
  formData: Partial<QuickComplyFormData>;
  progress: Progress;
  riskLevel?: "prohibited" | "high" | "limited" | "minimal";
  currentSection: SectionId;
  sectionsCompleted: SectionId[];
  subscriptionTier: string;
  isNewSession: boolean;
  isResuming: boolean;
}
