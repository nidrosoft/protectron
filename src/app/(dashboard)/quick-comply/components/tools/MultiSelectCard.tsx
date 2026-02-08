/**
 * MultiSelectCard - Renders checkbox options for multiple selections
 */

"use client";

import { useState } from "react";
import { cx } from "@/utils/cx";

interface MultiSelectCardProps {
  toolCallId: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    warning?: boolean;
  }>;
  fieldKey: string;
  section: string;
  minSelections?: number;
  isComplete: boolean;
  result: unknown;
  onSubmit: (values: string[]) => void;
  onEdit?: (fieldKey: string, section: string, newValue: string, oldValue: string) => void;
  isInteractive: boolean;
  isLoading?: boolean;
}

export function MultiSelectCard({
  options,
  fieldKey,
  section,
  minSelections,
  isComplete,
  result,
  onSubmit,
  onEdit,
  isInteractive,
  isLoading,
}: MultiSelectCardProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);

  const submittedValues = isComplete
    ? ((result as Record<string, unknown>)?.selected as string[])
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

  // Determine grid layout based on option complexity
  // NOTE: Must be computed before any early returns that reference it
  const hasDescriptions = options.some((o) => o.description);
  const gridCols = hasDescriptions
    ? "grid-cols-1 sm:grid-cols-2"
    : options.length <= 4
      ? "grid-cols-2"
      : "grid-cols-2 sm:grid-cols-3";

  const toggleOption = (value: string) => {
    if (!isInteractive && !isEditing) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    const values = Array.from(selected);
    if (minSelections && values.length < minSelections) return;
    onSubmit(values);
  };

  const canEdit = isComplete && !isLoading && !!onEdit;

  const handleEditSubmit = () => {
    const values = Array.from(selected);
    if (minSelections && values.length < minSelections) return;
    if (onEdit && submittedValues) {
      onEdit(fieldKey, section, values.join(", "), submittedValues.join(", "));
    }
    setIsEditing(false);
  };

  // Show submitted state (unless editing)
  if (isComplete && submittedValues && !isEditing) {
    return (
      <div className="space-y-1">
        {canEdit && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setSelected(new Set(submittedValues));
              }}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
              Change
            </button>
          </div>
        )}
        <div className={cx("grid gap-2", gridCols)}>
          {options.map((option) => {
            const isSelected = submittedValues.includes(option.value);
            return (
              <div
                key={option.value}
                className={cx(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2",
                  isSelected
                    ? "bg-brand-50 border border-brand-200"
                    : "opacity-40"
                )}
              >
                <div
                  className={cx(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded",
                    isSelected
                      ? "bg-brand-600"
                      : "border border-gray-300"
                  )}
                >
                  {isSelected && (
                    <svg
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
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
                <span
                  className={cx(
                    "text-sm",
                    isSelected ? "font-medium text-brand-700" : "text-gray-400"
                  )}
                >
                  {option.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {isEditing && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-brand-600">Update your selections:</span>
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
          const isSelected = selected.has(option.value);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value)}
              disabled={!isInteractive && !isEditing}
              className={cx(
                "qc-grid-item flex w-full items-start gap-2.5 rounded-lg border p-3 text-left transition-all",
                isSelected
                  ? "border-brand-300 bg-brand-50"
                  : isInteractive || isEditing
                  ? "border-secondary bg-primary hover:border-brand-200 hover:bg-brand-25"
                  : "border-gray-100 bg-gray-50 opacity-60"
              )}
            >
              {/* Checkbox */}
              <div
                className={cx(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors",
                  isSelected
                    ? "bg-brand-600"
                    : "border border-gray-300"
                )}
              >
                {isSelected && (
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
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

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cx(
                      "text-sm font-medium",
                      isSelected ? "text-brand-700" : "text-primary"
                    )}
                  >
                    {option.label}
                  </span>
                  {option.warning && (
                    <span className="rounded bg-warning-100 px-1 py-0.5 text-[10px] font-semibold text-warning-700">
                      High-Risk
                    </span>
                  )}
                </div>
                {option.description && (
                  <p className="mt-0.5 text-xs text-tertiary">
                    {option.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {(isInteractive || isEditing) && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-quaternary">
            {selected.size} selected
            {minSelections ? ` (min ${minSelections})` : ""}
          </p>
          <button
            type="button"
            onClick={isEditing ? handleEditSubmit : handleSubmit}
            disabled={
              selected.size === 0 ||
              (minSelections ? selected.size < minSelections : false)
            }
            className={cx(
              "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all",
              selected.size > 0 &&
                (!minSelections || selected.size >= minSelections)
                ? "bg-brand-600 text-white shadow-sm hover:bg-brand-700"
                : "bg-gray-100 text-gray-400"
            )}
          >
            {isEditing ? "Update" : "Confirm"}
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
