import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const APP_URL = "https://protectron.ai";
const LOGO_URL = "https://protectron.ai/logo.png";

interface DocumentPowerEmailProps {
  userName: string;
  userEmail: string;
  documentsUrl?: string;
}

export const DocumentPowerEmail = ({
  userName = "there",
  userEmail = "user@example.com",
  documentsUrl = `${APP_URL}/dashboard/documents`,
}: DocumentPowerEmailProps) => {
  const previewText = "Stop writing compliance docs from scratch";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Img
              src={LOGO_URL}
              width="40"
              height="40"
              alt="Protectron"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={headline}>
              Stop writing compliance docs from scratch
            </Text>

            <Text style={paragraph}>
              Hi {userName},
            </Text>

            <Text style={paragraph}>
              We just generated 40 pages of documentation in 2 minutes. Here&apos;s how.
            </Text>

            {/* Before/After Comparison */}
            <Section style={comparisonContainer}>
              <Section style={comparisonBox}>
                <Text style={comparisonLabel}>❌ The Old Way</Text>
                <Text style={comparisonValue}>Weeks of work</Text>
                <Text style={comparisonDesc}>Hiring consultants, researching requirements, writing from scratch</Text>
              </Section>
              <Section style={comparisonBoxHighlight}>
                <Text style={comparisonLabel}>✅ With Protectron</Text>
                <Text style={comparisonValueHighlight}>5 minutes</Text>
                <Text style={comparisonDesc}>AI-powered generation, EU AI Act compliant, ready to customize</Text>
              </Section>
            </Section>

            <Text style={subheading}>Documents Protectron generates:</Text>

            <Text style={docItem}>📄 <strong>Technical Documentation</strong> (Article 11)</Text>
            <Text style={docItem}>📄 <strong>Risk Assessment Reports</strong> (Article 9)</Text>
            <Text style={docItem}>📄 <strong>Data Governance Policies</strong> (Article 10)</Text>
            <Text style={docItem}>📄 <strong>Human Oversight Procedures</strong> (Article 14)</Text>
            <Text style={docItem}>📄 <strong>Testing & Validation Reports</strong></Text>
            <Text style={docItem}>📄 <strong>Model Cards</strong></Text>
            <Text style={docItemMore}>+ 18 more document types</Text>

            <Section style={buttonContainer}>
              <Button style={button} href={documentsUrl}>
                Generate Your First Document
              </Button>
            </Section>

            <Text style={socialProof}>
              💡 <strong>Companies save 40+ hours per AI system</strong> by using Protectron&apos;s document generator instead of starting from scratch.
            </Text>

            <Text style={signoff}>
              Best,
              <br />
              The Protectron Team
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Protectron Inc.
              <br />
              San Diego, California
            </Text>
            <Text style={footerLinks}>
              <Link href={APP_URL} style={footerLink}>
                Website
              </Link>
              {" • "}
              <Link href={`${APP_URL}/docs`} style={footerLink}>
                Documentation
              </Link>
              {" • "}
              <Link href={`${APP_URL}/support`} style={footerLink}>
                Support
              </Link>
            </Text>
            <Text style={emailNotice}>
              This email was sent to{" "}
              <Link href={`mailto:${userEmail}`} style={footerLink}>
                {userEmail}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  maxWidth: "600px",
  borderRadius: "12px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
};

const header = {
  padding: "32px 40px 0",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
  display: "block",
};

const content = {
  padding: "24px 40px 32px",
};

const headline = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#111827",
  margin: "0 0 24px",
  lineHeight: "1.3",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#4a4a4a",
  margin: "0 0 16px",
};

const comparisonContainer = {
  margin: "24px 0",
};

const comparisonBox = {
  backgroundColor: "#fef2f2",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "12px",
};

const comparisonBoxHighlight = {
  backgroundColor: "#ecfdf5",
  borderRadius: "8px",
  padding: "16px",
  border: "2px solid #10b981",
};

const comparisonLabel = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#6b7280",
  margin: "0 0 4px",
};

const comparisonValue = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#dc2626",
  margin: "0 0 4px",
};

const comparisonValueHighlight = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#059669",
  margin: "0 0 4px",
};

const comparisonDesc = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0",
};

const subheading = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#111827",
  margin: "24px 0 12px",
};

const docItem = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#4a4a4a",
  margin: "0 0 8px",
};

const docItemMore = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#7c3aed",
  fontWeight: "600",
  margin: "8px 0 0",
};

const buttonContainer = {
  margin: "24px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#7c3aed",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 24px",
};

const socialProof = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#4a4a4a",
  backgroundColor: "#f3f4f6",
  padding: "16px",
  borderRadius: "8px",
  margin: "16px 0",
};

const signoff = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#6b7280",
  margin: "24px 0 0",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "0",
};

const footer = {
  padding: "24px 40px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "0 0 12px",
  lineHeight: "1.5",
};

const footerLinks = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "0 0 12px",
};

const footerLink = {
  color: "#6b7280",
  textDecoration: "underline",
};

const emailNotice = {
  fontSize: "11px",
  color: "#9ca3af",
  margin: "0",
};

export default DocumentPowerEmail;
