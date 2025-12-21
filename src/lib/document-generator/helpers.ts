/**
 * Protectron Document Generator Helper Functions
 * 
 * Reusable helper functions for creating document elements.
 */

import {
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  HeadingLevel,
  WidthType,
} from "docx";
import { COLORS, cellBorders, headerShading, altRowShading, FONT_SIZES } from "./config";

/**
 * Create a styled table header cell with brand color background
 */
export function headerCell(text: string, width: number): TableCell {
  return new TableCell({
    borders: cellBorders,
    width: { size: width, type: WidthType.DXA },
    shading: headerShading,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: true,
            color: COLORS.white,
            font: "Inter",
          }),
        ],
      }),
    ],
  });
}

/**
 * Create a regular table cell with optional alternating shading
 */
export function cell(text: string, width: number, shaded = false): TableCell {
  return new TableCell({
    borders: cellBorders,
    width: { size: width, type: WidthType.DXA },
    shading: shaded ? altRowShading : undefined,
    children: [
      new Paragraph({
        children: [new TextRun({ text, font: "Inter" })],
      }),
    ],
  });
}

/**
 * Create a multi-line cell (for longer content)
 */
export function multiLineCell(text: string, width: number, shaded = false): TableCell {
  const lines = text.split("\n").filter(Boolean);
  return new TableCell({
    borders: cellBorders,
    width: { size: width, type: WidthType.DXA },
    shading: shaded ? altRowShading : undefined,
    children: lines.map(
      (line) =>
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: line, font: "Inter" })],
        })
    ),
  });
}

/**
 * Create a bullet point paragraph
 */
export function bullet(text: string, reference = "bullet-list"): Paragraph {
  return new Paragraph({
    numbering: { reference, level: 0 },
    children: [new TextRun({ text, font: "Inter" })],
  });
}

/**
 * Create a numbered list item
 */
export function numberedItem(text: string, reference = "numbered-list"): Paragraph {
  return new Paragraph({
    numbering: { reference, level: 0 },
    children: [new TextRun({ text, font: "Inter" })],
  });
}

/**
 * Create a section heading
 */
export function heading(text: string, level: 1 | 2 | 3 = 1): Paragraph {
  const headingLevels = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
  };
  return new Paragraph({
    heading: headingLevels[level],
    children: [new TextRun({ text, font: "Inter" })],
  });
}

/**
 * Create a regular paragraph with options
 */
export function para(
  text: string,
  options: {
    spacing?: number;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    bold?: boolean;
    italics?: boolean;
    color?: string;
    size?: number;
  } = {}
): Paragraph {
  return new Paragraph({
    spacing: { after: options.spacing ?? 200 },
    alignment: options.align ?? AlignmentType.LEFT,
    children: [
      new TextRun({
        text,
        bold: options.bold ?? false,
        italics: options.italics ?? false,
        color: options.color ?? COLORS.black,
        size: options.size ?? FONT_SIZES.body,
        font: "Inter",
      }),
    ],
  });
}

/**
 * Create a paragraph with mixed formatting
 */
export function richPara(
  runs: Array<{
    text: string;
    bold?: boolean;
    italics?: boolean;
    color?: string;
    size?: number;
  }>,
  options: {
    spacing?: number;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
  } = {}
): Paragraph {
  return new Paragraph({
    spacing: { after: options.spacing ?? 200 },
    alignment: options.align ?? AlignmentType.LEFT,
    children: runs.map(
      (run) =>
        new TextRun({
          text: run.text,
          bold: run.bold ?? false,
          italics: run.italics ?? false,
          color: run.color ?? COLORS.black,
          size: run.size ?? FONT_SIZES.body,
          font: "Inter",
        })
    ),
  });
}

/**
 * Create a key-value table (2 columns: 30%/70%)
 */
export function keyValueTable(
  data: Array<{ key: string; value: string }>
): Table {
  const keyWidth = 2808;
  const valueWidth = 6552;

  return new Table({
    columnWidths: [keyWidth, valueWidth],
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          headerCell("Property", keyWidth),
          headerCell("Value", valueWidth),
        ],
      }),
      ...data.map(
        (item, index) =>
          new TableRow({
            children: [
              cell(item.key, keyWidth, index % 2 === 1),
              multiLineCell(item.value, valueWidth, index % 2 === 1),
            ],
          })
      ),
    ],
  });
}

/**
 * Create a dynamic table from headers and data
 */
export function dataTable(
  headers: string[],
  data: string[][]
): Table {
  const colWidth = Math.floor(9360 / headers.length);

  return new Table({
    columnWidths: headers.map(() => colWidth),
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h) => headerCell(h, colWidth)),
      }),
      ...data.map(
        (row, rowIndex) =>
          new TableRow({
            children: row.map((cellText) =>
              cell(cellText, colWidth, rowIndex % 2 === 1)
            ),
          })
      ),
    ],
  });
}

/**
 * Create an empty spacer paragraph
 */
export function spacer(height = 200): Paragraph {
  return new Paragraph({
    spacing: { before: height },
    children: [],
  });
}

/**
 * Format a date for documents
 */
export function formatDate(date?: Date | string): string {
  const d = date ? new Date(date) : new Date();
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
