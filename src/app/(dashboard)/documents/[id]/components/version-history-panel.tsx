"use client";

import { useState } from "react";
import { Clock, Refresh2, TickCircle } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import { useToast } from "@/components/base/toast/toast";
import { useDocumentVersions, type DocumentVersion } from "@/hooks/use-document-versions";
import { cx } from "@/utils/cx";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";

interface VersionHistoryPanelProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
  onVersionRestored?: (newDocId: string) => void;
}

export const VersionHistoryPanel = ({
  documentId,
  isOpen,
  onClose,
  onVersionRestored,
}: VersionHistoryPanelProps) => {
  const { addToast } = useToast();
  const { versions, currentVersion, isLoading, restoreVersion } = useDocumentVersions(documentId);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const handleRestore = async (version: DocumentVersion) => {
    if (version.isCurrent) return;

    setRestoringId(version.id);
    try {
      const result = await restoreVersion(version.id);
      if (result) {
        addToast({
          type: "success",
          title: "Version Restored",
          message: `Restored to version ${version.version}. A new version ${result.version} has been created.`,
        });
        onVersionRestored?.(result.id);
      } else {
        addToast({
          type: "error",
          title: "Restore Failed",
          message: "Failed to restore version. Please try again.",
        });
      }
    } catch (error) {
      addToast({
        type: "error",
        title: "Restore Failed",
        message: "An error occurred while restoring the version.",
      });
    } finally {
      setRestoringId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 bg-primary shadow-xl border-l border-secondary flex flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-secondary px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-brand-600" color="currentColor" />
            <h3 className="text-md font-semibold text-primary">Version History</h3>
          </div>
          <button
            onClick={onClose}
            className="text-tertiary hover:text-primary transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="mt-1 text-sm text-tertiary">
          Current version: <span className="font-medium text-primary">{currentVersion}</span>
        </p>
      </div>

      {/* Version List */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingIndicator type="dot-circle" size="sm" label="Loading versions..." />
          </div>
        ) : versions.length === 0 ? (
          <div className="text-center py-8">
            <Clock size={32} className="mx-auto text-tertiary mb-2" color="currentColor" />
            <p className="text-sm text-tertiary">No version history available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((version) => (
              <div
                key={version.id}
                className={cx(
                  "rounded-lg border p-3 transition-colors",
                  version.isCurrent
                    ? "border-brand-500 bg-brand-50"
                    : "border-secondary bg-primary hover:bg-secondary_subtle"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-primary">
                        Version {version.version}
                      </span>
                      {version.isCurrent && (
                        <Badge size="sm" color="brand">Current</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-tertiary truncate">
                      {formatDate(version.createdAt)}
                    </p>
                    <Badge size="sm" color={version.status === "final" ? "success" : "warning"} className="mt-2">
                      {version.status}
                    </Badge>
                  </div>
                  {!version.isCurrent && (
                    <Button
                      size="sm"
                      color="secondary"
                      iconLeading={({ className }) => (
                        <Refresh2 size={14} color="currentColor" className={className} />
                      )}
                      onClick={() => handleRestore(version)}
                      isDisabled={restoringId === version.id}
                    >
                      {restoringId === version.id ? "..." : "Restore"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-secondary px-4 py-3">
        <p className="text-xs text-tertiary">
          Restoring a version creates a new version with the restored content.
        </p>
      </div>
    </div>
  );
};

export default VersionHistoryPanel;
