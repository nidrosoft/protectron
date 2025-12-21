"use client";

import { useState, useEffect, useCallback } from "react";

export interface Document {
  id: string;
  name: string;
  type: string;
  status: "draft" | "final";
  size: string;
  systemId: string | null;
  systemName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AISystem {
  id: string;
  name: string;
}

interface UseDocumentsReturn {
  documents: Document[];
  systems: AISystem[];
  documentTypes: string[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createDocument: (data: CreateDocumentData) => Promise<Document | null>;
  updateDocument: (id: string, data: Partial<UpdateDocumentData>) => Promise<Document | null>;
  deleteDocument: (id: string) => Promise<boolean>;
  duplicateDocument: (id: string) => Promise<Document | null>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

interface CreateDocumentData {
  name: string;
  documentType: string;
  aiSystemId?: string;
  generationPrompt?: Record<string, string>;
}

interface UpdateDocumentData {
  name: string;
  status: "draft" | "final";
}

export function useDocuments(): UseDocumentsReturn {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [systems, setSystems] = useState<AISystem[]>([]);
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/documents");
      
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const result = await response.json();
      
      // Documents are already transformed by the API
      setDocuments(result.data || []);
      setSystems(result.systems || []);
      setDocumentTypes(result.documentTypes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDocument = useCallback(async (data: CreateDocumentData): Promise<Document | null> => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          document_type: data.documentType,
          ai_system_id: data.aiSystemId || null,
          generation_prompt: data.generationPrompt || null,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create document");
      }

      const result = await response.json();
      await fetchDocuments();
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [fetchDocuments]);

  const updateDocument = useCallback(async (id: string, data: Partial<UpdateDocumentData>): Promise<Document | null> => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update document");
      }

      const result = await response.json();
      await fetchDocuments();
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, [fetchDocuments]);

  const deleteDocument = useCallback(async (id: string): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/documents/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      await fetchDocuments();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [fetchDocuments]);

  const duplicateDocument = useCallback(async (id: string): Promise<Document | null> => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/documents/${id}/duplicate`, {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error("Failed to duplicate document");
      }

      const result = await response.json();
      await fetchDocuments();
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [fetchDocuments]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    isLoading,
    error,
    refetch: fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    duplicateDocument,
    isCreating,
    isUpdating,
    isDeleting,
    systems,
    documentTypes,
  };
}
