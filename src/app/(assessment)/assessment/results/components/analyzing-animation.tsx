"use client";

import { useEffect, useState } from "react";
import { ShieldTick, Cpu, Shield, DocumentText, Chart, TickCircle } from "iconsax-react";
import { cx } from "@/utils/cx";

interface AnalyzingAnimationProps {
  onComplete: () => void;
}

export const AnalyzingAnimation = ({ onComplete }: AnalyzingAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const steps = [
    { icon: Cpu, label: "Analyzing AI Systems", color: "text-brand-600" },
    { icon: Shield, label: "Evaluating Risk Levels", color: "text-warning-600" },
    { icon: DocumentText, label: "Checking Compliance Requirements", color: "text-blue-600" },
    { icon: Chart, label: "Generating Your Report", color: "text-success-600" },
  ];

  useEffect(() => {
    const stepDuration = 800;
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          setTimeout(onComplete, 500);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, [onComplete, steps.length]);

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-16">
      <div className="w-full max-w-md text-center">
        {/* Animated icon */}
        <div className="relative mx-auto mb-6 h-20 w-20 sm:mb-8 sm:h-24 sm:w-24">
          <div className="absolute inset-0 animate-ping rounded-full bg-brand-200 opacity-20" />
          <div className="absolute inset-2 animate-pulse rounded-full bg-brand-100" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldTick size={40} color="currentColor" className="text-brand-600 animate-pulse sm:hidden" variant="Bold" />
            <ShieldTick size={48} color="currentColor" className="text-brand-600 animate-pulse hidden sm:block" variant="Bold" />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-primary dark:text-white mb-1 sm:text-xl sm:mb-2">
          Analyzing Your Assessment
        </h2>
        <p className="text-sm text-tertiary dark:text-gray-400 mb-6 sm:text-base sm:mb-8">
          Please wait while we process your responses...
        </p>

        {/* Progress bar */}
        <div className="mb-6 sm:mb-8">
          <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden sm:h-2">
            <div 
              className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-tertiary dark:text-gray-400 sm:text-sm">{progress}% complete</p>
        </div>

        {/* Steps */}
        <div className="space-y-2 sm:space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;
            
            return (
              <div 
                key={step.label}
                className={cx(
                  "flex items-center gap-2 rounded-lg p-2 transition-all duration-300 sm:gap-3 sm:rounded-xl sm:p-3",
                  isActive && "bg-brand-50 dark:bg-brand-900/30 scale-105",
                  isComplete && "opacity-80",
                  !isActive && !isComplete && "opacity-50"
                )}
              >
                <div className={cx(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 sm:h-10 sm:w-10",
                  isActive && "bg-brand-100 dark:bg-brand-800/50",
                  isComplete && "bg-success-100 dark:bg-success-900/30",
                  !isActive && !isComplete && "bg-gray-100 dark:bg-gray-700"
                )}>
                  {isComplete ? (
                    <TickCircle size={18} color="currentColor" className="text-success-600 sm:hidden" variant="Bold" />
                  ) : (
                    <Icon size={18} color="currentColor" className={cx(isActive ? step.color : "text-gray-400 dark:text-gray-500", "sm:hidden")} variant={isActive ? "Bold" : "Linear"} />
                  )}
                  {isComplete ? (
                    <TickCircle size={20} color="currentColor" className="text-success-600 hidden sm:block" variant="Bold" />
                  ) : (
                    <Icon size={20} color="currentColor" className={cx(isActive ? step.color : "text-gray-400 dark:text-gray-500", "hidden sm:block")} variant={isActive ? "Bold" : "Linear"} />
                  )}
                </div>
                <span className={cx(
                  "text-sm font-medium transition-all duration-300 sm:text-base",
                  isActive && "text-brand-700 dark:text-brand-300",
                  isComplete && "text-success-600 dark:text-success-400",
                  !isActive && !isComplete && "text-gray-500 dark:text-gray-400"
                )}>
                  {step.label}
                </span>
                {isActive && (
                  <div className="ml-auto flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-600 animate-bounce sm:h-2 sm:w-2" style={{ animationDelay: "0ms" }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-600 animate-bounce sm:h-2 sm:w-2" style={{ animationDelay: "150ms" }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-600 animate-bounce sm:h-2 sm:w-2" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyzingAnimation;
