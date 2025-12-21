import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PATCH /api/v1/agents/[id]/hitl-rules/[ruleId] - Update HITL rule
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ruleId: string }> }
) {
  try {
    const { id, ruleId } = await params;
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
      .select("id")
      .eq("id", id)
      .eq("organization_id", profile.organization_id)
      .single();

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const body = await request.json();
    const allowedFields = [
      "rule_name",
      "rule_description",
      "is_active",
      "trigger_conditions",
      "requires_approval",
      "approval_timeout_minutes",
      "auto_reject_on_timeout",
      "notify_emails",
      "notify_slack_channel",
    ];

    // Filter to only allowed fields
    const updateData: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }
    updateData.updated_at = new Date().toISOString();

    // Update the rule
    const { data: rule, error } = await supabase
      .from("agent_hitl_rules")
      .update(updateData)
      .eq("id", ruleId)
      .eq("ai_system_id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating HITL rule:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!rule) {
      return NextResponse.json({ error: "HITL rule not found" }, { status: 404 });
    }

    return NextResponse.json({ data: rule });
  } catch (error) {
    console.error("Error in PATCH /api/v1/agents/[id]/hitl-rules/[ruleId]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/v1/agents/[id]/hitl-rules/[ruleId] - Delete HITL rule
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ruleId: string }> }
) {
  try {
    const { id, ruleId } = await params;
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
      .select("id")
      .eq("id", id)
      .eq("organization_id", profile.organization_id)
      .single();

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Delete the rule
    const { error } = await supabase
      .from("agent_hitl_rules")
      .delete()
      .eq("id", ruleId)
      .eq("ai_system_id", id);

    if (error) {
      console.error("Error deleting HITL rule:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "HITL rule deleted" });
  } catch (error) {
    console.error("Error in DELETE /api/v1/agents/[id]/hitl-rules/[ruleId]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
