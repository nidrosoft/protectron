import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

// GET /api/v1/agents/[id]/events - Get audit events for an agent
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const eventType = searchParams.get("type");
    const traceId = searchParams.get("trace_id");
    const sessionId = searchParams.get("session_id");

    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Build query
    let query = supabase
      .from("agent_audit_events")
      .select("*", { count: "exact" })
      .eq("ai_system_id", id)
      .order("event_timestamp", { ascending: false })
      .range(offset, offset + limit - 1);

    if (eventType) {
      query = query.eq("event_type", eventType);
    }
    if (traceId) {
      query = query.eq("trace_id", traceId);
    }
    if (sessionId) {
      query = query.eq("session_id", sessionId);
    }

    const { data: events, error, count } = await query;

    if (error) {
      console.error("Error fetching audit events:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: events,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/agents/[id]/events:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/agents/[id]/events - Ingest event from SDK
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get API key from header
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 });
    }

    // Use service client for SDK ingestion
    const supabase = createServiceClient();

    // Verify API key and get agent
    const apiKeyPrefix = apiKey.substring(0, 8);
    const { data: sdkConfig, error: configError } = await supabase
      .from("agent_sdk_configs")
      .select("ai_system_id, is_active")
      .eq("agent_id_external", id)
      .eq("api_key_prefix", apiKeyPrefix)
      .single();

    if (configError || !sdkConfig) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    if (!sdkConfig.is_active) {
      return NextResponse.json({ error: "SDK is disabled" }, { status: 403 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.event_id || !body.event_type || !body.trace_id || !body.timestamp) {
      return NextResponse.json(
        { error: "Missing required fields: event_id, event_type, trace_id, timestamp" },
        { status: 400 }
      );
    }

    // Insert event
    const { data: event, error } = await supabase
      .from("agent_audit_events")
      .insert({
        ai_system_id: sdkConfig.ai_system_id,
        event_id_external: body.event_id,
        trace_id: body.trace_id,
        span_id: body.span_id,
        parent_span_id: body.parent_span_id,
        session_id: body.session_id,
        event_type: body.event_type,
        event_name: body.event_name,
        action: body.action,
        event_timestamp: body.timestamp,
        input_data: body.input,
        output_data: body.output,
        details: body.details,
        reasoning: body.reasoning,
        confidence: body.confidence,
        alternatives: body.alternatives,
        override_by: body.override_by,
        override_decision: body.override_decision,
        override_reason: body.override_reason,
        response_time_seconds: body.response_time,
        duration_ms: body.duration_ms,
        tokens_input: body.tokens_input,
        tokens_output: body.tokens_output,
        metadata: body.metadata,
        pii_detected: body.pii_detected,
        pii_redacted: body.pii_redacted,
      })
      .select()
      .single();

    if (error) {
      // Handle duplicate event
      if (error.code === "23505") {
        return NextResponse.json({ error: "Duplicate event ID" }, { status: 409 });
      }
      console.error("Error inserting audit event:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update AI system SDK stats
    await supabase
      .from("ai_systems")
      .update({
        sdk_connected: true,
        sdk_last_event_at: new Date().toISOString(),
      })
      .eq("id", sdkConfig.ai_system_id);

    return NextResponse.json({ data: { id: event.id } }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/agents/[id]/events:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
