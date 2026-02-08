/**
 * QuickComplyLanding - Hub/Landing page for Quick Comply
 *
 * Orchestrator component that fetches data and composes the 6 landing sections:
 * 1. AssessmentContextBanner - What was found during assessment
 * 2. HowItWorks - 3-step process explanation
 * 3. ReassuranceChecklist - What users DON'T need to worry about
 * 4. DeadlineCallout - Compliance deadlines per risk level
 * 5. SystemCard(s) - Individual AI system cards with CTAs
 * 6. StatsAndSubscription - Progress stats + upgrade prompts
 *
 * Also handles: loading, error, empty, and all-completed states.
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ShieldTick, Chart, AddCircle, ArrowRight2, Danger } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { createClient } from "@/lib/supabase/client";
import {
  SUBSCRIPTION_TIERS,
  PLAN_TO_TIER_MAP,
  type SubscriptionTier,
} from "@/lib/subscription/config";

import {
  AssessmentContextBanner,
  HowItWorks,
  ReassuranceChecklist,
  DeadlineCallout,
  SystemCard,
  StatsAndSubscription,
  RiskBadge,
} from "./landing";
import type { AISystem, QuickComplySession } from "./landing";

// ─── Props ────────────────────────────────────────────────────────────
interface QuickComplyLandingProps {
  onSelectSystem: (systemId: string, sessionId?: string) => void;
  onStartFresh: () => void;
}

// ─── Component ────────────────────────────────────────────────────────
export function QuickComplyLanding({
  onSelectSystem,
  onStartFresh,
}: QuickComplyLandingProps) {
  const router = useRouter();
  const [aiSystems, setAiSystems] = useState<AISystem[]>([]);
  const [sessions, setSessions] = useState<QuickComplySession[]>([]);
  const [subscriptionTier, setSubscriptionTier] =
    useState<SubscriptionTier>("free");
  const [sessionsUsedThisMonth, setSessionsUsedThisMonth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tierConfig = SUBSCRIPTION_TIERS[subscriptionTier];

  // ── Data fetching ─────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please log in to continue.");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      if (!profile?.organization_id) {
        setError("No organization found. Please complete your profile.");
        return;
      }

      const orgId = profile.organization_id;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: org } = await (supabase as any)
        .from("organizations")
        .select("plan, subscription_tier")
        .eq("id", orgId)
        .single();

      if (org) {
        const rawTier =
          (org.subscription_tier as string) || org.plan || "free";
        const mapped =
          PLAN_TO_TIER_MAP[rawTier] || (rawTier as SubscriptionTier);
        if (SUBSCRIPTION_TIERS[mapped]) setSubscriptionTier(mapped);
      }

      const { data: systems, error: sysErr } = await supabase
        .from("ai_systems")
        .select(
          "id, name, description, risk_level, compliance_status, compliance_progress, category, assessment_data, created_at"
        )
        .eq("organization_id", orgId)
        .order("created_at", { ascending: true });

      if (sysErr) console.error("Error loading AI systems:", sysErr);
      else setAiSystems(systems || []);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: qcSessions } = await (supabase as any)
        .from("quick_comply_sessions")
        .select(
          "id, ai_system_id, status, progress_percentage, current_section, sections_completed, last_activity_at"
        )
        .eq("user_id", user.id)
        .eq("organization_id", orgId)
        .in("status", ["active", "completed"])
        .order("last_activity_at", { ascending: false });

      setSessions(qcSessions || []);

      // Count sessions created this month for session limit display
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count: monthlySessionCount } = await (supabase as any)
        .from("quick_comply_sessions")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .gte("created_at", startOfMonth.toISOString());

      setSessionsUsedThisMonth(monthlySessionCount ?? 0);
    } catch (err) {
      console.error("Error loading Quick Comply data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Derived state ─────────────────────────────────────────────────
  const getSession = (id: string) =>
    sessions.find((s) => s.ai_system_id === id && s.status === "active") ??
    null;

  const isCompleted = (sys: AISystem) =>
    sys.compliance_status === "completed" ||
    (sys.compliance_progress ?? 0) >= 100 ||
    sessions.some(
      (s) => s.ai_system_id === sys.id && s.status === "completed"
    );

  const isAllowed = (idx: number) =>
    tierConfig.maxAISystems === -1 || idx < tierConfig.maxAISystems;

  const completedCount = aiSystems.filter(isCompleted).length;
  const allCompleted =
    aiSystems.length > 0 && completedCount === aiSystems.length;
  const lockedCount =
    tierConfig.maxAISystems === -1
      ? 0
      : Math.max(0, aiSystems.length - tierConfig.maxAISystems);
  const nextIdx = aiSystems.findIndex(
    (sys, i) => isAllowed(i) && !isCompleted(sys)
  );
  const sessionLimitReached =
    tierConfig.quickComplySessionsPerMonth !== -1 &&
    sessionsUsedThisMonth >= tierConfig.quickComplySessionsPerMonth;

  // ── Loading ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-57px)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-secondary border-t-brand-600" />
          <p className="text-sm text-tertiary">Loading your AI systems...</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex h-[calc(100vh-57px)] items-center justify-center p-8">
        <div className="text-center">
          <Danger size={48} color="currentColor" className="mx-auto mb-4 text-error-400" variant="Bold" />
          <p className="text-sm text-tertiary">{error}</p>
          <Button color="primary" className="mt-4" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // ── All Completed ─────────────────────────────────────────────────
  if (allCompleted) {
    return (
      <div className="flex h-[calc(100vh-57px)] items-center justify-center p-8">
        <div className="max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success-primary">
            <ShieldTick size={40} color="currentColor" className="text-fg-success-primary" variant="Bold" />
          </div>
          <h2 className="text-xl font-bold text-primary sm:text-2xl">All Systems Compliant</h2>
          <p className="mt-2 text-sm text-tertiary sm:text-base">
            Congratulations! All {aiSystems.length} of your AI system
            {aiSystems.length !== 1 ? "s have" : " has"} completed the compliance process.
          </p>
          <div className="mt-6 space-y-2">
            {aiSystems.map((sys) => (
              <div key={sys.id} className="flex items-center justify-between rounded-lg border border-secondary bg-success-primary px-4 py-3">
                <span className="text-sm font-medium text-primary">{sys.name}</span>
                <RiskBadge level={sys.risk_level} />
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button color="primary" onClick={() => router.push("/certifications")}>View Certifications</Button>
            <Button color="secondary" onClick={() => router.push("/documents")}>Download Documents</Button>
            <Button color="secondary" onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  // ── No AI Systems ─────────────────────────────────────────────────
  if (aiSystems.length === 0) {
    return (
      <div className="flex h-[calc(100vh-57px)] items-center justify-center p-8">
        <div className="max-w-xl text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
            <Chart size={40} color="currentColor" className="text-quaternary" variant="Bold" />
          </div>
          <h2 className="text-xl font-bold text-primary sm:text-2xl">No AI Systems Yet</h2>
          <p className="mt-2 text-sm text-tertiary sm:text-base">
            Add your first AI system to get started with compliance.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button onClick={onStartFresh} className="group rounded-2xl border-2 border-brand-200 bg-primary p-6 text-left transition-all hover:border-brand-400 hover:shadow-lg">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary">
                <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-primary">Quick Comply with AI</h3>
              <p className="mt-1 text-sm text-tertiary">Chat with AI to add your AI system and complete compliance in ~45 minutes.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-tertiary transition-all group-hover:gap-2">
                Start Chat <ArrowRight2 size={14} color="currentColor" />
              </span>
            </button>
            <button onClick={() => router.push("/ai-systems")} className="group rounded-2xl border-2 border-secondary bg-primary p-6 text-left transition-all hover:border-primary hover:shadow-lg">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <AddCircle size={20} color="currentColor" className="text-quaternary" variant="Bold" />
              </div>
              <h3 className="text-base font-semibold text-primary">Add Manually</h3>
              <p className="mt-1 text-sm text-tertiary">Fill out a form to add your AI system and manage compliance step by step.</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-secondary transition-all group-hover:gap-2">
                Add System <ArrowRight2 size={14} color="currentColor" />
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Has AI Systems — Full 6-Section Layout ────────────────────────
  return (
    <div className="h-[calc(100vh-57px)] overflow-y-auto">
      <div className="mx-auto max-w-4xl space-y-5 px-4 py-8 sm:px-6 sm:py-10">
        {/* Section 1: Assessment Context */}
        <AssessmentContextBanner
          systems={aiSystems}
          completedCount={completedCount}
        />

        {/* Section 2: How It Works */}
        <HowItWorks />

        {/* Section 3: Reassurance */}
        <ReassuranceChecklist systems={aiSystems} />

        {/* Section 4: Deadlines */}
        <DeadlineCallout systems={aiSystems} />

        {/* Section 5: System Cards */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-tertiary">
            Your AI Systems
          </h2>
          <div className="space-y-3">
            {aiSystems.map((system, index) => (
              <SystemCard
                key={system.id}
                system={system}
                session={getSession(system.id)}
                isAllowed={isAllowed(index)}
                isNext={index === nextIdx}
                isCompleted={isCompleted(system)}
                sessionLimitReached={sessionLimitReached}
                tierDisplayName={tierConfig.displayName}
                maxSystems={tierConfig.maxAISystems}
                onSelect={onSelectSystem}
              />
            ))}
          </div>
        </div>

        {/* Section 6: Stats & Subscription */}
        <StatsAndSubscription
          totalSystems={aiSystems.length}
          completedCount={completedCount}
          lockedCount={lockedCount}
          tierConfig={tierConfig}
          sessionsUsedThisMonth={sessionsUsedThisMonth}
          onStartFresh={onStartFresh}
        />
      </div>
    </div>
  );
}
