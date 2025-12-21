import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/v1/reports - List all reports for the organization
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
      .select("organization_id, full_name, avatar_url")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Get all reports for the organization
    const { data: reports, error } = await (supabase as any)
      .from("reports")
      .select("*")
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reports:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform reports to match frontend expectations
    const transformedReports = (reports || []).map((report: any) => ({
      id: report.id,
      type: report.report_type,
      name: report.name,
      generatedAt: report.created_at 
        ? new Date(report.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "—",
      systemsIncluded: report.systems_included || 0,
      status: report.status,
      fileSize: report.file_size || "—",
      fileUrl: report.file_url,
      generatedBy: report.generated_by_name || "Unknown",
      generatedByAvatar: report.generated_by_avatar || "",
    }));

    return NextResponse.json({
      data: transformedReports,
      total: transformedReports.length,
    });
  } catch (error) {
    console.error("Error in GET /api/v1/reports:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/reports - Generate a new report
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organization and profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, full_name, avatar_url")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { 
      reportType, 
      scope, 
      selectedSystemId, 
      includeOptions 
    } = body;

    // Get systems count
    let systemsIncluded = 0;
    if (scope === "all") {
      const { count } = await supabase
        .from("ai_systems")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", profile.organization_id);
      systemsIncluded = count || 0;
    } else {
      systemsIncluded = 1;
    }

    // Generate report name
    const reportName = reportType === "full" 
      ? `Full Compliance Report - ${new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
      : `Executive Summary - ${new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;

    // Create report record
    const { data: report, error } = await (supabase as any)
      .from("reports")
      .insert({
        organization_id: profile.organization_id,
        name: reportName,
        report_type: reportType,
        status: "generating",
        systems_included: systemsIncluded,
        scope: scope,
        selected_system_id: scope === "specific" ? selectedSystemId : null,
        include_options: includeOptions,
        generated_by: user.id,
        generated_by_name: profile.full_name || "User",
        generated_by_avatar: profile.avatar_url || "",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating report:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Simulate report generation (in production, this would be a background job)
    // Update status to ready after a short delay
    setTimeout(async () => {
      const fileSize = reportType === "full" ? "2.1 MB" : "420 KB";
      await (supabase as any)
        .from("reports")
        .update({ 
          status: "ready",
          file_size: fileSize,
          file_url: `/reports/${report.id}.pdf`, // Placeholder URL
        })
        .eq("id", report.id);
    }, 2000);

    // Return the created report
    const reportData = report as any;
    return NextResponse.json({
      data: {
        id: reportData.id,
        type: reportData.report_type,
        name: reportData.name,
        generatedAt: new Date(reportData.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        systemsIncluded: reportData.systems_included,
        status: reportData.status,
        fileSize: "—",
        generatedBy: reportData.generated_by_name,
        generatedByAvatar: reportData.generated_by_avatar,
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/v1/reports:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
