"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  type SubscriptionTier,
  type TierConfig,
  SUBSCRIPTION_TIERS,
  resolveSubscriptionTier,
  checkTokenLimit,
  checkDocumentLimit,
  checkSessionLimit,
  canGenerateDocumentType,
  canAccessBadges,
  canAccessCertification,
  canUseCustomBranding,
  getAccessibleDocumentTypes,
  getUpgradeMessage,
  shouldResetTokens,
} from "@/lib/subscription";

interface SubscriptionData {
  tier: SubscriptionTier;
  config: TierConfig;
  organizationId: string | null;
  
  // Usage
  tokensUsedThisMonth: number;
  documentsGeneratedThisMonth: number;
  sessionsUsedThisMonth: number;
  
  // Computed checks
  tokenBudget: { allowed: boolean; remaining: number; limit: number; percentUsed: number };
  documentBudget: { allowed: boolean; remaining: number; limit: number };
  sessionBudget: { allowed: boolean; remaining: number; limit: number };
}

interface UseSubscriptionReturn {
  subscription: SubscriptionData | null;
  isLoading: boolean;
  error: string | null;
  
  // Quick access methods
  canGenerate: (documentType: string) => boolean;
  canStartSession: () => boolean;
  hasBadges: () => boolean;
  hasCertification: () => boolean;
  hasCustomBranding: () => boolean;
  getAccessibleDocs: () => string[];
  getUpgrade: (limitType: "sessions" | "tokens" | "documents" | "documentType" | "feature") => {
    title: string;
    message: string;
    upgradeTo: SubscriptionTier | null;
  };
  
  refetch: () => Promise<void>;
}

export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setSubscription(null);
        return;
      }
      
      // Get profile and organization
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();
      
      if (!profile?.organization_id) {
        // No organization — default to free
        const freeTier: SubscriptionData = {
          tier: "free",
          config: SUBSCRIPTION_TIERS.free,
          organizationId: null,
          tokensUsedThisMonth: 0,
          documentsGeneratedThisMonth: 0,
          sessionsUsedThisMonth: 0,
          tokenBudget: checkTokenLimit("free", 0),
          documentBudget: checkDocumentLimit("free", 0),
          sessionBudget: checkSessionLimit("free", 0),
        };
        setSubscription(freeTier);
        return;
      }
      
      // Get organization data (cast to bypass generated types)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any;
      const { data: org } = await sb
        .from("organizations")
        .select("id, plan, subscription_tier, tokens_used_this_month, token_reset_date")
        .eq("id", profile.organization_id)
        .single();
      
      if (!org) {
        setSubscription(null);
        return;
      }
      
      const tier = (org.subscription_tier as SubscriptionTier) ?? 
        resolveSubscriptionTier(org.plan as string);
      
      let tokensUsed = (org.tokens_used_this_month as number) ?? 0;
      
      // Check if tokens should be reset (client-side check)
      if (shouldResetTokens(org.token_reset_date as string | null)) {
        tokensUsed = 0;
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
      
      const docsGenerated = docCount ?? 0;
      const sessionsUsed = sessionCount ?? 0;
      
      setSubscription({
        tier,
        config: SUBSCRIPTION_TIERS[tier],
        organizationId: org.id,
        tokensUsedThisMonth: tokensUsed,
        documentsGeneratedThisMonth: docsGenerated,
        sessionsUsedThisMonth: sessionsUsed,
        tokenBudget: checkTokenLimit(tier, tokensUsed),
        documentBudget: checkDocumentLimit(tier, docsGenerated),
        sessionBudget: checkSessionLimit(tier, sessionsUsed),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subscription");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Quick access methods
  const canGenerate = useCallback(
    (documentType: string): boolean => {
      if (!subscription) return false;
      if (!subscription.documentBudget.allowed) return false;
      return canGenerateDocumentType(subscription.tier, documentType);
    },
    [subscription]
  );

  const canStartSession = useCallback((): boolean => {
    if (!subscription) return false;
    return subscription.sessionBudget.allowed && subscription.tokenBudget.allowed;
  }, [subscription]);

  const hasBadges = useCallback((): boolean => {
    if (!subscription) return false;
    return canAccessBadges(subscription.tier);
  }, [subscription]);

  const hasCertification = useCallback((): boolean => {
    if (!subscription) return false;
    return canAccessCertification(subscription.tier);
  }, [subscription]);

  const hasCustomBranding = useCallback((): boolean => {
    if (!subscription) return false;
    return canUseCustomBranding(subscription.tier);
  }, [subscription]);

  const getAccessibleDocs = useCallback((): string[] => {
    if (!subscription) return [];
    return getAccessibleDocumentTypes(subscription.tier);
  }, [subscription]);

  const getUpgrade = useCallback(
    (limitType: "sessions" | "tokens" | "documents" | "documentType" | "feature") => {
      const tier = subscription?.tier ?? "free";
      return getUpgradeMessage(tier, limitType);
    },
    [subscription]
  );

  return {
    subscription,
    isLoading,
    error,
    canGenerate,
    canStartSession,
    hasBadges,
    hasCertification,
    hasCustomBranding,
    getAccessibleDocs,
    getUpgrade,
    refetch: fetchSubscription,
  };
}
