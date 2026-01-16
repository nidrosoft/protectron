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
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/base/toast/toast";
import jsPDF from "jspdf";

export default function AssessmentResultsPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [data, setData] = useState<AssessmentData | null>(null);
  const [results, setResults] = useState<RiskResult[]>([]);
  const [complianceScore, setComplianceScore] = useState(0);
  const [hasEUExposure, setHasEUExposure] = useState(false);
  const [totalSystems, setTotalSystems] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleDownloadReport = () => {
    if (!data) return;
    
    // Create PDF document
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    // Brand colors (RGB)
    const brandPurple: [number, number, number] = [127, 86, 217];
    const gray: [number, number, number] = [102, 112, 133];
    const darkGray: [number, number, number] = [52, 64, 84];
    const lightPurple: [number, number, number] = [249, 245, 255];

    const formatDate = () => new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Helper to add new page if needed
    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - margin) {
        pdf.addPage();
        y = margin;
        addHeader();
      }
    };

    // Add header to each page
    const addHeader = () => {
      pdf.setFontSize(8);
      pdf.setTextColor(...gray);
      pdf.text("EU AI Act Compliance Assessment  |  Confidential", pageWidth - margin, 10, { align: "right" });
    };

    // Add footer to each page
    const addFooter = (pageNum: number, totalPages: number) => {
      pdf.setFontSize(8);
      pdf.setTextColor(...gray);
      pdf.text(`Protectron Inc.  |  Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    };

    // Title page
    y = 80;
    pdf.setFontSize(28);
    pdf.setTextColor(...brandPurple);
    pdf.setFont("helvetica", "bold");
    pdf.text("EU AI Act Compliance", pageWidth / 2, y, { align: "center" });
    y += 12;
    pdf.text("Assessment Report", pageWidth / 2, y, { align: "center" });
    
    y += 20;
    pdf.setFontSize(14);
    pdf.setTextColor(...gray);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Assessment Report for ${data.companyName || "Your Organization"}`, pageWidth / 2, y, { align: "center" });
    
    y += 30;
    pdf.setFontSize(12);
    pdf.setTextColor(...darkGray);
    pdf.setFont("helvetica", "bold");
    pdf.text(formatDate(), pageWidth / 2, y, { align: "center" });
    
    y += 20;
    pdf.setFontSize(10);
    pdf.setTextColor(...gray);
    pdf.setFont("helvetica", "normal");
    pdf.text("Prepared by: Protectron Inc.", pageWidth / 2, y, { align: "center" });
    
    y += 8;
    pdf.setFont("helvetica", "italic");
    pdf.text("Generated via Protectron - EU AI Act Compliance Platform", pageWidth / 2, y, { align: "center" });

    // New page for content
    pdf.addPage();
    y = margin;
    addHeader();

    // Section helper
    const addSection = (title: string, sectionNum: number) => {
      checkPageBreak(20);
      pdf.setFontSize(14);
      pdf.setTextColor(...brandPurple);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${sectionNum}. ${title}`, margin, y);
      y += 10;
    };

    // Paragraph helper
    const addParagraph = (text: string) => {
      pdf.setFontSize(10);
      pdf.setTextColor(...darkGray);
      pdf.setFont("helvetica", "normal");
      const lines = pdf.splitTextToSize(text, contentWidth);
      checkPageBreak(lines.length * 5 + 5);
      pdf.text(lines, margin, y);
      y += lines.length * 5 + 5;
    };

    // Table helper
    const addTable = (items: { key: string; value: string }[]) => {
      const rowHeight = 8;
      const col1Width = 50;
      const col2Width = contentWidth - col1Width;
      
      checkPageBreak((items.length + 1) * rowHeight + 10);
      
      // Header row
      pdf.setFillColor(...brandPurple);
      pdf.rect(margin, y, contentWidth, rowHeight, "F");
      pdf.setFontSize(9);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.text("Property", margin + 3, y + 5.5);
      pdf.text("Value", margin + col1Width + 3, y + 5.5);
      y += rowHeight;
      
      // Data rows
      items.forEach((item, index) => {
        if (index % 2 === 1) {
          pdf.setFillColor(...lightPurple);
          pdf.rect(margin, y, contentWidth, rowHeight, "F");
        }
        
        // Border
        pdf.setDrawColor(228, 231, 236);
        pdf.rect(margin, y, col1Width, rowHeight);
        pdf.rect(margin + col1Width, y, col2Width, rowHeight);
        
        pdf.setFontSize(9);
        pdf.setTextColor(...darkGray);
        pdf.setFont("helvetica", "normal");
        pdf.text(item.key, margin + 3, y + 5.5);
        
        // Handle long values
        const valueLines = pdf.splitTextToSize(item.value, col2Width - 6);
        pdf.text(valueLines[0], margin + col1Width + 3, y + 5.5);
        
        y += rowHeight;
      });
      y += 8;
    };

    // 1. Executive Summary
    addSection("Executive Summary", 1);
    addParagraph(`This compliance assessment report provides an overview of ${data.companyName || "your organization"}'s AI systems and their compliance status under the EU AI Act. Based on the information provided, we have identified ${totalSystems} AI system(s) that require compliance attention.`);
    addParagraph(`Your current compliance readiness score is ${complianceScore}%. ${hasEUExposure ? "As your organization has EU exposure through customers, operations, or data processing, you are subject to EU AI Act requirements." : "Based on your responses, your EU exposure level has been assessed."}`);
    y += 5;

    // 2. Company Information
    addSection("Company Information", 2);
    addTable([
      { key: "Company Name", value: data.companyName || "Not provided" },
      { key: "Industry", value: data.industry || "Not provided" },
      { key: "Company Size", value: data.companySize || "Not provided" },
      { key: "Country", value: data.country || "Not provided" },
    ]);

    // 3. EU Presence Assessment
    addSection("EU Presence Assessment", 3);
    addTable([
      { key: "EU Operations", value: data.hasEUOperations ? "Yes" : "No" },
      { key: "EU Customers", value: data.hasEUCustomers ? "Yes" : "No" },
      { key: "Processes EU Data", value: data.processesEUData ? "Yes" : "No" },
      { key: "EU AI Act Applies", value: hasEUExposure ? "Yes - Compliance Required" : "Limited Applicability" },
    ]);

    // 4. Compliance Readiness Score
    addSection("Compliance Readiness Score", 4);
    addParagraph(`Based on your assessment responses, your organization's compliance readiness score is ${complianceScore}%.`);
    const scoreMessage = complianceScore >= 70 
      ? "Your organization shows good compliance readiness. Continue monitoring and maintaining your compliance posture." 
      : complianceScore >= 40 
        ? "Your organization has moderate compliance readiness. We recommend addressing the identified gaps to improve your compliance posture." 
        : "Your organization requires significant compliance improvements. Immediate action is recommended to address compliance gaps.";
    addParagraph(scoreMessage);
    y += 5;

    // 5. AI Systems Risk Classification
    addSection("AI Systems Risk Classification", 5);
    addParagraph(`We have identified ${totalSystems} AI system(s) across the following risk categories:`);
    addTable(results.map(r => ({
      key: r.label,
      value: `${r.count} system(s) - ${r.description}`,
    })));

    // 6. Key Compliance Deadlines
    addSection("Key Compliance Deadlines", 6);
    addParagraph("The EU AI Act establishes the following key compliance deadlines:");
    addTable([
      { key: "August 2, 2025", value: "Prohibited AI practices must stop" },
      { key: "August 2, 2026", value: "High-risk AI systems must be compliant" },
      { key: "August 2, 2027", value: "All AI systems must be fully compliant" },
    ]);

    // 7. Recommended Next Steps
    addSection("Recommended Next Steps", 7);
    addParagraph("Based on this assessment, we recommend the following actions:");
    const recommendations = [
      "1. Register all identified AI systems in the Protectron compliance platform",
      "2. Complete detailed risk assessments for each high-risk AI system",
      "3. Generate required compliance documentation (Technical Documentation, Risk Assessments, Data Governance Policies)",
      "4. Implement necessary technical and organizational controls",
      "5. Establish ongoing monitoring and review processes",
      "6. Train relevant staff on EU AI Act requirements",
    ];
    recommendations.forEach(rec => addParagraph(rec));

    // Footer on content pages
    y += 15;
    checkPageBreak(20);
    pdf.setFontSize(9);
    pdf.setTextColor(...gray);
    pdf.setFont("helvetica", "italic");
    pdf.text(`Document generated by Protectron Inc. on ${formatDate()}`, pageWidth / 2, y, { align: "center" });
    y += 6;
    pdf.text("For comprehensive compliance management, visit https://protectron.ai", pageWidth / 2, y, { align: "center" });

    // Add page footers
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      if (i > 1) { // Skip title page
        addFooter(i - 1, totalPages - 1);
      }
    }

    // Save PDF
    const filename = `EU-AI-Act-Assessment-${data.companyName?.replace(/[^a-zA-Z0-9]/g, "_") || "Report"}-${new Date().toISOString().split("T")[0]}.pdf`;
    pdf.save(filename);

    addToast({
      title: "Report downloaded",
      message: "Your compliance assessment report has been saved as a PDF.",
      type: "success",
    });
  };

  const handleContinueToDashboard = async () => {
    setIsSaving(true);
    
    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get user's profile to find organization
        const { data: profile } = await supabase
          .from("profiles")
          .select("organization_id")
          .eq("id", user.id)
          .single();

        if (profile?.organization_id) {
          // Save assessment data to organization
          await supabase
            .from("organizations")
            .update({
              // Store assessment summary in organization for analytics
            })
            .eq("id", profile.organization_id);

          // Create AI systems based on assessment results
          for (const result of results) {
            if (result.count > 0) {
              // Create placeholder AI systems for each risk category
              await supabase.from("ai_systems").insert({
                organization_id: profile.organization_id,
                created_by: user.id,
                name: `${result.level.charAt(0).toUpperCase() + result.level.slice(1)} Risk AI System`,
                description: `AI system identified during initial assessment`,
                system_type: "ml_model",
                risk_level: result.level,
                compliance_status: "not_started",
                compliance_progress: 0,
                serves_eu: hasEUExposure,
                assessment_data: {
                  source: "initial_assessment",
                  assessed_at: new Date().toISOString(),
                  company_name: data?.companyName,
                  industry: data?.industry,
                  compliance_score: complianceScore,
                },
              });
            }
          }
        }
      }

      // Clear localStorage assessment data
      localStorage.removeItem("assessmentData");
      
      addToast({
        title: "Assessment saved",
        message: "Your compliance roadmap is ready",
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
      // Still navigate to dashboard even if save fails
      router.push("/dashboard");
    } finally {
      setIsSaving(false);
    }
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
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        {/* Hero Section */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 mb-4 sm:px-4 sm:py-2 sm:mb-6">
            <TickCircle size={16} className="text-brand-600" variant="Bold" />
            <span className="text-xs font-medium text-brand-700 sm:text-sm">Assessment Complete</span>
          </div>
          
          <h1 className="text-xl font-bold text-primary mb-2 sm:text-display-md sm:mb-3">
            Your Compliance Report
          </h1>
          <p className="text-sm text-tertiary max-w-2xl mx-auto sm:text-lg">
            Based on your assessment, here's a personalized compliance roadmap for{" "}
            <span className="font-semibold text-primary">{data.companyName || "your organization"}</span>
          </p>
        </div>

        {/* Score Card */}
        <div className="mb-6 rounded-xl border border-secondary bg-gradient-to-br from-white to-gray-50 p-4 shadow-lg sm:mb-10 sm:rounded-2xl sm:p-8">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-8">
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
            <div className="grid grid-cols-2 gap-3 flex-1 w-full max-w-sm sm:gap-4">
              <div className="rounded-lg bg-white p-3 shadow-sm border border-gray-100 sm:rounded-xl sm:p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 mb-2 sm:h-10 sm:w-10 sm:mb-3">
                  <Cpu size={18} color="currentColor" className="text-brand-600 sm:hidden" variant="Bold" />
                  <Cpu size={20} color="currentColor" className="text-brand-600 hidden sm:block" variant="Bold" />
                </div>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl">{totalSystems}</p>
                <p className="text-xs text-gray-600 sm:text-sm">AI Systems</p>
              </div>
              
              <div className="rounded-lg bg-white p-3 shadow-sm border border-gray-100 sm:rounded-xl sm:p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning-100 mb-2 sm:h-10 sm:w-10 sm:mb-3">
                  <Warning2 size={18} color="currentColor" className="text-warning-600 sm:hidden" variant="Bold" />
                  <Warning2 size={20} color="currentColor" className="text-warning-600 hidden sm:block" variant="Bold" />
                </div>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {results.find(r => r.level === "high")?.count || 0}
                </p>
                <p className="text-xs text-gray-600 sm:text-sm">High Risk</p>
              </div>
              
              <div className="rounded-lg bg-white p-3 shadow-sm border border-gray-100 sm:rounded-xl sm:p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 mb-2 sm:h-10 sm:w-10 sm:mb-3">
                  <InfoCircle size={18} color="currentColor" className="text-blue-600 sm:hidden" variant="Bold" />
                  <InfoCircle size={20} color="currentColor" className="text-blue-600 hidden sm:block" variant="Bold" />
                </div>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {results.find(r => r.level === "limited")?.count || 0}
                </p>
                <p className="text-xs text-gray-600 sm:text-sm">Limited Risk</p>
              </div>
              
              <div className="rounded-lg bg-white p-3 shadow-sm border border-gray-100 sm:rounded-xl sm:p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success-100 mb-2 sm:h-10 sm:w-10 sm:mb-3">
                  <TickCircle size={18} color="currentColor" className="text-success-600 sm:hidden" variant="Bold" />
                  <TickCircle size={20} color="currentColor" className="text-success-600 hidden sm:block" variant="Bold" />
                </div>
                <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {results.find(r => r.level === "minimal")?.count || 0}
                </p>
                <p className="text-xs text-gray-600 sm:text-sm">Minimal Risk</p>
              </div>
            </div>
          </div>
        </div>

        {/* EU Exposure Alert */}
        {hasEUExposure && (
          <div className="mb-6 rounded-lg border-2 border-warning-300 bg-gradient-to-r from-warning-50 to-warning-100 p-4 sm:mb-8 sm:rounded-xl sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning-200 sm:h-12 sm:w-12">
                <Shield size={20} color="currentColor" className="text-warning-700 sm:hidden" variant="Bold" />
                <Shield size={24} color="currentColor" className="text-warning-700 hidden sm:block" variant="Bold" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-warning-900 sm:text-lg">
                  EU AI Act Applies to Your Organization
                </h3>
                <p className="mt-1 text-sm text-warning-800 sm:text-base">
                  Based on your EU presence (customers, operations, or data processing), you are subject to EU AI Act compliance requirements. Non-compliance can result in fines up to €35 million or 7% of global annual turnover.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Risk Classification */}
        <div className="mb-6 sm:mb-10">
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2 sm:text-xl sm:mb-6">
            <Chart size={20} color="currentColor" className="text-brand-600 sm:hidden" variant="Bold" />
            <Chart size={24} color="currentColor" className="text-brand-600 hidden sm:block" variant="Bold" />
            Risk Classification Summary
          </h2>
          
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            {results.map((result, index) => {
              const Icon = result.icon;
              return (
                <div
                  key={result.level}
                  className={cx(
                    "rounded-lg border-2 p-4 transition-all duration-300 hover:shadow-md sm:rounded-xl sm:p-5",
                    result.borderColor,
                    result.bgColor
                  )}
                  style={{ 
                    animationDelay: `${index * 150}ms`,
                    animation: showContent ? "fadeInUp 0.5s ease-out forwards" : "none"
                  }}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={cx(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-12 sm:w-12 sm:rounded-xl",
                      result.level === "prohibited" && "bg-error-200",
                      result.level === "high" && "bg-warning-200",
                      result.level === "limited" && "bg-blue-200",
                      result.level === "minimal" && "bg-success-200"
                    )}>
                      <Icon size={20} color="currentColor" className={cx(result.color, "sm:hidden")} variant="Bold" />
                      <Icon size={24} color="currentColor" className={cx(result.color, "hidden sm:block")} variant="Bold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <h3 className={cx("font-semibold text-base sm:text-lg", result.color)}>
                          {result.label}
                        </h3>
                        <span className={cx(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-8 sm:w-8 sm:text-sm",
                          result.level === "prohibited" && "bg-error-200 text-error-700",
                          result.level === "high" && "bg-warning-200 text-warning-700",
                          result.level === "limited" && "bg-blue-200 text-blue-700",
                          result.level === "minimal" && "bg-success-200 text-success-700"
                        )}>
                          {result.count}
                        </span>
                      </div>
                      <p className="text-xs text-tertiary sm:text-sm">{result.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Deadlines */}
        <div className="mb-6 sm:mb-10">
          <h2 className="text-lg font-semibold text-primary dark:text-white mb-4 flex items-center gap-2 sm:text-xl sm:mb-6">
            <Calendar className="h-5 w-5 text-brand-600 sm:h-6 sm:w-6" />
            Key Compliance Deadlines
          </h2>
          
          <div className="rounded-lg border border-secondary dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:rounded-xl sm:p-6">
            <div className="space-y-4">
              {/* Deadline 1 - Complete */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                  <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">August 2, 2025</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Prohibited AI practices must stop</p>
                </div>
              </div>
              
              {/* Connector */}
              <div className="ml-5 h-4 w-0.5 bg-gray-200 dark:bg-gray-600" />
              
              {/* Deadline 2 - Current */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900/30 ring-2 ring-brand-600">
                  <Flag05 className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-primary dark:text-white">August 2, 2026</p>
                  <p className="text-sm text-tertiary dark:text-gray-300">High-risk AI systems must be compliant</p>
                </div>
              </div>
              
              {/* Connector */}
              <div className="ml-5 h-4 w-0.5 bg-gray-200 dark:bg-gray-600" />
              
              {/* Deadline 3 - Incomplete */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                  <CheckCircle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-tertiary dark:text-gray-300">August 2, 2027</p>
                  <p className="text-sm text-quaternary dark:text-gray-400">All AI systems must be fully compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white shadow-xl sm:rounded-2xl sm:p-8">
          <div className="flex flex-col items-center gap-4 sm:gap-6 lg:flex-row lg:justify-between">
            <div className="text-center lg:text-left flex-1">
              <h2 className="text-lg font-bold mb-1 sm:text-2xl sm:mb-2">
                Ready to Achieve Compliance?
              </h2>
              <p className="text-sm text-brand-100 sm:text-base">
                Create your free account to track your AI systems, generate required documentation, and monitor your compliance progress in real-time.
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full sm:flex-row sm:gap-3 sm:w-auto shrink-0">
              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20 sm:px-5 sm:py-3"
                onClick={handleDownloadReport}
              >
                <DocumentDownload size={16} color="currentColor" className="text-white sm:hidden" variant="Bold" />
                <DocumentDownload size={18} color="currentColor" className="text-white hidden sm:block" variant="Bold" />
                <span>Download Report</span>
              </button>
              <button
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 disabled:opacity-50 sm:px-5 sm:py-3 animate-pulse-scale"
                onClick={handleContinueToDashboard}
                disabled={isSaving}
              >
                <span>{isSaving ? "Saving..." : "Get Started Free"}</span>
                {!isSaving && <ArrowRight size={16} color="currentColor" className="text-brand-700 sm:hidden" variant="Bold" />}
                {!isSaving && <ArrowRight size={18} color="currentColor" className="text-brand-700 hidden sm:block" variant="Bold" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-tertiary sm:mt-8 sm:text-sm">
          <Clock size={12} color="currentColor" className="inline mr-1 sm:hidden" />
          <Clock size={14} color="currentColor" className="hidden sm:inline mr-1" />
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
        @keyframes pulseScale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        :global(.animate-pulse-scale) {
          animation: pulseScale 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
