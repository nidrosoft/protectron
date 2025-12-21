/**
 * Document Generator Types
 */

export type DocumentType = "technical" | "risk" | "policy" | "model_card";

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
