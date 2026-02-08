/**
 * QuickComplyChat - Main chat component
 *
 * Orchestrates the chat interface, integrating the useQuickComply hook,
 * chat messages, input, and the progress panel.
 *
 * Uses AI SDK v6 API:
 * - sendMessage({ text }) instead of append
 * - status instead of isLoading
 * - Manages input state locally with useState
 */

"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useQuickComply } from "../hooks/use-quick-comply";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ProgressPanel } from "./ProgressPanel";
import { MobileProgressDrawer } from "./MobileProgressDrawer";
import { cx } from "@/utils/cx";
import type { SectionId } from "@/lib/quick-comply/types";

interface QuickComplyChatProps {
  initialSessionId?: string | null;
  aiSystemId?: string | null;
}

export function QuickComplyChat({ initialSessionId, aiSystemId }: QuickComplyChatProps) {
  const {
    messages,
    sendMessage,
    status,
    error,

    // Session state
    sessionId,
    isLoadingSession,
    progress,
    currentSection,
    sectionsCompleted,
    riskLevel,
    aiSystemName,
    subscriptionTier,

    // Actions
    submitToolOutput,
    sendEditMessage,
    saveAndExit,
  } = useQuickComply({
    sessionId: initialSessionId,
    aiSystemId: aiSystemId || undefined,
  });

  // Manage input state locally (AI SDK v6)
  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const isLoading = status === "submitted" || status === "streaming";

  // Jump to a previously completed section via chat message
  const handleJumpToSection = useCallback(
    (section: SectionId) => {
      if (isLoading) return;
      const sectionNames: Record<string, string> = {
        company_info: "Company Info",
        ai_system_details: "AI System Details",
        risk_and_data: "Risk & Data",
        human_oversight: "Human Oversight",
        testing_metrics: "Testing & Metrics",
        transparency: "Transparency",
        review_generate: "Review & Generate",
      };
      const name = sectionNames[section] || section;
      sendMessage({
        text: `I want to review my answers in the "${name}" section. Please navigate me there so I can review or update my responses.`,
      });
    },
    [sendMessage, isLoading]
  );

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send initial message to start or resume the conversation
  useEffect(() => {
    if (!isLoadingSession && !hasInitialized.current && messages.length === 0) {
      hasInitialized.current = true;

      // If we have progress, we're resuming — ask the AI to continue
      if (sectionsCompleted.length > 0 || progress.overall > 0) {
        sendMessage({
          text: `Resume the Quick Comply process. The user has already completed sections: ${sectionsCompleted.join(", ") || "none"}. Current section is "${currentSection}" with ${progress.overall}% overall progress. Continue from where they left off.`,
        });
      } else {
        sendMessage({
          text: "Start the Quick Comply process. Ask me the first question.",
        });
      }
    }
  }, [isLoadingSession, messages.length, sendMessage, sectionsCompleted, progress.overall, currentSection]);

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  // Show loading state
  if (isLoadingSession) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-gray-200 border-t-brand-600" />
          <p className="text-sm text-tertiary">Loading your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Chat Panel - takes remaining space */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-secondary px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100">
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
                  d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-primary">Quick Comply</h2>
              <p className="text-xs text-tertiary">Guided by AI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status indicator */}
            <div className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1">
              <span
                className={cx(
                  "h-2 w-2 rounded-full",
                  status === "streaming"
                    ? "animate-pulse bg-brand-500"
                    : status === "submitted"
                      ? "animate-pulse bg-yellow-500"
                      : status === "error"
                        ? "bg-error-500"
                        : "bg-success-500"
                )}
              />
              <span className="text-xs text-tertiary">
                {status === "streaming"
                  ? "AI is responding..."
                  : status === "submitted"
                    ? "Processing..."
                    : status === "error"
                      ? "Error occurred"
                      : "Ready"}
              </span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-6 py-4 lg:px-10"
        >
          <div className="mx-auto max-w-4xl space-y-4">
            {/* Welcome message for new sessions */}
            {messages.length === 0 && (
              <WelcomeMessage subscriptionTier={subscriptionTier} />
            )}

            {/* Chat messages */}
            {messages
              .filter((m) => {
                // Hide the initial trigger messages (start / resume)
                if (m.role === "user") {
                  const textParts = m.parts.filter((p) => p.type === "text");
                  if (textParts.length === 1 && textParts[0].type === "text") {
                    const txt = textParts[0].text;
                    if (
                      txt.startsWith("Start the Quick Comply process") ||
                      txt.startsWith("Resume the Quick Comply process") ||
                      txt.startsWith("I want to change my answer for")
                    ) {
                      return false;
                    }
                  }
                }
                return true;
              })
              .map((message, index, arr) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  submitToolOutput={submitToolOutput}
                  onEdit={sendEditMessage}
                  isLastMessage={
                    index === arr.length - 1 || index === arr.length - 2
                  }
                  isLoading={isLoading}
                />
              ))}

            {/* Streaming indicator */}
            {isLoading && (
              <div className="qc-msg-ai flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-200">
                  <svg
                    className="h-4 w-4 animate-spin"
                    style={{ animationDuration: "3s" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
                  <div className="qc-typing-dot h-1.5 w-1.5 rounded-full bg-gray-400" />
                  <div className="qc-typing-dot h-1.5 w-1.5 rounded-full bg-gray-400" />
                  <div className="qc-typing-dot h-1.5 w-1.5 rounded-full bg-gray-400" />
                </div>
              </div>
            )}

            {/* Error message with retry */}
            {error && (
              <div className="qc-tool-card rounded-xl border border-error-200 bg-error-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-error-100">
                    <svg className="h-4 w-4 text-error-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-error-700">
                      Something went wrong
                    </p>
                    <p className="mt-1 text-xs text-error-600">
                      {error.message?.includes("token_limit")
                        ? "You've reached your monthly token limit. Upgrade your plan to continue."
                        : error.message?.includes("timeout") || error.message?.includes("AbortError")
                          ? "The request timed out. This can happen with complex responses."
                          : error.message || "An unexpected error occurred. Please try again."}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => {
                          sendMessage({ text: "Please continue where you left off." });
                        }}
                        className="rounded-lg bg-error-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-error-700"
                      >
                        Retry
                      </button>
                      {error.message?.includes("token_limit") && (
                        <a
                          href="/settings/billing"
                          className="rounded-lg border border-error-300 px-3 py-1.5 text-xs font-medium text-error-700 transition-colors hover:bg-error-100"
                        >
                          Upgrade Plan
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-secondary bg-primary px-6 py-4 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <ChatInput
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Progress Panel - fixed width sidebar, hidden on mobile */}
      <div className="hidden w-[300px] shrink-0 border-l border-secondary bg-primary lg:block xl:w-[320px]">
        <ProgressPanel
          progress={progress}
          currentSection={currentSection}
          sectionsCompleted={sectionsCompleted}
          aiSystemName={aiSystemName}
          riskLevel={riskLevel}
          onSaveAndExit={saveAndExit}
          onJumpToSection={handleJumpToSection}
        />
      </div>

      {/* Mobile Progress Drawer - visible only on small screens */}
      <MobileProgressDrawer
        progress={progress}
        currentSection={currentSection}
        sectionsCompleted={sectionsCompleted}
        aiSystemName={aiSystemName}
        riskLevel={riskLevel}
        onSaveAndExit={saveAndExit}
        onJumpToSection={handleJumpToSection}
      />
    </div>
  );
}

// ============================================================================
// Welcome Message
// ============================================================================

function WelcomeMessage({ subscriptionTier }: { subscriptionTier: string }) {
  return (
    <div className="flex flex-col items-center pb-6 pt-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100">
        <svg
          className="h-8 w-8 text-brand-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
          />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-bold text-primary">
        Quick Comply with AI
      </h2>
      <p className="mt-2 max-w-md text-sm text-tertiary">
        I&apos;ll guide you through EU AI Act compliance in about 45 minutes.
        Just answer my questions and I&apos;ll generate all your compliance
        documents automatically.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-secondary">
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          ~45 minutes
        </span>
        <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-secondary">
          <svg
            className="h-3 w-3"
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
          7+ documents
        </span>
        <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-secondary">
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
            />
          </svg>
          Resume anytime
        </span>
      </div>
      {subscriptionTier === "free" && (
        <p className="mt-3 rounded-lg bg-warning-50 px-4 py-2 text-xs text-warning-700">
          Free plan: Full assessment included. Upgrade to generate compliance
          documents.
        </p>
      )}
    </div>
  );
}
