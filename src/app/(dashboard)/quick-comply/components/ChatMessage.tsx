/**
 * ChatMessage - Renders individual chat messages
 *
 * Handles both text messages and tool invocation rendering.
 * Tool invocations are rendered using their respective UI components.
 * Uses AI SDK v6 part types (tool-${toolName}, input/output, output-available).
 */

"use client";

import type { UIMessage } from "ai";
import { cx } from "@/utils/cx";
import { SelectionCard } from "./tools/SelectionCard";
import { TextInputCard } from "./tools/TextInputCard";
import { MultiSelectCard } from "./tools/MultiSelectCard";
import { DocumentPreviewCard } from "./tools/DocumentPreviewCard";
import { CompletionCard } from "./tools/CompletionCard";

interface ChatMessageProps {
  message: UIMessage;
  submitToolOutput: (
    toolName: string,
    toolCallId: string,
    output: unknown
  ) => void;
  onEdit?: (fieldKey: string, section: string, newValue: string, oldValue: string) => void;
  isLastMessage: boolean;
  isLoading?: boolean;
}

export function ChatMessage({
  message,
  submitToolOutput,
  onEdit,
  isLastMessage,
  isLoading,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cx(
        "flex w-full gap-3",
        isUser ? "justify-end qc-msg-user" : "justify-start qc-msg-ai"
      )}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-200">
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
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
            />
          </svg>
        </div>
      )}

      <div
        className={cx(
          "flex flex-col gap-2",
          isUser ? "max-w-[75%] items-end" : "max-w-[95%] items-start"
        )}
      >
        {/* Render message parts */}
        {message.parts.map((part, index) => {
          const key = `${message.id}-part-${index}`;

          try {
            // Text parts
            if (part.type === "text") {
            if (!part.text.trim()) return null;
            return (
              <div
                key={key}
                className={cx(
                  "qc-text-bubble rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  isUser
                    ? "bg-brand-600 text-white"
                    : "border border-gray-200 bg-white text-primary shadow-sm"
                )}
              >
                <MessageText text={part.text} />
              </div>
            );
            }

            // Skip non-visual parts (step boundaries, reasoning, sources, etc.)
            if (
              part.type === "step-start" ||
              part.type === "reasoning" ||
              part.type === "source-url" ||
              part.type === "source-document" ||
              part.type === "file"
            ) {
              return null;
            }

            // Dynamic tool parts (AI SDK v6: untyped tools use 'dynamic-tool')
            if (part.type === "dynamic-tool") {
              const dynPart = part as {
                type: string;
                toolCallId: string;
                toolName: string;
                state: string;
                input?: Record<string, unknown>;
                output?: unknown;
                errorText?: string;
              };

              return (
                <div key={key} className="w-full qc-tool-card">
                  <ToolInvocationRenderer
                    toolName={dynPart.toolName}
                    toolCallId={dynPart.toolCallId}
                    state={dynPart.state}
                    input={dynPart.input || {}}
                    output={
                      dynPart.state === "output-available"
                        ? dynPart.output
                        : undefined
                    }
                    submitToolOutput={submitToolOutput}
                    onEdit={onEdit}
                    isLastMessage={isLastMessage}
                    isLoading={isLoading}
                  />
                </div>
              );
            }

            // Tool parts (AI SDK v6: type is `tool-${toolName}`)
            if (part.type.startsWith("tool-")) {
              const toolName = part.type.replace("tool-", "");
              const toolPart = part as {
                type: string;
                toolCallId: string;
                state: string;
                input?: Record<string, unknown>;
                output?: unknown;
                errorText?: string;
              };

              return (
                <div key={key} className="w-full qc-tool-card">
                  <ToolInvocationRenderer
                    toolName={toolName}
                    toolCallId={toolPart.toolCallId}
                    state={toolPart.state}
                    input={toolPart.input || {}}
                    output={
                      toolPart.state === "output-available"
                        ? toolPart.output
                        : undefined
                    }
                    submitToolOutput={submitToolOutput}
                    onEdit={onEdit}
                    isLastMessage={isLastMessage}
                    isLoading={isLoading}
                  />
                </div>
              );
            }
          } catch (renderError) {
            console.error(
              `Error rendering part ${index} (type: ${part.type}):`,
              renderError,
              part
            );
            return null;
          }

          return null;
        })}
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 ring-1 ring-gray-200">
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
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Message Text Renderer (handles markdown-like formatting)
// ============================================================================

