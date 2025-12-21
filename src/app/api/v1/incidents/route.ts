import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/incidents - List all incidents for the organization
export async function GET(request: NextRequest) {
  try {
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

    // Get query params for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");
    const aiSystemId = searchParams.get("ai_system_id");

    // Build query
    let query = supabase
      .from("agent_incidents")
      .select(`
        *,
        ai_system:ai_systems(id, name)
      `)
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }
    if (severity) {
      query = query.eq("severity", severity);
    }
    if (aiSystemId) {
      query = query.eq("ai_system_id", aiSystemId);
    }

    const { data: incidents, error } = await query;

    if (error) {
      console.error("Error fetching incidents:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: incidents });
  } catch (error) {
    console.error("Error in GET /api/v1/incidents:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/incidents - Report a new incident
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organization and profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, full_name")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      ai_system_id,
      incident_type,
      severity,
      title,
      description,
      affected_individuals_count,
      affected_individual_categories,
      harm_description,
      incident_occurred_at,
      incident_detected_at,
      related_event_ids,
      reported_to_regulator,
    } = body;

    if (!title || !description || !incident_type || !severity) {
      return NextResponse.json(
        { error: "Title, description, incident_type, and severity are required" },
        { status: 400 }
      );
    }

    // Create the incident
    const { data: incident, error } = await supabase
      .from("agent_incidents")
      .insert({
        organization_id: profile.organization_id,
        ai_system_id: ai_system_id || null,
        incident_type,
        severity,
        title,
        description,
        affected_individuals_count: affected_individuals_count || 0,
        affected_individual_categories: affected_individual_categories || [],
        harm_description: harm_description || null,
        incident_occurred_at: incident_occurred_at || new Date().toISOString(),
        incident_detected_at: incident_detected_at || new Date().toISOString(),
        incident_reported_at: new Date().toISOString(),
        related_event_ids: related_event_ids || [],
        reported_to_regulator: reported_to_regulator || false,
        status: "open",
        reported_by_user_id: user.id,
        reported_by_email: user.email,
      })
      .select(`
        *,
        ai_system:ai_systems(id, name)
      `)
      .single();

    if (error) {
      console.error("Error creating incident:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      ai_system_id: ai_system_id || null,
      user_id: user.id,
      user_name: profile.full_name,
      action_type: "incident_reported",
      action_description: `Reported incident: ${title}`,
    });

    return NextResponse.json({ data: incident }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/incidents:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
