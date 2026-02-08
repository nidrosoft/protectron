import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { jsPDF } from "jspdf";
import type { DocumentQuality } from "@/lib/document-generator/enterprise-format";
import { SUBSCRIPTION_TIERS } from "@/lib/subscription/config";
import { resolveSubscriptionTier } from "@/lib/subscription/utils";

// Brand colors
const COLORS = {
  primary: [127, 86, 217] as [number, number, number], // #7F56D9
  gray: [102, 112, 133] as [number, number, number], // #667085
  black: [16, 24, 40] as [number, number, number], // #101828
  white: [255, 255, 255] as [number, number, number],
  success: [23, 178, 106] as [number, number, number], // #17B26A
  lightGray: [228, 231, 236] as [number, number, number],
  light: [249, 245, 255] as [number, number, number], // brand-50
};

// ─── EU AI Act article lookup ────────────────────────────────────────

const DOCUMENT_TYPE_ARTICLES: Record<string, string[]> = {
  technical: ["Article 11", "Annex IV"],
  risk: ["Article 9"],
  policy: ["Article 10"],
  model_card: ["Article 13"],
  human_oversight: ["Article 14"],
  testing_validation: ["Article 15"],
  qms: ["Article 17"],
  logging_policy: ["Article 12", "Article 18"],
  post_market_monitoring: ["Article 72"],
  incident_response_plan: ["Article 73"],
  cybersecurity_assessment: ["Article 15"],
  eu_db_registration: ["Article 49"],
  transparency_notice: ["Article 13", "Article 50"],
  training_data_doc: ["Article 10"],
  conformity_declaration: ["Article 47", "Annex V"],
  fria: ["Article 27"],
};

// ─── Tier → Quality mapping ──────────────────────────────────────────

function getDocumentQuality(
  plan: string | null | undefined
): DocumentQuality {
  const tier = resolveSubscriptionTier(plan);
  return SUBSCRIPTION_TIERS[tier].documentQuality;
}

