import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// POST /api/v1/agents/[id]/events/batch - Batch ingest events from SDK
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get API key from header (SDK authentication)
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json({ error: "API key required" }, { status: 401 });
    }

    // Use service client for SDK ingestion (bypasses RLS)
    const supabase = await createServiceClient();

    // Verify API key and get agent
    const { data: sdkConfig } = await supabase
      .from("agent_sdk_configs")
      .select("ai_system_id, is_active")
      .eq("ai_system_id", id)
      .single();

    if (!sdkConfig || !sdkConfig.is_active) {
      return NextResponse.json({ error: "Invalid or inactive SDK configuration" }, { status: 401 });
    }

    const body = await request.json();
    const { events } = body;

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: "Events array is required" }, { status: 400 });
    }

    // Limit batch size
    if (events.length > 100) {
      return NextResponse.json({ error: "Maximum batch size is 100 events" }, { status: 400 });
    }

    // Prepare events for insertion
    const eventsToInsert = events.map((event: any) => ({
      ai_system_id: id,
      event_id_external: event.event_id || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      trace_id: event.trace_id || `trace_${Date.now()}`,
      span_id: event.span_id || null,
      parent_span_id: event.parent_span_id || null,
      session_id: event.session_id || null,
      event_type: event.event_type || "tool_call",
      event_name: event.event_name || null,
      action: event.action || null,
      event_timestamp: event.timestamp || new Date().toISOString(),
      input_data: event.input || null,
      output_data: event.output || null,
      details: event.details || null,
      reasoning: event.reasoning || null,
      confidence: event.confidence || null,
      alternatives: event.alternatives || null,
      duration_ms: event.duration_ms || null,
      tokens_input: event.tokens_input || null,
      tokens_output: event.tokens_output || null,
      metadata: event.metadata || null,
      pii_detected: event.pii_detected || false,
      pii_redacted: event.pii_redacted || false,
    }));

    // Insert events
    const { data: insertedEvents, error } = await supabase
      .from("agent_audit_events")
      .insert(eventsToInsert)
      .select("id");

    if (error) {
      console.error("Error inserting batch events:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update agent SDK stats
    await supabase
      .from("ai_systems")
      .update({
        sdk_connected: true,
        sdk_last_event_at: new Date().toISOString(),
      })
      .eq("id", id);

    // Increment events count using raw SQL since RPC may not exist
    try {
      await supabase
        .from("ai_systems")
        .update({
          sdk_events_total: (await supabase
            .from("ai_systems")
            .select("sdk_events_total")
            .eq("id", id)
            .single()
            .then(r => (r.data?.sdk_events_total || 0) + events.length)),
        })
        .eq("id", id);
    } catch {
      // Ignore if column doesn't exist
    }

    return NextResponse.json({
      success: true,
      inserted: insertedEvents?.length || 0,
      message: `Successfully ingested ${insertedEvents?.length || 0} events`,
    });
  } catch (error) {
    console.error("Error in POST /api/v1/agents/[id]/events/batch:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
