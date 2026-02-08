/**
 * Subscription Tier Configuration
 *
 * Single source of truth for all subscription tiers, limits, and features.
 *
 * Plan slugs (used in Stripe & database):
 *   free, starter, professional, business, enterprise
 *
 * Pricing (EUR):
 *   Free:         €0/mo
 *   Starter:      €99/mo  (€79/mo billed annually)
 *   Professional: €299/mo (€249/mo billed annually)
 *   Business:     €699/mo (€599/mo billed annually)
 *   Enterprise:   Custom  (from €1,500/mo)
 */

export type SubscriptionTier =
  | "free"
  | "starter"
  | "professional"
  | "business"
  | "enterprise";

export interface TierConfig {
  name: string;
  displayName: string;
  description: string;

  // Pricing (cents EUR)
  priceMonthly: number; // 0 = free, -1 = custom
  priceYearly: number; // 0 = free, -1 = custom

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
  sdkApiAccess: boolean;
  auditTrail: boolean;

  // Limits
  maxAISystems: number; // -1 = unlimited
  maxTeamMembers: number; // -1 = unlimited

  // Support
  supportLevel: "community" | "email" | "email_chat" | "priority" | "dedicated";
  prioritySupport: boolean;

  // Enterprise features
  sso: boolean;
}

/**
 * Full tier configuration with all limits and features.
 * This is the SINGLE SOURCE OF TRUTH for pricing and feature gating.
 */
export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, TierConfig> = {
  free: {
    name: "free",
    displayName: "Free",
    description: "Explore the platform with 1 AI system",

    priceMonthly: 0,
    priceYearly: 0,

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
    sdkApiAccess: false,
    auditTrail: false,

    maxAISystems: 1,
    maxTeamMembers: 1,

    supportLevel: "community",
    prioritySupport: false,
    sso: false,
  },

  starter: {
    name: "starter",
    displayName: "Starter",
    description: "For solo founders and early-stage startups",

    priceMonthly: 9900, // €99
    priceYearly: 94800, // €79/mo × 12 = €948

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
    sdkApiAccess: false,
    auditTrail: false,

    maxAISystems: 3,
    maxTeamMembers: 2,

    supportLevel: "email",
    prioritySupport: false,
    sso: false,
  },

  professional: {
    name: "professional",
    displayName: "Professional",
    description: "For growing companies with multiple AI systems",

    priceMonthly: 29900, // €299
    priceYearly: 298800, // €249/mo × 12 = €2,988

    quickComplySessionsPerMonth: 25,
    tokensPerMonth: 1_000_000,

    documentsPerMonth: -1, // unlimited
    documentTypes: "all",
    documentQuality: "standard",
    customBranding: false,
    coverPages: true,

    quickComplyAccess: true,
    resumeSessions: true,
    exportFormats: ["docx", "pdf"],
    complianceBadges: false,
    certificationSystem: false,
    sdkApiAccess: true,
    auditTrail: true,

    maxAISystems: 10,
    maxTeamMembers: 5,

    supportLevel: "email_chat",
    prioritySupport: false,
    sso: false,
  },

  business: {
    name: "business",
    displayName: "Business",
    description: "For organizations with extensive AI portfolios",

    priceMonthly: 69900, // €699
    priceYearly: 718800, // €599/mo × 12 = €7,188

    quickComplySessionsPerMonth: -1, // unlimited
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
    sdkApiAccess: true,
    auditTrail: true,

    maxAISystems: 30,
    maxTeamMembers: 15,

    supportLevel: "priority",
    prioritySupport: true,
    sso: false,
  },

  enterprise: {
    name: "enterprise",
    displayName: "Enterprise",
    description: "Unlimited compliance for large organizations",

    priceMonthly: -1, // Custom
    priceYearly: -1,

    quickComplySessionsPerMonth: -1,
    tokensPerMonth: -1,

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
    sdkApiAccess: true,
    auditTrail: true,

    maxAISystems: -1,
    maxTeamMembers: -1,

    supportLevel: "dedicated",
    prioritySupport: true,
    sso: true,
  },
};

/**
 * Maps Stripe plan slugs to subscription tiers.
 * Plan slugs now match tier names directly.
 *
 * Legacy mappings retained for backward compatibility with
 * any existing Stripe subscriptions:
 *   growth → professional
 *   scale  → business
 *   pro    → professional
 */
export const PLAN_TO_TIER_MAP: Record<string, SubscriptionTier> = {
  free: "free",
  starter: "starter",
  professional: "professional",
  business: "business",
  enterprise: "enterprise",
  // Legacy Stripe plan slugs (backward compat)
  growth: "professional",
  scale: "business",
  pro: "professional",
};

/**
 * Document types accessible at each tier level
 */
export const DOCUMENT_TYPE_ACCESS: Record<
  TierConfig["documentTypes"],
  string[]
> = {
  basic: [
    "technical",
    "risk",
    "policy",
    "model_card",
    "ai_disclosure_notice",
    "transparency_notice",
  ],
  standard: [
    // All basic types plus Phase 1 & 2 documents
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
    // All document types including Phase 3 & 4
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

/**
 * Helper: Get price display string for a tier
 */
export function getTierPriceDisplay(tier: SubscriptionTier): string {
  const config = SUBSCRIPTION_TIERS[tier];
  if (config.priceMonthly === 0) return "Free";
  if (config.priceMonthly === -1) return "Custom";
  return `€${config.priceMonthly / 100}/mo`;
}
