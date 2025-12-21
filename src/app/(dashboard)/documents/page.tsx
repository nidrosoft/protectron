"use client";

import { useState } from "react";
import type { Key } from "react-aria-components";
import { useRouter } from "next/navigation";
import {
  DocumentText,
  Add,
  SearchNormal1,
  Document,
  DocumentText1,
  Note,
  ClipboardText,
} from "iconsax-react";
import { FileIcon } from "@untitledui/file-icons";
import { Button } from "@/components/base/buttons/button";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Select, type SelectItemType } from "@/components/base/select/select";
import { Table, TableCard, DocumentActionsDropdown } from "@/components/application/table/table";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { DocumentGeneratorModal } from "@/components/application/modals/document-generator-modal";
import { ConfirmationModal } from "@/components/application/modals/confirmation-modal";
import { RenameModal } from "@/components/application/modals/rename-modal";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { useToast } from "@/components/base/toast/toast";
import { useDocuments } from "@/hooks/use-documents";
import { cx } from "@/utils/cx";

// Document type options for filter (static)
const documentTypeOptions: SelectItemType[] = [
  { id: "all", label: "All Types" },
  { id: "technical", label: "Technical Documentation" },
  { id: "risk", label: "Risk Assessment" },
  { id: "policy", label: "Data Governance Policy" },
  { id: "model_card", label: "Model Card" },
];

const documentTypeConfig = {
  technical: { label: "Technical Doc", color: "brand" as const },
  risk: { label: "Risk Assessment", color: "warning" as const },
  policy: { label: "Policy", color: "purple" as const },
  model_card: { label: "Model Card", color: "blue" as const },
};

const statusConfig = {
  draft: { label: "Draft", color: "warning" as const },
  final: { label: "Final", color: "success" as const },
};

