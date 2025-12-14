"use client";

import { AlertCircle } from "@untitledui/icons";
import { ProgressBarBase } from "@/components/base/progress-indicators/progress-indicators";
import { ProgressBarCircle } from "@/components/base/progress-indicators/progress-circles";
import { daysUntil } from "../data/mock-data";

interface ComplianceOverviewProps {
  overallProgress: number;
  completedRequirements: number;
  totalRequirements: number;
}

export const ComplianceOverview = ({
  overallProgress,
  completedRequirements,
  totalRequirements,
}: ComplianceOverviewProps) => {
  return (
    <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
        {/* Progress Circle */}
        <div className="flex items-center gap-6">
          <ProgressBarCircle 
            value={overallProgress} 
            size="md" 
            label="Compliance"
          />
        </div>
        
        {/* Stats */}
        <div className="flex flex-1 flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-primary">Overall Compliance Status</h2>
            <p className="text-sm text-tertiary">
              {completedRequirements} of {totalRequirements} requirements complete
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-tertiary">Progress</span>
              <span className="font-medium text-primary">{overallProgress}%</span>
            </div>
            <ProgressBarBase value={overallProgress} className="h-3" />
          </div>
          
          <div className="flex items-center gap-2 rounded-lg bg-warning-50 px-3 py-2">
            <AlertCircle className="h-5 w-5 text-warning-600" />
            <span className="text-sm font-medium text-warning-700">
              Next deadline: Aug 2, 2026 (High-Risk AI) — {daysUntil("Aug 2, 2026")} days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceOverview;
