"use client";

import { useState } from "react";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";
import { RequirementItem, type Requirement } from "./requirement-item";
import { cx } from "@/utils/cx";

interface RequirementSectionProps {
  articleId: string;
  articleTitle: string;
  requirements: Requirement[];
  onRequirementClick?: (requirement: Requirement) => void;
  onUploadEvidence?: (requirement: Requirement) => void;
  onGenerateDocument?: (requirement: Requirement) => void;
  defaultExpanded?: boolean;
}

export const RequirementSection = ({
  articleId,
  articleTitle,
  requirements,
  onRequirementClick,
  onUploadEvidence,
  onGenerateDocument,
  defaultExpanded = true,
}: RequirementSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const completedCount = requirements.filter(
    (r) => r.status === "complete" || r.status === "not_applicable"
  ).length;
  const totalCount = requirements.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="rounded-xl border border-secondary bg-primary overflow-hidden">
      {/* Section Header */}
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-secondary_hover transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            {isExpanded ? (
              <ArrowUp2 size={16} color="currentColor" />
            ) : (
              <ArrowDown2 size={16} color="currentColor" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary">{articleTitle}</h3>
            <p className="text-xs text-tertiary">{articleId}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 rounded-full bg-gray-100">
              <div
                className={cx(
                  "h-2 rounded-full transition-all",
                  progressPercent === 100 ? "bg-success-500" : "bg-brand-500"
                )}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-medium text-tertiary">
              {completedCount}/{totalCount}
            </span>
          </div>
        </div>
      </button>

      {/* Requirements List */}
      {isExpanded && (
        <div className="border-t border-secondary px-4 py-3">
          <div className="flex flex-col gap-2">
            {requirements.map((requirement) => (
              <RequirementItem
                key={requirement.id}
                requirement={requirement}
                onClick={() => onRequirementClick?.(requirement)}
                onUploadEvidence={() => onUploadEvidence?.(requirement)}
                onGenerateDocument={() => onGenerateDocument?.(requirement)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequirementSection;
