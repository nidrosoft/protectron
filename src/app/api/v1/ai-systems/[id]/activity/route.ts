import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/ai-systems/[id]/activity - Get activity for a specific AI system
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

    // Get user's organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Verify AI system belongs to organization
    const { data: aiSystem } = await supabase
      .from("ai_systems")
      .select("id, name, organization_id")
      .eq("id", id)
      .single();

    if (!aiSystem || aiSystem.organization_id !== profile.organization_id) {
      return NextResponse.json({ error: "AI system not found" }, { status: 404 });
    }

    // Get query params for pagination
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Fetch activity for this AI system
    const { data: activities, error, count } = await supabase
      .from("activity_log")
      .select("*", { count: "exact" })
      .eq("organization_id", profile.organization_id)
      .eq("ai_system_id", id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching activity:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform activity data
    const transformedActivities = (activities || []).map((activity) => ({
      id: activity.id,
      actionType: activity.action_type,
      description: activity.action_description,
      targetType: activity.target_type,
      targetName: activity.target_name,
      targetId: activity.target_id,
      userName: activity.user_name || "System",
      userAvatar: activity.user_avatar_url,
      createdAt: activity.created_at,
      metadata: activity.metadata,
    }));

    return NextResponse.json({
      data: transformedActivities,
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error in GET /api/v1/ai-systems/[id]/activity:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
