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
  | "synthetic_content_policy"
  // Phase 4 - Missing EU AI Act Documents (PRD Part 5)
  | "qms"
  | "post_market_monitoring"
  | "incident_response_plan"
  | "fria"
  | "cybersecurity_assessment"
  | "transparency_notice"
  | "eu_db_registration"
  | "ce_marking"
  | "conformity_declaration"
  | "change_management"
  | "standards_mapping";

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
  /** Enterprise formatting quality level. Defaults to "basic" when omitted. */
  quality?: "basic" | "standard" | "enterprise";
  /** Organization name for cover page and headers */
  organizationName?: string;
  /** Who prepared the document */
  preparedBy?: string;
  /** Contact email for document control */
  contactEmail?: string;
  /** AI system name for cover page */
  aiSystemName?: string;
  /** Risk level for cover page badging */
  riskLevel?: string;
  /** Confidentiality classification */
  confidentiality?: "Public" | "Internal" | "Confidential" | "Strictly Confidential";
  /** EU AI Act article references */
  euAiActArticles?: string[];
  /** Certification number (enterprise only) */
  certificationNumber?: string;
  /** Custom primary brand color (enterprise only) */
  primaryColor?: string;
}
