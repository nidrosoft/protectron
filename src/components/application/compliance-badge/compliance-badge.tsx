"use client";

import { useState } from "react";
import { Shield, TickCircle, Copy, ExportSquare, DocumentDownload } from "iconsax-react";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { cx } from "@/utils/cx";

type BadgeVariant = "light" | "dark" | "brand";
type BadgeSize = "sm" | "md" | "lg";

interface ComplianceBadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  organizationName: string;
  complianceScore: number;
  trustCenterUrl?: string;
}

const sizeConfig = {
  sm: { badge: "h-8", icon: 14, text: "text-xs", padding: "px-2.5 py-1" },
  md: { badge: "h-10", icon: 18, text: "text-sm", padding: "px-3 py-1.5" },
  lg: { badge: "h-12", icon: 22, text: "text-base", padding: "px-4 py-2" },
};

const variantConfig = {
  light: {
    bg: "bg-white",
    border: "border-gray-200",
    text: "text-gray-900",
    subtext: "text-gray-500",
    icon: "text-success-500",
  },
  dark: {
    bg: "bg-gray-900",
    border: "border-gray-700",
    text: "text-white",
    subtext: "text-gray-400",
    icon: "text-success-400",
  },
  brand: {
    bg: "bg-brand-600",
    border: "border-brand-500",
    text: "text-white",
    subtext: "text-brand-200",
    icon: "text-white",
  },
};

export const ComplianceBadge = ({
  variant = "light",
  size = "md",
  organizationName,
  complianceScore,
  trustCenterUrl,
}: ComplianceBadgeProps) => {
  const sConfig = sizeConfig[size];
  const vConfig = variantConfig[variant];

  return (
    <a
      href={trustCenterUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        "inline-flex items-center gap-2 rounded-lg border shadow-sm transition-all hover:shadow-md",
        sConfig.padding,
        vConfig.bg,
        vConfig.border
      )}
    >
      <Shield size={sConfig.icon} color="currentColor" className={vConfig.icon} variant="Bold" />
      <div className="flex flex-col">
        <span className={cx("font-semibold leading-tight", sConfig.text, vConfig.text)}>
          EU AI Act Compliant
        </span>
        <span className={cx("leading-tight", size === "sm" ? "text-[10px]" : "text-xs", vConfig.subtext)}>
          Verified by ComplyAI
        </span>
      </div>
    </a>
  );
};

interface ComplianceBadgeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  organizationName: string;
  complianceScore: number;
  trustCenterUrl: string;
}

