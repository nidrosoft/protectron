/**
 * TextInputCard - Renders a text input field in the chat
 */

"use client";

import { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { cx } from "@/utils/cx";

interface TextInputCardProps {
  toolCallId: string;
  question: string;
  fieldKey: string;
  section: string;
  placeholder?: string;
  multiline: boolean;
  inputType: "text" | "email" | "url";
  isComplete: boolean;
  result: unknown;
  onSubmit: (value: string) => void;
  onEdit?: (fieldKey: string, section: string, newValue: string, oldValue: string) => void;
  isInteractive: boolean;
  isLoading?: boolean;
}

export function TextInputCard({
  placeholder,
  multiline,
  inputType,
  fieldKey,
  section,
  isComplete,
  result,
  onSubmit,
  onEdit,
  isInteractive,
  isLoading,
}: TextInputCardProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const submittedValue = isComplete
    ? (result as Record<string, unknown>)?.text
    : null;

  const canEdit = isComplete && !isLoading && !!onEdit && !!submittedValue;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      setError("This field is required");
      return;
    }

    if (inputType === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);

    if (isEditing && onEdit && submittedValue) {
      onEdit(fieldKey, section, value.trim(), String(submittedValue));
      setIsEditing(false);
      setValue("");
    } else {
      onSubmit(value.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !multiline) {
      e.preventDefault();
      if (value.trim()) {
        const form = inputRef.current?.closest("form");
        if (form) form.requestSubmit();
      }
    }
  };

  // If already submitted and NOT editing, show the submitted value with Change button
  if (isComplete && submittedValue && !isEditing) {
    return (
      <div className="space-y-1">
        {canEdit && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setValue(String(submittedValue));
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
        <div className="qc-text-bubble rounded-xl border border-brand-100 bg-brand-25 p-3">
          <p className="text-sm text-brand-700">{String(submittedValue)}</p>
        </div>
      </div>
    );
  }

  if (!isInteractive && !isEditing) {
    return (
      <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 opacity-60">
        <p className="text-sm text-gray-400">{placeholder || "Enter your response..."}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="qc-tool-card space-y-2">
      {isEditing && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-brand-600">Update your answer:</span>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setValue("");
            }}
            className="text-[11px] font-medium text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        </div>
      )}
      <div className="rounded-xl border border-secondary bg-primary p-1 transition-colors focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            placeholder={placeholder || "Type your answer..."}
            rows={3}
            className="w-full resize-none rounded-lg bg-transparent px-3 py-2 text-sm text-primary outline-none placeholder:text-quaternary"
            autoFocus
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={inputType}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Type your answer..."}
            className="w-full rounded-lg bg-transparent px-3 py-2 text-sm text-primary outline-none placeholder:text-quaternary"
            autoFocus
          />
        )}
      </div>

      {error && <p className="text-xs text-error-600">{error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!value.trim()}
          className={cx(
            "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all",
            value.trim()
              ? "bg-brand-600 text-white shadow-sm hover:bg-brand-700"
              : "bg-gray-100 text-gray-400"
          )}
        >
          {isEditing ? "Update" : "Continue"}
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
    </form>
  );
}