export default function DocumentsPage() {
  const router = useRouter();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [systemFilter, setSystemFilter] = useState("all");
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  
  // Modal states
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: string;
    name: string;
    type: string;
    status: "draft" | "final";
    size: string;
    systemId: string | null;
    systemName: string | null;
    createdAt: string;
  } | null>(null);

  // Fetch documents from API
  const { 
    documents, 
    systems,
    isLoading, 
    updateDocument, 
    deleteDocument, 
    duplicateDocument,
    createDocument,
    isUpdating,
    isDeleting,
    refetch 
  } = useDocuments();

  // Build system options from API data
  const systemOptions: SelectItemType[] = [
    { id: "all", label: "All Systems" },
    ...systems.map(s => ({ id: s.id, label: s.name })),
  ];

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.systemName?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    const matchesSystem = systemFilter === "all" || doc.systemId === systemFilter;
    return matchesSearch && matchesType && matchesSystem;
  });

  const isEmpty = documents.length === 0;

  // Action handlers
  const handleDownload = (doc: typeof documents[0], format: "docx" | "pdf" = "docx") => {
    toast.addToast({ type: "success", title: "Download started", message: `Downloading "${doc.name}" as ${format.toUpperCase()}...` });
    
    // Trigger actual file download
    const link = document.createElement("a");
    link.href = format === "pdf" 
      ? `/api/v1/documents/${doc.id}/pdf`
      : `/api/v1/documents/${doc.id}/download`;
    link.download = `${doc.name}.${format}`;
    link.click();
  };

  const handleDuplicate = async (doc: typeof documents[0]) => {
    const result = await duplicateDocument(doc.id);
    if (result) {
      toast.addToast({ type: "success", title: "Document duplicated", message: `"${doc.name}" has been duplicated.` });
    }
  };

  const handleShare = (doc: typeof documents[0]) => {
    const url = `${window.location.origin}/documents/${doc.id}`;
    navigator.clipboard.writeText(url);
    toast.addToast({ type: "success", title: "Link copied", message: "Document link copied to clipboard!" });
  };

  const handleRename = (doc: typeof documents[0]) => {
    setSelectedDocument(doc);
    setIsRenameModalOpen(true);
  };

  const handleRenameConfirm = async (newName: string) => {
    if (selectedDocument) {
      const result = await updateDocument(selectedDocument.id, { name: newName });
      if (result) {
        toast.addToast({ type: "success", title: "Document renamed", message: `Renamed to "${newName}"` });
      }
      setIsRenameModalOpen(false);
      setSelectedDocument(null);
    }
  };

  const handleDelete = (doc: typeof documents[0]) => {
    setSelectedDocument(doc);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedDocument) {
      const success = await deleteDocument(selectedDocument.id);
      if (success) {
        toast.addToast({ type: "success", title: "Document deleted", message: `"${selectedDocument.name}" has been deleted.` });
      }
      setIsDeleteModalOpen(false);
      setSelectedDocument(null);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-secondary bg-primary px-6 py-5 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-primary lg:text-2xl">Documents</h1>
            <p className="mt-1 text-sm text-tertiary">
              Generate and manage compliance documents for your AI systems.
            </p>
          </div>
          <Button 
            size="md" 
            iconLeading={({ className }) => <Add size={20} color="currentColor" className={className} />}
            onClick={() => setIsGenerateModalOpen(true)}
          >
            Generate New Document
          </Button>
        </div>

        {/* Filters - only show when there are documents */}
        {!isEmpty && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <SearchNormal1 
                size={20} 
                color="currentColor" 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-quaternary z-10" 
              />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-secondary bg-primary py-2 pl-10 pr-4 text-sm text-primary placeholder:text-quaternary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Type Filter */}
            <div className="w-[180px]">
              <Select
                selectedKey={typeFilter}
                onSelectionChange={(key) => key && setTypeFilter(String(key))}
                items={documentTypeOptions}
                size="sm"
                placeholder="All Types"
              >
                {(item) => <Select.Item key={item.id} id={item.id} textValue={item.label}>{item.label}</Select.Item>}
              </Select>
            </div>

            {/* System Filter */}
            <div className="w-[200px]">
              <Select
                selectedKey={systemFilter}
                onSelectionChange={(key) => key && setSystemFilter(String(key))}
                items={systemOptions}
                size="sm"
                placeholder="All Systems"
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
            <LoadingIndicator type="dot-circle" size="md" label="Loading documents..." />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && isEmpty && (
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <EmptyState size="md">
              <EmptyState.Header pattern="grid">
                <EmptyState.FeaturedIcon icon={DocumentText} color="gray" theme="modern" />
              </EmptyState.Header>
              <EmptyState.Content>
                <EmptyState.Title>No documents yet</EmptyState.Title>
                <EmptyState.Description>
                  Generate compliance documents for your AI systems. Get started by creating your first document.
                </EmptyState.Description>
              </EmptyState.Content>
              <EmptyState.Footer>
                <Button 
                  size="lg"
                  iconLeading={({ className }) => <Add size={20} color="currentColor" className={className} />}
                  onClick={() => setIsGenerateModalOpen(true)}
                >
                  Generate New Document
                </Button>
              </EmptyState.Footer>
            </EmptyState>
          </div>
        )}

        {/* Documents Table - will be shown when there are documents */}
        {!isLoading && !isEmpty && filteredDocuments.length > 0 && (
          <TableCard.Root>
            <Table aria-label="Documents" selectionMode="none">
              <Table.Header>
                <Table.Head id="name" isRowHeader label="Document" />
                <Table.Head id="type" label="Type" />
                <Table.Head id="system" label="AI System" />
                <Table.Head id="status" label="Status" />
                <Table.Head id="date" label="Generated" />
                <Table.Head id="actions" />
              </Table.Header>
              <Table.Body items={filteredDocuments}>
                {(doc: typeof documents[0]) => {
                  const typeConfig = documentTypeConfig[doc.type as keyof typeof documentTypeConfig] || { label: doc.type, color: "gray" as const };
                  const docStatusConfig = statusConfig[doc.status as keyof typeof statusConfig] || { label: doc.status, color: "gray" as const };
                  
                  return (
                    <Table.Row id={doc.id} className="odd:bg-secondary_subtle cursor-pointer hover:bg-secondary_hover" onAction={() => router.push(`/documents/${doc.id}`)}>
                      <Table.Cell>
                        <div className="flex items-center gap-3">
                          <FileIcon type="pdf" theme="light" className="size-10 dark:hidden" />
                          <FileIcon type="pdf" theme="dark" className="size-10 not-dark:hidden" />
                          <div>
                            <p className="text-sm font-medium text-primary">{doc.name}</p>
                            <p className="text-sm text-tertiary">{doc.size || "—"}</p>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge size="sm" color={typeConfig.color}>
                          {typeConfig.label}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-sm text-secondary whitespace-nowrap">{doc.systemName || "—"}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <BadgeWithDot size="sm" color={docStatusConfig.color}>
                          {docStatusConfig.label}
                        </BadgeWithDot>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-sm text-tertiary whitespace-nowrap">{doc.createdAt}</span>
                      </Table.Cell>
                      <Table.Cell className="px-4">
                        <DocumentActionsDropdown
                          onDownload={() => handleDownload(doc)}
                          onView={() => router.push(`/documents/${doc.id}`)}
                          onDuplicate={() => handleDuplicate(doc)}
                          onShare={() => handleShare(doc)}
                          onRename={() => handleRename(doc)}
                          onDelete={() => handleDelete(doc)}
                        />
                      </Table.Cell>
                    </Table.Row>
                  );
                }}
              </Table.Body>
            </Table>
          </TableCard.Root>
        )}

        {/* No Results */}
        {!isLoading && !isEmpty && filteredDocuments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <SearchNormal1 size={32} color="currentColor" className="text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-primary">No Results Found</h3>
            <p className="mt-2 max-w-sm text-sm text-tertiary">
              No documents match your current filters. Try adjusting your search or filters.
            </p>
            <Button 
              size="md" 
              color="secondary"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("all");
                setSystemFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Document Generator Modal */}
      <DocumentGeneratorModal
        isOpen={isGenerateModalOpen}
        onOpenChange={setIsGenerateModalOpen}
        onGenerate={async (data) => {
          // Save document to database
          const result = await createDocument({
            name: `${data.type.charAt(0).toUpperCase() + data.type.slice(1).replace("_", " ")} - ${new Date().toLocaleDateString()}`,
            documentType: data.type,
            aiSystemId: data.systemId,
            generationPrompt: data.answers,
          });
          
          if (result) {
            toast.addToast({ type: "success", title: "Document generated", message: "Your document has been generated and saved successfully!" });
          }
        }}
      />

      {/* Rename Modal */}
      <RenameModal
        isOpen={isRenameModalOpen}
        onOpenChange={setIsRenameModalOpen}
        currentName={selectedDocument?.name || ""}
        itemType="Document"
        onConfirm={handleRenameConfirm}
        isLoading={isUpdating}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Document"
        description={`Are you sure you want to delete "${selectedDocument?.name}"? This action cannot be undone.`}
        variant="destructive"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
}
