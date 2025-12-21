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

interface TeamInviteEmailProps {
  inviteUrl: string;
  inviterName: string;
  organizationName: string;
  recipientEmail: string;
  role: string;
}

export const TeamInviteEmail = ({
  inviteUrl,
  inviterName,
  organizationName,
  recipientEmail,
  role,
}: TeamInviteEmailProps) => {
  const previewText = `${inviterName} invited you to join ${organizationName} on Protectron`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={header}>
            <Img
              src="https://protectron.ai/logo.png"
              width="40"
              height="40"
              alt="Protectron"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={greeting}>Hi there,</Text>
            
            <Text style={paragraph}>
              Great news! <strong>{inviterName}</strong> has invited you to join{" "}
              <strong>{organizationName}</strong> on Protectron as a <strong>{role}</strong>.
            </Text>

            <Text style={paragraph}>
              You&apos;re about to become part of a team that&apos;s taking AI compliance seriously. 
              Together, you&apos;ll be building trust, ensuring transparency, and staying ahead of 
              EU AI Act requirements. We&apos;re excited to have you on board!
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={inviteUrl}>
                Accept the invite
              </Button>
            </Section>

            <Text style={signoff}>
              Thanks,
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
              <Link href="https://protectron.ai" style={footerLink}>
                Website
              </Link>
              {" • "}
              <Link href="https://protectron.ai/docs" style={footerLink}>
                Documentation
              </Link>
              {" • "}
              <Link href="https://protectron.ai/support" style={footerLink}>
                Support
              </Link>
            </Text>
            <Text style={emailNotice}>
              This email was sent to <Link href={`mailto:${recipientEmail}`} style={footerLink}>{recipientEmail}</Link>
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

const greeting = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#6b7280",
  margin: "0 0 16px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#4a4a4a",
  margin: "0 0 16px",
};

const buttonContainer = {
  margin: "24px 0",
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

export default TeamInviteEmail;
