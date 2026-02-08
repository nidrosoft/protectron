/**
 * Quick Comply - Constants
 *
 * Section definitions, progress weights, and shared constants
 * for the Quick Comply feature.
 */

import type { Section, SectionId, Progress } from "./types";

// ============================================================================
// Section Definitions
// ============================================================================

export const SECTIONS: Section[] = [
  {
    id: "company_info",
    name: "Company Information",
    description: "Organization name, location, industry, and contact details",
    icon: "🏢",
    weight: 10,
    estimatedMinutes: 3,
    questionCount: 6,
  },
  {
    id: "ai_system_details",
    name: "AI System Details",
    description: "System name, purpose, technology, and deployment",
    icon: "🤖",
    weight: 20,
    estimatedMinutes: 8,
    questionCount: 9,
  },
  {
    id: "risk_and_data",
    name: "Risk & Data",
    description: "Risk classification, data types, and data subjects",
    icon: "⚠️",
    weight: 25,
    estimatedMinutes: 12,
    questionCount: 10,
  },
  {
    id: "human_oversight",
    name: "Human Oversight",
    description: "Monitoring, intervention, and escalation procedures",
    icon: "👁️",
    weight: 15,
    estimatedMinutes: 8,
    questionCount: 7,
  },
  {
    id: "testing_metrics",
    name: "Testing & Metrics",
    description: "Accuracy, testing methodology, and validation",
    icon: "🧪",
    weight: 15,
    estimatedMinutes: 8,
    questionCount: 7,
  },
  {
    id: "transparency",
    name: "Transparency",
    description: "User notifications, disclosures, and feedback",
    icon: "📋",
    weight: 10,
    estimatedMinutes: 5,
    questionCount: 5,
  },
  {
    id: "review_generate",
    name: "Review & Generate",
    description: "Final review and document generation",
    icon: "📄",
    weight: 5,
    estimatedMinutes: 3,
    questionCount: 0,
  },
];

export const SECTION_ORDER: SectionId[] = SECTIONS.map((s) => s.id);

export const SECTION_WEIGHTS: Record<SectionId, number> = Object.fromEntries(
  SECTIONS.map((s) => [s.id, s.weight])
) as Record<SectionId, number>;

// ============================================================================
// Initial Progress State
// ============================================================================

export function getInitialProgress(): Progress {
  return {
    overall: 0,
    sections: Object.fromEntries(
      SECTIONS.map((s) => [s.id, { status: "not_started" as const, progress: 0 }])
    ) as Progress["sections"],
    documentsReady: 0,
    totalDocuments: 7,
    estimatedTimeRemaining: SECTIONS.reduce((t, s) => t + s.estimatedMinutes, 0),
  };
}

// ============================================================================
// Section Helpers
// ============================================================================

export function getNextSection(currentSection: SectionId): SectionId {
  const currentIndex = SECTION_ORDER.indexOf(currentSection);
  return SECTION_ORDER[currentIndex + 1] || "review_generate";
}

export function getPreviousSection(currentSection: SectionId): SectionId | null {
  const currentIndex = SECTION_ORDER.indexOf(currentSection);
  if (currentIndex <= 0) return null;
  return SECTION_ORDER[currentIndex - 1];
}

export function getSectionByIndex(index: number): Section | undefined {
  return SECTIONS[index];
}

export function getSectionById(id: SectionId): Section | undefined {
  return SECTIONS.find((s) => s.id === id);
}

export function calculateOverallProgress(
  sectionsCompleted: SectionId[],
  currentSection: SectionId,
  currentSectionProgress: number
): number {
  let total = 0;

  for (const section of SECTIONS) {
    if (sectionsCompleted.includes(section.id)) {
      total += section.weight;
    } else if (section.id === currentSection) {
      total += (section.weight * currentSectionProgress) / 100;
    }
  }

  return Math.round(total);
}

// ============================================================================
// Document Helpers
// ============================================================================

export const DOCUMENT_TITLES: Record<string, string> = {
  technical_documentation: "Technical Documentation",
  risk_assessment: "Risk Assessment Report",
  data_governance: "Data Governance Policy",
  human_oversight: "Human Oversight Procedures",
  instructions_for_use: "Instructions for Use",
  conformity_assessment: "Conformity Assessment Checklist",
  eu_declaration: "EU Declaration of Conformity",
  qms: "Quality Management System",
  logging_plan: "Record-Keeping & Logging Plan",
  post_market_monitoring: "Post-Market Monitoring Plan",
  incident_response: "Serious Incident Response Plan",
  accuracy_testing: "Accuracy & Robustness Testing Report",
  cybersecurity_assessment: "Cybersecurity Assessment",
  eu_db_registration: "EU Database Registration Package",
  transparency_notice: "Transparency Notice",
  training_data_doc: "Training Data Documentation",
  bias_assessment: "Bias & Fairness Assessment",
  change_management: "Change Management Log",
  ce_marking: "CE Marking Documentation",
  standards_mapping: "Harmonised Standards Mapping",
  fria: "Fundamental Rights Impact Assessment (FRIA)",
};

export function getDocumentTitle(docType: string): string {
  return DOCUMENT_TITLES[docType] || docType;
}

// ============================================================================
// Initial Form Data
// ============================================================================

export function getInitialFormData() {
  return {
    company_info: {},
    ai_system_details: {},
    risk_and_data: { data_types: [], data_subjects: [], special_categories: [] },
    human_oversight: {},
    testing_metrics: {},
    transparency: {},
  };
}
