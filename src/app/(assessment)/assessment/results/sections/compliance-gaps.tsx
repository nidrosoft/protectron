"use client";

import { cx } from "@/utils/cx";
import { Danger, Warning2, InfoCircle } from "iconsax-react";
import { AlertTriangle } from "@untitledui/icons";
import type { ComplianceGap, GapPriority } from "../data/enhanced-risk-calculator";

interface ComplianceGapsProps {
  gaps: ComplianceGap[];
}

export function ComplianceGaps({ gaps }: ComplianceGapsProps) {
  const criticalGaps = gaps.filter(g => g.priority === "critical");
  const importantGaps = gaps.filter(g => g.priority === "important");
  const recommendedGaps = gaps.filter(g => g.priority === "recommended");

  const totalCritical = criticalGaps.length;
  const totalImportant = importantGaps.length;
  const totalRecommended = recommendedGaps.length;

  return (
    <section className="mb-8 sm:mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-100 dark:bg-warning-900/30">
          <AlertTriangle className="h-5 w-5 text-warning-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary dark:text-white sm:text-xl">
            Your Compliance Gaps
          </h2>
          <p className="text-sm text-tertiary dark:text-gray-400">
            Based on our analysis, here's what you're currently missing
          </p>
        </div>
      </div>

      {/* Gap Categories */}
      <div className="space-y-4">
        {/* Critical Gaps */}
        {criticalGaps.length > 0 && (
          <GapCategory
            title="Critical Gaps"
            subtitle="Must Address Immediately"
            priority="critical"
            gaps={criticalGaps}
            icon={Danger}
            iconBg="bg-error-200 dark:bg-error-800"
            iconColor="text-error-700 dark:text-error-300"
            borderColor="border-error-300 dark:border-error-700"
            bgColor="bg-error-50 dark:bg-error-900/10"
            headerBg="bg-error-100 dark:bg-error-900/30"
          />
        )}

        {/* Important Gaps */}
        {importantGaps.length > 0 && (
          <GapCategory
            title="Important Gaps"
            subtitle="Address Before Deadline"
            priority="important"
            gaps={importantGaps}
            icon={Warning2}
            iconBg="bg-warning-200 dark:bg-warning-800"
            iconColor="text-warning-700 dark:text-warning-300"
            borderColor="border-warning-300 dark:border-warning-700"
            bgColor="bg-warning-50 dark:bg-warning-900/10"
            headerBg="bg-warning-100 dark:bg-warning-900/30"
          />
        )}

        {/* Recommended Gaps */}
        {recommendedGaps.length > 0 && (
          <GapCategory
            title="Recommended"
            subtitle="Best Practice"
            priority="recommended"
            gaps={recommendedGaps}
            icon={InfoCircle}
            iconBg="bg-blue-200 dark:bg-blue-800"
            iconColor="text-blue-700 dark:text-blue-300"
            borderColor="border-blue-300 dark:border-blue-700"
            bgColor="bg-blue-50 dark:bg-blue-900/10"
            headerBg="bg-blue-100 dark:bg-blue-900/30"
          />
        )}
      </div>

      {/* Summary */}
      <div className="mt-4 flex items-center gap-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          <span className="text-lg font-bold text-gray-600 dark:text-gray-300">Σ</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <SummaryBadge count={totalCritical} label="critical" color="error" />
          <SummaryBadge count={totalImportant} label="important" color="warning" />
          <SummaryBadge count={totalRecommended} label="recommended" color="blue" />
        </div>
      </div>
    </section>
  );
}

interface GapCategoryProps {
  title: string;
  subtitle: string;
  priority: GapPriority;
  gaps: ComplianceGap[];
  icon: typeof Danger;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  bgColor: string;
  headerBg: string;
}

function GapCategory({
  title,
  subtitle,
  priority,
  gaps,
  icon: Icon,
  iconBg,
  iconColor,
  borderColor,
  bgColor,
  headerBg,
}: GapCategoryProps) {
  return (
    <div className={cx("rounded-xl border-2 overflow-hidden", borderColor, bgColor)}>
      {/* Category Header */}
      <div className={cx("flex items-center gap-3 px-4 py-3 sm:px-5", headerBg)}>
        <div className={cx("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", iconBg, iconColor)}>
          <Icon size={16} color="currentColor" variant="Bold" />
        </div>
        <div>
          <h3 className={cx("text-sm font-semibold", iconColor)}>
            {title}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Gap Items */}
      <div className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
        {gaps.map((gap) => (
          <GapItem key={gap.id} gap={gap} />
        ))}
      </div>
    </div>
  );
}

interface GapItemProps {
  gap: ComplianceGap;
}

function GapItem({ gap }: GapItemProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 sm:px-5">
      {/* Checkbox placeholder */}
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-gray-300 dark:border-gray-600 mt-0.5">
        {/* Empty checkbox */}
      </div>

      {/* Gap Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium text-primary dark:text-white">
            {gap.title}
          </h4>
          <span className="shrink-0 text-xs font-medium text-brand-600 dark:text-brand-400">
            {gap.articleRef}
          </span>
        </div>
        <p className="mt-1 text-sm text-tertiary dark:text-gray-400 leading-relaxed">
          {gap.description}
        </p>
        {gap.systemsAffected > 0 && (
          <p className="mt-1 text-xs text-quaternary dark:text-gray-500">
            Affects {gap.systemsAffected} system{gap.systemsAffected !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}

interface SummaryBadgeProps {
  count: number;
  label: string;
  color: "error" | "warning" | "blue";
}

function SummaryBadge({ count, label, color }: SummaryBadgeProps) {
  const colorClasses = {
    error: "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400",
    warning: "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  }[color];

  return (
    <span className={cx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", colorClasses)}>
      <span className="font-bold">{count}</span>
      <span>{label}</span>
    </span>
  );
}
