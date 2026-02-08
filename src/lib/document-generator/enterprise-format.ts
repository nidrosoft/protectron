/**
 * Enterprise Document Formatting
 *
 * Professional formatting layer that upgrades document quality based on
 * subscription tier. Adds cover pages, enhanced headers/footers,
 * document control sections, signature blocks, and certification badges.
 *
 * Tier capabilities:
 * - basic:      Simple title page, basic header/footer (Starter)
 * - standard:   Cover page, document control, enhanced header/footer (Pro)
 * - enterprise: Full cover page with branding, TOC, signature block,
 *               certification badge, custom colors (Enterprise)
 */

import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  HeadingLevel,
  BorderStyle,
  ShadingType,
  TabStopType,
  TabStopPosition,
  TableOfContents,
} from "docx";
import { COLORS, COMPANY, FONT_SIZES, PAGE, cellBorders } from "./config";

// ─── Types ────────────────────────────────────────────────────────────

export type DocumentQuality = "basic" | "standard" | "enterprise";

export interface EnterpriseDocumentOptions {
  /** Document quality tier */
  quality: DocumentQuality;

  /** Core metadata */
  title: string;
  subtitle?: string;
  documentType: string;
  version?: string;
  date?: Date;

  /** Organization info */
  organizationName: string;
  organizationLogo?: string; // base64 or URL (future use)
  preparedBy?: string;
  contactEmail?: string;

  /** AI system info */
  aiSystemName?: string;
  riskLevel?: string;

  /** Classification */
  confidentiality?: "Public" | "Internal" | "Confidential" | "Strictly Confidential";

  /** EU AI Act references */
  euAiActArticles?: string[];
  annexReferences?: string[];

  /** Certification */
  certificationNumber?: string;
  certificationDate?: Date;

  /** Custom branding (enterprise only) */
  primaryColor?: string;
  secondaryColor?: string;
}

// ─── EU AI Act article label lookup ──────────────────────────────────

const DOCUMENT_TYPE_ARTICLES: Record<string, string[]> = {
  technical: ["Article 11", "Annex IV"],
  risk: ["Article 9"],
  policy: ["Article 10"],
  model_card: ["Article 13"],
  human_oversight: ["Article 14"],
  instructions_for_use: ["Article 13"],
  testing_validation: ["Article 15"],
  security_assessment: ["Article 15"],
  qms: ["Article 17"],
  logging_policy: ["Article 12", "Article 18", "Article 19"],
  post_market_monitoring: ["Article 72"],
  incident_response_plan: ["Article 73"],
  cybersecurity_assessment: ["Article 15"],
  eu_db_registration: ["Article 49", "Annex VIII"],
  transparency_notice: ["Article 13", "Article 50"],
  training_data_doc: ["Article 10", "Annex IV(2)(d)"],
  bias_assessment: ["Article 10(2)(f)(g)"],
  change_management: ["Annex IV(6)"],
  ce_marking: ["Article 48"],
  standards_mapping: ["Annex IV(7)"],
  conformity_declaration: ["Article 47", "Annex V"],
  fria: ["Article 27"],
};

const RISK_LEVEL_LABELS: Record<string, string> = {
  prohibited: "PROHIBITED",
  high: "HIGH RISK",
  limited: "LIMITED RISK",
  minimal: "MINIMAL RISK",
};

// ─── Cover Page ──────────────────────────────────────────────────────

