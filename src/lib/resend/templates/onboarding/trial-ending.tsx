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

interface TrialEndingEmailProps {
  userName: string;
  userEmail: string;
  trialEndDate: string;
  systemsAdded?: number;
  documentsGenerated?: number;
  requirementsTracked?: number;
  pricingUrl?: string;
}

export const TrialEndingEmail = ({
  userName = "there",
  userEmail = "user@example.com",
  trialEndDate = "January 30, 2026",
  systemsAdded = 0,
  documentsGenerated = 0,
  requirementsTracked = 0,
  pricingUrl = `${APP_URL}/pricing`,
}: TrialEndingEmailProps) => {
  const previewText = "2 days left: Don't lose your compliance progress";

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
            <Text style={urgentBadge}>⏰ 2 DAYS LEFT</Text>

            <Text style={headline}>
              Don&apos;t lose your compliance progress
            </Text>

            <Text style={paragraph}>
              Hi {userName},
            </Text>

            <Text style={paragraph}>
              Your Protectron trial ends in 2 days ({trialEndDate}).
            </Text>

            <Text style={subheading}>Here&apos;s what you&apos;ve built so far:</Text>

            {/* Progress Stats */}
            <Section style={statsContainer}>
              <Section style={statBox}>
                <Text style={statValue}>{systemsAdded}</Text>
                <Text style={statLabel}>AI systems classified</Text>
              </Section>
              <Section style={statBox}>
                <Text style={statValue}>{documentsGenerated}</Text>
                <Text style={statLabel}>documents generated</Text>
              </Section>
              <Section style={statBox}>
                <Text style={statValue}>{requirementsTracked}</Text>
                <Text style={statLabel}>requirements tracked</Text>
              </Section>
            </Section>

            <Text style={paragraph}>
              That&apos;s real progress toward EU AI Act compliance.
            </Text>

            <Text style={subheading}>What happens when your trial ends?</Text>

            <Text style={listItem}>✓ Your data stays safe for 30 days</Text>
            <Text style={listItem}>✓ You can pick up where you left off anytime</Text>
            <Text style={listItemWarning}>⚠️ But compliance tracking, document generation, and badges will be paused</Text>

            <Text style={subheading}>Choose the plan that fits your team:</Text>

            {/* Pricing Table */}
            <Section style={pricingContainer}>
              <Section style={pricingBox}>
                <Text style={planName}>STARTER</Text>
                <Text style={planPrice}>€99<span style={planPeriod}>/mo</span></Text>
                <Text style={planFeature}>• 3 AI systems</Text>
                <Text style={planFeature}>• 10K events/mo</Text>
                <Text style={planFeature}>• Email support</Text>
              </Section>
              <Section style={pricingBoxPopular}>
                <Text style={popularBadge}>POPULAR</Text>
                <Text style={planName}>GROWTH</Text>
                <Text style={planPrice}>€299<span style={planPeriod}>/mo</span></Text>
                <Text style={planFeature}>• 10 AI systems</Text>
                <Text style={planFeature}>• 100K events/mo</Text>
                <Text style={planFeature}>• Priority support</Text>
              </Section>
              <Section style={pricingBox}>
                <Text style={planName}>SCALE</Text>
                <Text style={planPrice}>€599<span style={planPeriod}>/mo</span></Text>
                <Text style={planFeature}>• 25 AI systems</Text>
                <Text style={planFeature}>• 500K events/mo</Text>
                <Text style={planFeature}>• Dedicated support</Text>
              </Section>
            </Section>

            <Text style={allPlansInclude}>
              All plans include: Full requirement tracking, document generation, evidence management, certification badges, and email support.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={pricingUrl}>
                Choose Your Plan
              </Button>
            </Section>

            <Text style={paragraph}>
              Questions? Reply to this email or{" "}
              <Link href={`${APP_URL}/demo`} style={inlineLink}>
                book a call with our team
              </Link>
              .
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

const urgentBadge = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#dc2626",
  backgroundColor: "#fef2f2",
  padding: "6px 12px",
  borderRadius: "4px",
  display: "inline-block",
  margin: "0 0 16px",
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

const subheading = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#111827",
  margin: "24px 0 12px",
};

const statsContainer = {
  display: "flex",
  margin: "16px 0",
};

const statBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "16px",
  textAlign: "center" as const,
  marginRight: "12px",
  flex: "1",
};

const statValue = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#7c3aed",
  margin: "0 0 4px",
};

const statLabel = {
  fontSize: "12px",
  color: "#6b7280",
  margin: "0",
};

const listItem = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#4a4a4a",
  margin: "0 0 8px",
};

const listItemWarning = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#b45309",
  margin: "0 0 8px",
};

const pricingContainer = {
  display: "flex",
  margin: "16px 0",
  gap: "12px",
};

const pricingBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "16px",
  textAlign: "center" as const,
  flex: "1",
  border: "1px solid #e5e7eb",
};

const pricingBoxPopular = {
  backgroundColor: "#f5f3ff",
  borderRadius: "8px",
  padding: "16px",
  textAlign: "center" as const,
  flex: "1",
  border: "2px solid #7c3aed",
  position: "relative" as const,
};

const popularBadge = {
  fontSize: "10px",
  fontWeight: "700",
  color: "#ffffff",
  backgroundColor: "#7c3aed",
  padding: "2px 8px",
  borderRadius: "4px",
  position: "absolute" as const,
  top: "-10px",
  left: "50%",
  transform: "translateX(-50%)",
};

const planName = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#6b7280",
  margin: "0 0 8px",
  letterSpacing: "0.5px",
};

const planPrice = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#111827",
  margin: "0 0 12px",
};

const planPeriod = {
  fontSize: "14px",
  fontWeight: "400",
  color: "#6b7280",
};

const planFeature = {
  fontSize: "12px",
  color: "#4a4a4a",
  margin: "0 0 4px",
};

const allPlansInclude = {
  fontSize: "13px",
  color: "#6b7280",
  margin: "16px 0",
  textAlign: "center" as const,
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

const inlineLink = {
  color: "#7c3aed",
  textDecoration: "underline",
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

export default TrialEndingEmail;
