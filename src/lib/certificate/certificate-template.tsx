import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Brand Colors (following Cursor_System_Prompt_DocGen.md)
const COLORS = {
  primary: "#1F6D68",      // Main brand color (headers, buttons)
  secondary: "#2B8A84",    // Secondary brand color
  dark: "#0D4744",         // Dark variant (footer)
  light: "#E8F5F4",        // Light variant (alternating rows)
  white: "#FFFFFF",
  black: "#000000",
  gray: "#666666",
  lightGray: "#CCCCCC",
  success: "#9CD323",
  error: "#CE2C60",
  warning: "#FFD066",
};

const styles = StyleSheet.create({
  // Page setup with 1 inch margins (72 points = 1 inch in PDF)
  page: {
    flexDirection: "column",
    backgroundColor: COLORS.white,
    paddingTop: 72,
    paddingBottom: 72,
    paddingLeft: 72,
    paddingRight: 72,
    fontFamily: "Helvetica",
    fontSize: 11,
  },
  // Header - Right aligned with document title
  header: {
    position: "absolute",
    top: 36,
    left: 72,
    right: 72,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  headerSeparator: {
    fontSize: 10,
    color: "#999999",
    marginHorizontal: 8,
  },
  headerConfidential: {
    fontSize: 10,
    color: "#999999",
  },
  // Footer - Centered with page numbers
  footer: {
    position: "absolute",
    bottom: 36,
    left: 72,
    right: 72,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: {
    fontSize: 9,
    color: COLORS.gray,
  },
  footerCenter: {
    fontSize: 10,
    color: COLORS.gray,
  },
  footerRight: {
    fontSize: 9,
    color: COLORS.primary,
  },
  // Title Page
  titlePage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 40,
  },
  // Certification Badge Box
  certificationBox: {
    backgroundColor: COLORS.light,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: 24,
    alignItems: "center",
    marginBottom: 30,
    width: 350,
  },
  certificationLevel: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 8,
  },
  complianceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  systemName: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.black,
    marginTop: 16,
    textAlign: "center",
  },
  organizationName: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 4,
    textAlign: "center",
  },
  // Version and Date info
  metaInfo: {
    alignItems: "center",
    marginTop: 30,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.black,
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 10,
    color: COLORS.gray,
    marginTop: 16,
  },
  // Content Page
  contentPage: {
    flex: 1,
  },
  // Section Headings (following doc gen guide)
  heading1: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  heading2: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.secondary,
    marginTop: 15,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 11,
    color: COLORS.black,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  // Tables (following doc gen guide)
  table: {
    width: "100%",
    marginBottom: 20,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tableRowAlt: {
    flexDirection: "row",
    backgroundColor: COLORS.light,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  tableHeaderCell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: COLORS.lightGray,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.white,
  },
  tableCell: {
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: COLORS.lightGray,
  },
  tableCellText: {
    fontSize: 10,
    color: COLORS.black,
  },
  tableCellLabel: {
    fontSize: 10,
    color: COLORS.gray,
  },
  tableCellValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.black,
  },
  // Score Section
  scoreSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    marginTop: 10,
  },
  scoreBox: {
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.light,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    width: 140,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  scoreLabel: {
    fontSize: 9,
    color: COLORS.gray,
    marginTop: 4,
    textTransform: "uppercase",
  },
  // QR Code Section
  qrSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  qrCode: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  qrText: {
    fontSize: 9,
    color: COLORS.gray,
    textAlign: "center",
  },
  // Check items
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  checkIcon: {
    fontSize: 10,
    marginRight: 8,
  },
  checkText: {
    fontSize: 10,
    color: COLORS.black,
  },
});

export interface CertificateData {
  certId: string;
  systemName: string;
  organizationName: string;
  organizationLogo?: string;
  complianceScore: number;
  certificationLevel: "bronze" | "silver" | "gold";
  issuedAt: string;
  validUntil: string;
  requirements: {
    total: number;
    completed: number;
  };
  checks: {
    sdkConnected: boolean;
    hitlRulesActive: boolean;
    noOpenIncidents: boolean;
    loggingActive: boolean;
  };
  qrCodeDataUrl?: string;
}

const getLevelText = (level: string) => {
  switch (level) {
    case "gold":
      return "GOLD CERTIFICATION";
    case "silver":
      return "SILVER CERTIFICATION";
    case "bronze":
      return "BRONZE CERTIFICATION";
    default:
      return "CERTIFIED";
  }
};

