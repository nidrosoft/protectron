import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
} from "docx";

// Brand colors
const COLORS = {
  primary: "7F56D9",
  white: "FFFFFF",
  gray: "667085",
  lightGray: "F9FAFB",
};

// GET /api/v1/reports/[id]/download - Download report as DOCX
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

    // Generate the document content
    const content = generateReportContent(
      report,
      systems || [],
      org?.name || "Organization",
      profile.full_name || "User"
    );

    // Create the document
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: { font: "Inter", size: 22 },
            paragraph: { spacing: { after: 200 } },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
            },
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [
                    new TextRun({ text: report.name, color: COLORS.gray, size: 18 }),
                    new TextRun({ text: "  |  ", color: COLORS.gray, size: 18 }),
                    new TextRun({ text: "Confidential", color: COLORS.primary, size: 18, bold: true }),
                  ],
                }),
              ],
            }),
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: "Protectron Inc. | Page ", color: COLORS.gray, size: 18 }),
                    new TextRun({ children: [PageNumber.CURRENT], color: COLORS.gray, size: 18 }),
                    new TextRun({ text: " of ", color: COLORS.gray, size: 18 }),
                    new TextRun({ children: [PageNumber.TOTAL_PAGES], color: COLORS.gray, size: 18 }),
                  ],
                }),
              ],
            }),
          },
          children: content,
        },
      ],
    });

    // Generate the DOCX buffer
    const buffer = await Packer.toBuffer(doc);

    // Return the file
    const filename = `${report.name.replace(/[^a-zA-Z0-9]/g, "_")}.docx`;
    
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/reports/[id]/download:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function generateReportContent(
  report: any,
  systems: any[],
  orgName: string,
  userName: string
): (Paragraph | Table)[] {
  const isExecutive = report.report_type === "executive";
  const date = new Date().toLocaleDateString("en-US", { 
    month: "long", 
    day: "numeric", 
    year: "numeric" 
  });

  const content: (Paragraph | Table)[] = [];

  // Title
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: isExecutive ? "Executive Compliance Summary" : "Full Compliance Report",
          bold: true,
          size: 56,
          color: COLORS.primary,
        }),
      ],
    })
  );

  // Subtitle
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: `EU AI Act Compliance Status for ${orgName}`,
          size: 28,
          color: COLORS.gray,
        }),
      ],
    })
  );

  // Date and prepared by
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({ text: `Generated: ${date}`, size: 22, color: COLORS.gray }),
        new TextRun({ text: "  |  ", size: 22, color: COLORS.gray }),
        new TextRun({ text: `Prepared by: ${userName}`, size: 22, color: COLORS.gray }),
      ],
    })
  );

  // Executive Summary Section
  content.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({ text: "1. Executive Summary", bold: true, size: 32, color: COLORS.primary }),
      ],
    })
  );

  // Calculate stats
  const totalSystems = systems.length;
  const compliantSystems = systems.filter(s => s.compliance_status === "compliant").length;
  const highRiskSystems = systems.filter(s => s.risk_level === "high").length;
  const totalReqs = systems.reduce((sum, s) => sum + (s.ai_system_requirements?.length || 0), 0);
  const completedReqs = systems.reduce((sum, s) => 
    sum + (s.ai_system_requirements?.filter((r: any) => r.status === "completed").length || 0), 0
  );
  const overallProgress = totalReqs > 0 ? Math.round((completedReqs / totalReqs) * 100) : 0;

  content.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `This report provides a comprehensive overview of ${orgName}'s compliance status with the EU AI Act. `,
        }),
        new TextRun({
          text: `As of ${date}, the organization has ${totalSystems} AI system(s) registered, `,
        }),
        new TextRun({
          text: `with an overall compliance progress of ${overallProgress}%.`,
          bold: true,
        }),
      ],
    })
  );

  // Key Metrics Table
  content.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({ text: "Key Metrics", bold: true, size: 26 }),
      ],
    })
  );

  content.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            createHeaderCell("Metric"),
            createHeaderCell("Value"),
          ],
        }),
        createDataRow("Total AI Systems", totalSystems.toString()),
        createDataRow("Compliant Systems", `${compliantSystems} of ${totalSystems}`),
        createDataRow("High-Risk Systems", highRiskSystems.toString()),
        createDataRow("Requirements Completed", `${completedReqs} of ${totalReqs}`),
        createDataRow("Overall Progress", `${overallProgress}%`),
      ],
    })
  );

  // AI Systems Section
  content.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 600, after: 200 },
      children: [
        new TextRun({ text: "2. AI Systems Overview", bold: true, size: 32, color: COLORS.primary }),
      ],
    })
  );

  if (systems.length === 0) {
    content.push(
      new Paragraph({
        children: [new TextRun({ text: "No AI systems have been registered yet.", italics: true })],
      })
    );
  } else {
    // Systems table
    const systemRows = [
      new TableRow({
        children: [
          createHeaderCell("System Name"),
          createHeaderCell("Risk Level"),
          createHeaderCell("Status"),
          createHeaderCell("Progress"),
        ],
      }),
      ...systems.map((system, index) => {
        const reqs = system.ai_system_requirements || [];
        const completed = reqs.filter((r: any) => r.status === "completed").length;
        const progress = reqs.length > 0 ? Math.round((completed / reqs.length) * 100) : 0;
        
        return new TableRow({
          children: [
            createDataCell(system.name, index % 2 === 1),
            createDataCell(system.risk_level?.toUpperCase() || "N/A", index % 2 === 1),
            createDataCell(system.compliance_status?.replace("_", " ") || "Not Started", index % 2 === 1),
            createDataCell(`${progress}%`, index % 2 === 1),
          ],
        });
      }),
    ];

    content.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: systemRows,
      })
    );
  }

  // Footer
  content.push(
    new Paragraph({
      spacing: { before: 800 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "Report generated by ", color: COLORS.gray, italics: true }),
        new TextRun({ text: "Protectron Inc.", color: COLORS.primary, bold: true }),
        new TextRun({ text: ` on ${date}`, color: COLORS.gray, italics: true }),
      ],
    })
  );

  return content;
}

function createHeaderCell(text: string): TableCell {
  return new TableCell({
    shading: { fill: COLORS.primary },
    children: [
      new Paragraph({
        children: [new TextRun({ text, bold: true, color: COLORS.white })],
      }),
    ],
  });
}

function createDataCell(text: string, shaded: boolean): TableCell {
  return new TableCell({
    shading: shaded ? { fill: COLORS.lightGray } : undefined,
    children: [
      new Paragraph({
        children: [new TextRun({ text })],
      }),
    ],
  });
}

function createDataRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true })] })],
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: value })] })],
      }),
    ],
  });
}
