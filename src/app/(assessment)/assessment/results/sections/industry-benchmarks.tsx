"use client";

import { cx } from "@/utils/cx";
import { Chart, TrendUp, People, Medal } from "iconsax-react";

interface IndustryBenchmarksProps {
  complianceScore: number;
  industry: string;
  totalSystems: number;
}

// Industry benchmark data (simulated based on typical compliance readiness)
const INDUSTRY_BENCHMARKS: Record<string, { avgScore: number; startedPercent: number; completedPercent: number; fullyCompliant: number }> = {
  "Technology": { avgScore: 42, startedPercent: 28, completedPercent: 15, fullyCompliant: 4 },
  "Healthcare": { avgScore: 55, startedPercent: 45, completedPercent: 22, fullyCompliant: 8 },
  "Finance": { avgScore: 58, startedPercent: 52, completedPercent: 28, fullyCompliant: 12 },
  "Retail": { avgScore: 35, startedPercent: 18, completedPercent: 8, fullyCompliant: 2 },
  "Manufacturing": { avgScore: 38, startedPercent: 22, completedPercent: 10, fullyCompliant: 3 },
  "Education": { avgScore: 40, startedPercent: 25, completedPercent: 12, fullyCompliant: 5 },
  "Legal": { avgScore: 52, startedPercent: 42, completedPercent: 20, fullyCompliant: 7 },
  "Other": { avgScore: 40, startedPercent: 25, completedPercent: 12, fullyCompliant: 4 },
};

export function IndustryBenchmarks({ complianceScore, industry, totalSystems }: IndustryBenchmarksProps) {
  const benchmark = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS["Other"];
  
  // Calculate user's percentile
  const scoreDiff = complianceScore - benchmark.avgScore;
  const percentile = Math.min(99, Math.max(1, 50 + Math.round(scoreDiff * 1.5)));
  const isAboveAverage = complianceScore > benchmark.avgScore;
  const aheadOfPercent = 100 - percentile;

  return (
    <section className="mb-8 sm:mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600">
          <Chart size={20} color="currentColor" variant="Bold" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary dark:text-white sm:text-xl">
            How You Compare
          </h2>
          <p className="text-sm text-tertiary dark:text-gray-400">
            Anonymous benchmarks against similar companies
          </p>
        </div>
      </div>

      {/* Main Comparison Card */}
      <div className="rounded-xl border border-secondary dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-tertiary dark:text-gray-400 mb-1">Your Score</p>
            <p className="text-3xl font-bold text-primary dark:text-white">{complianceScore}%</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-tertiary dark:text-gray-400 mb-1">{industry} Average</p>
            <p className="text-3xl font-bold text-gray-400 dark:text-gray-500">{benchmark.avgScore}%</p>
          </div>
        </div>

        {/* Visual Comparison Bar */}
        <div className="relative mb-6">
          <div className="h-4 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            {/* Industry average marker */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-gray-500 dark:bg-gray-400 z-10"
              style={{ left: `${benchmark.avgScore}%` }}
            />
            {/* User's score */}
            <div 
              className={cx(
                "h-full rounded-full transition-all duration-1000",
                isAboveAverage 
                  ? "bg-gradient-to-r from-success-400 to-success-500" 
                  : "bg-gradient-to-r from-warning-400 to-warning-500"
              )}
              style={{ width: `${complianceScore}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">0%</span>
            <span className="text-xs text-gray-500">100%</span>
          </div>
        </div>

        {/* Percentile Badge */}
        <div className={cx(
          "rounded-lg p-4 text-center",
          isAboveAverage 
            ? "bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800" 
            : "bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800"
        )}>
          <div className="flex items-center justify-center gap-2 mb-2">
            {isAboveAverage ? (
              <span className="text-success-600"><Medal size={24} color="currentColor" variant="Bold" /></span>
            ) : (
              <span className="text-warning-600"><TrendUp size={24} color="currentColor" variant="Bold" /></span>
            )}
            <span className={cx(
              "text-lg font-bold",
              isAboveAverage ? "text-success-700 dark:text-success-300" : "text-warning-700 dark:text-warning-300"
            )}>
              {isAboveAverage ? `Top ${aheadOfPercent}%` : `Room to Improve`}
            </span>
          </div>
          <p className={cx(
            "text-sm",
            isAboveAverage ? "text-success-600 dark:text-success-400" : "text-warning-600 dark:text-warning-400"
          )}>
            {isAboveAverage 
              ? `You're ahead of ${aheadOfPercent}% of ${industry.toLowerCase()} companies.`
              : `You're ${Math.abs(scoreDiff)} points below the ${industry.toLowerCase()} average. Start now to catch up.`
            }
          </p>
        </div>
      </div>

      {/* Industry Stats */}
      <div className="rounded-xl border border-secondary dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-primary dark:text-white mb-4 flex items-center gap-2">
          <span className="text-brand-600"><People size={16} color="currentColor" variant="Bold" /></span>
          {industry} Companies & EU AI Act Compliance
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-2">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${benchmark.startedPercent * 1.76} 176`}
                  className="text-brand-500"
                />
              </svg>
              <span className="absolute text-sm font-bold text-primary dark:text-white">
                {benchmark.startedPercent}%
              </span>
            </div>
            <p className="text-xs text-tertiary dark:text-gray-400">Started compliance</p>
          </div>
          
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-2">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${benchmark.completedPercent * 1.76} 176`}
                  className="text-blue-500"
                />
              </svg>
              <span className="absolute text-sm font-bold text-primary dark:text-white">
                {benchmark.completedPercent}%
              </span>
            </div>
            <p className="text-xs text-tertiary dark:text-gray-400">Completed docs</p>
          </div>
          
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-2">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${benchmark.fullyCompliant * 1.76} 176`}
                  className="text-success-500"
                />
              </svg>
              <span className="absolute text-sm font-bold text-primary dark:text-white">
                {benchmark.fullyCompliant}%
              </span>
            </div>
            <p className="text-xs text-tertiary dark:text-gray-400">Fully compliant</p>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-tertiary dark:text-gray-400">
          {isAboveAverage 
            ? "Stay ahead of the curve. Complete your compliance journey now."
            : `Only ${benchmark.fullyCompliant}% of ${industry.toLowerCase()} companies are fully compliant. Get ahead of the pack.`
          }
        </p>
      </div>
    </section>
  );
}
