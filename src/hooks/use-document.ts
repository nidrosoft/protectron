"use client";

import { useState, useEffect, useCallback } from "react";

export interface DocumentData {
  id: string;
  name: string;
  type: string;
  status: string;
  size: string;
  createdAt: string;
  updatedAt: string;
  systemId: string;
  systemName: string;
  content: string | null;
}

interface UseDocumentReturn {
  document: DocumentData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateDocument: (data: { name?: string; status?: string; content?: string }) => Promise<boolean>;
}

export function useDocument(documentId: string): UseDocumentReturn {
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocument = useCallback(async () => {
    if (!documentId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/documents/${documentId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }

      const result = await response.json();
      setDocument(result.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  const updateDocument = useCallback(async (data: { name?: string; status?: string; content?: string }): Promise<boolean> => {
    try {
      const response = await fetch(`/api/v1/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update document");
      }

      await fetchDocument();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    }
  }, [documentId, fetchDocument]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  return {
    document,
    isLoading,
    error,
    refetch: fetchDocument,
    updateDocument,
  };
}
