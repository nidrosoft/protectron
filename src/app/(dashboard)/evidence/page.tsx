"use client";

import { useState, useMemo } from "react";
import type { Key } from "react-aria-components";
import { FolderOpen, DocumentUpload, SearchNormal1 } from "iconsax-react";
import { Folder } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Select, type SelectItemType } from "@/components/base/select/select";
import { UploadModal } from "@/components/application/modals/upload-modal";
import { EvidenceDetailSlideout } from "@/components/application/slideout-menus/evidence-detail-slideout";
import { ConfirmationModal } from "@/components/application/modals/confirmation-modal";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { EvidenceTable } from "./components";
import { useAllEvidence } from "@/hooks";
import { linkedToFilterOptions, type Evidence } from "./data/mock-data";

export default function EvidencePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [systemFilter, setSystemFilter] = useState("all");
  const [linkedToFilter, setLinkedToFilter] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailSlideoutOpen, setIsDetailSlideoutOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [evidenceToDelete, setEvidenceToDelete] = useState<Evidence | null>(null);
  const [selectedSystemForUpload, setSelectedSystemForUpload] = useState<string>("");

  // Fetch real evidence data
  const { evidence: apiEvidence, systems, fileTypes, total, isLoading, refetch } = useAllEvidence({
    fileType: typeFilter !== "all" ? typeFilter : undefined,
    systemId: systemFilter !== "all" ? systemFilter : undefined,
  });

  // Build filter options from real data
  const typeFilterOptions: SelectItemType[] = useMemo(() => [
    { id: "all", label: "All Types" },
    ...fileTypes.map(t => ({ id: t.toLowerCase(), label: t.toUpperCase() })),
  ], [fileTypes]);

  const systemFilterOptions: SelectItemType[] = useMemo(() => [
    { id: "all", label: "All Systems" },
    ...systems.map(s => ({ id: s.id, label: s.name })),
  ], [systems]);

  // Transform API data to match component expectations
  const evidence: Evidence[] = useMemo(() => {
    return apiEvidence.map(ev => ({
      id: ev.id,
      name: ev.name,
      type: ev.type,
      size: ev.size,
      uploadedAt: ev.uploadedAt,
      uploadedBy: ev.uploadedBy,
      uploadedByAvatar: "",
      systemId: ev.systemId,
      systemName: ev.systemName,
      linkedTo: ev.linkedTo,
      linkedToId: ev.requirementId || "",
    }));
  }, [apiEvidence]);

  const handleRowClick = (ev: Evidence) => {
    setSelectedEvidence(ev);
    setIsDetailSlideoutOpen(true);
  };

  const handleDeleteRequest = (ev: Evidence) => {
    setEvidenceToDelete(ev);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (evidenceToDelete) {
      try {
        const response = await fetch(`/api/v1/evidence/${evidenceToDelete.id}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          refetch(); // Refresh the evidence list
        } else {
          console.error("Failed to delete evidence");
        }
      } catch (error) {
        console.error("Error deleting evidence:", error);
      }
    }
    setIsDeleteModalOpen(false);
    setEvidenceToDelete(null);
    setIsDetailSlideoutOpen(false);
  };

  // Filter by search query (client-side)
  const filteredEvidence = useMemo(() => {
    if (!searchQuery) return evidence;
    return evidence.filter((ev) => {
      const matchesSearch = ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.linkedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLinkedTo = linkedToFilter === "all" || ev.linkedToId === linkedToFilter;
      return matchesSearch && matchesLinkedTo;
    });
  }, [evidence, searchQuery, linkedToFilter]);

  const isEmpty = evidence.length === 0 && !isLoading;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-secondary bg-primary px-6 py-5 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-display-sm font-semibold text-primary">Evidence</h1>
            <p className="mt-1 text-sm text-tertiary">
              Upload and manage evidence files to support your compliance requirements.
            </p>
          </div>
          <Button
            size="md"
            color="primary"
            iconLeading={({ className }) => <DocumentUpload size={20} color="currentColor" className={className} />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload Evidence
          </Button>
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
                placeholder="Search evidence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-secondary bg-primary py-2 pl-10 pr-4 text-sm text-primary placeholder:text-quaternary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <Select
              size="sm"
              placeholder="All Types"
              selectedKey={typeFilter}
              onSelectionChange={(key: Key | null) => key && setTypeFilter(String(key))}
              items={typeFilterOptions}
            >
              {(item) => <Select.Item key={item.id} id={item.id} textValue={item.label}>{item.label}</Select.Item>}
            </Select>
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
            <div className="w-[200px]">
              <Select
                size="sm"
                placeholder="All Categories"
              selectedKey={linkedToFilter}
              onSelectionChange={(key: Key | null) => key && setLinkedToFilter(String(key))}
                items={linkedToFilterOptions}
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
              <div className="h-16 bg-gray-200 rounded-xl" />
              <div className="h-16 bg-gray-200 rounded-xl" />
              <div className="h-16 bg-gray-200 rounded-xl" />
            </div>
          </div>
        )}

        {/* Empty State */}
        {isEmpty && (
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <EmptyState size="md">
              <EmptyState.Header pattern="grid">
                <EmptyState.FeaturedIcon icon={Folder} color="gray" theme="modern" />
              </EmptyState.Header>
              <EmptyState.Content>
                <EmptyState.Title>No evidence uploaded</EmptyState.Title>
                <EmptyState.Description>
                  Upload evidence files to support your compliance requirements. Evidence can include policies, audit reports, test results, and other documentation.
                </EmptyState.Description>
              </EmptyState.Content>
              <EmptyState.Footer>
                <Button
                  size="lg"
                  iconLeading={({ className }) => <DocumentUpload size={20} color="currentColor" className={className} />}
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  Upload Your First Evidence
                </Button>
              </EmptyState.Footer>
            </EmptyState>
          </div>
        )}

        {/* Evidence Table */}
        {!isEmpty && filteredEvidence.length > 0 && (
          <EvidenceTable evidence={filteredEvidence} onRowClick={handleRowClick} />
        )}

        {/* No Results */}
        {!isEmpty && !isLoading && filteredEvidence.length === 0 && (
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <EmptyState size="md">
              <EmptyState.Header pattern="grid">
                <EmptyState.FeaturedIcon icon={SearchNormal1} color="gray" theme="modern" />
              </EmptyState.Header>
              <EmptyState.Content>
                <EmptyState.Title>No results found</EmptyState.Title>
                <EmptyState.Description>
                  No evidence files match your current filters. Try adjusting your search or filters.
                </EmptyState.Description>
              </EmptyState.Content>
              <EmptyState.Footer>
                <Button
                  size="lg"
                  color="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("all");
                    setSystemFilter("all");
                    setLinkedToFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </EmptyState.Footer>
            </EmptyState>
          </div>
        )}
      </div>

      {/* Storage Usage Footer */}
      {!isEmpty && (
        <div className="shrink-0 border-t border-secondary bg-primary px-6 py-3 lg:px-8">
          <div className="flex items-center justify-between text-sm text-tertiary">
            <div className="flex items-center gap-4">
              <span>{total} files</span>
              <span>•</span>
              <span>Storage used: 10.2 MB of 5 GB</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 rounded-full bg-quaternary">
                <div className="h-2 w-1 rounded-full bg-brand-500" />
              </div>
              <span>0.2%</span>
            </div>
          </div>
        </div>
      )}

      {/* Upload Evidence Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onOpenChange={(open) => {
          setIsUploadModalOpen(open);
          if (!open) setSelectedSystemForUpload("");
        }}
        title="Upload Evidence"
        description="Upload evidence files to support your compliance requirements. Supported formats: PDF, CSV, Excel, JSON, and images."
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.json,.png,.jpg,.jpeg"
        allowsMultiple={true}
        maxSize={25 * 1024 * 1024}
        uploadButtonText="Upload Evidence"
        aiSystemId={selectedSystemForUpload || systems[0]?.id}
        uploadToApi={true}
        onUpload={async (files) => {
          await refetch();
          setIsUploadModalOpen(false);
          setSelectedSystemForUpload("");
        }}
      />

      {/* Evidence Detail Slideout */}
      <EvidenceDetailSlideout
        isOpen={isDetailSlideoutOpen}
        onOpenChange={setIsDetailSlideoutOpen}
        evidence={selectedEvidence}
        onSave={(updatedEvidence) => {
          setIsDetailSlideoutOpen(false);
        }}
        onDelete={() => {
          if (selectedEvidence) {
            handleDeleteRequest(selectedEvidence);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        variant="destructive"
        title="Delete Evidence"
        description={`Are you sure you want to delete "${evidenceToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setEvidenceToDelete(null);
        }}
      />
    </div>
  );
}
