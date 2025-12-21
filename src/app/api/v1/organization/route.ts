import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/organization - Get current user's organization
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's profile with organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, role")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Get organization details
    const { data: organization, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", profile.organization_id)
      .single();

    if (error || !organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      data: organization,
      userRole: profile.role || "member"
    });
  } catch (error) {
    console.error("Error in GET /api/v1/organization:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/v1/organization - Update organization settings
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's profile with organization and role
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, role, full_name")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Only owner and admin can update organization settings
    if (profile.role !== "owner" && profile.role !== "admin") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      industry,
      company_size,
      country,
      has_eu_presence,
      legal_name,
      vat_number,
      logo_url,
      trust_center_enabled,
    } = body;

    // Build update object with only provided fields
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (industry !== undefined) updateData.industry = industry;
    if (company_size !== undefined) updateData.company_size = company_size;
    if (country !== undefined) updateData.country = country;
    if (has_eu_presence !== undefined) updateData.has_eu_presence = has_eu_presence;
    if (legal_name !== undefined) updateData.legal_name = legal_name;
    if (vat_number !== undefined) updateData.vat_number = vat_number;
    if (logo_url !== undefined) updateData.logo_url = logo_url;
    if (trust_center_enabled !== undefined) updateData.trust_center_enabled = trust_center_enabled;

    updateData.updated_at = new Date().toISOString();

    const { data: organization, error } = await supabase
      .from("organizations")
      .update(updateData)
      .eq("id", profile.organization_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating organization:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      user_id: user.id,
      user_name: profile.full_name || user.email,
      action_type: "organization_updated",
      action_description: "Updated organization settings",
      target_type: "organization",
      target_id: profile.organization_id,
      target_name: organization.name,
    });

    return NextResponse.json({ data: organization });
  } catch (error) {
    console.error("Error in PATCH /api/v1/organization:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
