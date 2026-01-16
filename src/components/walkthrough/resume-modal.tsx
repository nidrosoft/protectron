"use client";

import { ArrowRight2, Refresh } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";

interface ResumeModalProps {
  isOpen: boolean;
  currentStep: number;
  totalSteps: number;
  onContinue: () => void;
  onStartOver: () => void;
  onSkip: () => void;
}

export function ResumeModal({
  isOpen,
  currentStep,
  totalSteps,
  onContinue,
  onStartOver,
  onSkip,
}: ResumeModalProps) {
  if (!isOpen) return null;

  const progressPercent = Math.round((currentStep / (totalSteps - 1)) * 100);

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 text-center">
            <span className="text-3xl mb-3 block">👋</span>
            <h2 className="text-xl font-bold text-primary dark:text-white mb-2">
              Welcome back!
            </h2>
            <p className="text-sm text-tertiary dark:text-gray-400">
              You were in the middle of the platform walkthrough.
            </p>
          </div>

          {/* Progress */}
          <div className="px-6 pb-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-secondary dark:text-gray-300">
                  Your progress
                </span>
                <span className="text-sm font-bold text-brand-600">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-tertiary dark:text-gray-400 mt-2">
                Step {currentStep} of {totalSteps - 1}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <p className="text-sm text-secondary dark:text-gray-300 text-center mb-6">
              Would you like to continue where you left off?
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full"
                onClick={onContinue}
                iconTrailing={ArrowRight2}
              >
                Continue Walkthrough
              </Button>
              
              <Button
                size="md"
                color="secondary"
                className="w-full"
                onClick={onStartOver}
                iconLeading={Refresh}
              >
                Start Over
              </Button>
            </div>

            {/* Skip link */}
            <button
              onClick={onSkip}
              className="w-full mt-4 text-sm text-tertiary dark:text-gray-400 hover:text-secondary dark:hover:text-gray-300 transition-colors"
            >
              Skip walkthrough
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
