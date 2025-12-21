"use client";

import { useState, useEffect, useCallback } from "react";

export interface EvidenceData {
  id: string;
  name: string;
  type: string;
  size: string;
  sizeBytes?: number;
  uploadedAt: string;
  uploadedBy: string;
  uploadedById?: string;
  systemId: string;
  systemName: string;
  linkedTo: string;
  requirementId?: string;
  fileUrl?: string;
}

interface SystemOption {
  id: string;
  name: string;
}

interface UseAllEvidenceReturn {
  evidence: EvidenceData[];
  systems: SystemOption[];
  fileTypes: string[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useAllEvidence(filters?: {
  fileType?: string;
  systemId?: string;
}): UseAllEvidenceReturn {
  const [evidence, setEvidence] = useState<EvidenceData[]>([]);
  const [systems, setSystems] = useState<SystemOption[]>([]);
  const [fileTypes, setFileTypes] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvidence = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters?.fileType) params.append("file_type", filters.fileType);
      if (filters?.systemId) params.append("system_id", filters.systemId);

      const response = await fetch(`/api/v1/evidence?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch evidence");
      }

      const result = await response.json();
      
      setEvidence(result.data || []);
      setSystems(result.systems || []);
      setFileTypes(result.fileTypes || []);
      setTotal(result.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [filters?.fileType, filters?.systemId]);

  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

  return {
    evidence,
    systems,
    fileTypes,
    total,
    isLoading,
    error,
    refetch: fetchEvidence,
  };
}
