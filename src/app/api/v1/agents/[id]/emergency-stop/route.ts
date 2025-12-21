import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/v1/agents/[id]/emergency-stop - Trigger emergency stop
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Get user's profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, full_name")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Update AI system lifecycle status to paused
    const { data: system, error } = await supabase
      .from("ai_systems")
      .update({ lifecycle_status: "paused" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error triggering emergency stop:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log emergency stop event
    await supabase.from("agent_audit_events").insert({
      ai_system_id: id,
      event_id_external: `evt_emergency_${Date.now()}`,
      trace_id: `trace_emergency_${Date.now()}`,
      event_type: "emergency_stop",
      event_name: "Emergency Stop Triggered",
      action: "emergency_stop",
      event_timestamp: new Date().toISOString(),
      details: {
        triggered_by: user.email,
        reason: body.reason || "No reason provided",
      },
      override_by: user.email,
    });

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      ai_system_id: id,
      user_id: user.id,
      user_name: profile.full_name,
      action_type: "emergency_stop",
      action_description: `Triggered emergency stop for "${system.name}"`,
      target_type: "ai_system",
      target_id: id,
      target_name: system.name,
      metadata: { reason: body.reason },
    });

    return NextResponse.json({
      data: {
        success: true,
        message: "Emergency stop triggered successfully",
        system_status: "paused",
      },
    });
  } catch (error) {
    console.error("Error in POST /api/v1/agents/[id]/emergency-stop:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
