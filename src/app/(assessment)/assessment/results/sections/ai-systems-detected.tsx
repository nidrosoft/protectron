"use client";

import { useState } from "react";
import { cx } from "@/utils/cx";
import { Cpu, ArrowRight2, Clock, Document, Task } from "iconsax-react";
import { ChevronDown, ChevronUp } from "@untitledui/icons";
import {
  getRiskLevelBadge,
  type DetectedAISystem,
  type RiskLevel,
} from "../data/enhanced-risk-calculator";

interface AISystemsDetectedProps {
  systems: DetectedAISystem[];
  totalSystems: number;
}

export function AISystemsDetected({ systems, totalSystems }: AISystemsDetectedProps) {
  const [expandedSystem, setExpandedSystem] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedSystem(expandedSystem === id ? null : id);
  };

  return (
    <section className="mb-8 sm:mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600">
          <Cpu size={20} color="currentColor" variant="Bold" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary dark:text-white sm:text-xl">
            AI Systems Requiring Compliance
          </h2>
          <p className="text-sm text-tertiary dark:text-gray-400">
            Based on your assessment, we've identified {totalSystems} AI system{totalSystems !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Systems List */}
      <div className="space-y-4">
        {systems.map((system, index) => (
          <AISystemCard
            key={system.id}
            system={system}
            index={index + 1}
            isExpanded={expandedSystem === system.id}
            onToggle={() => toggleExpand(system.id)}
          />
        ))}
      </div>

      {/* Additional Systems Note */}
      <div className="mt-4 flex items-start gap-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">+</span>
        </div>
        <div>
          <p className="text-sm font-medium text-primary dark:text-white">
            You may have additional AI systems
          </p>
          <p className="text-sm text-tertiary dark:text-gray-400">
            Add them in the dashboard for complete coverage. Each system needs individual compliance tracking.
          </p>
        </div>
      </div>
    </section>
  );
}

interface AISystemCardProps {
  system: DetectedAISystem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function AISystemCard({ system, index, isExpanded, onToggle }: AISystemCardProps) {
  const badge = getRiskLevelBadge(system.riskLevel);
  
  const cardBorderColor = {
    prohibited: "border-error-300 dark:border-error-700",
    high: "border-warning-300 dark:border-warning-700",
    limited: "border-blue-300 dark:border-blue-700",
    minimal: "border-success-300 dark:border-success-700",
  }[system.riskLevel];

  const cardBgColor = {
    prohibited: "bg-error-50 dark:bg-error-900/10",
    high: "bg-warning-50 dark:bg-warning-900/10",
    limited: "bg-blue-50 dark:bg-blue-900/10",
    minimal: "bg-success-50 dark:bg-success-900/10",
  }[system.riskLevel];

  const iconBgColor = {
    prohibited: "bg-error-200 dark:bg-error-800",
    high: "bg-warning-200 dark:bg-warning-800",
    limited: "bg-blue-200 dark:bg-blue-800",
    minimal: "bg-success-200 dark:bg-success-800",
  }[system.riskLevel];

  const iconColor = {
    prohibited: "text-error-700 dark:text-error-300",
    high: "text-warning-700 dark:text-warning-300",
    limited: "text-blue-700 dark:text-blue-300",
    minimal: "text-success-700 dark:text-success-300",
  }[system.riskLevel];

  return (
    <div className={cx(
      "rounded-xl border-2 overflow-hidden transition-all duration-300",
      cardBorderColor,
      cardBgColor
    )}>
      {/* Card Header - Always Visible */}
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-4 p-4 sm:p-5 text-left hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
      >
        {/* System Icon */}
        <div className={cx(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
          iconBgColor,
          iconColor
        )}>
          <Cpu size={24} color="currentColor" variant="Bold" />
        </div>

        {/* System Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-semibold text-primary dark:text-white sm:text-lg">
              AI System {index}: {system.name}
            </h3>
            <span className={cx(
              "shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold border",
              badge.bg,
              badge.text_color,
              badge.border
            )}>
              {badge.text}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-tertiary dark:text-gray-400">
            <span>Type: {system.type}</span>
            <span>•</span>
            <span>Category: {system.category}</span>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <div className="shrink-0 mt-1">
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5">
          {/* Why This Classification */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-primary dark:text-white mb-2">
              Why {badge.text}?
            </h4>
            <p className="text-sm text-tertiary dark:text-gray-400 leading-relaxed">
              {system.riskReason}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1 text-brand-600">
                <Task size={14} color="currentColor" variant="Bold" />
                <span className="text-lg font-bold text-primary dark:text-white">
                  {system.requirementsCount}
                </span>
              </div>
              <p className="text-xs text-tertiary dark:text-gray-400">Requirements</p>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1 text-brand-600">
                <Document size={14} color="currentColor" variant="Bold" />
                <span className="text-lg font-bold text-primary dark:text-white">
                  {system.documentsNeeded.length}
                </span>
              </div>
              <p className="text-xs text-tertiary dark:text-gray-400">Documents</p>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1 text-brand-600">
                <Clock size={14} color="currentColor" variant="Bold" />
                <span className="text-sm font-bold text-primary dark:text-white">
                  {system.estimatedEffort.split(" ")[0]}
                </span>
              </div>
              <p className="text-xs text-tertiary dark:text-gray-400">Est. Hours</p>
            </div>
          </div>

          {/* Documents Needed */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-primary dark:text-white mb-2">
              Documents You'll Need
            </h4>
            <ul className="space-y-1">
              {system.documentsNeeded.map((doc, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-tertiary dark:text-gray-400">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-brand-500" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          {/* Deadline */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-warning-600">
              <Clock size={16} color="currentColor" variant="Bold" />
              <span className="text-sm font-medium text-primary dark:text-white">
                Deadline: {system.deadline}
              </span>
            </div>
            <span className="text-xs text-tertiary dark:text-gray-400">
              {system.annexCategory && `${system.annexCategory}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