export function createCoverPage(opts: EnterpriseDocumentOptions): Paragraph[] {
  const brandColor = opts.primaryColor || COLORS.primary;
  const date = opts.date ? formatEnterpriseDate(opts.date) : formatEnterpriseDate(new Date());
  const articles = opts.euAiActArticles ||
    DOCUMENT_TYPE_ARTICLES[opts.documentType] || [];
  const riskLabel = RISK_LEVEL_LABELS[opts.riskLevel || ""] || "";

  const elements: Paragraph[] = [];

  // Top spacing
  elements.push(spacerParagraph(3000));

  // Horizontal rule (top)
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          color: brandColor,
          size: 16,
          font: "Inter",
        }),
      ],
    })
  );

  // Organization name
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: opts.organizationName.toUpperCase(),
          size: 28,
          bold: true,
          color: COLORS.darkGray,
          font: "Inter",
        }),
      ],
    })
  );

  // Document title
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: opts.title,
          size: FONT_SIZES.title,
          bold: true,
          color: brandColor,
          font: "Inter",
        }),
      ],
    })
  );

  // Subtitle
  if (opts.subtitle) {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: opts.subtitle,
            size: FONT_SIZES.subtitle,
            color: COLORS.gray,
            font: "Inter",
          }),
        ],
      })
    );
  }

  // "EU AI Act Compliance Documentation" label
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: "EU AI Act Compliance Documentation",
          size: 24,
          italics: true,
          color: COLORS.gray,
          font: "Inter",
        }),
      ],
    })
  );

  // Horizontal rule (middle)
  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          color: brandColor,
          size: 16,
          font: "Inter",
        }),
      ],
    })
  );

  // Metadata grid (left-aligned key-value pairs)
  const metaItems: [string, string][] = [];
  if (opts.aiSystemName) metaItems.push(["AI System", opts.aiSystemName]);
  if (riskLabel) metaItems.push(["Risk Level", riskLabel]);
  metaItems.push(["Version", opts.version || "1.0"]);
  metaItems.push(["Date", date]);
  metaItems.push([
    "Classification",
    opts.confidentiality || "Confidential",
  ]);
  if (articles.length > 0) {
    metaItems.push(["EU AI Act Reference", articles.join(", ")]);
  }

  for (const [key, value] of metaItems) {
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: `${key}:  `,
            size: 20,
            color: COLORS.gray,
            font: "Inter",
          }),
          new TextRun({
            text: value,
            size: 20,
            bold: true,
            color: COLORS.darkGray,
            font: "Inter",
          }),
        ],
      })
    );
  }

  // Bottom section: Prepared by
  elements.push(spacerParagraph(800));

  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          color: brandColor,
          size: 16,
          font: "Inter",
        }),
      ],
    })
  );

  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `Prepared by: ${opts.preparedBy || opts.organizationName}`,
          size: 20,
          color: COLORS.gray,
          font: "Inter",
        }),
      ],
    })
  );

  elements.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: `Generated via ${COMPANY.name} — ${COMPANY.tagline}`,
          size: 18,
          italics: true,
          color: COLORS.gray,
          font: "Inter",
        }),
      ],
    })
  );

  // Certification badge (enterprise only)
  if (opts.quality === "enterprise" && opts.certificationNumber) {
    elements.push(spacerParagraph(400));
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "✓ EU AI Act Compliant",
            size: 22,
            bold: true,
            color: COLORS.success,
            font: "Inter",
          }),
        ],
      })
    );
    elements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `Certificate #: ${opts.certificationNumber}`,
            size: 18,
            color: COLORS.gray,
            font: "Inter",
          }),
        ],
      })
    );
  }

  // Page break after cover page
  elements.push(new Paragraph({ children: [new PageBreak()] }));

  return elements;
}

// ─── Document Control Section ────────────────────────────────────────

export function createDocumentControlSection(
  opts: EnterpriseDocumentOptions
): (Paragraph | Table)[] {
  const date = opts.date ? formatEnterpriseDate(opts.date) : formatEnterpriseDate(new Date());
  const brandColor = opts.primaryColor || COLORS.primary;

  const elements: (Paragraph | Table)[] = [];

  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: "Document Control",
          font: "Inter",
          color: brandColor,
        }),
      ],
    })
  );

  // Document control table
  const controlData: [string, string][] = [
    ["Document Title", opts.title],
    ["Document Type", formatDocTypeName(opts.documentType)],
    ["Version", opts.version || "1.0"],
    ["Date", date],
    ["Status", "Draft"],
    ["Prepared By", opts.preparedBy || opts.organizationName],
    ["Organization", opts.organizationName],
    ["Classification", opts.confidentiality || "Confidential"],
  ];

  if (opts.aiSystemName) {
    controlData.push(["AI System", opts.aiSystemName]);
  }
  if (opts.riskLevel) {
    controlData.push(["Risk Classification", RISK_LEVEL_LABELS[opts.riskLevel] || opts.riskLevel]);
  }

  const articles = opts.euAiActArticles ||
    DOCUMENT_TYPE_ARTICLES[opts.documentType] || [];
  if (articles.length > 0) {
    controlData.push(["EU AI Act Reference", articles.join(", ")]);
  }

  elements.push(createControlTable(controlData, brandColor));

  // Version history table
  elements.push(spacerParagraph(400));
  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [
        new TextRun({
          text: "Version History",
          font: "Inter",
        }),
      ],
    })
  );

  elements.push(createVersionHistoryTable(opts, brandColor));

  // Page break after document control
  elements.push(new Paragraph({ children: [new PageBreak()] }));

  return elements;
}

// ─── Table of Contents ───────────────────────────────────────────────

