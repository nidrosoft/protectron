"use client";

import { useState, useCallback } from "react";
import { requirementsApi, type UpdateRequirementInput } from "@/lib/api/client";

export function useRequirement(id: string) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRequirement = useCallback(
    async (data: UpdateRequirementInput) => {
      setIsUpdating(true);
      setError(null);

      const response = await requirementsApi.update(id, data);

      if (response.error) {
        setError(response.error);
        setIsUpdating(false);
        return { success: false, error: response.error };
      }

      setIsUpdating(false);
      return { success: true, data: response.data };
    },
    [id]
  );

  const markComplete = useCallback(async () => {
    return updateRequirement({ status: "completed" });
  }, [updateRequirement]);

  const markInProgress = useCallback(async () => {
    return updateRequirement({ status: "in_progress" });
  }, [updateRequirement]);

  const markPending = useCallback(async () => {
    return updateRequirement({ status: "pending" });
  }, [updateRequirement]);

  const linkEvidence = useCallback(
    async (evidenceId: string) => {
      return updateRequirement({ linked_evidence_id: evidenceId });
    },
    [updateRequirement]
  );

  const linkDocument = useCallback(
    async (documentId: string) => {
      return updateRequirement({ linked_document_id: documentId });
    },
    [updateRequirement]
  );

  return {
    isUpdating,
    error,
    updateRequirement,
    markComplete,
    markInProgress,
    markPending,
    linkEvidence,
    linkDocument,
  };
}