// Section transition pattern: detects lines like "Now let's move to **Section X: Name**"
const SECTION_TRANSITION_REGEX =
  /(?:move\s+to|let'?s\s+(?:dive\s+into|start|begin|move\s+on\s+to|continue\s+with|head\s+to|tackle))\s+\*\*(?:Section\s+\d+:\s+)?(.+?)\*\*/i;

function MessageText({ text }: { text: string }) {
  // Split into paragraphs on double newlines (or single newlines for chat style)
  const paragraphs = text.split(/\n\n+/);

  return (
    <>
      {paragraphs.map((paragraph, pi) => {
        // Check if this paragraph contains a section transition
        const transitionMatch = paragraph.match(SECTION_TRANSITION_REGEX);

        if (transitionMatch) {
          // Render the whole paragraph with a section divider above it
          return (
            <span key={pi} className="block">
              {pi > 0 && <span className="block h-2" />}
              {/* Section divider */}
              <span className="my-2 flex items-center gap-3 block">
                <span className="h-px flex-1 bg-brand-200" />
                <span className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 ring-1 ring-brand-200">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                  </svg>
                  {transitionMatch[1]}
                </span>
                <span className="h-px flex-1 bg-brand-200" />
              </span>
              <span className="block h-1" />
              {renderLines(paragraph)}
            </span>
          );
        }

        return (
          <span key={pi} className="block">
            {pi > 0 && <span className="block h-2" />}
            {renderLines(paragraph)}
          </span>
        );
      })}
    </>
  );
}

/**
 * Detect pattern: **Bold question?** followed by explanation text.
 * This is the AI's standard format: question + why it matters, all in one line.
 * We split them into a visually separated question + context block.
 */
const QUESTION_CONTEXT_REGEX = /^\*\*(.+?\??)\*\*\s+(.+)$/;

/** Render a paragraph's lines with markdown-like formatting */
function renderLines(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();

    // Markdown headings: ## Heading → styled heading
    if (trimmed.startsWith("## ")) {
      return (
        <span key={i} className="mt-2 mb-1 block text-sm font-bold text-primary">
          {renderInline(trimmed.slice(3))}
        </span>
      );
    }
    if (trimmed.startsWith("### ")) {
      return (
        <span key={i} className="mt-1.5 mb-0.5 block text-sm font-semibold text-primary">
          {renderInline(trimmed.slice(4))}
        </span>
      );
    }

    // List items: - item → bullet point
    if (trimmed.startsWith("- ")) {
      return (
        <span key={i} className="flex items-start gap-1.5 block">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
          <span>{renderInline(trimmed.slice(2))}</span>
        </span>
      );
    }

    // Question + context pattern: **Question?** This is why it matters.
    const qMatch = trimmed.match(QUESTION_CONTEXT_REGEX);
    if (qMatch) {
      const question = qMatch[1];
      const context = qMatch[2];
      return (
        <span key={i} className="block">
          {i > 0 && <span className="block h-1" />}
          <span className="block text-sm font-semibold text-primary">
            {question}
          </span>
          <span className="mt-1.5 flex items-start gap-1.5 block rounded-lg bg-gray-50 px-2.5 py-1.5">
            <svg
              className="mt-0.5 h-3 w-3 shrink-0 text-brand-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
            <span className="text-xs leading-relaxed text-gray-500">
              {context}
            </span>
          </span>
        </span>
      );
    }

    // Regular lines
    return (
      <span key={i}>
        {i > 0 && <br />}
        {renderInline(line)}
      </span>
    );
  });
}

/** Render inline formatting: **bold** */
function renderInline(text: string) {
  return text.split(/(\*\*.*?\*\*)/).map((segment, j) => {
    if (segment.startsWith("**") && segment.endsWith("**")) {
      return (
        <strong key={j} className="font-semibold">
          {segment.slice(2, -2)}
        </strong>
      );
    }
    return segment;
  });
}

// ============================================================================
// Tool Invocation Renderer
// ============================================================================

interface ToolInvocationRendererProps {
  toolName: string;
  toolCallId: string;
  state: string;
  input: Record<string, unknown>;
  output?: unknown;
  submitToolOutput: (
    toolName: string,
    toolCallId: string,
    output: unknown
  ) => void;
  onEdit?: (fieldKey: string, section: string, newValue: string, oldValue: string) => void;
  isLastMessage: boolean;
  isLoading?: boolean;
}

