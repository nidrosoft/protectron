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
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-8 py-16">
      <div className="w-full max-w-md text-center">
        {/* Animated icon */}
        <div className="relative mx-auto mb-8 h-24 w-24">
          <div className="absolute inset-0 animate-ping rounded-full bg-brand-200 opacity-20" />
          <div className="absolute inset-2 animate-pulse rounded-full bg-brand-100" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldTick size={48} color="currentColor" className="text-brand-600 animate-pulse" variant="Bold" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-primary mb-2">
          Analyzing Your Assessment
        </h2>
        <p className="text-tertiary mb-8">
          Please wait while we process your responses...
        </p>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-tertiary">{progress}% complete</p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;
            
            return (
              <div 
                key={step.label}
                className={cx(
                  "flex items-center gap-3 rounded-xl p-3 transition-all duration-300",
                  isActive && "bg-brand-50 scale-105",
                  isComplete && "opacity-60",
                  !isActive && !isComplete && "opacity-40"
                )}
              >
                <div className={cx(
                  "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
                  isActive && "bg-brand-100",
                  isComplete && "bg-success-100",
                  !isActive && !isComplete && "bg-gray-100"
                )}>
                  {isComplete ? (
                    <TickCircle size={20} color="currentColor" className="text-success-600" variant="Bold" />
                  ) : (
                    <Icon size={20} color="currentColor" className={isActive ? step.color : "text-gray-400"} variant={isActive ? "Bold" : "Linear"} />
                  )}
                </div>
                <span className={cx(
                  "font-medium transition-all duration-300",
                  isActive && "text-primary",
                  isComplete && "text-success-600",
                  !isActive && !isComplete && "text-tertiary"
                )}>
                  {step.label}
                </span>
                {isActive && (
                  <div className="ml-auto flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-brand-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 rounded-full bg-brand-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 rounded-full bg-brand-600 animate-bounce" style={{ animationDelay: "300ms" }} />
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
