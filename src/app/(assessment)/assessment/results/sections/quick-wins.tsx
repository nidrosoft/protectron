"use client";

import { useState } from "react";
import { cx } from "@/utils/cx";
import { Flash, TickCircle, DocumentDownload, Share, UserAdd, Cpu, Document } from "iconsax-react";

interface QuickWinsProps {
  onDownloadReport: () => void;
  onGoToDashboard: () => void;
  totalSystems: number;
}

interface QuickWin {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: typeof Flash;
  action?: () => void;
  actionLabel?: string;
  isCompleted?: boolean;
}

export function QuickWins({ onDownloadReport, onGoToDashboard, totalSystems }: QuickWinsProps) {
  const [completedWins, setCompletedWins] = useState<Set<string>>(new Set(["win-1"])); // First one is auto-completed

  const quickWins: QuickWin[] = [
    {
      id: "win-1",
      title: "Download this report",
      description: "Save your assessment results as a PDF to share with your team",
      time: "Done!",
      icon: DocumentDownload,
      isCompleted: true,
    },
    {
      id: "win-2",
      title: "Share with your CTO/Legal team",
      description: "Forward the PDF to stakeholders who need to know about compliance",
      time: "2 min",
      icon: Share,
    },
    {
      id: "win-3",
      title: "Create your Protectron account",
      description: "Set up your dashboard to start tracking compliance progress",
      time: "3 min",
      icon: UserAdd,
      action: onGoToDashboard,
      actionLabel: "Create Account",
    },
    {
      id: "win-4",
      title: "Register your first AI system",
      description: `Add one of your ${totalSystems} identified AI systems to start tracking`,
      time: "5 min",
      icon: Cpu,
    },
    {
      id: "win-5",
      title: "Generate your first document",
      description: "Use AI to create a Risk Assessment or Technical Documentation draft",
      time: "10 min",
      icon: Document,
    },
  ];

  const completedCount = completedWins.size;
  const totalWins = quickWins.length;
  const progressPercent = (completedCount / totalWins) * 100;

  const toggleComplete = (id: string) => {
    const newCompleted = new Set(completedWins);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedWins(newCompleted);
  };

  return (
    <section className="mb-8 sm:mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-100 dark:bg-warning-900/30 text-warning-600">
          <Flash size={20} color="currentColor" variant="Bold" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary dark:text-white sm:text-xl">
            Quick Wins — Start Today
          </h2>
          <p className="text-sm text-tertiary dark:text-gray-400">
            These take less than 30 minutes and immediately improve your compliance posture
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 rounded-lg bg-gray-100 dark:bg-gray-800 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-primary dark:text-white">
            Quick Wins Progress
          </span>
          <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
            {completedCount}/{totalWins} completed
          </span>
        </div>
        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Quick Wins List */}
      <div className="space-y-3">
        {quickWins.map((win, index) => {
          const isCompleted = completedWins.has(win.id);
          const Icon = win.icon;
          
          return (
            <div
              key={win.id}
              className={cx(
                "rounded-xl border-2 p-4 transition-all duration-300",
                isCompleted 
                  ? "border-success-300 dark:border-success-700 bg-success-50 dark:bg-success-900/10" 
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand-300 dark:hover:border-brand-700"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(win.id)}
                  className={cx(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all mt-0.5",
                    isCompleted 
                      ? "border-success-500 bg-success-500" 
                      : "border-gray-300 dark:border-gray-600 hover:border-brand-500"
                  )}
                >
                  {isCompleted && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={isCompleted ? "text-success-600" : "text-brand-600"}>
                        <Icon size={16} color="currentColor" variant="Bold" />
                      </span>
                      <h3 className={cx(
                        "text-sm font-semibold",
                        isCompleted 
                          ? "text-success-700 dark:text-success-300 line-through" 
                          : "text-primary dark:text-white"
                      )}>
                        {index + 1}. {win.title}
                      </h3>
                    </div>
                    <span className={cx(
                      "shrink-0 px-2 py-0.5 rounded text-xs font-medium",
                      isCompleted 
                        ? "bg-success-200 dark:bg-success-800 text-success-700 dark:text-success-300" 
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    )}>
                      {win.time}
                    </span>
                  </div>
                  <p className={cx(
                    "text-sm mt-1",
                    isCompleted 
                      ? "text-success-600 dark:text-success-400" 
                      : "text-tertiary dark:text-gray-400"
                  )}>
                    {win.description}
                  </p>
                  
                  {/* Action Button */}
                  {win.action && !isCompleted && (
                    <button
                      onClick={win.action}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors"
                    >
                      {win.actionLabel}
                      <Flash size={12} color="currentColor" variant="Bold" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Encouragement */}
      {completedCount === totalWins && (
        <div className="mt-4 rounded-lg bg-success-100 dark:bg-success-900/30 border border-success-300 dark:border-success-700 p-4 text-center">
          <p className="text-sm font-semibold text-success-800 dark:text-success-200">
            🎉 All Quick Wins completed! You're off to a great start.
          </p>
        </div>
      )}
    </section>
  );
}