export function createTableOfContentsSection(): (Paragraph | TableOfContents)[] {
  return [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: "Table of Contents",
          font: "Inter",
        }),
      ],
    }),
    new TableOfContents("Table of Contents", {
      hyperlink: true,
      headingStyleRange: "1-3",
      stylesWithLevels: [
        { styleName: "Heading 1", level: 1 },
        { styleName: "Heading 2", level: 2 },
        { styleName: "Heading 3", level: 3 },
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "(Update this table of contents after opening the document in Word: right-click → Update Field)",
          size: 18,
          italics: true,
          color: COLORS.gray,
          font: "Inter",
        }),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

// ─── Enhanced Header / Footer ────────────────────────────────────────

export function createEnterpriseHeader(
  opts: EnterpriseDocumentOptions
): Header {
  const brandColor = opts.primaryColor || COLORS.primary;
  const classification = opts.confidentiality || "Confidential";

  return new Header({
    children: [
      new Paragraph({
        tabStops: [
          { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
        ],
        children: [
          // Left: Organization name
          new TextRun({
            text: opts.organizationName,
            color: brandColor,
            bold: true,
            size: 16,
            font: "Inter",
          }),
          new TextRun({
            text: "\t",
            size: 16,
          }),
          // Right: Classification badge
          new TextRun({
            text: classification.toUpperCase(),
            color: classification === "Strictly Confidential" || classification === "Confidential"
              ? COLORS.error
              : COLORS.gray,
            bold: true,
            size: 16,
            font: "Inter",
          }),
        ],
      }),
      // Second line: Document title + version
      new Paragraph({
        tabStops: [
          { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
        ],
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: opts.title,
            color: COLORS.gray,
            size: 16,
            font: "Inter",
          }),
          new TextRun({
            text: "\t",
            size: 16,
          }),
          new TextRun({
            text: `v${opts.version || "1.0"}`,
            color: COLORS.gray,
            size: 16,
            font: "Inter",
          }),
        ],
      }),
    ],
  });
}

export function createEnterpriseFooter(
  opts: EnterpriseDocumentOptions
): Footer {
  return new Footer({
    children: [
      new Paragraph({
        tabStops: [
          { type: TabStopType.CENTER, position: Math.floor(PAGE.usableWidth / 2) },
          { type: TabStopType.RIGHT, position: TabStopPosition.MAX },
        ],
        children: [
          // Left: Company name
          new TextRun({
            text: `${COMPANY.name}`,
            size: 16,
            color: COLORS.gray,
            font: "Inter",
          }),
          new TextRun({ text: "\t", size: 16 }),
          // Center: Page number
          new TextRun({
            text: "Page ",
            size: 16,
            color: COLORS.gray,
            font: "Inter",
          }),
          new TextRun({
            children: [PageNumber.CURRENT],
            size: 16,
            color: COLORS.gray,
            font: "Inter",
          }),
          new TextRun({
            text: " of ",
            size: 16,
            color: COLORS.gray,
            font: "Inter",
          }),
          new TextRun({
            children: [PageNumber.TOTAL_PAGES],
            size: 16,
            color: COLORS.gray,
            font: "Inter",
          }),
          new TextRun({ text: "\t", size: 16 }),
          // Right: Date
          new TextRun({
            text: formatEnterpriseDate(opts.date || new Date()),
            size: 16,
            color: COLORS.gray,
            font: "Inter",
          }),
        ],
      }),
    ],
  });
}

// ─── Signature Block ─────────────────────────────────────────────────

export function createSignatureBlock(
  opts: EnterpriseDocumentOptions
): (Paragraph | Table)[] {
  return [
    new Paragraph({ children: [new PageBreak()] }),

    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({ text: "Approval & Signatures", font: "Inter" }),
      ],
    }),

    new Paragraph({
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: "This document has been prepared in accordance with EU AI Act requirements. The following approval is required before this document is considered final.",
          size: FONT_SIZES.body,
          color: COLORS.darkGray,
          font: "Inter",
        }),
      ],
    }),

    // Signature table
    createSignatureTable(opts),

    spacerParagraph(400),

    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: "By signing above, I confirm that the information in this document is accurate and complete to the best of my knowledge.",
          size: FONT_SIZES.small,
          italics: true,
          color: COLORS.gray,
          font: "Inter",
        }),
      ],
    }),
  ];
}

// ─── Certification Badge ─────────────────────────────────────────────

