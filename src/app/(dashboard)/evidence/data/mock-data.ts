import type { SelectItemType } from "@/components/base/select/select";

// Filter options
export const typeFilterOptions: SelectItemType[] = [
  { id: "all", label: "All Types" },
  { id: "pdf", label: "PDF" },
  { id: "csv", label: "CSV" },
  { id: "xlsx", label: "Excel" },
  { id: "json", label: "JSON" },
  { id: "png", label: "Image" },
];

export const systemFilterOptions: SelectItemType[] = [
  { id: "all", label: "All Systems" },
  { id: "system-01", label: "Customer Support Chatbot" },
  { id: "system-02", label: "Automated Hiring Screener" },
  { id: "system-03", label: "Fraud Detection System" },
];

export const linkedToFilterOptions: SelectItemType[] = [
  { id: "all", label: "All Categories" },
  { id: "risk-management", label: "Risk Management System" },
  { id: "data-governance", label: "Data Governance" },
  { id: "human-oversight", label: "Human Oversight" },
  { id: "technical-documentation", label: "Technical Documentation" },
];

export interface Evidence {
  id: string;
  name: string;
  type: string;
  systemId: string;
  systemName: string;
  linkedTo: string;
  linkedToId: string;
  uploadedBy: string;
  uploadedByAvatar: string;
  uploadedAt: string;
  size: string;
}

// Mock evidence data
export const mockEvidence: Evidence[] = [
  {
    id: "ev-1",
    name: "risk_management_policy.pdf",
    type: "PDF",
    systemId: "system-02",
    systemName: "Automated Hiring Screener",
    linkedTo: "Risk Management System",
    linkedToId: "risk-management",
    uploadedBy: "David Park",
    uploadedByAvatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80",
    uploadedAt: "Dec 1, 2024",
    size: "450 KB",
  },
  {
    id: "ev-2",
    name: "bias_audit_report.pdf",
    type: "PDF",
    systemId: "system-02",
    systemName: "Automated Hiring Screener",
    linkedTo: "Data Governance",
    linkedToId: "data-governance",
    uploadedBy: "Sarah Chen",
    uploadedByAvatar: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80",
    uploadedAt: "Nov 28, 2024",
    size: "780 KB",
  },
  {
    id: "ev-3",
    name: "human_review_logs.csv",
    type: "CSV",
    systemId: "system-02",
    systemName: "Automated Hiring Screener",
    linkedTo: "Human Oversight",
    linkedToId: "human-oversight",
    uploadedBy: "John Miller",
    uploadedByAvatar: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80",
    uploadedAt: "Dec 8, 2024",
    size: "125 KB",
  },
  {
    id: "ev-4",
    name: "training_data_manifest.xlsx",
    type: "XLSX",
    systemId: "system-02",
    systemName: "Automated Hiring Screener",
    linkedTo: "Data Governance",
    linkedToId: "data-governance",
    uploadedBy: "Olivia Rhye",
    uploadedByAvatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80",
    uploadedAt: "Nov 25, 2024",
    size: "2.3 MB",
  },
  {
    id: "ev-5",
    name: "model_validation_results.pdf",
    type: "PDF",
    systemId: "system-03",
    systemName: "Fraud Detection System",
    linkedTo: "Technical Documentation",
    linkedToId: "technical-documentation",
    uploadedBy: "David Park",
    uploadedByAvatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80",
    uploadedAt: "Nov 20, 2024",
    size: "1.8 MB",
  },
  {
    id: "ev-6",
    name: "fairness_metrics.json",
    type: "JSON",
    systemId: "system-02",
    systemName: "Automated Hiring Screener",
    linkedTo: "Data Governance",
    linkedToId: "data-governance",
    uploadedBy: "Sarah Chen",
    uploadedByAvatar: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80",
    uploadedAt: "Nov 18, 2024",
    size: "45 KB",
  },
  {
    id: "ev-7",
    name: "system_architecture_diagram.png",
    type: "PNG",
    systemId: "system-01",
    systemName: "Customer Support Chatbot",
    linkedTo: "Technical Documentation",
    linkedToId: "technical-documentation",
    uploadedBy: "John Miller",
    uploadedByAvatar: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80",
    uploadedAt: "Nov 15, 2024",
    size: "3.2 MB",
  },
  {
    id: "ev-8",
    name: "oversight_committee_minutes.pdf",
    type: "PDF",
    systemId: "system-01",
    systemName: "Customer Support Chatbot",
    linkedTo: "Human Oversight",
    linkedToId: "human-oversight",
    uploadedBy: "Olivia Rhye",
    uploadedByAvatar: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80",
    uploadedAt: "Nov 10, 2024",
    size: "320 KB",
  },
  {
    id: "ev-9",
    name: "data_quality_assessment.pdf",
    type: "PDF",
    systemId: "system-03",
    systemName: "Fraud Detection System",
    linkedTo: "Data Governance",
    linkedToId: "data-governance",
    uploadedBy: "David Park",
    uploadedByAvatar: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80",
    uploadedAt: "Nov 5, 2024",
    size: "890 KB",
  },
  {
    id: "ev-10",
    name: "incident_log_q4.csv",
    type: "CSV",
    systemId: "system-03",
    systemName: "Fraud Detection System",
    linkedTo: "Risk Management System",
    linkedToId: "risk-management",
    uploadedBy: "Sarah Chen",
    uploadedByAvatar: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80",
    uploadedAt: "Oct 30, 2024",
    size: "156 KB",
  },
];

// Get file icon type
export const getFileIconType = (type: string): string => {
  const typeMap: Record<string, string> = {
    PDF: "pdf",
    CSV: "csv",
    XLSX: "xls",
    JSON: "json",
    PNG: "image",
    JPG: "image",
    JPEG: "image",
  };
  return typeMap[type.toUpperCase()] || "file";
};

// Linked to badge color
export const getLinkedToBadgeColor = (linkedToId: string): "brand" | "warning" | "purple" | "blue" => {
  const colorMap: Record<string, "brand" | "warning" | "purple" | "blue"> = {
    "risk-management": "warning",
    "data-governance": "purple",
    "human-oversight": "blue",
    "technical-documentation": "brand",
  };
  return colorMap[linkedToId] || "brand";
};
