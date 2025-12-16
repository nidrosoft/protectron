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
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { DocumentGeneratorModal } from "@/components/application/modals/document-generator-modal";
import { cx } from "@/utils/cx";

// Document type options for filter
const documentTypeOptions: SelectItemType[] = [
  { id: "all", label: "All Types" },
  { id: "technical", label: "Technical Documentation" },
  { id: "risk", label: "Risk Assessment" },
  { id: "policy", label: "Data Governance Policy" },
  { id: "model_card", label: "Model Card" },
];

// AI System options for filter
const systemOptions: SelectItemType[] = [
  { id: "all", label: "All Systems" },
  { id: "system-01", label: "Customer Support Chatbot" },
  { id: "system-02", label: "Automated Hiring Screener" },
  { id: "system-03", label: "Fraud Detection System" },
];

// Mock documents data
const mockDocuments: {
  id: string;
  name: string;
  type: "technical" | "risk" | "policy" | "model_card";
  systemId: string;
  systemName: string;
  status: "draft" | "final";
  generatedAt: string;
  size: string;
}[] = [
  {
    id: "doc-01",
    name: "Technical Documentation - Customer Support Chatbot",
    type: "technical",
    systemId: "system-01",
    systemName: "Customer Support Chatbot",
    status: "final",
    generatedAt: "Dec 10, 2025",
    size: "245 KB",
  },
  {
    id: "doc-02",
    name: "Risk Assessment - Automated Hiring Screener",
    type: "risk",
    systemId: "system-02",
    systemName: "Automated Hiring Screener",
    status: "draft",
    generatedAt: "Dec 8, 2025",
    size: "189 KB",
  },
  {
    id: "doc-03",
    name: "Data Governance Policy",
    type: "policy",
    systemId: "all",
    systemName: "All Systems",
    status: "final",
    generatedAt: "Dec 5, 2025",
    size: "156 KB",
  },
  {
    id: "doc-04",
    name: "Model Card - Fraud Detection System",
    type: "model_card",
    systemId: "system-03",
    systemName: "Fraud Detection System",
    status: "final",
    generatedAt: "Dec 3, 2025",
    size: "98 KB",
  },
  {
    id: "doc-05",
    name: "Technical Documentation - Fraud Detection System",
    type: "technical",
    systemId: "system-03",
    systemName: "Fraud Detection System",
    status: "draft",
    generatedAt: "Dec 1, 2025",
    size: "312 KB",
  },
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
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [systemFilter, setSystemFilter] = useState("all");
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // Filter documents
  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.systemName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    const matchesSystem = systemFilter === "all" || doc.systemId === systemFilter;
    return matchesSearch && matchesType && matchesSystem;
  });

  const isEmpty = mockDocuments.length === 0;

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
        {/* Empty State */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative">
              <FeaturedIcon color="brand" size="xl" theme="light">
                <DocumentText size={28} color="currentColor" variant="Bold" />
              </FeaturedIcon>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-primary">No Documents Yet</h3>
            <p className="mt-2 max-w-md text-sm text-tertiary">
              Generate your first compliance document to get started. Our AI will help you create 
              technical documentation, risk assessments, policies, and model cards tailored to your AI systems.
            </p>
            
            {/* Document Type Cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
              <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset text-left hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsGenerateModalOpen(true)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
                  <DocumentText1 size={20} className="text-brand-600" color="currentColor" variant="Bold" />
                </div>
                <h4 className="mt-3 text-sm font-semibold text-primary">Technical Documentation</h4>
                <p className="mt-1 text-xs text-tertiary">Required for high-risk AI systems under Article 11</p>
              </div>
              
              <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset text-left hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsGenerateModalOpen(true)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-100">
                  <ClipboardText size={20} className="text-warning-600" color="currentColor" variant="Bold" />
                </div>
                <h4 className="mt-3 text-sm font-semibold text-primary">Risk Assessment</h4>
                <p className="mt-1 text-xs text-tertiary">Identifies and analyzes risks of your AI system</p>
              </div>
              
              <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset text-left hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsGenerateModalOpen(true)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <Note size={20} className="text-purple-600" color="currentColor" variant="Bold" />
                </div>
                <h4 className="mt-3 text-sm font-semibold text-primary">Data Governance Policy</h4>
                <p className="mt-1 text-xs text-tertiary">Documents data quality and bias mitigation</p>
              </div>
              
              <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset text-left hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsGenerateModalOpen(true)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Document size={20} className="text-blue-600" color="currentColor" variant="Bold" />
                </div>
                <h4 className="mt-3 text-sm font-semibold text-primary">Model Card</h4>
                <p className="mt-1 text-xs text-tertiary">Transparency document describing model capabilities</p>
              </div>
            </div>

            <Button 
              size="lg" 
              color="secondary"
              className="mt-8"
              iconLeading={({ className }) => <Add size={20} color="currentColor" className={className} />}
              onClick={() => setIsGenerateModalOpen(true)}
            >
              Generate Your First Document
            </Button>
          </div>
        )}

        {/* Documents Table - will be shown when there are documents */}
        {!isEmpty && filteredDocuments.length > 0 && (
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
                {(doc) => (
                  <Table.Row id={doc.id} className="odd:bg-secondary_subtle cursor-pointer hover:bg-secondary_hover" onAction={() => router.push(`/documents/${doc.id}`)}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <FileIcon type="pdf" theme="light" className="size-10 dark:hidden" />
                        <FileIcon type="pdf" theme="dark" className="size-10 not-dark:hidden" />
                        <div>
                          <p className="text-sm font-medium text-primary">{doc.name}</p>
                          <p className="text-sm text-tertiary">{doc.size}</p>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge size="sm" color={documentTypeConfig[doc.type].color}>
                        {documentTypeConfig[doc.type].label}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm text-secondary whitespace-nowrap">{doc.systemName}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <BadgeWithDot size="sm" color={statusConfig[doc.status].color}>
                        {statusConfig[doc.status].label}
                      </BadgeWithDot>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="text-sm text-tertiary whitespace-nowrap">{doc.generatedAt}</span>
                    </Table.Cell>
                    <Table.Cell className="px-4">
                      <TableRowActionsDropdown />
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </TableCard.Root>
        )}

        {/* No Results */}
        {!isEmpty && filteredDocuments.length === 0 && (
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
        onGenerate={(data) => {
          console.log("Document generated:", data);
          alert(`Document generated successfully! Type: ${data.type}, System: ${data.systemId}`);
        }}
      />
    </div>
  );
}
