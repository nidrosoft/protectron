import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// DELETE /api/v1/team/invites/[id] - Cancel an invitation
export async function DELETE(
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
      .select("organization_id, role")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Only owner and admin can cancel invitations
    if (profile.role !== "owner" && profile.role !== "admin") {
      return NextResponse.json(
        { error: "Only owners and admins can cancel invitations" },
        { status: 403 }
      );
    }

    // Verify invite belongs to organization
    const { data: invite } = await supabase
      .from("team_invites")
      .select("id, organization_id")
      .eq("id", id)
      .single();

    if (!invite || invite.organization_id !== profile.organization_id) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Delete the invitation
    const { error } = await supabase
      .from("team_invites")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting invite:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/v1/team/invites/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/team/invites/[id] - Resend an invitation
export async function POST(
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
      .select("organization_id, role, full_name")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    if (profile.role !== "owner" && profile.role !== "admin") {
      return NextResponse.json(
        { error: "Only owners and admins can resend invitations" },
        { status: 403 }
      );
    }

    // Verify invite belongs to organization
    const { data: invite } = await supabase
      .from("team_invites")
      .select("*")
      .eq("id", id)
      .eq("organization_id", profile.organization_id)
      .single();

    if (!invite) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // Update expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await supabase
      .from("team_invites")
      .update({ expires_at: expiresAt.toISOString() })
      .eq("id", id);

    // TODO: Resend invitation email

    return NextResponse.json({ success: true, message: "Invitation resent" });
  } catch (error) {
    console.error("Error in POST /api/v1/team/invites/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
