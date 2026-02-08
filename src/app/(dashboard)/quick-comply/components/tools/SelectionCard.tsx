/**
 * SelectionCard - Renders clickable selection options in the chat
 */

"use client";

import { useState } from "react";
import { cx } from "@/utils/cx";

interface SelectionCardProps {
  toolCallId: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    icon?: string;
  }>;
  fieldKey: string;
  section: string;
  isComplete: boolean;
  result: unknown;
  onSelect: (value: string) => void;
  onEdit?: (fieldKey: string, section: string, newValue: string, oldValue: string) => void;
  isInteractive: boolean;
  isLoading?: boolean;
}

export function SelectionCard({
  options,
  fieldKey,
  section,
  isComplete,
  result,
  onSelect,
  onEdit,
  isInteractive,
  isLoading,
}: SelectionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const selectedValue = isComplete
    ? (result as Record<string, unknown>)?.selected
    : null;

  // Guard against undefined options (tool call still streaming)
  if (!options || !Array.isArray(options) || options.length === 0) {
    return (
      <div className="qc-shimmer flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
        <div className="h-2 w-2 animate-pulse rounded-full bg-brand-400" />
        <span className="text-sm text-tertiary">Loading options...</span>
      </div>
    );
  }

  // Determine if any option has a description (use wider cards for those)
  const hasDescriptions = options.some((o) => o.description);

  // Grid columns: use 3 cols for simple options, 2 cols for options with descriptions
  const gridCols = hasDescriptions
    ? "grid-cols-1 sm:grid-cols-2"
    : options.length <= 2
      ? "grid-cols-2"
      : options.length <= 6
        ? "grid-cols-2 sm:grid-cols-3"
        : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  // Whether to show edit controls (completed, not currently loading, has onEdit)
  const canEdit = isComplete && !isLoading && !!onEdit;

  // Handle selecting a new value during edit
  const handleEditSelect = (newValue: string) => {
    if (onEdit && selectedValue && newValue !== selectedValue) {
      onEdit(fieldKey, section, newValue, String(selectedValue));
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-2">
      {/* Change button for completed cards */}
      {canEdit && !isEditing && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
            Change
          </button>
        </div>
      )}
      {isEditing && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-brand-600">Select a new answer:</span>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-[11px] font-medium text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        </div>
      )}

      <div className={cx("grid gap-2", gridCols)}>
        {options.map((option) => {
          const isSelected = selectedValue === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                if (isEditing) {
                  handleEditSelect(option.value);
                } else if (isInteractive) {
                  onSelect(option.value);
                }
              }}
              disabled={!isInteractive && !isEditing}
              className={cx(
                "qc-grid-item flex flex-col items-start rounded-xl border p-3 text-left transition-all",
                isSelected && !isEditing
                  ? "border-brand-300 bg-brand-50 ring-1 ring-brand-200"
                  : isComplete && !isEditing
                  ? "border-gray-100 bg-gray-50 opacity-50"
                  : isInteractive || isEditing
                  ? "border-secondary bg-primary hover:border-brand-200 hover:bg-brand-25 hover:shadow-sm cursor-pointer"
                  : "border-gray-100 bg-gray-50 opacity-60"
              )}
            >
              <div className="flex w-full items-center gap-2">
                {option.icon && (
                  <span className="text-base">{option.icon}</span>
                )}
                <span
                  className={cx(
                    "text-sm font-medium",
                    isSelected && !isEditing ? "text-brand-700" : "text-primary"
                  )}
                >
                  {option.label}
                </span>
                {isSelected && !isEditing && (
                  <svg
                    className="ml-auto h-4 w-4 shrink-0 text-brand-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                )}
              </div>
              {option.description && (
                <p className="mt-1 text-xs text-tertiary leading-relaxed">
                  {option.description}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
