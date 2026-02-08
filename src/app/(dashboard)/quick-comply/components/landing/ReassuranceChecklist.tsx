/**
 * Section 3 - Reassurance Checklist
 *
 * Dynamic reassurance based on the user's actual risk levels.
 * Tells them what they DON'T need to worry about.
 */

import { TickCircle, InfoCircle } from "iconsax-react";
import type { AISystem } from "./types";

interface ReassuranceChecklistProps {
  systems: AISystem[];
}

export function ReassuranceChecklist({ systems }: ReassuranceChecklistProps) {
  const hasHighRisk = systems.some((s) => s.risk_level === "high");
  const onlyMinimalOrLimited = systems.every(
    (s) => s.risk_level === "minimal" || s.risk_level === "limited"
  );

  // Build checklist items based on risk profile
  const checks: string[] = [
    "No evidence files to gather or upload",
    "No legal expertise or lawyers needed",
    "All compliance documents generated automatically from your answers",
    "Save your progress anytime and resume where you left off",
  ];

  if (onlyMinimalOrLimited) {
    checks.splice(
      1,
      0,
      "No conformity assessments or government registration required"
    );
  } else {
    checks.splice(
      1,
      0,
      "No government forms to fill out — we generate them for you"
    );
  }

  return (
    <div className="rounded-2xl border border-secondary bg-primary p-6 sm:p-8">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-tertiary">
        What you don&apos;t need to worry about
      </h2>
      <ul className="mt-4 space-y-3">
        {checks.map((text) => (
          <li key={text} className="flex items-start gap-2.5">
            <TickCircle
              size={18}
              color="currentColor"
              className="mt-0.5 shrink-0 text-success-600"
              variant="Bold"
            />
            <span className="text-sm leading-snug text-secondary">{text}</span>
          </li>
        ))}
      </ul>

      {/* High-risk callout */}
      {hasHighRisk && (
        <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-secondary bg-secondary p-3.5">
          <InfoCircle
            size={16}
            color="currentColor"
            className="mt-0.5 shrink-0 text-brand-600"
          />
          <p className="text-xs leading-relaxed text-secondary">
            <span className="font-medium text-primary">
              About your high-risk system:
            </span>{" "}
            High-risk AI systems require EU Database registration. Quick Comply
            will generate the registration form for you — you won&apos;t need
            to navigate any government portals yourself.
          </p>
        </div>
      )}
    </div>
  );
}
