import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/incidents/[id] - Get incident details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    const { data: incident, error } = await supabase
      .from("agent_incidents")
      .select(`
        *,
        ai_system:ai_systems(id, name)
      `)
      .eq("id", id)
      .eq("organization_id", profile.organization_id)
      .single();

    if (error || !incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    return NextResponse.json({ data: incident });
  } catch (error) {
    console.error("Error in GET /api/v1/incidents/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/v1/incidents/[id] - Update incident status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, full_name")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Verify incident belongs to organization
    const { data: existingIncident } = await supabase
      .from("agent_incidents")
      .select("id, title, ai_system_id, organization_id")
      .eq("id", id)
      .single();

    if (!existingIncident || existingIncident.organization_id !== profile.organization_id) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    const body = await request.json();
    const { status, resolution_notes, reported_to_regulator, regulator_reference } = body;

    // Build update object
    const updateData: Record<string, any> = {};
    
    if (status) {
      updateData.status = status;
      // Set resolved_at timestamp if status is resolved or closed
      if (status === "resolved" || status === "closed") {
        updateData.incident_resolved_at = new Date().toISOString();
      }
    }
    if (resolution_notes !== undefined) {
      updateData.resolution_notes = resolution_notes;
    }
    if (reported_to_regulator !== undefined) {
      updateData.reported_to_regulator = reported_to_regulator;
    }
    if (regulator_reference !== undefined) {
      updateData.regulator_reference = regulator_reference;
    }

    const { data: incident, error } = await supabase
      .from("agent_incidents")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        ai_system:ai_systems(id, name)
      `)
      .single();

    if (error) {
      console.error("Error updating incident:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    const actionDescription = status === "resolved" 
      ? `Resolved incident: ${existingIncident.title}`
      : status === "closed"
        ? `Closed incident: ${existingIncident.title}`
        : `Updated incident: ${existingIncident.title}`;

    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      ai_system_id: existingIncident.ai_system_id,
      user_id: user.id,
      user_name: profile.full_name || user.email,
      action_type: status === "resolved" ? "incident_resolved" : "incident_updated",
      action_description: actionDescription,
      target_type: "incident",
      target_id: id,
      target_name: existingIncident.title,
    });

    return NextResponse.json({ data: incident });
  } catch (error) {
    console.error("Error in PATCH /api/v1/incidents/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
