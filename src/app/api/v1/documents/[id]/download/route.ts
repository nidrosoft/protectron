import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Header,
  Footer,
  PageNumber,
} from "docx";

// Brand colors
const COLORS = {
  primary: "7F56D9",
  white: "FFFFFF",
  gray: "667085",
};

// GET /api/v1/documents/[id]/download - Download document as DOCX
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

    // Generate document content
    const content = generateDocumentContent(document, org?.name || "Organization");

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
                    new TextRun({ text: document.name || "Document", color: COLORS.gray, size: 18 }),
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
    const filename = `${document.name?.replace(/[^a-zA-Z0-9]/g, "_") || "document"}.docx`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/documents/[id]/download:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function generateDocumentContent(document: any, orgName: string): Paragraph[] {
  const content: Paragraph[] = [];
  const date = new Date(document.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const typeLabels: Record<string, string> = {
    technical: "Technical Documentation",
    risk: "Risk Assessment",
    policy: "Data Governance Policy",
    model_card: "Model Card",
  };

  // Title
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: document.name || "Untitled Document",
          bold: true,
          size: 56,
          color: COLORS.primary,
        }),
      ],
    })
  );

  // Document type
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: typeLabels[document.document_type] || document.document_type,
          size: 28,
          color: COLORS.gray,
        }),
      ],
    })
  );

  // Metadata
  const systemName = document.ai_systems?.name || "N/A";
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({ text: `AI System: ${systemName}`, size: 22, color: COLORS.gray }),
        new TextRun({ text: "  |  ", size: 22, color: COLORS.gray }),
        new TextRun({ text: `Generated: ${date}`, size: 22, color: COLORS.gray }),
        new TextRun({ text: "  |  ", size: 22, color: COLORS.gray }),
        new TextRun({ text: `Organization: ${orgName}`, size: 22, color: COLORS.gray }),
      ],
    })
  );

  // Content from generation prompt
  if (document.generation_prompt) {
    try {
      const promptData = typeof document.generation_prompt === "string"
        ? JSON.parse(document.generation_prompt)
        : document.generation_prompt;

      Object.entries(promptData).forEach(([key, value]) => {
        // Section heading
        const heading = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        content.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({ text: heading, bold: true, size: 28, color: COLORS.primary }),
            ],
          })
        );

        // Section content
        content.push(
          new Paragraph({
            children: [new TextRun({ text: String(value || "N/A"), size: 22 })],
          })
        );
      });
    } catch (e) {
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "This document was generated using the Protectron compliance platform.",
              size: 22,
            }),
          ],
        })
      );
    }
  } else {
    content.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "This document was generated using the Protectron compliance platform.",
            size: 22,
          }),
        ],
      })
    );
  }

  // Footer
  content.push(
    new Paragraph({
      spacing: { before: 800 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "Generated by ", color: COLORS.gray, italics: true }),
        new TextRun({ text: "Protectron Inc.", color: COLORS.primary, bold: true }),
        new TextRun({ text: ` on ${date}`, color: COLORS.gray, italics: true }),
      ],
    })
  );

  return content;
}
