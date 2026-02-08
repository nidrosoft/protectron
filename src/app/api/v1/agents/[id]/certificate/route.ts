import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/agents/[id]/certificate - Get certification status
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

    // Get agent details
    const { data: agent } = await supabase
      .from("ai_systems")
      .select("*, compliance_progress, compliance_status, sdk_connected, lifecycle_status")
      .eq("id", id)
      .eq("organization_id", profile.organization_id)
      .single();

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Get requirements completion
    const { data: requirements, count: totalRequirements } = await supabase
      .from("ai_system_requirements")
      .select("status", { count: "exact" })
      .eq("ai_system_id", id);

    const completedRequirements = requirements?.filter((r) => r.status === "compliant" || r.status === "completed").length || 0;

    // Get HITL rules count
    const { count: hitlRulesCount } = await supabase
      .from("agent_hitl_rules")
      .select("id", { count: "exact", head: true })
      .eq("ai_system_id", id)
      .eq("is_active", true);

    // Get open incidents count
    const { count: openIncidentsCount } = await supabase
      .from("agent_incidents")
      .select("id", { count: "exact", head: true })
      .eq("ai_system_id", id)
      .neq("status", "closed");

    // Get events count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: eventsCount } = await supabase
      .from("agent_audit_events")
      .select("id", { count: "exact", head: true })
      .eq("ai_system_id", id)
      .gte("event_timestamp", thirtyDaysAgo.toISOString());

    // Calculate compliance score based on PRD formula
    const baseScore = totalRequirements && totalRequirements > 0
      ? (completedRequirements / totalRequirements) * 100
      : 0;

    let bonusPoints = 0;
    // SDK Connected: required (no bonus, but required for certification)
    // HITL Rules Active: +5 (if ≥1 rule)
    if ((hitlRulesCount || 0) >= 1) bonusPoints += 5;
    // No Open Incidents: +5
    if ((openIncidentsCount || 0) === 0) bonusPoints += 5;
    // 30+ days logging: +5
    if ((eventsCount || 0) > 0) bonusPoints += 5;

    const finalScore = Math.min(baseScore + bonusPoints, 100);

    // Determine certification level
    let certificationLevel: "none" | "bronze" | "silver" | "gold" = "none";
    let certificationStatus = "not_certified";

    if (agent.sdk_connected && finalScore >= 95) {
      certificationLevel = "gold";
      certificationStatus = "certified";
    } else if (agent.sdk_connected && finalScore >= 85) {
      certificationLevel = "silver";
      certificationStatus = "certified";
    } else if (agent.sdk_connected && finalScore >= 70) {
      certificationLevel = "bronze";
      certificationStatus = "certified";
    }

    // Get certification record if exists
    const { data: certification } = await supabase
      .from("ai_system_certifications")
      .select("*")
      .eq("ai_system_id", id)
      .order("certified_at", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      data: {
        agent_id: id,
        compliance_score: Math.round(finalScore * 10) / 10,
        certification_level: certificationLevel,
        certification_status: certificationStatus,
        requirements: {
          total: totalRequirements || 0,
          completed: completedRequirements,
          percentage: totalRequirements ? Math.round((completedRequirements / totalRequirements) * 100) : 0,
        },
        checks: {
          sdk_connected: agent.sdk_connected,
          hitl_rules_active: (hitlRulesCount || 0) >= 1,
          no_open_incidents: (openIncidentsCount || 0) === 0,
          logging_active: (eventsCount || 0) > 0,
        },
        bonus_points: bonusPoints,
        certification: certification || null,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/agents/[id]/certificate:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
