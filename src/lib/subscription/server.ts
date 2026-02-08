/**
 * Server-side Subscription Utilities
 * 
 * Functions for checking and updating subscription state on the server.
 * Used in API routes and server components.
 */

import { createClient as createServerClient } from "@/lib/supabase/server";
import {
  type SubscriptionTier,
  resolveSubscriptionTier,
  getTierConfig,
  checkTokenLimit,
  checkDocumentLimit,
  checkSessionLimit,
  shouldResetTokens,
  getNextTokenResetDate,
  canGenerateDocumentType,
  buildSubscriptionContext,
} from "./index";

// ============================================
// Types
// ============================================

export interface SubscriptionState {
  tier: SubscriptionTier;
  organizationId: string;
  tokensUsedThisMonth: number;
  tokenResetDate: string | null;
  documentsGeneratedThisMonth: number;
  sessionsUsedThisMonth: number;
}

export interface SubscriptionCheckResult {
  allowed: boolean;
  tier: SubscriptionTier;
  reason?: string;
  state: SubscriptionState;
}

// ============================================
// Server Functions
// ============================================

/**
 * Gets the current subscription state for the authenticated user.
 * Handles token reset if needed.
 */
export async function getSubscriptionState(
  userId: string
): Promise<SubscriptionState | null> {
  const supabase = await createServerClient();
  
  // Get the user's organization
  const { data: profile } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", userId)
    .single();
  
  if (!profile?.organization_id) return null;
  
  // Get organization with subscription info
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;
  const { data: org } = await sb
    .from("organizations")
    .select("id, plan, subscription_tier, tokens_used_this_month, token_reset_date")
    .eq("id", profile.organization_id)
    .single();
  
  if (!org) return null;
  
  // Resolve tier from plan or explicit subscription_tier
  const tier = (org.subscription_tier as SubscriptionTier) ?? 
    resolveSubscriptionTier(org.plan as string);
  
  let tokensUsedThisMonth = (org.tokens_used_this_month as number) ?? 0;
  let tokenResetDate = org.token_reset_date as string | null;
  
  // Check if we need to reset tokens
  if (shouldResetTokens(tokenResetDate)) {
    const nextReset = getNextTokenResetDate();
    tokensUsedThisMonth = 0;
    
    // Update the database
    await sb
      .from("organizations")
      .update({
        tokens_used_this_month: 0,
        token_reset_date: nextReset.toISOString(),
      })
      .eq("id", org.id);
    
    tokenResetDate = nextReset.toISOString();
  }
  
  // Count documents generated this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const { count: docCount } = await sb
    .from("document_generation_log")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", org.id)
    .gte("created_at", startOfMonth.toISOString());
  
  // Count Quick Comply sessions this month
  const { count: sessionCount } = await sb
    .from("quick_comply_sessions")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", org.id)
    .gte("created_at", startOfMonth.toISOString());
  
  return {
    tier,
    organizationId: org.id,
    tokensUsedThisMonth,
    tokenResetDate,
    documentsGeneratedThisMonth: docCount ?? 0,
    sessionsUsedThisMonth: sessionCount ?? 0,
  };
}

/**
 * Checks if the user can start a new Quick Comply session.
 */
export async function checkQuickComplyAccess(
  userId: string
): Promise<SubscriptionCheckResult> {
  const state = await getSubscriptionState(userId);
  
  if (!state) {
    return {
      allowed: false,
      tier: "free",
      reason: "No organization found. Please complete your profile setup.",
      state: {
        tier: "free",
        organizationId: "",
        tokensUsedThisMonth: 0,
        tokenResetDate: null,
        documentsGeneratedThisMonth: 0,
        sessionsUsedThisMonth: 0,
      },
    };
  }
  
  const sessionCheck = checkSessionLimit(state.tier, state.sessionsUsedThisMonth);
  const tokenCheck = checkTokenLimit(state.tier, state.tokensUsedThisMonth);
  
  if (!sessionCheck.allowed) {
    return {
      allowed: false,
      tier: state.tier,
      reason: `You've used all ${sessionCheck.limit} Quick Comply sessions this month. Upgrade your plan for more sessions.`,
      state,
    };
  }
  
  if (!tokenCheck.allowed) {
    return {
      allowed: false,
      tier: state.tier,
      reason: "You've used your monthly AI token budget. Upgrade your plan for more AI-powered features.",
      state,
    };
  }
  
  return {
    allowed: true,
    tier: state.tier,
    state,
  };
}

