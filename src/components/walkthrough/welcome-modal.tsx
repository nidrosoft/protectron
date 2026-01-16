"use client";

import { useState } from "react";
import { Cpu, Warning2, TickSquare, Timer1, CloseCircle } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import type { AssessmentContext } from "@/lib/walkthrough/types";

interface WelcomeModalProps {
  isOpen: boolean;
  assessmentContext: AssessmentContext | null;
  onStart: () => void;
  onSkip: () => void;
}

export function WelcomeModal({
  isOpen,
  assessmentContext,
  onStart,
  onSkip,
}: WelcomeModalProps) {
  const [showSkipWarning, setShowSkipWarning] = useState(false);

  if (!isOpen) return null;

  const totalSystems = assessmentContext?.totalSystems || 0;
  const highRiskCount = assessmentContext?.highRiskCount || 0;
  const limitedRiskCount = assessmentContext?.limitedRiskCount || 0;
  const totalRequirements = assessmentContext?.totalRequirements || 53;
  const daysUntilDeadline = assessmentContext?.daysUntilDeadline || 200;

  const getRiskLabel = () => {
    if (highRiskCount > 0) return "HIGH-RISK";
    if (limitedRiskCount > 0) return "LIMITED RISK";
    return "MINIMAL RISK";
  };

  const getRiskColor = () => {
    if (highRiskCount > 0) return "text-error-600 bg-error-100 dark:bg-error-900/30";
    if (limitedRiskCount > 0) return "text-warning-600 bg-warning-100 dark:bg-warning-900/30";
    return "text-success-600 bg-success-100 dark:bg-success-900/30";
  };

  const handleSkipClick = () => {
    setShowSkipWarning(true);
  };

  const handleConfirmSkip = () => {
    setShowSkipWarning(false);
    onSkip();
  };

  const handleCancelSkip = () => {
    setShowSkipWarning(false);
  };

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="relative px-6 pt-8 pb-6 bg-gradient-to-br from-brand-500 to-brand-700 text-white text-center">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 via-purple-400 to-brand-400" />
            <span className="text-4xl mb-3 block">🎉</span>
            <h2 className="text-2xl font-bold mb-2">Welcome to Protectron!</h2>
            <p className="text-brand-100 text-sm">
              Let's help you get started with EU AI Act compliance
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Assessment Summary */}
            {totalSystems > 0 ? (
              <>
                <p className="text-sm text-tertiary dark:text-gray-400 mb-4 text-center">
                  Based on your assessment, we've identified:
                </p>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {/* AI Systems */}
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30 mb-2">
                        <Cpu size={20} className="text-brand-600" variant="Bold" />
                      </div>
                      <span className="text-2xl font-bold text-primary dark:text-white">
                        {totalSystems}
                      </span>
                      <span className="text-xs text-tertiary dark:text-gray-400">
                        AI System{totalSystems !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Risk Level */}
                    <div className="flex flex-col items-center">
                      <div className={cx(
                        "flex h-10 w-10 items-center justify-center rounded-full mb-2",
                        highRiskCount > 0 ? "bg-error-100 dark:bg-error-900/30" : "bg-warning-100 dark:bg-warning-900/30"
                      )}>
                        <Warning2 
                          size={20} 
                          className={highRiskCount > 0 ? "text-error-600" : "text-warning-600"} 
                          variant="Bold" 
                        />
                      </div>
                      <span className={cx(
                        "text-xs font-bold px-2 py-1 rounded-full",
                        getRiskColor()
                      )}>
                        {getRiskLabel()}
                      </span>
                      <span className="text-xs text-tertiary dark:text-gray-400 mt-1">
                        classification
                      </span>
                    </div>

                    {/* Requirements */}
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-100 dark:bg-success-900/30 mb-2">
                        <TickSquare size={20} className="text-success-600" variant="Bold" />
                      </div>
                      <span className="text-2xl font-bold text-primary dark:text-white">
                        {totalRequirements}
                      </span>
                      <span className="text-xs text-tertiary dark:text-gray-400">
                        Requirements
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-tertiary dark:text-gray-400 mb-4 text-center">
                You're in the right place to manage EU AI Act compliance for your AI systems.
              </p>
            )}

            {/* Description */}
            <p className="text-sm text-secondary dark:text-gray-300 text-center mb-4">
              Let's show you around the platform and guide you through adding your first AI system.
            </p>

            {/* Time estimate */}
            <div className="flex items-center justify-center gap-2 text-sm text-tertiary dark:text-gray-400 mb-6">
              <Timer1 size={16} className="text-brand-500" />
              <span>This will take about <strong className="text-primary dark:text-white">5 minutes</strong></span>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              className="w-full"
              onClick={onStart}
            >
              Let's Get Started →
            </Button>

            {/* Skip link */}
            <button
              onClick={handleSkipClick}
              className="w-full mt-3 text-sm text-tertiary dark:text-gray-400 hover:text-secondary dark:hover:text-gray-300 transition-colors"
            >
              Skip walkthrough (not recommended)
            </button>
          </div>
        </div>

        {/* Skip Warning Modal */}
        {showSkipWarning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mx-4 max-w-sm animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-100 dark:bg-warning-900/30">
                  <Warning2 size={20} className="text-warning-600" variant="Bold" />
                </div>
                <h3 className="text-lg font-semibold text-primary dark:text-white">
                  Are you sure?
                </h3>
              </div>
              <p className="text-sm text-tertiary dark:text-gray-400 mb-4">
                The walkthrough helps you understand the platform and complete your first AI system setup. 
                You can always access it later from <strong>Settings → Help → Start Walkthrough</strong>.
              </p>
              <div className="flex gap-3">
                <Button
                  size="md"
                  color="secondary"
                  className="flex-1"
                  onClick={handleConfirmSkip}
                >
                  Skip Anyway
                </Button>
                <Button
                  size="md"
                  className="flex-1"
                  onClick={handleCancelSkip}
                >
                  Continue Tour
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
