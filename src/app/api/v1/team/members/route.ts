import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/team/members - Get team members
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, role")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Get all team members in the organization
    const { data: members, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, role, created_at")
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching members:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get user emails from auth (need to match by id)
    // Note: In production, you might want to store email in profiles table
    const transformedMembers = (members || []).map((member) => ({
      id: member.id,
      name: member.full_name || "Unknown",
      email: "", // Will be populated if we have access to auth.users
      role: member.role || "member",
      avatar: member.avatar_url || "",
      isCurrentUser: member.id === user.id,
    }));

    // Get organization limits
    const { data: org } = await supabase
      .from("organizations")
      .select("max_team_members")
      .eq("id", profile.organization_id)
      .single();

    return NextResponse.json({
      data: transformedMembers,
      userRole: profile.role,
      maxMembers: org?.max_team_members || 5,
    });
  } catch (error) {
    console.error("Error in GET /api/v1/team/members:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
