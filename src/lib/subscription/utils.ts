/**
 * Subscription Utility Functions
 * 
 * Helper functions for checking subscription permissions,
 * token usage, and document access control.
 */

import {
  type SubscriptionTier,
  type TierConfig,
  SUBSCRIPTION_TIERS,
  PLAN_TO_TIER_MAP,
  DOCUMENT_TYPE_ACCESS,
} from "./config";

// ============================================
// Tier Resolution
// ============================================

/**
 * Resolves a Stripe plan slug to a subscription tier.
 * Falls back to "free" if the plan is unknown.
 */
export function resolveSubscriptionTier(planSlug: string | null | undefined): SubscriptionTier {
  if (!planSlug) return "free";
  return PLAN_TO_TIER_MAP[planSlug] ?? "free";
}

/**
 * Gets the full tier configuration for a given tier name.
 */
export function getTierConfig(tier: SubscriptionTier): TierConfig {
  return SUBSCRIPTION_TIERS[tier];
}

/**
 * Gets the tier config from a Stripe plan slug.
 */
export function getTierConfigFromPlan(planSlug: string | null | undefined): TierConfig {
  const tier = resolveSubscriptionTier(planSlug);
  return SUBSCRIPTION_TIERS[tier];
}

// ============================================
// Feature Access Checks
// ============================================

/**
 * Checks if a user can access Quick Comply.
 */
export function canAccessQuickComply(tier: SubscriptionTier): boolean {
  return SUBSCRIPTION_TIERS[tier].quickComplyAccess;
}

/**
 * Checks if a user can resume previous Quick Comply sessions.
 */
export function canResumeSessions(tier: SubscriptionTier): boolean {
  return SUBSCRIPTION_TIERS[tier].resumeSessions;
}

/**
 * Checks if a user can generate a specific document type.
 */
export function canGenerateDocumentType(tier: SubscriptionTier, documentType: string): boolean {
  const config = SUBSCRIPTION_TIERS[tier];
  const allowedTypes = DOCUMENT_TYPE_ACCESS[config.documentTypes];
  return allowedTypes.includes(documentType);
}

/**
 * Gets all document types accessible for a given tier.
 */
export function getAccessibleDocumentTypes(tier: SubscriptionTier): string[] {
  const config = SUBSCRIPTION_TIERS[tier];
  return DOCUMENT_TYPE_ACCESS[config.documentTypes];
}

/**
 * Checks if a user can access compliance badges.
 */
export function canAccessBadges(tier: SubscriptionTier): boolean {
  return SUBSCRIPTION_TIERS[tier].complianceBadges;
}

/**
 * Checks if a user can access the certification system.
 */
export function canAccessCertification(tier: SubscriptionTier): boolean {
  return SUBSCRIPTION_TIERS[tier].certificationSystem;
}

/**
 * Checks if custom branding is available.
 */
export function canUseCustomBranding(tier: SubscriptionTier): boolean {
  return SUBSCRIPTION_TIERS[tier].customBranding;
}

/**
 * Gets the available export formats for a tier.
 */
export function getExportFormats(tier: SubscriptionTier): ("docx" | "pdf")[] {
  return SUBSCRIPTION_TIERS[tier].exportFormats;
}

// ============================================
// Limit Checks
// ============================================

/**
 * Checks if a user has remaining Quick Comply sessions this month.
 * Returns { allowed: boolean, remaining: number, limit: number }
 */
export function checkSessionLimit(
  tier: SubscriptionTier,
  sessionsUsedThisMonth: number
): { allowed: boolean; remaining: number; limit: number } {
  const config = SUBSCRIPTION_TIERS[tier];
  const limit = config.quickComplySessionsPerMonth;
  
  if (limit === -1) {
    return { allowed: true, remaining: -1, limit: -1 };
  }
  
  const remaining = Math.max(0, limit - sessionsUsedThisMonth);
  return {
    allowed: remaining > 0,
    remaining,
    limit,
  };
}

/**
 * Checks if a user has remaining tokens this month.
 * Returns { allowed: boolean, remaining: number, limit: number, percentUsed: number }
 */
export function checkTokenLimit(
  tier: SubscriptionTier,
  tokensUsedThisMonth: number
): { allowed: boolean; remaining: number; limit: number; percentUsed: number } {
  const config = SUBSCRIPTION_TIERS[tier];
  const limit = config.tokensPerMonth;
  
  if (limit === -1) {
    return { allowed: true, remaining: -1, limit: -1, percentUsed: 0 };
  }
  
  const remaining = Math.max(0, limit - tokensUsedThisMonth);
  const percentUsed = Math.round((tokensUsedThisMonth / limit) * 100);
  
  return {
    allowed: remaining > 0,
    remaining,
    limit,
    percentUsed: Math.min(100, percentUsed),
  };
}

/**
 * Checks if a user has remaining document generations this month.
 */
