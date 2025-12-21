import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/agents/[id]/incidents - List incidents for an agent
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");

    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = supabase
      .from("agent_incidents")
      .select("*")
      .eq("ai_system_id", id)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }
    if (severity) {
      query = query.eq("severity", severity);
    }

    const { data: incidents, error } = await query;

    if (error) {
      console.error("Error fetching incidents:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: incidents });
  } catch (error) {
    console.error("Error in GET /api/v1/agents/[id]/incidents:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/agents/[id]/incidents - Report a new incident
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

    // Validate required fields
    if (!body.incident_type || !body.severity || !body.title || !body.description) {
      return NextResponse.json(
        { error: "incident_type, severity, title, and description are required" },
        { status: 400 }
      );
    }

    const { data: incident, error } = await supabase
      .from("agent_incidents")
      .insert({
        ai_system_id: id,
        organization_id: profile.organization_id,
        reported_by_user_id: user.id,
        reported_by_email: user.email,
        incident_type: body.incident_type,
        severity: body.severity,
        title: body.title,
        description: body.description,
        affected_individuals_count: body.affected_individuals_count,
        affected_individual_categories: body.affected_individual_categories,
        harm_description: body.harm_description,
        incident_occurred_at: body.incident_occurred_at || new Date().toISOString(),
        incident_detected_at: body.incident_detected_at || new Date().toISOString(),
        related_event_ids: body.related_event_ids,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating incident:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      ai_system_id: id,
      user_id: user.id,
      user_name: profile.full_name,
      action_type: "incident_reported",
      action_description: `Reported incident: ${body.title}`,
      target_type: "incident",
      target_id: incident.id,
      target_name: body.title,
    });

    return NextResponse.json({ data: incident }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/agents/[id]/incidents:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