function ToolInvocationRenderer({
  toolName,
  toolCallId,
  state,
  input,
  output,
  submitToolOutput,
  onEdit,
  isLastMessage,
  isLoading,
}: ToolInvocationRendererProps) {
  const isComplete = state === "output-available";
  const isPending =
    state === "input-available" || state === "input-streaming";

  switch (toolName) {
    case "showSelection":
      return (
        <SelectionCard
          toolCallId={toolCallId}
          question={(input.question as string) || ""}
          options={
            (input.options as Array<{
              value: string;
              label: string;
              description?: string;
              icon?: string;
            }>) || []
          }
          fieldKey={(input.fieldKey as string) || ""}
          section={(input.section as string) || ""}
          isComplete={isComplete}
          result={output}
          onSelect={(value) =>
            submitToolOutput(toolName, toolCallId, {
              selected: value,
              fieldKey: input.fieldKey,
              section: input.section,
            })
          }
          onEdit={onEdit}
          isInteractive={isLastMessage && !isComplete && isPending}
          isLoading={isLoading}
        />
      );

    case "showTextInput":
      return (
        <TextInputCard
          toolCallId={toolCallId}
          question={(input.question as string) || ""}
          fieldKey={(input.fieldKey as string) || ""}
          section={(input.section as string) || ""}
          placeholder={input.placeholder as string | undefined}
          multiline={(input.multiline as boolean) || false}
          inputType={
            (input.inputType as "text" | "email" | "url") || "text"
          }
          isComplete={isComplete}
          result={output}
          onSubmit={(value) =>
            submitToolOutput(toolName, toolCallId, {
              text: value,
              fieldKey: input.fieldKey,
              section: input.section,
            })
          }
          onEdit={onEdit}
          isInteractive={isLastMessage && !isComplete && isPending}
          isLoading={isLoading}
        />
      );

    case "showMultiSelect":
      return (
        <MultiSelectCard
          toolCallId={toolCallId}
          question={(input.question as string) || ""}
          options={
            (input.options as Array<{
              value: string;
              label: string;
              description?: string;
              warning?: boolean;
            }>) || []
          }
          fieldKey={(input.fieldKey as string) || ""}
          section={(input.section as string) || ""}
          minSelections={input.minSelections as number | undefined}
          isComplete={isComplete}
          result={output}
          onSubmit={(values) =>
            submitToolOutput(toolName, toolCallId, {
              selected: values,
              fieldKey: input.fieldKey,
              section: input.section,
            })
          }
          onEdit={onEdit}
          isInteractive={isLastMessage && !isComplete && isPending}
          isLoading={isLoading}
        />
      );

    case "showDocumentPreview":
      return (
        <DocumentPreviewCard
          documentTitle={(input.documentTitle as string) || "Document Preview"}
          documentType={(input.documentType as string) || ""}
          sections={
            (input.sections as Array<{ title: string; content: string }>) || []
          }
        />
      );

    case "captureResponse":
    case "updateProgress":
    case "createAISystem":
    case "checkSubscription":
      // Server tools — show a subtle indicator while executing
      if (isPending) {
        return (
          <div className="qc-server-tool flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
            <div className="h-2 w-2 animate-pulse rounded-full bg-brand-400" />
            <span>
              {toolName === "captureResponse"
                ? "Saving your response..."
                : toolName === "updateProgress"
                  ? "Updating progress..."
                  : toolName === "createAISystem"
                    ? "Setting up your AI system..."
                    : "Checking subscription..."}
            </span>
          </div>
        );
      }
      // Once complete, hide the indicator
      return null;

    case "generateDocuments":
      if (isPending) {
        return (
          <div className="flex items-center gap-2 rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-700">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
            <span className="font-medium">
              Generating your compliance documents...
            </span>
          </div>
        );
      }
      if (isComplete && output) {
        const res = output as Record<string, unknown>;
        if (res.generated) {
          return (
            <div className="rounded-xl border border-success-200 bg-success-50 p-4">
              <div className="flex items-center gap-2 text-success-700">
                <svg
                  className="h-5 w-5"
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
                <span className="font-semibold">Documents Generated!</span>
              </div>
              <p className="mt-1 text-sm text-success-600">
                {res.message as string}
              </p>
            </div>
          );
        }
      }
      return null;

    case "showCompletion":
      if (isComplete && output) {
        const res = output as Record<string, unknown>;
        return (
          <CompletionCard
            documents={
              (res.documents as Array<{
                id: string;
                type: string;
                title: string;
                status: string;
              }>) || []
            }
            aiSystemName={(res.aiSystemName as string) || "Your AI System"}
            riskLevel={(res.riskLevel as string) || "minimal"}
            complianceScore={res.complianceScore as number | undefined}
          />
        );
      }
      if (isPending) {
        return (
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-brand-50 to-success-50 px-4 py-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
            <span className="text-sm font-medium text-brand-700">
              Finalizing your compliance assessment...
            </span>
          </div>
        );
      }
      return null;

    case "navigateTo":
      return null;

    default:
      return null;
  }
}
