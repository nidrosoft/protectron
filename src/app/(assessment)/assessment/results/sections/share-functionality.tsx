"use client";

import { useState } from "react";
import { cx } from "@/utils/cx";
import { Share, Copy, TickCircle, Sms, Link21 } from "iconsax-react";

interface ShareFunctionalityProps {
  companyName: string;
  complianceScore: number;
  totalSystems: number;
  hasHighRisk: boolean;
  daysUntilDeadline: number;
}

export function ShareFunctionality({
  companyName,
  complianceScore,
  totalSystems,
  hasHighRisk,
  daysUntilDeadline,
}: ShareFunctionalityProps) {
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Generate shareable message
  const generateMessage = () => {
    return `Hi,

I completed our EU AI Act compliance assessment using Protectron. Here are the key findings for ${companyName}:

📊 Compliance Score: ${complianceScore}%
🤖 AI Systems Identified: ${totalSystems}
⚠️ Risk Level: ${hasHighRisk ? "High-Risk (requires full compliance)" : "Limited/Minimal Risk"}
📅 Deadline: August 2, 2026 (${daysUntilDeadline} days remaining)

Key Actions Required:
${hasHighRisk ? `• Complete technical documentation for ${totalSystems} AI systems
• Implement risk management system
• Establish human oversight procedures
• Enable audit logging` : `• Implement transparency disclosures
• Document AI system usage`}

I recommend we review this together and start our compliance journey. The platform can help us generate the required documentation automatically.

View the full report and start tracking: https://protectron.ai

Best regards`;
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Generate mailto link
  const generateMailtoLink = () => {
    const subject = encodeURIComponent(`EU AI Act Compliance Assessment - ${companyName}`);
    const body = encodeURIComponent(generateMessage());
    return `mailto:?subject=${subject}&body=${body}`;
  };

  // Open email client
  const openEmailClient = () => {
    window.location.href = generateMailtoLink();
    setEmailSent(true);
  };

  // Generate LinkedIn share URL
  const generateLinkedInUrl = () => {
    const text = encodeURIComponent(
      `Just completed an EU AI Act compliance assessment for our organization. With ${totalSystems} AI systems and a ${complianceScore}% readiness score, we're taking proactive steps toward compliance before the August 2026 deadline. #EUAIAct #AICompliance #Protectron`
    );
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://protectron.ai")}`;
  };

  // Generate Twitter/X share URL
  const generateTwitterUrl = () => {
    const text = encodeURIComponent(
      `Completed our EU AI Act compliance assessment: ${complianceScore}% readiness score with ${totalSystems} AI systems identified. ${daysUntilDeadline} days until the deadline. #EUAIAct #AICompliance`
    );
    return `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent("https://protectron.ai")}`;
  };

  return (
    <section className="mb-8 sm:mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600">
          <Share size={20} color="currentColor" variant="Bold" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-primary dark:text-white sm:text-xl">
            Share with Your Team
          </h2>
          <p className="text-sm text-tertiary dark:text-gray-400">
            Get stakeholders aligned on compliance priorities
          </p>
        </div>
      </div>

      {/* Share Card */}
      <div className="rounded-xl border border-secondary dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6">
        {/* Message Preview */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-primary dark:text-white mb-2">
            Preview Message
          </h3>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4 max-h-48 overflow-y-auto">
            <pre className="text-xs text-tertiary dark:text-gray-400 whitespace-pre-wrap font-sans">
              {generateMessage()}
            </pre>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {/* Email */}
          <button
            onClick={openEmailClient}
            className={cx(
              "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition-all",
              emailSent
                ? "border-success-300 dark:border-success-700 bg-success-50 dark:bg-success-900/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand-300 dark:hover:border-brand-700"
            )}
          >
            <span className={emailSent ? "text-success-600" : "text-gray-600 dark:text-gray-400"}>
              <Sms size={24} color="currentColor" variant="Bold" />
            </span>
            <span className={cx(
              "text-xs font-medium",
              emailSent ? "text-success-700 dark:text-success-300" : "text-primary dark:text-white"
            )}>
              {emailSent ? "Email Opened" : "Email"}
            </span>
          </button>

          {/* Copy Link */}
          <button
            onClick={copyToClipboard}
            className={cx(
              "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition-all",
              copied
                ? "border-success-300 dark:border-success-700 bg-success-50 dark:bg-success-900/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand-300 dark:hover:border-brand-700"
            )}
          >
            {copied ? (
              <span className="text-success-600"><TickCircle size={24} color="currentColor" variant="Bold" /></span>
            ) : (
              <span className="text-gray-600 dark:text-gray-400"><Copy size={24} color="currentColor" variant="Bold" /></span>
            )}
            <span className={cx(
              "text-xs font-medium",
              copied ? "text-success-700 dark:text-success-300" : "text-primary dark:text-white"
            )}>
              {copied ? "Copied!" : "Copy Text"}
            </span>
          </button>

          {/* LinkedIn */}
          <a
            href={generateLinkedInUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span className="text-xs font-medium text-primary dark:text-white">LinkedIn</span>
          </a>

          {/* Twitter/X */}
          <a
            href={generateTwitterUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="text-xs font-medium text-primary dark:text-white">X (Twitter)</span>
          </a>
        </div>

        {/* Tip */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
          <span className="text-brand-600 shrink-0 mt-0.5"><Link21 size={16} color="currentColor" variant="Bold" /></span>
          <p className="text-xs text-brand-700 dark:text-brand-300">
            <strong>Tip:</strong> Share this report with your CTO, Legal team, and Product Manager. 
            They'll need to be involved in the compliance process.
          </p>
        </div>
      </div>
    </section>
  );
}
