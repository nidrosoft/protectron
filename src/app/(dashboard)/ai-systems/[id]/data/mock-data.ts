// Mock AI System data - will be replaced with real API calls
export interface AISystemData {
  id: string;
  name: string;
  description: string;
  riskLevel: "high" | "limited" | "minimal";
  status: "compliant" | "in_progress" | "not_started";
  progress: number;
  provider: string;
  modelName: string;
  category: string;
  deploymentStatus: string;
  createdAt: string;
  updatedAt: string;
  requirements: {
    completed: number;
    total: number;
    sections: {
      id: string;
      title: string;
      article: string;
      items: {
        id: string;
        title: string;
        status: "complete" | "in_progress" | "not_started";
        evidence?: string;
        document?: string;
      }[];
    }[];
  };
  documents: {
    id: string;
    name: string;
    type: string;
    status: "generated" | "draft" | "pending";
    createdAt: string;
    size: string;
  }[];
  evidence: {
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
    uploadedBy: string;
    linkedTo: string;
    size: string;
  }[];
  activity: {
    id: string;
    user: string;
    avatarUrl: string;
    action: string;
    target: string;
    time: string;
  }[];
}

export const mockAISystems: Record<string, AISystemData> = {
  "system-01": {
    id: "system-01",
    name: "Customer Support Chatbot",
    description: "AI-powered chatbot for handling customer inquiries and support tickets. Uses GPT-4 for natural language understanding.",
    riskLevel: "limited",
    status: "compliant",
    progress: 100,
    provider: "OpenAI",
    modelName: "GPT-4",
    category: "Customer Service / Chatbots",
    deploymentStatus: "Production",
    createdAt: "2024-01-15",
    updatedAt: "2024-12-10",
    requirements: {
      completed: 8,
      total: 8,
      sections: [
        {
          id: "sec-1",
          title: "Transparency Requirements",
          article: "Article 52",
          items: [
            { id: "req-1", title: "Disclose AI interaction to users", status: "complete", evidence: "transparency_notice.pdf" },
            { id: "req-2", title: "Provide clear AI identification", status: "complete", document: "User Disclosure Policy" },
          ],
        },
      ],
    },
    documents: [
      { id: "doc-1", name: "Transparency Notice", type: "PDF", status: "generated", createdAt: "2024-12-01", size: "245 KB" },
      { id: "doc-2", name: "User Instructions", type: "PDF", status: "generated", createdAt: "2024-11-28", size: "180 KB" },
    ],
    evidence: [
      { id: "ev-1", name: "transparency_notice.pdf", type: "PDF", uploadedAt: "2024-12-01", uploadedBy: "Sarah Chen", linkedTo: "Transparency Requirements", size: "245 KB" },
    ],
    activity: [
      { id: "act-1", user: "Sarah Chen", avatarUrl: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80", action: "marked requirement complete", target: "Disclose AI interaction", time: "2 hours ago" },
      { id: "act-2", user: "John Miller", avatarUrl: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80", action: "uploaded evidence", target: "transparency_notice.pdf", time: "1 day ago" },
    ],
  },
  "system-02": {
    id: "system-02",
    name: "Automated Hiring Screener",
    description: "ML model for screening job applications and ranking candidates based on qualifications and experience.",
    riskLevel: "high",
    status: "in_progress",
    progress: 50,
    provider: "Custom / In-house",
    modelName: "Custom ML Model",
    category: "Hiring / Recruitment",
    deploymentStatus: "Production",
    createdAt: "2024-02-20",
    updatedAt: "2024-12-12",
    requirements: {
      completed: 12,
      total: 24,
      sections: [
        {
          id: "sec-1",
          title: "Risk Management System",
          article: "Article 9",
          items: [
            { id: "req-1", title: "Establish risk management system", status: "complete", evidence: "risk_management_policy.pdf" },
            { id: "req-2", title: "Identify and analyze known and foreseeable risks", status: "complete", document: "Risk Assessment Report" },
            { id: "req-3", title: "Implement risk mitigation measures", status: "in_progress" },
            { id: "req-4", title: "Conduct testing for risk management", status: "not_started" },
          ],
        },
        {
          id: "sec-2",
          title: "Data Governance",
          article: "Article 10",
          items: [
            { id: "req-5", title: "Implement data governance practices", status: "not_started" },
            { id: "req-6", title: "Document training data characteristics", status: "not_started" },
            { id: "req-7", title: "Ensure data quality for training sets", status: "not_started" },
            { id: "req-8", title: "Address bias in training data", status: "not_started" },
          ],
        },
        {
          id: "sec-3",
          title: "Technical Documentation",
          article: "Article 11",
          items: [
            { id: "req-9", title: "Create comprehensive technical documentation", status: "in_progress" },
            { id: "req-10", title: "Document system architecture", status: "complete" },
            { id: "req-11", title: "Document training methodology", status: "not_started" },
          ],
        },
        {
          id: "sec-4",
          title: "Human Oversight",
          article: "Article 14",
          items: [
            { id: "req-12", title: "Enable human oversight mechanisms", status: "complete" },
            { id: "req-13", title: "Document human review procedures", status: "in_progress" },
          ],
        },
      ],
    },
    documents: [
      { id: "doc-1", name: "Risk Assessment Report", type: "PDF", status: "generated", createdAt: "2024-12-05", size: "1.2 MB" },
      { id: "doc-2", name: "Technical Documentation", type: "PDF", status: "draft", createdAt: "2024-12-10", size: "890 KB" },
      { id: "doc-3", name: "System Architecture", type: "PDF", status: "generated", createdAt: "2024-11-20", size: "2.1 MB" },
      { id: "doc-4", name: "Data Governance Policy", type: "PDF", status: "generated", createdAt: "2024-11-15", size: "520 KB" },
      { id: "doc-5", name: "Bias Mitigation Report", type: "PDF", status: "draft", createdAt: "2024-11-10", size: "1.5 MB" },
      { id: "doc-6", name: "Model Card", type: "PDF", status: "generated", createdAt: "2024-10-28", size: "340 KB" },
      { id: "doc-7", name: "Training Data Summary", type: "PDF", status: "pending", createdAt: "2024-10-20", size: "2.8 MB" },
      { id: "doc-8", name: "Human Oversight Procedures", type: "PDF", status: "generated", createdAt: "2024-10-15", size: "410 KB" },
      { id: "doc-9", name: "Conformity Assessment", type: "PDF", status: "draft", createdAt: "2024-10-10", size: "1.1 MB" },
      { id: "doc-10", name: "EU Declaration of Conformity", type: "PDF", status: "pending", createdAt: "2024-10-05", size: "280 KB" },
      { id: "doc-11", name: "Incident Response Plan", type: "PDF", status: "generated", createdAt: "2024-09-28", size: "650 KB" },
      { id: "doc-12", name: "Post-Market Monitoring Plan", type: "PDF", status: "draft", createdAt: "2024-09-20", size: "720 KB" },
    ],
    evidence: [
      { id: "ev-1", name: "risk_management_policy.pdf", type: "PDF", uploadedAt: "2024-12-01", uploadedBy: "David Park", linkedTo: "Risk Management System", size: "450 KB" },
      { id: "ev-2", name: "bias_audit_report.pdf", type: "PDF", uploadedAt: "2024-11-28", uploadedBy: "Sarah Chen", linkedTo: "Data Governance", size: "780 KB" },
      { id: "ev-3", name: "human_review_logs.csv", type: "CSV", uploadedAt: "2024-12-08", uploadedBy: "John Miller", linkedTo: "Human Oversight", size: "125 KB" },
      { id: "ev-4", name: "training_data_manifest.xlsx", type: "XLSX", uploadedAt: "2024-11-25", uploadedBy: "Olivia Rhye", linkedTo: "Data Governance", size: "2.3 MB" },
      { id: "ev-5", name: "model_validation_results.pdf", type: "PDF", uploadedAt: "2024-11-20", uploadedBy: "David Park", linkedTo: "Technical Documentation", size: "1.8 MB" },
      { id: "ev-6", name: "fairness_metrics.json", type: "JSON", uploadedAt: "2024-11-18", uploadedBy: "Sarah Chen", linkedTo: "Data Governance", size: "45 KB" },
      { id: "ev-7", name: "system_architecture_diagram.png", type: "PNG", uploadedAt: "2024-11-15", uploadedBy: "John Miller", linkedTo: "Technical Documentation", size: "3.2 MB" },
      { id: "ev-8", name: "oversight_committee_minutes.pdf", type: "PDF", uploadedAt: "2024-11-10", uploadedBy: "Olivia Rhye", linkedTo: "Human Oversight", size: "320 KB" },
      { id: "ev-9", name: "data_quality_assessment.pdf", type: "PDF", uploadedAt: "2024-11-05", uploadedBy: "David Park", linkedTo: "Data Governance", size: "890 KB" },
      { id: "ev-10", name: "incident_log_q4.csv", type: "CSV", uploadedAt: "2024-10-30", uploadedBy: "Sarah Chen", linkedTo: "Risk Management System", size: "156 KB" },
      { id: "ev-11", name: "user_feedback_analysis.pdf", type: "PDF", uploadedAt: "2024-10-25", uploadedBy: "John Miller", linkedTo: "Human Oversight", size: "540 KB" },
      { id: "ev-12", name: "compliance_checklist_signed.pdf", type: "PDF", uploadedAt: "2024-10-20", uploadedBy: "Olivia Rhye", linkedTo: "Risk Management System", size: "180 KB" },
    ],
    activity: [
      { id: "act-1", user: "David Park", avatarUrl: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80", action: "started working on", target: "Technical Documentation", time: "3 hours ago" },
      { id: "act-2", user: "Sarah Chen", avatarUrl: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80", action: "uploaded evidence", target: "bias_audit_report.pdf", time: "2 days ago" },
      { id: "act-3", user: "John Miller", avatarUrl: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80", action: "marked requirement complete", target: "Enable human oversight", time: "4 days ago" },
      { id: "act-4", user: "Olivia Rhye", avatarUrl: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80", action: "generated document", target: "Risk Assessment Report", time: "1 week ago" },
      { id: "act-5", user: "David Park", avatarUrl: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80", action: "uploaded evidence", target: "model_validation_results.pdf", time: "1 week ago" },
      { id: "act-6", user: "Sarah Chen", avatarUrl: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80", action: "marked requirement complete", target: "Document system architecture", time: "2 weeks ago" },
      { id: "act-7", user: "John Miller", avatarUrl: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80", action: "generated document", target: "Human Oversight Procedures", time: "2 weeks ago" },
      { id: "act-8", user: "Olivia Rhye", avatarUrl: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80", action: "uploaded evidence", target: "training_data_manifest.xlsx", time: "3 weeks ago" },
      { id: "act-9", user: "David Park", avatarUrl: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80", action: "started working on", target: "Data Governance Policy", time: "3 weeks ago" },
      { id: "act-10", user: "Sarah Chen", avatarUrl: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80", action: "generated document", target: "Model Card", time: "1 month ago" },
      { id: "act-11", user: "John Miller", avatarUrl: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80", action: "uploaded evidence", target: "system_architecture_diagram.png", time: "1 month ago" },
      { id: "act-12", user: "Olivia Rhye", avatarUrl: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80", action: "marked requirement complete", target: "Establish risk management system", time: "1 month ago" },
    ],
  },
};

// Config objects
export const riskLevelConfig = {
  high: { label: "High Risk", color: "warning" as const },
  limited: { label: "Limited Risk", color: "blue" as const },
  minimal: { label: "Minimal Risk", color: "success" as const },
};

export const statusConfig = {
  compliant: { label: "Compliant", color: "success" as const },
  in_progress: { label: "In Progress", color: "warning" as const },
  not_started: { label: "Not Started", color: "gray" as const },
};

export const ITEMS_PER_PAGE = 8;
