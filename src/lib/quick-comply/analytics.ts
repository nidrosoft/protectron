/**
 * Quick Comply - Analytics Events
 *
 * Lightweight event tracking for Quick Comply usage.
 * Logs events to the console in development and to the
 * quick_comply_sessions table for analytics reporting.
 */

import type { SectionId } from "./types";

export type QuickComplyEvent =
  | "quick_comply_started"
  | "quick_comply_section_completed"
  | "quick_comply_completed"
  | "quick_comply_abandoned"
  | "quick_comply_resumed"
  | "quick_comply_document_generated"
  | "quick_comply_answer_edited"
  | "quick_comply_error";

interface EventData {
  sessionId?: string;
  section?: SectionId | string;
  riskLevel?: string;
  subscriptionTier?: string;
  tokensUsed?: number;
  documentType?: string;
  errorCode?: string;
  durationMinutes?: number;
  [key: string]: unknown;
}

/**
 * Track a Quick Comply analytics event.
 * Sends to the server endpoint for persistence and logs in dev.
 */
export function trackQuickComplyEvent(
  event: QuickComplyEvent,
  data: EventData = {}
): void {
  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Quick Comply Analytics] ${event}`, data);
  }

  // Fire and forget to analytics endpoint
  try {
    fetch("/api/quick-comply/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data, timestamp: new Date().toISOString() }),
    }).catch(() => {
      // Silently fail — analytics should never block UX
    });
  } catch {
    // Silently fail
  }
}
