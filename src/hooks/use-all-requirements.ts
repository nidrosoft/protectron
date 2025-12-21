"use client";

import { useState, useEffect, useCallback } from "react";

interface LinkedEvidence {
  id: string;
  name: string;
  type: string;
}

interface LinkedDocument {
  id: string;
  name: string;
  type: string;
}

export interface RequirementData {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "not_applicable";
  articleId: string;
  articleTitle: string;
  systemId: string;
  systemName: string;
  dueDate?: string;
  completedAt?: string;
  notes?: string;
  linkedEvidence?: LinkedEvidence;
  linkedDocument?: LinkedDocument;
}

interface SystemOption {
  id: string;
  name: string;
}

interface RequirementsStats {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
}

interface UseAllRequirementsReturn {
  requirements: RequirementData[];
  systems: SystemOption[];
  stats: RequirementsStats;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAllRequirements(filters?: {
  status?: string;
  systemId?: string;
  articleId?: string;
}): UseAllRequirementsReturn {
  const [requirements, setRequirements] = useState<RequirementData[]>([]);
  const [systems, setSystems] = useState<SystemOption[]>([]);
  const [stats, setStats] = useState<RequirementsStats>({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequirements = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.systemId) params.append("system_id", filters.systemId);
      if (filters?.articleId) params.append("article_id", filters.articleId);

      const response = await fetch(`/api/v1/requirements?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch requirements");
      }

      const result = await response.json();
      
      setRequirements(result.data || []);
      setSystems(result.systems || []);
      setStats(result.stats || { total: 0, completed: 0, inProgress: 0, pending: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status, filters?.systemId, filters?.articleId]);

  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  return {
    requirements,
    systems,
    stats,
    isLoading,
    error,
    refetch: fetchRequirements,
  };
}
