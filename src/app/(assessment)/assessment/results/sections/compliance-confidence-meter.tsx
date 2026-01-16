"use client";

import { cx } from "@/utils/cx";
import { Shield, TickCircle, Document, Cpu, Activity, SecurityUser, Task } from "iconsax-react";
import type { EnhancedAssessmentResults } from "../data/enhanced-risk-calculator";

interface ComplianceConfidenceMeterProps {
  results: EnhancedAssessmentResults;
}

interface ConfidenceStep {
  id: string;
  title: string;
  points: number;
  icon: typeof Shield;
  isCompleted: boolean;
}

export function ComplianceConfidenceMeter({ results }: ComplianceConfidenceMeterProps) {
  // Define the confidence steps based on what the user needs to do
  const hasHighRisk = results.results.some(r => r.level === "high");
  
  const confidenceSteps: ConfidenceStep[] = [
    {
      id: "step-1",
      title: "Register AI systems",
      points: 15,
      icon: Cpu,
      isCompleted: false,
    },
    {
      id: "step-2",
      title: "Generate Risk Assessment",
      points: 20,
      icon: Activity,
      isCompleted: false,
    },
    {
      id: "step-3",
      title: "Create Technical Documentation",
      points: 20,
      icon: Document,
      isCompleted: false,
    },
    {
      id: "step-4",
      title: "Implement Audit Logging",
      points: 15,
      icon: Task,
      isCompleted: false,
    },
    {
      id: "step-5",
      title: "Document Human Oversight",
      points: 15,
      icon: SecurityUser,
      isCompleted: false,
    },
    {
      id: "step-6",
      title: "Generate Compliance Report",
      points: 15,
      icon: Shield,
      isCompleted: false,
    },
  ];

  // Calculate current confidence (starts at 0 since nothing is done yet)
  const completedPoints = confidenceSteps
    .filter(step => step.isCompleted)
    .reduce((sum, step) => sum + step.points, 0);
  
  const totalPoints = confidenceSteps.reduce((sum, step) => sum + step.points, 0);
  const confidencePercent = Math.round((completedPoints / totalPoints) * 100);

  // Determine confidence level
  const getConfidenceLevel = (percent: number) => {
    if (percent >= 100) return { label: "AUDIT-READY", color: "text-success-600", bg: "bg-success-500" };
    if (percent >= 75) return { label: "HIGH CONFIDENCE", color: "text-success-600", bg: "bg-success-500" };
    if (percent >= 50) return { label: "MODERATE", color: "text-warning-600", bg: "bg-warning-500" };
    if (percent >= 25) return { label: "LOW", color: "text-warning-600", bg: "bg-warning-500" };
    return { label: "NOT STARTED", color: "text-error-600", bg: "bg-error-500" };
  };

  const confidenceLevel = getConfidenceLevel(confidencePercent);

  return (
    <section className="mb-8 sm:mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600">
          <Shield size={20} color="currentColor" variant="Bold" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary dark:text-white sm:text-xl">
            Your Compliance Confidence Meter
          </h2>
          <p className="text-sm text-tertiary dark:text-gray-400">
            Track your progress toward audit-ready status
          </p>
        </div>
      </div>

      {/* Confidence Meter Card */}
      <div className="rounded-xl border border-secondary dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
        {/* Main Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary dark:text-white">
              Compliance Confidence
            </span>
            <span className={cx("text-sm font-bold", confidenceLevel.color)}>
              {confidencePercent}% — {confidenceLevel.label}
            </span>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="relative h-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            {/* Background segments */}
            <div className="absolute inset-0 flex">
              {[0, 25, 50, 75].map((threshold, i) => (
                <div 
                  key={threshold}
                  className={cx(
                    "flex-1 border-r border-white/20 dark:border-gray-600/50",
                    i === 3 && "border-r-0"
                  )}
                />
              ))}
            </div>
            
            {/* Progress fill */}
            <div 
              className={cx(
                "absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out",
                confidencePercent >= 75 ? "bg-gradient-to-r from-success-400 to-success-500" :
                confidencePercent >= 50 ? "bg-gradient-to-r from-warning-400 to-warning-500" :
                confidencePercent >= 25 ? "bg-gradient-to-r from-warning-400 to-warning-500" :
                "bg-gradient-to-r from-error-400 to-error-500"
              )}
              style={{ width: `${confidencePercent}%` }}
            />
            
            {/* Percentage markers */}
            <div className="absolute inset-0 flex items-center justify-between px-2">
              {[0, 25, 50, 75, 100].map((marker) => (
                <span 
                  key={marker}
                  className={cx(
                    "text-xs font-medium z-10",
                    marker <= confidencePercent 
                      ? "text-white" 
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {marker === 100 ? "✓" : `${marker}%`}
                </span>
              ))}
            </div>
          </div>
          
          {/* Labels */}
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">Not Started</span>
            <span className="text-xs text-success-600 font-medium">Audit-Ready</span>
          </div>
        </div>

        {/* Steps to Complete */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-primary dark:text-white mb-3">
            Complete these to increase your confidence:
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {confidenceSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={cx(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all",
                    step.isCompleted
                      ? "border-success-300 dark:border-success-700 bg-success-50 dark:bg-success-900/10"
                      : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                  )}
                >
                  {/* Checkbox */}
                  <div className={cx(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                    step.isCompleted
                      ? "border-success-500 bg-success-500"
                      : "border-gray-300 dark:border-gray-600"
                  )}>
                    {step.isCompleted && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={step.isCompleted ? "text-success-600" : "text-gray-500 dark:text-gray-400"}>
                        <Icon size={14} color="currentColor" variant="Bold" />
                      </span>
                      <span className={cx(
                        "text-sm font-medium",
                        step.isCompleted
                          ? "text-success-700 dark:text-success-300 line-through"
                          : "text-primary dark:text-white"
                      )}>
                        {step.title}
                      </span>
                    </div>
                  </div>

                  {/* Points */}
                  <span className={cx(
                    "shrink-0 px-2 py-0.5 rounded text-xs font-semibold",
                    step.isCompleted
                      ? "bg-success-200 dark:bg-success-800 text-success-700 dark:text-success-300"
                      : "bg-brand-100 dark:bg-brand-900/30 text-brand-600"
                  )}>
                    +{step.points}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="rounded-lg bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-900/10 border border-brand-200 dark:border-brand-800 p-4 text-center">
          <p className="text-sm text-brand-800 dark:text-brand-200 mb-2">
            <strong>Start now</strong> to fill your confidence meter and become audit-ready before the deadline.
          </p>
          <p className="text-xs text-brand-600 dark:text-brand-400">
            Each completed step brings you closer to 100% compliance confidence.
          </p>
        </div>
      </div>
    </section>
  );
}
