"use client";

import { cx } from "@/utils/cx";
import { Cpu, Warning2, InfoCircle, TickCircle, Clock, Chart } from "iconsax-react";
import { ProgressRing } from "../components";
import {
  getScoreColor,
  getScoreLabel,
  formatDeadlineCountdown,
  type EnhancedAssessmentResults,
  type ScoreBreakdown,
} from "../data/enhanced-risk-calculator";

interface ComplianceStatusSummaryProps {
  results: EnhancedAssessmentResults;
  companyName: string;
}

export function ComplianceStatusSummary({ results, companyName }: ComplianceStatusSummaryProps) {
  const scoreInfo = getScoreLabel(results.complianceScore);
  
  return (
    <section className="mb-8 sm:mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600">
          <Chart size={20} color="currentColor" variant="Bold" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary dark:text-white sm:text-xl">
            Your EU AI Act Compliance Status
          </h2>
          <p className="text-sm text-tertiary dark:text-gray-400">
            Overview of your compliance readiness for {companyName || "your organization"}
          </p>
        </div>
      </div>

      {/* Main Score Card */}
      <div className="rounded-xl border border-secondary dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-4 shadow-lg sm:rounded-2xl sm:p-8">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between lg:gap-8">
          {/* Progress Ring */}
          <div className="flex flex-col items-center">
            <ProgressRing 
              progress={results.complianceScore} 
              color={getScoreColor(results.complianceScore)}
            />
            <div className={cx("mt-4 rounded-full px-4 py-1.5", scoreInfo.bg)}>
              <span className={cx("text-sm font-semibold", scoreInfo.color)}>
                {scoreInfo.label}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 flex-1 w-full max-w-md sm:gap-4">
            <StatCard
              icon={Cpu}
              iconBg="bg-brand-100 dark:bg-brand-900/30"
              iconColor="text-brand-600"
              value={results.totalSystems}
              label="AI Systems"
            />
            <StatCard
              icon={Warning2}
              iconBg="bg-warning-100 dark:bg-warning-900/30"
              iconColor="text-warning-600"
              value={results.results.find(r => r.level === "high")?.count || 0}
              label="High Risk"
            />
            <StatCard
              icon={InfoCircle}
              iconBg="bg-blue-100 dark:bg-blue-900/30"
              iconColor="text-blue-600"
              value={results.results.find(r => r.level === "limited")?.count || 0}
              label="Limited Risk"
            />
            <StatCard
              icon={TickCircle}
              iconBg="bg-success-100 dark:bg-success-900/30"
              iconColor="text-success-600"
              value={results.results.find(r => r.level === "minimal")?.count || 0}
              label="Minimal Risk"
            />
          </div>
        </div>

        {/* Compliance Breakdown Progress Bars */}
        <div className="mt-6 pt-6 border-t border-secondary dark:border-gray-700">
          <h3 className="text-sm font-semibold text-primary dark:text-white mb-4">
            Compliance Breakdown
          </h3>
          <div className="space-y-3">
            <ProgressBar 
              label="Requirements Identified" 
              value={results.totalRequirements} 
              max={results.totalRequirements}
              percentage={100}
              color="bg-brand-500"
            />
            <ProgressBar 
              label="Documents Needed" 
              value={results.totalDocuments} 
              max={results.totalDocuments}
              percentage={0}
              color="bg-warning-500"
              showZero
            />
            <ProgressBar 
              label="Evidence Uploaded" 
              value={0} 
              max={results.totalRequirements}
              percentage={0}
              color="bg-gray-400"
              showZero
            />
          </div>
        </div>

        {/* Deadline Banner */}
        <div className="mt-6 flex items-center gap-3 rounded-lg bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning-200 dark:bg-warning-800 text-warning-700 dark:text-warning-300">
            <Clock size={20} color="currentColor" variant="Bold" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-warning-900 dark:text-warning-100">
              Deadline: August 2, 2026
            </p>
            <p className="text-sm text-warning-700 dark:text-warning-300">
              {formatDeadlineCountdown(results.daysUntilDeadline)} • Estimated {results.estimatedWeeks} weeks to complete with Protectron
            </p>
          </div>
        </div>
      </div>

      {/* Score Breakdown Card */}
      <div className="mt-4 rounded-xl border border-secondary dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-primary dark:text-white mb-4 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300">?</span>
          How Your Score Was Calculated
        </h3>
        <div className="space-y-2">
          <ScoreBreakdownItem
            category="Base Score"
            points={100}
            reason="Starting compliance readiness"
            isPositive={true}
          />
          {results.scoreBreakdown.map((item, index) => (
            <ScoreBreakdownItem
              key={index}
              category={item.category}
              points={item.points}
              reason={item.reason}
              isPositive={item.isPositive}
            />
          ))}
          <div className="pt-2 mt-2 border-t border-secondary dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary dark:text-white">Final Score</span>
              <span className={cx("text-lg font-bold", getScoreColor(results.complianceScore))}>
                {results.complianceScore}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Sub-components

interface StatCardProps {
  icon: typeof Cpu;
  iconBg: string;
  iconColor: string;
  value: number;
  label: string;
}

function StatCard({ icon: Icon, iconBg, iconColor, value, label }: StatCardProps) {
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-3 shadow-sm border border-gray-100 dark:border-gray-700 sm:rounded-xl sm:p-4">
      <div className={cx("flex h-8 w-8 items-center justify-center rounded-lg mb-2 sm:h-10 sm:w-10 sm:mb-3", iconBg, iconColor)}>
        <Icon size={20} color="currentColor" variant="Bold" />
      </div>
      <p className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">{value}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">{label}</p>
    </div>
  );
}

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  percentage: number;
  color: string;
  showZero?: boolean;
}

function ProgressBar({ label, value, max, percentage, color, showZero }: ProgressBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-tertiary dark:text-gray-400">{label}</span>
        <span className="text-sm font-medium text-primary dark:text-white">
          {showZero && percentage === 0 ? `0/${max}` : `${value}/${max}`}
        </span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div 
          className={cx("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface ScoreBreakdownItemProps {
  category: string;
  points: number;
  reason: string;
  isPositive: boolean;
}

function ScoreBreakdownItem({ category, points, reason, isPositive }: ScoreBreakdownItemProps) {
  const pointsDisplay = points > 0 ? `+${points}` : points.toString();
  
  return (
    <div className="flex items-start gap-3 py-2">
      <div className={cx(
        "flex h-6 w-12 shrink-0 items-center justify-center rounded text-xs font-semibold",
        isPositive ? "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400" : "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400"
      )}>
        {pointsDisplay}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-primary dark:text-white">{category}</p>
        <p className="text-xs text-tertiary dark:text-gray-400 truncate">{reason}</p>
      </div>
    </div>
  );
}
