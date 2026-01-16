/**
 * Document Generator Types
 */

export type DocumentType = 
  | "technical" 
  | "risk" 
  | "policy" 
  | "model_card"
  // Phase 1 - High Priority
  | "testing_validation"
  | "instructions_for_use"
  | "human_oversight"
  | "security_assessment"
  // Phase 2 - Medium Priority
  | "risk_mitigation_plan"
  | "training_data_doc"
  | "bias_assessment"
  | "ai_system_description"
  | "logging_policy"
  | "deployer_checklist"
  // Phase 3 - Lower Priority
  | "risk_management_policy"
  | "design_development_spec"
  | "audit_trail_samples"
  | "log_retention_doc"
  | "deployer_info_package"
  | "user_notification_templates"
  | "intervention_protocols"
  | "operator_training_records"
  | "accuracy_test_results"
  | "robustness_testing_doc"
  | "incident_reporting_procedures"
  | "monitoring_log"
  | "ai_disclosure_notice"
  | "synthetic_content_policy";

export interface DocumentMetadata {
  title: string;
  subtitle?: string;
  version?: string;
  date?: string;
  preparedBy?: string;
  companyName?: string;
  confidential?: boolean;
}

export interface AISystemInfo {
  id: string;
  name: string;
  description?: string;
  riskLevel?: string;
  status?: string;
  purpose?: string;
  dataProcessed?: string;
  intendedUsers?: string;
  decisionMaking?: string;
}

export interface TechnicalDocumentData {
  type: "technical";
  metadata: DocumentMetadata;
  aiSystem: AISystemInfo;
  answers: {
    purpose?: string;
    data?: string;
    decisions?: string;
    users?: string;
  };
}

export interface RiskAssessmentData {
  type: "risk";
  metadata: DocumentMetadata;
  aiSystem: AISystemInfo;
  answers: {
    risks?: string;
    mitigation?: string;
    monitoring?: string;
  };
}

export interface DataGovernancePolicyData {
  type: "policy";
  metadata: DocumentMetadata;
  aiSystem?: AISystemInfo;
  answers: {
    dataSources?: string;
    quality?: string;
    bias?: string;
  };
}

export interface ModelCardData {
  type: "model_card";
  metadata: DocumentMetadata;
  aiSystem: AISystemInfo;
  answers: {
    capabilities?: string;
    limitations?: string;
    performance?: string;
  };
}

export type DocumentData = 
  | TechnicalDocumentData 
  | RiskAssessmentData 
  | DataGovernancePolicyData 
  | ModelCardData;

export interface GenerateDocumentOptions {
  format: "docx" | "pdf";
  download?: boolean;
}
