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

interface FirstWinEmailProps {
  userName: string;
  userEmail: string;
  companyName?: string;
  assessmentUrl?: string;
}

export const FirstWinEmail = ({
  userName = "there",
  userEmail = "user@example.com",
  companyName,
  assessmentUrl = `${APP_URL}/assessment`,
}: FirstWinEmailProps) => {
  const previewText = "Your first 10 minutes could save months of compliance work";

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
              Your first 10 minutes could save months
            </Text>

            <Text style={paragraph}>
              Hi {userName},
            </Text>

            <Text style={paragraph}>
              Quick question: Do you know which EU AI Act requirements apply to {companyName ? `${companyName}'s` : "your"} AI systems?
            </Text>

            <Text style={paragraph}>
              <strong>Most companies don&apos;t.</strong> And that uncertainty can stall enterprise deals, delay product launches, and create legal risk.
            </Text>

            <Text style={highlightBox}>
              <strong>Here&apos;s the good news:</strong> You can find out in 10 minutes.
            </Text>

            <Text style={paragraph}>
              Our Risk Classification Engine asks you a few simple questions about your AI system:
            </Text>

            <Text style={listItem}>• What does it do?</Text>
            <Text style={listItem}>• Who uses it?</Text>
            <Text style={listItem}>• What decisions does it influence?</Text>

            <Text style={paragraph}>
              Then it tells you:
            </Text>

            <Text style={checkItem}>✅ Your risk level (Prohibited, High-Risk, Limited, or Minimal)</Text>
            <Text style={checkItem}>✅ Which EU AI Act articles apply to you</Text>
            <Text style={checkItem}>✅ Exactly what you need to do next</Text>

            <Text style={paragraph}>
              <strong>No legal expertise required. No consultants. Just clarity.</strong>
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={assessmentUrl}>
                Classify Your First AI System
              </Button>
            </Section>

            <Text style={paragraph}>
              Once you know your risk level, everything else becomes clear.
            </Text>

            <Text style={signoff}>
              Best,
              <br />
              The Protectron Team
            </Text>

            <Text style={psText}>
              P.S. High-risk AI systems have 113 requirements to track. Low-risk? Much simpler. Find out which camp you&apos;re in.
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

const highlightBox = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#065f46",
  backgroundColor: "#d1fae5",
  padding: "16px",
  borderRadius: "8px",
  margin: "16px 0",
};

const listItem = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#4a4a4a",
  margin: "0 0 4px",
  paddingLeft: "8px",
};

const checkItem = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#4a4a4a",
  margin: "0 0 8px",
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

const signoff = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#6b7280",
  margin: "24px 0 0",
};

const psText = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#6b7280",
  fontStyle: "italic",
  margin: "24px 0 0",
  padding: "12px 16px",
  backgroundColor: "#f3f4f6",
  borderRadius: "8px",
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

export default FirstWinEmail;
