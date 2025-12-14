"use client";

import { TickCircle, DocumentText1, FolderOpen, DocumentUpload, Document } from "iconsax-react";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

export type RequirementStatus = "complete" | "in_progress" | "not_started" | "not_applicable";

export interface Requirement {
  id: string;
  title: string;
  description?: string;
  status: RequirementStatus;
  articleId: string;
  articleTitle: string;
  systemId: string;
  systemName: string;
  linkedEvidence?: {
    id: string;
    name: string;
    type: string;
  };
  linkedDocument?: {
    id: string;
    name: string;
    type: string;
  };
  justification?: string;
}

interface RequirementItemProps {
  requirement: Requirement;
  onClick?: () => void;
  onUploadEvidence?: () => void;
  onGenerateDocument?: () => void;
  showSystemName?: boolean;
}

const statusConfig: Record<RequirementStatus, { label: string; color: "success" | "warning" | "gray" | "blue" }> = {
  complete: { label: "Complete", color: "success" },
  in_progress: { label: "In Progress", color: "warning" },
  not_started: { label: "Not Started", color: "gray" },
  not_applicable: { label: "N/A", color: "blue" },
};

export const RequirementItem = ({
  requirement,
  onClick,
  onUploadEvidence,
  onGenerateDocument,
  showSystemName = false,
}: RequirementItemProps) => {
  const config = statusConfig[requirement.status];
  const isComplete = requirement.status === "complete";
  const isNotApplicable = requirement.status === "not_applicable";

  return (
    <div
      className={cx(
        "group flex items-start gap-3 rounded-lg border border-secondary bg-primary p-4 transition-colors",
        onClick && "cursor-pointer hover:bg-secondary_hover"
      )}
      onClick={onClick}
    >
      {/* Checkbox/Status Icon */}
      <div className="mt-0.5 shrink-0">
        {isComplete ? (
          <div className="flex size-5 items-center justify-center rounded-full bg-success-100">
            <TickCircle size={16} color="currentColor" variant="Bold" className="text-success-600" />
          </div>
        ) : isNotApplicable ? (
          <div className="flex size-5 items-center justify-center rounded-full bg-gray-100">
            <span className="text-xs font-medium text-gray-500">—</span>
          </div>
        ) : (
          <div className="size-5 rounded-full border-2 border-gray-300 bg-white" />
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className={cx(
              "text-sm font-medium",
              isComplete ? "text-tertiary line-through" : "text-primary"
            )}>
              {requirement.title}
            </p>
            {showSystemName && (
              <p className="mt-0.5 text-xs text-tertiary">{requirement.systemName}</p>
            )}
          </div>
          <Badge size="sm" color={config.color}>
            {config.label}
          </Badge>
        </div>

        {/* Linked Evidence/Document */}
        {(requirement.linkedEvidence || requirement.linkedDocument) && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {requirement.linkedEvidence && (
              <div className="flex items-center gap-1.5 rounded-md bg-secondary_subtle px-2 py-1">
                <FolderOpen size={14} color="currentColor" className="text-tertiary" />
                <span className="text-xs text-secondary">{requirement.linkedEvidence.name}</span>
              </div>
            )}
            {requirement.linkedDocument && (
              <div className="flex items-center gap-1.5 rounded-md bg-secondary_subtle px-2 py-1">
                <DocumentText1 size={14} color="currentColor" className="text-tertiary" />
                <span className="text-xs text-secondary">{requirement.linkedDocument.name}</span>
              </div>
            )}
          </div>
        )}

        {/* Justification for N/A */}
        {isNotApplicable && requirement.justification && (
          <p className="mt-2 text-xs text-tertiary italic">
            Justification: {requirement.justification}
          </p>
        )}

        {/* Action Buttons (only for incomplete requirements) */}
        {!isComplete && !isNotApplicable && (
          <div className="mt-3 flex items-center gap-2">
            <Button
              size="sm"
              color="secondary"
              iconLeading={({ className }) => <DocumentUpload size={14} color="currentColor" className={className} />}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onUploadEvidence?.();
              }}
            >
              Upload Evidence
            </Button>
            <Button
              size="sm"
              color="secondary"
              iconLeading={({ className }) => <Document size={14} color="currentColor" className={className} />}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onGenerateDocument?.();
              }}
            >
              Generate Document
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequirementItem;
