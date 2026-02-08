import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/requirements - Get all requirements across all systems for the organization
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
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

    // Parse query params for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const systemId = searchParams.get("system_id");
    const articleId = searchParams.get("article_id");

    // First, get all AI system IDs for this organization
    const { data: orgSystems, error: systemsError } = await supabase
      .from("ai_systems")
      .select("id")
      .eq("organization_id", profile.organization_id);

    if (systemsError) {
      console.error("Error fetching organization systems:", systemsError);
      return NextResponse.json({ error: systemsError.message }, { status: 500 });
    }

    const systemIds = (orgSystems || []).map(s => s.id);
    
    // If no systems, return empty result
    if (systemIds.length === 0) {
      return NextResponse.json({
        data: [],
        systems: [],
        stats: { total: 0, completed: 0, inProgress: 0, pending: 0 },
      });
    }

    // Build query for requirements with AI system info
    // Note: documents are linked via ai_system_id, not directly to requirements
    let query = supabase
      .from("ai_system_requirements")
      .select(`
        id,
        status,
        notes,
        due_date,
        completed_at,
        created_at,
        updated_at,
        ai_system_id,
        ai_systems (
          id,
          name,
          organization_id
        ),
        requirement_templates (
          id,
          article_id,
          article_title,
          title,
          description,
          applies_to_risk_levels,
          applies_to_system_types
        ),
        evidence (
          id,
          name,
          file_type
        )
      `)
      .in("ai_system_id", systemIds);

    // Apply filters
    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    if (systemId && systemId !== "all") {
      query = query.eq("ai_system_id", systemId);
    }

    const { data: requirements, error } = await query.order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching requirements:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data to match frontend expectations
    const transformedRequirements = (requirements || []).map((req: any) => ({
      id: req.id,
      title: req.requirement_templates?.title || "Unknown Requirement",
      description: req.requirement_templates?.description || "",
      status: req.status || "pending",
      articleId: req.requirement_templates?.article_id || "",
      articleTitle: req.requirement_templates?.article_title || "",
      systemId: req.ai_system_id,
      systemName: req.ai_systems?.name || "Unknown System",
      dueDate: req.due_date,
      completedAt: req.completed_at,
      notes: req.notes,
      linkedEvidence: req.evidence?.[0] ? {
        id: req.evidence[0].id,
        name: req.evidence[0].name,
        type: req.evidence[0].file_type,
      } : undefined,
      // Documents are linked via ai_system_id, not directly to requirements
      linkedDocument: undefined,
    }));

    // Filter by articleId if specified (done client-side since it's in the template)
    let filteredRequirements = transformedRequirements;
    if (articleId && articleId !== "all") {
      filteredRequirements = transformedRequirements.filter(
        (req: any) => req.articleId === articleId
      );
    }

    // Get unique AI systems for filter dropdown
    const systemsMap = new Map();
    (requirements || []).forEach((req: any) => {
      if (req.ai_systems && !systemsMap.has(req.ai_system_id)) {
        systemsMap.set(req.ai_system_id, {
          id: req.ai_system_id,
          name: req.ai_systems.name,
        });
      }
    });
    const systems = Array.from(systemsMap.values());

    // Calculate stats
    const stats = {
      total: filteredRequirements.length,
      completed: filteredRequirements.filter((r: any) => r.status === "completed").length,
      inProgress: filteredRequirements.filter((r: any) => r.status === "in_progress").length,
      pending: filteredRequirements.filter((r: any) => r.status === "pending").length,
    };

    return NextResponse.json({
      data: filteredRequirements,
      systems,
      stats,
    });
  } catch (error) {
    console.error("Error in GET /api/v1/requirements:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
