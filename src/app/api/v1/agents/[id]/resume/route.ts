import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/v1/agents/[id]/resume - Resume a paused agent
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

    // Update AI system lifecycle status to active
    const { data: system, error } = await supabase
      .from("ai_systems")
      .update({ lifecycle_status: "active" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error resuming agent:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      ai_system_id: id,
      user_id: user.id,
      user_name: profile.full_name,
      action_type: "resumed",
      action_description: `Resumed agent "${system.name}"`,
      target_type: "ai_system",
      target_id: id,
      target_name: system.name,
      metadata: { reason: body.reason },
    });

    return NextResponse.json({
      data: {
        success: true,
        message: "Agent resumed successfully",
        system_status: "active",
      },
    });
  } catch (error) {
    console.error("Error in POST /api/v1/agents/[id]/resume:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
