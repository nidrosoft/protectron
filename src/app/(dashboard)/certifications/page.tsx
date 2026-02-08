/**
 * Certifications Page
 *
 * Lists all compliance certifications for the organization,
 * with badge preview and embed code generator.
 */

"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { EmbedCodeGenerator } from "./components/EmbedCodeGenerator";

interface Certification {
  id: string;
  certificate_number: string;
  ai_system_name: string;
  risk_level: string;
  compliance_score: number;
  status: string;
  issued_at: string;
  expires_at: string;
  documents_generated: string[];
}

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  useEffect(() => {
    async function loadCertifications() {
      try {
        const supabase = createClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sb = supabase as any;

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await sb
          .from("compliance_certifications")
          .select("*")
          .order("created_at", { ascending: false });

        if (data) {
          setCertifications(data as Certification[]);
        }
      } catch (err) {
        console.error("Failed to load certifications:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCertifications();
  }, []);

  const getRiskBadge = (level: string) => {
    const configs: Record<string, { label: string; classes: string }> = {
      minimal: { label: "Minimal", classes: "bg-green-50 text-green-700" },
      limited: { label: "Limited", classes: "bg-purple-50 text-purple-700" },
      high: { label: "High", classes: "bg-amber-50 text-amber-700" },
    };
    return configs[level] || configs.minimal;
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired = new Date(expiresAt) < new Date();
    if (isExpired && status === "active") {
      return { label: "Expired", classes: "bg-amber-50 text-amber-700" };
    }
    const configs: Record<string, { label: string; classes: string }> = {
      active: { label: "Active", classes: "bg-green-50 text-green-700" },
      expired: { label: "Expired", classes: "bg-amber-50 text-amber-700" },
      revoked: { label: "Revoked", classes: "bg-red-50 text-red-700" },
    };
    return configs[status] || configs.expired;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 rounded bg-gray-200" />
          <div className="mt-2 h-4 w-64 rounded bg-gray-100" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-primary lg:text-display-xs">
          Compliance Certifications
        </h1>
        <p className="mt-1 text-sm text-tertiary">
          Manage your EU AI Act compliance certificates and embeddable badges.
        </p>
      </div>

      {certifications.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-8 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100">
            <svg
              className="h-8 w-8 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-primary">
            No Certifications Yet
          </h3>
          <p className="mt-1 max-w-md text-sm text-tertiary">
            Complete a Quick Comply assessment or full compliance review to earn
            your EU AI Act compliance certificate and embeddable badge.
          </p>
          <a
            href="/quick-comply"
            className="mt-6 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700"
          >
            Start Quick Comply
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Certifications List */}
          <div className="space-y-3 lg:col-span-2">
            {certifications.map((cert) => {
              const risk = getRiskBadge(cert.risk_level);
              const status = getStatusBadge(cert.status, cert.expires_at);
              const isSelected = selectedCert?.id === cert.id;

              return (
                <button
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className={`w-full rounded-xl border bg-white p-4 text-left transition-all ${
                    isSelected
                      ? "border-brand-300 ring-2 ring-brand-100"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                        <svg
                          className="h-5 w-5 text-purple-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">
                          {cert.ai_system_name}
                        </p>
                        <p className="text-xs text-tertiary">
                          {cert.certificate_number}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${risk.classes}`}
                      >
                        {risk.label}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${status.classes}`}
                      >
                        {status.label}
                      </span>
                      <span className="text-lg font-bold text-purple-600">
                        {cert.compliance_score}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-tertiary">
                    <span>
                      Issued:{" "}
                      {new Date(cert.issued_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>
                      Expires:{" "}
                      {new Date(cert.expires_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    {cert.documents_generated?.length > 0 && (
                      <span>
                        {cert.documents_generated.length} documents
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Embed Code Panel */}
          <div className="lg:col-span-1">
            {selectedCert ? (
              <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-primary">
                  Embed Badge
                </h3>
                <p className="mt-0.5 text-xs text-tertiary">
                  Add your compliance badge to your website
                </p>
                <div className="mt-4">
                  <EmbedCodeGenerator
                    certificateId={selectedCert.id}
                    certificateNumber={selectedCert.certificate_number}
                    aiSystemName={selectedCert.ai_system_name}
                  />
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
                <svg
                  className="mx-auto h-8 w-8 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
                  />
                </svg>
                <p className="mt-3 text-sm text-tertiary">
                  Select a certificate to get embed code
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
