/**
 * Quick Comply - API Route
 *
 * POST /api/quick-comply
 *
 * Main chat API endpoint for the Quick Comply feature.
 * Uses Vercel AI SDK v6 with Claude to provide a conversational
 * compliance assistant with tool calling capabilities.
 *
 * Architecture:
 * - streamText for SSE streaming to the client
 * - useChat on the client connects to this endpoint
 * - Tools with execute run server-side (captureResponse, etc.)
 * - Tools without execute render UI on the client (showSelection, etc.)
 * - stopWhen: stepCountIs(5) for multi-step tool calls
 * - toUIMessageStreamResponse() for v6 compatibility
 */

import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  type UIMessage,
} from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { createClient } from "@/lib/supabase/server";
import { buildTools } from "./tools";
import { getSystemPrompt } from "./prompts";
import {
  recordTokenUsage,
  checkQuickComplyAccess,
} from "@/lib/subscription/server";
import {
  SUBSCRIPTION_TIERS,
} from "@/lib/subscription/config";
import type {
  QuickComplySystemData,
  SectionId,
} from "@/lib/quick-comply/types";
import {
  getInitialFormData,
} from "@/lib/quick-comply/constants";

export const maxDuration = 60; // Allow longer responses for tool calls

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, data: clientData } = body as {
      messages: UIMessage[];
      data?: { sessionId?: string; subscriptionTier?: string; aiSystemId?: string };
    };

    // Get Supabase client
    const supabase = await createClient();

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get user's organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return new Response(
        JSON.stringify({
          error:
            "No organization found. Please complete your profile setup.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const organizationId = profile.organization_id;

    // ── Subscription enforcement ─────────────────────────────────────
    // Use the proper helper to check session limits, token limits, etc.
    const accessCheck = await checkQuickComplyAccess(user.id);

    if (!accessCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: accessCheck.reason,
          code: accessCheck.reason?.includes("token")
            ? "token_limit"
            : "session_limit",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const resolvedTier = accessCheck.tier;

    // If a specific AI system is requested, verify it's within the tier limit
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;

    if (clientData?.aiSystemId) {
      // Get all AI systems to determine the index of the requested one
      const { data: allSystems } = await sb
        .from("ai_systems")
        .select("id")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: true });

      if (allSystems) {
        const systemIndex = allSystems.findIndex(
          (s: { id: string }) => s.id === clientData.aiSystemId
        );
        const tierConfig = SUBSCRIPTION_TIERS[resolvedTier];

        if (
          tierConfig.maxAISystems !== -1 &&
          systemIndex >= tierConfig.maxAISystems
        ) {
          return new Response(
            JSON.stringify({
              error: `This AI system requires a ${tierConfig.displayName === "Free" ? "Starter" : "higher"} plan. Your ${tierConfig.displayName} plan allows up to ${tierConfig.maxAISystems} AI system${tierConfig.maxAISystems !== 1 ? "s" : ""}.`,
              code: "system_limit",
            }),
            { status: 403, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }

    // ── Get or create session ────────────────────────────────────────
    let sessionId = clientData?.sessionId;
    let sessionData: Record<string, unknown> | null = null;

    if (sessionId) {
      // Load specific session by ID
      const { data: session, error: sessionError } = await sb
        .from("quick_comply_sessions")
        .select("*")
        .eq("id", sessionId)
        .eq("organization_id", organizationId)
        .single();

      if (sessionError || !session) {
        sessionId = undefined;
      } else {
        sessionData = session;
      }
    }

    // If no specific session, try to resume the latest active session
    // Scoped to aiSystemId if provided by the client
    if (!sessionId) {
      let existingQuery = sb
        .from("quick_comply_sessions")
        .select("*")
        .eq("user_id", user.id)
        .eq("organization_id", organizationId)
        .eq("status", "active");

      if (clientData?.aiSystemId) {
        existingQuery = existingQuery.eq("ai_system_id", clientData.aiSystemId);
      }

      const { data: existingSessions } = await existingQuery
        .order("last_activity_at", { ascending: false })
        .limit(1);

      if (existingSessions && existingSessions.length > 0) {
        sessionId = existingSessions[0].id;
        sessionData = existingSessions[0];
      }
    }

    // Only create a new session if no active one exists
    if (!sessionId) {
      const { data: newSession, error: createError } = await sb
        .from("quick_comply_sessions")
        .insert({
          organization_id: organizationId,
          user_id: user.id,
          ai_system_id: clientData?.aiSystemId || null,
          status: "active",
          current_section: "company_info",
          progress_percentage: 0,
          form_data: getInitialFormData(),
          sections_completed: [],
          chat_messages: [],
          subscription_tier: resolvedTier,
        })
        .select("*")
        .single();

      if (createError) {
        console.error("Error creating session:", createError);
        return new Response(
          JSON.stringify({ error: "Failed to create session" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      sessionId = newSession.id;
      sessionData = newSession;
    }

    // Subscription tier for prompt context
    const subscriptionTier = resolvedTier;

    // Build system data context
    const formData =
      (sessionData?.form_data as Record<string, unknown>) ||
      getInitialFormData();
    const sectionsCompleted =
      (sessionData?.sections_completed as SectionId[]) || [];
    const currentSection =
      (sessionData?.current_section as SectionId) || "company_info";
    const riskLevel = sessionData?.risk_classification as
      | "prohibited"
      | "high"
      | "limited"
      | "minimal"
      | undefined;

    const systemData: QuickComplySystemData = {
      sessionId: sessionId!,
      aiSystemId: sessionData?.ai_system_id as string | undefined,
      organizationId,
      userId: user.id,
      formData,
      progress: {
        overall: (sessionData?.progress_percentage as number) || 0,
        sections: buildSectionsProgress(sectionsCompleted, currentSection),
        documentsReady: 0,
        totalDocuments: 7,
        estimatedTimeRemaining: estimateTimeRemaining(sectionsCompleted),
      },
      riskLevel,
      currentSection,
      sectionsCompleted,
      subscriptionTier,
      isNewSession: !clientData?.sessionId,
      isResuming: Boolean(clientData?.sessionId && sessionData),
    };

    // Build system prompt with current context
    const systemPrompt = getSystemPrompt(systemData);

    // Build tools with Supabase client and system data
    const tools = buildTools(supabase, systemData);

    // Convert UI messages to model messages (v6)
    // ignoreIncompleteToolCalls: true prevents crash when tool outputs
    // from client-side UI tools haven't been resolved yet
    const modelMessages = await convertToModelMessages(messages, {
      tools,
      ignoreIncompleteToolCalls: true,
    });

    // Stream response from Claude (AI SDK v6)
    const result = streamText({
      model: anthropic("claude-sonnet-4-5-20250929"),
      system: systemPrompt,
      messages: modelMessages,
      tools,
      stopWhen: stepCountIs(5), // Allow multi-step tool calls
      temperature: 0.7, // Slightly creative for friendly conversation

      // Callbacks for logging/analytics
      onFinish: async ({ totalUsage }) => {
        const totalTokens =
          (totalUsage?.inputTokens || 0) + (totalUsage?.outputTokens || 0);

        // Record token usage for the organization
        if (totalTokens > 0) {
          try {
            await recordTokenUsage(organizationId, totalTokens);
          } catch (error) {
            console.error("Error recording token usage:", error);
          }
        }

        // Update session's token count and last activity
        try {
          const currentTokens =
            (sessionData?.tokens_used as number) || 0;
          await sb
            .from("quick_comply_sessions")
            .update({
              tokens_used: currentTokens + totalTokens,
              last_activity_at: new Date().toISOString(),
            })
            .eq("id", sessionId);
        } catch (error) {
          console.error("Error updating session tokens:", error);
        }
      },
    });

    // Return the stream with session ID in headers (v6: toUIMessageStreamResponse)
    const response = result.toUIMessageStreamResponse();

    // Add session ID to response headers so the client can track it
    response.headers.set("X-Session-Id", sessionId!);

    return response;
  } catch (error) {
    console.error("Quick Comply API Error:", error);

    // Specific error handling
    const err = error as Error & { code?: string; status?: number };

    if (err.message?.includes("rate_limit") || err.status === 429) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please wait a moment and try again.",
          code: "rate_limit",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    if (err.message?.includes("overloaded") || err.status === 529) {
      return new Response(
        JSON.stringify({
          error: "AI service is temporarily overloaded. Please try again shortly.",
          code: "overloaded",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    if (err.name === "AbortError" || err.message?.includes("timeout")) {
      return new Response(
        JSON.stringify({
          error: "Request timed out. Please try again.",
          code: "timeout",
        }),
        { status: 504, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Internal server error", code: "internal" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function buildSectionsProgress(
  completed: SectionId[],
  currentSection: SectionId
): Record<
  SectionId,
  { status: "not_started" | "in_progress" | "completed"; progress: number }
> {
  const allSections: SectionId[] = [
    "company_info",
    "ai_system_details",
    "risk_and_data",
    "human_oversight",
    "testing_metrics",
    "transparency",
    "review_generate",
  ];

  const result: Record<
    string,
    { status: "not_started" | "in_progress" | "completed"; progress: number }
  > = {};

  for (const section of allSections) {
    if (completed.includes(section)) {
      result[section] = { status: "completed", progress: 100 };
    } else if (section === currentSection) {
      result[section] = { status: "in_progress", progress: 0 };
    } else {
      result[section] = { status: "not_started", progress: 0 };
    }
  }

  return result as Record<
    SectionId,
    { status: "not_started" | "in_progress" | "completed"; progress: number }
  >;
}

function estimateTimeRemaining(completed: SectionId[]): number {
  const sectionTimes: Record<SectionId, number> = {
    company_info: 3,
    ai_system_details: 8,
    risk_and_data: 12,
    human_oversight: 8,
    testing_metrics: 8,
    transparency: 5,
    review_generate: 3,
  };

  let remaining = 0;
  for (const [section, time] of Object.entries(sectionTimes)) {
    if (!completed.includes(section as SectionId)) {
      remaining += time;
    }
  }

  return remaining;
}
