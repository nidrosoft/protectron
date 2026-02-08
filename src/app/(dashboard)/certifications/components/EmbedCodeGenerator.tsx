/**
 * EmbedCodeGenerator - Generate embeddable badge code for websites
 *
 * Provides HTML embed code, markdown embed code, and direct image URL
 * with style selection and live preview.
 */

"use client";

import { useState, useCallback } from "react";

interface EmbedCodeGeneratorProps {
  certificateId: string;
  certificateNumber: string;
  aiSystemName: string;
}

type BadgeStyle = "standard" | "compact" | "detailed";

export function EmbedCodeGenerator({
  certificateId,
  certificateNumber,
  aiSystemName,
}: EmbedCodeGeneratorProps) {
  const [style, setStyle] = useState<BadgeStyle>("standard");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://complyai.eu";
  const badgeUrl = `${appUrl}/api/badges/${certificateId}?style=${style}`;
  const verifyUrl = `${appUrl}/verify/${certificateNumber}`;

  const htmlCode = `<a href="${verifyUrl}" target="_blank" rel="noopener noreferrer" title="Verify EU AI Act Compliance - ${aiSystemName}">
  <img src="${badgeUrl}" alt="EU AI Act Compliant - ${aiSystemName}" />
</a>`;

  const markdownCode = `[![EU AI Act Compliant - ${aiSystemName}](${badgeUrl})](${verifyUrl})`;

  const directUrl = badgeUrl;

  const handleCopy = useCallback(
    async (text: string, field: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      } catch {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
      }
    },
    []
  );

  const styles: { id: BadgeStyle; label: string; desc: string }[] = [
    { id: "standard", label: "Standard", desc: "280 x 120px — Ideal for footers and sidebars" },
    { id: "compact", label: "Compact", desc: "200 x 36px — Inline or navigation bar" },
    { id: "detailed", label: "Detailed", desc: "340 x 200px — Full certificate card" },
  ];

  return (
    <div className="space-y-6">
      {/* Style Selector */}
      <div>
        <h4 className="text-sm font-semibold text-primary">Badge Style</h4>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {styles.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`rounded-xl border p-3 text-left transition-all ${
                style === s.id
                  ? "border-brand-300 bg-brand-50 ring-2 ring-brand-200"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <p className="text-sm font-semibold text-primary">{s.label}</p>
              <p className="mt-0.5 text-xs text-tertiary">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Live Preview */}
      <div>
        <h4 className="text-sm font-semibold text-primary">Preview</h4>
        <div className="mt-2 flex items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={badgeUrl}
            alt={`EU AI Act Compliant - ${aiSystemName}`}
            className="max-w-full"
          />
        </div>
      </div>

      {/* HTML Embed Code */}
      <CodeBlock
        label="HTML Embed Code"
        description="Paste this into your website's HTML"
        code={htmlCode}
        field="html"
        copiedField={copiedField}
        onCopy={handleCopy}
      />

      {/* Markdown Embed Code */}
      <CodeBlock
        label="Markdown"
        description="For README files and documentation"
        code={markdownCode}
        field="markdown"
        copiedField={copiedField}
        onCopy={handleCopy}
      />

      {/* Direct URL */}
      <CodeBlock
        label="Direct Image URL"
        description="Use anywhere you can embed an image"
        code={directUrl}
        field="url"
        copiedField={copiedField}
        onCopy={handleCopy}
      />

      {/* Verification URL */}
      <CodeBlock
        label="Verification Page"
        description="Share this link so anyone can verify your certificate"
        code={verifyUrl}
        field="verify"
        copiedField={copiedField}
        onCopy={handleCopy}
      />
    </div>
  );
}

function CodeBlock({
  label,
  description,
  code,
  field,
  copiedField,
  onCopy,
}: {
  label: string;
  description: string;
  code: string;
  field: string;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}) {
  const isCopied = copiedField === field;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-primary">{label}</h4>
          <p className="text-xs text-tertiary">{description}</p>
        </div>
        <button
          onClick={() => onCopy(code, field)}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            isCopied
              ? "bg-success-50 text-success-700"
              : "bg-gray-100 text-secondary hover:bg-gray-200"
          }`}
        >
          {isCopied ? (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9.75a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="mt-2 overflow-x-auto rounded-lg border border-gray-200 bg-gray-900 p-3 text-xs text-gray-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
