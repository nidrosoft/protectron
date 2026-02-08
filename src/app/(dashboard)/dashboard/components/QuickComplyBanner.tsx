/**
 * QuickComplyBanner - Dashboard promotion banner for Quick Comply
 *
 * Shows different states:
 * - New user: Promote Quick Comply as a fast compliance path
 * - Returning user: Offer to resume existing session
 * - Completed: Show success summary with badge
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type BannerState = "loading" | "new" | "in_progress" | "completed" | "dismissed";

interface SessionData {
  id: string;
  progress: number;
  current_section: string;
  ai_system_name?: string;
  status: string;
  updated_at: string;
}

export function QuickComplyBanner() {
  const router = useRouter();
  const [state, setState] = useState<BannerState>("loading");
  const [session, setSession] = useState<SessionData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = localStorage.getItem("qc-banner-dismissed");
    if (wasDismissed) {
      setState("dismissed");
      return;
    }

    async function checkSession() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setState("new");
          return;
        }

        const sb = supabase as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        const { data: sessions } = await sb
          .from("quick_comply_sessions")
          .select("id, progress, current_section, ai_system_name, status, updated_at")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(1);

        if (sessions && sessions.length > 0) {
          const latest = sessions[0] as SessionData;
          setSession(latest);
          setState(latest.status === "completed" ? "completed" : "in_progress");
        } else {
          setState("new");
        }
      } catch {
        setState("new");
      }
    }

    checkSession();
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("qc-banner-dismissed", "true");
    setState("dismissed");
  };

  if (state === "loading" || state === "dismissed" || dismissed) return null;

  // Format time since last update
  const timeSince = session?.updated_at
    ? getTimeSince(new Date(session.updated_at))
    : "";

  if (state === "completed") {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-success-200 bg-gradient-to-r from-success-50 to-brand-50 p-5">
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 rounded-lg p-1 text-gray-400 transition-colors hover:bg-white/60 hover:text-gray-600"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success-100">
            <svg className="h-6 w-6 text-success-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-success-800">
              Quick Comply Complete
            </h3>
            <p className="text-xs text-success-700">
              {session?.ai_system_name
                ? `"${session.ai_system_name}" is fully compliant.`
                : "Your AI system has been assessed."}
              {" "}View your documents in the Documents section.
            </p>
          </div>
          <button
            onClick={() => router.push("/quick-comply")}
            className="shrink-0 rounded-lg bg-success-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-success-700"
          >
            Start Another
          </button>
        </div>
      </div>
    );
  }

  if (state === "in_progress" && session) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 via-white to-purple-50 p-5">
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 rounded-lg p-1 text-gray-400 transition-colors hover:bg-white/60 hover:text-gray-600"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100">
            <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-primary">
              Continue Quick Comply
            </h3>
            <p className="text-xs text-tertiary">
              {session.ai_system_name
                ? `"${session.ai_system_name}" — `
                : ""}
              {Math.round(session.progress)}% complete
              {timeSince ? ` · Last active ${timeSince}` : ""}
            </p>
            {/* Progress bar */}
            <div className="mt-2 h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-brand-100">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${session.progress}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => router.push(`/quick-comply?session=${session.id}`)}
            className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            Resume
          </button>
        </div>
      </div>
    );
  }

  // New user / first time
  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 via-white to-purple-50 p-5">
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-3 rounded-lg p-1 text-gray-400 transition-colors hover:bg-white/60 hover:text-gray-600"
        aria-label="Dismiss"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Decorative gradient blob */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-200/30 blur-3xl" />

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100">
          <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-primary">
            Quick Comply — Comply in 10 Minutes
          </h3>
          <p className="text-xs text-tertiary">
            Answer a few questions through our AI-guided chat and get all your
            EU AI Act compliance documents generated automatically.
          </p>
        </div>
        <button
          onClick={() => router.push("/quick-comply")}
          className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
        >
          Start Now
        </button>
      </div>
    </div>
  );
}

function getTimeSince(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
