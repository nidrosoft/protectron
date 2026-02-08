/**
 * Section 5 - System Card
 *
 * Individual AI system card with enhanced context:
 * - What clicking "Start" does
 * - How many documents will be generated
 * - Estimated time
 * - Clear status indicators
 */

"use client";

import { useRouter } from "next/navigation";
import {
  TickCircle,
  Lock1,
  Crown1,
  DocumentText,
  Clock,
  ArrowRight2,
} from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import type { AISystem, QuickComplySession } from "./types";
import { RISK_META, RiskBadge } from "./types";

interface SystemCardProps {
  system: AISystem;
  session: QuickComplySession | null;
  isAllowed: boolean;
  isNext: boolean;
  isCompleted: boolean;
  sessionLimitReached: boolean;
  tierDisplayName: string;
  maxSystems: number;
  onSelect: (systemId: string, sessionId?: string) => void;
}

export function SystemCard({
  system,
  session,
  isAllowed,
  isNext,
  isCompleted,
  sessionLimitReached,
  tierDisplayName,
  maxSystems,
  onSelect,
}: SystemCardProps) {
  const router = useRouter();
  const inProgress = !!session && !isCompleted;
  const meta = RISK_META[system.risk_level] || RISK_META.minimal;

  const progressPct = inProgress
    ? session.progress_percentage
    : isCompleted
      ? 100
      : system.compliance_progress ?? 0;

  // Document count from assessment data or fallback to risk meta
  const docCount =
    system.assessment_data &&
    typeof system.assessment_data === "object" &&
    Array.isArray(system.assessment_data.documents_needed)
      ? system.assessment_data.documents_needed.length
      : meta.docs;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 bg-primary p-5 transition-all sm:p-6 ${
        !isAllowed
          ? "border-secondary opacity-60"
          : isNext
            ? "border-brand-300 shadow-md ring-1 ring-brand-100"
            : isCompleted
              ? "border-secondary"
              : "border-secondary hover:border-primary hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {/* Name + Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-primary">
              {system.name}
            </h3>
            <RiskBadge level={system.risk_level} />
            {isCompleted && (
              <TickCircle
                size={18}
                color="currentColor"
                className="shrink-0 text-success-600"
                variant="Bold"
              />
            )}
            {!isAllowed && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-700">
                <Lock1 size={10} color="currentColor" />
                Locked
              </span>
            )}
            {isNext && isAllowed && (
              <span className="inline-flex items-center rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                Up Next
              </span>
            )}
          </div>

          {/* Contextual description per state */}
          <p className="mt-1.5 text-sm leading-snug text-tertiary">
            {!isAllowed ? (
              <>
                This system requires a plan upgrade. Your {tierDisplayName} plan
                allows up to {maxSystems} system
                {maxSystems !== 1 ? "s" : ""}.
              </>
            ) : isCompleted ? (
              <>
                All {docCount} compliance documents have been generated and are
                ready to download.
              </>
            ) : inProgress ? (
              <>
                You&apos;re currently on{" "}
                <span className="font-medium text-primary">
                  {formatSectionName(session.current_section)}
                </span>
                . Pick up right where you left off.
              </>
            ) : (
              <>
                Answer a few questions about this system and we&apos;ll
                generate {docCount} compliance document
                {docCount !== 1 ? "s" : ""} for you.
              </>
            )}
          </p>

          {/* Meta info row */}
          {isAllowed && !isCompleted && (
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-tertiary">
              <span className="flex items-center gap-1">
                <DocumentText size={12} color="currentColor" />
                {docCount} document{docCount !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} color="currentColor" />
                {meta.estimatedTime}
              </span>
              <span>Deadline: {meta.deadline}</span>
            </div>
          )}

          {/* Progress bar */}
          {isAllowed && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-tertiary">
                  {isCompleted
                    ? "Compliance complete"
                    : inProgress
                      ? `${progressPct}% complete`
                      : "Not started yet"}
                </span>
                <span
                  className={`font-medium ${
                    isCompleted
                      ? "text-success-primary"
                      : progressPct > 0
                        ? "text-brand-tertiary"
                        : "text-tertiary"
                  }`}
                >
                  {progressPct}%
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCompleted
                      ? "bg-success-500"
                      : progressPct > 0
                        ? "bg-brand-500"
                        : "bg-quaternary"
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex shrink-0 flex-col items-end gap-1.5 pt-0.5">
          {!isAllowed ? (
            <Button
              color="secondary"
              size="sm"
              iconLeading={
                <Crown1 size={14} color="currentColor" variant="Bold" />
              }
              onClick={() => router.push("/settings/billing")}
            >
              Upgrade
            </Button>
          ) : isCompleted ? (
            <Button
              color="secondary"
              size="sm"
              onClick={() => router.push("/ai-systems")}
            >
              View Details
            </Button>
          ) : inProgress ? (
            <>
              <Button
                color="primary"
                size="sm"
                iconTrailing={
                  <ArrowRight2 size={14} color="currentColor" />
                }
                onClick={() => onSelect(system.id, session.id)}
              >
                Resume
              </Button>
              <span className="text-[10px] text-tertiary">
                Opens guided chat
              </span>
            </>
          ) : sessionLimitReached ? (
            <>
              <Button
                color="secondary"
                size="sm"
                isDisabled
                iconLeading={
                  <Crown1 size={14} color="currentColor" variant="Bold" />
                }
                onClick={() => router.push("/settings/billing")}
              >
                Session Limit
              </Button>
              <span className="text-[10px] text-tertiary">
                Upgrade for more
              </span>
            </>
          ) : (
            <>
              <Button
                color={isNext ? "primary" : "secondary"}
                size="sm"
                iconTrailing={
                  <ArrowRight2 size={14} color="currentColor" />
                }
                onClick={() => onSelect(system.id)}
              >
                {isNext ? "Start" : "Begin"}
              </Button>
              <span className="text-[10px] text-tertiary">
                Opens guided chat
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function formatSectionName(section: string | null): string {
  if (!section) return "Getting Started";
  const names: Record<string, string> = {
    company_info: "Company Info",
    ai_system_details: "AI System Details",
    risk_and_data: "Risk & Data",
    human_oversight: "Human Oversight",
    testing_metrics: "Testing & Metrics",
    transparency: "Transparency",
    review_generate: "Review & Generate",
    welcome: "Welcome",
  };
  return names[section] || section;
}
