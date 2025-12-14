"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Cpu, Edit2 } from "iconsax-react";
import { ArrowLeft, DotsVertical } from "@untitledui/icons";
import { ConfirmationModal } from "@/components/application/modals/confirmation-modal";
import { UploadModal } from "@/components/application/modals/upload-modal";
import { Button } from "@/components/base/buttons/button";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Tabs, TabList, Tab } from "@/components/application/tabs/tabs";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import {
  OverviewTab,
  RequirementsTab,
  DocumentsTab,
  EvidenceTab,
  ActivityTab,
} from "./components";
import { mockAISystems, riskLevelConfig, statusConfig, ITEMS_PER_PAGE } from "./data/mock-data";

export default function AISystemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [requirementFilter, setRequirementFilter] = useState<"all" | "pending" | "complete">("all");
  const [documentsPage, setDocumentsPage] = useState(1);
  const [evidencePage, setEvidencePage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploadEvidenceModalOpen, setIsUploadEvidenceModalOpen] = useState(false);
  const [isGenerateDocModalOpen, setIsGenerateDocModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Get system data (in real app, this would be fetched)
  const system = mockAISystems[id] || mockAISystems["system-02"];

  // Paginated data
  const paginatedDocuments = system.documents.slice(
    (documentsPage - 1) * ITEMS_PER_PAGE,
    documentsPage * ITEMS_PER_PAGE
  );
  const paginatedEvidence = system.evidence.slice(
    (evidencePage - 1) * ITEMS_PER_PAGE,
    evidencePage * ITEMS_PER_PAGE
  );
  const paginatedActivity = system.activity.slice(
    (activityPage - 1) * ITEMS_PER_PAGE,
    activityPage * ITEMS_PER_PAGE
  );

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "requirements", label: "Requirements", badge: `${system.requirements.completed}/${system.requirements.total}` },
    { id: "documents", label: "Documents", badge: system.documents.length },
    { id: "evidence", label: "Evidence", badge: system.evidence.length },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="shrink-0 border-b border-secondary bg-primary px-6 py-4 lg:px-8">
        {/* Back link */}
        <Link
          href="/ai-systems"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-tertiary hover:text-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to AI Systems
        </Link>

        {/* System header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100">
              <Cpu size={24} className="text-brand-600" color="currentColor" variant="Bold" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-primary lg:text-2xl">{system.name}</h1>
                <BadgeWithDot size="md" type="modern" color={riskLevelConfig[system.riskLevel].color}>
                  {riskLevelConfig[system.riskLevel].label}
                </BadgeWithDot>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-tertiary">
                <span>{system.category}</span>
                <span>•</span>
                <span>Provider: {system.provider}</span>
                <span>•</span>
                <span>Model: {system.modelName}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <BadgeWithDot size="md" type="modern" color={statusConfig[system.status].color}>
                {statusConfig[system.status].label}
              </BadgeWithDot>
              <span className="text-sm font-medium text-secondary">{system.progress}%</span>
            </div>
            <Button size="sm" color="secondary" iconLeading={({ className }) => <Edit2 size={16} color="currentColor" className={className} />} onClick={() => router.push(`/ai-systems/${id}/edit`)}>
              Edit
            </Button>
            <Dropdown.Root>
              <Button size="sm" color="secondary">
                <DotsVertical className="h-4 w-4" />
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu>
                  <Dropdown.Item label="Duplicate System" onAction={() => setIsDuplicateModalOpen(true)} />
                  <Dropdown.Item label="Export Data" onAction={() => setIsExportModalOpen(true)} />
                  <Dropdown.Separator />
                  <Dropdown.Item label="Delete System" onAction={() => setIsDeleteModalOpen(true)} />
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown.Root>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 border-b border-secondary bg-primary px-6 pt-4 lg:px-8">
        <Tabs selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as string)}>
          <TabList type="underline" size="sm" items={tabs}>
            {(item) => (
              <Tab key={item.id} id={item.id} label={item.label} badge={item.badge} />
            )}
          </TabList>
        </Tabs>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
        {activeTab === "overview" && (
          <OverviewTab
            system={system}
            onViewAllActivity={() => setActiveTab("activity")}
          />
        )}

        {activeTab === "requirements" && (
          <RequirementsTab
            system={system}
            requirementFilter={requirementFilter}
            onFilterChange={setRequirementFilter}
            onUploadEvidence={() => setIsUploadEvidenceModalOpen(true)}
            onGenerateDocument={() => setIsGenerateDocModalOpen(true)}
          />
        )}

        {activeTab === "documents" && (
          <DocumentsTab
            documents={system.documents}
            paginatedDocuments={paginatedDocuments}
            currentPage={documentsPage}
            onPageChange={setDocumentsPage}
            itemsPerPage={ITEMS_PER_PAGE}
            onGenerateDocument={() => setIsGenerateDocModalOpen(true)}
          />
        )}

        {activeTab === "evidence" && (
          <EvidenceTab
            evidence={system.evidence}
            paginatedEvidence={paginatedEvidence}
            currentPage={evidencePage}
            onPageChange={setEvidencePage}
            itemsPerPage={ITEMS_PER_PAGE}
            onUploadEvidence={() => setIsUploadEvidenceModalOpen(true)}
          />
        )}

        {activeTab === "activity" && (
          <ActivityTab
            activity={system.activity}
            paginatedActivity={paginatedActivity}
            currentPage={activityPage}
            onPageChange={setActivityPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete AI System"
        description={`Are you sure you want to delete "${system.name}"? This action cannot be undone and all associated documents, evidence, and activity history will be permanently removed.`}
        variant="destructive"
        confirmText="Delete System"
        cancelText="Cancel"
        onConfirm={() => {
          console.log("Deleting system:", system.id);
          setIsDeleteModalOpen(false);
        }}
      />

      {/* Duplicate System Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDuplicateModalOpen}
        onOpenChange={setIsDuplicateModalOpen}
        title="Duplicate AI System"
        description={`Create a copy of "${system.name}"? This will duplicate all system settings, requirements, and documents. Evidence files will need to be re-uploaded.`}
        variant="warning"
        confirmText="Duplicate"
        cancelText="Cancel"
        onConfirm={() => {
          console.log("Duplicating system:", system.id);
          setIsDuplicateModalOpen(false);
          alert("System duplicated successfully!");
        }}
      />

      {/* Export Data Confirmation Modal */}
      <ConfirmationModal
        isOpen={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        title="Export System Data"
        description={`Export all data for "${system.name}"? This will generate a ZIP file containing system configuration, documents, evidence files, and activity logs.`}
        variant="success"
        confirmText="Export Data"
        cancelText="Cancel"
        onConfirm={() => {
          console.log("Exporting data for system:", system.id);
          setIsExportModalOpen(false);
          alert("Export started. You will receive a download link shortly.");
        }}
      />

      {/* Generate Document Confirmation Modal */}
      <ConfirmationModal
        isOpen={isGenerateDocModalOpen}
        onOpenChange={setIsGenerateDocModalOpen}
        title="Generate Document"
        description="Generate a new compliance document using AI? This will analyze your system data and create a draft document based on EU AI Act requirements."
        variant="success"
        confirmText="Generate Document"
        cancelText="Cancel"
        onConfirm={() => {
          console.log("Generating document for system:", system.id);
          setIsGenerateDocModalOpen(false);
          alert("Document generation started. This may take a few minutes.");
        }}
      />

      {/* Upload Evidence Modal */}
      <UploadModal
        isOpen={isUploadEvidenceModalOpen}
        onOpenChange={setIsUploadEvidenceModalOpen}
        title="Upload Evidence"
        description="Upload files to serve as evidence for compliance requirements. Supported formats: PDF, DOC, XLS, CSV, PNG, JPG."
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
        uploadButtonText="Upload Evidence"
        onUpload={(files) => {
          console.log("Uploading evidence files:", files);
          alert(`${files.length} file(s) uploaded successfully!`);
        }}
      />
    </div>
  );
}