/**
 * Checks if the user can generate a specific document type.
 */
export async function checkDocumentAccess(
  userId: string,
  documentType: string
): Promise<SubscriptionCheckResult> {
  const state = await getSubscriptionState(userId);
  
  if (!state) {
    return {
      allowed: false,
      tier: "free",
      reason: "No organization found.",
      state: {
        tier: "free",
        organizationId: "",
        tokensUsedThisMonth: 0,
        tokenResetDate: null,
        documentsGeneratedThisMonth: 0,
        sessionsUsedThisMonth: 0,
      },
    };
  }
  
  // Check document type access
  if (!canGenerateDocumentType(state.tier, documentType)) {
    return {
      allowed: false,
      tier: state.tier,
      reason: `The "${documentType}" document type is not available on your ${getTierConfig(state.tier).displayName} plan. Upgrade to access this document.`,
      state,
    };
  }
  
  // Check document generation limit
  const docCheck = checkDocumentLimit(state.tier, state.documentsGeneratedThisMonth);
  if (!docCheck.allowed) {
    return {
      allowed: false,
      tier: state.tier,
      reason: `You've reached your monthly document generation limit (${docCheck.limit}). Upgrade your plan for more documents.`,
      state,
    };
  }
  
  return {
    allowed: true,
    tier: state.tier,
    state,
  };
}

/**
 * Records token usage for an organization.
 * Call this after each AI API call.
 */
export async function recordTokenUsage(
  organizationId: string,
  tokensUsed: number
): Promise<void> {
  const supabase = await createServerClient();
  
  // Increment tokens_used_this_month using RPC or raw update
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sbAny = supabase as any;
  const { data: org } = await sbAny
    .from("organizations")
    .select("tokens_used_this_month")
    .eq("id", organizationId)
    .single();
  
  if (org) {
    await sbAny
      .from("organizations")
      .update({
        tokens_used_this_month: ((org.tokens_used_this_month as number) ?? 0) + tokensUsed,
      })
      .eq("id", organizationId);
  }
}

/**
 * Logs a document generation event.
 */
export async function logDocumentGeneration(
  organizationId: string,
  params: {
    userId?: string;
    aiSystemId?: string;
    documentId?: string;
    documentType: string;
    tokensInput?: number;
    tokensOutput?: number;
    modelUsed?: string;
    generationTimeMs?: number;
    status?: string;
  }
): Promise<void> {
  const supabase = await createServerClient();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("document_generation_log").insert({
    organization_id: organizationId,
    user_id: params.userId ?? null,
    ai_system_id: params.aiSystemId ?? null,
    document_id: params.documentId ?? null,
    document_type: params.documentType,
    tokens_input: params.tokensInput ?? null,
    tokens_output: params.tokensOutput ?? null,
    model_used: params.modelUsed ?? null,
    generation_time_ms: params.generationTimeMs ?? null,
    status: params.status ?? "completed",
  });
}

/**
 * Builds the subscription context for the Quick Comply system prompt.
 * This is the server-side version that fetches fresh data.
 */
export async function getQuickComplySubscriptionContext(userId: string) {
  const state = await getSubscriptionState(userId);
  
  if (!state) {
    return buildSubscriptionContext("free", 0, 0);
  }
  
  return buildSubscriptionContext(
    state.tier,
    state.tokensUsedThisMonth,
    state.documentsGeneratedThisMonth
  );
}
