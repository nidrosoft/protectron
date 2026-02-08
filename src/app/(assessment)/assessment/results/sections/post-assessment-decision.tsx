"use client";

import { useState } from "react";
import { ShieldTick, Clock, DocumentText, TickCircle } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import type { EnhancedAssessmentResults } from "../data/enhanced-risk-calculator";

interface PostAssessmentDecisionProps {
  results: EnhancedAssessmentResults;
  onGoToDashboard: () => void;
  onSaveAndNavigate: (destination: string) => Promise<void>;
  isSaving: boolean;
}

export function PostAssessmentDecision({
  results,
  onGoToDashboard,
  onSaveAndNavigate,
  isSaving,
}: PostAssessmentDecisionProps) {
  const [isNavigatingToQuickComply, setIsNavigatingToQuickComply] = useState(false);

  const handleStartQuickComply = async () => {
    setIsNavigatingToQuickComply(true);
    try {
      await onSaveAndNavigate("/quick-comply");
    } catch {
      setIsNavigatingToQuickComply(false);
    }
  };

  const totalDocuments = results.detectedSystems.reduce(
    (acc, s) => acc + (s.documentsNeeded?.length || 0),
    0
  );

  const highestRisk = results.detectedSystems.reduce<string>((highest, s) => {
    const riskOrder = ["prohibited", "high", "limited", "minimal"];
    const currentIdx = riskOrder.indexOf(s.riskLevel);
    const highestIdx = riskOrder.indexOf(highest);
    return currentIdx < highestIdx ? s.riskLevel : highest;
  }, "minimal");

  const riskColorMap: Record<string, string> = {
    prohibited: "text-error-700 bg-error-100 border-error-200",
    high: "text-error-600 bg-error-50 border-error-200",
    limited: "text-warning-600 bg-warning-50 border-warning-200",
    minimal: "text-success-600 bg-success-50 border-success-200",
  };

  return (
    <div className="mt-10 sm:mt-14">
      {/* Section Heading */}
      <div className="mb-6 text-center sm:mb-8">
        <h2 className="text-lg font-bold text-primary sm:text-xl">
          How would you like to proceed?
        </h2>
        <p className="mt-1 text-sm text-tertiary sm:text-base">
          Choose the compliance path that works best for your team
        </p>
      </div>

      {/* Assessment Summary Stats */}
      <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100">
            <ShieldTick size={20} className="text-brand-600" variant="Bold" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary sm:text-base">
              {results.totalSystems} AI System{results.totalSystems !== 1 ? "s" : ""} Detected
            </p>
            <p className="text-xs text-tertiary">
              Risk Classification:{" "}
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${riskColorMap[highestRisk] || ""}`}
              >
                {highestRisk}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center">
            <p className="text-xl font-bold text-primary sm:text-2xl">
              {results.totalRequirements}
            </p>
            <p className="mt-0.5 text-xs text-tertiary">Requirements</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center">
            <p className="text-xl font-bold text-primary sm:text-2xl">
              {totalDocuments}
            </p>
            <p className="mt-0.5 text-xs text-tertiary">Documents</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center">
            <p className="text-xl font-bold text-primary sm:text-2xl">
              {results.estimatedWeeks > 0 ? `${results.estimatedWeeks}w` : "~45m"}
            </p>
            <p className="mt-0.5 text-xs text-tertiary">Est. Time</p>
          </div>
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center">
            <p className="text-xl font-bold text-primary sm:text-2xl">
              {results.daysUntilDeadline}
            </p>
            <p className="mt-0.5 text-xs text-tertiary">Days Left</p>
          </div>
        </div>
      </div>

      {/* Two-Column Decision Cards */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {/* Quick Comply Card */}
        <div className="group relative overflow-hidden rounded-2xl border-2 border-brand-200 bg-gradient-to-br from-brand-50 via-white to-purple-50 p-6 transition-all hover:border-brand-400 hover:shadow-lg sm:p-8">
          {/* Recommended Badge */}
          <div className="absolute right-4 top-4">
            <span className="inline-flex items-center rounded-full bg-brand-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
              Recommended
            </span>
          </div>

          {/* Icon + Title */}
          <div className="mb-4">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100">
              <svg
                className="h-6 w-6 text-brand-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-primary">Quick Comply</h3>
            <p className="text-sm text-brand-600 font-medium">Guided by AI</p>
          </div>

          {/* Features */}
          <ul className="mb-5 space-y-2.5">
            {[
              "~45 minutes to complete",
              "AI asks questions, you answer",
              `All ${totalDocuments} docs auto-generated`,
              "Resume anytime",
              "Real-time document previews",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-secondary">
                <TickCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-success-500"
                  variant="Bold"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Best For */}
          <p className="mb-5 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700 border border-brand-100">
            <span className="font-semibold">Best for:</span> Getting compliant fast with minimal effort
          </p>

          {/* CTA */}
          <Button
            color="primary"
            size="lg"
            className="w-full"
            onClick={handleStartQuickComply}
            isLoading={isNavigatingToQuickComply}
            disabled={isSaving}
          >
            Start Quick Comply
          </Button>
        </div>

        {/* Detailed Mode Card */}
        <div className="group overflow-hidden rounded-2xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-lg sm:p-8">
          {/* Icon + Title */}
          <div className="mb-4 mt-6 sm:mt-7">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <DocumentText size={24} className="text-gray-600" variant="Bold" />
            </div>
            <h3 className="text-lg font-bold text-primary">Detailed Mode</h3>
            <p className="text-sm text-tertiary font-medium">Full Control</p>
          </div>

          {/* Features */}
          <ul className="mb-5 space-y-2.5">
            {[
              "Requirement by requirement",
              "Upload existing documents",
              "Custom evidence attachments",
              "Full audit trail",
              "Granular control over each step",
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-secondary">
                <TickCircle
                  size={16}
                  className="mt-0.5 shrink-0 text-gray-400"
                  variant="Bold"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Best For */}
          <p className="mb-5 rounded-lg bg-gray-50 px-3 py-2 text-xs text-tertiary border border-gray-100">
            <span className="font-semibold">Best for:</span> Teams with existing documentation or compliance processes
          </p>

          {/* CTA */}
          <Button
            color="secondary"
            size="lg"
            className="w-full"
            onClick={onGoToDashboard}
            isLoading={isSaving}
            disabled={isNavigatingToQuickComply}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-gray-50 px-4 py-3 text-center">
        <Clock size={14} className="shrink-0 text-tertiary" />
        <p className="text-xs text-tertiary sm:text-sm">
          You can switch between modes anytime. Progress is always saved.
        </p>
      </div>
    </div>
  );
}
