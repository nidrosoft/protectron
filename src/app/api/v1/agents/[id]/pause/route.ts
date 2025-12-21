import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/v1/agents/[id]/pause - Pause agent
export async function POST(
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
      .select("organization_id, full_name")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    const body = await request.json();
    const { reason } = body;

    // Get current agent status
    const { data: currentAgent } = await supabase
      .from("ai_systems")
      .select("lifecycle_status, name")
      .eq("id", id)
      .eq("organization_id", profile.organization_id)
      .single();

    if (!currentAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (currentAgent.lifecycle_status !== "active") {
      return NextResponse.json(
        { error: "Agent can only be paused from active status" },
        { status: 400 }
      );
    }

    // Update lifecycle status to paused
    const { data: agent, error } = await supabase
      .from("ai_systems")
      .update({
        lifecycle_status: "paused",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("organization_id", profile.organization_id)
      .select()
      .single();

    if (error) {
      console.error("Error pausing agent:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      ai_system_id: id,
      user_id: user.id,
      user_name: profile.full_name,
      action_type: "paused",
      action_description: `Paused agent: ${agent.name}${reason ? ` - Reason: ${reason}` : ""}`,
    });

    return NextResponse.json({
      data: agent,
      message: "Agent paused successfully",
    });
  } catch (error) {
    console.error("Error in POST /api/v1/agents/[id]/pause:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
