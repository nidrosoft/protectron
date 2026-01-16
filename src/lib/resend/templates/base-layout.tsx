import {
  Body,
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

interface BaseLayoutProps {
  previewText: string;
  children: React.ReactNode;
  recipientEmail: string;
  unsubscribeUrl?: string;
}

export function BaseLayout({
  previewText,
  children,
  recipientEmail,
  unsubscribeUrl,
}: BaseLayoutProps) {
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

          {/* Content */}
          <Section style={content}>{children}</Section>

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
              <Link href={`mailto:${recipientEmail}`} style={footerLink}>
                {recipientEmail}
              </Link>
            </Text>
            {unsubscribeUrl && (
              <Text style={unsubscribeText}>
                <Link href={unsubscribeUrl} style={footerLink}>
                  Unsubscribe
                </Link>{" "}
                from these emails
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

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

const unsubscribeText = {
  fontSize: "11px",
  color: "#9ca3af",
  margin: "12px 0 0",
};

export default BaseLayout;
