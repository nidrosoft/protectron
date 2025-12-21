import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/agents/[id]/relationships - Get multi-agent relationships
export async function GET(
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
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Get relationships where this agent is the parent
    const { data: childRelationships, error: childError } = await supabase
      .from("agent_relationships")
      .select(`
        id,
        relationship_type,
        delegation_rules,
        created_at,
        child_agent:child_agent_id (
          id,
          name,
          system_type,
          lifecycle_status
        )
      `)
      .eq("parent_agent_id", id)
      .eq("organization_id", profile.organization_id);

    if (childError) {
      console.error("Error fetching child relationships:", childError);
    }

    // Get relationships where this agent is the child
    const { data: parentRelationships, error: parentError } = await supabase
      .from("agent_relationships")
      .select(`
        id,
        relationship_type,
        delegation_rules,
        created_at,
        parent_agent:parent_agent_id (
          id,
          name,
          system_type,
          lifecycle_status
        )
      `)
      .eq("child_agent_id", id)
      .eq("organization_id", profile.organization_id);

    if (parentError) {
      console.error("Error fetching parent relationships:", parentError);
    }

    return NextResponse.json({
      data: {
        agent_id: id,
        children: childRelationships || [],
        parents: parentRelationships || [],
        total_relationships: (childRelationships?.length || 0) + (parentRelationships?.length || 0),
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/agents/[id]/relationships:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/agents/[id]/relationships - Create a relationship
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
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    const body = await request.json();
    const { child_agent_id, relationship_type, delegation_rules } = body;

    if (!child_agent_id) {
      return NextResponse.json({ error: "child_agent_id is required" }, { status: 400 });
    }

    if (!relationship_type) {
      return NextResponse.json({ error: "relationship_type is required" }, { status: 400 });
    }

    // Verify both agents belong to the organization
    const { data: agents } = await supabase
      .from("ai_systems")
      .select("id")
      .eq("organization_id", profile.organization_id)
      .in("id", [id, child_agent_id]);

    if (!agents || agents.length !== 2) {
      return NextResponse.json({ error: "One or both agents not found" }, { status: 404 });
    }

    // Create the relationship
    const { data: relationship, error } = await supabase
      .from("agent_relationships")
      .insert({
        organization_id: profile.organization_id,
        parent_agent_id: id,
        child_agent_id,
        relationship_type,
        delegation_rules: delegation_rules || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating relationship:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: relationship }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/agents/[id]/relationships:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
