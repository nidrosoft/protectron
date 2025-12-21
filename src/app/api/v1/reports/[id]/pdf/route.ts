import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { jsPDF } from "jspdf";

// Brand colors
const COLORS = {
  primary: [127, 86, 217] as [number, number, number], // #7F56D9
  gray: [102, 112, 133] as [number, number, number], // #667085
  black: [16, 24, 40] as [number, number, number], // #101828
  success: [18, 183, 106] as [number, number, number], // #12B76A
  warning: [247, 144, 9] as [number, number, number], // #F79009
};

// GET /api/v1/reports/[id]/pdf - Download report as PDF
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
      .select("organization_id, full_name")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Get the report
    const { data: report, error: reportError } = await (supabase as any)
      .from("reports")
      .select("*")
      .eq("id", id)
      .eq("organization_id", profile.organization_id)
      .single();

    if (reportError || !report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Get organization info
    const { data: org } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", profile.organization_id)
      .single();

    // Get AI systems data
    let systemsQuery = supabase
      .from("ai_systems")
      .select(`
        id,
        name,
        risk_level,
        compliance_status,
        compliance_progress,
        ai_system_requirements(id, status)
      `)
      .eq("organization_id", profile.organization_id);

    if (report.scope === "specific" && report.selected_system_id) {
      systemsQuery = systemsQuery.eq("id", report.selected_system_id);
    }

    const { data: systems } = await systemsQuery;

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    const isExecutive = report.report_type === "executive";
    const date = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Header with brand color
    pdf.setFillColor(...COLORS.primary);
    pdf.rect(0, 0, pageWidth, 30, "F");

    // Header text
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("PROTECTRON", margin, 12);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("EU AI Act Compliance Platform", margin, 20);

    // Confidential badge
    pdf.setFontSize(9);
    pdf.text("CONFIDENTIAL", pageWidth - margin - 28, 16);

    yPos = 45;

    // Report title
    pdf.setTextColor(...COLORS.black);
    pdf.setFontSize(28);
    pdf.setFont("helvetica", "bold");
    const title = isExecutive ? "Executive Compliance Summary" : "Full Compliance Report";
    pdf.text(title, margin, yPos);
    yPos += 12;

    // Subtitle
    pdf.setFontSize(12);
    pdf.setTextColor(...COLORS.gray);
    pdf.setFont("helvetica", "normal");
    pdf.text(`EU AI Act Compliance Status for ${org?.name || "Organization"}`, margin, yPos);
    yPos += 8;
    pdf.text(`Generated: ${date}  |  Prepared by: ${profile.full_name || "User"}`, margin, yPos);
    yPos += 15;

    // Divider
    pdf.setDrawColor(...COLORS.primary);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    // Calculate stats
    const aiSystems = systems || [];
    const totalSystems = aiSystems.length;
    const compliantSystems = aiSystems.filter((s: any) => s.compliance_status === "compliant").length;
    const highRiskSystems = aiSystems.filter((s: any) => s.risk_level === "high").length;
    const totalReqs = aiSystems.reduce((sum: number, s: any) => sum + (s.ai_system_requirements?.length || 0), 0);
    const completedReqs = aiSystems.reduce((sum: number, s: any) =>
      sum + (s.ai_system_requirements?.filter((r: any) => r.status === "completed").length || 0), 0
    );
    const overallProgress = totalReqs > 0 ? Math.round((completedReqs / totalReqs) * 100) : 0;

    // Executive Summary Section
    pdf.setTextColor(...COLORS.primary);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("1. Executive Summary", margin, yPos);
    yPos += 10;

    pdf.setTextColor(...COLORS.black);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const summaryText = `This report provides a comprehensive overview of ${org?.name || "the organization"}'s compliance status with the EU AI Act. As of ${date}, the organization has ${totalSystems} AI system(s) registered, with an overall compliance progress of ${overallProgress}%.`;
    const summaryLines = pdf.splitTextToSize(summaryText, pageWidth - margin * 2);
    summaryLines.forEach((line: string) => {
      pdf.text(line, margin, yPos);
      yPos += 5;
    });
    yPos += 10;

    // Key Metrics
    pdf.setTextColor(...COLORS.primary);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Key Metrics", margin, yPos);
    yPos += 8;

    // Metrics table
    const metrics = [
      ["Total AI Systems", totalSystems.toString()],
      ["Compliant Systems", `${compliantSystems} of ${totalSystems}`],
      ["High-Risk Systems", highRiskSystems.toString()],
      ["Requirements Completed", `${completedReqs} of ${totalReqs}`],
      ["Overall Progress", `${overallProgress}%`],
    ];

    pdf.setFontSize(10);
    metrics.forEach(([label, value], index) => {
      const rowY = yPos + index * 8;
      
      // Alternating row background
      if (index % 2 === 0) {
        pdf.setFillColor(249, 250, 251);
        pdf.rect(margin, rowY - 5, pageWidth - margin * 2, 8, "F");
      }
      
      pdf.setTextColor(...COLORS.black);
      pdf.setFont("helvetica", "bold");
      pdf.text(label, margin + 2, rowY);
      pdf.setFont("helvetica", "normal");
      pdf.text(value, pageWidth - margin - 30, rowY);
    });
    yPos += metrics.length * 8 + 15;

    // AI Systems Section
    pdf.setTextColor(...COLORS.primary);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("2. AI Systems Overview", margin, yPos);
    yPos += 10;

    if (aiSystems.length === 0) {
      pdf.setTextColor(...COLORS.gray);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "italic");
      pdf.text("No AI systems have been registered yet.", margin, yPos);
      yPos += 10;
    } else {
      // Systems table header
      pdf.setFillColor(...COLORS.primary);
      pdf.rect(margin, yPos - 5, pageWidth - margin * 2, 8, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.text("System Name", margin + 2, yPos);
      pdf.text("Risk Level", margin + 70, yPos);
      pdf.text("Status", margin + 100, yPos);
      pdf.text("Progress", margin + 135, yPos);
      yPos += 8;

      // Systems rows
      aiSystems.forEach((system: any, index: number) => {
        if (yPos > pageHeight - 30) {
          pdf.addPage();
          yPos = margin;
        }

        const reqs = system.ai_system_requirements || [];
        const completed = reqs.filter((r: any) => r.status === "completed").length;
        const progress = reqs.length > 0 ? Math.round((completed / reqs.length) * 100) : 0;

        // Alternating row background
        if (index % 2 === 0) {
          pdf.setFillColor(249, 250, 251);
          pdf.rect(margin, yPos - 4, pageWidth - margin * 2, 7, "F");
        }

        pdf.setTextColor(...COLORS.black);
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.text(system.name?.substring(0, 30) || "N/A", margin + 2, yPos);
        pdf.text((system.risk_level || "N/A").toUpperCase(), margin + 70, yPos);
        pdf.text((system.compliance_status || "not_started").replace("_", " "), margin + 100, yPos);
        pdf.text(`${progress}%`, margin + 135, yPos);
        yPos += 7;
      });
    }

    // Footer
    yPos = pageHeight - 15;
    pdf.setDrawColor(...COLORS.gray);
    pdf.setLineWidth(0.2);
    pdf.line(margin, yPos - 5, pageWidth - margin, yPos - 5);

    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.gray);
    pdf.text(`Generated by Protectron Inc. | ${org?.name || "Organization"} | Page 1`, margin, yPos);
    pdf.text(date, pageWidth - margin - 25, yPos);

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

    // Return the file
    const filename = `${report.name?.replace(/[^a-zA-Z0-9]/g, "_") || "report"}.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/reports/[id]/pdf:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