export const ComplianceBadgeModal = ({
  isOpen,
  onOpenChange,
  organizationName,
  complianceScore,
  trustCenterUrl,
}: ComplianceBadgeModalProps) => {
  const [selectedVariant, setSelectedVariant] = useState<BadgeVariant>("light");
  const [selectedSize, setSelectedSize] = useState<BadgeSize>("md");
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
  };

  const generateEmbedCode = () => {
    return `<a href="${trustCenterUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;border:1px solid ${selectedVariant === "dark" ? "#374151" : "#e5e7eb"};background:${selectedVariant === "dark" ? "#111827" : selectedVariant === "brand" ? "#7c3aed" : "#ffffff"};text-decoration:none;font-family:system-ui,sans-serif;">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="${selectedVariant === "light" ? "#22c55e" : "#ffffff"}"><path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1 14.59l-3.29-3.29 1.41-1.41L11 13.17l4.88-4.88 1.41 1.41L11 16.59z"/></svg>
  <div style="display:flex;flex-direction:column;">
    <span style="font-weight:600;font-size:14px;color:${selectedVariant === "dark" || selectedVariant === "brand" ? "#ffffff" : "#111827"};">EU AI Act Compliant</span>
    <span style="font-size:12px;color:${selectedVariant === "dark" ? "#9ca3af" : selectedVariant === "brand" ? "#c4b5fd" : "#6b7280"};">Verified by ComplyAI</span>
  </div>
</a>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50" viewBox="0 0 200 50">
  <rect width="200" height="50" rx="8" fill="${selectedVariant === "dark" ? "#111827" : selectedVariant === "brand" ? "#7c3aed" : "#ffffff"}" stroke="${selectedVariant === "dark" ? "#374151" : "#e5e7eb"}" stroke-width="1"/>
  <path d="M20 15l-6 2.25v4.57c0 3.79 2.56 7.32 6 8.18 3.44-.86 6-4.39 6-8.18V17.25L20 15zm-.75 10.94l-2.47-2.47 1.06-1.06 1.41 1.41 3.66-3.66 1.06 1.06-4.72 4.72z" fill="${selectedVariant === "light" ? "#22c55e" : "#ffffff"}"/>
  <text x="38" y="22" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="${selectedVariant === "dark" || selectedVariant === "brand" ? "#ffffff" : "#111827"}">EU AI Act Compliant</text>
  <text x="38" y="36" font-family="system-ui, sans-serif" font-size="10" fill="${selectedVariant === "dark" ? "#9ca3af" : selectedVariant === "brand" ? "#c4b5fd" : "#6b7280"}">Verified by ComplyAI</text>
</svg>`;
    
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compliance-badge.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-xl">
              <CloseButton
                onClick={handleClose}
                theme="light"
                size="lg"
                className="absolute top-4 right-4 z-20"
              />

              {/* Header */}
              <div className="border-b border-secondary px-6 py-5">
                <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                  Compliance Badge
                </AriaHeading>
                <p className="mt-1 text-sm text-tertiary">
                  Add this badge to your website to showcase your EU AI Act compliance
                </p>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                {/* Badge Preview */}
                <div className="flex items-center justify-center rounded-xl border border-secondary bg-secondary_subtle p-8">
                  <ComplianceBadge
                    variant={selectedVariant}
                    size={selectedSize}
                    organizationName={organizationName}
                    complianceScore={complianceScore}
                    trustCenterUrl={trustCenterUrl}
                  />
                </div>

                {/* Variant Selection */}
                <div className="mt-6">
                  <label className="text-sm font-medium text-secondary">Style</label>
                  <div className="mt-2 flex gap-2">
                    {(["light", "dark", "brand"] as BadgeVariant[]).map((v) => (
                      <button
                        key={v}
                        onClick={() => setSelectedVariant(v)}
                        className={cx(
                          "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all",
                          selectedVariant === v
                            ? "bg-brand-100 text-brand-700 ring-2 ring-brand-500"
                            : "bg-secondary_subtle text-secondary hover:bg-secondary"
                        )}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mt-4">
                  <label className="text-sm font-medium text-secondary">Size</label>
                  <div className="mt-2 flex gap-2">
                    {(["sm", "md", "lg"] as BadgeSize[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={cx(
                          "rounded-lg px-4 py-2 text-sm font-medium uppercase transition-all",
                          selectedSize === s
                            ? "bg-brand-100 text-brand-700 ring-2 ring-brand-500"
                            : "bg-secondary_subtle text-secondary hover:bg-secondary"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Embed Code */}
                <div className="mt-6">
                  <label className="text-sm font-medium text-secondary">Embed Code</label>
                  <div className="mt-2 rounded-lg bg-gray-900 p-4">
                    <pre className="overflow-x-auto text-xs text-gray-300">
                      <code>{generateEmbedCode().slice(0, 150)}...</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-secondary px-6 py-4">
                <Button
                  size="md"
                  color="secondary"
                  iconLeading={({ className }) => <DocumentDownload size={18} color="currentColor" className={className} />}
                  onClick={handleDownloadSVG}
                >
                  Download SVG
                </Button>
                <Button
                  size="md"
                  iconLeading={({ className }) => <Copy size={18} color="currentColor" className={className} />}
                  onClick={handleCopyCode}
                >
                  {copied ? "Copied!" : "Copy Code"}
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};

export default ComplianceBadge;
