/**
 * ChatInput - Message input area with send button
 */

"use client";

import { useRef, type FormEvent, type KeyboardEvent } from "react";
import { cx } from "@/utils/cx";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({
  input,
  setInput,
  handleSubmit,
  isLoading,
  disabled = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || disabled) return;
    handleSubmit(e);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading && !disabled) {
        const form = textareaRef.current?.closest("form");
        if (form) {
          form.requestSubmit();
        }
      }
    }
  };

  // Auto-resize textarea
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  };

  return (
    <form onSubmit={onSubmit} className="relative">
      <div className="flex items-end gap-2 rounded-2xl border border-secondary bg-primary p-2 shadow-xs transition-colors focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-100">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleInput();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message or select an option above..."
          disabled={isLoading || disabled}
          rows={1}
          className={cx(
            "max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-primary outline-none placeholder:text-quaternary",
            (isLoading || disabled) && "opacity-50"
          )}
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          className={cx(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all",
            input.trim() && !isLoading && !disabled
              ? "bg-brand-600 text-white shadow-sm hover:bg-brand-700"
              : "bg-gray-100 text-gray-400"
          )}
          aria-label="Send message"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
          ) : (
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
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          )}
        </button>
      </div>

      <p className="mt-1.5 text-center text-xs text-quaternary">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
}
