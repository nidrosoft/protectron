"use client";

import { useState, useEffect, useCallback } from "react";

export type AuditEventType = 
  | "agent_invoked" 
  | "tool_call" 
  | "decision_made" 
  | "human_override" 
  | "error" 
  | "agent_delegation"
  | "llm_call";

export interface AuditEvent {
  id: string;
  type: AuditEventType;
  action: string;
  timestamp: string;
  details: Record<string, any>;
  duration?: number;
  tokens?: number;
  traceId?: string;
  sessionId?: string;
  reasoning?: string;
  confidence?: number;
  alternatives?: string[];
  overrideBy?: string;
  overrideDecision?: string;
  overrideReason?: string;
  responseTime?: number;
}

export interface AuditStatistics {
  totalActions: number;
  toolCalls: number;
  decisionsMade: number;
  humanOverrides: number;
  errors: number;
  totalActionsChange: number;
  toolCallsChange: number;
  decisionsMadeChange: number;
  humanOverridesChange: number;
  errorsChange: number;
  humanOversightRate: number;
  escalationRate: number;
  avgResponseTime: number;
  avgTokensPerAction: number;
}

interface UseAuditEventsParams {
  systemId: string;
  eventType?: string;
  limit?: number;
}

interface UseAuditEventsReturn {
  events: AuditEvent[];
  statistics: AuditStatistics | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  total: number;
}

export function useAuditEvents({ systemId, eventType, limit = 50 }: UseAuditEventsParams): UseAuditEventsReturn {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [statistics, setStatistics] = useState<AuditStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchEvents = useCallback(async () => {
    if (!systemId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("limit", limit.toString());
      if (eventType && eventType !== "all") {
        params.set("type", eventType);
      }

      const response = await fetch(`/api/v1/agents/${systemId}/events?${params}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch audit events");
      }

      const result = await response.json();
      
      // Transform events to match frontend expectations
      const transformedEvents: AuditEvent[] = (result.data || []).map((event: any) => ({
        id: event.id,
        type: mapEventType(event.event_type),
        action: event.action || event.event_name || event.event_type,
        timestamp: event.event_timestamp || event.created_at,
        details: {
          ...event.details,
          input: event.input_data,
          output: event.output_data,
        },
        duration: event.duration_ms,
        tokens: (event.tokens_input || 0) + (event.tokens_output || 0),
        traceId: event.trace_id,
        sessionId: event.session_id,
        reasoning: event.reasoning,
        confidence: event.confidence,
        alternatives: event.alternatives,
        overrideBy: event.override_by,
        overrideDecision: event.override_decision,
        overrideReason: event.override_reason,
        responseTime: event.response_time_seconds,
      }));

      setEvents(transformedEvents);
      setTotal(result.pagination?.total || transformedEvents.length);

      // Calculate statistics from events
      const stats = calculateStatistics(result.data || []);
      setStatistics(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [systemId, eventType, limit]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    statistics,
    isLoading,
    error,
    refetch: fetchEvents,
    total,
  };
}

function mapEventType(eventType: string): AuditEventType {
  const typeMap: Record<string, AuditEventType> = {
    tool_call: "tool_call",
    decision: "decision_made",
    decision_made: "decision_made",
    human_override: "human_override",
    error: "error",
    agent_delegation: "agent_delegation",
    llm_call: "llm_call",
    agent_invoked: "agent_invoked",
  };
  return typeMap[eventType] || "tool_call";
}

function calculateStatistics(events: any[]): AuditStatistics {
  const toolCalls = events.filter(e => e.event_type === "tool_call").length;
  const decisions = events.filter(e => e.event_type === "decision").length;
  const humanOverrides = events.filter(e => e.event_type === "human_override").length;
  const errors = events.filter(e => e.event_type === "error").length;
  
  const totalTokens = events.reduce((sum, e) => sum + (e.tokens_input || 0) + (e.tokens_output || 0), 0);
  const totalDuration = events.reduce((sum, e) => sum + (e.duration_ms || 0), 0);
  
  return {
    totalActions: events.length,
    toolCalls,
    decisionsMade: decisions,
    humanOverrides,
    errors,
    totalActionsChange: 0, // Would need historical data
    toolCallsChange: 0,
    decisionsMadeChange: 0,
    humanOverridesChange: 0,
    errorsChange: 0,
    humanOversightRate: events.length > 0 ? Math.round((humanOverrides / events.length) * 100) : 0,
    escalationRate: 0,
    avgResponseTime: events.length > 0 ? Math.round(totalDuration / events.length / 1000 * 10) / 10 : 0,
    avgTokensPerAction: events.length > 0 ? Math.round(totalTokens / events.length) : 0,
  };
}
