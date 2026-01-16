import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_EMAIL = "Protectron Team <hello@protectron.ai>";
const APP_URL = Deno.env.get("APP_URL") || "https://protectron.ai";
const LOGO_URL = `${APP_URL}/assets/images/logo-light.png`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Onboarding email types
type OnboardingEmailType =
  | "welcome"
  | "first-win"
  | "document-power"
  | "social-proof"
  | "progress-review"
  | "certification-badge"
  | "upgrade-prompt"
  | "third-system-blocked"
  | "deadline-awareness"
  | "risk-deep-dive"
  | "monthly-summary"
  | "no-login"
  | "abandoned-assessment"
  | "first-system"
  | "document-generated"
  | "re-engagement"
  | "milestone-celebration"
  | "weekly-digest";

interface EmailQueueItem {
  id: string;
  user_id: string;
  organization_id: string;
  email_type: OnboardingEmailType;
  scheduled_for: string;
  status: string;
  payload: Record<string, any>;
}

interface UserData {
  email: string;
  full_name: string;
  organization_name?: string;
  ai_systems_count: number;
  documents_count: number;
  requirements_completed: number;
  compliance_percentage: number;
}

// Base email template wrapper
function wrapEmailTemplate(content: string, recipientEmail: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 40px 0; background-color: #f6f9fc; font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Ubuntu, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center">
        <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <!-- Header with Text Logo -->
          <tr>
            <td style="padding: 32px 40px 0; text-align: center;">
              <h1 style="font-family: 'Roboto', sans-serif; font-size: 28px; font-weight: 700; color: #7c3aed; margin: 0; letter-spacing: -0.5px;">Protectron</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 24px 40px 32px;">
              ${content}
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0;">
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; text-align: center;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0 0 12px; line-height: 1.5;">
                Protectron Inc.<br>
                San Diego, California
              </p>
              <p style="font-size: 12px; color: #9ca3af; margin: 0 0 12px;">
                <a href="https://protectron.ai" style="color: #6b7280; text-decoration: underline;">Website</a>
                &bull;
                <a href="https://protectron.ai/docs" style="color: #6b7280; text-decoration: underline;">Documentation</a>
                &bull;
                <a href="https://protectron.ai/support" style="color: #6b7280; text-decoration: underline;">Support</a>
              </p>
              <p style="font-size: 11px; color: #9ca3af; margin: 0;">
                This email was sent to <a href="mailto:${recipientEmail}" style="color: #6b7280; text-decoration: underline;">${recipientEmail}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// Generate email content based on type
function generateOnboardingEmail(
  emailType: OnboardingEmailType,
  userData: UserData,
  payload: Record<string, any>
): { subject: string; html: string } {
  const userName = userData.full_name || "there";
  let content = "";
  let subject = "";

  switch (emailType) {
    case "welcome": {
      subject = `Welcome to Protectron, ${userName}! Let's get you compliant 🛡️`;
      content = `
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 16px; line-height: 1.3;">
          Welcome to Protectron, ${userName}! 🎉
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          You're one step closer to EU AI Act compliance.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          <strong>Here's what happens next:</strong>
        </p>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px 20px; margin: 16px 0 24px;">
          <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">
            <span style="display: inline-block; width: 24px; height: 24px; background-color: #7c3aed; color: #ffffff; border-radius: 50%; text-align: center; font-size: 14px; font-weight: 600; line-height: 24px; margin-right: 12px;">1</span>
            <strong>ASSESS</strong> – Classify your AI systems by risk level (10 min)
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">
            <span style="display: inline-block; width: 24px; height: 24px; background-color: #7c3aed; color: #ffffff; border-radius: 50%; text-align: center; font-size: 14px; font-weight: 600; line-height: 24px; margin-right: 12px;">2</span>
            <strong>DOCUMENT</strong> – Generate required compliance documentation
          </p>
          <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0;">
            <span style="display: inline-block; width: 24px; height: 24px; background-color: #7c3aed; color: #ffffff; border-radius: 50%; text-align: center; font-size: 14px; font-weight: 600; line-height: 24px; margin-right: 12px;">3</span>
            <strong>CERTIFY</strong> – Track requirements and prove compliance
          </p>
        </div>
        <div style="background-color: #d1fae5; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid #10b981;">
          <p style="font-size: 15px; color: #065f46; margin: 0;"><strong>Your free plan includes 2 AI systems</strong> – enough to get started with compliance for your core products.</p>
        </div>
        <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;">
          <tr>
            <td>
              <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Go to Your Dashboard</a>
            </td>
          </tr>
        </table>
        <p style="font-size: 16px; font-weight: 600; color: #111827; margin: 24px 0 12px;">What's waiting for you:</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;"><strong>• Risk Classification Engine</strong> – Know your compliance obligations in 10 minutes</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;"><strong>• AI-Powered Document Generation</strong> – Stop starting from scratch</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;"><strong>• Requirement Tracking</strong> – Never miss a compliance deadline</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;"><strong>• Certification Badge</strong> – Show customers you're compliant</p>
        <p style="font-size: 16px; line-height: 1.6; color: #6b7280; margin: 24px 0 0;">
          Questions? Just reply to this email – a real human will respond.
          <br><br>
          – The Protectron Team
        </p>
        <div style="font-size: 14px; line-height: 1.6; color: #6b7280; font-style: italic; margin: 24px 0 0; padding: 16px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
          P.S. The August 2026 enforcement deadline is approaching. Companies achieving compliance early are winning enterprise deals now.
        </div>
      `;
      break;
    }

    case "first-win": {
      subject = "Your first 10 minutes could save months of compliance work";
      content = `
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px; line-height: 1.3;">
          Your first 10 minutes could save months
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          Hi ${userName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          Quick question: Do you know which EU AI Act requirements apply to your AI systems?
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          <strong>Most companies don't.</strong> And that uncertainty can stall enterprise deals, delay product launches, and create legal risk.
        </p>
        <div style="font-size: 16px; line-height: 1.6; color: #065f46; background-color: #d1fae5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <strong>Here's the good news:</strong> You can find out in 10 minutes.
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          Our Risk Classification Engine asks you a few simple questions:
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 4px; padding-left: 8px;">• What does it do?</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 4px; padding-left: 8px;">• Who uses it?</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px; padding-left: 8px;">• What decisions does it influence?</p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">Then it tells you:</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">✅ Your risk level (Prohibited, High-Risk, Limited, or Minimal)</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">✅ Which EU AI Act articles apply to you</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">✅ Exactly what you need to do next</p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          <strong>No legal expertise required. No consultants. Just clarity.</strong>
        </p>
        <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;">
          <tr>
            <td>
              <a href="${APP_URL}/assessment" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Classify Your First AI System</a>
            </td>
          </tr>
        </table>
        <p style="font-size: 16px; line-height: 1.6; color: #6b7280; margin: 24px 0 0;">
          Best,<br>The Protectron Team
        </p>
        <div style="font-size: 14px; line-height: 1.6; color: #6b7280; font-style: italic; margin: 24px 0 0; padding: 12px 16px; background-color: #f3f4f6; border-radius: 8px;">
          P.S. High-risk AI systems have 113 requirements to track. Low-risk? Much simpler. Find out which camp you're in.
        </div>
      `;
      break;
    }

    case "document-power": {
      subject = "Stop writing compliance docs from scratch";
      content = `
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px; line-height: 1.3;">
          Stop writing compliance docs from scratch
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          Hi ${userName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          We just generated 40 pages of documentation in 2 minutes. Here's how.
        </p>
        <div style="margin: 24px 0;">
          <div style="background-color: #fef2f2; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
            <p style="font-size: 14px; font-weight: 600; color: #6b7280; margin: 0 0 4px;">❌ The Old Way</p>
            <p style="font-size: 20px; font-weight: 700; color: #dc2626; margin: 0 0 4px;">Weeks of work</p>
            <p style="font-size: 14px; color: #6b7280; margin: 0;">Hiring consultants, researching requirements, writing from scratch</p>
          </div>
          <div style="background-color: #ecfdf5; border-radius: 8px; padding: 16px; border: 2px solid #10b981;">
            <p style="font-size: 14px; font-weight: 600; color: #6b7280; margin: 0 0 4px;">✅ With Protectron</p>
            <p style="font-size: 20px; font-weight: 700; color: #059669; margin: 0 0 4px;">5 minutes</p>
            <p style="font-size: 14px; color: #6b7280; margin: 0;">AI-powered generation, EU AI Act compliant, ready to customize</p>
          </div>
        </div>
        <p style="font-size: 16px; font-weight: 600; color: #111827; margin: 24px 0 12px;">Documents Protectron generates:</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">📄 <strong>Technical Documentation</strong> (Article 11)</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">📄 <strong>Risk Assessment Reports</strong> (Article 9)</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">📄 <strong>Data Governance Policies</strong> (Article 10)</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">📄 <strong>Human Oversight Procedures</strong> (Article 14)</p>
        <p style="font-size: 14px; line-height: 1.6; color: #7c3aed; font-weight: 600; margin: 8px 0 0;">+ 20 more document types</p>
        <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;">
          <tr>
            <td>
              <a href="${APP_URL}/dashboard/documents" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Generate Your First Document</a>
            </td>
          </tr>
        </table>
        <div style="font-size: 15px; line-height: 1.6; color: #4a4a4a; background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          💡 <strong>Companies save 40+ hours per AI system</strong> by using Protectron's document generator instead of starting from scratch.
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #6b7280; margin: 24px 0 0;">
          Best,<br>The Protectron Team
        </p>
      `;
      break;
    }

    case "social-proof": {
      subject = "How TalentFlow AI closed €2.1M in enterprise deals";
      content = `
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px; line-height: 1.3;">
          From stalled deals to signed contracts
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          Hi ${userName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          When enterprise prospects asked TalentFlow AI "Are you EU AI Act compliant?" – they didn't have an answer.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          Deals stalled. Competitors moved in. Revenue was left on the table.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          <strong>Then they found Protectron.</strong>
        </p>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 24px 0; border-left: 4px solid #7c3aed;">
          <p style="font-size: 28px; font-weight: 700; color: #7c3aed; margin: 0 0 4px;">€2.1M</p>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 16px;">in enterprise deals closed</p>
          <p style="font-size: 28px; font-weight: 700; color: #7c3aed; margin: 0 0 4px;">2 weeks</p>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 16px;">to compliance-ready</p>
          <p style="font-size: 28px; font-weight: 700; color: #7c3aed; margin: 0 0 4px;">50+ hours</p>
          <p style="font-size: 14px; color: #6b7280; margin: 0;">saved on documentation</p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; font-style: italic; margin: 0 0 16px;">
          "Protectron turned compliance from a blocker into a competitive advantage. Now when prospects ask about EU AI Act compliance, we show them our certification badge."
        </p>
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px;">
          – Sarah Chen, CEO, TalentFlow AI
        </p>
        <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;">
          <tr>
            <td>
              <a href="${APP_URL}/case-studies" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">See How They Did It</a>
            </td>
          </tr>
        </table>
        <p style="font-size: 16px; line-height: 1.6; color: #6b7280; margin: 24px 0 0;">
          Best,<br>The Protectron Team
        </p>
      `;
      break;
    }

    case "progress-review": {
      const systemsCount = userData.ai_systems_count || 0;
      const docsCount = userData.documents_count || 0;
      const reqsCount = userData.requirements_completed || 0;
      
      subject = `${userName}, here's your compliance snapshot`;
      content = `
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px; line-height: 1.3;">
          Your Protectron Progress
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          Hi ${userName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 24px;">
          Here's what you've accomplished in your first week:
        </p>
        <div style="display: flex; gap: 12px; margin: 16px 0;">
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; text-align: center; flex: 1;">
            <p style="font-size: 28px; font-weight: 700; color: #7c3aed; margin: 0 0 4px;">${systemsCount}</p>
            <p style="font-size: 12px; color: #6b7280; margin: 0;">AI systems</p>
          </div>
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; text-align: center; flex: 1;">
            <p style="font-size: 28px; font-weight: 700; color: #7c3aed; margin: 0 0 4px;">${docsCount}</p>
            <p style="font-size: 12px; color: #6b7280; margin: 0;">documents</p>
          </div>
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; text-align: center; flex: 1;">
            <p style="font-size: 28px; font-weight: 700; color: #7c3aed; margin: 0 0 4px;">${reqsCount}</p>
            <p style="font-size: 12px; color: #6b7280; margin: 0;">requirements</p>
          </div>
        </div>
        ${systemsCount === 0 ? `
        <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin: 24px 0; border-left: 4px solid #f59e0b;">
          <p style="font-size: 15px; color: #92400e; margin: 0;">
            <strong>Haven't started yet?</strong> No worries – you have 2 free AI systems to get started. Let's set up your first one!
          </p>
        </div>
        ` : `
        <div style="background-color: #d1fae5; border-radius: 8px; padding: 16px; margin: 24px 0; border-left: 4px solid #10b981;">
          <p style="font-size: 15px; color: #065f46; margin: 0;">
            <strong>Great progress!</strong> You're on track to achieve compliance-ready status.
          </p>
        </div>
        `}
        <p style="font-size: 16px; font-weight: 600; color: #111827; margin: 24px 0 12px;">Features you haven't tried yet:</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">🔧 <strong>SDK Integration</strong> – Automatic audit trails for your AI agents</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">📑 <strong>Evidence Management</strong> – Upload and organize compliance proof</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">🏆 <strong>Certification Badge</strong> – Show customers you're compliant</p>
        <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;">
          <tr>
            <td>
              <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Continue Your Journey</a>
            </td>
          </tr>
        </table>
        <p style="font-size: 14px; color: #6b7280; text-align: center; margin: 16px 0;">
          📊 You're using ${systemsCount} of 2 free AI systems
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #6b7280; margin: 24px 0 0;">
          Best,<br>The Protectron Team
        </p>
      `;
      break;
    }

    case "upgrade-prompt": {
      const systemsCount = userData.ai_systems_count || 0;
      
      subject = "You've used both free AI systems – ready to scale?";
      content = `
        <p style="font-size: 12px; font-weight: 700; color: #7c3aed; background-color: #f5f3ff; padding: 6px 12px; border-radius: 4px; display: inline-block; margin: 0 0 16px;">🚀 READY TO SCALE?</p>
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px; line-height: 1.3;">
          You've used both free AI systems
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          Hi ${userName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          Great progress! You've added ${systemsCount} AI systems to Protectron – the maximum on the free plan.
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          Need to add more AI systems? Upgrade to unlock:
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">✅ <strong>3+ AI systems</strong> – Scale your compliance</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">✅ <strong>Priority support</strong> – Get help when you need it</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">✅ <strong>Advanced features</strong> – SDK integration, team collaboration</p>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Starting at</p>
          <p style="font-size: 32px; font-weight: 700; color: #7c3aed; margin: 0;">€99<span style="font-size: 16px; color: #6b7280;">/month</span></p>
        </div>
        <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;">
          <tr>
            <td>
              <a href="${APP_URL}/pricing" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Upgrade Now</a>
            </td>
          </tr>
        </table>
        <p style="font-size: 16px; line-height: 1.6; color: #6b7280; margin: 24px 0 0;">
          Best,<br>The Protectron Team
        </p>
      `;
      break;
    }

    case "third-system-blocked": {
      subject = "Unlock more AI systems";
      content = `
        <p style="font-size: 12px; font-weight: 700; color: #f59e0b; background-color: #fef3c7; padding: 6px 12px; border-radius: 4px; display: inline-block; margin: 0 0 16px;">⚡ ACTION NEEDED</p>
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px; line-height: 1.3;">
          You tried to add a 3rd AI system
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          Hi ${userName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          We noticed you tried to add another AI system, but you've reached the limit of 2 free systems.
        </p>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 12px;">Upgrade to add more AI systems:</p>
          <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">🔹 <strong>Starter (€99/mo)</strong> – Up to 3 AI systems</p>
          <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">🔹 <strong>Growth (€299/mo)</strong> – Up to 10 AI systems</p>
          <p style="font-size: 15px; color: #4a4a4a; margin: 0;">🔹 <strong>Scale (€599/mo)</strong> – Up to 25 AI systems</p>
        </div>
        <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;">
          <tr>
            <td>
              <a href="${APP_URL}/pricing" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">View Plans</a>
            </td>
          </tr>
          <tr>
            <td style="padding-top: 12px;">
              <a href="${APP_URL}/demo" style="display: inline-block; background-color: transparent; border: 2px solid #7c3aed; color: #7c3aed; font-size: 16px; font-weight: 600; text-decoration: none; padding: 12px 22px; border-radius: 8px;">Talk to Sales</a>
            </td>
          </tr>
        </table>
        <p style="font-size: 16px; line-height: 1.6; color: #6b7280; margin: 24px 0 0;">
          Best,<br>The Protectron Team
        </p>
      `;
      break;
    }

    case "no-login": {
      subject = "Your compliance dashboard is ready";
      content = `
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px; line-height: 1.3;">
          Your dashboard is waiting for you
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          Hi ${userName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          We noticed you haven't logged in yet. Your Protectron dashboard is ready and waiting!
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          <strong>In just 10 minutes, you can:</strong>
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">✅ Classify your first AI system by risk level</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">✅ See exactly which EU AI Act articles apply to you</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">✅ Get a clear compliance roadmap</p>
        <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;">
          <tr>
            <td>
              <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Go to Dashboard</a>
            </td>
          </tr>
        </table>
        <p style="font-size: 16px; line-height: 1.6; color: #6b7280; margin: 24px 0 0;">
          Best,<br>The Protectron Team
        </p>
      `;
      break;
    }

    case "abandoned-assessment": {
      subject = "Finish your AI risk assessment";
      content = `
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px; line-height: 1.3;">
          You're almost there!
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          Hi ${userName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          We noticed you started a risk assessment but didn't finish. No worries – your progress is saved!
        </p>
        <div style="background-color: #f5f3ff; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid #7c3aed;">
          <p style="font-size: 15px; color: #5b21b6; margin: 0;">
            <strong>Just a few more questions</strong> and you'll know exactly which EU AI Act requirements apply to your system.
          </p>
        </div>
        <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;">
          <tr>
            <td>
              <a href="${APP_URL}/assessment" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Continue Assessment</a>
            </td>
          </tr>
        </table>
        <p style="font-size: 16px; line-height: 1.6; color: #6b7280; margin: 24px 0 0;">
          Best,<br>The Protectron Team
        </p>
      `;
      break;
    }

    case "first-system": {
      const systemName = payload.system_name || "your AI system";
      subject = "🎉 Great start! Your first AI system is set up";
      content = `
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 48px;">🎉</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px; line-height: 1.3; text-align: center;">
          Congratulations, ${userName}!
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px; text-align: center;">
          You've added your first AI system: <strong>${systemName}</strong>
        </p>
        <div style="background-color: #d1fae5; border-radius: 8px; padding: 16px; margin: 24px 0; border-left: 4px solid #10b981;">
          <p style="font-size: 15px; color: #065f46; margin: 0;">
            <strong>You're on your way!</strong> Most users generate their first compliance document within 24 hours.
          </p>
        </div>
        <p style="font-size: 16px; font-weight: 600; color: #111827; margin: 24px 0 12px;">Next steps:</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">1️⃣ Generate your first compliance document</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 8px;">2️⃣ Review your requirements checklist</p>
        <p style="font-size: 15px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">3️⃣ Upload evidence to track progress</p>
        <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;">
          <tr>
            <td>
              <a href="${APP_URL}/dashboard/documents" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Generate Your First Document</a>
            </td>
          </tr>
        </table>
        <p style="font-size: 16px; line-height: 1.6; color: #6b7280; margin: 24px 0 0;">
          Keep up the great work!<br>– The Protectron Team
        </p>
      `;
      break;
    }

    case "document-generated": {
      const docType = payload.document_type || "compliance document";
      subject = "📄 Your first document is ready!";
      content = `
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 48px;">📄</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px; line-height: 1.3; text-align: center;">
          Your document is ready!
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          Hi ${userName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          You just generated your first <strong>${docType}</strong>. This is a huge step toward EU AI Act compliance!
        </p>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;"><strong>What you can do with your document:</strong></p>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">✅ Download as DOCX or PDF</p>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">✅ Edit and customize the content</p>
          <p style="font-size: 14px; color: #6b7280; margin: 0;">✅ Attach as evidence to requirements</p>
        </div>
        <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;">
          <tr>
            <td>
              <a href="${APP_URL}/dashboard/documents" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">View Your Documents</a>
            </td>
          </tr>
        </table>
        <p style="font-size: 16px; line-height: 1.6; color: #6b7280; margin: 24px 0 0;">
          Best,<br>The Protectron Team
        </p>
      `;
      break;
    }

    case "re-engagement": {
      const systemsCount = userData.ai_systems_count || 0;
      const docsCount = userData.documents_count || 0;
      subject = "We miss you! Your compliance journey awaits";
      content = `
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px; line-height: 1.3;">
          It's been a while, ${userName}
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          We noticed you haven't logged in recently. Your compliance progress is waiting for you!
        </p>
        ${systemsCount > 0 || docsCount > 0 ? `
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;"><strong>Your progress so far:</strong></p>
          <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">📊 ${systemsCount} AI system${systemsCount !== 1 ? 's' : ''} added</p>
          <p style="font-size: 14px; color: #6b7280; margin: 0;">📄 ${docsCount} document${docsCount !== 1 ? 's' : ''} generated</p>
        </div>
        ` : ''}
        <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin: 24px 0; border-left: 4px solid #f59e0b;">
          <p style="font-size: 15px; color: #92400e; margin: 0;">
            <strong>Remember:</strong> The EU AI Act enforcement deadline is August 2026. Companies achieving compliance early are winning enterprise deals now.
          </p>
        </div>
        <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;">
          <tr>
            <td>
              <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Continue Your Journey</a>
            </td>
          </tr>
        </table>
        <p style="font-size: 16px; line-height: 1.6; color: #6b7280; margin: 24px 0 0;">
          Best,<br>The Protectron Team
        </p>
      `;
      break;
    }

    case "milestone-celebration": {
      const milestone = payload.milestone || "25%";
      const percentage = payload.compliance_percentage || 25;
      const emoji = percentage === 100 ? "🏆" : percentage >= 75 ? "🌟" : percentage >= 50 ? "🚀" : "🎯";
      subject = `${emoji} You've reached ${milestone} compliance!`;
      content = `
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 64px;">${emoji}</span>
        </div>
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px; line-height: 1.3; text-align: center;">
          ${percentage === 100 ? "You did it!" : "Amazing progress!"}
        </h1>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px; text-align: center;">
          ${userName}, you've reached <strong>${milestone}</strong> compliance!
        </p>
        <div style="background-color: #d1fae5; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
          <p style="font-size: 48px; font-weight: 700; color: #059669; margin: 0;">${milestone}</p>
          <p style="font-size: 14px; color: #065f46; margin: 8px 0 0;">Compliance Score</p>
        </div>
        ${percentage < 100 ? `
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px; text-align: center;">
          Keep going – you're on track to achieve full compliance!
        </p>
        ` : `
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px; text-align: center;">
          You've achieved full EU AI Act compliance. Time to show it off with your certification badge!
        </p>
        `}
        <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;">
          <tr>
            <td>
              <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">${percentage === 100 ? "Get Your Badge" : "View Dashboard"}</a>
            </td>
          </tr>
        </table>
        <p style="font-size: 16px; line-height: 1.6; color: #6b7280; margin: 24px 0 0;">
          Congratulations!<br>– The Protectron Team
        </p>
      `;
      break;
    }

    default: {
      subject = "Update from Protectron";
      content = `
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          Hi ${userName},
        </p>
        <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">
          You have a new update from Protectron.
        </p>
        <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;">
          <tr>
            <td>
              <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Go to Dashboard</a>
            </td>
          </tr>
        </table>
        <p style="font-size: 16px; line-height: 1.6; color: #6b7280; margin: 24px 0 0;">
          Best,<br>The Protectron Team
        </p>
      `;
    }
  }

  return { subject, html: wrapEmailTemplate(content, userData.email) };
}

async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", data);
      return { success: false, error: data.message || "Failed to send email" };
    }

    console.log("Email sent successfully:", data.id);
    return { success: true, id: data.id };
  } catch (err) {
    const error = err as Error;
    console.error("Error sending email:", error);
    return { success: false, error: error.message || "Unknown error" };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get pending emails that are due
    const { data: pendingEmails, error: fetchError } = await supabase
      .from("email_queue")
      .select("*")
      .eq("status", "pending")
      .lte("scheduled_for", new Date().toISOString())
      .order("scheduled_for", { ascending: true })
      .limit(50);

    if (fetchError) {
      console.error("Error fetching email queue:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch email queue" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!pendingEmails || pendingEmails.length === 0) {
      return new Response(
        JSON.stringify({ message: "No pending emails to process", processed: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${pendingEmails.length} pending emails`);

    let processed = 0;
    let failed = 0;
    let skipped = 0;

    for (const emailItem of pendingEmails as EmailQueueItem[]) {
      try {
        // Check if email should be skipped
        const { data: shouldSkip } = await supabase.rpc("should_skip_email", {
          p_user_id: emailItem.user_id,
          p_email_type: emailItem.email_type,
        });

        if (shouldSkip) {
          await supabase
            .from("email_queue")
            .update({ status: "skipped", updated_at: new Date().toISOString() })
            .eq("id", emailItem.id);
          skipped++;
          continue;
        }

        // Get user data
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select(`
            id,
            full_name,
            organization_id,
            organizations (name)
          `)
          .eq("id", emailItem.user_id)
          .single();

        if (userError || !userData) {
          console.error(`User not found for email ${emailItem.id}`);
          await supabase
            .from("email_queue")
            .update({ 
              status: "failed", 
              error_message: "User not found",
              updated_at: new Date().toISOString() 
            })
            .eq("id", emailItem.id);
          failed++;
          continue;
        }

        // Get user email from auth.users
        const { data: authUser } = await supabase.auth.admin.getUserById(emailItem.user_id);
        
        if (!authUser?.user?.email) {
          console.error(`Email not found for user ${emailItem.user_id}`);
          await supabase
            .from("email_queue")
            .update({ 
              status: "failed", 
              error_message: "User email not found",
              updated_at: new Date().toISOString() 
            })
            .eq("id", emailItem.id);
          failed++;
          continue;
        }

        // Get onboarding state for stats
        const { data: onboardingState } = await supabase
          .from("user_onboarding_state")
          .select("*")
          .eq("user_id", emailItem.user_id)
          .single();

        // Check notification preferences
        const { data: prefs } = await supabase
          .from("notification_preferences")
          .select("onboarding_emails")
          .eq("user_id", emailItem.user_id)
          .single();

        if (prefs && prefs.onboarding_emails === false) {
          await supabase
            .from("email_queue")
            .update({ status: "skipped", updated_at: new Date().toISOString() })
            .eq("id", emailItem.id);
          skipped++;
          continue;
        }

        // Build user data for email
        const userDataForEmail: UserData = {
          email: authUser.user.email,
          full_name: userData.full_name || emailItem.payload.user_name || "there",
          organization_name: (userData.organizations as any)?.name,
          ai_systems_count: onboardingState?.ai_systems_count || 0,
          documents_count: onboardingState?.documents_count || 0,
          requirements_completed: onboardingState?.requirements_completed || 0,
          compliance_percentage: onboardingState?.compliance_percentage || 0,
        };

        // Generate email content
        const { subject, html } = generateOnboardingEmail(
          emailItem.email_type,
          userDataForEmail,
          emailItem.payload
        );

        // Send the email
        const result = await sendEmail(authUser.user.email, subject, html);

        if (result.success) {
          // Update email queue
          await supabase
            .from("email_queue")
            .update({
              status: "sent",
              sent_at: new Date().toISOString(),
              resend_id: result.id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", emailItem.id);

          // Update onboarding state - get current emails_sent first
          const currentEmails = onboardingState?.emails_sent || [];
          await supabase
            .from("user_onboarding_state")
            .update({
              emails_sent: [...currentEmails, emailItem.email_type],
              last_email_sent_at: new Date().toISOString(),
              last_email_type: emailItem.email_type,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", emailItem.user_id);

          // Log to notification_log
          await supabase.from("notification_log").insert({
            user_id: emailItem.user_id,
            organization_id: emailItem.organization_id,
            notification_type: emailItem.email_type,
            subject,
            recipient_email: authUser.user.email,
            status: "sent",
            resend_id: result.id,
            metadata: emailItem.payload,
          });

          processed++;
        } else {
          await supabase
            .from("email_queue")
            .update({
              status: "failed",
              error_message: result.error,
              updated_at: new Date().toISOString(),
            })
            .eq("id", emailItem.id);
          failed++;
        }
      } catch (err) {
        const error = err as Error;
        console.error(`Error processing email ${emailItem.id}:`, error);
        await supabase
          .from("email_queue")
          .update({
            status: "failed",
            error_message: error.message || "Unknown error",
            updated_at: new Date().toISOString(),
          })
          .eq("id", emailItem.id);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({
        message: "Email queue processed",
        processed,
        failed,
        skipped,
        total: pendingEmails.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in process-email-queue function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
