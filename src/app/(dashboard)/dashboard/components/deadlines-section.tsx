"use client";

import { AlertCircle, Calendar } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { daysUntil } from "../data/mock-data";

export const DeadlinesSection = () => {
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
              <Badge color="warning" size="sm">{daysUntil("Aug 2, 2026")} days</Badge>
            </div>
            <p className="text-sm text-warning-700">High-Risk AI compliance deadline</p>
            <p className="mt-1 text-sm text-warning-600">→ 2 systems need attention</p>
          </div>
        </div>

        {/* Legacy Systems Deadline */}
        <div className="flex items-start gap-4 rounded-xl border border-secondary bg-secondary_subtle p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
            <Calendar className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-primary">Aug 2, 2027</p>
              <Badge color="gray" size="sm">{daysUntil("Aug 2, 2027")} days</Badge>
            </div>
            <p className="text-sm text-tertiary">Legacy systems deadline</p>
            <p className="mt-1 text-sm text-tertiary">→ No systems affected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeadlinesSection;
