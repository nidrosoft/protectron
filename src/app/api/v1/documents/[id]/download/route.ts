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
  PageBreak,
  LevelFormat,
} from "docx";
import {
  createCoverPage,
  createDocumentControlSection,
  createTableOfContentsSection,
  createEnterpriseHeader,
  createEnterpriseFooter,
  createSignatureBlock,
  createCertificationBadge,
  type EnterpriseDocumentOptions,
  type DocumentQuality,
} from "@/lib/document-generator/enterprise-format";
import { COLORS, PAGE, FONT_SIZES } from "@/lib/document-generator/config";
import {
  SUBSCRIPTION_TIERS,
} from "@/lib/subscription/config";
import { resolveSubscriptionTier } from "@/lib/subscription/utils";

// ─── Tier → Document Quality mapping ────────────────────────────────

function getDocumentQuality(
  plan: string | null | undefined
): DocumentQuality {
  const tier = resolveSubscriptionTier(plan);
  return SUBSCRIPTION_TIERS[tier].documentQuality;
}

// ─── GET /api/v1/documents/[id]/download ─────────────────────────────

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

    // Generate document content
    const bodyContent = generateDocumentContent(document, orgName);

    // Build the DOCX with enterprise formatting when tier qualifies
    const doc =
      quality !== "basic"
        ? buildEnterpriseDoc(document, bodyContent, orgName, quality, profile)
        : buildBasicDoc(document, bodyContent);

    // Generate the DOCX buffer
    const buffer = await Packer.toBuffer(doc);

    // Create a clean filename
    const typeLabels: Record<string, string> = {
      technical: "Technical_Documentation",
      risk: "Risk_Assessment",
      policy: "Data_Governance_Policy",
      model_card: "Model_Card",
      testing_validation: "Testing_Validation_Report",
      instructions_for_use: "Instructions_For_Use",
      human_oversight: "Human_Oversight_Procedures",
      security_assessment: "Security_Assessment",
      risk_mitigation_plan: "Risk_Mitigation_Plan",
      training_data_doc: "Training_Data_Documentation",
      bias_assessment: "Bias_Assessment",
      ai_system_description: "AI_System_Description",
      logging_policy: "Logging_Policy",
      deployer_checklist: "Deployer_Checklist",
      qms: "Quality_Management_System",
      post_market_monitoring: "Post_Market_Monitoring_Plan",
      incident_response_plan: "Incident_Response_Plan",
      fria: "Fundamental_Rights_Impact_Assessment",
      cybersecurity_assessment: "Cybersecurity_Assessment",
      transparency_notice: "Transparency_Notice",
      eu_db_registration: "EU_Database_Registration",
      ce_marking: "CE_Marking_Declaration",
      conformity_declaration: "EU_Declaration_Of_Conformity",
      change_management: "Change_Management",
      standards_mapping: "Standards_Mapping",
    };

    const docType =
      typeLabels[document.document_type] ||
      document.document_type?.replace(/[^a-zA-Z0-9]/g, "_") ||
      "Document";
    const createdDate = new Date(document.created_at || Date.now());
    const dateStr = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, "0")}-${String(createdDate.getDate()).padStart(2, "0")}`;
    const systemName = ((document.ai_systems as any)?.name || "")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .substring(0, 30);

    const filename = systemName
      ? `${docType}_${systemName}_${dateStr}.docx`
      : `${docType}_${dateStr}.docx`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/v1/documents/[id]/download:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── Basic document (starter / free tier) ─────────────────────────────

function buildBasicDoc(
  document: any,
  content: Paragraph[]
): Document {
  return new Document({
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
                  new TextRun({
                    text: document.name || "Document",
                    color: COLORS.gray,
                    size: 18,
                  }),
                  new TextRun({
                    text: "  |  ",
                    color: COLORS.gray,
                    size: 18,
                  }),
                  new TextRun({
                    text: "Confidential",
                    color: COLORS.primary,
                    size: 18,
                    bold: true,
                  }),
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
                  new TextRun({
                    text: "Protectron Inc. | Page ",
                    color: COLORS.gray,
                    size: 18,
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    color: COLORS.gray,
                    size: 18,
                  }),
                  new TextRun({
                    text: " of ",
                    color: COLORS.gray,
                    size: 18,
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    color: COLORS.gray,
                    size: 18,
                  }),
                ],
              }),
            ],
          }),
        },
        children: content,
      },
    ],
  });
}

// ─── Enterprise document (pro / enterprise tier) ──────────────────────

function buildEnterpriseDoc(
  document: any,
  bodyContent: Paragraph[],
  orgName: string,
  quality: DocumentQuality,
  profile: { full_name?: string | null }
): Document {
  const systemName = (document.ai_systems as any)?.name || "";

  const enterpriseOpts: EnterpriseDocumentOptions = {
    quality,
    title: document.name || "Compliance Document",
    subtitle: formatDocTypeName(document.document_type),
    documentType: document.document_type || "technical",
    version: "1.0",
    date: document.created_at ? new Date(document.created_at) : new Date(),
    organizationName: orgName,
    preparedBy: profile.full_name || orgName,
    aiSystemName: systemName || undefined,
    riskLevel: undefined, // Could be enriched later
    confidentiality: "Confidential",
  };

  // Build children in order
  const children: (Paragraph | any)[] = [];

  // 1. Cover page
  children.push(...createCoverPage(enterpriseOpts));

  // 2. Document control
  children.push(...createDocumentControlSection(enterpriseOpts));

  // 3. Table of contents (enterprise only)
  if (quality === "enterprise") {
    children.push(...createTableOfContentsSection());
  }

  // 4. Body content
  children.push(...bodyContent);

  // 5. Signature block (enterprise only)
  if (quality === "enterprise") {
    children.push(...createSignatureBlock(enterpriseOpts));
  }

  // 6. Certification badge (enterprise only)
  if (quality === "enterprise") {
    children.push(...createCertificationBadge(enterpriseOpts));
  }

  return new Document({
    features: {
      updateFields: quality === "enterprise",
    },
    styles: {
      default: {
        document: {
          run: { font: "Inter", size: FONT_SIZES.body },
          paragraph: { spacing: { after: 200 } },
        },
      },
      paragraphStyles: [
        {
          id: "Title",
          name: "Title",
          basedOn: "Normal",
          run: {
            size: FONT_SIZES.title,
            bold: true,
            color: COLORS.primary,
            font: "Inter",
          },
          paragraph: {
            spacing: { before: 0, after: 200 },
            alignment: AlignmentType.CENTER,
          },
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: FONT_SIZES.heading1,
            bold: true,
            color: COLORS.primary,
            font: "Inter",
          },
          paragraph: {
            spacing: { before: 400, after: 200 },
            outlineLevel: 0,
          },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: FONT_SIZES.heading2,
            bold: true,
            color: COLORS.secondary,
            font: "Inter",
          },
          paragraph: {
            spacing: { before: 300, after: 150 },
            outlineLevel: 1,
          },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: FONT_SIZES.heading3,
            bold: true,
            color: COLORS.secondary,
            font: "Inter",
          },
          paragraph: {
            spacing: { before: 200, after: 100 },
            outlineLevel: 2,
          },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: "bullet-list",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 720, hanging: 360 },
                },
              },
            },
          ],
        },
        {
          reference: "numbered-list",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 720, hanging: 360 },
                },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: { margin: PAGE.margin },
        },
        headers: {
          default: createEnterpriseHeader(enterpriseOpts),
        },
        footers: {
          default: createEnterpriseFooter(enterpriseOpts),
        },
        children,
      },
    ],
  });
}

// ─── Content generation (same logic, type-safe) ──────────────────────

function generateDocumentContent(
  document: any,
  orgName: string
): Paragraph[] {
  const content: Paragraph[] = [];
  const date = new Date(document.created_at || Date.now()).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

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
          font: "Inter",
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
          text:
            typeLabels[document.document_type] ||
            formatDocTypeName(document.document_type),
          size: 28,
          color: COLORS.gray,
          font: "Inter",
        }),
      ],
    })
  );

  // Metadata
  const systemName = (document.ai_systems as any)?.name || "N/A";
  content.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: `AI System: ${systemName}`,
          size: 22,
          color: COLORS.gray,
          font: "Inter",
        }),
        new TextRun({
          text: "  |  ",
          size: 22,
          color: COLORS.gray,
          font: "Inter",
        }),
        new TextRun({
          text: `Generated: ${date}`,
          size: 22,
          color: COLORS.gray,
          font: "Inter",
        }),
        new TextRun({
          text: "  |  ",
          size: 22,
          color: COLORS.gray,
          font: "Inter",
        }),
        new TextRun({
          text: `Organization: ${orgName}`,
          size: 22,
          color: COLORS.gray,
          font: "Inter",
        }),
      ],
    })
  );

  // Content from generation prompt
  if (document.generation_prompt) {
    try {
      const promptData =
        typeof document.generation_prompt === "string"
          ? JSON.parse(document.generation_prompt)
          : document.generation_prompt;

      Object.entries(promptData).forEach(([key, value]) => {
        // Section heading
        const headingText = key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        content.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: headingText,
                bold: true,
                size: 28,
                color: COLORS.primary,
                font: "Inter",
              }),
            ],
          })
        );

        // Section content
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: String(value || "N/A"),
                size: 22,
                font: "Inter",
              }),
            ],
          })
        );
      });
    } catch {
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "This document was generated using the Protectron compliance platform.",
              size: 22,
              font: "Inter",
            }),
          ],
        })
      );
    }
  } else if (document.content) {
    // Use direct content field if available
    try {
      const sections =
        typeof document.content === "string"
          ? JSON.parse(document.content)
          : document.content;

      if (Array.isArray(sections)) {
        sections.forEach(
          (section: { title?: string; content?: string }, idx: number) => {
            if (section.title) {
              content.push(
                new Paragraph({
                  heading: HeadingLevel.HEADING_1,
                  spacing: { before: 400, after: 200 },
                  children: [
                    new TextRun({
                      text: `${idx + 1}. ${section.title}`,
                      bold: true,
                      size: 32,
                      color: COLORS.primary,
                      font: "Inter",
                    }),
                  ],
                })
              );
            }
            if (section.content) {
              // Split into paragraphs
              const paragraphs = section.content
                .split("\n\n")
                .filter((p: string) => p.trim());
              paragraphs.forEach((p: string) => {
                content.push(
                  new Paragraph({
                    spacing: { after: 200 },
                    children: [
                      new TextRun({
                        text: p.trim(),
                        size: 22,
                        font: "Inter",
                      }),
                    ],
                  })
                );
              });
            }
          }
        );
      }
    } catch {
      content.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "This document was generated using the Protectron compliance platform.",
              size: 22,
              font: "Inter",
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
            font: "Inter",
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
        new TextRun({
          text: "Generated by ",
          color: COLORS.gray,
          italics: true,
          font: "Inter",
        }),
        new TextRun({
          text: "Protectron Inc.",
          color: COLORS.primary,
          bold: true,
          font: "Inter",
        }),
        new TextRun({
          text: ` on ${date}`,
          color: COLORS.gray,
          italics: true,
          font: "Inter",
        }),
      ],
    })
  );

  return content;
}

// ─── Helper ──────────────────────────────────────────────────────────

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
    eu_db_registration: "EU Database Registration Package",
    transparency_notice: "Transparency Notice",
    training_data_doc: "Training Data Documentation",
    bias_assessment: "Bias & Fairness Assessment",
    change_management: "Change Management Log",
    ce_marking: "CE Marking Documentation",
    standards_mapping: "Harmonised Standards Mapping",
    conformity_declaration: "EU Declaration of Conformity",
    fria: "Fundamental Rights Impact Assessment",
    risk_mitigation_plan: "Risk Mitigation Plan",
    ai_system_description: "AI System Description",
    deployer_checklist: "Deployer Checklist",
  };
  return (
    names[docType] ||
    docType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
