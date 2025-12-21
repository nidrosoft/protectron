"use client";

import { useState, useEffect, useCallback } from "react";
import { agentEventsApi, type AuditEvent, type EventsListParams } from "@/lib/api/client";

export function useAgentEvents(agentId: string, initialParams?: EventsListParams) {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  });

  const fetchEvents = useCallback(async (params?: EventsListParams) => {
    if (!agentId) return;
    
    setIsLoading(true);
    setError(null);
    
    const response = await agentEventsApi.list(agentId, params || initialParams);
    
    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setEvents(response.data);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    }
    
    setIsLoading(false);
  }, [agentId, initialParams]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const loadMore = async () => {
    if (!pagination.hasMore) return;
    
    const newOffset = pagination.offset + pagination.limit;
    const response = await agentEventsApi.list(agentId, {
      ...initialParams,
      offset: newOffset,
    });
    
    if (response.data) {
      setEvents((prev) => [...prev, ...response.data!]);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    }
  };

  return {
    events,
    isLoading,
    error,
    pagination,
    refetch: fetchEvents,
    loadMore,
  };
}
