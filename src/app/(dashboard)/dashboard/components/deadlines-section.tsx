"use client";

import { AlertCircle, Calendar } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";

interface DeadlinesSectionProps {
  highRiskCount?: number;
  limitedRiskCount?: number;
}

// Calculate days until a date
function daysUntil(dateString: string): number {
  const target = new Date(dateString);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export const DeadlinesSection = ({ highRiskCount = 0, limitedRiskCount = 0 }: DeadlinesSectionProps) => {
  const highRiskDays = daysUntil("2026-08-02");
  const limitedRiskDays = daysUntil("2027-08-02");
  const gpaiDays = daysUntil("2025-08-02");

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-semibold text-primary">Upcoming Deadlines</h2>
      
      <div className="flex flex-col gap-4">
        {/* High-Risk Deadline */}
        <div className="flex items-start gap-4 rounded-xl border border-warning-200 bg-warning-50 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning-100">
            <AlertCircle className="h-5 w-5 text-warning-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-warning-900">Aug 2, 2026</p>
              <Badge color="warning" size="sm">{highRiskDays} days</Badge>
            </div>
            <p className="text-sm text-warning-700">High-Risk AI compliance deadline</p>
            <p className="mt-1 text-sm text-warning-600">
              → {highRiskCount > 0 ? `${highRiskCount} system${highRiskCount > 1 ? "s" : ""} need${highRiskCount === 1 ? "s" : ""} attention` : "No high-risk systems"}
            </p>
          </div>
        </div>

        {/* Limited Risk / Legacy Systems Deadline */}
        <div className="flex items-start gap-4 rounded-xl border border-secondary bg-secondary_subtle p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <Calendar className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-primary">Aug 2, 2027</p>
              <Badge color="gray" size="sm">{limitedRiskDays} days</Badge>
            </div>
            <p className="text-sm text-tertiary">Limited-Risk AI systems deadline</p>
            <p className="mt-1 text-sm text-tertiary">
              → {limitedRiskCount > 0 ? `${limitedRiskCount} system${limitedRiskCount > 1 ? "s" : ""} affected` : "No systems affected"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeadlinesSection;
