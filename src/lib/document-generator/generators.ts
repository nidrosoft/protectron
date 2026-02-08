/**
 * Protectron Document Generators
 * 
 * Document generation functions for different document types.
 */

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  Header,
  Footer,
  AlignmentType,
  PageNumber,
  LevelFormat,
  HeadingLevel,
  PageBreak,
} from "docx";
import { saveAs } from "file-saver";
import { COLORS, COMPANY, PAGE, FONT_SIZES } from "./config";
import {
  heading,
  para,
  richPara,
  bullet,
  keyValueTable,
  spacer,
  formatDate,
} from "./helpers";
import type {
  DocumentData,
  TechnicalDocumentData,
  RiskAssessmentData,
  DataGovernancePolicyData,
  ModelCardData,
  DocumentMetadata,
  GenerateDocumentOptions,
} from "./types";
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
} from "./enterprise-format";

/**
 * Create the base document structure with Protectron branding
 */
/**
 * Document content element type (can be Paragraph or Table)
 */
type DocumentElement = Paragraph | Table;

function createBaseDocument(
  metadata: DocumentMetadata,
  content: DocumentElement[]
): Document {
  const docTitle = metadata.title;
  const docSubtitle = metadata.subtitle || "";
  const version = metadata.version || "1.0";
  const date = formatDate(metadata.date);
  const preparedBy = metadata.preparedBy || COMPANY.name;
  const confidential = metadata.confidential !== false;

  return new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Inter",
            size: FONT_SIZES.body,
          },
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
          page: {
            margin: PAGE.margin,
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: docTitle,
                    color: COLORS.primary,
                    bold: true,
                    size: FONT_SIZES.small,
                    font: "Inter",
                  }),
                  new TextRun({
                    text: "  |  ",
                    color: COLORS.gray,
                    size: FONT_SIZES.small,
                    font: "Inter",
                  }),
                  new TextRun({
                    text: confidential ? "Confidential" : COMPANY.name,
                    color: COLORS.gray,
                    size: FONT_SIZES.small,
                    font: "Inter",
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
                    text: `${COMPANY.name}  |  `,
                    size: FONT_SIZES.small,
                    color: COLORS.gray,
                    font: "Inter",
                  }),
                  new TextRun({
                    text: "Page ",
                    size: FONT_SIZES.small,
                    color: COLORS.gray,
                    font: "Inter",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: FONT_SIZES.small,
                    color: COLORS.gray,
                    font: "Inter",
                  }),
                  new TextRun({
                    text: " of ",
                    size: FONT_SIZES.small,
                    color: COLORS.gray,
                    font: "Inter",
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: FONT_SIZES.small,
                    color: COLORS.gray,
                    font: "Inter",
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // Title Page
          spacer(2000),
          new Paragraph({
            heading: HeadingLevel.TITLE,
            children: [new TextRun({ text: docTitle, font: "Inter" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: docSubtitle,
                size: FONT_SIZES.subtitle,
                color: COLORS.gray,
                font: "Inter",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 800 },
            children: [
              new TextRun({
                text: date,
                size: FONT_SIZES.body,
                bold: true,
                font: "Inter",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 600 },
            children: [
              new TextRun({
                text: `Prepared by: ${preparedBy}`,
                size: FONT_SIZES.small,
                color: COLORS.gray,
                font: "Inter",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
            children: [
              new TextRun({
                text: `Generated via ${COMPANY.name} - ${COMPANY.tagline}`,
                size: FONT_SIZES.small,
                color: COLORS.gray,
                italics: true,
                font: "Inter",
              }),
            ],
          }),

          // Page break before content
          new Paragraph({ children: [new PageBreak()] }),

          // Document content
          ...content,
        ],
      },
    ],
  });
}

/**
 * Create an enterprise-quality document with enhanced formatting.
 * Adds cover page, document control, TOC, signature block, and certification
 * badge based on the quality level.
 *
 * Quality levels:
 * - basic:      Same as createBaseDocument (starter plans)
 * - standard:   Cover page + document control + enhanced headers/footers (pro plans)
 * - enterprise: Full cover page + document control + TOC + signature block +
 *               certification badge + custom branding (enterprise plans)
 */
function createEnterpriseDocument(
  metadata: DocumentMetadata,
  content: DocumentElement[],
  enterpriseOpts: EnterpriseDocumentOptions
): Document {
  const quality = enterpriseOpts.quality;

  // For basic quality, fallback to the standard document
  if (quality === "basic") {
    return createBaseDocument(metadata, content);
  }

  // Build page children in order
  // Use `any[]` for children since docx accepts Paragraph, Table,
  // TableOfContents, and other FileChild subtypes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [];

  // 1. Cover page (standard + enterprise)
  children.push(...createCoverPage(enterpriseOpts));

  // 2. Document control section (standard + enterprise)
  children.push(...createDocumentControlSection(enterpriseOpts));

  // 3. Table of contents (enterprise only)
  if (quality === "enterprise") {
    children.push(...createTableOfContentsSection());
  }

  // 4. Main content
  children.push(...content);

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
      updateFields: quality === "enterprise", // Auto-update TOC fields
    },
    styles: {
      default: {
        document: {
          run: {
            font: "Inter",
            size: FONT_SIZES.body,
          },
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
            color: enterpriseOpts.primaryColor || COLORS.primary,
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
            color: enterpriseOpts.primaryColor || COLORS.primary,
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
          page: {
            margin: PAGE.margin,
          },
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

/**
 * Build EnterpriseDocumentOptions from GenerateDocumentOptions + metadata
 */
function buildEnterpriseOpts(
  metadata: DocumentMetadata,
  options: GenerateDocumentOptions,
  documentType: string
): EnterpriseDocumentOptions {
  return {
    quality: options.quality || "basic",
    title: metadata.title,
    subtitle: metadata.subtitle,
    documentType,
    version: metadata.version,
    date: metadata.date ? new Date(metadata.date) : new Date(),
    organizationName: options.organizationName || metadata.companyName || COMPANY.name,
    preparedBy: options.preparedBy || metadata.preparedBy || COMPANY.name,
    contactEmail: options.contactEmail,
    aiSystemName: options.aiSystemName,
    riskLevel: options.riskLevel,
    confidentiality: options.confidentiality,
    euAiActArticles: options.euAiActArticles,
    certificationNumber: options.certificationNumber,
    primaryColor: options.primaryColor,
  };
}

/**
 * Parse AI-generated sections from answers
 */
function parseAIGeneratedSections(answers: Record<string, string | undefined>): { title: string; content: string }[] | null {
  try {
    if (answers._aiGenerated) {
      return JSON.parse(answers._aiGenerated);
    }
  } catch (e) {
    console.error("Failed to parse AI-generated sections:", e);
  }
  return null;
}

/**
 * Clean markdown formatting from AI-generated content
 */
function cleanMarkdown(text: string): string {
  return text
    // Remove bold markers **text** or __text__
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    // Remove italic markers *text* or _text_
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove headers # ## ###
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bullet points - or *
    .replace(/^[\-\*]\s+/gm, '')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Parse content and identify subheadings (text followed by colon)
 * Returns array of { isSubheading: boolean, text: string }
 */
function parseContentWithSubheadings(content: string): { isSubheading: boolean; text: string }[] {
  const result: { isSubheading: boolean; text: string }[] = [];
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  
  paragraphs.forEach(p => {
    const cleaned = cleanMarkdown(p.trim());
    
    // Check if this looks like a subheading (short text ending with colon followed by content)
    // Or a line that starts with a capitalized phrase followed by colon
    const subheadingMatch = cleaned.match(/^([A-Z][^:]{2,50}):\s*([\s\S]+)/);
    
    if (subheadingMatch) {
      // It's a subheading with content
      result.push({ isSubheading: true, text: subheadingMatch[1] });
      if (subheadingMatch[2].trim()) {
        result.push({ isSubheading: false, text: subheadingMatch[2].trim() });
      }
    } else {
      // Regular paragraph
      result.push({ isSubheading: false, text: cleaned });
    }
  });
  
  return result;
}

/**
 * Generate content from AI-generated sections
 */
function generateFromAISections(
  sections: { title: string; content: string }[],
  aiSystem: { name: string; description?: string; riskLevel?: string; status?: string }
): DocumentElement[] {
  const elements: DocumentElement[] = [];
  
  sections.forEach((section, index) => {
    // Add main section heading
    elements.push(heading(`${index + 1}. ${cleanMarkdown(section.title)}`, 1));
    
    // Parse content and handle subheadings
    const contentParts = parseContentWithSubheadings(section.content);
    
    let subheadingCounter = 0;
    contentParts.forEach((part) => {
      if (part.isSubheading) {
        subheadingCounter++;
        // Add subheading with letter prefix (a, b, c, etc.)
        const letter = String.fromCharCode(96 + subheadingCounter); // a, b, c...
        elements.push(heading(`${letter}. ${part.text}`, 2));
      } else if (part.text) {
        elements.push(para(part.text));
      }
    });
    
    elements.push(spacer(200));
  });
  
  // Add footer
  elements.push(spacer(400));
  elements.push(richPara([
    { text: "Document generated by ", color: COLORS.gray, italics: true },
    { text: COMPANY.name, color: COLORS.primary, bold: true },
    { text: ` on ${formatDate()}`, color: COLORS.gray, italics: true },
  ]));
  
  return elements;
}

/**
 * Generate Technical Documentation content
 */
function generateTechnicalContent(data: TechnicalDocumentData): DocumentElement[] {
  const { aiSystem, answers } = data;

  // Check for AI-generated content
  const aiSections = parseAIGeneratedSections(answers as Record<string, string | undefined>);
  if (aiSections && aiSections.length > 0) {
    return generateFromAISections(aiSections, aiSystem);
  }

  // Fallback to template-based generation
  return [
    heading("1. Executive Summary", 1),
    para(
      `This technical documentation provides a comprehensive overview of the "${aiSystem.name}" AI system, ` +
        `as required under Article 11 of the EU AI Act. This document covers the system's architecture, ` +
        `data processing, algorithms, and performance metrics.`
    ),

    heading("2. System Overview", 1),
    keyValueTable([
      { key: "System Name", value: aiSystem.name },
      { key: "Description", value: aiSystem.description || "N/A" },
      { key: "Risk Classification", value: aiSystem.riskLevel || "To be determined" },
      { key: "Current Status", value: aiSystem.status || "Active" },
    ]),

    heading("3. Intended Purpose", 1),
    para(answers.purpose || "The intended purpose of this AI system has not been specified."),

    heading("4. Data Processing", 1),
    heading("4.1 Data Types Processed", 2),
    para(answers.data || "The data types processed by this system have not been specified."),

    heading("5. Decision-Making Process", 1),
    para(answers.decisions || "The decision-making process has not been specified."),

    heading("6. Intended Users", 1),
    para(answers.users || "The intended users have not been specified."),

    heading("7. Compliance Statement", 1),
    para(
      `This AI system is designed to comply with the requirements of the EU AI Act. ` +
        `Regular monitoring and updates are performed to ensure continued compliance.`
    ),

    spacer(400),
    richPara([
      { text: "Document generated by ", color: COLORS.gray, italics: true },
      { text: COMPANY.name, color: COLORS.primary, bold: true },
      { text: ` on ${formatDate()}`, color: COLORS.gray, italics: true },
    ]),
  ];
}

/**
 * Generate Risk Assessment content
 */
function generateRiskContent(data: RiskAssessmentData): DocumentElement[] {
  const { aiSystem, answers } = data;

  // Check for AI-generated content
  const aiSections = parseAIGeneratedSections(answers as Record<string, string | undefined>);
  if (aiSections && aiSections.length > 0) {
    return generateFromAISections(aiSections, aiSystem);
  }

  // Fallback to template-based generation
  return [
    heading("1. Executive Summary", 1),
    para(
      `This risk assessment report identifies and evaluates potential risks associated with the ` +
        `"${aiSystem.name}" AI system. It covers foreseeable misuse, bias risks, and safety concerns ` +
        `with proposed mitigation strategies.`
    ),

    heading("2. System Information", 1),
    keyValueTable([
      { key: "System Name", value: aiSystem.name },
      { key: "Risk Classification", value: aiSystem.riskLevel || "To be determined" },
      { key: "Assessment Date", value: formatDate() },
    ]),

    heading("3. Identified Risks", 1),
    para(answers.risks || "No specific risks have been identified at this time."),

    heading("4. Mitigation Measures", 1),
    para(answers.mitigation || "Mitigation measures have not been specified."),

    heading("5. Monitoring Procedures", 1),
    para(answers.monitoring || "Monitoring procedures have not been specified."),

    heading("6. Risk Matrix", 1),
    para(
      "The following risk categories are evaluated for this AI system:",
      { spacing: 100 }
    ),
    bullet("Bias and discrimination risks"),
    bullet("Privacy and data protection risks"),
    bullet("Safety and security risks"),
    bullet("Transparency and explainability risks"),
    bullet("Human oversight risks"),

    heading("7. Recommendations", 1),
    para(
      "Based on this assessment, the following actions are recommended to maintain compliance " +
        "and minimize risks associated with this AI system."
    ),

    spacer(400),
    richPara([
      { text: "Document generated by ", color: COLORS.gray, italics: true },
      { text: COMPANY.name, color: COLORS.primary, bold: true },
      { text: ` on ${formatDate()}`, color: COLORS.gray, italics: true },
    ]),
  ];
}

/**
 * Generate Data Governance Policy content
 */
function generatePolicyContent(data: DataGovernancePolicyData): DocumentElement[] {
  const { answers, aiSystem } = data;

  // Check for AI-generated content
  const aiSections = parseAIGeneratedSections(answers as Record<string, string | undefined>);
  if (aiSections && aiSections.length > 0) {
    return generateFromAISections(aiSections, aiSystem || { name: "Organization" });
  }

  // Fallback to template-based generation
  return [
    heading("1. Purpose", 1),
    para(
      "This Data Governance Policy documents our organization's approach to data quality, " +
        "collection, and bias mitigation for AI systems. It outlines procedures for ensuring " +
        "training data is representative, accurate, and ethically sourced."
    ),

    heading("2. Scope", 1),
    para(
      "This policy applies to all AI systems developed, deployed, or operated by the organization, " +
        "including third-party AI systems integrated into our operations."
    ),

    heading("3. Data Sources", 1),
    para(answers.dataSources || "Data sources have not been specified."),

    heading("4. Data Quality Assurance", 1),
    para(answers.quality || "Data quality assurance procedures have not been specified."),

    heading("5. Bias Mitigation", 1),
    para(answers.bias || "Bias mitigation measures have not been specified."),

    heading("6. Data Governance Principles", 1),
    bullet("Data Accuracy: Ensure all data is accurate and up-to-date"),
    bullet("Data Completeness: Maintain comprehensive datasets"),
    bullet("Data Consistency: Apply consistent standards across all data"),
    bullet("Data Timeliness: Use current and relevant data"),
    bullet("Data Validity: Validate data against defined rules"),

    heading("7. Roles and Responsibilities", 1),
    para(
      "The organization designates specific roles responsible for data governance, " +
        "including data stewards, data owners, and compliance officers."
    ),

    heading("8. Review and Updates", 1),
    para(
      "This policy shall be reviewed annually or when significant changes occur to " +
        "AI systems or regulatory requirements."
    ),

    spacer(400),
    richPara([
      { text: "Document generated by ", color: COLORS.gray, italics: true },
      { text: COMPANY.name, color: COLORS.primary, bold: true },
      { text: ` on ${formatDate()}`, color: COLORS.gray, italics: true },
    ]),
  ];
}

/**
 * Generate Model Card content
 */
function generateModelCardContent(data: ModelCardData): DocumentElement[] {
  const { aiSystem, answers } = data;

  // Check for AI-generated content
  const aiSections = parseAIGeneratedSections(answers as Record<string, string | undefined>);
  if (aiSections && aiSections.length > 0) {
    return generateFromAISections(aiSections, aiSystem);
  }

  // Fallback to template-based generation
  return [
    heading("1. Model Overview", 1),
    keyValueTable([
      { key: "Model Name", value: aiSystem.name },
      { key: "Description", value: aiSystem.description || "N/A" },
      { key: "Version", value: "1.0" },
      { key: "Last Updated", value: formatDate() },
    ]),

    heading("2. Intended Use", 1),
    heading("2.1 Primary Use Cases", 2),
    para(aiSystem.purpose || "Primary use cases have not been specified."),

    heading("2.2 Out-of-Scope Uses", 2),
    para(
      "This model should not be used for purposes outside its intended scope, " +
        "particularly in high-stakes decision-making without human oversight."
    ),

    heading("3. Capabilities", 1),
    para(answers.capabilities || "Model capabilities have not been specified."),

    heading("4. Limitations", 1),
    para(answers.limitations || "Model limitations have not been specified."),

    heading("5. Performance Metrics", 1),
    para(answers.performance || "Performance metrics have not been specified."),

    heading("6. Training Data", 1),
    para(
      "Information about the training data used for this model, including sources, " +
        "preprocessing steps, and any known biases."
    ),

    heading("7. Ethical Considerations", 1),
    bullet("Fairness: Steps taken to ensure fair outcomes across different groups"),
    bullet("Privacy: Data protection measures implemented"),
    bullet("Transparency: Explainability of model decisions"),
    bullet("Accountability: Oversight and governance structures"),

    heading("8. Recommendations", 1),
    para(
      "Users of this model should implement appropriate human oversight and " +
        "regularly monitor for performance degradation or bias."
    ),

    spacer(400),
    richPara([
      { text: "Document generated by ", color: COLORS.gray, italics: true },
      { text: COMPANY.name, color: COLORS.primary, bold: true },
      { text: ` on ${formatDate()}`, color: COLORS.gray, italics: true },
    ]),
  ];
}

/**
 * Generate a universal document from AI-generated sections.
 * Works for any document type — just pass the AI output and metadata.
 * Supports enterprise formatting via options.quality.
 */
export async function generateUniversalDocument(
  sections: { title: string; content: string }[],
  metadata: DocumentMetadata,
  systemInfo: { name: string; description?: string; riskLevel?: string; status?: string },
  options: GenerateDocumentOptions = { format: "docx", download: true }
): Promise<Blob> {
  const content = generateFromAISections(sections, systemInfo);

  let doc: Document;

  if (options.quality && options.quality !== "basic") {
    const enterpriseOpts = buildEnterpriseOpts(metadata, {
      ...options,
      aiSystemName: options.aiSystemName || systemInfo.name,
      riskLevel: options.riskLevel || systemInfo.riskLevel,
    }, "technical");
    doc = createEnterpriseDocument(metadata, content, enterpriseOpts);
  } else {
    doc = createBaseDocument(metadata, content);
  }

  const blob = await Packer.toBlob(doc);

  if (options.download) {
    const filename = `${metadata.title.replace(/[^a-zA-Z0-9]/g, "_")}.docx`;
    saveAs(blob, filename);
  }

  return blob;
}

/**
 * Main document generation function.
 * Supports enterprise formatting via options.quality.
 */
export async function generateDocument(
  data: DocumentData,
  options: GenerateDocumentOptions = { format: "docx", download: true }
): Promise<Blob> {
  let content: DocumentElement[];

  switch (data.type) {
    case "technical":
      content = generateTechnicalContent(data);
      break;
    case "risk":
      content = generateRiskContent(data);
      break;
    case "policy":
      content = generatePolicyContent(data);
      break;
    case "model_card":
      content = generateModelCardContent(data);
      break;
    default:
      throw new Error(`Unknown document type: ${(data as DocumentData).type}`);
  }

  let doc: Document;

  if (options.quality && options.quality !== "basic") {
    const aiSystem = "aiSystem" in data ? data.aiSystem : undefined;
    const enterpriseOpts = buildEnterpriseOpts(data.metadata, {
      ...options,
      aiSystemName: options.aiSystemName || aiSystem?.name,
      riskLevel: options.riskLevel || aiSystem?.riskLevel,
    }, data.type);
    doc = createEnterpriseDocument(data.metadata, content, enterpriseOpts);
  } else {
    doc = createBaseDocument(data.metadata, content);
  }

  const blob = await Packer.toBlob(doc);

  if (options.download) {
    const filename = `${data.metadata.title.replace(/[^a-zA-Z0-9]/g, "_")}.docx`;
    saveAs(blob, filename);
  }

  return blob;
}

/**
 * Get document type display name
 */
export function getDocumentTypeName(type: string): string {
  const names: Record<string, string> = {
    technical: "Technical Documentation",
    risk: "Risk Assessment Report",
    policy: "Data Governance Policy",
    model_card: "Model Card",
    // Phase 1 - High Priority
    testing_validation: "Testing & Validation Report",
    instructions_for_use: "Instructions for Use",
    human_oversight: "Human Oversight Procedures",
    security_assessment: "Security Assessment Report",
    // Phase 2 - Medium Priority
    risk_mitigation_plan: "Risk Mitigation Plan",
    training_data_doc: "Training Data Documentation",
    bias_assessment: "Bias Assessment Report",
    ai_system_description: "AI System Description",
    logging_policy: "Logging Policy",
    deployer_checklist: "Deployer Compliance Checklist",
    // Phase 3 - Lower Priority
    risk_management_policy: "Risk Management Policy",
    design_development_spec: "Design & Development Specification",
    audit_trail_samples: "Audit Trail Samples",
    log_retention_doc: "Log Retention Documentation",
    deployer_info_package: "Deployer Information Package",
    user_notification_templates: "User Notification Templates",
    intervention_protocols: "Intervention Protocols",
    operator_training_records: "Operator Training Records",
    accuracy_test_results: "Accuracy Test Results",
    robustness_testing_doc: "Robustness Testing Documentation",
    incident_reporting_procedures: "Incident Reporting Procedures",
    monitoring_log: "Monitoring Log Template",
    ai_disclosure_notice: "AI Disclosure Notice",
    synthetic_content_policy: "Synthetic Content Policy",
    // Phase 4 - Missing EU AI Act Documents
    qms: "Quality Management System",
    post_market_monitoring: "Post-Market Monitoring Plan",
    incident_response_plan: "Incident Response Plan",
    fria: "Fundamental Rights Impact Assessment",
    cybersecurity_assessment: "Cybersecurity Assessment",
    transparency_notice: "Transparency Notice",
    eu_db_registration: "EU Database Registration Form",
    ce_marking: "CE Marking Declaration",
    conformity_declaration: "EU Declaration of Conformity",
    change_management: "Change Management Procedures",
    standards_mapping: "Standards Mapping Document",
  };
  return names[type] || type;
}
