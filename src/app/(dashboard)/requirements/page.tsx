"use client";

import { useState, useMemo } from "react";
import type { Key } from "react-aria-components";
import {
  TickSquare,
  SearchNormal1,
  Cpu,
} from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Select, type SelectItemType } from "@/components/base/select/select";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { UploadModal } from "@/components/application/modals/upload-modal";
import {
  RequirementSection,
  RequirementDetailSlideout,
  type Requirement,
  type RequirementStatus,
} from "@/components/application/requirements";

// Filter options
const statusFilterOptions: SelectItemType[] = [
  { id: "all", label: "All Status" },
  { id: "not_started", label: "Not Started" },
  { id: "in_progress", label: "In Progress" },
  { id: "complete", label: "Complete" },
  { id: "not_applicable", label: "Not Applicable" },
];

const systemFilterOptions: SelectItemType[] = [
  { id: "all", label: "All Systems" },
  { id: "system-01", label: "Customer Support Chatbot" },
  { id: "system-02", label: "Automated Hiring Screener" },
  { id: "system-03", label: "Fraud Detection System" },
];

// Mock requirements data grouped by article
const mockRequirements: Requirement[] = [
  // Risk Management System (Article 9)
  {
    id: "req-1",
    title: "Establish risk management system",
    description: "Implement a comprehensive risk management system for the AI system.",
    status: "complete",
    articleId: "Article 9",
    articleTitle: "Risk Management System",
    systemId: "system-02",
    systemName: "Automated Hiring Screener",
    linkedEvidence: { id: "ev-1", name: "risk_management_policy.pdf", type: "PDF" },
  },
  {
    id: "req-2",
    title: "Identify and analyze known and foreseeable risks",
    description: "Document all known and foreseeable risks associated with the AI system.",
    status: "complete",
    articleId: "Article 9",
    articleTitle: "Risk Management System",
    systemId: "system-02",
    systemName: "Automated Hiring Screener",
    linkedDocument: { id: "doc-1", name: "Risk Assessment Report", type: "generated" },
  },
  {
    id: "req-3",
    title: "Implement risk mitigation measures",
    description: "Put in place appropriate risk mitigation measures.",
    status: "in_progress",
    articleId: "Article 9",
    articleTitle: "Risk Management System",
    systemId: "system-02",
    systemName: "Automated Hiring Screener",
  },
  {
    id: "req-4",
    title: "Conduct testing for risk management",
    description: "Test the effectiveness of risk management measures.",
    status: "not_started",
    articleId: "Article 9",
    articleTitle: "Risk Management System",
    systemId: "system-02",
    systemName: "Automated Hiring Screener",
  },
  // Data Governance (Article 10)
  {
    id: "req-5",
    title: "Implement data governance practices",
    description: "Establish data governance and management practices.",
    status: "complete",
    articleId: "Article 10",
    articleTitle: "Data Governance",
    systemId: "system-02",
    systemName: "Automated Hiring Screener",
    linkedEvidence: { id: "ev-2", name: "data_governance_policy.pdf", type: "PDF" },
  },
  {
    id: "req-6",
    title: "Document training data characteristics",
    description: "Document the characteristics of training, validation, and testing datasets.",
    status: "in_progress",
    articleId: "Article 10",
    articleTitle: "Data Governance",
    systemId: "system-02",
    systemName: "Automated Hiring Screener",
  },
  {
    id: "req-7",
    title: "Ensure data quality for training sets",
    description: "Implement measures to ensure data quality.",
    status: "not_started",
    articleId: "Article 10",
    articleTitle: "Data Governance",
    systemId: "system-02",
    systemName: "Automated Hiring Screener",
  },
  {
    id: "req-8",
    title: "Address bias in training data",
    description: "Identify and address potential biases in training data.",
    status: "not_started",
    articleId: "Article 10",
    articleTitle: "Data Governance",
    systemId: "system-02",
    systemName: "Automated Hiring Screener",
  },
  // Human Oversight (Article 14)
  {
    id: "req-9",
    title: "Enable human oversight capabilities",
    description: "Design the system to allow effective human oversight.",
    status: "complete",
    articleId: "Article 14",
    articleTitle: "Human Oversight",
    systemId: "system-02",
    systemName: "Automated Hiring Screener",
    linkedDocument: { id: "doc-2", name: "Human Oversight Procedures", type: "generated" },
  },
  {
    id: "req-10",
    title: "Provide intervention mechanisms",
    description: "Implement mechanisms for human intervention.",
    status: "in_progress",
    articleId: "Article 14",
    articleTitle: "Human Oversight",
    systemId: "system-02",
    systemName: "Automated Hiring Screener",
  },
  // Technical Documentation (Article 11) - Different system
  {
    id: "req-11",
    title: "Create technical documentation",
    description: "Prepare comprehensive technical documentation.",
    status: "complete",
    articleId: "Article 11",
    articleTitle: "Technical Documentation",
    systemId: "system-01",
    systemName: "Customer Support Chatbot",
    linkedDocument: { id: "doc-3", name: "Technical Documentation", type: "generated" },
  },
  {
    id: "req-12",
    title: "Document system architecture",
    description: "Document the overall system architecture and components.",
    status: "complete",
    articleId: "Article 11",
    articleTitle: "Technical Documentation",
    systemId: "system-01",
    systemName: "Customer Support Chatbot",
    linkedEvidence: { id: "ev-3", name: "system_architecture.pdf", type: "PDF" },
  },
];

