/**
 * Section 6 - Stats & Subscription
 *
 * Overall progress stats and subscription limit warning.
 * Placed at the bottom since it's secondary to the educational content.
 */

"use client";

import { useRouter } from "next/navigation";
import { Crown1, Warning2, AddCircle, Timer1 } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import type { TierConfig } from "@/lib/subscription/config";

interface StatsAndSubscriptionProps {
  totalSystems: number;
  completedCount: number;
  lockedCount: number;
  tierConfig: TierConfig;
  sessionsUsedThisMonth: number;
  onStartFresh: () => void;
}

export function StatsAndSubscription({
  totalSystems,
  completedCount,
  lockedCount,
  tierConfig,
  sessionsUsedThisMonth,
  onStartFresh,
}: StatsAndSubscriptionProps) {
  const router = useRouter();
  const remaining = totalSystems - completedCount;

  const sessionLimit = tierConfig.quickComplySessionsPerMonth;
  const sessionLimitReached =
    sessionLimit !== -1 && sessionsUsedThisMonth >= sessionLimit;
  const sessionsRemaining =
    sessionLimit === -1 ? -1 : Math.max(0, sessionLimit - sessionsUsedThisMonth);

  return (
    <div className="space-y-4">
      {/* Progress Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatBox
          value={totalSystems}
          label={`Total System${totalSystems !== 1 ? "s" : ""}`}
          variant="default"
        />
        <StatBox value={completedCount} label="Completed" variant="success" />
        <StatBox value={remaining} label="Remaining" variant="warning" />
      </div>

      {/* Session Limit Warning */}
      {sessionLimitReached && (
        <div className="rounded-xl border border-secondary bg-error-primary p-5">
          <div className="flex items-start gap-3">
            <Timer1
              size={20}
              color="currentColor"
              className="mt-0.5 shrink-0 text-error-primary"
              variant="Bold"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary">
                Monthly session limit reached
              </p>
              <p className="mt-1 text-xs leading-relaxed text-secondary">
                You&apos;ve used all {sessionLimit} Quick Comply session
                {sessionLimit !== 1 ? "s" : ""} included in your{" "}
                {tierConfig.displayName} plan this month. Upgrade for unlimited
                sessions or wait until next month.
              </p>
              <div className="mt-3">
                <Button
                  color="primary"
                  size="sm"
                  iconLeading={
                    <Crown1 size={14} color="currentColor" variant="Bold" />
                  }
                  onClick={() => router.push("/settings/billing")}
                >
                  Upgrade for More Sessions
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Usage Info (when not at limit but limited) */}
      {!sessionLimitReached && sessionLimit !== -1 && (
        <p className="text-center text-xs text-tertiary">
          {sessionsRemaining} of {sessionLimit} Quick Comply session
          {sessionLimit !== 1 ? "s" : ""} remaining this month
        </p>
      )}

      {/* Subscription Warning */}
      {lockedCount > 0 && (
        <div className="rounded-xl border border-secondary bg-warning-primary p-5">
          <div className="flex items-start gap-3">
            <Warning2
              size={20}
              color="currentColor"
              className="mt-0.5 shrink-0 text-warning-primary"
              variant="Bold"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary">
                {lockedCount} system{lockedCount !== 1 ? "s" : ""} locked on
                your {tierConfig.displayName} plan
              </p>
              <p className="mt-1 text-xs leading-relaxed text-secondary">
                Your current plan allows compliance for up to{" "}
                {tierConfig.maxAISystems} AI system
                {tierConfig.maxAISystems !== 1 ? "s" : ""}. Upgrade to unlock
                all {totalSystems} systems and get access to additional features
                like advanced document generation, compliance badges, and
                priority support.
              </p>
              <div className="mt-3">
                <Button
                  color="primary"
                  size="sm"
                  iconLeading={
                    <Crown1 size={14} color="currentColor" variant="Bold" />
                  }
                  onClick={() => router.push("/settings/billing")}
                >
                  Upgrade Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New System */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <Button
          color="secondary"
          size="md"
          iconLeading={
            <AddCircle size={16} color="currentColor" variant="Bold" />
          }
          isDisabled={sessionLimitReached}
          onClick={onStartFresh}
        >
          Add New System via Chat
        </Button>
        <Button
          color="secondary"
          size="md"
          iconLeading={
            <AddCircle size={16} color="currentColor" variant="Bold" />
          }
          onClick={() => router.push("/ai-systems")}
        >
          Add Manually
        </Button>
      </div>
    </div>
  );
}

function StatBox({
  value,
  label,
  variant,
}: {
  value: number;
  label: string;
  variant: "default" | "success" | "warning";
}) {
  const borderStyles = {
    default: "border-secondary",
    success: "border-success-600/20 dark:border-success-400/20",
    warning: "border-warning-600/20 dark:border-warning-400/20",
  };
  const textStyles = {
    default: "text-primary",
    success: "text-success-primary",
    warning: "text-warning-primary",
  };
  return (
    <div
      className={`rounded-xl border bg-primary p-4 text-center ${borderStyles[variant]}`}
    >
      <p className={`text-2xl font-bold ${textStyles[variant]}`}>{value}</p>
      <p className="mt-0.5 text-xs text-tertiary">{label}</p>
    </div>
  );
}
