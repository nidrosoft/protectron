import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/trust-center/[slug] - Get public trust center data for an organization
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    // Find organization by slug
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("id, name, slug")
      .eq("slug", slug)
      .single();

    if (orgError || !org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Trust center is enabled by default for all organizations
    // In production, you would add a trust_center_enabled column to organizations table

    // Get AI systems for this organization (only public-facing info)
    const { data: systems } = await supabase
      .from("ai_systems")
      .select(`
        id,
        name,
        risk_level,
        compliance_status,
        compliance_progress,
        updated_at,
        ai_system_requirements(id, status)
      `)
      .eq("organization_id", org.id)
      .order("name");

    // Get public documents
    const { data: documents } = await supabase
      .from("documents")
      .select("id, name, document_type, status, created_at")
      .eq("status", "final")
      .in("ai_system_id", (systems || []).map((s: any) => s.id))
      .order("created_at", { ascending: false })
      .limit(10);

    // Transform systems data
    const transformedSystems = (systems || []).map((system: any) => {
      const requirements = system.ai_system_requirements || [];
      const completed = requirements.filter((r: any) => r.status === "completed").length;
      const total = requirements.length || 1;

      return {
        id: system.id,
        name: system.name,
        riskLevel: system.risk_level || "minimal",
        status: system.compliance_status || "not_started",
        requirementsComplete: completed,
        requirementsTotal: total,
        lastAudit: system.updated_at
          ? new Date(system.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "N/A",
      };
    });

    // Calculate compliance score
    const totalReqs = transformedSystems.reduce((sum: number, s: any) => sum + s.requirementsTotal, 0);
    const completedReqs = transformedSystems.reduce((sum: number, s: any) => sum + s.requirementsComplete, 0);
    const complianceScore = totalReqs > 0 ? Math.round((completedReqs / totalReqs) * 100) : 0;

    // Transform documents
    const transformedDocuments = (documents || []).map((doc: any) => ({
      name: doc.name,
      type: doc.document_type,
      date: doc.created_at
        ? new Date(doc.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "N/A",
    }));

    // Get last updated date
    const lastUpdated = systems && systems.length > 0
      ? new Date(Math.max(...systems.map((s: any) => new Date(s.updated_at || 0).getTime())))
          .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    return NextResponse.json({
      data: {
        name: org.name,
        slug: org.slug,
        logo: null,
        industry: "Technology",
        complianceScore,
        lastUpdated,
        aiSystems: transformedSystems,
        documents: transformedDocuments,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/trust-center/[slug]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
