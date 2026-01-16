"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { 
  WalkthroughContextType, 
  WalkthroughStatus, 
  AssessmentContext, 
  GettingStartedTask 
} from "@/lib/walkthrough/types";
import { TOTAL_WALKTHROUGH_STEPS } from "@/lib/walkthrough/steps";
import { getInitialTasks, DEFAULT_GETTING_STARTED_TASKS } from "@/lib/walkthrough/getting-started-tasks";

const WalkthroughContext = createContext<WalkthroughContextType | null>(null);

const WALKTHROUGH_STORAGE_KEY = "protectron_walkthrough_progress";
const ASSESSMENT_CONTEXT_KEY = "protectron_assessment_context";

interface WalkthroughProviderProps {
  children: ReactNode;
}

export function WalkthroughProvider({ children }: WalkthroughProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  // State
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<WalkthroughStatus>("not_started");
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsCompleted, setStepsCompleted] = useState<number[]>([]);
  const [assessmentContext, setAssessmentContext] = useState<AssessmentContext | null>(null);
  const [gettingStartedTasks, setGettingStartedTasks] = useState<GettingStartedTask[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load progress from localStorage and database
  const loadProgress = useCallback(async () => {
    try {
      // First check localStorage for quick load
      const localData = localStorage.getItem(WALKTHROUGH_STORAGE_KEY);
      const assessmentData = localStorage.getItem(ASSESSMENT_CONTEXT_KEY);

      if (assessmentData) {
        try {
          setAssessmentContext(JSON.parse(assessmentData));
        } catch (e) {
          console.error("Error parsing assessment context:", e);
        }
      }

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Not logged in, use localStorage only
        if (localData) {
          const parsed = JSON.parse(localData);
          setStatus(parsed.status || "not_started");
          setCurrentStep(parsed.currentStep || 0);
          setStepsCompleted(parsed.stepsCompleted || []);
        }
        setIsInitialized(true);
        return;
      }

      // Try to get progress from database
      // Note: These columns are added via migration 20260115_add_walkthrough_fields.sql
      // Using type assertion since Supabase types may not be regenerated yet
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        const profileData = profile as Record<string, unknown>;
        const dbStatus = (profileData.walkthrough_status as WalkthroughStatus) || "not_started";
        const dbStep = (profileData.walkthrough_step as number) || 0;
        const dbCompleted = (profileData.walkthrough_completed_steps as number[]) || [];
        const onboardingCompleted = profileData.onboarding_completed as boolean;

        setStatus(dbStatus);
        setCurrentStep(dbStep);
        setStepsCompleted(dbCompleted);

        // Determine if we should show welcome or resume modal
        if (dbStatus === "not_started" && !onboardingCompleted) {
          setShowWelcomeModal(true);
        } else if (dbStatus === "in_progress" && dbStep > 0 && dbStep < TOTAL_WALKTHROUGH_STEPS - 1) {
          setShowResumeModal(true);
        }

        // Save to localStorage for quick access
        localStorage.setItem(WALKTHROUGH_STORAGE_KEY, JSON.stringify({
          status: dbStatus,
          currentStep: dbStep,
          stepsCompleted: dbCompleted,
        }));
      } else {
        // No profile data, show welcome modal for new users
        setShowWelcomeModal(true);
      }

      // Load getting started tasks
      await loadGettingStartedTasks(user.id);

    } catch (error) {
      console.error("Error loading walkthrough progress:", error);
    } finally {
      setIsInitialized(true);
    }
  }, [supabase]);

  // Load getting started tasks
  const loadGettingStartedTasks = useCallback(async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", userId)
        .single();

      const orgId = profile?.organization_id;
      if (!orgId) {
        setGettingStartedTasks(getInitialTasks(true, true));
        return;
      }

      // Check if user has AI systems
      const { count: aiSystemsCount } = await supabase
        .from("ai_systems")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId);

      // Check if user has documents
      const { count: documentsCount } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", orgId);

      // Check if user has completed requirements
      const { count: completedReqsCount } = await supabase
        .from("ai_system_requirements")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed");

      const tasks: GettingStartedTask[] = DEFAULT_GETTING_STARTED_TASKS.map((task) => {
        let isCompleted = false;
        let completedAt: string | undefined;

        switch (task.id) {
          case "complete-assessment":
          case "create-account":
            isCompleted = true;
            completedAt = new Date().toISOString();
            break;
          case "add-first-ai-system":
            isCompleted = (aiSystemsCount || 0) > 0;
            if (isCompleted) completedAt = new Date().toISOString();
            break;
          case "generate-first-document":
            isCompleted = (documentsCount || 0) > 0;
            if (isCompleted) completedAt = new Date().toISOString();
            break;
          case "complete-first-requirement":
            isCompleted = (completedReqsCount || 0) > 0;
            if (isCompleted) completedAt = new Date().toISOString();
            break;
        }

        return { ...task, isCompleted, completedAt };
      });

      setGettingStartedTasks(tasks);
    } catch (error) {
      console.error("Error loading getting started tasks:", error);
      setGettingStartedTasks(getInitialTasks(true, true));
    }
  }, [supabase]);

  // Save progress to database
  const saveProgress = useCallback(async (
    newStatus: WalkthroughStatus,
    newStep: number,
    newCompleted: number[]
  ) => {
    try {
      // Save to localStorage immediately
      localStorage.setItem(WALKTHROUGH_STORAGE_KEY, JSON.stringify({
        status: newStatus,
        currentStep: newStep,
        stepsCompleted: newCompleted,
      }));

      // Save to database if authenticated
      // Note: Using type assertion since walkthrough columns are added via migration
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await (supabase as any)
          .from("profiles")
          .update({
            walkthrough_status: newStatus,
            walkthrough_step: newStep,
            walkthrough_completed_steps: newCompleted,
            onboarding_completed: newStatus === "completed" || newStatus === "skipped",
          })
          .eq("id", user.id);
      }
    } catch (error) {
      console.error("Error saving walkthrough progress:", error);
    }
  }, [supabase]);

  // Initialize on mount
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Actions
  const startWalkthrough = useCallback(() => {
    setIsActive(true);
    setStatus("in_progress");
    setCurrentStep(1); // Skip welcome (step 0), go to step 1
    setShowWelcomeModal(false);
    setShowResumeModal(false);
    saveProgress("in_progress", 1, [0]);
    setStepsCompleted([0]);
  }, [saveProgress]);

  const nextStep = useCallback(() => {
    const next = currentStep + 1;
    if (next >= TOTAL_WALKTHROUGH_STEPS) {
      completeWalkthrough();
      return;
    }
    setCurrentStep(next);
    const newCompleted = [...stepsCompleted, currentStep];
    setStepsCompleted(newCompleted);
    saveProgress("in_progress", next, newCompleted);
  }, [currentStep, stepsCompleted, saveProgress]);

  const previousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      saveProgress("in_progress", currentStep - 1, stepsCompleted);
    }
  }, [currentStep, stepsCompleted, saveProgress]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < TOTAL_WALKTHROUGH_STEPS) {
      setCurrentStep(step);
      saveProgress("in_progress", step, stepsCompleted);
    }
  }, [stepsCompleted, saveProgress]);

  const skipWalkthrough = useCallback(() => {
    setIsActive(false);
    setStatus("skipped");
    setShowWelcomeModal(false);
    setShowResumeModal(false);
    saveProgress("skipped", currentStep, stepsCompleted);
  }, [currentStep, stepsCompleted, saveProgress]);

  const completeWalkthrough = useCallback(() => {
    setIsActive(false);
    setStatus("completed");
    const allSteps = Array.from({ length: TOTAL_WALKTHROUGH_STEPS }, (_, i) => i);
    setStepsCompleted(allSteps);
    saveProgress("completed", TOTAL_WALKTHROUGH_STEPS - 1, allSteps);
  }, [saveProgress]);

  const resetWalkthrough = useCallback(() => {
    setIsActive(false);
    setStatus("not_started");
    setCurrentStep(0);
    setStepsCompleted([]);
    setShowWelcomeModal(true);
    saveProgress("not_started", 0, []);
  }, [saveProgress]);

  const dismissWelcomeModal = useCallback(() => {
    setShowWelcomeModal(false);
  }, []);

  const dismissResumeModal = useCallback(() => {
    setShowResumeModal(false);
  }, []);

  const completeTask = useCallback(async (taskId: string) => {
    setGettingStartedTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, isCompleted: true, completedAt: new Date().toISOString() }
          : task
      )
    );
  }, []);

  const refreshProgress = useCallback(async () => {
    await loadProgress();
  }, [loadProgress]);

  const value = useMemo<WalkthroughContextType>(() => ({
    isActive,
    status,
    currentStep,
    totalSteps: TOTAL_WALKTHROUGH_STEPS,
    stepsCompleted,
    assessmentContext,
    gettingStartedTasks,
    showWelcomeModal,
    showResumeModal,
    startWalkthrough,
    nextStep,
    previousStep,
    goToStep,
    skipWalkthrough,
    completeWalkthrough,
    resetWalkthrough,
    dismissWelcomeModal,
    dismissResumeModal,
    completeTask,
    refreshProgress,
  }), [
    isActive,
    status,
    currentStep,
    stepsCompleted,
    assessmentContext,
    gettingStartedTasks,
    showWelcomeModal,
    showResumeModal,
    startWalkthrough,
    nextStep,
    previousStep,
    goToStep,
    skipWalkthrough,
    completeWalkthrough,
    resetWalkthrough,
    dismissWelcomeModal,
    dismissResumeModal,
    completeTask,
    refreshProgress,
  ]);

  return (
    <WalkthroughContext.Provider value={value}>
      {children}
    </WalkthroughContext.Provider>
  );
}

export function useWalkthrough(): WalkthroughContextType {
  const context = useContext(WalkthroughContext);
  if (!context) {
    throw new Error("useWalkthrough must be used within a WalkthroughProvider");
  }
  return context;
}

export { WalkthroughContext };
