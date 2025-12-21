"use client";

import { useState, useEffect, useCallback } from "react";

export interface DocumentVersion {
  id: string;
  name: string;
  version: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  isCurrent: boolean;
}

interface UseDocumentVersionsReturn {
  versions: DocumentVersion[];
  currentVersion: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createVersion: (content?: string) => Promise<{ id: string; version: number } | null>;
  restoreVersion: (versionId: string) => Promise<{ id: string; version: number } | null>;
}

export function useDocumentVersions(documentId: string): UseDocumentVersionsReturn {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVersions = useCallback(async () => {
    if (!documentId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/documents/${documentId}/versions`);

      if (!response.ok) {
        throw new Error("Failed to fetch versions");
      }

      const result = await response.json();
      setVersions(result.data?.versions || []);
      setCurrentVersion(result.data?.currentVersion || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  const createVersion = useCallback(async (content?: string): Promise<{ id: string; version: number } | null> => {
    try {
      const response = await fetch(`/api/v1/documents/${documentId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to create version");
      }

      const result = await response.json();
      await fetchVersions();
      return { id: result.data.id, version: result.data.version };
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    }
  }, [documentId, fetchVersions]);

  const restoreVersion = useCallback(async (versionId: string): Promise<{ id: string; version: number } | null> => {
    try {
      const response = await fetch(`/api/v1/documents/${documentId}/versions/${versionId}/restore`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to restore version");
      }

      const result = await response.json();
      await fetchVersions();
      return { id: result.data.id, version: result.data.version };
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    }
  }, [documentId, fetchVersions]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  return {
    versions,
    currentVersion,
    isLoading,
    error,
    refetch: fetchVersions,
    createVersion,
    restoreVersion,
  };
}
