"use client";

import { cx } from "@/utils/cx";
import { Clock, TickCircle, Timer1 } from "iconsax-react";
import type { EnhancedAssessmentResults } from "../data/enhanced-risk-calculator";

interface EffortEstimatorProps {
  results: EnhancedAssessmentResults;
}

export function EffortEstimator({ results }: EffortEstimatorProps) {
  const hasHighRisk = results.results.some(r => r.level === "high");
  
  // Calculate manual effort estimates (without any platform assistance)
  const manualDocHours = hasHighRisk ? 120 : 40;
  const manualLegalCost = hasHighRisk ? 25000 : 8000;
  const manualImplHours = hasHighRisk ? 60 : 20;
  const manualMonths = hasHighRisk ? 5 : 2;
  
  // Protectron estimates - self-service platform, no lawyer needed
  const protectronDocHours = hasHighRisk ? 10 : 5; // 5-10 hours max
  const protectronImplHours = hasHighRisk ? 20 : 10; // 10-20 hours
  const protectronDays = hasHighRisk ? 5 : 3; // 3-5 days total
  
  // Calculate savings (full legal cost saved since platform handles everything)
  const hoursSaved = (manualDocHours + manualImplHours) - (protectronDocHours + protectronImplHours);
  const costSaved = manualLegalCost; // Full legal cost saved
  const timeSaved = manualMonths; // Compare months to days

  return (
    <section className="mb-8 sm:mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600">
          <Timer1 size={20} color="currentColor" variant="Bold" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary dark:text-white sm:text-xl">
            Compliance Effort Estimator
          </h2>
          <p className="text-sm text-tertiary dark:text-gray-400">
            How much time and money will this take?
          </p>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Without Protectron */}
        <div className="rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
              <Clock size={16} color="currentColor" variant="Bold" />
            </div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Without Protectron
            </h3>
          </div>
          
          <div className="space-y-3">
            <EstimateRow 
              label="Documentation" 
              value={`${manualDocHours}-${manualDocHours + 40} hours`}
              subtext="Manual drafting & research"
            />
            <EstimateRow 
              label="Legal Review" 
              value={`$${(manualLegalCost / 1000).toFixed(0)}K-${((manualLegalCost * 1.5) / 1000).toFixed(0)}K`}
              subtext="External counsel fees"
            />
            <EstimateRow 
              label="Implementation" 
              value={`${manualImplHours}-${manualImplHours + 20} hours`}
              subtext="Technical controls & logging"
            />
            <div className="pt-3 border-t border-gray-300 dark:border-gray-600">
              <EstimateRow 
                label="Total Timeline" 
                value={`${manualMonths}-${manualMonths + 1} months`}
                subtext="End-to-end completion"
                highlight
              />
            </div>
          </div>
        </div>

        {/* With Protectron */}
        <div className="rounded-xl border-2 border-brand-300 dark:border-brand-700 bg-brand-50 dark:bg-brand-900/10 p-4 sm:p-5 relative overflow-hidden">
          {/* Recommended Badge */}
          <div className="absolute top-0 right-0 bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
            RECOMMENDED
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-200 dark:bg-brand-800 text-brand-600">
              <TickCircle size={16} color="currentColor" variant="Bold" />
            </div>
            <h3 className="text-sm font-semibold text-brand-700 dark:text-brand-300">
              With Protectron
            </h3>
          </div>
          
          <div className="space-y-3">
            <EstimateRow 
              label="Documentation" 
              value={`${protectronDocHours}-${protectronDocHours + 5} hours`}
              subtext="AI-generated, you review"
              isBrand
            />
            <EstimateRow 
              label="Legal Review" 
              value="$0"
              subtext="Self-service platform"
              isBrand
            />
            <EstimateRow 
              label="Implementation" 
              value={`${protectronImplHours}-${protectronImplHours + 10} hours`}
              subtext="Guided step-by-step"
              isBrand
            />
            <div className="pt-3 border-t border-brand-300 dark:border-brand-700">
              <EstimateRow 
                label="Total Timeline" 
                value={`${protectronDays}-${protectronDays + 2} days`}
                subtext="End-to-end completion"
                highlight
                isBrand
              />
            </div>
          </div>
        </div>
      </div>

      {/* Savings Summary */}
      <div className="rounded-xl bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-900/10 border border-success-200 dark:border-success-800 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-success-600"><TickCircle size={20} color="currentColor" variant="Bold" /></span>
          <h3 className="text-sm font-semibold text-success-800 dark:text-success-200">
            Your Estimated Savings with Protectron
          </h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-success-700 dark:text-success-300 sm:text-3xl">
              {hoursSaved}+
            </p>
            <p className="text-xs text-success-600 dark:text-success-400 sm:text-sm">hours saved</p>
          </div>
          <div className="text-center border-x border-success-300 dark:border-success-700">
            <p className="text-2xl font-bold text-success-700 dark:text-success-300 sm:text-3xl">
              ${(costSaved / 1000).toFixed(0)}K+
            </p>
            <p className="text-xs text-success-600 dark:text-success-400 sm:text-sm">legal costs saved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success-700 dark:text-success-300 sm:text-3xl">
              {timeSaved}+
            </p>
            <p className="text-xs text-success-600 dark:text-success-400 sm:text-sm">months faster</p>
          </div>
        </div>
      </div>
    </section>
  );
}

interface EstimateRowProps {
  label: string;
  value: string;
  subtext: string;
  highlight?: boolean;
  isBrand?: boolean;
}

function EstimateRow({ label, value, subtext, highlight, isBrand }: EstimateRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className={cx(
          "text-sm",
          highlight ? "font-semibold" : "font-medium",
          isBrand ? "text-brand-800 dark:text-brand-200" : "text-gray-700 dark:text-gray-300"
        )}>
          {label}
        </p>
        <p className={cx(
          "text-xs",
          isBrand ? "text-brand-600 dark:text-brand-400" : "text-gray-500 dark:text-gray-500"
        )}>
          {subtext}
        </p>
      </div>
      <p className={cx(
        "text-sm font-semibold text-right",
        highlight && "text-base",
        isBrand ? "text-brand-700 dark:text-brand-300" : "text-gray-800 dark:text-gray-200"
      )}>
        {value}
      </p>
    </div>
  );
}