export function createCertificationBadge(
  opts: EnterpriseDocumentOptions
): Paragraph[] {
  if (!opts.certificationNumber) return [];

  const certDate = opts.certificationDate
    ? formatEnterpriseDate(opts.certificationDate)
    : formatEnterpriseDate(new Date());

  return [
    spacerParagraph(600),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          color: COLORS.success,
          size: 16,
          font: "Inter",
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: "✓  EU AI ACT COMPLIANT",
          size: 28,
          bold: true,
          color: COLORS.success,
          font: "Inter",
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: `Verified: ${certDate}  |  Certificate #: ${opts.certificationNumber}`,
          size: 18,
          color: COLORS.gray,
          font: "Inter",
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: `Generated by ${COMPANY.name} — ${COMPANY.website}`,
          size: 16,
          italics: true,
          color: COLORS.gray,
          font: "Inter",
        }),
      ],
    }),

    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          color: COLORS.success,
          size: 16,
          font: "Inter",
        }),
      ],
    }),
  ];
}

// ─── Internal Helpers ────────────────────────────────────────────────

function spacerParagraph(height = 200): Paragraph {
  return new Paragraph({ spacing: { before: height }, children: [] });
}

function formatEnterpriseDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
  return names[docType] || docType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function createControlTable(data: [string, string][], brandColor: string): Table {
  const keyWidth = 3200;
  const valueWidth = PAGE.usableWidth - keyWidth;

  return new Table({
    columnWidths: [keyWidth, valueWidth],
    rows: data.map(
      ([key, value], idx) =>
        new TableRow({
          children: [
            new TableCell({
              borders: cellBorders,
              width: { size: keyWidth, type: WidthType.DXA },
              shading: { fill: COLORS.light, type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: key,
                      bold: true,
                      size: 20,
                      color: COLORS.darkGray,
                      font: "Inter",
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              borders: cellBorders,
              width: { size: valueWidth, type: WidthType.DXA },
              shading: idx % 2 === 1 ? { fill: COLORS.brand25, type: ShadingType.CLEAR } : undefined,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: value,
                      size: 20,
                      color: COLORS.black,
                      font: "Inter",
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
    ),
  });
}

function createVersionHistoryTable(
  opts: EnterpriseDocumentOptions,
  brandColor: string
): Table {
  const colWidths = [1500, 1500, 2500, 3860];
  const headerTexts = ["Version", "Date", "Author", "Description"];

  return new Table({
    columnWidths: colWidths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headerTexts.map(
          (text, i) =>
            new TableCell({
              borders: cellBorders,
              width: { size: colWidths[i], type: WidthType.DXA },
              shading: { fill: brandColor, type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text,
                      bold: true,
                      color: COLORS.white,
                      size: 20,
                      font: "Inter",
                    }),
                  ],
                }),
              ],
            })
        ),
      }),
      // First version entry
      new TableRow({
        children: [
          simpleCell(opts.version || "1.0", colWidths[0]),
          simpleCell(
            formatEnterpriseDate(opts.date || new Date()),
            colWidths[1]
          ),
          simpleCell(opts.preparedBy || opts.organizationName, colWidths[2]),
          simpleCell("Initial version generated via Protectron", colWidths[3]),
        ],
      }),
      // Empty row for future versions
      new TableRow({
        children: colWidths.map(
          (w) => simpleCell("", w)
        ),
      }),
    ],
  });
}

function createSignatureTable(opts: EnterpriseDocumentOptions): Table {
  const colWidths = [2340, 3510, 1755, 1755];
  const headerTexts = ["Role", "Name", "Signature", "Date"];

  return new Table({
    columnWidths: colWidths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headerTexts.map(
          (text, i) =>
            new TableCell({
              borders: cellBorders,
              width: { size: colWidths[i], type: WidthType.DXA },
              shading: { fill: COLORS.primary, type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text,
                      bold: true,
                      color: COLORS.white,
                      size: 20,
                      font: "Inter",
                    }),
                  ],
                }),
              ],
            })
        ),
      }),
      // Prepared by
      signatureRow("Prepared By", opts.preparedBy || "", colWidths),
      // Reviewed by (empty for user to fill)
      signatureRow("Reviewed By", "", colWidths),
      // Approved by (empty for user to fill)
      signatureRow("Approved By", "", colWidths),
    ],
  });
}

function signatureRow(role: string, name: string, colWidths: number[]): TableRow {
  return new TableRow({
    height: { value: 800, rule: "atLeast" as never },
    children: [
      simpleCell(role, colWidths[0]),
      simpleCell(name, colWidths[1]),
      simpleCell("", colWidths[2]), // Signature
      simpleCell("", colWidths[3]), // Date
    ],
  });
}

function simpleCell(text: string, width: number): TableCell {
  return new TableCell({
    borders: cellBorders,
    width: { size: width, type: WidthType.DXA },
    children: [
      new Paragraph({
        children: [
          new TextRun({ text, size: 20, font: "Inter" }),
        ],
      }),
    ],
  });
}
