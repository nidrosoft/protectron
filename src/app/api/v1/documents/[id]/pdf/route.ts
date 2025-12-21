import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { jsPDF } from "jspdf";

// Brand colors
const COLORS = {
  primary: [127, 86, 217] as [number, number, number], // #7F56D9
  gray: [102, 112, 133] as [number, number, number], // #667085
  black: [16, 24, 40] as [number, number, number], // #101828
};

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
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    // Get the document
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select(`
        *,
        ai_systems (
          id,
          name,
          organization_id
        )
      `)
      .eq("id", id)
      .single();

    if (docError || !document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Verify ownership
    const docOrg = (document.ai_systems as any)?.organization_id;
    if (docOrg !== profile.organization_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get organization name
    const { data: org } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", profile.organization_id)
      .single();

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

    // Header with brand color
    pdf.setFillColor(...COLORS.primary);
    pdf.rect(0, 0, pageWidth, 25, "F");

    // Header text
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("PROTECTRON", margin, 10);
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
    const typeLabels: Record<string, string> = {
      technical: "Technical Documentation",
      risk: "Risk Assessment",
      policy: "Data Governance Policy",
      model_card: "Model Card",
    };
    pdf.setFontSize(10);
    pdf.setTextColor(...COLORS.primary);
    pdf.text(typeLabels[document.document_type] || document.document_type, margin, yPos);
    yPos += 10;

    // Metadata
    pdf.setTextColor(...COLORS.gray);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    const systemName = (document.ai_systems as any)?.name || "N/A";
    const date = new Date(document.created_at || new Date()).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    pdf.text(`AI System: ${systemName}  |  Generated: ${date}  |  Status: ${document.status || "Draft"}`, margin, yPos);
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
        const promptData = typeof document.generation_prompt === "string" 
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
          const questionText = key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
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
      } catch (e) {
        // If parsing fails, just show a placeholder
        pdf.text("Document content is available in the DOCX format.", margin, yPos);
        yPos += 10;
      }
    } else {
      pdf.text("This document was generated using the Protectron compliance platform.", margin, yPos);
      yPos += 6;
      pdf.text("For the full formatted document, please download the DOCX version.", margin, yPos);
    }

    // Footer
    const footerY = pageHeight - 15;
    pdf.setDrawColor(...COLORS.gray);
    pdf.setLineWidth(0.2);
    pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.gray);
    pdf.text(`Generated by Protectron Inc. | ${org?.name || "Organization"} | Page 1`, margin, footerY);
    pdf.text(new Date().toLocaleDateString(), pageWidth - margin - 20, footerY);

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

    // Return the file
    const filename = `${document.name?.replace(/[^a-zA-Z0-9]/g, "_") || "document"}.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/documents/[id]/pdf:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
