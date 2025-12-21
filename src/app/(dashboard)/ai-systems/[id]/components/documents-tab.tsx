"use client";

import { FileIcon } from "@untitledui/file-icons";
import { UploadCloud02, Download01, File06 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import * as Paginations from "@/components/application/pagination/pagination";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { useToast } from "@/components/base/toast/toast";

interface Document {
  id: string;
  name: string;
  type: string;
  status: "generated" | "draft" | "pending";
  createdAt: string;
  size: string;
}

interface DocumentsTabProps {
  documents: Document[];
  paginatedDocuments: Document[];
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onGenerateDocument: () => void;
}

export const DocumentsTab = ({
  documents,
  paginatedDocuments,
  currentPage,
  onPageChange,
  itemsPerPage,
  onGenerateDocument,
}: DocumentsTabProps) => {
  // Show empty state when no documents
  if (documents.length === 0) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <EmptyState size="md">
          <EmptyState.Header pattern="grid">
            <EmptyState.FeaturedIcon icon={File06} color="gray" theme="modern" />
          </EmptyState.Header>
          <EmptyState.Content>
            <EmptyState.Title>No documents yet</EmptyState.Title>
            <EmptyState.Description>
              Generate compliance documents for your AI system to demonstrate EU AI Act conformity.
            </EmptyState.Description>
          </EmptyState.Content>
          <EmptyState.Footer>
            <Button size="lg" iconLeading={UploadCloud02} onClick={onGenerateDocument}>
              Generate Document
            </Button>
          </EmptyState.Footer>
        </EmptyState>
      </div>
    );
  }

  return (
    <>
      <TableCard.Root>
        <TableCard.Header
          title="Documents"
          badge={`${documents.length} files`}
          contentTrailing={
            <div className="flex items-center gap-3">
              <Button size="md" color="secondary" iconLeading={Download01} onClick={() => {
                // Download functionality would be implemented here
              }}>
                Download all
              </Button>
              <Button size="md" iconLeading={UploadCloud02} onClick={onGenerateDocument}>
                Generate
              </Button>
            </div>
          }
        />
        <Table aria-label="Documents" selectionMode="multiple">
          <Table.Header className="bg-primary">
            <Table.Head id="name" isRowHeader label="File name" />
            <Table.Head id="size" label="File size" />
            <Table.Head id="status" label="Status" />
            <Table.Head id="createdAt" label="Date created" />
            <Table.Head id="updatedAt" label="Last updated" className="md:hidden xl:table-cell" />
            <Table.Head id="actions" />
          </Table.Header>
          <Table.Body items={paginatedDocuments}>
            {(doc) => (
              <Table.Row id={doc.id} className="odd:bg-secondary_subtle">
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <FileIcon type={doc.type.toLowerCase()} theme="light" className="size-10 dark:hidden" />
                    <FileIcon type={doc.type.toLowerCase()} theme="dark" className="size-10 not-dark:hidden" />
                    <div className="whitespace-nowrap">
                      <p className="text-sm font-medium text-primary">{doc.name}</p>
                      <p className="text-sm text-tertiary">{doc.size}</p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">{doc.size}</Table.Cell>
                <Table.Cell>
                  <BadgeWithDot
                    size="sm"
                    color={doc.status === "generated" ? "success" : doc.status === "draft" ? "warning" : "gray"}
                  >
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </BadgeWithDot>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap">{doc.createdAt}</Table.Cell>
                <Table.Cell className="whitespace-nowrap md:hidden xl:table-cell">{doc.createdAt}</Table.Cell>
                <Table.Cell className="px-4">
                  <div className="flex items-center justify-end">
                    <TableRowActionsDropdown />
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </TableCard.Root>
      {documents.length > itemsPerPage && (
        <Paginations.PaginationCardDefault 
          page={currentPage} 
          onPageChange={onPageChange}
          total={Math.ceil(documents.length / itemsPerPage)}
        />
      )}
    </>
  );
};

export default DocumentsTab;