export const CertificateDocument = ({ data }: { data: CertificateData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header - Right aligned with document title (following doc gen guide) */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerLogo}>Protectron</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.headerTitle}>Compliance Certificate</Text>
          <Text style={styles.headerSeparator}>|</Text>
          <Text style={styles.headerConfidential}>Confidential</Text>
        </View>
      </View>

      {/* Title Page Content */}
      <View style={styles.titlePage}>
        {/* Main Title */}
        <Text style={styles.mainTitle}>Certificate of Compliance</Text>
        <Text style={styles.subtitle}>EU Artificial Intelligence Act</Text>

        {/* Certification Box */}
        <View style={styles.certificationBox}>
          <Text style={styles.certificationLevel}>
            {getLevelText(data.certificationLevel)}
          </Text>
          <Text style={styles.complianceText}>EU AI ACT COMPLIANT</Text>
          <Text style={styles.systemName}>{data.systemName}</Text>
          <Text style={styles.organizationName}>{data.organizationName}</Text>
        </View>

        {/* Version and Date Info (following doc gen guide) */}
        <View style={styles.metaInfo}>
          <Text style={styles.metaText}>Certificate ID: {data.certId}</Text>
          <Text style={styles.metaText}>
            Issued: {new Date(data.issuedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </Text>
          <Text style={styles.metaText}>
            Valid Until: {new Date(data.validUntil).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </Text>
          <Text style={styles.metaLabel}>Prepared by: Protectron Compliance Platform</Text>
        </View>

        {/* Score Section */}
        <View style={styles.scoreSection}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreValue}>{data.complianceScore}%</Text>
            <Text style={styles.scoreLabel}>Compliance Score</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreValue}>{data.requirements.completed}/{data.requirements.total}</Text>
            <Text style={styles.scoreLabel}>Requirements Met</Text>
          </View>
        </View>

        {/* Compliance Checks Table (following doc gen guide table styling) */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeaderRow}>
            <View style={[styles.tableHeaderCell, { width: "50%" }]}>
              <Text style={styles.tableHeaderText}>Compliance Check</Text>
            </View>
            <View style={[styles.tableHeaderCell, { width: "50%" }]}>
              <Text style={styles.tableHeaderText}>Status</Text>
            </View>
          </View>
          {/* Table Rows */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "50%" }]}>
              <Text style={styles.tableCellLabel}>SDK Integration</Text>
            </View>
            <View style={[styles.tableCell, { width: "50%" }]}>
              <Text style={[styles.tableCellValue, { color: data.checks.sdkConnected ? COLORS.success : COLORS.error }]}>
                {data.checks.sdkConnected ? "✓ Connected" : "✗ Not Connected"}
              </Text>
            </View>
          </View>
          <View style={styles.tableRowAlt}>
            <View style={[styles.tableCell, { width: "50%" }]}>
              <Text style={styles.tableCellLabel}>Human-in-the-Loop Rules</Text>
            </View>
            <View style={[styles.tableCell, { width: "50%" }]}>
              <Text style={[styles.tableCellValue, { color: data.checks.hitlRulesActive ? COLORS.success : COLORS.error }]}>
                {data.checks.hitlRulesActive ? "✓ Active" : "✗ Not Active"}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "50%" }]}>
              <Text style={styles.tableCellLabel}>Incident Status</Text>
            </View>
            <View style={[styles.tableCell, { width: "50%" }]}>
              <Text style={[styles.tableCellValue, { color: data.checks.noOpenIncidents ? COLORS.success : COLORS.error }]}>
                {data.checks.noOpenIncidents ? "✓ No Open Incidents" : "✗ Has Open Incidents"}
              </Text>
            </View>
          </View>
          <View style={styles.tableRowAlt}>
            <View style={[styles.tableCell, { width: "50%" }]}>
              <Text style={styles.tableCellLabel}>Audit Logging</Text>
            </View>
            <View style={[styles.tableCell, { width: "50%" }]}>
              <Text style={[styles.tableCellValue, { color: data.checks.loggingActive ? COLORS.success : COLORS.error }]}>
                {data.checks.loggingActive ? "✓ Active" : "✗ Not Active"}
              </Text>
            </View>
          </View>
        </View>

        {/* QR Code */}
        {data.qrCodeDataUrl && (
          <View style={styles.qrSection}>
            <Image style={styles.qrCode} src={data.qrCodeDataUrl} />
            <Text style={styles.qrText}>Scan to verify certificate</Text>
          </View>
        )}
      </View>

      {/* Footer - Centered with page info (following doc gen guide) */}
      <View style={styles.footer}>
        <Text style={styles.footerLeft}>
          Valid until {new Date(data.validUntil).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </Text>
        <Text style={styles.footerCenter}>Page 1 of 1</Text>
        <Text style={styles.footerRight}>protectron.ai/verify/{data.certId}</Text>
      </View>
    </Page>
  </Document>
);

export default CertificateDocument;
