/**
 * Section 4 - Deadline Callout
 *
 * Compact display of relevant compliance deadlines based on
 * the user's actual risk levels. Creates urgency without panic.
 */

import { Calendar } from "iconsax-react";
import type { AISystem } from "./types";
import { daysUntil } from "./types";

interface DeadlineCalloutProps {
  systems: AISystem[];
}

const DEADLINE_HIGH = new Date("2026-08-02");
const DEADLINE_OTHER = new Date("2027-08-02");

export function DeadlineCallout({ systems }: DeadlineCalloutProps) {
  const hasHighRisk = systems.some((s) => s.risk_level === "high");
  const hasLimitedOrMinimal = systems.some(
    (s) => s.risk_level === "limited" || s.risk_level === "minimal"
  );

  const highDays = daysUntil(DEADLINE_HIGH);
  const otherDays = daysUntil(DEADLINE_OTHER);

  if (!hasHighRisk && !hasLimitedOrMinimal) return null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {hasHighRisk && (
        <DeadlineCard
          label="High-Risk Systems"
          date="August 2, 2026"
          daysLeft={highDays}
          urgent={highDays < 180}
        />
      )}
      {hasLimitedOrMinimal && (
        <DeadlineCard
          label="Limited & Minimal Risk"
          date="August 2, 2027"
          daysLeft={otherDays}
          urgent={false}
        />
      )}
    </div>
  );
}

function DeadlineCard({
  label,
  date,
  daysLeft,
  urgent,
}: {
  label: string;
  date: string;
  daysLeft: number;
  urgent: boolean;
}) {
  return (
    <div
      className={`flex flex-1 items-center gap-3 rounded-xl border p-4 ${
        urgent
          ? "border-secondary bg-warning-primary"
          : "border-secondary bg-primary"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          urgent ? "bg-warning-solid" : "bg-brand-600"
        }`}
      >
        <Calendar
          size={18}
          color="currentColor"
          className="text-white"
          variant="Bold"
        />
      </div>
      <div>
        <p className="text-xs font-medium text-tertiary">{label}</p>
        <p className="text-sm font-semibold text-primary">
          {date}{" "}
          <span
            className={`text-xs font-normal ${urgent ? "text-warning-primary" : "text-tertiary"}`}
          >
            ({daysLeft} days left)
          </span>
        </p>
      </div>
    </div>
  );
}
