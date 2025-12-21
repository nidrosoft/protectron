"use client";

import { useState } from "react";
import {
  TickCircle,
  CloseCircle,
  DocumentDownload,
  Code1,
  DocumentText1,
  ShieldTick,
  Copy,
  Refresh,
} from "iconsax-react";
import { Shield01 } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { useToast } from "@/components/base/toast/toast";
import { EmptyState } from "@/components/application/empty-state/empty-state";

interface CertificationData {
  status: "certified" | "pending" | "not_eligible";
  certId?: string;
  validUntil?: string;
  nextVerification?: string;
  requirements: {
    allRequirementsComplete: boolean;
    sdkConnectedDays: number;
    hitlRulesActive: boolean;
    noHighSeverityIncidents: boolean;
    humanOversightRate: number;
    errorRate: number;
  };
}

interface CertificationTabProps {
  system: {
    id: string;
    name: string;
    requirements: {
      completed: number;
      total: number;
    };
    certification?: CertificationData;
  };
}

export const CertificationTab = ({ system }: CertificationTabProps) => {
  const { addToast } = useToast();
  const [isEmbedCodeOpen, setIsEmbedCodeOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const certification = system.certification;

  if (!certification) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <EmptyState size="md">
          <EmptyState.Header pattern="grid">
            <EmptyState.FeaturedIcon icon={Shield01} color="gray" theme="modern" />
          </EmptyState.Header>
          <EmptyState.Content>
            <EmptyState.Title>Certification Not Available</EmptyState.Title>
            <EmptyState.Description>
              Certification is available for Scale and Enterprise plans. Upgrade your plan to access certification badges.
            </EmptyState.Description>
          </EmptyState.Content>
          <EmptyState.Footer>
            <Button size="lg">
              Upgrade Plan
            </Button>
          </EmptyState.Footer>
        </EmptyState>
      </div>
    );
  }

  const handleDownloadBadge = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100">
  <rect width="200" height="100" rx="8" fill="#ecfdf5"/>
  <rect x="1" y="1" width="198" height="98" rx="7" fill="none" stroke="#86efac" stroke-width="2"/>
  <text x="100" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#15803d">✓ EU AI ACT</text>
  <text x="100" y="52" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#166534">COMPLIANT</text>
  <text x="100" y="70" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" fill="#16a34a">${system.name}</text>
  <text x="100" y="85" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="#16a34a">Protectron Verified</text>
</svg>`;

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${system.name.replace(/\s+/g, "-").toLowerCase()}-eu-ai-act-badge.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast({
      title: "Badge Downloaded",
      message: "The certification badge SVG has been downloaded.",
      type: "success",
    });
  };

  const embedCode = `<!-- EU AI Act Compliance Badge -->
<a href="https://protectron.ai/verify/${certification.certId}" target="_blank" rel="noopener">
  <img 
    src="https://protectron.ai/badges/${certification.certId}.svg" 
    alt="EU AI Act Compliant - ${system.name}" 
    width="200" 
    height="100"
  />
