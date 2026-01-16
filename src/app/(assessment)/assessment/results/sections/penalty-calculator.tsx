"use client";

import { cx } from "@/utils/cx";
import { Danger, DollarCircle, Warning2 } from "iconsax-react";

interface PenaltyCalculatorProps {
  hasHighRisk: boolean;
  companySize: string;
  industry: string;
}

// Estimated revenue ranges by company size
const REVENUE_ESTIMATES: Record<string, { min: number; max: number; label: string }> = {
  "1-10": { min: 100000, max: 1000000, label: "$100K - $1M" },
  "11-50": { min: 1000000, max: 10000000, label: "$1M - $10M" },
  "51-200": { min: 10000000, max: 50000000, label: "$10M - $50M" },
  "201-500": { min: 50000000, max: 200000000, label: "$50M - $200M" },
  "501-1000": { min: 200000000, max: 500000000, label: "$200M - $500M" },
  "1000+": { min: 500000000, max: 2000000000, label: "$500M - $2B" },
};

function formatCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return `€${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `€${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `€${(amount / 1000).toFixed(0)}K`;
  }
  return `€${amount.toFixed(0)}`;
}

export function PenaltyCalculator({ hasHighRisk, companySize, industry }: PenaltyCalculatorProps) {
  const revenueData = REVENUE_ESTIMATES[companySize] || REVENUE_ESTIMATES["51-200"];
  
  // Calculate potential penalties
  const highRiskPenaltyPercent = 3; // 3% for high-risk violations
  const prohibitedPenaltyPercent = 7; // 7% for prohibited AI
  const fixedHighRiskPenalty = 15000000; // €15M
  const fixedProhibitedPenalty = 35000000; // €35M
  
  // Calculate based on estimated revenue
  const avgRevenue = (revenueData.min + revenueData.max) / 2;
  const highRiskPenaltyRevenue = avgRevenue * (highRiskPenaltyPercent / 100);
  const prohibitedPenaltyRevenue = avgRevenue * (prohibitedPenaltyPercent / 100);
  
  // Penalty is whichever is higher
  const estimatedHighRiskPenalty = Math.max(highRiskPenaltyRevenue, fixedHighRiskPenalty);
  const estimatedProhibitedPenalty = Math.max(prohibitedPenaltyRevenue, fixedProhibitedPenalty);

  return (
    <section className="mb-8 sm:mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error-100 dark:bg-error-900/30 text-error-600">
          <Danger size={20} color="currentColor" variant="Bold" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary dark:text-white sm:text-xl">
            What Happens If You Don't Comply?
          </h2>
          <p className="text-sm text-tertiary dark:text-gray-400">
            Potential penalties based on your company profile
          </p>
        </div>
      </div>

      {/* Penalty Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* High-Risk Violations */}
        <div className="rounded-xl border-2 border-warning-300 dark:border-warning-700 bg-warning-50 dark:bg-warning-900/10 p-4 sm:p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning-200 dark:bg-warning-800 text-warning-700 dark:text-warning-300">
              <Warning2 size={20} color="currentColor" variant="Bold" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-warning-900 dark:text-warning-100">
                High-Risk Violations
              </h3>
              <p className="text-xs text-warning-700 dark:text-warning-300">
                Non-compliance with Articles 9-15
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-warning-800 dark:text-warning-200">Fixed Penalty</span>
              <span className="text-sm font-semibold text-warning-900 dark:text-warning-100">
                Up to €15 million
              </span>
            </div>
            <div className="text-center text-xs text-warning-700 dark:text-warning-300">OR</div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-warning-800 dark:text-warning-200">Revenue-Based</span>
              <span className="text-sm font-semibold text-warning-900 dark:text-warning-100">
                3% of global revenue
              </span>
            </div>
            <div className="pt-3 border-t border-warning-300 dark:border-warning-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-warning-800 dark:text-warning-200">
                  Your Estimated Risk
                </span>
                <span className="text-lg font-bold text-warning-900 dark:text-warning-100">
                  {formatCurrency(estimatedHighRiskPenalty)}
                </span>
              </div>
              <p className="text-xs text-warning-600 dark:text-warning-400 mt-1">
                Based on {revenueData.label} estimated revenue
              </p>
            </div>
          </div>
        </div>

        {/* Prohibited AI Violations */}
        <div className="rounded-xl border-2 border-error-300 dark:border-error-700 bg-error-50 dark:bg-error-900/10 p-4 sm:p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-error-200 dark:bg-error-800 text-error-700 dark:text-error-300">
              <Danger size={20} color="currentColor" variant="Bold" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-error-900 dark:text-error-100">
                Prohibited AI Violations
              </h3>
              <p className="text-xs text-error-700 dark:text-error-300">
                Using banned AI practices
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-error-800 dark:text-error-200">Fixed Penalty</span>
              <span className="text-sm font-semibold text-error-900 dark:text-error-100">
                Up to €35 million
              </span>
            </div>
            <div className="text-center text-xs text-error-700 dark:text-error-300">OR</div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-error-800 dark:text-error-200">Revenue-Based</span>
              <span className="text-sm font-semibold text-error-900 dark:text-error-100">
                7% of global revenue
              </span>
            </div>
            <div className="pt-3 border-t border-error-300 dark:border-error-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-error-800 dark:text-error-200">
                  Maximum Exposure
                </span>
                <span className="text-lg font-bold text-error-900 dark:text-error-100">
                  {formatCurrency(estimatedProhibitedPenalty)}
                </span>
              </div>
              <p className="text-xs text-error-600 dark:text-error-400 mt-1">
                Whichever amount is higher applies
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Banner */}
      {hasHighRisk && (
        <div className="rounded-lg bg-gray-900 dark:bg-gray-950 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-error-500 text-white">
              <DollarCircle size={16} color="currentColor" variant="Bold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-1">
                Your organization has high-risk AI systems
              </p>
              <p className="text-sm text-gray-300">
                With {hasHighRisk ? "high-risk" : "limited-risk"} AI systems and an estimated revenue of{" "}
                <span className="font-semibold text-white">{revenueData.label}</span>, your potential 
                penalty exposure is up to{" "}
                <span className="font-bold text-error-400">{formatCurrency(estimatedHighRiskPenalty)}</span>.
                Compliance with Protectron costs a fraction of this risk.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