function formatDocTypeName(docType: string): string {
  const names: Record<string, string> = {
    technical: "Technical Documentation",
    risk: "Risk Assessment",
    policy: "Data Governance Policy",
    model_card: "Model Card",
    human_oversight: "Human Oversight Procedures",
    instructions_for_use: "Instructions for Use",
    testing_validation: "Testing & Validation Report",
    security_assessment: "Security Assessment",
    qms: "Quality Management System",
    logging_policy: "Record-Keeping & Logging Plan",
    post_market_monitoring: "Post-Market Monitoring Plan",
    incident_response_plan: "Serious Incident Response Plan",
    cybersecurity_assessment: "Cybersecurity Assessment",
    transparency_notice: "Transparency Notice",
    training_data_doc: "Training Data Documentation",
    bias_assessment: "Bias & Fairness Assessment",
    conformity_declaration: "EU Declaration of Conformity",
    fria: "Fundamental Rights Impact Assessment",
  };
  return (
    names[docType] ||
    docType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

// GET /api/v1/documents/[id]/pdf - Download document as PDF
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
      return NextResponse.json(
        { error: "No organization found" },
        { status: 404 }
      );
    }

    // Get the document
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select(
        `
        *,
        ai_systems (
          id,
          name,
          organization_id
        )
      `
      )
      .eq("id", id)
      .single();

    if (docError || !document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    const docOrg = (document.ai_systems as any)?.organization_id;
    if (docOrg !== profile.organization_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get organization details (name + plan for tier resolution)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any;
    const { data: org } = await sb
      .from("organizations")
      .select("name, plan")
      .eq("id", profile.organization_id)
      .single();

    const orgName = (org?.name as string) || "Organization";
    const quality = getDocumentQuality(org?.plan as string | null);

    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const systemName = (document.ai_systems as any)?.name || "N/A";
    const date = new Date(document.created_at || new Date()).toLocaleDateString(
      "en-US",
      { month: "long", day: "numeric", year: "numeric" }
    );
    const docTypeName = formatDocTypeName(document.document_type);
    const articles = DOCUMENT_TYPE_ARTICLES[document.document_type] || [];

    let yPos = margin;

    // ─── Cover page (standard + enterprise) ───────────────────────
    if (quality !== "basic") {
      yPos = renderCoverPage(pdf, {
        title: document.name || "Compliance Document",
        subtitle: docTypeName,
        orgName,
        systemName,
        date,
        articles,
        preparedBy: profile.full_name || orgName,
        quality,
        pageWidth,
        pageHeight,
        margin,
      });

      // ─── Document control page (standard + enterprise) ──────────
      pdf.addPage();
      yPos = renderDocumentControlPage(pdf, {
        title: document.name || "Compliance Document",
        docType: docTypeName,
        orgName,
        systemName,
        date,
        preparedBy: profile.full_name || orgName,
        articles,
        pageWidth,
        margin,
      });

      // Start content on new page
      pdf.addPage();
      yPos = margin;
    }

    // ─── Header band ──────────────────────────────────────────────
    pdf.setFillColor(...COLORS.primary);
    pdf.rect(0, 0, pageWidth, 25, "F");

    pdf.setTextColor(...COLORS.white);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      quality !== "basic" ? orgName.toUpperCase() : "PROTECTRON",
      margin,
      10
    );
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("EU AI Act Compliance Platform", margin, 16);

    // Confidential badge
    pdf.setFontSize(8);
    pdf.text("CONFIDENTIAL", pageWidth - margin - 25, 13);

    yPos = 40;

    // Document title
    pdf.setTextColor(...COLORS.black);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    const title = document.name || "Untitled Document";
    pdf.text(title, margin, yPos);
    yPos += 12;

    // Document type badge
    pdf.setFontSize(10);
    pdf.setTextColor(...COLORS.primary);
    pdf.text(docTypeName, margin, yPos);
    yPos += 10;

    // Metadata
    pdf.setTextColor(...COLORS.gray);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `AI System: ${systemName}  |  Generated: ${date}  |  Status: ${document.status || "Draft"}`,
      margin,
      yPos
    );
    yPos += 15;

    // Divider line
    pdf.setDrawColor(...COLORS.primary);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    // Content section
    pdf.setTextColor(...COLORS.black);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Document Content", margin, yPos);
    yPos += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    // If we have generation prompt data, display it
    if (document.generation_prompt) {
      try {
        const promptData =
          typeof document.generation_prompt === "string"
            ? JSON.parse(document.generation_prompt)
            : document.generation_prompt;

        Object.entries(promptData).forEach(([key, value]) => {
          if (yPos > pageHeight - 40) {
            pdf.addPage();
            yPos = margin;
          }

          // Question
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(...COLORS.primary);
          const questionText = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());
          pdf.text(questionText, margin, yPos);
          yPos += 6;

          // Answer
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(...COLORS.black);
          const answer = String(value || "N/A");
          const lines = pdf.splitTextToSize(answer, pageWidth - margin * 2);
          lines.forEach((line: string) => {
            if (yPos > pageHeight - 20) {
              pdf.addPage();
              yPos = margin;
            }
            pdf.text(line, margin, yPos);
            yPos += 5;
          });
          yPos += 5;
        });
      } catch {
        pdf.text(
          "Document content is available in the DOCX format.",
          margin,
          yPos
        );
        yPos += 10;
      }
    } else if ((document as any).content) {
      try {
        const rawContent = (document as any).content;
        const sections =
          typeof rawContent === "string"
            ? JSON.parse(rawContent)
            : rawContent;

        if (Array.isArray(sections)) {
          sections.forEach(
            (section: { title?: string; content?: string }, idx: number) => {
              if (yPos > pageHeight - 40) {
                pdf.addPage();
                yPos = margin;
              }

              if (section.title) {
                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(...COLORS.primary);
                pdf.setFontSize(12);
                pdf.text(`${idx + 1}. ${section.title}`, margin, yPos);
                yPos += 8;
              }

              if (section.content) {
                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(...COLORS.black);
                pdf.setFontSize(10);
                const lines = pdf.splitTextToSize(
                  section.content,
                  pageWidth - margin * 2
                );
                lines.forEach((line: string) => {
                  if (yPos > pageHeight - 20) {
                    pdf.addPage();
                    yPos = margin;
                  }
                  pdf.text(line, margin, yPos);
                  yPos += 5;
                });
                yPos += 5;
              }
            }
          );
        }
      } catch {
        pdf.text(
          "Document content is available in the DOCX format.",
          margin,
          yPos
        );
        yPos += 10;
      }
    } else {
      pdf.text(
        "This document was generated using the Protectron compliance platform.",
        margin,
        yPos
      );
      yPos += 6;
      pdf.text(
        "For the full formatted document, please download the DOCX version.",
        margin,
        yPos
      );
    }

    // ─── Signature page (enterprise only) ─────────────────────────
    if (quality === "enterprise") {
      pdf.addPage();
      renderSignaturePage(pdf, {
        preparedBy: profile.full_name || orgName,
        pageWidth,
        margin,
      });
    }

    // ─── Footer on each page ──────────────────────────────────────
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      const footerY = pageHeight - 10;
      pdf.setDrawColor(...COLORS.lightGray);
      pdf.setLineWidth(0.2);
      pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

      pdf.setFontSize(8);
      pdf.setTextColor(...COLORS.gray);
      pdf.text(
        `Generated by Protectron Inc. | ${orgName} | Page ${i} of ${totalPages}`,
        margin,
        footerY
      );
      pdf.text(date, pageWidth - margin - 30, footerY);
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

    const filename = `${document.name?.replace(/[^a-zA-Z0-9]/g, "_") || "document"}.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/documents/[id]/pdf:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── PDF Cover Page ──────────────────────────────────────────────────

interface CoverPageOpts {
  title: string;
  subtitle: string;
  orgName: string;
  systemName: string;
  date: string;
  articles: string[];
  preparedBy: string;
  quality: DocumentQuality;
  pageWidth: number;
  pageHeight: number;
  margin: number;
}

function renderCoverPage(pdf: jsPDF, opts: CoverPageOpts): number {
  const { pageWidth, pageHeight, margin } = opts;
  const centerX = pageWidth / 2;

  // Top decorative band
  pdf.setFillColor(...COLORS.primary);
  pdf.rect(0, 0, pageWidth, 8, "F");

  let y = 60;

  // Organization name
  pdf.setTextColor(...COLORS.gray);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text(opts.orgName.toUpperCase(), centerX, y, { align: "center" });
  y += 20;

  // Horizontal rule
  pdf.setDrawColor(...COLORS.primary);
  pdf.setLineWidth(1);
  pdf.line(margin + 30, y, pageWidth - margin - 30, y);
  y += 20;

  // Title
  pdf.setTextColor(...COLORS.primary);
  pdf.setFontSize(28);
  pdf.setFont("helvetica", "bold");
  const titleLines = pdf.splitTextToSize(opts.title, pageWidth - margin * 2 - 20);
  titleLines.forEach((line: string) => {
    pdf.text(line, centerX, y, { align: "center" });
    y += 12;
  });
  y += 5;

  // Subtitle
  pdf.setTextColor(...COLORS.gray);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "normal");
  pdf.text(opts.subtitle, centerX, y, { align: "center" });
  y += 8;

  // EU AI Act label
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "italic");
  pdf.text("EU AI Act Compliance Documentation", centerX, y, {
    align: "center",
  });
  y += 20;

  // Horizontal rule
  pdf.setDrawColor(...COLORS.primary);
  pdf.setLineWidth(0.5);
  pdf.line(margin + 30, y, pageWidth - margin - 30, y);
  y += 15;

  // Metadata items
  const metaItems: [string, string][] = [];
  if (opts.systemName && opts.systemName !== "N/A") {
    metaItems.push(["AI System", opts.systemName]);
  }
  metaItems.push(["Date", opts.date]);
  metaItems.push(["Classification", "Confidential"]);
  if (opts.articles.length > 0) {
    metaItems.push(["EU AI Act Reference", opts.articles.join(", ")]);
  }

  pdf.setFontSize(10);
  metaItems.forEach(([key, value]) => {
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...COLORS.gray);
    pdf.text(`${key}:  `, centerX - 5, y, { align: "right" });
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...COLORS.black);
    pdf.text(value, centerX + 5, y);
    y += 7;
  });

  y += 15;

  // Bottom section
  pdf.setDrawColor(...COLORS.primary);
  pdf.setLineWidth(0.5);
  pdf.line(margin + 30, y, pageWidth - margin - 30, y);
  y += 10;

  pdf.setTextColor(...COLORS.gray);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Prepared by: ${opts.preparedBy}`, centerX, y, {
    align: "center",
  });
  y += 6;
  pdf.setFont("helvetica", "italic");
  pdf.text(
    "Generated via Protectron Inc. — EU AI Act Compliance Platform",
    centerX,
    y,
    { align: "center" }
  );

  // Bottom decorative band
  pdf.setFillColor(...COLORS.primary);
  pdf.rect(0, pageHeight - 8, pageWidth, 8, "F");

  return y + 20;
}

