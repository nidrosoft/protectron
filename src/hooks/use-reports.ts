"use client";

import { useState, useEffect, useCallback } from "react";

export interface Report {
  id: string;
  type: "full" | "executive";
  name: string;
  generatedAt: string;
  systemsIncluded: number;
  status: "ready" | "generating" | "failed";
  fileSize: string;
  fileUrl?: string;
  generatedBy: string;
  generatedByAvatar: string;
}

interface GenerateReportParams {
  reportType: "full" | "executive";
  scope: "all" | "specific";
  selectedSystemId?: string;
  includeOptions: {
    riskClassifications: boolean;
    requirementsStatus: boolean;
    documentInventory: boolean;
    evidenceSummary: boolean;
    auditTrail: boolean;
  };
}

interface UseReportsReturn {
  reports: Report[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  generateReport: (params: GenerateReportParams) => Promise<Report | null>;
  isGenerating: boolean;
}

export function useReports(): UseReportsReturn {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/reports");
      
      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const result = await response.json();
      setReports(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateReport = useCallback(async (params: GenerateReportParams): Promise<Report | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const result = await response.json();
      const newReport = result.data;
      
      // Add the new report to the list
      setReports(prev => [newReport, ...prev]);
      
      // Poll for status update
      const pollForReady = async () => {
        await new Promise(resolve => setTimeout(resolve, 2500));
        await fetchReports();
      };
      pollForReady();
      
      return newReport;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [fetchReports]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    isLoading,
    error,
    refetch: fetchReports,
    generateReport,
    isGenerating,
  };
}
