/**
 * ProgressPanel - Right sidebar showing completion status
 *
 * Displays overall progress, document status, section checklist
 * with jump-to-section support, and quick actions.
 */

"use client";

import { useRouter } from "next/navigation";
import { cx } from "@/utils/cx";
import { SECTIONS } from "@/lib/quick-comply/constants";
import type { SectionId, Progress } from "@/lib/quick-comply/types";

interface ProgressPanelProps {
  progress: Progress;
  currentSection: SectionId;
  sectionsCompleted: SectionId[];
  aiSystemName: string | null;
  riskLevel: string | null;
  onSaveAndExit: () => void;
  onJumpToSection?: (section: SectionId) => void;
}

export function ProgressPanel({
  progress,
  currentSection,
  sectionsCompleted,
  aiSystemName,
  riskLevel,
  onSaveAndExit,
  onJumpToSection,
}: ProgressPanelProps) {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-5">
      {/* AI System Name */}
      {aiSystemName && (
        <div className="rounded-xl border border-secondary bg-secondary_subtle p-3">
          <p className="text-xs font-medium text-tertiary">AI System</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-primary">
            {aiSystemName}
          </p>
          {riskLevel && (
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={cx(
                  "inline-flex h-2 w-2 rounded-full",
                  riskLevel === "prohibited"
                    ? "bg-error-500"
                    : riskLevel === "high"
                      ? "bg-warning-500"
                      : riskLevel === "limited"
                        ? "bg-blue-500"
                        : "bg-success-500"
                )}
              />
              <span className="text-xs font-medium capitalize text-secondary">
                {riskLevel} Risk
              </span>
            </div>
          )}
        </div>
      )}

      {/* Overall Progress */}
      <div className="rounded-xl border border-secondary bg-primary p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-primary">
            Overall Progress
          </h3>
          <span className="text-sm font-bold text-brand-600">
            {progress.overall}%
          </span>
        </div>

        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-tertiary">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-500"
            style={{ width: `${progress.overall}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-tertiary">
          Est. {progress.estimatedTimeRemaining} min remaining
        </p>
      </div>

      {/* Document Status */}
      <div className="rounded-xl border border-secondary bg-primary p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-primary">Documents</h3>
          <span
            className={cx(
              "text-sm font-bold",
              progress.documentsReady > 0
                ? "text-success-primary"
                : "text-tertiary"
            )}
          >
            {progress.documentsReady}/{progress.totalDocuments}
          </span>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-tertiary">
          <div
            className={cx(
              "h-full rounded-full transition-all duration-500",
              progress.documentsReady > 0
                ? "bg-success-500"
                : "bg-quaternary"
            )}
            style={{
              width: `${progress.totalDocuments > 0 ? (progress.documentsReady / progress.totalDocuments) * 100 : 0}%`,
            }}
          />
        </div>

        <p className="mt-2 text-xs text-tertiary">
          {progress.documentsReady === 0
            ? "Documents will be generated once all sections are complete"
            : progress.documentsReady === progress.totalDocuments
              ? "All documents ready — download from your dashboard"
              : `${progress.documentsReady} of ${progress.totalDocuments} documents generated`}
        </p>
      </div>

      {/* Sections Checklist */}
      <div className="rounded-xl border border-secondary bg-primary p-4">
        <h3 className="text-sm font-semibold text-primary">Sections</h3>

        <div className="mt-3 space-y-1">
          {SECTIONS.map((section) => {
            const isCompleted = sectionsCompleted.includes(section.id);
            const isCurrent = section.id === currentSection;
            const canJump = onJumpToSection && isCompleted;

            return (
              <button
                key={section.id}
                type="button"
                disabled={!canJump && !isCurrent}
                onClick={() => {
                  if (canJump) onJumpToSection(section.id);
                }}
                className={cx(
                  "flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                  isCurrent && !isCompleted
                    ? "bg-brand-50 dark:bg-brand-900/20"
                    : canJump
                      ? "cursor-pointer hover:bg-secondary"
                      : ""
                )}
              >
                {/* Status Icon */}
                <div className="mt-0.5 flex shrink-0 items-center">
                  {isCompleted ? (
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-success-500">
                      <svg
                        className="h-2.5 w-2.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </div>
                  ) : isCurrent ? (
                    <div className="flex h-4 w-4 items-center justify-center rounded-full border-[1.5px] border-brand-500">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
                    </div>
                  ) : (
                    <div className="h-4 w-4 rounded-full border-[1.5px] border-secondary" />
                  )}
                </div>

                {/* Section Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={cx(
                        "text-xs font-medium leading-tight",
                        isCompleted
                          ? "text-success-primary"
                          : isCurrent
                            ? "text-brand-700 dark:text-brand-400"
                            : "text-tertiary"
                      )}
                    >
                      {section.name}
                    </p>
                    {isCurrent && !isCompleted && (
                      <span className="shrink-0 rounded bg-brand-100 px-1 py-px text-[9px] font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">
                        Current
                      </span>
                    )}
                    {canJump && (
                      <span className="shrink-0 text-[9px] text-tertiary">
                        Jump
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[10px] leading-snug text-quaternary">
                    {section.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-auto rounded-xl border border-secondary bg-primary p-4">
        <h3 className="text-sm font-semibold text-primary">Quick Actions</h3>

        <div className="mt-3 space-y-2">
          {/* Switch to Dashboard */}
          <button
            onClick={() => router.push("/dashboard")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-secondary px-3 py-2 text-xs font-medium text-secondary transition-colors hover:bg-secondary"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z"
              />
            </svg>
            Switch to Dashboard
          </button>

          {/* Save & Exit */}
          <button
            onClick={onSaveAndExit}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-secondary px-3 py-2 text-xs font-medium text-secondary transition-colors hover:bg-secondary"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
            Save & Exit
          </button>
        </div>
      </div>
    </div>
  );
}