// ─── PDF Document Control Page ───────────────────────────────────────

interface DocControlOpts {
  title: string;
  docType: string;
  orgName: string;
  systemName: string;
  date: string;
  preparedBy: string;
  articles: string[];
  pageWidth: number;
  margin: number;
}

function renderDocumentControlPage(pdf: jsPDF, opts: DocControlOpts): number {
  const { pageWidth, margin } = opts;
  let y = 30;

  // Heading
  pdf.setTextColor(...COLORS.primary);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("Document Control", margin, y);
  y += 12;

  // Control table
  const controlData: [string, string][] = [
    ["Document Title", opts.title],
    ["Document Type", opts.docType],
    ["Version", "1.0"],
    ["Date", opts.date],
    ["Status", "Draft"],
    ["Prepared By", opts.preparedBy],
    ["Organization", opts.orgName],
    ["Classification", "Confidential"],
  ];

  if (opts.systemName && opts.systemName !== "N/A") {
    controlData.push(["AI System", opts.systemName]);
  }
  if (opts.articles.length > 0) {
    controlData.push(["EU AI Act Reference", opts.articles.join(", ")]);
  }

  const colWidths = [55, pageWidth - margin * 2 - 55];
  const rowHeight = 8;

  controlData.forEach(([key, value], idx) => {
    // Key cell (shaded)
    pdf.setFillColor(...COLORS.light);
    pdf.rect(margin, y, colWidths[0], rowHeight, "F");
    pdf.setDrawColor(...COLORS.lightGray);
    pdf.rect(margin, y, colWidths[0], rowHeight, "S");

    pdf.setTextColor(...COLORS.black);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text(key, margin + 3, y + 5.5);

    // Value cell
    if (idx % 2 === 1) {
      pdf.setFillColor(252, 250, 255);
      pdf.rect(margin + colWidths[0], y, colWidths[1], rowHeight, "F");
    }
    pdf.setDrawColor(...COLORS.lightGray);
    pdf.rect(margin + colWidths[0], y, colWidths[1], rowHeight, "S");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text(value, margin + colWidths[0] + 3, y + 5.5);

    y += rowHeight;
  });

  y += 15;

  // Version history heading
  pdf.setTextColor(...COLORS.primary);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Version History", margin, y);
  y += 10;

  // Version history table
  const vhHeaders = ["Version", "Date", "Author", "Description"];
  const vhWidths = [20, 35, 40, pageWidth - margin * 2 - 95];

  // Header row
  pdf.setFillColor(...COLORS.primary);
  let xPos = margin;
  vhHeaders.forEach((header, i) => {
    pdf.rect(xPos, y, vhWidths[i], rowHeight, "F");
    pdf.setTextColor(...COLORS.white);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text(header, xPos + 3, y + 5.5);
    xPos += vhWidths[i];
  });
  y += rowHeight;

  // Data row
  const vhData = ["1.0", opts.date, opts.preparedBy, "Initial version"];
  xPos = margin;
  vhData.forEach((val, i) => {
    pdf.setDrawColor(...COLORS.lightGray);
    pdf.rect(xPos, y, vhWidths[i], rowHeight, "S");
    pdf.setTextColor(...COLORS.black);
    pdf.setFont("helvetica", "normal");
    pdf.text(val, xPos + 3, y + 5.5);
    xPos += vhWidths[i];
  });
  y += rowHeight;

  // Empty row
  xPos = margin;
  vhWidths.forEach((w) => {
    pdf.setDrawColor(...COLORS.lightGray);
    pdf.rect(xPos, y, w, rowHeight, "S");
    xPos += w;
  });
  y += rowHeight;

  return y + 10;
}

