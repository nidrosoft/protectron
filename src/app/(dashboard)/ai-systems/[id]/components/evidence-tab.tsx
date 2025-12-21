"use client";

import { FileIcon } from "@untitledui/file-icons";
import { Upload01, Folder } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import * as Paginations from "@/components/application/pagination/pagination";
import { EmptyState } from "@/components/application/empty-state/empty-state";

interface Evidence {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  linkedTo: string;
  size: string;
}

interface EvidenceTabProps {
  evidence: Evidence[];
  paginatedEvidence: Evidence[];
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onUploadEvidence: () => void;
}

export const EvidenceTab = ({
  evidence,
  paginatedEvidence,
  currentPage,
  onPageChange,
  itemsPerPage,
  onUploadEvidence,
}: EvidenceTabProps) => {
  // Show empty state when no evidence
  if (evidence.length === 0) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <EmptyState size="md">
          <EmptyState.Header pattern="grid">
            <EmptyState.FeaturedIcon icon={Folder} color="gray" theme="modern" />
          </EmptyState.Header>
          <EmptyState.Content>
            <EmptyState.Title>No evidence uploaded</EmptyState.Title>
            <EmptyState.Description>
              Upload evidence files to support your compliance requirements and demonstrate conformity.
            </EmptyState.Description>
          </EmptyState.Content>
          <EmptyState.Footer>
            <Button size="lg" iconLeading={Upload01} onClick={onUploadEvidence}>
              Upload Evidence
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
          title="Evidence Files"
          description="Uploaded evidence linked to compliance requirements."
          contentTrailing={
            <div className="absolute top-5 right-4 md:right-6">
              <Button size="sm" iconLeading={Upload01} onClick={onUploadEvidence}>
                Upload Evidence
              </Button>
            </div>
          }
        />
        <Table aria-label="Evidence" selectionMode="none">
          <Table.Header>
            <Table.Head id="name" isRowHeader label="File" />
            <Table.Head id="linked" label="Linked To" />
            <Table.Head id="uploaded" label="Uploaded" />
            <Table.Head id="by" label="By" />
            <Table.Head id="actions" />
          </Table.Header>
          <Table.Body items={paginatedEvidence}>
            {(ev) => (
              <Table.Row id={ev.id} className="odd:bg-secondary_subtle">
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <FileIcon type={ev.name.split(".").pop()?.toLowerCase() || "pdf"} theme="light" className="size-10 dark:hidden" />
                    <FileIcon type={ev.name.split(".").pop()?.toLowerCase() || "pdf"} theme="dark" className="size-10 not-dark:hidden" />
                    <div className="whitespace-nowrap">
                      <p className="text-sm font-medium text-primary">{ev.name}</p>
                      <p className="text-sm text-tertiary">{ev.size}</p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-sm text-secondary whitespace-nowrap">{ev.linkedTo}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-sm text-secondary whitespace-nowrap">{ev.uploadedAt}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-sm text-tertiary whitespace-nowrap">{ev.uploadedBy}</span>
                </Table.Cell>
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
      {evidence.length > itemsPerPage && (
        <Paginations.PaginationCardDefault 
          page={currentPage} 
          onPageChange={onPageChange}
          total={Math.ceil(evidence.length / itemsPerPage)}
        />
      )}
    </>
  );
};

export default EvidenceTab;
