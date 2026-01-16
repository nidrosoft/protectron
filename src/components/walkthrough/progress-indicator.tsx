"use client";

import { cx } from "@/utils/cx";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitle?: string;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
  stepTitle,
}: ProgressIndicatorProps) {
  // Don't show for step 0 (welcome) or last step (completion)
  if (currentStep === 0 || currentStep >= totalSteps - 1) return null;

  const displaySteps = totalSteps - 2; // Exclude welcome and completion
  const displayCurrent = currentStep; // Current step (1-indexed for display)

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: displaySteps }, (_, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < displayCurrent;
            const isCurrent = stepNum === displayCurrent;

            return (
              <div
                key={i}
                className={cx(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  isCompleted && "bg-brand-500",
                  isCurrent && "bg-brand-500 w-4",
                  !isCompleted && !isCurrent && "bg-gray-300 dark:bg-gray-600"
                )}
              />
            );
          })}
        </div>

        {/* Step label */}
        <span className="text-xs font-medium text-tertiary dark:text-gray-400">
          Step {displayCurrent} of {displaySteps}
          {stepTitle && (
            <span className="hidden sm:inline">: {stepTitle}</span>
          )}
        </span>
      </div>
    </div>
  );
}
