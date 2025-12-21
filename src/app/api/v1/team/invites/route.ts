import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomBytes } from "crypto";

// GET /api/v1/team/invites - Get pending invitations
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

    // Get pending invitations
    const { data: invites, error } = await supabase
      .from("team_invites")
      .select("id, email, role, status, created_at, expires_at")
      .eq("organization_id", profile.organization_id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching invites:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: invites || [] });
  } catch (error) {
    console.error("Error in GET /api/v1/team/invites:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/team/invites - Create a new invitation
export async function POST(request: NextRequest) {
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
      .select("organization_id, role, full_name")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Only owner and admin can invite members
    if (profile.role !== "owner" && profile.role !== "admin") {
      return NextResponse.json(
        { error: "Only owners and admins can invite team members" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, role } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate role - admins can only invite members, owners can invite admin or member
    const allowedRoles = profile.role === "owner" ? ["admin", "member"] : ["member"];
    const inviteRole = role || "member";
    
    if (!allowedRoles.includes(inviteRole)) {
      return NextResponse.json(
        { error: `You can only invite users with role: ${allowedRoles.join(", ")}` },
        { status: 403 }
      );
    }

    // Check if user already exists in organization
    const { data: existingMember } = await supabase
      .from("profiles")
      .select("id")
      .eq("organization_id", profile.organization_id)
      .ilike("id", `%`) // Get all profiles in org
      .single();

    // Check for existing pending invite
    const { data: existingInvite } = await supabase
      .from("team_invites")
      .select("id")
      .eq("organization_id", profile.organization_id)
      .eq("email", email.toLowerCase())
      .eq("status", "pending")
      .single();

    if (existingInvite) {
      return NextResponse.json(
        { error: "An invitation has already been sent to this email" },
        { status: 400 }
      );
    }

    // Check organization member limit
    const { data: org } = await supabase
      .from("organizations")
      .select("max_team_members")
      .eq("id", profile.organization_id)
      .single();

    const { count: memberCount } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", profile.organization_id);

    const { count: pendingCount } = await supabase
      .from("team_invites")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", profile.organization_id)
      .eq("status", "pending");

    const totalMembers = (memberCount || 0) + (pendingCount || 0);
    if (org?.max_team_members && totalMembers >= org.max_team_members) {
      return NextResponse.json(
        { error: "Team member limit reached. Please upgrade your plan." },
        { status: 403 }
      );
    }

    // Generate invitation token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    // Create invitation
    const { data: invite, error } = await supabase
      .from("team_invites")
      .insert({
        organization_id: profile.organization_id,
        email: email.toLowerCase(),
        role: inviteRole,
        token,
        expires_at: expiresAt.toISOString(),
        invited_by: user.id,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating invite:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      user_id: user.id,
      user_name: profile.full_name || user.email,
      action_type: "team_invite_sent",
      action_description: `Invited ${email} as ${inviteRole}`,
      target_type: "team_invite",
      target_id: invite.id,
      target_name: email,
    });

    // Get organization name for the email
    const { data: orgDetails } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", profile.organization_id)
      .single();

    // Send invitation email via Edge Function
    const EDGE_FUNCTION_URL = process.env.NEXT_PUBLIC_SUPABASE_URL + "/functions/v1/send-email";
    let emailSent = false;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const emailResponse = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          type: "team-invite",
          to: email.toLowerCase(),
          inviterName: profile.full_name || user.email || "A team member",
          organizationName: orgDetails?.name || "your organization",
          role: inviteRole,
          inviteToken: token,
        }),
      });

      const emailResult = await emailResponse.json();
      emailSent = emailResult.success;
      
      if (!emailSent) {
        console.warn("Failed to send invite email:", emailResult.error);
      }
    } catch (emailError) {
      console.error("Error calling send-email edge function:", emailError);
    }

    return NextResponse.json({ 
      data: invite,
      emailSent,
    });
  } catch (error) {
    console.error("Error in POST /api/v1/team/invites:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