// Group requirements by article
const groupRequirementsByArticle = (requirements: Requirement[]) => {
  const grouped: Record<string, { articleId: string; articleTitle: string; requirements: Requirement[] }> = {};
  
  requirements.forEach((req) => {
    const key = req.articleId;
    if (!grouped[key]) {
      grouped[key] = {
        articleId: req.articleId,
        articleTitle: req.articleTitle,
        requirements: [],
      };
    }
    grouped[key].requirements.push(req);
  });
  
  return Object.values(grouped);
};

export default function RequirementsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [systemFilter, setSystemFilter] = useState("all");
  const [isDetailSlideoutOpen, setIsDetailSlideoutOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Filter requirements
  const filteredRequirements = useMemo(() => {
    return mockRequirements.filter((req) => {
      const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.articleTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || req.status === statusFilter;
      const matchesSystem = systemFilter === "all" || req.systemId === systemFilter;
      return matchesSearch && matchesStatus && matchesSystem;
    });
  }, [searchQuery, statusFilter, systemFilter]);

  // Group filtered requirements
  const groupedRequirements = useMemo(() => {
    return groupRequirementsByArticle(filteredRequirements);
  }, [filteredRequirements]);

  // Calculate overall progress
  const completedCount = mockRequirements.filter(
    (r) => r.status === "complete" || r.status === "not_applicable"
  ).length;
  const totalCount = mockRequirements.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const isEmpty = mockRequirements.length === 0;

  const handleRequirementClick = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setIsDetailSlideoutOpen(true);
  };

  const handleUploadEvidence = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setIsUploadModalOpen(true);
  };

  const handleGenerateDocument = (requirement: Requirement) => {
    alert(`Generate document for: ${requirement.title}`);
  };

  const handleStatusChange = (requirementId: string, status: RequirementStatus) => {
    console.log("Status changed:", requirementId, status);
    setIsDetailSlideoutOpen(false);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-secondary bg-primary px-6 py-5 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-display-sm font-semibold text-primary">Requirements</h1>
            <p className="mt-1 text-sm text-tertiary">
              Track and manage compliance requirements across all AI systems.
            </p>
          </div>

          {/* Overall Progress */}
          {!isEmpty && (
            <div className="flex items-center gap-3 rounded-lg border border-secondary bg-secondary_subtle px-4 py-2">
              <div className="flex flex-col">
                <span className="text-xs text-tertiary">Overall Progress</span>
                <span className="text-lg font-semibold text-primary">{completedCount}/{totalCount}</span>
              </div>
              <div className="h-10 w-px bg-border-secondary" />
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 rounded-full bg-gray-100">
                  <div
                    className={`h-2 rounded-full transition-all ${progressPercent === 100 ? "bg-success-500" : "bg-brand-500"}`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-primary">{progressPercent}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        {!isEmpty && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <SearchNormal1
                size={20}
                color="currentColor"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-quaternary z-10"
              />
              <input
                type="text"
                placeholder="Search requirements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-secondary bg-primary py-2 pl-10 pr-4 text-sm text-primary placeholder:text-quaternary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div className="w-[160px]">
              <Select
                size="sm"
                placeholder="All Status"
                selectedKey={statusFilter}
                onSelectionChange={(key: Key | null) => key && setStatusFilter(String(key))}
                items={statusFilterOptions}
              >
                {(item) => <Select.Item key={item.id} id={item.id} textValue={item.label}>{item.label}</Select.Item>}
              </Select>
            </div>
            <div className="w-[220px]">
              <Select
                size="sm"
                placeholder="All Systems"
                selectedKey={systemFilter}
                onSelectionChange={(key: Key | null) => key && setSystemFilter(String(key))}
                items={systemFilterOptions}
              >
                {(item) => <Select.Item key={item.id} id={item.id} textValue={item.label}>{item.label}</Select.Item>}
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
        {/* Empty State */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-16">
            <FeaturedIcon color="brand" size="xl" theme="light">
              <TickSquare size={28} color="currentColor" variant="Bold" />
            </FeaturedIcon>
            <h3 className="mt-4 text-lg font-semibold text-primary">No Requirements Yet</h3>
            <p className="mt-2 max-w-md text-center text-sm text-tertiary">
              Requirements will appear here once you add AI systems. Each system will have 
              specific compliance requirements based on its risk classification.
            </p>
            <Button
              size="lg"
              color="primary"
              className="mt-6"
              iconLeading={({ className }) => <Cpu size={20} color="currentColor" className={className} />}
              onClick={() => window.location.href = "/ai-systems/new"}
            >
              Add Your First AI System
            </Button>
          </div>
        )}

        {/* Requirements Sections */}
        {!isEmpty && groupedRequirements.length > 0 && (
          <div className="flex flex-col gap-4">
            {groupedRequirements.map((group) => (
              <RequirementSection
                key={group.articleId}
                articleId={group.articleId}
                articleTitle={group.articleTitle}
                requirements={group.requirements}
                onRequirementClick={handleRequirementClick}
                onUploadEvidence={handleUploadEvidence}
                onGenerateDocument={handleGenerateDocument}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!isEmpty && groupedRequirements.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <FeaturedIcon color="gray" size="xl" theme="light">
              <SearchNormal1 size={28} color="currentColor" />
            </FeaturedIcon>
            <h3 className="mt-4 text-lg font-semibold text-primary">No Results Found</h3>
            <p className="mt-2 max-w-md text-center text-sm text-tertiary">
              No requirements match your current filters. Try adjusting your search or filters.
            </p>
            <Button
              size="md"
              color="secondary"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setSystemFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Requirement Detail Slideout */}
      <RequirementDetailSlideout
        isOpen={isDetailSlideoutOpen}
        onOpenChange={setIsDetailSlideoutOpen}
        requirement={selectedRequirement}
        onStatusChange={handleStatusChange}
        onUploadEvidence={() => {
          if (selectedRequirement) {
            setIsUploadModalOpen(true);
          }
        }}
        onGenerateDocument={() => {
          if (selectedRequirement) {
            handleGenerateDocument(selectedRequirement);
          }
        }}
      />

      {/* Upload Evidence Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        title="Upload Evidence"
        description={`Upload evidence for: ${selectedRequirement?.title || "requirement"}`}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
        allowsMultiple={true}
        maxSize={25 * 1024 * 1024}
        uploadButtonText="Upload Evidence"
        onUpload={(files) => {
          console.log("Uploaded files:", files);
          setIsUploadModalOpen(false);
        }}
      />
    </div>
  );
}
