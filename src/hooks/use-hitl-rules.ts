"use client";

import { useState, useEffect, useCallback } from "react";

export interface HITLRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  timeout: number;
  timeoutAction: string;
  notifyEmail?: string;
  notifySlack?: string;
  status: "active" | "paused";
  stats: {
    triggered: number;
    approved: number;
    rejected: number;
    modified: number;
    avgResponseTime: number;
  };
}

interface UseHITLRulesParams {
  systemId: string;
}

interface UseHITLRulesReturn {
  rules: HITLRule[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createRule: (rule: Omit<HITLRule, "id" | "stats">) => Promise<HITLRule | null>;
  isCreating: boolean;
}

export function useHITLRules({ systemId }: UseHITLRulesParams): UseHITLRulesReturn {
  const [rules, setRules] = useState<HITLRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    if (!systemId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/agents/${systemId}/hitl-rules`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch HITL rules");
      }

      const result = await response.json();
      
      // Transform rules to match frontend expectations
      const transformedRules: HITLRule[] = (result.data || []).map((rule: any) => ({
        id: rule.id,
        name: rule.rule_name || rule.name,
        description: rule.rule_description || rule.description || "",
        trigger: rule.trigger_conditions?.condition || rule.trigger || "",
        timeout: rule.approval_timeout_minutes || rule.timeout || 60,
        timeoutAction: rule.auto_reject_on_timeout ? "auto-reject" : "escalate",
        notifyEmail: rule.notification_channels?.email || rule.notifyEmail,
        notifySlack: rule.notification_channels?.slack || rule.notifySlack,
        status: rule.is_active ? "active" : "paused",
        stats: {
          triggered: rule.stats_triggered || 0,
          approved: rule.stats_approved || 0,
          rejected: rule.stats_rejected || 0,
          modified: rule.stats_modified || 0,
          avgResponseTime: rule.stats_avg_response_time || 0,
        },
      }));

      setRules(transformedRules);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [systemId]);

  const createRule = useCallback(async (rule: Omit<HITLRule, "id" | "stats">): Promise<HITLRule | null> => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/agents/${systemId}/hitl-rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: rule.name,
          description: rule.description,
          trigger: rule.trigger,
          timeout: rule.timeout,
          timeoutAction: rule.timeoutAction,
          notifyEmail: rule.notifyEmail,
          notifySlack: rule.notifySlack,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create HITL rule");
      }

      const result = await response.json();
      await fetchRules(); // Refresh the list
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [systemId, fetchRules]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  return {
    rules,
    isLoading,
    error,
    refetch: fetchRules,
    createRule,
    isCreating,
  };
}
