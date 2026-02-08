/**
 * DocumentPreviewCard - Shows a preview of a compliance document
 */

"use client";

import { useState } from "react";
import { cx } from "@/utils/cx";

interface DocumentPreviewCardProps {
  documentTitle: string;
  documentType: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
}

export function DocumentPreviewCard({
  documentTitle,
  sections,
}: DocumentPreviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Guard against undefined sections (tool call still streaming)
  if (!sections || !Array.isArray(sections)) {
    return (
      <div className="qc-shimmer flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
        <div className="h-2 w-2 animate-pulse rounded-full bg-brand-400" />
        <span className="text-sm text-tertiary">Loading document preview...</span>
      </div>
    );
  }

  const previewSections = isExpanded ? sections : sections.slice(0, 2);

  return (
    <div className="overflow-hidden rounded-xl border border-secondary shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-secondary bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-brand-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
          <span className="text-sm font-semibold text-primary">
            Document Preview
          </span>
        </div>
        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-medium text-brand-700">
          Preview
        </span>
      </div>

      {/* Document Title */}
      <div className="border-b border-secondary px-4 py-3">
        <h4 className="text-base font-bold text-primary">{documentTitle}</h4>
      </div>

      {/* Document Sections */}
      <div className="divide-y divide-gray-100 px-4">
        {previewSections.map((section, index) => (
          <div key={index} className="py-3">
            <h5 className="text-xs font-semibold uppercase tracking-wide text-tertiary">
              {section.title}
            </h5>
            <p className="mt-1.5 text-sm leading-relaxed text-secondary">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* Expand/Collapse */}
      {sections.length > 2 && (
        <div className="border-t border-secondary px-4 py-2.5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            {isExpanded ? "Show Less" : `Show ${sections.length - 2} More Sections`}
            <svg
              className={cx(
                "h-3 w-3 transition-transform",
                isExpanded && "rotate-180"
              )}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