// ─── PDF Signature Page ──────────────────────────────────────────────

function renderSignaturePage(
  pdf: jsPDF,
  opts: { preparedBy: string; pageWidth: number; margin: number }
): void {
  const { pageWidth, margin } = opts;
  let y = 30;

  pdf.setTextColor(...COLORS.primary);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("Approval & Signatures", margin, y);
  y += 10;

  pdf.setTextColor(...COLORS.black);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  const desc =
    "This document has been prepared in accordance with EU AI Act requirements. The following approval is required before this document is considered final.";
  const descLines = pdf.splitTextToSize(desc, pageWidth - margin * 2);
  descLines.forEach((line: string) => {
    pdf.text(line, margin, y);
    y += 5;
  });
  y += 10;

  // Signature table
  const sigHeaders = ["Role", "Name", "Signature", "Date"];
  const sigWidths = [35, 45, 45, 35];
  const rowHeight = 15;

  // Header
  let xPos = margin;
  pdf.setFillColor(...COLORS.primary);
  sigHeaders.forEach((h, i) => {
    pdf.rect(xPos, y, sigWidths[i], 8, "F");
    pdf.setTextColor(...COLORS.white);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.text(h, xPos + 3, y + 5.5);
    xPos += sigWidths[i];
  });
  y += 8;

  // Rows
  const roles = [
    ["Prepared By", opts.preparedBy],
    ["Reviewed By", ""],
    ["Approved By", ""],
  ];

  roles.forEach(([role, name]) => {
    xPos = margin;
    [role, name, "", ""].forEach((val, i) => {
      pdf.setDrawColor(...COLORS.lightGray);
      pdf.rect(xPos, y, sigWidths[i], rowHeight, "S");
      pdf.setTextColor(...COLORS.black);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(val, xPos + 3, y + 6);
      xPos += sigWidths[i];
    });
    y += rowHeight;
  });

  y += 10;

  pdf.setTextColor(...COLORS.gray);
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "italic");
  pdf.text(
    "By signing above, I confirm that the information in this document is accurate and complete to the best of my knowledge.",
    margin,
    y
  );
}
