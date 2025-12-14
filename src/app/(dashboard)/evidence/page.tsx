"use client";

import { useState, useMemo } from "react";
import type { Key } from "react-aria-components";
import { FolderOpen, DocumentUpload, SearchNormal1 } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Select } from "@/components/base/select/select";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { UploadModal } from "@/components/application/modals/upload-modal";
import { EvidenceDetailSlideout } from "@/components/application/slideout-menus/evidence-detail-slideout";
import { ConfirmationModal } from "@/components/application/modals/confirmation-modal";
import { EvidenceTable } from "./components";
import {
  mockEvidence,
  typeFilterOptions,
  systemFilterOptions,
  linkedToFilterOptions,
  type Evidence,
} from "./data/mock-data";

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

  const handleRowClick = (evidence: Evidence) => {
    setSelectedEvidence(evidence);
    setIsDetailSlideoutOpen(true);
  };

  const handleDeleteRequest = (evidence: Evidence) => {
    setEvidenceToDelete(evidence);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (evidenceToDelete) {
      console.log("Deleted evidence:", evidenceToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setEvidenceToDelete(null);
    setIsDetailSlideoutOpen(false);
  };

  // Filter evidence
  const filteredEvidence = useMemo(() => {
    return mockEvidence.filter((evidence) => {
      const matchesSearch = evidence.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evidence.linkedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evidence.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || evidence.type.toLowerCase() === typeFilter;
      const matchesSystem = systemFilter === "all" || evidence.systemId === systemFilter;
      const matchesLinkedTo = linkedToFilter === "all" || evidence.linkedToId === linkedToFilter;
      return matchesSearch && matchesType && matchesSystem && matchesLinkedTo;
    });
  }, [searchQuery, typeFilter, systemFilter, linkedToFilter]);

  const isEmpty = mockEvidence.length === 0;

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
        {/* Empty State */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-16">
            <FeaturedIcon color="brand" size="xl" theme="light">
              <FolderOpen size={28} color="currentColor" variant="Bold" />
            </FeaturedIcon>
            <h3 className="mt-4 text-lg font-semibold text-primary">No Evidence Uploaded</h3>
            <p className="mt-2 max-w-md text-center text-sm text-tertiary">
              Upload evidence files to support your compliance requirements. Evidence can include policies, 
              audit reports, test results, and other documentation.
            </p>
            <Button
              size="lg"
              color="primary"
              className="mt-6"
              iconLeading={({ className }) => <DocumentUpload size={20} color="currentColor" className={className} />}
              onClick={() => setIsUploadModalOpen(true)}
            >
              Upload Your First Evidence
            </Button>
          </div>
        )}

        {/* Evidence Table */}
        {!isEmpty && filteredEvidence.length > 0 && (
          <EvidenceTable evidence={filteredEvidence} onRowClick={handleRowClick} />
        )}

        {/* No Results */}
        {!isEmpty && filteredEvidence.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <FeaturedIcon color="gray" size="xl" theme="light">
              <SearchNormal1 size={28} color="currentColor" />
            </FeaturedIcon>
            <h3 className="mt-4 text-lg font-semibold text-primary">No Results Found</h3>
            <p className="mt-2 max-w-md text-center text-sm text-tertiary">
              No evidence files match your current filters. Try adjusting your search or filters.
            </p>
            <Button
              size="md"
              color="secondary"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("all");
                setSystemFilter("all");
                setLinkedToFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Storage Usage Footer */}
      {!isEmpty && (
        <div className="shrink-0 border-t border-secondary bg-primary px-6 py-3 lg:px-8">
          <div className="flex items-center justify-between text-sm text-tertiary">
            <div className="flex items-center gap-4">
              <span>{mockEvidence.length} files</span>
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
        onOpenChange={setIsUploadModalOpen}
        title="Upload Evidence"
        description="Upload evidence files to support your compliance requirements. Supported formats: PDF, CSV, Excel, JSON, and images."
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.json,.png,.jpg,.jpeg"
        allowsMultiple={true}
        maxSize={25 * 1024 * 1024}
        uploadButtonText="Upload Evidence"
        onUpload={(files) => {
          console.log("Uploaded files:", files);
        }}
      />

      {/* Evidence Detail Slideout */}
      <EvidenceDetailSlideout
        isOpen={isDetailSlideoutOpen}
        onOpenChange={setIsDetailSlideoutOpen}
        evidence={selectedEvidence}
        onSave={(updatedEvidence) => {
          console.log("Saved evidence:", updatedEvidence);
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