</a>`;

  const handleCopyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    addToast({
      title: "Embed Code Copied",
      message: "The embed code has been copied to your clipboard.",
      type: "success",
    });
  };

  const handleViewReport = async () => {
    setIsGenerating(true);
    addToast({
      title: "Generating Certificate",
      message: "Your compliance certificate PDF is being generated...",
      type: "info",
    });

    try {
      const response = await fetch(`/api/v1/agents/${system.id}/certificate/generate?download=true`, {
        method: "POST",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${system.name.replace(/\s+/g, "-").toLowerCase()}-compliance-certificate.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        addToast({
          title: "Certificate Downloaded",
          message: "Your compliance certificate PDF has been downloaded.",
          type: "success",
        });
      } else {
        const error = await response.json();
        addToast({
          title: "Generation Failed",
          message: error.error || "Failed to generate certificate. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
      addToast({
        title: "Generation Failed",
        message: "Failed to generate certificate. Please try again.",
        type: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Certification Status</h3>
          {certification.status === "certified" && (
            <Badge color="success" size="md">EU AI Act Compliant</Badge>
          )}
          {certification.status === "pending" && (
            <Badge color="warning" size="md">Pending Certification</Badge>
          )}
          {certification.status === "not_eligible" && (
            <Badge color="gray" size="md">Not Eligible</Badge>
          )}
        </div>

        {/* Certified Badge Display */}
        {certification.status === "certified" && certification.certId && (
          <div className="mb-6">
            <div className="mx-auto max-w-md rounded-xl border-2 border-success-300 bg-success-50 p-6 text-center">
              <div className="flex justify-center mb-3">
                <ShieldTick size={48} className="text-success-600" color="currentColor" variant="Bold" />
              </div>
              <p className="text-lg font-bold text-success-700">✓ EU AI ACT</p>
              <p className="text-xl font-bold text-success-800">COMPLIANT</p>
              <div className="mt-4 space-y-1 text-sm text-success-700">
                <p className="font-medium">{system.name}</p>
                <p>Protectron Verified</p>
                <p>Valid until: {new Date(certification.validUntil!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                <p className="font-mono text-xs mt-2">ID: {certification.certId}</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Button 
                size="md" 
                color="secondary" 
                iconLeading={({ className }) => <DocumentDownload size={18} color="currentColor" className={className} />}
                onClick={handleDownloadBadge}
              >
                Download Badge (SVG)
              </Button>
              <Button 
                size="md" 
                color="secondary" 
                iconLeading={({ className }) => <Code1 size={18} color="currentColor" className={className} />}
                onClick={() => setIsEmbedCodeOpen(!isEmbedCodeOpen)}
              >
                Get Embed Code
              </Button>
              <Button 
                size="md" 
                color="primary" 
                iconLeading={({ className }) => <DocumentText1 size={18} color="currentColor" className={className} />}
                onClick={handleViewReport}
                isDisabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Download Certificate (PDF)"}
              </Button>
            </div>

            {/* Embed Code Section */}
            {isEmbedCodeOpen && (
              <div className="mt-4 rounded-lg bg-gray-900 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">Embed Code</span>
                  <Button 
                    size="sm" 
                    color="secondary"
                    iconLeading={({ className }) => <Copy size={14} color="currentColor" className={className} />}
                    onClick={handleCopyEmbedCode}
                  >
                    Copy
                  </Button>
                </div>
                <pre className="text-xs text-gray-300 overflow-x-auto whitespace-pre-wrap">
                  {embedCode}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Pending Status Message */}
        {certification.status === "pending" && (
          <div className="mb-6 rounded-lg bg-warning-50 border border-warning-200 p-4">
            <p className="text-sm text-warning-700">
              <strong>Certification Pending:</strong> Complete all requirements below to receive your EU AI Act compliance certification badge.
            </p>
          </div>
        )}
      </div>

      {/* Requirements Checklist */}
      <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
        <h3 className="text-lg font-semibold text-primary mb-4">Certification Requirements</h3>
        <div className="grid gap-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary_subtle">
            {certification.requirements.allRequirementsComplete ? (
              <TickCircle size={20} className="text-success-500 shrink-0" color="currentColor" variant="Bold" />
            ) : (
              <CloseCircle size={20} className="text-gray-300 shrink-0" color="currentColor" />
            )}
            <div>
              <p className="text-sm font-medium text-primary">All requirements complete or N/A</p>
              <p className="text-xs text-tertiary">{system.requirements.completed} of {system.requirements.total} requirements completed</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary_subtle">
            {certification.requirements.sdkConnectedDays >= 30 ? (
              <TickCircle size={20} className="text-success-500 shrink-0" color="currentColor" variant="Bold" />
            ) : (
              <CloseCircle size={20} className="text-gray-300 shrink-0" color="currentColor" />
            )}
            <div>
              <p className="text-sm font-medium text-primary">SDK connected and logging for 30+ days</p>
              <p className="text-xs text-tertiary">Currently: {certification.requirements.sdkConnectedDays} days</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary_subtle">
            {certification.requirements.hitlRulesActive ? (
              <TickCircle size={20} className="text-success-500 shrink-0" color="currentColor" variant="Bold" />
            ) : (
              <CloseCircle size={20} className="text-gray-300 shrink-0" color="currentColor" />
            )}
            <div>
              <p className="text-sm font-medium text-primary">HITL rules configured and active</p>
              <p className="text-xs text-tertiary">{certification.requirements.hitlRulesActive ? "Active" : "Not configured"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary_subtle">
            {certification.requirements.noHighSeverityIncidents ? (
              <TickCircle size={20} className="text-success-500 shrink-0" color="currentColor" variant="Bold" />
            ) : (
              <CloseCircle size={20} className="text-gray-300 shrink-0" color="currentColor" />
            )}
            <div>
              <p className="text-sm font-medium text-primary">No open high-severity incidents</p>
              <p className="text-xs text-tertiary">{certification.requirements.noHighSeverityIncidents ? "No incidents" : "Has open incidents"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary_subtle">
            {certification.requirements.humanOversightRate > 1 ? (
              <TickCircle size={20} className="text-success-500 shrink-0" color="currentColor" variant="Bold" />
            ) : (
              <CloseCircle size={20} className="text-gray-300 shrink-0" color="currentColor" />
            )}
            <div>
              <p className="text-sm font-medium text-primary">Human oversight rate {">"} 1%</p>
              <p className="text-xs text-tertiary">Current rate: {certification.requirements.humanOversightRate}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary_subtle">
            {certification.requirements.errorRate < 5 ? (
              <TickCircle size={20} className="text-success-500 shrink-0" color="currentColor" variant="Bold" />
            ) : (
              <CloseCircle size={20} className="text-gray-300 shrink-0" color="currentColor" />
            )}
            <div>
              <p className="text-sm font-medium text-primary">Error rate {"<"} 5%</p>
              <p className="text-xs text-tertiary">Current rate: {certification.requirements.errorRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Verification */}
      {certification.status === "certified" && certification.nextVerification && (
        <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
          <h3 className="text-lg font-semibold text-primary mb-2">Next Verification</h3>
          <p className="text-sm text-tertiary">
            Your certification will be automatically verified on{" "}
            <strong className="text-primary">
              {new Date(certification.nextVerification).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </strong>
            . No action is required from you.
          </p>
        </div>
      )}
    </div>
  );
};

export default CertificationTab;
