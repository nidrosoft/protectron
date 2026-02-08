/**
 * MobileProgressDrawer - Slide-up drawer for progress on mobile
 *
 * Shows a compact progress summary and expandable section list.
 * Uses a bottom-sheet pattern for mobile UX.
 */

"use client";

import { useState } from "react";
import { cx } from "@/utils/cx";
import { SECTIONS } from "@/lib/quick-comply/constants";
import type { SectionId, Progress } from "@/lib/quick-comply/types";

interface MobileProgressDrawerProps {
  progress: Progress;
  currentSection: SectionId;
  sectionsCompleted: SectionId[];
  aiSystemName: string | null;
  riskLevel: string | null;
  onSaveAndExit: () => void;
  onJumpToSection?: (section: SectionId) => void;
}

export function MobileProgressDrawer({
  progress,
  currentSection,
  sectionsCompleted,
  aiSystemName,
  riskLevel,
  onSaveAndExit,
  onJumpToSection,
}: MobileProgressDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cx(
          "fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-secondary bg-primary shadow-2xl transition-transform duration-300 lg:hidden",
          isExpanded ? "translate-y-0" : "translate-y-[calc(100%-64px)]"
        )}
        style={{ maxHeight: "80vh" }}
      >
        {/* Handle + Summary Bar */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between px-5 py-3"
        >
          {/* Drag handle */}
          <div className="absolute left-1/2 top-2 h-1 w-8 -translate-x-1/2 rounded-full bg-gray-300" />

          <div className="flex items-center gap-3 pt-1">
            {/* Mini progress ring */}
            <div className="relative h-10 w-10">
              <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-100"
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-brand-500"
                  d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${progress.overall}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-brand-600">
                {progress.overall}%
              </span>
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold text-primary">
                {aiSystemName || "Quick Comply"}
              </p>
              <p className="text-xs text-tertiary">
                {sectionsCompleted.length}/{SECTIONS.length} sections
                {riskLevel && (
                  <span className="ml-1.5 capitalize">· {riskLevel} risk</span>
                )}
              </p>
            </div>
          </div>

          <svg
            className={cx(
              "h-5 w-5 text-gray-400 transition-transform",
              isExpanded && "rotate-180"
            )}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 15.75 7.5-7.5 7.5 7.5"
            />
          </svg>
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="max-h-[60vh] overflow-y-auto px-5 pb-6 pt-2">
            {/* Full progress bar */}
            <div className="mb-4 rounded-lg bg-gray-50 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-secondary">
                  Overall Progress
                </span>
                <span className="font-bold text-brand-600">
                  {progress.overall}%
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{ width: `${progress.overall}%` }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-tertiary">
                Est. {progress.estimatedTimeRemaining} min remaining
              </p>
            </div>

            {/* Sections list */}
            <div className="space-y-1">
              {SECTIONS.map((section) => {
                const isCompleted = sectionsCompleted.includes(section.id);
                const isCurrent = section.id === currentSection;

                const canJump = onJumpToSection && isCompleted;

                return (
                  <button
                    type="button"
                    key={section.id}
                    disabled={!canJump && !isCurrent}
                    onClick={() => {
                      if (canJump) onJumpToSection(section.id);
                    }}
                    className={cx(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left",
                      isCurrent && !isCompleted
                        ? "bg-brand-50 dark:bg-brand-900/20"
                        : canJump
                          ? "cursor-pointer hover:bg-secondary"
                          : ""
                    )}
                  >
                    {isCompleted ? (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-100">
                        <svg
                          className="h-3 w-3 text-success-600"
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
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-brand-500">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
                      </div>
                    ) : (
                      <div className="h-5 w-5 shrink-0 rounded-full border-2 border-gray-200" />
                    )}

                    <div className="min-w-0 flex-1">
                      <p
                        className={cx(
                          "text-sm font-medium",
                          isCompleted
                            ? "text-success-700"
                            : isCurrent
                              ? "text-brand-700"
                              : "text-tertiary"
                        )}
                      >
                        {section.name}
                      </p>
                    </div>

                    {isCurrent && !isCompleted && (
                      <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold text-brand-700">
                        Current
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Save & Exit button */}
            <button
              onClick={onSaveAndExit}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-secondary py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-gray-50"
            >
              <svg
                className="h-4 w-4"
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
        )}
      </div>
    </>
  );
}
