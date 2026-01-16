"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TickCircle, ArrowRight2, ArrowDown2, ArrowUp2 } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { useWalkthrough } from "@/contexts/walkthrough-context";
import { calculateTaskProgress } from "@/lib/walkthrough/getting-started-tasks";

interface GettingStartedChecklistProps {
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function GettingStartedChecklist({
  className,
  collapsible = true,
  defaultCollapsed = false,
}: GettingStartedChecklistProps) {
  const router = useRouter();
  const { gettingStartedTasks, status } = useWalkthrough();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Don't show if walkthrough is completed and all tasks are done
  const { completed, total, percentage } = calculateTaskProgress(gettingStartedTasks);
  
  if (status === "completed" && percentage === 100) {
    return null;
  }

  // Don't show if no tasks
  if (gettingStartedTasks.length === 0) {
    return null;
  }

  const handleTaskClick = (href?: string) => {
    if (href) {
      router.push(href);
    }
  };

  const iconMap: Record<string, string> = {
    "📋": "📋",
    "👤": "👤",
    "🤖": "🤖",
    "📄": "📄",
    "✅": "✅",
  };

  return (
    <div className={cx(
      "rounded-xl border border-secondary dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden",
      className
    )}>
      {/* Header */}
      <div 
        className={cx(
          "flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-900/10 border-b border-brand-200 dark:border-brand-800",
          collapsible && "cursor-pointer"
        )}
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🚀</span>
          <div>
            <h3 className="text-sm font-semibold text-primary dark:text-white">
              Getting Started
            </h3>
            <p className="text-xs text-tertiary dark:text-gray-400">
              {completed}/{total} completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Progress ring */}
          <div className="relative h-10 w-10">
            <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${percentage} 100`}
                strokeLinecap="round"
                className="text-brand-500 transition-all duration-500"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-brand-600">
              {percentage}%
            </span>
          </div>
          {collapsible && (
            isCollapsed ? (
              <ArrowDown2 size={16} className="text-tertiary" />
            ) : (
              <ArrowUp2 size={16} className="text-tertiary" />
            )
          )}
        </div>
      </div>

      {/* Tasks */}
      {!isCollapsed && (
        <div className="p-3 space-y-2">
          {gettingStartedTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => !task.isCompleted && handleTaskClick(task.href)}
              disabled={task.isCompleted}
              className={cx(
                "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                task.isCompleted
                  ? "border-success-200 dark:border-success-800 bg-success-50 dark:bg-success-900/10 cursor-default"
                  : "border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
              )}
            >
              {/* Checkbox */}
              <div className={cx(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                task.isCompleted
                  ? "border-success-500 bg-success-500"
                  : "border-gray-300 dark:border-gray-600"
              )}>
                {task.isCompleted && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Icon */}
              <span className="text-lg">{iconMap[task.icon] || task.icon}</span>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={cx(
                  "text-sm font-medium",
                  task.isCompleted
                    ? "text-success-700 dark:text-success-300 line-through"
                    : "text-primary dark:text-white"
                )}>
                  {task.title}
                </p>
                <p className="text-xs text-tertiary dark:text-gray-400 truncate">
                  {task.description}
                </p>
              </div>

              {/* Arrow for incomplete tasks */}
              {!task.isCompleted && task.href && (
                <ArrowRight2 size={16} className="text-tertiary shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Footer CTA when collapsed */}
      {isCollapsed && percentage < 100 && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <Button
            size="sm"
            color="secondary"
            className="w-full"
            onClick={() => setIsCollapsed(false)}
          >
            View Tasks
          </Button>
        </div>
      )}
    </div>
  );
}
