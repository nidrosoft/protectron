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

interface WelcomeEmailProps {
  userName: string;
  userEmail: string;
  trialEndDate: string;
  dashboardUrl?: string;
}

export const WelcomeEmail = ({
  userName = "there",
  userEmail = "user@example.com",
  trialEndDate = "January 30, 2026",
  dashboardUrl = `${APP_URL}/dashboard`,
}: WelcomeEmailProps) => {
  const previewText = `Welcome to Protectron, ${userName}! Let's get you compliant`;

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
              Welcome to Protectron, {userName}! 🎉
            </Text>

            <Text style={paragraph}>
              You&apos;re one step closer to EU AI Act compliance.
            </Text>

            <Text style={paragraph}>
              <strong>Here&apos;s what happens next:</strong>
            </Text>

            <Section style={stepsContainer}>
              <Text style={stepItem}>
                <span style={stepNumber}>1</span>
                <strong>ASSESS</strong> – Classify your AI systems by risk level (10 min)
              </Text>
              <Text style={stepItem}>
                <span style={stepNumber}>2</span>
                <strong>DOCUMENT</strong> – Generate required compliance documentation
              </Text>
              <Text style={stepItem}>
                <span style={stepNumber}>3</span>
                <strong>CERTIFY</strong> – Track requirements and prove compliance
              </Text>
            </Section>

            <Text style={paragraph}>
              Your 14-day free trial includes full access to all features. Most teams achieve compliance-ready status within 2 weeks.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={dashboardUrl}>
                Go to Your Dashboard
              </Button>
            </Section>

            <Text style={subheading}>What&apos;s waiting for you:</Text>

            <Text style={featureItem}>
              <strong>• Risk Classification Engine</strong> – Know your compliance obligations in 10 minutes
            </Text>
            <Text style={featureItem}>
              <strong>• AI-Powered Document Generation</strong> – Stop starting from scratch
            </Text>
            <Text style={featureItem}>
              <strong>• Requirement Tracking</strong> – Never miss a compliance deadline
            </Text>
            <Text style={featureItem}>
              <strong>• Certification Badge</strong> – Show customers you&apos;re compliant
            </Text>

            <Text style={signoff}>
              Questions? Just reply to this email – a real human will respond.
              <br />
              <br />
              – The Protectron Team
            </Text>

            <Text style={psText}>
              P.S. The August 2026 enforcement deadline is approaching. Companies achieving compliance early are winning enterprise deals now.
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
  margin: "0 0 16px",
  lineHeight: "1.3",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#4a4a4a",
  margin: "0 0 16px",
};

const stepsContainer = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "16px 0 24px",
};

const stepItem = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#4a4a4a",
  margin: "0 0 8px",
};

const stepNumber = {
  display: "inline-block",
  width: "24px",
  height: "24px",
  backgroundColor: "#7c3aed",
  color: "#ffffff",
  borderRadius: "50%",
  textAlign: "center" as const,
  fontSize: "14px",
  fontWeight: "600",
  lineHeight: "24px",
  marginRight: "12px",
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

const subheading = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#111827",
  margin: "24px 0 12px",
};

const featureItem = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#4a4a4a",
  margin: "0 0 8px",
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
  padding: "16px",
  backgroundColor: "#fef3c7",
  borderRadius: "8px",
  borderLeft: "4px solid #f59e0b",
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

export default WelcomeEmail;
