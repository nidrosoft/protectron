import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/organization/api-keys/[id] - Get a specific API key
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

    // Get the API key
    const { data: apiKey, error } = await supabase
      .from("organization_api_keys")
      .select("*")
      .eq("id", id)
      .eq("organization_id", profile.organization_id)
      .single();

    if (error || !apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    return NextResponse.json({ data: apiKey });
  } catch (error) {
    console.error("Error in GET /api/v1/organization/api-keys/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/v1/organization/api-keys/[id] - Update an API key (name or revoke)
export async function PATCH(
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

    // Get user's organization and role
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, role")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Check if user has permission
    if (!["owner", "admin"].includes(profile.role || "")) {
      return NextResponse.json(
        { error: "Only owners and admins can update API keys" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, status } = body;

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json({ error: "Invalid name" }, { status: 400 });
      }
      updateData.name = name.trim();
    }

    if (status !== undefined) {
      if (!["active", "revoked"].includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updateData.status = status;
      if (status === "revoked") {
        updateData.revoked_at = new Date().toISOString();
        updateData.revoked_by = user.id;
      }
    }

    // Update the API key
    const { data: apiKey, error } = await supabase
      .from("organization_api_keys")
      .update(updateData)
      .eq("id", id)
      .eq("organization_id", profile.organization_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating API key:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    // Log activity
    const actionType = status === "revoked" ? "api_key_revoked" : "api_key_updated";
    const actionDesc = status === "revoked" 
      ? `Revoked API key: ${apiKey.name}` 
      : `Updated API key: ${apiKey.name}`;

    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      user_id: user.id,
      action_type: actionType,
      action_description: actionDesc,
    });

    return NextResponse.json({ data: apiKey });
  } catch (error) {
    console.error("Error in PATCH /api/v1/organization/api-keys/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/v1/organization/api-keys/[id] - Delete an API key
export async function DELETE(
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

    // Get user's organization and role
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, role")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Check if user has permission
    if (!["owner", "admin"].includes(profile.role || "")) {
      return NextResponse.json(
        { error: "Only owners and admins can delete API keys" },
        { status: 403 }
      );
    }

    // Get the key name before deleting for logging
    const { data: existingKey } = await supabase
      .from("organization_api_keys")
      .select("name")
      .eq("id", id)
      .eq("organization_id", profile.organization_id)
      .single();

    if (!existingKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    // Delete the API key
    const { error } = await supabase
      .from("organization_api_keys")
      .delete()
      .eq("id", id)
      .eq("organization_id", profile.organization_id);

    if (error) {
      console.error("Error deleting API key:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      user_id: user.id,
      action_type: "api_key_deleted",
      action_description: `Deleted API key: ${existingKey.name}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/v1/organization/api-keys/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
