"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShieldTick, CloseCircle, TickCircle } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";

interface CertificateVerification {
  valid: boolean;
  certId: string;
  systemName: string;
  organizationName: string;
  certificationLevel: "bronze" | "silver" | "gold";
  complianceScore: number;
  issuedAt: string;
  validUntil: string;
  status: "active" | "expired" | "revoked";
  checks: {
    sdkConnected: boolean;
    hitlRulesActive: boolean;
    noOpenIncidents: boolean;
    loggingActive: boolean;
  };
}

export default function VerifyCertificatePage() {
  const params = useParams();
  const certId = params.certId as string;
  const [verification, setVerification] = useState<CertificateVerification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        const response = await fetch(`/api/v1/certificates/${certId}/verify`);
        if (response.ok) {
          const data = await response.json();
          setVerification(data.data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Certificate not found");
        }
      } catch (err) {
        setError("Failed to verify certificate");
      } finally {
        setIsLoading(false);
      }
    };

    if (certId) {
      verifyCertificate();
    }
  }, [certId]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "gold":
        return "warning";
      case "silver":
        return "gray";
      case "bronze":
        return "warning";
      default:
        return "success";
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "gold":
        return "Gold Certification";
      case "silver":
        return "Silver Certification";
      case "bronze":
        return "Bronze Certification";
      default:
        return "Certified";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingIndicator type="dot-circle" size="md" label="Verifying certificate..." />
      </div>
    );
  }

  if (error || !verification) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CloseCircle size={32} className="text-error-600" color="currentColor" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Certificate Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || "The certificate you're looking for doesn't exist or has been revoked."}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Certificate ID: <code className="bg-gray-100 px-2 py-1 rounded">{certId}</code>
          </p>
          <Link href="https://protectron.ai">
            <Button color="primary" size="lg">
              Visit Protectron
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isExpired = new Date(verification.validUntil) < new Date();
  const isValid = verification.valid && verification.status === "active" && !isExpired;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="https://protectron.ai" className="inline-block">
            <h1 className="text-2xl font-bold text-brand-600">Protectron</h1>
          </Link>
          <p className="text-gray-600 mt-1">EU AI Act Compliance Platform</p>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Status Banner */}
          <div className={`px-6 py-4 ${isValid ? "bg-success-50" : "bg-error-50"}`}>
            <div className="flex items-center justify-center gap-3">
              {isValid ? (
                <>
                  <ShieldTick size={24} className="text-success-600" color="currentColor" variant="Bold" />
                  <span className="text-lg font-semibold text-success-700">Certificate Verified</span>
                </>
              ) : (
                <>
                  <CloseCircle size={24} className="text-error-600" color="currentColor" />
                  <span className="text-lg font-semibold text-error-700">
                    {isExpired ? "Certificate Expired" : "Certificate Invalid"}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Certificate Details */}
          <div className="p-6">
            {/* Main Info */}
            <div className="text-center mb-6">
              <Badge 
                color={getLevelColor(verification.certificationLevel) as "warning" | "gray" | "success"} 
                size="lg"
              >
                {getLevelText(verification.certificationLevel)}
              </Badge>
              <h2 className="text-2xl font-bold text-gray-900 mt-4">{verification.systemName}</h2>
              <p className="text-gray-600">{verification.organizationName}</p>
            </div>

            {/* Score */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-600">{verification.complianceScore}%</div>
                <div className="text-sm text-gray-600 mt-1">Compliance Score</div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Certificate ID</div>
                <div className="font-mono text-sm font-medium text-gray-900 mt-1">{verification.certId}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Status</div>
                <div className="mt-1">
                  <Badge color={isValid ? "success" : "error"} size="sm">
                    {isExpired ? "Expired" : verification.status}
                  </Badge>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Issued</div>
                <div className="font-medium text-gray-900 mt-1">
                  {new Date(verification.issuedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Valid Until</div>
                <div className={`font-medium mt-1 ${isExpired ? "text-error-600" : "text-gray-900"}`}>
                  {new Date(verification.validUntil).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            {/* Compliance Checks */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Compliance Verification</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {verification.checks.sdkConnected ? (
                    <TickCircle size={20} className="text-success-500" color="currentColor" variant="Bold" />
                  ) : (
                    <CloseCircle size={20} className="text-gray-300" color="currentColor" />
                  )}
                  <span className="text-sm text-gray-700">SDK Integration Active</span>
                </div>
                <div className="flex items-center gap-3">
                  {verification.checks.hitlRulesActive ? (
                    <TickCircle size={20} className="text-success-500" color="currentColor" variant="Bold" />
                  ) : (
                    <CloseCircle size={20} className="text-gray-300" color="currentColor" />
                  )}
                  <span className="text-sm text-gray-700">Human-in-the-Loop Rules Configured</span>
                </div>
                <div className="flex items-center gap-3">
                  {verification.checks.noOpenIncidents ? (
                    <TickCircle size={20} className="text-success-500" color="currentColor" variant="Bold" />
                  ) : (
                    <CloseCircle size={20} className="text-gray-300" color="currentColor" />
                  )}
                  <span className="text-sm text-gray-700">No Open High-Severity Incidents</span>
                </div>
                <div className="flex items-center gap-3">
                  {verification.checks.loggingActive ? (
                    <TickCircle size={20} className="text-success-500" color="currentColor" variant="Bold" />
                  ) : (
                    <CloseCircle size={20} className="text-gray-300" color="currentColor" />
                  )}
                  <span className="text-sm text-gray-700">Audit Logging Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              This certificate was issued by Protectron and is subject to continuous compliance monitoring.
              <br />
              For more information, visit{" "}
              <a href="https://protectron.ai" className="text-brand-600 hover:underline">
                protectron.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
