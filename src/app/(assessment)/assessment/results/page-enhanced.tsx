"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ShieldTick, TickCircle, Clock } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { AnalyzingAnimation } from "./components";
import {
  ComplianceStatusSummary,
  AISystemsDetected,
  ComplianceGaps,
  ApplicableArticles,
  ComplianceRoadmap,
  TimelineDeadlines,
  CTASection,
} from "./sections";
import {
  calculateEnhancedResults,
  type AssessmentData,
  type EnhancedAssessmentResults,
} from "./data/enhanced-risk-calculator";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/base/toast/toast";
import { generateEnhancedPDFReport } from "./utils/pdf-generator";

export default function EnhancedAssessmentResultsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [data, setData] = useState<AssessmentData | null>(null);
  const [results, setResults] = useState<EnhancedAssessmentResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem("assessmentData");
    if (savedData) {
      const parsedData = JSON.parse(savedData) as AssessmentData;
      setData(parsedData);
      const calculated = calculateEnhancedResults(parsedData);
      setResults(calculated);
    } else {
      setIsAnalyzing(false);
    }
  }, []);

  const handleAnalysisComplete = useCallback(() => {
    setIsAnalyzing(false);
    setTimeout(() => setShowContent(true), 100);
  }, []);

  const handleDownloadReport = async () => {
    if (!data || !results) return;
    
    setIsDownloading(true);
    
    try {
      await generateEnhancedPDFReport(data, results);
      
      addToast({
        title: "Report downloaded",
        message: "Your comprehensive compliance assessment report has been saved as a PDF.",
        type: "success",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      addToast({
        title: "Error",
        message: "Failed to generate PDF report. Please try again.",
        type: "error",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleContinueToDashboard = async () => {
    if (!data || !results) return;
    
    setIsSaving(true);
    
    try {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("organization_id")
          .eq("id", user.id)
          .single();

        if (profile?.organization_id) {
          // Create AI systems based on detected systems
          for (const system of results.detectedSystems) {
            await supabase.from("ai_systems").insert({
              organization_id: profile.organization_id,
              created_by: user.id,
              name: system.name,
              description: `AI system identified during initial assessment: ${system.riskReason}`,
              system_type: system.type === "chatbot" || system.type === "genai" ? "llm_application" : "ml_model",
              risk_level: system.riskLevel,
              category: system.category,
              compliance_status: "not_started",
              compliance_progress: 0,
              serves_eu: results.hasEUExposure,
              assessment_data: {
                source: "initial_assessment",
                assessed_at: new Date().toISOString(),
                company_name: data.companyName,
                industry: data.industry,
                compliance_score: results.complianceScore,
                risk_reason: system.riskReason,
                requirements_count: system.requirementsCount,
                documents_needed: system.documentsNeeded,
              },
            });
          }
        }
      }

      localStorage.removeItem("assessmentData");
      
      addToast({
        title: "Assessment saved",
        message: `${results.detectedSystems.length} AI system(s) added to your dashboard`,
        type: "success",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error saving assessment:", error);
      addToast({
        title: "Error",
        message: "Failed to save assessment data",
        type: "error",
      });
      router.push("/dashboard");
    } finally {
      setIsSaving(false);
    }
  };

  // No data state
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

  // Analyzing state
  if (isAnalyzing) {
    return <AnalyzingAnimation onComplete={handleAnalysisComplete} />;
  }

  // Results not ready
  if (!results) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="text-center">
          <Clock size={48} className="mx-auto text-gray-300 mb-4 animate-spin" variant="Bold" />
          <p className="text-tertiary">Calculating results...</p>
        </div>
      </div>
    );
  }

  const hasHighRisk = results.results.some(r => r.level === "high");

  return (
    <div className={cx(
      "min-h-0 flex-1 overflow-y-auto transition-all duration-500",
      showContent ? "opacity-100" : "opacity-0"
    )}>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Hero Section */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 dark:bg-brand-900/30 px-3 py-1.5 mb-4 sm:px-4 sm:py-2 sm:mb-6">
            <TickCircle size={16} className="text-brand-600" variant="Bold" />
            <span className="text-xs font-medium text-brand-700 dark:text-brand-300 sm:text-sm">
              Assessment Complete
            </span>
          </div>
          
          <h1 className="text-xl font-bold text-primary dark:text-white mb-2 sm:text-display-md sm:mb-3">
            Your EU AI Act Compliance Report
          </h1>
          <p className="text-sm text-tertiary dark:text-gray-400 max-w-2xl mx-auto sm:text-lg">
            Based on your assessment, here's a comprehensive compliance analysis for{" "}
            <span className="font-semibold text-primary dark:text-white">
              {data.companyName || "your organization"}
            </span>
          </p>
        </div>

        {/* EU Exposure Alert */}
        {results.hasEUExposure && (
          <div className="mb-6 rounded-xl border-2 border-warning-300 dark:border-warning-700 bg-gradient-to-r from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-900/10 p-4 sm:mb-8 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning-200 dark:bg-warning-800 sm:h-12 sm:w-12">
                <ShieldTick size={20} className="text-warning-700 dark:text-warning-300 sm:hidden" variant="Bold" />
                <ShieldTick size={24} className="text-warning-700 dark:text-warning-300 hidden sm:block" variant="Bold" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-warning-900 dark:text-warning-100 sm:text-lg">
                  EU AI Act Applies to Your Organization
                </h3>
                <p className="mt-1 text-sm text-warning-800 dark:text-warning-200 sm:text-base">
                  Based on your EU presence (customers, operations, or data processing), you are subject to 
                  EU AI Act compliance requirements. Non-compliance can result in fines up to{" "}
                  <strong>€35 million or 7% of global annual turnover</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 1: Compliance Status Summary */}
        <ComplianceStatusSummary 
          results={results} 
          companyName={data.companyName} 
        />

        {/* Section 2: AI Systems Detected */}
        <AISystemsDetected 
          systems={results.detectedSystems} 
          totalSystems={results.totalSystems} 
        />

        {/* Section 3: Compliance Gaps */}
        <ComplianceGaps gaps={results.complianceGaps} />

        {/* Section 4: Applicable EU AI Act Articles */}
        <ApplicableArticles articles={results.applicableArticles} />

        {/* Section 5: Compliance Roadmap */}
        <ComplianceRoadmap 
          phases={results.roadmapPhases} 
          estimatedWeeks={results.estimatedWeeks} 
        />

        {/* Section 6: Timeline & Deadlines */}
        <TimelineDeadlines 
          daysUntilDeadline={results.daysUntilDeadline} 
          hasHighRisk={hasHighRisk} 
        />

        {/* Section 7: CTAs */}
        <CTASection
          onDownloadReport={handleDownloadReport}
          onGoToDashboard={handleContinueToDashboard}
          isDownloading={isDownloading}
          isSaving={isSaving}
        />

        {/* Footer Note */}
        <p className="mt-6 text-center text-xs text-tertiary dark:text-gray-500 sm:mt-8 sm:text-sm">
          <Clock size={12} className="inline mr-1 sm:hidden" />
          <Clock size={14} className="hidden sm:inline mr-1" />
          This assessment is based on the information you provided and serves as a preliminary guide. 
          For comprehensive compliance, we recommend a detailed review with our platform.
        </p>
      </div>

      {/* Animation Styles */}
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
