"use client";

import { useState, useMemo } from "react";
import type { Key } from "react-aria-components";
import {
  TickSquare,
  SearchNormal1,
  Cpu,
} from "iconsax-react";
import { ClipboardCheck } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Select, type SelectItemType } from "@/components/base/select/select";
import { UploadModal } from "@/components/application/modals/upload-modal";
import { DocumentGeneratorModal } from "@/components/application/modals/document-generator-modal";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import {
  RequirementSection,
  RequirementDetailSlideout,
  type Requirement,
  type RequirementStatus,
} from "@/components/application/requirements";
import { useAllRequirements } from "@/hooks";

// Filter options
const statusFilterOptions: SelectItemType[] = [
  { id: "all", label: "All Status" },
  { id: "pending", label: "Not Started" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Complete" },
  { id: "not_applicable", label: "Not Applicable" },
];

// Map API status to UI status
const mapStatus = (status: string): RequirementStatus => {
  const statusMap: Record<string, RequirementStatus> = {
    pending: "not_started",
    in_progress: "in_progress",
    completed: "complete",
    not_applicable: "not_applicable",
  };
  return statusMap[status] || "not_started";
};

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
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  // Fetch real requirements data
  const { requirements: apiRequirements, systems, stats, isLoading, refetch } = useAllRequirements({
    status: statusFilter !== "all" ? statusFilter : undefined,
    systemId: systemFilter !== "all" ? systemFilter : undefined,
  });

  // Build system filter options from real data
  const systemFilterOptions: SelectItemType[] = useMemo(() => [
    { id: "all", label: "All Systems" },
    ...systems.map(s => ({ id: s.id, label: s.name })),
  ], [systems]);

  // Transform API data to match component expectations
  const requirements: Requirement[] = useMemo(() => {
    return apiRequirements.map(req => ({
      id: req.id,
      title: req.title,
      description: req.description,
      status: mapStatus(req.status),
      articleId: req.articleId,
      articleTitle: req.articleTitle,
      systemId: req.systemId,
      systemName: req.systemName,
      linkedEvidence: req.linkedEvidence,
      linkedDocument: req.linkedDocument,
    }));
  }, [apiRequirements]);

  // Filter by search query (client-side)
  const filteredRequirements = useMemo(() => {
    if (!searchQuery) return requirements;
    return requirements.filter((req) => {
      const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.articleTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [requirements, searchQuery]);

  // Group filtered requirements
  const groupedRequirements = useMemo(() => {
    return groupRequirementsByArticle(filteredRequirements);
  }, [filteredRequirements]);

  // Calculate overall progress
  const completedCount = stats.completed;
  const totalCount = stats.total;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const isEmpty = requirements.length === 0 && !isLoading;

  const handleRequirementClick = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setIsDetailSlideoutOpen(true);
  };

  const handleUploadEvidence = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setIsUploadModalOpen(true);
  };

  const handleGenerateDocument = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
    setIsDocumentModalOpen(true);
  };

  const handleStatusChange = async (requirementId: string, status: RequirementStatus) => {
    // Map UI status to API status
    const apiStatus = status === "complete" ? "completed" : status === "not_started" ? "pending" : status;
    
    try {
      const response = await fetch(`/api/v1/requirements/${requirementId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: apiStatus }),
      });

      if (!response.ok) {
        console.error("Failed to update requirement status");
        return;
      }

      // Refresh the requirements list
      await refetch();
    } catch (error) {
      console.error("Error updating requirement status:", error);
    }
    
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
        {/* Loading State */}
        {isLoading && (
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <div className="animate-pulse space-y-4 w-full max-w-2xl">
              <div className="h-24 bg-gray-200 rounded-xl" />
              <div className="h-24 bg-gray-200 rounded-xl" />
              <div className="h-24 bg-gray-200 rounded-xl" />
            </div>
          </div>
        )}

        {/* Empty State */}
        {isEmpty && (
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <EmptyState size="md">
              <EmptyState.Header pattern="grid">
                <EmptyState.FeaturedIcon icon={ClipboardCheck} color="gray" theme="modern" />
              </EmptyState.Header>
              <EmptyState.Content>
                <EmptyState.Title>No requirements yet</EmptyState.Title>
                <EmptyState.Description>
                  Requirements will appear here once you add AI systems. Each system will have specific compliance requirements based on its risk classification.
                </EmptyState.Description>
              </EmptyState.Content>
              <EmptyState.Footer>
                <Button
                  size="lg"
                  iconLeading={({ className }) => <Cpu size={20} color="currentColor" className={className} />}
                  onClick={() => window.location.href = "/ai-systems/new"}
                >
                  Add Your First AI System
                </Button>
              </EmptyState.Footer>
            </EmptyState>
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
        {!isEmpty && !isLoading && groupedRequirements.length === 0 && (
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <EmptyState size="md">
              <EmptyState.Header pattern="grid">
                <EmptyState.FeaturedIcon icon={SearchNormal1} color="gray" theme="modern" />
              </EmptyState.Header>
              <EmptyState.Content>
                <EmptyState.Title>No results found</EmptyState.Title>
                <EmptyState.Description>
                  No requirements match your current filters. Try adjusting your search or filters.
                </EmptyState.Description>
              </EmptyState.Content>
              <EmptyState.Footer>
                <Button
                  size="lg"
                  color="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setSystemFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </EmptyState.Footer>
            </EmptyState>
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
        aiSystemId={selectedRequirement?.systemId}
        requirementId={selectedRequirement?.id}
        uploadToApi={true}
        onUpload={async (files) => {
          // Refresh requirements to show linked evidence
          await refetch();
          setIsUploadModalOpen(false);
        }}
      />

      {/* Document Generator Modal */}
      <DocumentGeneratorModal
        isOpen={isDocumentModalOpen}
        onOpenChange={setIsDocumentModalOpen}
        preselectedSystemId={selectedRequirement?.systemId}
        onGenerate={async (data) => {
          // Refresh requirements after document generation
          await refetch();
          setIsDocumentModalOpen(false);
        }}
      />
    </div>
  );
}
