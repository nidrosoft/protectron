"use client";

import { useState } from "react";
import { cx } from "@/utils/cx";
import { Map1, TickCircle, Clock, ArrowRight2 } from "iconsax-react";
import { ChevronDown, ChevronUp } from "@untitledui/icons";
import type { RoadmapPhase, RoadmapStep } from "../data/enhanced-risk-calculator";

interface ComplianceRoadmapProps {
  phases: RoadmapPhase[];
  estimatedWeeks: number;
}

export function ComplianceRoadmap({ phases, estimatedWeeks }: ComplianceRoadmapProps) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(phases[0]?.id || null);

  const togglePhase = (id: string) => {
    setExpandedPhase(expandedPhase === id ? null : id);
  };

  const totalSteps = phases.reduce((sum, phase) => sum + phase.steps.length, 0);

  return (
    <section className="mb-8 sm:mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600">
          <Map1 size={20} color="currentColor" variant="Bold" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary dark:text-white sm:text-xl">
            Your Compliance Roadmap
          </h2>
          <p className="text-sm text-tertiary dark:text-gray-400">
            {totalSteps} steps across {phases.length} phases • Estimated {estimatedWeeks} weeks
          </p>
        </div>
      </div>

      {/* Intro Text */}
      <div className="mb-4 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 p-4">
        <p className="text-sm text-success-800 dark:text-success-200">
          Follow these steps to achieve EU AI Act compliance. Each step includes specific actions 
          and how Protectron helps you complete them faster.
        </p>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        {phases.map((phase, phaseIndex) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            phaseIndex={phaseIndex}
            isExpanded={expandedPhase === phase.id}
            onToggle={() => togglePhase(phase.id)}
            isLast={phaseIndex === phases.length - 1}
          />
        ))}
      </div>

      {/* Timeline Summary */}
      <div className="mt-6 rounded-xl bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-900/10 border border-brand-200 dark:border-brand-800 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-200 dark:bg-brand-800 text-brand-700 dark:text-brand-300">
              <Clock size={24} color="currentColor" variant="Bold" />
            </div>
            <div>
              <p className="text-lg font-bold text-brand-900 dark:text-brand-100">
                Estimated Timeline: {estimatedWeeks}-{estimatedWeeks + 2} weeks
              </p>
              <p className="text-sm text-brand-700 dark:text-brand-300">
                vs. 3-6 months manually
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-brand-700 dark:text-brand-300">
            <span className="text-success-500"><TickCircle size={16} color="currentColor" variant="Bold" /></span>
            <span>Protectron saves you 60-80% of the time</span>
          </div>
        </div>
      </div>
    </section>
  );
}

interface PhaseCardProps {
  phase: RoadmapPhase;
  phaseIndex: number;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}

function PhaseCard({ phase, phaseIndex, isExpanded, onToggle, isLast }: PhaseCardProps) {
  const phaseColors = [
    { bg: "bg-brand-100 dark:bg-brand-900/30", text: "text-brand-700 dark:text-brand-300", border: "border-brand-300 dark:border-brand-700" },
    { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300", border: "border-blue-300 dark:border-blue-700" },
    { bg: "bg-success-100 dark:bg-success-900/30", text: "text-success-700 dark:text-success-300", border: "border-success-300 dark:border-success-700" },
    { bg: "bg-warning-100 dark:bg-warning-900/30", text: "text-warning-700 dark:text-warning-300", border: "border-warning-300 dark:border-warning-700" },
  ];

  const colors = phaseColors[phaseIndex % phaseColors.length];

  return (
    <div className="relative">
      {/* Connector Line */}
      {!isLast && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -mb-4 z-0" />
      )}

      <div className={cx(
        "relative z-10 rounded-xl border-2 overflow-hidden transition-all duration-300",
        colors.border,
        isExpanded ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-800/50"
      )}>
        {/* Phase Header */}
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-4 p-4 sm:p-5 text-left hover:bg-white dark:hover:bg-gray-800 transition-colors"
        >
          {/* Phase Number */}
          <div className={cx(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold text-lg",
            colors.bg,
            colors.text
          )}>
            {phase.phase}
          </div>

          {/* Phase Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-primary dark:text-white sm:text-lg">
                Phase {phase.phase}: {phase.title}
              </h3>
              <span className={cx(
                "px-2 py-0.5 rounded text-xs font-medium",
                colors.bg,
                colors.text
              )}>
                {phase.timeframe}
              </span>
            </div>
            <p className="text-sm text-tertiary dark:text-gray-400">
              {phase.steps.length} step{phase.steps.length !== 1 ? "s" : ""} to complete
            </p>
          </div>

          {/* Expand/Collapse Icon */}
          <div className="shrink-0">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </button>

        {/* Expanded Steps */}
        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {phase.steps.map((step, stepIndex) => (
                <StepItem
                  key={step.id}
                  step={step}
                  isLast={stepIndex === phase.steps.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface StepItemProps {
  step: RoadmapStep;
  isLast: boolean;
}

function StepItem({ step, isLast }: StepItemProps) {
  const estimatedTime = step.estimatedMinutes >= 60
    ? `${Math.floor(step.estimatedMinutes / 60)}h ${step.estimatedMinutes % 60}m`
    : `${step.estimatedMinutes}m`;

  return (
    <div className="flex items-start gap-4 p-4 sm:p-5">
      {/* Step Number */}
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
            {step.stepNumber}
          </span>
        </div>
        {!isLast && (
          <div className="w-0.5 h-full mt-2 bg-gray-200 dark:bg-gray-700 min-h-[20px]" />
        )}
      </div>

      {/* Step Content */}
      <div className="flex-1 min-w-0 pb-2">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-sm font-semibold text-primary dark:text-white">
            Step {step.stepNumber}: {step.title}
          </h4>
          <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400">
            <Clock size={10} variant="Bold" />
            {estimatedTime}
          </span>
        </div>
        <p className="text-sm text-tertiary dark:text-gray-400 leading-relaxed mb-2">
          {step.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400">
          <ArrowRight2 size={12} variant="Bold" />
          <span>{step.protectronFeature}</span>
        </div>
      </div>
    </div>
  );
}
