import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/v1/organization/logo - Upload organization logo
export async function POST(request: NextRequest) {
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

    // Only owner and admin can update organization logo
    if (profile.role !== "owner" && profile.role !== "admin") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: PNG, JPEG, WebP, SVG" },
        { status: 400 }
      );
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 2MB" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${profile.organization_id}/logo.${fileExt}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("organization-assets")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Error uploading logo:", uploadError);
      return NextResponse.json({ error: "Failed to upload logo" }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("organization-assets")
      .getPublicUrl(fileName);

    const logoUrl = urlData.publicUrl;

    // Update organization with logo URL
    const { error: updateError } = await supabase
      .from("organizations")
      .update({ logo_url: logoUrl, updated_at: new Date().toISOString() })
      .eq("id", profile.organization_id);

    if (updateError) {
      console.error("Error updating organization:", updateError);
      return NextResponse.json({ error: "Failed to update organization" }, { status: 500 });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      user_id: user.id,
      user_name: profile.full_name || user.email,
      action_type: "logo_uploaded",
      action_description: "Uploaded organization logo",
      target_type: "organization",
      target_id: profile.organization_id,
    });

    return NextResponse.json({ data: { logo_url: logoUrl } });
  } catch (error) {
    console.error("Error in POST /api/v1/organization/logo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/v1/organization/logo - Remove organization logo
export async function DELETE() {
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

    if (profile.role !== "owner" && profile.role !== "admin") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    // Remove logo URL from organization
    await supabase
      .from("organizations")
      .update({ logo_url: null, updated_at: new Date().toISOString() })
      .eq("id", profile.organization_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/v1/organization/logo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
