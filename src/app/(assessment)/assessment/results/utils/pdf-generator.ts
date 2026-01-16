import jsPDF from "jspdf";
import type { AssessmentData, EnhancedAssessmentResults } from "../data/enhanced-risk-calculator";

// Brand colors (RGB)
const COLORS = {
  brandPurple: [127, 86, 217] as [number, number, number],
  gray: [102, 112, 133] as [number, number, number],
  darkGray: [52, 64, 84] as [number, number, number],
  lightPurple: [249, 245, 255] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  error: [220, 38, 38] as [number, number, number],
  warning: [249, 115, 22] as [number, number, number],
  success: [34, 197, 94] as [number, number, number],
  blue: [59, 130, 246] as [number, number, number],
};

export async function generateEnhancedPDFReport(
  data: AssessmentData,
  results: EnhancedAssessmentResults
): Promise<void> {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;
  let currentPage = 1;

  const formatDate = () =>
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Helper: Check page break
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 15) {
      pdf.addPage();
      currentPage++;
      y = margin;
      addHeader();
    }
  };

  // Helper: Add header to each page
  const addHeader = () => {
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.gray);
    pdf.text("EU AI Act Compliance Assessment  |  Confidential", pageWidth - margin, 10, {
      align: "right",
    });
  };

  // Helper: Add section title
  const addSection = (title: string, sectionNum?: number) => {
    checkPageBreak(20);
    pdf.setFontSize(14);
    pdf.setTextColor(...COLORS.brandPurple);
    pdf.setFont("helvetica", "bold");
    const text = sectionNum ? `${sectionNum}. ${title}` : title;
    pdf.text(text, margin, y);
    y += 10;
  };

  // Helper: Add paragraph
  const addParagraph = (text: string, indent = 0) => {
    pdf.setFontSize(10);
    pdf.setTextColor(...COLORS.darkGray);
    pdf.setFont("helvetica", "normal");
    const lines = pdf.splitTextToSize(text, contentWidth - indent);
    checkPageBreak(lines.length * 5 + 5);
    pdf.text(lines, margin + indent, y);
    y += lines.length * 5 + 5;
  };

  // Helper: Add bullet point
  const addBullet = (text: string, indent = 0) => {
    pdf.setFontSize(10);
    pdf.setTextColor(...COLORS.darkGray);
    pdf.setFont("helvetica", "normal");
    const bulletX = margin + indent;
    const textX = bulletX + 8;
    const lines = pdf.splitTextToSize(text, contentWidth - indent - 8);
    checkPageBreak(lines.length * 5 + 3);
    pdf.text("•", bulletX, y);
    pdf.text(lines, textX, y);
    y += lines.length * 5 + 3;
  };

  // Helper: Add table
  const addTable = (items: { key: string; value: string }[]) => {
    const rowHeight = 8;
    const col1Width = 60;
    const col2Width = contentWidth - col1Width;

    checkPageBreak((items.length + 1) * rowHeight + 10);

    // Header row
    pdf.setFillColor(...COLORS.brandPurple);
    pdf.rect(margin, y, contentWidth, rowHeight, "F");
    pdf.setFontSize(9);
    pdf.setTextColor(...COLORS.white);
    pdf.setFont("helvetica", "bold");
    pdf.text("Property", margin + 3, y + 5.5);
    pdf.text("Value", margin + col1Width + 3, y + 5.5);
    y += rowHeight;

    // Data rows
    items.forEach((item, index) => {
      if (index % 2 === 1) {
        pdf.setFillColor(...COLORS.lightPurple);
        pdf.rect(margin, y, contentWidth, rowHeight, "F");
      }

      pdf.setDrawColor(228, 231, 236);
      pdf.rect(margin, y, col1Width, rowHeight);
      pdf.rect(margin + col1Width, y, col2Width, rowHeight);

      pdf.setFontSize(9);
      pdf.setTextColor(...COLORS.darkGray);
      pdf.setFont("helvetica", "normal");
      pdf.text(item.key, margin + 3, y + 5.5);

      const valueLines = pdf.splitTextToSize(item.value, col2Width - 6);
      pdf.text(valueLines[0], margin + col1Width + 3, y + 5.5);

      y += rowHeight;
    });
    y += 8;
  };

  // Helper: Add risk badge
  const addRiskBadge = (level: string, x: number, yPos: number) => {
    const colors: Record<string, [number, number, number]> = {
      prohibited: COLORS.error,
      high: COLORS.warning,
      limited: COLORS.blue,
      minimal: COLORS.success,
    };
    const color = colors[level] || COLORS.gray;
    pdf.setFillColor(...color);
    pdf.roundedRect(x, yPos - 4, 25, 6, 1, 1, "F");
    pdf.setFontSize(7);
    pdf.setTextColor(...COLORS.white);
    pdf.setFont("helvetica", "bold");
    pdf.text(level.toUpperCase(), x + 2, yPos);
  };

  // ============================================
  // COVER PAGE
  // ============================================
  y = 70;
  pdf.setFontSize(28);
  pdf.setTextColor(...COLORS.brandPurple);
  pdf.setFont("helvetica", "bold");
  pdf.text("EU AI Act Compliance", pageWidth / 2, y, { align: "center" });
  y += 12;
  pdf.text("Assessment Report", pageWidth / 2, y, { align: "center" });

  y += 25;
  pdf.setFontSize(14);
  pdf.setTextColor(...COLORS.gray);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Prepared for ${data.companyName || "Your Organization"}`, pageWidth / 2, y, {
    align: "center",
  });

  y += 15;
  pdf.setFontSize(12);
  pdf.setTextColor(...COLORS.darkGray);
  pdf.setFont("helvetica", "bold");
  pdf.text(formatDate(), pageWidth / 2, y, { align: "center" });

  y += 25;

  // Score circle
  pdf.setFillColor(...COLORS.lightPurple);
  pdf.circle(pageWidth / 2, y + 15, 25, "F");
  pdf.setFontSize(24);
  pdf.setTextColor(...COLORS.brandPurple);
  pdf.setFont("helvetica", "bold");
  pdf.text(`${results.complianceScore}%`, pageWidth / 2, y + 18, { align: "center" });
  pdf.setFontSize(8);
  pdf.setTextColor(...COLORS.gray);
  pdf.setFont("helvetica", "normal");
  pdf.text("Compliance Score", pageWidth / 2, y + 28, { align: "center" });

  y += 55;
  pdf.setFontSize(10);
  pdf.setTextColor(...COLORS.gray);
  pdf.setFont("helvetica", "italic");
  pdf.text("Generated by Protectron - EU AI Act Compliance Platform", pageWidth / 2, y, {
    align: "center",
  });

  // ============================================
  // TABLE OF CONTENTS
  // ============================================
  pdf.addPage();
  currentPage++;
  y = margin;
  addHeader();

  addSection("Table of Contents");
  y += 5;

  const tocItems = [
    "1. Executive Summary",
    "2. Company Information",
    "3. AI Systems Detected",
    "4. Compliance Gaps Analysis",
    "5. Applicable EU AI Act Articles",
    "6. Compliance Roadmap",
    "7. Timeline & Deadlines",
    "8. Recommended Next Steps",
  ];

  tocItems.forEach((item) => {
    pdf.setFontSize(11);
    pdf.setTextColor(...COLORS.darkGray);
    pdf.setFont("helvetica", "normal");
    pdf.text(item, margin + 10, y);
    y += 8;
  });

  // ============================================
  // SECTION 1: EXECUTIVE SUMMARY
  // ============================================
  pdf.addPage();
  currentPage++;
  y = margin;
  addHeader();

  addSection("Executive Summary", 1);

  addParagraph(
    `This compliance assessment report provides a comprehensive overview of ${data.companyName || "your organization"}'s AI systems and their compliance status under the EU AI Act. Based on the information provided, we have identified ${results.totalSystems} AI system(s) that require compliance attention.`
  );

  addParagraph(
    `Your current compliance readiness score is ${results.complianceScore}%. ${
      results.hasEUExposure
        ? "As your organization has EU exposure through customers, operations, or data processing, you are subject to EU AI Act requirements."
        : "Based on your responses, your EU exposure level has been assessed."
    }`
  );

  y += 5;

  // Key metrics table
  addTable([
    { key: "Compliance Score", value: `${results.complianceScore}%` },
    { key: "AI Systems Detected", value: `${results.totalSystems}` },
    { key: "Total Requirements", value: `${results.totalRequirements}` },
    { key: "Documents Needed", value: `${results.totalDocuments}` },
    { key: "Estimated Timeline", value: `${results.estimatedWeeks}-${results.estimatedWeeks + 2} weeks` },
    { key: "Primary Deadline", value: "August 2, 2026" },
  ]);

  // ============================================
  // SECTION 2: COMPANY INFORMATION
  // ============================================
  addSection("Company Information", 2);

  addTable([
    { key: "Company Name", value: data.companyName || "Not provided" },
    { key: "Industry", value: data.industry || "Not provided" },
    { key: "Company Size", value: data.companySize || "Not provided" },
    { key: "Country", value: data.country || "Not provided" },
    { key: "EU Operations", value: data.hasEUOperations ? "Yes" : "No" },
    { key: "EU Customers", value: data.hasEUCustomers ? "Yes" : "No" },
    { key: "Processes EU Data", value: data.processesEUData ? "Yes" : "No" },
    { key: "EU AI Act Applies", value: results.hasEUExposure ? "Yes - Compliance Required" : "Limited Applicability" },
  ]);

  // ============================================
  // SECTION 3: AI SYSTEMS DETECTED
  // ============================================
  pdf.addPage();
  currentPage++;
  y = margin;
  addHeader();

  addSection("AI Systems Detected", 3);

  addParagraph(
    `We have identified ${results.totalSystems} AI system(s) based on your assessment responses. Each system has been classified according to the EU AI Act risk framework.`
  );

  y += 5;

  results.detectedSystems.forEach((system, index) => {
    checkPageBreak(50);

    // System header
    pdf.setFillColor(...COLORS.lightPurple);
    pdf.roundedRect(margin, y, contentWidth, 8, 2, 2, "F");
    pdf.setFontSize(10);
    pdf.setTextColor(...COLORS.brandPurple);
    pdf.setFont("helvetica", "bold");
    pdf.text(`AI System ${index + 1}: ${system.name}`, margin + 3, y + 5.5);

    // Risk badge
    addRiskBadge(system.riskLevel, pageWidth - margin - 30, y + 5.5);
    y += 12;

    addParagraph(`Category: ${system.category}`, 5);
    addParagraph(`Risk Reason: ${system.riskReason}`, 5);
    addParagraph(`Requirements: ${system.requirementsCount} | Documents: ${system.documentsNeeded.length} | Deadline: ${system.deadline}`, 5);

    y += 5;
  });

  // ============================================
  // SECTION 4: COMPLIANCE GAPS
  // ============================================
  pdf.addPage();
  currentPage++;
  y = margin;
  addHeader();

  addSection("Compliance Gaps Analysis", 4);

  addParagraph("Based on our analysis, here are the compliance gaps that need to be addressed:");

  y += 5;

  const criticalGaps = results.complianceGaps.filter((g) => g.priority === "critical");
  const importantGaps = results.complianceGaps.filter((g) => g.priority === "important");
  const recommendedGaps = results.complianceGaps.filter((g) => g.priority === "recommended");

  if (criticalGaps.length > 0) {
    checkPageBreak(20);
    pdf.setFontSize(11);
    pdf.setTextColor(...COLORS.error);
    pdf.setFont("helvetica", "bold");
    pdf.text("Critical Gaps (Must Address Immediately)", margin, y);
    y += 8;

    criticalGaps.forEach((gap) => {
      addBullet(`${gap.title} - ${gap.description} (${gap.articleRef})`, 5);
    });
    y += 5;
  }

  if (importantGaps.length > 0) {
    checkPageBreak(20);
    pdf.setFontSize(11);
    pdf.setTextColor(...COLORS.warning);
    pdf.setFont("helvetica", "bold");
    pdf.text("Important Gaps (Address Before Deadline)", margin, y);
    y += 8;

    importantGaps.forEach((gap) => {
      addBullet(`${gap.title} - ${gap.description} (${gap.articleRef})`, 5);
    });
    y += 5;
  }

  if (recommendedGaps.length > 0) {
    checkPageBreak(20);
    pdf.setFontSize(11);
    pdf.setTextColor(...COLORS.blue);
    pdf.setFont("helvetica", "bold");
    pdf.text("Recommended (Best Practice)", margin, y);
    y += 8;

    recommendedGaps.forEach((gap) => {
      addBullet(`${gap.title} - ${gap.description}`, 5);
    });
    y += 5;
  }

  // ============================================
  // SECTION 5: APPLICABLE ARTICLES
  // ============================================
  pdf.addPage();
  currentPage++;
  y = margin;
  addHeader();

  addSection("Applicable EU AI Act Articles", 5);

  addParagraph(
    `Based on your AI systems, the following ${results.applicableArticles.length} EU AI Act articles apply to your organization:`
  );

  y += 5;

  results.applicableArticles.forEach((article) => {
    checkPageBreak(40);

    // Article header
    pdf.setFillColor(...COLORS.brandPurple);
    pdf.roundedRect(margin, y, contentWidth, 8, 2, 2, "F");
    pdf.setFontSize(10);
    pdf.setTextColor(...COLORS.white);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Article ${article.number}: ${article.title}`, margin + 3, y + 5.5);
    pdf.text(`${article.requirements.length} requirements`, pageWidth - margin - 35, y + 5.5);
    y += 12;

    addParagraph(`What It Means: ${article.plainExplanation}`, 5);

    pdf.setFontSize(9);
    pdf.setTextColor(...COLORS.gray);
    pdf.setFont("helvetica", "italic");
    pdf.text(`Documents needed: ${article.documentsNeeded.join(", ")}`, margin + 5, y);
    y += 8;

    y += 5;
  });

  // ============================================
  // SECTION 6: COMPLIANCE ROADMAP
  // ============================================
  pdf.addPage();
  currentPage++;
  y = margin;
  addHeader();

  addSection("Compliance Roadmap", 6);

  addParagraph(
    `Follow this phased approach to achieve EU AI Act compliance. Estimated timeline: ${results.estimatedWeeks}-${results.estimatedWeeks + 2} weeks.`
  );

  y += 5;

  results.roadmapPhases.forEach((phase) => {
    checkPageBreak(30);

    pdf.setFontSize(11);
    pdf.setTextColor(...COLORS.brandPurple);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Phase ${phase.phase}: ${phase.title} (${phase.timeframe})`, margin, y);
    y += 8;

    phase.steps.forEach((step) => {
      addBullet(`Step ${step.stepNumber}: ${step.title} - ${step.description}`, 5);
    });

    y += 5;
  });

  // ============================================
  // SECTION 7: TIMELINE & DEADLINES
  // ============================================
  addSection("Timeline & Deadlines", 7);

  addParagraph("The EU AI Act establishes the following key compliance deadlines:");

  y += 5;

  addTable([
    { key: "February 2, 2025", value: "Prohibited AI practices must stop" },
    { key: "August 2, 2025", value: "GPAI transparency rules apply" },
    { key: "August 2, 2026", value: "High-risk AI systems must be compliant (YOUR DEADLINE)" },
    { key: "August 2, 2027", value: "All AI systems must be fully compliant" },
  ]);

  addParagraph(
    `You have approximately ${results.daysUntilDeadline} days until the August 2, 2026 deadline. Starting now gives you adequate time to achieve compliance.`
  );

  // ============================================
  // SECTION 8: NEXT STEPS
  // ============================================
  pdf.addPage();
  currentPage++;
  y = margin;
  addHeader();

  addSection("Recommended Next Steps", 8);

  addParagraph("Based on this assessment, we recommend the following immediate actions:");

  y += 5;

  const recommendations = [
    "Register all identified AI systems in the Protectron compliance platform",
    "Complete detailed risk assessments for each high-risk AI system",
    "Generate required compliance documentation using Protectron's AI-powered tools",
    "Implement necessary technical controls (audit logging, human oversight)",
    "Establish ongoing monitoring and review processes",
    "Train relevant staff on EU AI Act requirements",
    "Schedule internal compliance review before August 2026 deadline",
  ];

  recommendations.forEach((rec, index) => {
    addBullet(`${rec}`, 0);
  });

  y += 10;

  // Final CTA
  pdf.setFillColor(...COLORS.brandPurple);
  pdf.roundedRect(margin, y, contentWidth, 25, 3, 3, "F");
  pdf.setFontSize(12);
  pdf.setTextColor(...COLORS.white);
  pdf.setFont("helvetica", "bold");
  pdf.text("Ready to Start Your Compliance Journey?", pageWidth / 2, y + 10, { align: "center" });
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("Visit protectron.ai to access your dashboard and begin implementation", pageWidth / 2, y + 18, {
    align: "center",
  });

  // ============================================
  // ADD PAGE FOOTERS
  // ============================================
  const totalPages = pdf.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(...COLORS.gray);
    pdf.text(
      `Protectron Inc.  |  Page ${i - 1} of ${totalPages - 1}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // ============================================
  // SAVE PDF
  // ============================================
  const filename = `EU-AI-Act-Assessment-${
    data.companyName?.replace(/[^a-zA-Z0-9]/g, "_") || "Report"
  }-${new Date().toISOString().split("T")[0]}.pdf`;

  pdf.save(filename);
}
