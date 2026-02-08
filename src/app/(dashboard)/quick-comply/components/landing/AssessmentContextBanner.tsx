/**
 * Section 1 - Assessment Context Banner
 *
 * Gives the user immediate context: what was found during their assessment,
 * why they're here, and reassures them the process is simple.
 */

import { ShieldTick } from "iconsax-react";
import type { AISystem } from "./types";
import { RISK_META } from "./types";

interface AssessmentContextBannerProps {
  systems: AISystem[];
  completedCount: number;
}

export function AssessmentContextBanner({
  systems,
  completedCount,
}: AssessmentContextBannerProps) {
  const total = systems.length;
  const highRiskCount = systems.filter((s) => s.risk_level === "high").length;
  const limitedCount = systems.filter(
    (s) => s.risk_level === "limited"
  ).length;
  const minimalCount = systems.filter(
    (s) => s.risk_level === "minimal"
  ).length;

  // Build a natural language breakdown
  const parts: string[] = [];
  if (highRiskCount > 0) parts.push(`${highRiskCount} high-risk`);
  if (limitedCount > 0) parts.push(`${limitedCount} limited-risk`);
  if (minimalCount > 0) parts.push(`${minimalCount} minimal-risk`);
  const breakdown = parts.length > 0 ? ` (${parts.join(", ")})` : "";

  // Total documents
  const totalDocs = systems.reduce((sum, s) => {
    const meta = RISK_META[s.risk_level];
    const fromAssessment =
      s.assessment_data &&
      typeof s.assessment_data === "object" &&
      Array.isArray(s.assessment_data.documents_needed)
        ? s.assessment_data.documents_needed.length
        : null;
    return sum + (fromAssessment ?? meta?.docs ?? 0);
  }, 0);

  return (
    <div className="rounded-2xl border border-secondary bg-primary p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100">
          <ShieldTick
            size={24}
            color="currentColor"
            className="text-brand-600"
            variant="Bold"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-primary sm:text-xl">
            {completedCount > 0 && completedCount < total
              ? "Welcome Back — Continue Your Compliance"
              : "Your Compliance Overview"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-secondary sm:text-base">
            {completedCount > 0 ? (
              <>
                You&apos;ve completed{" "}
                <span className="font-semibold text-primary">
                  {completedCount} of {total}
                </span>{" "}
                AI system{total !== 1 ? "s" : ""}. Keep going — each system
                you complete gets you closer to full EU AI Act compliance.
              </>
            ) : (
              <>
                During your assessment, we identified{" "}
                <span className="font-semibold text-primary">
                  {total} AI system{total !== 1 ? "s" : ""}
                </span>
                {breakdown} that need EU AI Act compliance. A total of{" "}
                <span className="font-semibold text-primary">
                  {totalDocs} documents
                </span>{" "}
                will be generated automatically as you go.
              </>
            )}
          </p>
          <p className="mt-1.5 text-sm text-tertiary">
            Quick Comply walks you through each system with a guided
            conversation — no legal expertise required.
          </p>
        </div>
      </div>
    </div>
  );
}
