/**
 * Test script to send all onboarding emails to a test recipient
 * Run with: npx tsx scripts/test-emails.ts
 */

const RESEND_API_KEY = "re_4z4qdgZG_GnfU1rEXWNx9D86FbRTYt9Lr";
const FROM_EMAIL = "Protectron Team <hello@protectron.ai>";
const TEST_EMAIL = "zehcyriac@live.com";
const APP_URL = "https://protectron.ai";
const LOGO_URL = `${APP_URL}/assets/images/logo-light.png`;

interface EmailContent {
  type: string;
  subject: string;
  html: string;
}

function wrapEmailTemplate(content: string): string {
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
          <tr>
            <td style="padding: 32px 40px 0; text-align: center;">
              <h1 style="font-family: 'Roboto', sans-serif; font-size: 28px; font-weight: 700; color: #7c3aed; margin: 0; letter-spacing: -0.5px;">Protectron</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px 32px;">
              ${content}
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px;">
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0;">
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; text-align: center;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0 0 12px; line-height: 1.5;">
                Protectron Inc.<br>San Diego, California
              </p>
              <p style="font-size: 12px; color: #9ca3af; margin: 0 0 12px;">
                <a href="https://protectron.ai" style="color: #6b7280; text-decoration: underline;">Website</a>
                &bull;
                <a href="https://protectron.ai/docs" style="color: #6b7280; text-decoration: underline;">Documentation</a>
                &bull;
                <a href="https://protectron.ai/support" style="color: #6b7280; text-decoration: underline;">Support</a>
              </p>
              <p style="font-size: 11px; color: #9ca3af; margin: 0;">
                This is a test email sent to ${TEST_EMAIL}
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

const emails: EmailContent[] = [
  {
    type: "welcome",
    subject: "[TEST] Day 0: Welcome to Protectron! 🎉",
    html: wrapEmailTemplate(`
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 16px;">Welcome to Protectron! 🎉</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">You're one step closer to EU AI Act compliance.</p>
      <div style="background-color: #d1fae5; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid #10b981;">
        <p style="font-size: 15px; color: #065f46; margin: 0;"><strong>Your free plan includes 2 AI systems</strong> – enough to get started with compliance for your core products.</p>
      </div>
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px 20px; margin: 16px 0 24px;">
        <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;"><span style="display: inline-block; width: 24px; height: 24px; background-color: #7c3aed; color: #fff; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 12px;">1</span><strong>ASSESS</strong> – Classify AI systems by risk</p>
        <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;"><span style="display: inline-block; width: 24px; height: 24px; background-color: #7c3aed; color: #fff; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 12px;">2</span><strong>DOCUMENT</strong> – Generate compliance docs</p>
        <p style="font-size: 15px; color: #4a4a4a; margin: 0;"><span style="display: inline-block; width: 24px; height: 24px; background-color: #7c3aed; color: #fff; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 12px;">3</span><strong>CERTIFY</strong> – Track requirements</p>
      </div>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;"><tr><td>
        <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Go to Dashboard</a>
      </td></tr></table>
      <p style="font-size: 16px; color: #6b7280; margin: 24px 0 0;">– The Protectron Team</p>
    `),
  },
  {
    type: "first-win",
    subject: "[TEST] Day 1: Your first 10 minutes could save months",
    html: wrapEmailTemplate(`
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px;">Your first 10 minutes could save months</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">Do you know which EU AI Act requirements apply to your AI systems?</p>
      <div style="background-color: #d1fae5; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <strong style="color: #065f46;">Good news:</strong> <span style="color: #065f46;">Find out in 10 minutes with our Risk Classification Engine.</span>
      </div>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">✅ Your risk level (Prohibited, High-Risk, Limited, Minimal)</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">✅ Which EU AI Act articles apply</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 16px;">✅ Exactly what you need to do next</p>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;"><tr><td>
        <a href="${APP_URL}/assessment" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Classify Your First AI System</a>
      </td></tr></table>
      <p style="font-size: 16px; color: #6b7280; margin: 24px 0 0;">– The Protectron Team</p>
    `),
  },
  {
    type: "document-power",
    subject: "[TEST] Day 3: Stop writing compliance docs from scratch",
    html: wrapEmailTemplate(`
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px;">Stop writing compliance docs from scratch</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">We generated 40 pages of documentation in 2 minutes.</p>
      <div style="margin: 24px 0;">
        <div style="background-color: #fef2f2; border-radius: 8px; padding: 16px; margin-bottom: 12px;">
          <p style="font-size: 14px; font-weight: 600; color: #6b7280; margin: 0 0 4px;">❌ The Old Way</p>
          <p style="font-size: 20px; font-weight: 700; color: #dc2626; margin: 0;">Weeks of work</p>
        </div>
        <div style="background-color: #ecfdf5; border-radius: 8px; padding: 16px; border: 2px solid #10b981;">
          <p style="font-size: 14px; font-weight: 600; color: #6b7280; margin: 0 0 4px;">✅ With Protectron</p>
          <p style="font-size: 20px; font-weight: 700; color: #059669; margin: 0;">5 minutes</p>
        </div>
      </div>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">📄 Technical Documentation (Article 11)</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">📄 Risk Assessment Reports (Article 9)</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">📄 Data Governance Policies (Article 10)</p>
      <p style="font-size: 14px; color: #7c3aed; font-weight: 600; margin: 8px 0 0;">+ 20 more document types</p>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;"><tr><td>
        <a href="${APP_URL}/dashboard/documents" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Generate Your First Document</a>
      </td></tr></table>
    `),
  },
  {
    type: "social-proof",
    subject: "[TEST] Day 5: How TalentFlow AI closed €2.1M in deals",
    html: wrapEmailTemplate(`
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px;">From stalled deals to signed contracts</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">When prospects asked "Are you EU AI Act compliant?" – they didn't have an answer. Deals stalled.</p>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;"><strong>Then they found Protectron.</strong></p>
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 24px 0; border-left: 4px solid #7c3aed;">
        <p style="font-size: 28px; font-weight: 700; color: #7c3aed; margin: 0 0 4px;">€2.1M</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 16px;">in enterprise deals closed</p>
        <p style="font-size: 28px; font-weight: 700; color: #7c3aed; margin: 0 0 4px;">2 weeks</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">to compliance-ready</p>
      </div>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; font-style: italic; margin: 0 0 16px;">"Protectron turned compliance from a blocker into a competitive advantage."</p>
      <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px;">– Sarah Chen, CEO, TalentFlow AI</p>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;"><tr><td>
        <a href="${APP_URL}/case-studies" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">See How They Did It</a>
      </td></tr></table>
    `),
  },
  {
    type: "progress-review",
    subject: "[TEST] Day 7: Your compliance snapshot",
    html: wrapEmailTemplate(`
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px;">Your Protectron Progress</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 24px;">Here's what you've accomplished so far:</p>
      <table role="presentation" style="width: 100%; margin: 16px 0;">
        <tr>
          <td style="background-color: #f9fafb; border-radius: 8px; padding: 16px; text-align: center; width: 33%;">
            <p style="font-size: 28px; font-weight: 700; color: #7c3aed; margin: 0 0 4px;">2</p>
            <p style="font-size: 12px; color: #6b7280; margin: 0;">AI systems</p>
          </td>
          <td style="width: 12px;"></td>
          <td style="background-color: #f9fafb; border-radius: 8px; padding: 16px; text-align: center; width: 33%;">
            <p style="font-size: 28px; font-weight: 700; color: #7c3aed; margin: 0 0 4px;">5</p>
            <p style="font-size: 12px; color: #6b7280; margin: 0;">documents</p>
          </td>
          <td style="width: 12px;"></td>
          <td style="background-color: #f9fafb; border-radius: 8px; padding: 16px; text-align: center; width: 33%;">
            <p style="font-size: 28px; font-weight: 700; color: #7c3aed; margin: 0 0 4px;">12</p>
            <p style="font-size: 12px; color: #6b7280; margin: 0;">requirements</p>
          </td>
        </tr>
      </table>
      <div style="background-color: #d1fae5; border-radius: 8px; padding: 16px; margin: 24px 0; border-left: 4px solid #10b981;">
        <p style="font-size: 15px; color: #065f46; margin: 0;"><strong>Great progress!</strong> You're on track to achieve compliance-ready status.</p>
      </div>
      <p style="font-size: 14px; color: #6b7280; text-align: center; margin: 16px 0;">📊 You're using 2 of 2 free AI systems</p>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;"><tr><td>
        <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Continue Your Journey</a>
      </td></tr></table>
    `),
  },
  {
    type: "certification-badge",
    subject: "[TEST] Day 10: Unlock your EU AI Act certification badge",
    html: wrapEmailTemplate(`
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px;">Show the world you're compliant 🏆</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">Your Protectron Certification Badge is a public signal that you take AI compliance seriously.</p>
      <div style="background-color: #f5f3ff; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center; border: 2px solid #7c3aed;">
        <p style="font-size: 48px; margin: 0 0 8px;">🛡️</p>
        <p style="font-size: 18px; font-weight: 700; color: #7c3aed; margin: 0 0 4px;">EU AI Act Compliant</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">Verified by Protectron</p>
      </div>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">✅ Embed on your website</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">✅ Share in sales materials</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 16px;">✅ Build customer trust</p>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;"><tr><td>
        <a href="${APP_URL}/dashboard/certification" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Get Your Badge</a>
      </td></tr></table>
    `),
  },
  {
    type: "upgrade-prompt",
    subject: "[TEST] You've maxed out your free AI systems",
    html: wrapEmailTemplate(`
      <p style="font-size: 12px; font-weight: 700; color: #7c3aed; background-color: #f5f3ff; padding: 6px 12px; border-radius: 4px; display: inline-block; margin: 0 0 16px;">🚀 READY TO SCALE?</p>
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px;">You've used both free AI systems</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">Great progress! You've added 2 AI systems to Protectron – the maximum on the free plan.</p>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">Need to add more AI systems? Upgrade to unlock:</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">✅ <strong>3+ AI systems</strong> – Scale your compliance</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">✅ <strong>Priority support</strong> – Get help when you need it</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">✅ <strong>Advanced features</strong> – SDK integration, team collaboration</p>
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">Starting at</p>
        <p style="font-size: 32px; font-weight: 700; color: #7c3aed; margin: 0;">€99<span style="font-size: 16px; color: #6b7280;">/month</span></p>
      </div>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;"><tr><td>
        <a href="${APP_URL}/pricing" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Upgrade Now</a>
      </td></tr></table>
    `),
  },
  {
    type: "third-system-blocked",
    subject: "[TEST] Unlock more AI systems",
    html: wrapEmailTemplate(`
      <p style="font-size: 12px; font-weight: 700; color: #f59e0b; background-color: #fef3c7; padding: 6px 12px; border-radius: 4px; display: inline-block; margin: 0 0 16px;">⚡ ACTION NEEDED</p>
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px;">You tried to add a 3rd AI system</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">We noticed you tried to add another AI system, but you've reached the limit of 2 free systems.</p>
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 12px;">Upgrade to add unlimited AI systems:</p>
        <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">🔹 <strong>Starter (€99/mo)</strong> – Up to 3 AI systems</p>
        <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">🔹 <strong>Growth (€299/mo)</strong> – Up to 10 AI systems</p>
        <p style="font-size: 15px; color: #4a4a4a; margin: 0;">🔹 <strong>Scale (€599/mo)</strong> – Up to 25 AI systems</p>
      </div>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;">
        <tr><td><a href="${APP_URL}/pricing" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">View Plans</a></td></tr>
        <tr><td style="padding-top: 12px;"><a href="${APP_URL}/demo" style="display: inline-block; background-color: transparent; border: 2px solid #7c3aed; color: #7c3aed; font-size: 16px; font-weight: 600; text-decoration: none; padding: 12px 22px; border-radius: 8px;">Talk to Sales</a></td></tr>
      </table>
    `),
  },
  {
    type: "deadline-awareness",
    subject: "[TEST] Day 17: August 2026 is closer than you think",
    html: wrapEmailTemplate(`
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px;">The EU AI Act deadline is approaching ⏳</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">August 2026 enforcement is closer than you think. Companies that achieve compliance early are:</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">✅ Winning enterprise deals now</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">✅ Avoiding last-minute scrambles</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 16px;">✅ Building customer trust</p>
      <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin: 24px 0; border-left: 4px solid #f59e0b;">
        <p style="font-size: 15px; color: #92400e; margin: 0;"><strong>Don't wait.</strong> Fines can reach €35M or 7% of global revenue.</p>
      </div>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;"><tr><td>
        <a href="${APP_URL}/pricing" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Start Your Compliance Journey</a>
      </td></tr></table>
    `),
  },
  {
    type: "risk-deep-dive",
    subject: "[TEST] Day 21: Understanding your AI risk level",
    html: wrapEmailTemplate(`
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px;">Understanding AI Risk Levels 📊</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">The EU AI Act categorizes AI systems into four risk levels:</p>
      <div style="margin: 24px 0;">
        <div style="background-color: #fef2f2; border-radius: 8px; padding: 12px 16px; margin-bottom: 8px; border-left: 4px solid #dc2626;">
          <p style="font-size: 14px; font-weight: 600; color: #dc2626; margin: 0;">🚫 Prohibited</p>
          <p style="font-size: 13px; color: #6b7280; margin: 4px 0 0;">Social scoring, manipulation, real-time biometric ID</p>
        </div>
        <div style="background-color: #fef3c7; border-radius: 8px; padding: 12px 16px; margin-bottom: 8px; border-left: 4px solid #f59e0b;">
          <p style="font-size: 14px; font-weight: 600; color: #b45309; margin: 0;">⚠️ High-Risk</p>
          <p style="font-size: 13px; color: #6b7280; margin: 4px 0 0;">HR, credit scoring, law enforcement, education</p>
        </div>
        <div style="background-color: #dbeafe; border-radius: 8px; padding: 12px 16px; margin-bottom: 8px; border-left: 4px solid #3b82f6;">
          <p style="font-size: 14px; font-weight: 600; color: #1d4ed8; margin: 0;">ℹ️ Limited Risk</p>
          <p style="font-size: 13px; color: #6b7280; margin: 4px 0 0;">Chatbots, emotion recognition, deepfakes</p>
        </div>
        <div style="background-color: #d1fae5; border-radius: 8px; padding: 12px 16px; border-left: 4px solid #10b981;">
          <p style="font-size: 14px; font-weight: 600; color: #059669; margin: 0;">✅ Minimal Risk</p>
          <p style="font-size: 13px; color: #6b7280; margin: 4px 0 0;">Spam filters, games, inventory management</p>
        </div>
      </div>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;"><tr><td>
        <a href="${APP_URL}/assessment" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Classify Your AI Systems</a>
      </td></tr></table>
    `),
  },
  {
    type: "no-login",
    subject: "[TEST] Behavioral: Your dashboard is ready",
    html: wrapEmailTemplate(`
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px;">Your dashboard is waiting for you</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">We noticed you haven't logged in yet. Your Protectron dashboard is ready and waiting!</p>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;"><strong>In just 10 minutes, you can:</strong></p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">✅ Classify your first AI system by risk level</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">✅ See exactly which EU AI Act articles apply to you</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 16px;">✅ Get a clear compliance roadmap</p>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;"><tr><td>
        <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Go to Dashboard</a>
      </td></tr></table>
    `),
  },
  {
    type: "abandoned-assessment",
    subject: "[TEST] Behavioral: Finish your assessment",
    html: wrapEmailTemplate(`
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px;">You're almost there!</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">We noticed you started a risk assessment but didn't finish. No worries – your progress is saved!</p>
      <div style="background-color: #f5f3ff; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 4px solid #7c3aed;">
        <p style="font-size: 15px; color: #5b21b6; margin: 0;"><strong>Just a few more questions</strong> and you'll know exactly which EU AI Act requirements apply to your system.</p>
      </div>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;"><tr><td>
        <a href="${APP_URL}/assessment" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Continue Assessment</a>
      </td></tr></table>
    `),
  },
  {
    type: "first-system",
    subject: "[TEST] Behavioral: 🎉 Your first AI system is set up!",
    html: wrapEmailTemplate(`
      <div style="text-align: center; margin-bottom: 24px;"><span style="font-size: 48px;">🎉</span></div>
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px; text-align: center;">Congratulations!</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px; text-align: center;">You've added your first AI system: <strong>Customer Support Bot</strong></p>
      <div style="background-color: #d1fae5; border-radius: 8px; padding: 16px; margin: 24px 0; border-left: 4px solid #10b981;">
        <p style="font-size: 15px; color: #065f46; margin: 0;"><strong>You're on your way!</strong> Most users generate their first compliance document within 24 hours.</p>
      </div>
      <p style="font-size: 16px; font-weight: 600; color: #111827; margin: 24px 0 12px;">Next steps:</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">1️⃣ Generate your first compliance document</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">2️⃣ Review your requirements checklist</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 16px;">3️⃣ Upload evidence to track progress</p>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;"><tr><td>
        <a href="${APP_URL}/dashboard/documents" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Generate Your First Document</a>
      </td></tr></table>
    `),
  },
  {
    type: "document-generated",
    subject: "[TEST] Behavioral: 📄 Your first document is ready!",
    html: wrapEmailTemplate(`
      <div style="text-align: center; margin-bottom: 24px;"><span style="font-size: 48px;">📄</span></div>
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px; text-align: center;">Your document is ready!</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">You just generated your first <strong>Technical Documentation</strong>. This is a huge step toward EU AI Act compliance!</p>
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;"><strong>What you can do with your document:</strong></p>
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">✅ Download as DOCX or PDF</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">✅ Edit and customize the content</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">✅ Attach as evidence to requirements</p>
      </div>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;"><tr><td>
        <a href="${APP_URL}/dashboard/documents" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">View Your Documents</a>
      </td></tr></table>
    `),
  },
  {
    type: "re-engagement",
    subject: "[TEST] Behavioral: We miss you!",
    html: wrapEmailTemplate(`
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px;">It's been a while</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">We noticed you haven't logged in recently. Your compliance progress is waiting for you!</p>
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;"><strong>Your progress so far:</strong></p>
        <p style="font-size: 14px; color: #6b7280; margin: 0 0 4px;">📊 2 AI systems added</p>
        <p style="font-size: 14px; color: #6b7280; margin: 0;">📄 3 documents generated</p>
      </div>
      <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin: 24px 0; border-left: 4px solid #f59e0b;">
        <p style="font-size: 15px; color: #92400e; margin: 0;"><strong>Remember:</strong> The EU AI Act enforcement deadline is August 2026.</p>
      </div>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;"><tr><td>
        <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Continue Your Journey</a>
      </td></tr></table>
    `),
  },
  {
    type: "milestone-50",
    subject: "[TEST] Behavioral: 🚀 You've reached 50% compliance!",
    html: wrapEmailTemplate(`
      <div style="text-align: center; margin-bottom: 24px;"><span style="font-size: 64px;">🚀</span></div>
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px; text-align: center;">Amazing progress!</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px; text-align: center;">You've reached <strong>50%</strong> compliance!</p>
      <div style="background-color: #d1fae5; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
        <p style="font-size: 48px; font-weight: 700; color: #059669; margin: 0;">50%</p>
        <p style="font-size: 14px; color: #065f46; margin: 8px 0 0;">Compliance Score</p>
      </div>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px; text-align: center;">Keep going – you're on track to achieve full compliance!</p>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;"><tr><td>
        <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">View Dashboard</a>
      </td></tr></table>
    `),
  },
  {
    type: "milestone-100",
    subject: "[TEST] Behavioral: 🏆 You did it! 100% compliance!",
    html: wrapEmailTemplate(`
      <div style="text-align: center; margin-bottom: 24px;"><span style="font-size: 64px;">🏆</span></div>
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px; text-align: center;">You did it!</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px; text-align: center;">You've achieved <strong>100%</strong> EU AI Act compliance!</p>
      <div style="background-color: #d1fae5; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
        <p style="font-size: 48px; font-weight: 700; color: #059669; margin: 0;">100%</p>
        <p style="font-size: 14px; color: #065f46; margin: 8px 0 0;">Compliance Score</p>
      </div>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px; text-align: center;">Time to show it off with your certification badge!</p>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;"><tr><td>
        <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">Get Your Badge</a>
      </td></tr></table>
    `),
  },
  {
    type: "monthly-summary",
    subject: "[TEST] Day 28: Your monthly compliance summary",
    html: wrapEmailTemplate(`
      <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 24px;">Your Monthly Summary 📈</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin: 0 0 16px;">Here's your compliance progress for the month:</p>
      <table role="presentation" style="width: 100%; margin: 16px 0;">
        <tr>
          <td style="background-color: #f9fafb; border-radius: 8px; padding: 16px; text-align: center; width: 50%;">
            <p style="font-size: 32px; font-weight: 700; color: #7c3aed; margin: 0 0 4px;">78%</p>
            <p style="font-size: 12px; color: #6b7280; margin: 0;">Compliance Score</p>
          </td>
          <td style="width: 12px;"></td>
          <td style="background-color: #f9fafb; border-radius: 8px; padding: 16px; text-align: center; width: 50%;">
            <p style="font-size: 32px; font-weight: 700; color: #10b981; margin: 0 0 4px;">+12%</p>
            <p style="font-size: 12px; color: #6b7280; margin: 0;">vs. Last Month</p>
          </td>
        </tr>
      </table>
      <p style="font-size: 16px; font-weight: 600; color: #111827; margin: 24px 0 12px;">This month's highlights:</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">✅ 3 new documents generated</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 8px;">✅ 8 requirements completed</p>
      <p style="font-size: 15px; color: #4a4a4a; margin: 0 0 16px;">✅ 1 AI system fully compliant</p>
      <table role="presentation" style="margin: 24px 0; text-align: center; width: 100%;"><tr><td>
        <a href="${APP_URL}/dashboard" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 24px; border-radius: 8px;">View Full Report</a>
      </td></tr></table>
      <p style="font-size: 16px; color: #6b7280; margin: 24px 0 0;">Keep up the great work! 🎉<br>– The Protectron Team</p>
    `),
  },
];

async function sendEmail(email: EmailContent): Promise<boolean> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TEST_EMAIL],
        subject: email.subject,
        html: email.html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Failed to send ${email.type}:`, data);
      return false;
    }

    console.log(`✅ Sent ${email.type}: ${data.id}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending ${email.type}:`, error);
    return false;
  }
}

async function main() {
  console.log(`\n📧 Sending ${emails.length} test emails to ${TEST_EMAIL}\n`);
  console.log("=".repeat(50));

  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    const success = await sendEmail(email);
    if (success) {
      sent++;
    } else {
      failed++;
    }
    // Small delay between emails
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log("=".repeat(50));
  console.log(`\n📊 Results: ${sent} sent, ${failed} failed\n`);
}

main();
