"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import NextLink from "next/link";
import {
  TickCircle,
  Shield,
  DocumentText1,
  Cpu,
  Calendar,
  ArrowLeft,
  ExportSquare,
  Copy,
  Clock,
  Warning2,
} from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";

// Mock organization data
const mockOrganization = {
  name: "Acme Corporation",
  slug: "acme-corp",
  logo: null,
  industry: "Technology / SaaS",
  complianceScore: 85,
  lastUpdated: "December 12, 2025",
  aiSystems: [
    {
      id: "system-01",
      name: "Customer Support Chatbot",
      riskLevel: "limited_risk",
      status: "compliant",
      requirementsComplete: 8,
      requirementsTotal: 8,
      lastAudit: "Dec 10, 2025",
    },
    {
      id: "system-02",
      name: "Fraud Detection System",
      riskLevel: "high_risk",
      status: "compliant",
      requirementsComplete: 18,
      requirementsTotal: 18,
      lastAudit: "Dec 8, 2025",
    },
    {
      id: "system-03",
      name: "Content Recommender",
      riskLevel: "minimal_risk",
      status: "compliant",
      requirementsComplete: 2,
      requirementsTotal: 2,
      lastAudit: "Dec 5, 2025",
    },
    {
      id: "system-04",
      name: "Automated Hiring Screener",
      riskLevel: "high_risk",
      status: "in_progress",
      requirementsComplete: 15,
      requirementsTotal: 24,
      lastAudit: "Dec 1, 2025",
    },
  ],
  documents: [
    { name: "EU AI Act Compliance Policy", type: "Policy", date: "Dec 2025" },
    { name: "Data Governance Framework", type: "Framework", date: "Dec 2025" },
    { name: "Risk Management Procedures", type: "Procedure", date: "Nov 2025" },
  ],
};

const riskLevelConfig = {
  high_risk: { label: "High-Risk", color: "warning" as const, bgColor: "bg-warning-100", textColor: "text-warning-700" },
  limited_risk: { label: "Limited Risk", color: "blue" as const, bgColor: "bg-blue-100", textColor: "text-blue-700" },
  minimal_risk: { label: "Minimal Risk", color: "success" as const, bgColor: "bg-success-100", textColor: "text-success-700" },
};

const statusConfig = {
  compliant: { label: "Compliant", color: "success" as const, icon: TickCircle },
  in_progress: { label: "In Progress", color: "warning" as const, icon: Clock },
  not_started: { label: "Not Started", color: "gray" as const, icon: Warning2 },
};

export default function TrustCenterPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [copied, setCopied] = useState(false);

  // In production, fetch organization data based on slug
  const org = mockOrganization;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const compliantSystems = org.aiSystems.filter((s) => s.status === "compliant").length;
  const totalSystems = org.aiSystems.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {org.logo ? (
                <img src={org.logo} alt={org.name} className="h-12 w-12 rounded-lg" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100">
                  <Shield size={24} color="currentColor" className="text-brand-600" variant="Bold" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{org.name}</h1>
                <p className="text-sm text-gray-500">Trust Center • EU AI Act Compliance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                color="secondary"
                iconLeading={({ className }) => <Copy size={16} color="currentColor" className={className} />}
                onClick={handleCopyLink}
              >
                {copied ? "Copied!" : "Share"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Compliance Overview */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-6">
              {/* Compliance Score Circle */}
              <div className="relative flex h-28 w-28 items-center justify-center">
                <svg className="h-28 w-28 -rotate-90 transform">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-100"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(org.complianceScore / 100) * 301.6} 301.6`}
                    strokeLinecap="round"
                    className="text-success-500"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-bold text-gray-900">{org.complianceScore}%</span>
                  <span className="text-xs text-gray-500">Compliant</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <TickCircle size={20} color="currentColor" className="text-success-500" variant="Bold" />
                  <span className="text-lg font-semibold text-gray-900">
                    {compliantSystems} of {totalSystems} AI Systems Compliant
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Last updated: {org.lastUpdated}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-success-50 px-4 py-3">
              <Shield size={20} color="currentColor" className="text-success-600" variant="Bold" />
              <span className="text-sm font-medium text-success-700">
                Verified by ComplyAI
              </span>
            </div>
          </div>
        </div>

        {/* AI Systems */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">AI Systems</h2>
          <p className="mt-1 text-sm text-gray-500">
            Overview of AI systems and their EU AI Act compliance status
          </p>

          <div className="mt-4 grid gap-4">
            {org.aiSystems.map((system) => {
              const riskConfig = riskLevelConfig[system.riskLevel as keyof typeof riskLevelConfig];
              const sConfig = statusConfig[system.status as keyof typeof statusConfig];
              const StatusIcon = sConfig.icon;
              const progress = Math.round((system.requirementsComplete / system.requirementsTotal) * 100);

              return (
                <div
                  key={system.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                        <Cpu size={20} color="currentColor" className="text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{system.name}</h3>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge size="sm" color={riskConfig.color}>
                            {riskConfig.label}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            Last audit: {system.lastAudit}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1.5">
                          <StatusIcon
                            size={16}
                            color="currentColor"
                            className={cx(
                              sConfig.color === "success" && "text-success-500",
                              sConfig.color === "warning" && "text-warning-500",
                              sConfig.color === "gray" && "text-gray-400"
                            )}
                            variant="Bold"
                          />
                          <span className={cx(
                            "text-sm font-medium",
                            sConfig.color === "success" && "text-success-700",
                            sConfig.color === "warning" && "text-warning-700",
                            sConfig.color === "gray" && "text-gray-500"
                          )}>
                            {sConfig.label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {system.requirementsComplete}/{system.requirementsTotal} requirements
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="hidden w-24 sm:block">
                        <div className="h-2 w-full rounded-full bg-gray-100">
                          <div
                            className={cx(
                              "h-2 rounded-full transition-all",
                              progress === 100 ? "bg-success-500" : "bg-brand-500"
                            )}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Compliance Documents */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Compliance Documents</h2>
          <p className="mt-1 text-sm text-gray-500">
            Published compliance documentation
          </p>

          <div className="mt-4 rounded-xl border border-gray-200 bg-white shadow-sm">
            {org.documents.map((doc, index) => (
              <div
                key={doc.name}
                className={cx(
                  "flex items-center justify-between p-4",
                  index !== org.documents.length - 1 && "border-b border-gray-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <DocumentText1 size={20} color="currentColor" className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.type} • {doc.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-500">
              Powered by{" "}
              <a href="/" className="font-medium text-brand-600 hover:text-brand-700">
                ComplyAI
              </a>
            </p>
            <p className="text-xs text-gray-400">
              This Trust Center is automatically updated as compliance status changes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
