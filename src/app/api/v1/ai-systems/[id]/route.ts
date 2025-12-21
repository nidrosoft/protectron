import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/ai-systems/[id] - Get a single AI system with all related data
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get AI system with all related data
    const { data: system, error } = await supabase
      .from("ai_systems")
      .select(`
        *,
        ai_system_certifications (*),
        agent_sdk_configs (*),
        ai_system_requirements (*),
        documents (*),
        evidence (*),
        agent_hitl_rules (*),
        agent_statistics (*)
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "AI system not found" }, { status: 404 });
      }
      console.error("Error fetching AI system:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get recent activity for this system
    const { data: activity } = await supabase
      .from("activity_log")
      .select("*")
      .eq("ai_system_id", id)
      .order("created_at", { ascending: false })
      .limit(20);

    // Get recent audit events for agents
    let auditEvents = null;
    if (system.system_type === "ai_agent") {
      const { data: events } = await supabase
        .from("agent_audit_events")
        .select("*")
        .eq("ai_system_id", id)
        .order("event_timestamp", { ascending: false })
        .limit(50);
      auditEvents = events;
    }

    // Get related agents for multi-agent systems
    let relatedAgents = null;
    if (system.is_multi_agent) {
      const { data: relationships } = await supabase
        .from("agent_relationships")
        .select(`
          *,
          child_agent:ai_systems!agent_relationships_child_agent_id_fkey (id, name, system_type)
        `)
        .eq("parent_agent_id", id);
      relatedAgents = relationships;
    }

    return NextResponse.json({
      data: {
        ...system,
        activity,
        auditEvents,
        relatedAgents,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/ai-systems/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/v1/ai-systems/[id] - Update an AI system
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Update AI system (only allowed fields)
    const allowedFields = [
      "name",
      "description",
      "provider",
      "model_name",
      "category",
      "deployment_status",
      "lifecycle_status",
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const { data: system, error } = await supabase
      .from("ai_systems")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating AI system:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, full_name")
      .eq("id", user.id)
      .single();

    if (profile) {
      await supabase.from("activity_log").insert({
        organization_id: profile.organization_id!,
        ai_system_id: system.id,
        user_id: user.id,
        user_name: profile.full_name,
        action_type: "updated",
        action_description: `Updated AI system "${system.name}"`,
        target_type: "ai_system",
        target_id: system.id,
        target_name: system.name,
      });
    }

    return NextResponse.json({ data: system });
  } catch (error) {
    console.error("Error in PATCH /api/v1/ai-systems/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/v1/ai-systems/[id] - Delete an AI system
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user role (only admin/owner can delete)
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, role")
      .eq("id", user.id)
      .single();

    if (!profile || !["owner", "admin"].includes(profile.role || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get system name before deletion for logging
    const { data: system } = await supabase
      .from("ai_systems")
      .select("name")
      .eq("id", id)
      .single();

    // Delete AI system (cascades to related tables)
    const { error } = await supabase
      .from("ai_systems")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting AI system:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    if (system) {
      await supabase.from("activity_log").insert({
        organization_id: profile.organization_id!,
        user_id: user.id,
        action_type: "deleted",
        action_description: `Deleted AI system "${system.name}"`,
        target_type: "ai_system",
        target_name: system.name,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/v1/ai-systems/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
