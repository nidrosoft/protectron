"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldTick,
  Warning2,
  InfoCircle,
  TickCircle,
  ArrowRight,
  DocumentDownload,
  Chart,
  Cpu,
  Clock,
  Shield,
} from "iconsax-react";
import { AlertCircle, Calendar, CheckCircle, Flag05 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Progress } from "@/components/application/progress-steps/progress-steps";
import type { ProgressFeaturedIconType } from "@/components/application/progress-steps/progress-types";
import { cx } from "@/utils/cx";
import { AnalyzingAnimation, ProgressRing } from "./components";
import {
  calculateRiskResults,
  getScoreColor,
  getScoreLabel,
  type AssessmentData,
  type RiskResult,
} from "./data/risk-calculator";

export default function AssessmentResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<AssessmentData | null>(null);
  const [results, setResults] = useState<RiskResult[]>([]);
  const [complianceScore, setComplianceScore] = useState(0);
  const [hasEUExposure, setHasEUExposure] = useState(false);
  const [totalSystems, setTotalSystems] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("assessmentData");
    if (savedData) {
      const parsedData = JSON.parse(savedData) as AssessmentData;
      setData(parsedData);
      const calculated = calculateRiskResults(parsedData);
      setResults(calculated.results);
      setComplianceScore(calculated.complianceScore);
      setHasEUExposure(calculated.hasEUExposure);
      setTotalSystems(calculated.totalSystems);
    } else {
      setIsAnalyzing(false);
    }
  }, []);

  const handleAnalysisComplete = useCallback(() => {
    setIsAnalyzing(false);
    setTimeout(() => setShowContent(true), 100);
  }, []);

  const handleCreateAccount = () => {
    router.push("/dashboard");
  };

  if (!data) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="text-center">
          <ShieldTick size={48} className="mx-auto text-gray-300 mb-4" variant="Bold" />
          <p className="text-tertiary">No assessment data found.</p>
          <Button color="primary" className="mt-4" onClick={() => router.push("/assessment")}>
            Start Assessment
          </Button>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return <AnalyzingAnimation onComplete={handleAnalysisComplete} />;
  }

  const scoreInfo = getScoreLabel(complianceScore);

  return (
    <div className={cx(
      "min-h-0 flex-1 overflow-y-auto transition-all duration-500",
      showContent ? "opacity-100" : "opacity-0"
    )}>
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 mb-6">
            <TickCircle size={16} className="text-brand-600" variant="Bold" />
            <span className="text-sm font-medium text-brand-700">Assessment Complete</span>
          </div>
          
          <h1 className="text-display-md font-bold text-primary mb-3">
            Your Compliance Report
          </h1>
          <p className="text-lg text-tertiary max-w-2xl mx-auto">
            Based on your assessment, here's a personalized compliance roadmap for{" "}
            <span className="font-semibold text-primary">{data.companyName || "your organization"}</span>
          </p>
        </div>

        {/* Score Card */}
        <div className="mb-10 rounded-2xl border border-secondary bg-gradient-to-br from-white to-gray-50 p-8 shadow-lg">
          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
            {/* Progress Ring */}
            <div className="flex flex-col items-center">
              <ProgressRing 
                progress={complianceScore} 
                color={getScoreColor(complianceScore)}
              />
              <div className={cx("mt-4 rounded-full px-4 py-1.5", scoreInfo.bg)}>
                <span className={cx("text-sm font-semibold", scoreInfo.color)}>
                  {scoreInfo.label}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 flex-1 max-w-sm">
              <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 mb-3">
                  <Cpu size={20} color="currentColor" className="text-brand-600" variant="Bold" />
                </div>
                <p className="text-2xl font-bold text-primary">{totalSystems}</p>
                <p className="text-sm text-tertiary">AI Systems</p>
              </div>
              
              <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-100 mb-3">
                  <Warning2 size={20} color="currentColor" className="text-warning-600" variant="Bold" />
                </div>
                <p className="text-2xl font-bold text-primary">
                  {results.find(r => r.level === "high")?.count || 0}
                </p>
                <p className="text-sm text-tertiary">High Risk</p>
              </div>
              
              <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 mb-3">
                  <InfoCircle size={20} color="currentColor" className="text-blue-600" variant="Bold" />
                </div>
                <p className="text-2xl font-bold text-primary">
                  {results.find(r => r.level === "limited")?.count || 0}
                </p>
                <p className="text-sm text-tertiary">Limited Risk</p>
              </div>
              
              <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-100 mb-3">
                  <TickCircle size={20} color="currentColor" className="text-success-600" variant="Bold" />
                </div>
                <p className="text-2xl font-bold text-primary">
                  {results.find(r => r.level === "minimal")?.count || 0}
                </p>
                <p className="text-sm text-tertiary">Minimal Risk</p>
              </div>
            </div>
          </div>
        </div>

        {/* EU Exposure Alert */}
        {hasEUExposure && (
          <div className="mb-8 rounded-xl border-2 border-warning-300 bg-gradient-to-r from-warning-50 to-warning-100 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-warning-200">
                <Shield size={24} color="currentColor" className="text-warning-700" variant="Bold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-warning-900">
                  EU AI Act Applies to Your Organization
                </h3>
                <p className="mt-1 text-warning-800">
                  Based on your EU presence (customers, operations, or data processing), you are subject to EU AI Act compliance requirements. Non-compliance can result in fines up to €35 million or 7% of global annual turnover.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Risk Classification */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
            <Chart size={24} color="currentColor" className="text-brand-600" variant="Bold" />
            Risk Classification Summary
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {results.map((result, index) => {
              const Icon = result.icon;
              return (
                <div
                  key={result.level}
                  className={cx(
                    "rounded-xl border-2 p-5 transition-all duration-300 hover:shadow-md",
                    result.borderColor,
                    result.bgColor
                  )}
                  style={{ 
                    animationDelay: `${index * 150}ms`,
                    animation: showContent ? "fadeInUp 0.5s ease-out forwards" : "none"
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className={cx(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      result.level === "prohibited" && "bg-error-200",
                      result.level === "high" && "bg-warning-200",
                      result.level === "limited" && "bg-blue-200",
                      result.level === "minimal" && "bg-success-200"
                    )}>
                      <Icon size={24} color="currentColor" className={result.color} variant="Bold" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={cx("font-semibold text-lg", result.color)}>
                          {result.label}
                        </h3>
                        <span className={cx(
                          "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                          result.level === "prohibited" && "bg-error-200 text-error-700",
                          result.level === "high" && "bg-warning-200 text-warning-700",
                          result.level === "limited" && "bg-blue-200 text-blue-700",
                          result.level === "minimal" && "bg-success-200 text-success-700"
                        )}>
                          {result.count}
                        </span>
                      </div>
                      <p className="text-sm text-tertiary">{result.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Deadlines */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-primary mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-brand-600" />
            Key Compliance Deadlines
          </h2>
          
          <div className="rounded-xl border border-secondary bg-white p-6">
            <Progress.IconsWithText 
              type="featured-icon"
              orientation="vertical"
              size="md"
              items={[
                { 
                  title: "August 2, 2025", 
                  description: "Prohibited AI practices must stop", 
                  status: "complete" as const,
                  icon: AlertCircle,
                },
                { 
                  title: "August 2, 2026", 
                  description: "High-risk AI systems must be compliant", 
                  status: "current" as const,
                  icon: Flag05,
                },
                { 
                  title: "August 2, 2027", 
                  description: "All AI systems must be fully compliant", 
                  status: "incomplete" as const,
                  icon: CheckCircle,
                },
              ] as ProgressFeaturedIconType[]}
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white shadow-xl">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
            <div className="text-center lg:text-left flex-1">
              <h2 className="text-2xl font-bold mb-2">
                Ready to Achieve Compliance?
              </h2>
              <p className="text-brand-100">
                Create your free account to track your AI systems, generate required documentation, and monitor your compliance progress in real-time.
              </p>
            </div>
            <div className="flex flex-row gap-3 shrink-0">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                onClick={() => {}}
              >
                <DocumentDownload size={18} color="currentColor" className="text-white" variant="Bold" />
                <span>Download Report</span>
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
                onClick={handleCreateAccount}
              >
                <span>Get Started Free</span>
                <ArrowRight size={18} color="currentColor" className="text-brand-700" variant="Bold" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-sm text-tertiary">
          <Clock size={14} color="currentColor" className="inline mr-1" />
          This assessment is based on the information you provided and serves as a preliminary guide. 
          For comprehensive compliance, we recommend a detailed review with our platform.
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
