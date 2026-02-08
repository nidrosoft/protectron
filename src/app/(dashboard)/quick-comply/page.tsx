/**
 * Quick Comply - Main Page
 *
 * The entry point for the Quick Comply feature.
 * Shows the landing/hub page first. When a user selects an AI system
 * (or starts fresh), it transitions to the chat interface.
 */

"use client";

import { Suspense, Component, type ReactNode, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { QuickComplyChat, QuickComplyLanding } from "./components";

// Error boundary that shows the actual error for debugging
class QuickComplyErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("QuickComply Error:", error);
    console.error("Component Stack:", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-[calc(100vh-57px)] items-center justify-center p-8">
          <div className="max-w-lg text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-100">
              <svg className="h-6 w-6 text-error-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-primary">Quick Comply Error</h2>
            <p className="mt-2 text-sm text-tertiary">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <pre className="mt-3 max-h-40 overflow-auto rounded-lg bg-gray-100 p-3 text-left text-xs text-gray-600">
              {this.state.error?.stack || "No stack trace available"}
            </pre>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => (window.location.href = "/dashboard")}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-secondary hover:bg-gray-50"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                }}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function QuickComplyContent() {
  const searchParams = useSearchParams();
  const sessionParam = searchParams.get("session");
  const systemParam = searchParams.get("system");

  // State to track whether we're showing the landing or the chat
  // If URL has a session or system param, go directly to chat
  const [activeView, setActiveView] = useState<"landing" | "chat">(
    sessionParam || systemParam ? "chat" : "landing"
  );
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(
    systemParam || null
  );
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    sessionParam || null
  );

  // Handle system selection from the landing page
  const handleSelectSystem = useCallback(
    (systemId: string, sessionId?: string) => {
      setSelectedSystemId(systemId);
      setSelectedSessionId(sessionId || null);
      setActiveView("chat");
    },
    []
  );

  // Handle "start fresh" (no specific system, create new in chat)
  const handleStartFresh = useCallback(() => {
    setSelectedSystemId(null);
    setSelectedSessionId(null);
    setActiveView("chat");
  }, []);

  if (activeView === "landing") {
    return (
      <QuickComplyLanding
        onSelectSystem={handleSelectSystem}
        onStartFresh={handleStartFresh}
      />
    );
  }

  return (
    <div className="h-[calc(100vh-57px)]">
      <QuickComplyErrorBoundary>
        <QuickComplyChat
          initialSessionId={selectedSessionId}
          aiSystemId={selectedSystemId}
        />
      </QuickComplyErrorBoundary>
    </div>
  );
}

export default function QuickComplyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-57px)] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-gray-200 border-t-brand-600" />
            <p className="text-sm text-tertiary">Loading Quick Comply...</p>
          </div>
        </div>
      }
    >
      <QuickComplyContent />
    </Suspense>
  );
}
