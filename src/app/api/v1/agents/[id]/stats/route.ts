import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/agents/[id]/stats - Get agent statistics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "daily";
    const days = parseInt(searchParams.get("days") || "30");

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get pre-computed statistics if available
    const { data: stats } = await supabase
      .from("agent_statistics")
      .select("*")
      .eq("ai_system_id", id)
      .eq("period_type", period)
      .gte("period_start", startDate.toISOString())
      .lte("period_end", endDate.toISOString())
      .order("period_start", { ascending: false });

    // If no pre-computed stats, calculate from events
    if (!stats || stats.length === 0) {
      // Get events for the period
      const { data: events } = await supabase
        .from("agent_audit_events")
        .select("event_type, duration_ms, tokens_input, tokens_output")
        .eq("ai_system_id", id)
        .gte("event_timestamp", startDate.toISOString())
        .lte("event_timestamp", endDate.toISOString());

      if (!events || events.length === 0) {
        return NextResponse.json({
          data: {
            period: { start: startDate.toISOString(), end: endDate.toISOString(), type: period },
            totals: {
              total_events: 0,
              tool_calls: 0,
              decisions: 0,
              human_overrides: 0,
              errors: 0,
              escalations: 0,
            },
            rates: {
              error_rate: 0,
              override_rate: 0,
              escalation_rate: 0,
              human_oversight_rate: 0,
            },
            performance: {
              avg_response_time_ms: 0,
              avg_tokens_per_action: 0,
            },
          },
        });
      }

      // Calculate stats from events
      const totalEvents = events.length;
      const toolCalls = events.filter((e) => e.event_type === "tool_call").length;
      const decisions = events.filter((e) => e.event_type === "decision" || e.event_type === "decision_made").length;
      const humanOverrides = events.filter((e) => e.event_type === "human_override").length;
      const errors = events.filter((e) => e.event_type === "error").length;
      const escalations = events.filter((e) => e.event_type === "escalation").length;

      const totalDuration = events.reduce((sum, e) => sum + (e.duration_ms || 0), 0);
      const totalTokens = events.reduce((sum, e) => sum + (e.tokens_input || 0) + (e.tokens_output || 0), 0);

      return NextResponse.json({
        data: {
          period: { start: startDate.toISOString(), end: endDate.toISOString(), type: period },
          totals: {
            total_events: totalEvents,
            tool_calls: toolCalls,
            decisions,
            human_overrides: humanOverrides,
            errors,
            escalations,
          },
          rates: {
            error_rate: totalEvents > 0 ? (errors / totalEvents) * 100 : 0,
            override_rate: totalEvents > 0 ? (humanOverrides / totalEvents) * 100 : 0,
            escalation_rate: totalEvents > 0 ? (escalations / totalEvents) * 100 : 0,
            human_oversight_rate: totalEvents > 0 ? (humanOverrides / totalEvents) * 100 : 0,
          },
          performance: {
            avg_response_time_ms: totalEvents > 0 ? totalDuration / totalEvents : 0,
            avg_tokens_per_action: totalEvents > 0 ? totalTokens / totalEvents : 0,
          },
        },
      });
    }

    // Return pre-computed stats
    return NextResponse.json({
      data: {
        period: { start: startDate.toISOString(), end: endDate.toISOString(), type: period },
        stats,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/agents/[id]/stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
