import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomBytes, createHash } from "crypto";

// GET /api/v1/organization/api-keys - List all API keys for the organization
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
      .select("organization_id, role")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Get all API keys for the organization
    const { data: apiKeys, error } = await supabase
      .from("organization_api_keys")
      .select(`
        id,
        name,
        key_prefix,
        environment,
        last_used_at,
        usage_count,
        status,
        created_at,
        created_by
      `)
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching API keys:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: apiKeys || [],
    });
  } catch (error) {
    console.error("Error in GET /api/v1/organization/api-keys:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/organization/api-keys - Create a new API key
export async function POST(request: NextRequest) {
  try {
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

    // Check if user has permission (owner or admin)
    if (!["owner", "admin"].includes(profile.role || "")) {
      return NextResponse.json(
        { error: "Only owners and admins can create API keys" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, environment = "production" } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Generate API key
    const envPrefix = environment === "production" ? "pk_live_" : environment === "development" ? "pk_dev_" : "pk_test_";
    const apiKeyRaw = `${envPrefix}${randomBytes(32).toString("hex")}`;
    const apiKeyHash = createHash("sha256").update(apiKeyRaw).digest("hex");
    const apiKeyPrefix = apiKeyRaw.substring(0, 12);

    // Create the API key record
    const { data: apiKey, error } = await supabase
      .from("organization_api_keys")
      .insert({
        organization_id: profile.organization_id,
        name: name.trim(),
        key_hash: apiKeyHash,
        key_prefix: apiKeyPrefix,
        environment,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating API key:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      user_id: user.id,
      action_type: "api_key_created",
      action_description: `Created API key: ${name}`,
    });

    // Return the full API key (only shown once)
    return NextResponse.json({
      data: {
        id: apiKey.id,
        name: apiKey.name,
        key: apiKeyRaw, // Only returned on creation
        key_prefix: apiKeyPrefix,
        environment: apiKey.environment,
        created_at: apiKey.created_at,
        message: "Store this API key securely. It will not be shown again.",
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/organization/api-keys:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
