/**
 * Quick Comply - Custom Hook
 *
 * Manages Quick Comply session state, integrates with the useChat hook
 * from Vercel AI SDK v6, and handles tool output submissions.
 *
 * AI SDK v6 changes:
 * - No input/setInput/handleSubmit — manage input state externally
 * - No isLoading — use `status` ('submitted' | 'streaming' | 'ready' | 'error')
 * - No append — use `sendMessage({ text })`
 * - No reload — use `regenerate()`
 * - addToolResult deprecated → use `addToolOutput({ tool, toolCallId, output })`
 * - maxSteps removed from useChat — handled server-side with stopWhen
 */

"use client";

import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { useState, useCallback, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SectionId, Progress } from "@/lib/quick-comply/types";
import { SECTIONS, getInitialProgress } from "@/lib/quick-comply/constants";
import { trackQuickComplyEvent } from "@/lib/quick-comply/analytics";

interface UseQuickComplyOptions {
  sessionId?: string | null;
  aiSystemId?: string;
  onSessionCreated?: (sessionId: string) => void;
}

export function useQuickComply(options: UseQuickComplyOptions = {}) {
  const [sessionId, setSessionId] = useState<string | null>(
    options.sessionId || null
  );
  const [progress, setProgress] = useState<Progress>(getInitialProgress());
  const [currentSection, setCurrentSection] =
    useState<SectionId>("company_info");
  const [sectionsCompleted, setSectionsCompleted] = useState<SectionId[]>([]);
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  const [aiSystemName, setAiSystemName] = useState<string | null>(null);
  const [aiSystemId, setAiSystemId] = useState<string | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string>("free");
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const sessionIdRef = useRef(sessionId);

  const supabase = createClient();

  // Keep ref in sync
  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  // Load session and subscription on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Get subscription tier
        const { data: profile } = await supabase
          .from("profiles")
          .select("organization_id")
          .eq("id", user.id)
          .single();

        if (profile?.organization_id) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: org } = await (supabase as any)
            .from("organizations")
            .select("plan, subscription_tier")
            .eq("id", profile.organization_id)
            .single();

          if (org) {
            setSubscriptionTier(
              (org.subscription_tier as string) || org.plan || "free"
            );
          }
        }

        // Try to resume an active session
        if (options.sessionId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: session } = await (supabase as any)
            .from("quick_comply_sessions")
            .select("*")
            .eq("id", options.sessionId)
            .single();

          if (session) {
            restoreSessionState(session);
          }
        } else {
          // Check for any active sessions (scoped to aiSystemId if provided)
          const {
            data: { user: currentUser },
          } = await supabase.auth.getUser();
          if (currentUser) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let query = (supabase as any)
              .from("quick_comply_sessions")
              .select("*")
              .eq("user_id", currentUser.id)
              .eq("status", "active");

            // Scope to specific AI system if provided
            if (options.aiSystemId) {
              query = query.eq("ai_system_id", options.aiSystemId);
            }

            const { data: sessions } = await query
              .order("last_activity_at", { ascending: false })
              .limit(1);

            if (sessions && sessions.length > 0) {
              restoreSessionState(sessions[0]);
            }
          }
        }
        // Track session start or resume
        if (options.sessionId) {
          trackQuickComplyEvent("quick_comply_resumed", {
            sessionId: options.sessionId,
            subscriptionTier,
          });
        } else {
          trackQuickComplyEvent("quick_comply_started", {
            subscriptionTier,
          });
        }
      } catch (error) {
        console.error("Error loading Quick Comply data:", error);
      } finally {
        setIsLoadingSession(false);
      }
    }

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function restoreSessionState(session: Record<string, unknown>) {
    const sid = session.id as string;
    setSessionId(sid);
    sessionIdRef.current = sid; // Update ref immediately so transport picks it up
    setCurrentSection(
      (session.current_section as SectionId) || "company_info"
    );
    setSectionsCompleted(
      (session.sections_completed as SectionId[]) || []
    );
    setRiskLevel((session.risk_classification as string) || null);
    setAiSystemId((session.ai_system_id as string) || null);

    const formData = session.form_data as Record<
      string,
      Record<string, unknown>
    > | null;
    if (formData?.ai_system_details?.system_name) {
      setAiSystemName(formData.ai_system_details.system_name as string);
    }

    // Rebuild progress
    const completed = (session.sections_completed as SectionId[]) || [];
    setProgress({
      overall: (session.progress_percentage as number) || 0,
      sections: Object.fromEntries(
        SECTIONS.map((s) => [
          s.id,
          {
            status: completed.includes(s.id)
              ? ("completed" as const)
              : s.id === (session.current_section as string)
                ? ("in_progress" as const)
                : ("not_started" as const),
            progress: completed.includes(s.id) ? 100 : 0,
          },
        ])
      ) as Progress["sections"],
      documentsReady: 0,
      totalDocuments: 7,
      estimatedTimeRemaining: 45,
    });
  }

  // Use refs for transport body so useChat always sends current values
  const subscriptionTierRef = useRef(subscriptionTier);
  useEffect(() => {
    subscriptionTierRef.current = subscriptionTier;
  }, [subscriptionTier]);

  // Keep aiSystemId ref in sync for transport
  const aiSystemIdRef = useRef(options.aiSystemId || null);
  useEffect(() => {
    if (options.aiSystemId) {
      aiSystemIdRef.current = options.aiSystemId;
    }
  }, [options.aiSystemId]);

  // Also update aiSystemIdRef when createAISystem tool returns an ID
  useEffect(() => {
    if (aiSystemId) {
      aiSystemIdRef.current = aiSystemId;
    }
  }, [aiSystemId]);

  // Custom transport that always reads from refs for current session data
  const transportRef = useRef(
    new DefaultChatTransport({
      api: "/api/quick-comply",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: {
        data: {
          sessionId: sessionIdRef.current,
          subscriptionTier: subscriptionTierRef.current,
          aiSystemId: aiSystemIdRef.current,
        },
      },
    })
  );

  // Rebuild transport whenever sessionId, subscriptionTier, or aiSystemId changes
  useEffect(() => {
    transportRef.current = new DefaultChatTransport({
      api: "/api/quick-comply",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: {
        data: {
          sessionId: sessionIdRef.current,
          subscriptionTier: subscriptionTierRef.current,
          aiSystemId: aiSystemIdRef.current,
        },
      },
    });
  }, [sessionId, subscriptionTier, aiSystemId]);

  // Vercel AI SDK v6 useChat hook
  const chat = useChat({
    transport: transportRef.current,

    // Auto-submit tool outputs when all are ready
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

    onToolCall: async ({ toolCall }) => {
      // UI-only tools don't return results here — they are handled
      // via addToolOutput after user interaction
      const uiTools = [
        "showSelection",
        "showTextInput",
        "showMultiSelect",
        "showDocumentPreview",
        "navigateTo",
      ];

      if (uiTools.includes(toolCall.toolName)) {
        return undefined;
      }

      // Server-side tools are handled automatically by the execute functions
      return undefined;
    },

    onError: (error) => {
      console.error("Quick Comply chat error:", error);
      trackQuickComplyEvent("quick_comply_error", {
        sessionId: sessionIdRef.current || undefined,
        errorCode: error.message?.includes("token_limit")
          ? "token_limit"
          : error.message?.includes("timeout")
            ? "timeout"
            : "unknown",
      });
    },

    onFinish: () => {
      // Progress/state syncing is handled exclusively by the useEffect
      // scanner below to avoid race conditions between onFinish and the
      // effect (which caused progress flickering).
    },
  });

  // Single source of truth for progress state: scans ALL tool results in messages.
  // Accumulates monotonically — sections are only ADDED, progress only INCREASES.
  // This prevents the flickering caused by intermediate tool results during streaming.
  useEffect(() => {
    const allCompleted = new Set<SectionId>();
    let maxOverall = 0;
    let latestSection: SectionId | null = null;
    let foundAiSystemId: string | null = null;
    let foundAiSystemName: string | null = null;
    let documentsGenerated = false;

    for (const m of chat.messages) {
      if (m.role !== "assistant") continue;
      for (const part of m.parts) {
        // Extract tool output from any part format
        let toolName: string | null = null;
        let output: unknown = undefined;

        if (part.type.startsWith("tool-") && "state" in part && part.state === "output-available" && "output" in part) {
          toolName = part.type.replace("tool-", "");
          output = (part as { output?: unknown }).output;
        } else if (part.type === "dynamic-tool" && "state" in part && part.state === "output-available" && "output" in part) {
          const dp = part as { toolName: string; output?: unknown };
          toolName = dp.toolName;
          output = dp.output;
        }

        if (!toolName || output === undefined) continue;
        const res = output as Record<string, unknown>;

        if (toolName === "updateProgress" && res?.updated) {
          const pd = res.progress as Record<string, unknown> | undefined;
          if (pd) {
            // Only increase, never decrease
            const pctVal = pd.overall as number | undefined;
            if (pctVal && pctVal > maxOverall) {
              maxOverall = pctVal;
            }
            if (pd.currentSection) {
              latestSection = pd.currentSection as SectionId;
            }
            // Union all completed sections from every updateProgress call
            if (pd.sectionsCompleted) {
              for (const s of pd.sectionsCompleted as SectionId[]) {
                allCompleted.add(s);
              }
            }
          }
        }

        if (toolName === "createAISystem" && res?.created) {
          foundAiSystemId = res.aiSystemId as string;
          foundAiSystemName = res.aiSystemName as string;
        }

        if (toolName === "generateDocuments" && res?.generated) {
          documentsGenerated = true;
        }
      }
    }

    // Apply accumulated state — only grow, never shrink
    if (allCompleted.size > 0) {
      setSectionsCompleted((prev) => {
        const merged = new Set([...prev, ...allCompleted]);
        if (merged.size === prev.length) return prev;
        return Array.from(merged);
      });
    }

    // Progress can only go up
    const effectiveOverall = documentsGenerated ? 100 : maxOverall;
    if (effectiveOverall > 0) {
      setProgress((prev) =>
        effectiveOverall > prev.overall
          ? { ...prev, overall: effectiveOverall }
          : prev
      );
    }

    if (latestSection) {
      setCurrentSection((prev) => {
        // Only advance to later sections, never go backward
        const sectionOrder = SECTIONS.map((s) => s.id);
        const prevIdx = sectionOrder.indexOf(prev);
        const newIdx = sectionOrder.indexOf(latestSection!);
        return newIdx >= prevIdx ? latestSection! : prev;
      });
    }

    if (foundAiSystemId) {
      setAiSystemId(foundAiSystemId);
    }
    if (foundAiSystemName) {
      setAiSystemName(foundAiSystemName);
    }

    // Track completion event
    if (documentsGenerated) {
      trackQuickComplyEvent("quick_comply_completed", {
        sessionId: sessionIdRef.current || undefined,
        riskLevel: riskLevel || undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.messages]);

  // Submit tool output from UI components (v6 API)
  const submitToolOutput = useCallback(
    (toolName: string, toolCallId: string, output: unknown) => {
      console.log("[QuickComply] submitToolOutput:", toolName, toolCallId, output);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (chat as any).addToolOutput({
          tool: toolName,
          toolCallId,
          output,
        });
      } catch (err) {
        console.error("[QuickComply] addToolOutput error:", err);
      }
    },
    [chat]
  );

  // Send an edit message to the AI when the user changes a previous answer
  const sendEditMessage = useCallback(
    (fieldKey: string, section: string, newValue: string, oldValue: string) => {
      console.log("[QuickComply] User editing answer:", { fieldKey, section, oldValue, newValue });
      trackQuickComplyEvent("quick_comply_answer_edited", {
        sessionId: sessionIdRef.current || undefined,
        fieldKey,
        section,
      });

      // Send a natural language message to the AI informing it of the correction
      chat.sendMessage({
        text: `I want to change my answer for "${fieldKey}" in the "${section}" section. My previous answer was "${oldValue}" and my new answer is "${newValue}". Please update this in my compliance data using captureResponse and let me know if this change affects anything else (like risk classification or other assessments).`,
      });
    },
    [chat]
  );

  // Save and exit — persists chat history and navigates to dashboard
  const saveAndExit = useCallback(async () => {
    const sid = sessionIdRef.current;
    if (sid) {
      try {
        // Save chat history for resume capability - serialize parts safely
        const messagesToSave = chat.messages.slice(-100).map((m) => {
          // Only keep serializable part types
          const safeParts = m.parts
            .filter((p) => ["text", "step-start"].includes(p.type) || p.type.startsWith("tool-") || p.type === "dynamic-tool")
            .map((p) => {
              if (p.type === "text") {
                return { type: "text", text: p.text };
              }
              // For tool parts, serialize what we need
              return p;
            });
          return {
            id: m.id,
            role: m.role,
            parts: safeParts,
          };
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: saveError } = await (supabase as any)
          .from("quick_comply_sessions")
          .update({
            chat_history: messagesToSave,
            last_activity_at: new Date().toISOString(),
            current_section: currentSection,
            sections_completed: sectionsCompleted,
            progress_percentage: progress.overall,
            status: progress.overall >= 100 ? "completed" : "active",
          })
          .eq("id", sid);

        if (saveError) {
          console.error("Error saving session:", saveError);
        } else {
          console.log("[QuickComply] Session saved successfully:", {
            sessionId: sid,
            progress: progress.overall,
            currentSection,
            sectionsCompleted,
            messagesCount: messagesToSave.length,
          });
        }
      } catch (error) {
        console.error("Error saving session before exit:", error);
      }
    }

    // Track save & exit
    if (progress.overall < 100) {
      trackQuickComplyEvent("quick_comply_abandoned", {
        sessionId: sid || undefined,
        section: currentSection,
      });
    }

    // Navigate to dashboard
    window.location.href = "/dashboard";
  }, [supabase, chat.messages, currentSection, sectionsCompleted, progress.overall]);

  return {
    // Chat state from useChat v6
    messages: chat.messages,
    sendMessage: chat.sendMessage,
    status: chat.status,
    error: chat.error,
    stop: chat.stop,

    // Session state
    sessionId,
    isLoadingSession,
    progress,
    currentSection,
    sectionsCompleted,
    riskLevel,
    aiSystemName,
    aiSystemId,
    subscriptionTier,

    // Actions
    submitToolOutput,
    sendEditMessage,
    saveAndExit,
  };
}
