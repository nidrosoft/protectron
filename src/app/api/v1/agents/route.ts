import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/agents - List all agents for the organization
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
    const framework = searchParams.get("framework");

    // Build query - filter for agents only (system_type = 'ai_agent')
    let query = supabase
      .from("ai_systems")
      .select("*", { count: "exact" })
      .eq("organization_id", profile.organization_id)
      .eq("system_type", "ai_agent")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("lifecycle_status", status);
    }
    if (framework) {
      query = query.eq("agent_framework", framework);
    }

    const { data: agents, error, count } = await query;

    if (error) {
      console.error("Error fetching agents:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: agents,
      total: count,
    });
  } catch (error) {
    console.error("Error in GET /api/v1/agents:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/agents - Create a new agent
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      name,
      description,
      agent_framework,
      agent_capabilities,
      risk_level,
      provider,
      model_name,
      category,
      serves_eu,
      processes_in_eu,
      established_in_eu,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Create the agent
    const { data: agent, error } = await supabase
      .from("ai_systems")
      .insert({
        organization_id: profile.organization_id,
        name,
        description: description || null,
        system_type: "ai_agent",
        agent_framework: agent_framework || null,
        agent_capabilities: agent_capabilities || [],
        risk_level: risk_level || "high_risk",
        provider: provider || null,
        model_name: model_name || null,
        category: category || null,
        lifecycle_status: "draft",
        sdk_connected: false,
        serves_eu: serves_eu || false,
        processes_in_eu: processes_in_eu || false,
        established_in_eu: established_in_eu || false,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating agent:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      ai_system_id: agent.id,
      user_id: user.id,
      action_type: "created",
      action_description: `Created new agent: ${name}`,
    });

    return NextResponse.json({ data: agent }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/agents:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
