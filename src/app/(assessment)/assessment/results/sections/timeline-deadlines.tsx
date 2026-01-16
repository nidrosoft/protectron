"use client";

import { cx } from "@/utils/cx";
import { Calendar, Clock, Danger, TickCircle, Flag } from "iconsax-react";
import { AlertCircle, CheckCircle, Flag05 } from "@untitledui/icons";
import { formatDeadlineCountdown } from "../data/enhanced-risk-calculator";

interface TimelineDeadlinesProps {
  daysUntilDeadline: number;
  hasHighRisk: boolean;
}

export function TimelineDeadlines({ daysUntilDeadline, hasHighRisk }: TimelineDeadlinesProps) {
  const today = new Date();
  
  const deadlines = [
    {
      date: "February 2, 2025",
      title: "Prohibited AI practices banned",
      description: "AI systems that pose unacceptable risks are prohibited",
      status: new Date("2025-02-02") < today ? "passed" : "upcoming",
      isUserDeadline: false,
    },
    {
      date: "August 2, 2025",
      title: "GPAI transparency rules apply",
      description: "General-purpose AI models must meet transparency requirements",
      status: new Date("2025-08-02") < today ? "passed" : "upcoming",
      isUserDeadline: false,
    },
    {
      date: "August 2, 2026",
      title: "High-risk AI systems must comply",
      description: "Full compliance required for high-risk AI systems under Annex III",
      status: "current",
      isUserDeadline: hasHighRisk,
    },
    {
      date: "August 2, 2027",
      title: "All AI systems fully compliant",
      description: "Complete enforcement for all AI systems in regulated products",
      status: "future",
      isUserDeadline: !hasHighRisk,
    },
  ];

  const internalMilestones = [
    { date: "March 2026", label: "Complete documentation", buffer: "50% buffer" },
    { date: "May 2026", label: "Internal audit complete", buffer: "3 months buffer" },
    { date: "July 2026", label: "Final review and fixes", buffer: "1 month buffer" },
    { date: "August 2026", label: "Official deadline", buffer: "" },
  ];

  return (
    <section className="mb-8 sm:mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-100 dark:bg-warning-900/30 text-warning-600">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary dark:text-white sm:text-xl">
            EU AI Act Timeline & Your Deadlines
          </h2>
          <p className="text-sm text-tertiary dark:text-gray-400">
            Key dates and milestones for compliance
          </p>
        </div>
      </div>

      {/* Main Timeline Card */}
      <div className="rounded-xl border border-secondary dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6 mb-4">
        <div className="space-y-0">
          {deadlines.map((deadline, index) => (
            <TimelineItem
              key={index}
              deadline={deadline}
              isLast={index === deadlines.length - 1}
              daysRemaining={deadline.isUserDeadline ? daysUntilDeadline : undefined}
            />
          ))}
        </div>
      </div>

      {/* Your Deadline Highlight */}
      {hasHighRisk && (
        <div className="rounded-xl border-2 border-warning-400 dark:border-warning-600 bg-gradient-to-r from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-900/10 p-4 sm:p-6 mb-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-warning-200 dark:bg-warning-800 text-warning-700 dark:text-warning-300">
              <Danger size={24} color="currentColor" variant="Bold" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-warning-900 dark:text-warning-100 mb-1">
                Your Deadline: August 2, 2026
              </h3>
              <p className="text-sm text-warning-800 dark:text-warning-200 mb-3">
                {formatDeadlineCountdown(daysUntilDeadline)}. By this date, your high-risk AI systems must have:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Complete technical documentation",
                  "Implemented risk management system",
                  "Established data governance practices",
                  "Enabled audit logging",
                  "Documented human oversight procedures",
                  "Prepared transparency documentation",
                  "Conducted conformity assessment",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-warning-800 dark:text-warning-200">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-warning-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-warning-300 dark:border-warning-700">
                <p className="text-sm font-semibold text-warning-900 dark:text-warning-100">
                  Penalty for non-compliance: Up to €15 million or 3% of global annual revenue
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Internal Milestones */}
      <div className="rounded-xl border border-secondary dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-primary dark:text-white mb-4 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
            <Calendar className="h-3 w-3 text-brand-600" />
          </span>
          Recommended Internal Milestones
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {internalMilestones.map((milestone, index) => (
            <div
              key={index}
              className={cx(
                "rounded-lg p-3 text-center border",
                index === internalMilestones.length - 1
                  ? "bg-warning-100 dark:bg-warning-900/30 border-warning-300 dark:border-warning-700"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              )}
            >
              <p className={cx(
                "text-sm font-semibold mb-1",
                index === internalMilestones.length - 1
                  ? "text-warning-700 dark:text-warning-300"
                  : "text-primary dark:text-white"
              )}>
                {milestone.date}
              </p>
              <p className="text-xs text-tertiary dark:text-gray-400">
                {milestone.label}
              </p>
              {milestone.buffer && (
                <p className="text-xs text-brand-600 dark:text-brand-400 mt-1">
                  ({milestone.buffer})
                </p>
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-center text-tertiary dark:text-gray-400">
          ⚡ Starting now gives you {Math.floor(daysUntilDeadline / 30)} months. Waiting adds risk.
        </p>
      </div>
    </section>
  );
}

interface TimelineItemProps {
  deadline: {
    date: string;
    title: string;
    description: string;
    status: string;
    isUserDeadline: boolean;
  };
  isLast: boolean;
  daysRemaining?: number;
}

function TimelineItem({ deadline, isLast, daysRemaining }: TimelineItemProps) {
  const isPassed = deadline.status === "passed";
  const isCurrent = deadline.status === "current";
  const isFuture = deadline.status === "future";

  return (
    <div className="relative flex items-start gap-4 pb-6">
      {/* Connector Line */}
      {!isLast && (
        <div className={cx(
          "absolute left-5 top-12 bottom-0 w-0.5",
          isPassed ? "bg-gray-300 dark:bg-gray-600" : "bg-gray-200 dark:bg-gray-700"
        )} />
      )}

      {/* Icon */}
      <div className={cx(
        "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
        isPassed && "bg-gray-100 dark:bg-gray-700",
        isCurrent && "bg-brand-100 dark:bg-brand-900/30 ring-2 ring-brand-600 ring-offset-2 ring-offset-white dark:ring-offset-gray-800",
        isFuture && "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
      )}>
        {isPassed && <CheckCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
        {isCurrent && <Flag05 className="h-5 w-5 text-brand-600" />}
        {isFuture && <AlertCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-center gap-2 mb-1">
          <p className={cx(
            "text-sm font-semibold",
            isPassed && "text-gray-500 dark:text-gray-400",
            isCurrent && "text-primary dark:text-white",
            isFuture && "text-tertiary dark:text-gray-300"
          )}>
            {deadline.date}
          </p>
          {deadline.isUserDeadline && daysRemaining !== undefined && (
            <span className="px-2 py-0.5 rounded-full bg-warning-100 dark:bg-warning-900/30 text-xs font-semibold text-warning-700 dark:text-warning-300">
              ← YOUR DEADLINE
            </span>
          )}
          {isPassed && (
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400">
              PASSED
            </span>
          )}
        </div>
        <p className={cx(
          "text-sm",
          isPassed && "text-gray-500 dark:text-gray-400",
          isCurrent && "text-primary dark:text-white font-medium",
          isFuture && "text-tertiary dark:text-gray-400"
        )}>
          {deadline.title}
        </p>
        <p className={cx(
          "text-xs mt-0.5",
          isPassed ? "text-gray-400 dark:text-gray-500" : "text-tertiary dark:text-gray-400"
        )}>
          {deadline.description}
        </p>
      </div>
    </div>
  );
}
