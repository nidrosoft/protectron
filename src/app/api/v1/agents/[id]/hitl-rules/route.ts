import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/agents/[id]/hitl-rules - List HITL rules for an agent
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: rules, error } = await supabase
      .from("agent_hitl_rules")
      .select("*")
      .eq("ai_system_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching HITL rules:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: rules });
  } catch (error) {
    console.error("Error in GET /api/v1/agents/[id]/hitl-rules:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/agents/[id]/hitl-rules - Create a new HITL rule
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (!body.rule_name || !body.trigger_conditions) {
      return NextResponse.json(
        { error: "rule_name and trigger_conditions are required" },
        { status: 400 }
      );
    }

    const { data: rule, error } = await supabase
      .from("agent_hitl_rules")
      .insert({
        ai_system_id: id,
        created_by: user.id,
        rule_name: body.rule_name,
        rule_description: body.rule_description,
        trigger_conditions: body.trigger_conditions,
        requires_approval: body.requires_approval ?? true,
        approval_timeout_minutes: body.approval_timeout_minutes ?? 60,
        auto_reject_on_timeout: body.auto_reject_on_timeout ?? false,
        notify_emails: body.notify_emails,
        notify_slack_channel: body.notify_slack_channel,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating HITL rule:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: rule }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/agents/[id]/hitl-rules:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
