/**
 * Subscription Tier Configuration
 * 
 * Maps the existing Stripe billing plans to subscription tiers for
 * feature gating, token limits, and document access control.
 * 
 * Existing Stripe plans: free, professional, growth, scale, enterprise
 * Subscription tiers: free, starter, pro, enterprise
 * 
 * Mapping:
 *   free → free
 *   professional → starter
 *   growth → pro
 *   scale → pro (higher limits, same tier)
 *   enterprise → enterprise
 */

export type SubscriptionTier = "free" | "starter" | "pro" | "enterprise";

export interface TierConfig {
  name: string;
  displayName: string;
  description: string;
  
  // Quick Comply limits
  quickComplySessionsPerMonth: number; // -1 = unlimited
  tokensPerMonth: number; // AI token budget per month (-1 = unlimited)
  
  // Document generation limits
  documentsPerMonth: number; // -1 = unlimited
  documentTypes: "basic" | "standard" | "all";
  
  // Document quality
  documentQuality: "basic" | "standard" | "enterprise";
  customBranding: boolean;
  coverPages: boolean;
  
  // Feature access
  quickComplyAccess: boolean;
  resumeSessions: boolean;
  exportFormats: ("docx" | "pdf")[];
  complianceBadges: boolean;
  certificationSystem: boolean;
  
  // AI features  
  maxAISystems: number; // -1 = unlimited
  
  // Support
  prioritySupport: boolean;
}

/**
 * Full tier configuration with all limits and features
 */
export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, TierConfig> = {
  free: {
    name: "free",
    displayName: "Free",
    description: "Basic assessment and limited compliance tools",
    
    quickComplySessionsPerMonth: 1,
    tokensPerMonth: 50_000,
    
    documentsPerMonth: 2,
    documentTypes: "basic",
    documentQuality: "basic",
    customBranding: false,
    coverPages: false,
    
    quickComplyAccess: true,
    resumeSessions: false,
    exportFormats: ["docx"],
    complianceBadges: false,
    certificationSystem: false,
    
    maxAISystems: 1,
    prioritySupport: false,
  },
  
  starter: {
    name: "starter",
    displayName: "Starter",
    description: "Essential compliance for small teams",
    
    quickComplySessionsPerMonth: 5,
    tokensPerMonth: 200_000,
    
    documentsPerMonth: 10,
    documentTypes: "standard",
    documentQuality: "standard",
    customBranding: false,
    coverPages: true,
    
    quickComplyAccess: true,
    resumeSessions: true,
    exportFormats: ["docx", "pdf"],
    complianceBadges: false,
    certificationSystem: false,
    
    maxAISystems: 3,
    prioritySupport: false,
  },
  
  pro: {
    name: "pro",
    displayName: "Pro",
    description: "Full compliance suite for growing organizations",
    
    quickComplySessionsPerMonth: -1, // unlimited
    tokensPerMonth: 1_000_000,
    
    documentsPerMonth: -1,
    documentTypes: "all",
    documentQuality: "enterprise",
    customBranding: true,
    coverPages: true,
    
    quickComplyAccess: true,
    resumeSessions: true,
    exportFormats: ["docx", "pdf"],
    complianceBadges: true,
    certificationSystem: true,
    
    maxAISystems: 50,
    prioritySupport: true,
  },
  
  enterprise: {
    name: "enterprise",
    displayName: "Enterprise",
    description: "Unlimited compliance for large organizations",
    
    quickComplySessionsPerMonth: -1,
    tokensPerMonth: -1, // unlimited
    
    documentsPerMonth: -1,
    documentTypes: "all",
    documentQuality: "enterprise",
    customBranding: true,
    coverPages: true,
    
    quickComplyAccess: true,
    resumeSessions: true,
    exportFormats: ["docx", "pdf"],
    complianceBadges: true,
    certificationSystem: true,
    
    maxAISystems: -1,
    prioritySupport: true,
  },
};

/**
 * Maps Stripe plan slugs to subscription tiers.
 * Used when syncing billing state to subscription features.
 */
export const PLAN_TO_TIER_MAP: Record<string, SubscriptionTier> = {
  free: "free",
  professional: "starter",
  growth: "pro",
  scale: "pro",
  enterprise: "enterprise",
};

/**
 * Document types accessible at each tier level
 */
export const DOCUMENT_TYPE_ACCESS: Record<TierConfig["documentTypes"], string[]> = {
  basic: [
    "technical",
    "risk",
    "policy",
    "model_card",
    "ai_disclosure_notice",
    "transparency_notice",
  ],
  standard: [
    // Includes all basic types plus:
    "technical",
    "risk",
    "policy",
    "model_card",
    "ai_disclosure_notice",
    "transparency_notice",
    "testing_validation",
    "instructions_for_use",
    "human_oversight",
    "security_assessment",
    "risk_mitigation_plan",
    "training_data_doc",
    "bias_assessment",
    "ai_system_description",
    "logging_policy",
    "deployer_checklist",
    "fria",
    "incident_response_plan",
    "post_market_monitoring",
  ],
  all: [
    // All document types
    "technical",
    "risk",
    "policy",
    "model_card",
    "testing_validation",
    "instructions_for_use",
    "human_oversight",
    "security_assessment",
    "risk_mitigation_plan",
    "training_data_doc",
    "bias_assessment",
    "ai_system_description",
    "logging_policy",
    "deployer_checklist",
    "risk_management_policy",
    "design_development_spec",
    "audit_trail_samples",
    "log_retention_doc",
    "deployer_info_package",
    "user_notification_templates",
    "intervention_protocols",
    "operator_training_records",
    "accuracy_test_results",
    "robustness_testing_doc",
    "incident_reporting_procedures",
    "monitoring_log",
    "ai_disclosure_notice",
    "synthetic_content_policy",
    "qms",
    "post_market_monitoring",
    "incident_response_plan",
    "fria",
    "cybersecurity_assessment",
    "transparency_notice",
    "eu_db_registration",
    "ce_marking",
    "conformity_declaration",
    "change_management",
    "standards_mapping",
  ],
};
