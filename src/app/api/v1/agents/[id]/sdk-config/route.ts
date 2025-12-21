import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomBytes, createHash } from "crypto";

// GET /api/v1/agents/[id]/sdk-config - Get SDK configuration
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

    // Verify agent belongs to organization
    const { data: agent } = await supabase
      .from("ai_systems")
      .select("id, name, sdk_connected, sdk_last_event_at, sdk_events_total")
      .eq("id", id)
      .eq("organization_id", profile.organization_id)
      .single();

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Get SDK config
    const { data: config } = await supabase
      .from("agent_sdk_configs")
      .select("*")
      .eq("ai_system_id", id)
      .single();

    if (!config) {
      return NextResponse.json({
        data: {
          agent_id: id,
          agent_name: agent.name,
          has_config: false,
          sdk_connected: agent.sdk_connected,
          sdk_last_event_at: agent.sdk_last_event_at,
          sdk_events_total: agent.sdk_events_total,
        },
      });
    }

    return NextResponse.json({
      data: {
        agent_id: id,
        agent_name: agent.name,
        has_config: true,
        agent_id_external: config.agent_id_external,
        api_key_prefix: config.api_key_prefix,
        api_key_created_at: config.api_key_created_at,
        log_retention_months: config.log_retention_months,
        pii_redaction_enabled: config.pii_redaction_enabled,
        encryption_enabled: config.encryption_enabled,
        metadata_only_mode: config.metadata_only_mode,
        webhook_url: config.webhook_url,
        webhook_events: config.webhook_events,
        is_active: config.is_active,
        sdk_connected: agent.sdk_connected,
        sdk_last_event_at: agent.sdk_last_event_at,
        sdk_events_total: agent.sdk_events_total,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/agents/[id]/sdk-config:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/agents/[id]/sdk-config - Generate/regenerate API key
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

    // Verify agent belongs to organization
    const { data: agent } = await supabase
      .from("ai_systems")
      .select("id, name")
      .eq("id", id)
      .eq("organization_id", profile.organization_id)
      .single();

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Generate new API key
    const apiKeyRaw = `pk_live_${randomBytes(24).toString("hex")}`;
    const apiKeyHash = createHash("sha256").update(apiKeyRaw).digest("hex");
    const apiKeyPrefix = apiKeyRaw.substring(0, 16);

    // Generate external agent ID if needed
    const agentIdExternal = `agt_${randomBytes(12).toString("hex")}`;

    // Check if config exists
    const { data: existingConfig } = await supabase
      .from("agent_sdk_configs")
      .select("id, agent_id_external")
      .eq("ai_system_id", id)
      .single();

    let config;
    if (existingConfig) {
      // Update existing config with new API key
      const { data, error } = await supabase
        .from("agent_sdk_configs")
        .update({
          api_key_hash: apiKeyHash,
          api_key_prefix: apiKeyPrefix,
          api_key_created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingConfig.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating SDK config:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      config = data;
    } else {
      // Create new config
      const { data, error } = await supabase
        .from("agent_sdk_configs")
        .insert({
          ai_system_id: id,
          agent_id_external: agentIdExternal,
          api_key_hash: apiKeyHash,
          api_key_prefix: apiKeyPrefix,
          log_retention_months: 12,
          pii_redaction_enabled: true,
          encryption_enabled: true,
          metadata_only_mode: false,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating SDK config:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      config = data;
    }

    // Log activity
    await supabase.from("activity_log").insert({
      organization_id: profile.organization_id,
      ai_system_id: id,
      user_id: user.id,
      action_type: existingConfig ? "api_key_regenerated" : "api_key_created",
      action_description: `${existingConfig ? "Regenerated" : "Generated"} API key for agent: ${agent.name}`,
    });

    // Return the API key (only time it's shown in full)
    return NextResponse.json({
      data: {
        agent_id: id,
        agent_id_external: config.agent_id_external,
        api_key: apiKeyRaw, // Only returned on creation/regeneration
        api_key_prefix: apiKeyPrefix,
        message: "Store this API key securely. It will not be shown again.",
      },
    }, { status: existingConfig ? 200 : 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/agents/[id]/sdk-config:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/v1/agents/[id]/sdk-config - Update SDK settings
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
    const allowedFields = [
      "log_retention_months",
      "pii_redaction_enabled",
      "encryption_enabled",
      "metadata_only_mode",
      "webhook_url",
      "webhook_events",
      "is_active",
    ];

    // Filter to only allowed fields
    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }
    updateData.updated_at = new Date().toISOString();

    // Update the config
    const { data: config, error } = await supabase
      .from("agent_sdk_configs")
      .update(updateData)
      .eq("ai_system_id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating SDK config:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: config });
  } catch (error) {
    console.error("Error in PATCH /api/v1/agents/[id]/sdk-config:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