export function checkDocumentLimit(
  tier: SubscriptionTier,
  documentsGeneratedThisMonth: number
): { allowed: boolean; remaining: number; limit: number } {
  const config = SUBSCRIPTION_TIERS[tier];
  const limit = config.documentsPerMonth;
  
  if (limit === -1) {
    return { allowed: true, remaining: -1, limit: -1 };
  }
  
  const remaining = Math.max(0, limit - documentsGeneratedThisMonth);
  return {
    allowed: remaining > 0,
    remaining,
    limit,
  };
}

/**
 * Checks if a user can add more AI systems.
 */
export function checkAISystemLimit(
  tier: SubscriptionTier,
  currentAISystemCount: number
): { allowed: boolean; remaining: number; limit: number } {
  const config = SUBSCRIPTION_TIERS[tier];
  const limit = config.maxAISystems;
  
  if (limit === -1) {
    return { allowed: true, remaining: -1, limit: -1 };
  }
  
  const remaining = Math.max(0, limit - currentAISystemCount);
  return {
    allowed: remaining > 0,
    remaining,
    limit,
  };
}

// ============================================
// Token Tracking
// ============================================

/**
 * Calculates whether a token reset is needed based on the reset date.
 * Returns true if the current date is past the reset date.
 */
export function shouldResetTokens(tokenResetDate: string | null | undefined): boolean {
  if (!tokenResetDate) return true;
  return new Date() >= new Date(tokenResetDate);
}

/**
 * Calculates the next token reset date (first day of next month).
 */
export function getNextTokenResetDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

// ============================================
// Upgrade Prompts
// ============================================

/**
 * Gets the upgrade message for a specific limit that was hit.
 */
export function getUpgradeMessage(
  currentTier: SubscriptionTier,
  limitType: "sessions" | "tokens" | "documents" | "documentType" | "feature"
): { title: string; message: string; upgradeTo: SubscriptionTier | null } {
  const nextTier = getNextTier(currentTier);
  
  const messages: Record<string, { title: string; message: string }> = {
    sessions: {
      title: "Session limit reached",
      message: `You've used all your Quick Comply sessions this month. Upgrade to ${nextTier ? SUBSCRIPTION_TIERS[nextTier].displayName : "a higher plan"} for more sessions.`,
    },
    tokens: {
      title: "Token limit reached",
      message: `You've used your monthly AI token budget. Upgrade to ${nextTier ? SUBSCRIPTION_TIERS[nextTier].displayName : "a higher plan"} for more AI-powered features.`,
    },
    documents: {
      title: "Document limit reached",
      message: `You've reached your monthly document generation limit. Upgrade to ${nextTier ? SUBSCRIPTION_TIERS[nextTier].displayName : "a higher plan"} for more documents.`,
    },
    documentType: {
      title: "Document type not available",
      message: `This document type requires a ${nextTier ? SUBSCRIPTION_TIERS[nextTier].displayName : "higher"} plan. Upgrade to access all EU AI Act document templates.`,
    },
    feature: {
      title: "Feature not available",
      message: `This feature requires a ${nextTier ? SUBSCRIPTION_TIERS[nextTier].displayName : "higher"} plan. Upgrade to unlock all compliance tools.`,
    },
  };
  
  return {
    ...messages[limitType],
    upgradeTo: nextTier,
  };
}

/**
 * Gets the next tier above the current one.
 */
function getNextTier(currentTier: SubscriptionTier): SubscriptionTier | null {
  const tierOrder: SubscriptionTier[] = ["free", "starter", "pro", "enterprise"];
  const currentIndex = tierOrder.indexOf(currentTier);
  if (currentIndex === -1 || currentIndex >= tierOrder.length - 1) return null;
  return tierOrder[currentIndex + 1];
}

/**
 * Builds a subscription context object for the Quick Comply system prompt.
 * This tells the AI what the user's limits are so it can adapt behavior.
 */
export function buildSubscriptionContext(
  tier: SubscriptionTier,
  tokensUsed: number,
  documentsGenerated: number
): {
  tier: SubscriptionTier;
  tierDisplayName: string;
  tokenBudget: { limit: number; used: number; remaining: number };
  documentBudget: { limit: number; used: number; remaining: number };
  accessibleDocumentTypes: string[];
  features: {
    customBranding: boolean;
    coverPages: boolean;
    badges: boolean;
    certification: boolean;
    resumeSessions: boolean;
    exportFormats: string[];
  };
} {
  const config = SUBSCRIPTION_TIERS[tier];
  const tokenCheck = checkTokenLimit(tier, tokensUsed);
  const docCheck = checkDocumentLimit(tier, documentsGenerated);
  
  return {
    tier,
    tierDisplayName: config.displayName,
    tokenBudget: {
      limit: tokenCheck.limit,
      used: tokensUsed,
      remaining: tokenCheck.remaining,
    },
    documentBudget: {
      limit: docCheck.limit,
      used: documentsGenerated,
      remaining: docCheck.remaining,
    },
    accessibleDocumentTypes: getAccessibleDocumentTypes(tier),
    features: {
      customBranding: config.customBranding,
      coverPages: config.coverPages,
      badges: config.complianceBadges,
      certification: config.certificationSystem,
      resumeSessions: config.resumeSessions,
      exportFormats: config.exportFormats,
    },
  };
}
