/**
 * CompletionCard - Shown when Quick Comply is fully complete
 *
 * Displays a celebration state with confetti effect, generated document list,
 * and next step actions (view dashboard, download docs, etc.)
 */

"use client";

import { useState, useEffect } from "react";
import { cx } from "@/utils/cx";

interface CompletionCardProps {
  documents: Array<{
    id: string;
    type: string;
    title: string;
    status: string;
  }>;
  aiSystemName: string;
  riskLevel: string;
  complianceScore?: number;
}

export function CompletionCard({
  documents,
  aiSystemName,
  riskLevel,
  complianceScore = 85,
}: CompletionCardProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [expandedDocs, setExpandedDocs] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const riskConfig: Record<string, { color: string; bg: string; label: string }> = {
    minimal: { color: "text-success-700", bg: "bg-success-50", label: "Minimal Risk" },
    limited: { color: "text-brand-700", bg: "bg-brand-50", label: "Limited Risk" },
    high: { color: "text-warning-700", bg: "bg-warning-50", label: "High Risk" },
    prohibited: { color: "text-error-700", bg: "bg-error-50", label: "Prohibited" },
  };

  const risk = riskConfig[riskLevel] || riskConfig.minimal;
  const readyDocs = documents.filter((d) => d.status !== "error");
  const errorDocs = documents.filter((d) => d.status === "error");

  return (
    <div className="qc-tool-card relative overflow-hidden rounded-2xl border border-success-200 bg-gradient-to-br from-success-50 via-white to-brand-50 p-6 shadow-lg">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
                fontSize: `${10 + Math.random() * 14}px`,
                opacity: 0.8,
              }}
            >
              {["🎉", "✨", "🎊", "⭐", "🏆"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="relative text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100 ring-4 ring-success-50">
          <svg
            className="h-8 w-8 text-success-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
            />
          </svg>
        </div>

        <h3 className="mt-4 text-xl font-bold text-primary">
          Compliance Complete!
        </h3>
        <p className="mt-1 text-sm text-tertiary">
          <strong>{aiSystemName}</strong> has been fully assessed
        </p>

        {/* Risk + Score badges */}
        <div className="mt-3 flex items-center justify-center gap-3">
          <span
            className={cx(
              "rounded-full px-3 py-1 text-xs font-semibold",
              risk.bg,
              risk.color
            )}
          >
            {risk.label}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            Score: {complianceScore}%
          </span>
        </div>
      </div>

      {/* Documents Generated */}
      <div className="mt-6">
        <button
          onClick={() => setExpandedDocs(!expandedDocs)}
          className="flex w-full items-center justify-between rounded-lg bg-white/60 px-4 py-3 text-left transition-colors hover:bg-white/80"
        >
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-success-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              />
            </svg>
            <span className="text-sm font-semibold text-primary">
              {readyDocs.length} Documents Generated
            </span>
          </div>
          <svg
            className={cx(
              "h-4 w-4 text-gray-400 transition-transform",
              expandedDocs && "rotate-180"
            )}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {expandedDocs && (
          <div className="mt-2 space-y-1.5 px-1">
            {readyDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-2 rounded-lg bg-white/50 px-3 py-2"
              >
                <svg
                  className="h-4 w-4 shrink-0 text-success-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <span className="text-sm text-primary">{doc.title}</span>
                <span className="ml-auto text-xs text-tertiary capitalize">
                  {doc.status === "generating" ? "Processing..." : doc.status}
                </span>
              </div>
            ))}
            {errorDocs.length > 0 && (
              <p className="px-3 text-xs text-error-600">
                {errorDocs.length} document(s) had errors. You can regenerate them from the dashboard.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
        <a
          href="/dashboard"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          Go to Dashboard
        </a>
        <a
          href="/documents"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-gray-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          View Documents
        </a>
      </div>
    </div>
  );
}
