"use client";

import { Cpu } from "iconsax-react";
import { Badge } from "@/components/base/badges/badges";
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { FileIcon } from "@untitledui/file-icons";
import { getFileIconType, getLinkedToBadgeColor, type Evidence } from "../data/mock-data";

interface EvidenceTableProps {
  evidence: Evidence[];
  onRowClick: (evidence: Evidence) => void;
}

export const EvidenceTable = ({ evidence, onRowClick }: EvidenceTableProps) => {
  return (
    <TableCard.Root>
      <Table aria-label="Evidence" selectionMode="none">
        <Table.Header>
          <Table.Head id="name" isRowHeader label="File Name" />
          <Table.Head id="system" label="AI System" />
          <Table.Head id="linkedTo" label="Linked To" />
          <Table.Head id="uploadedBy" label="Uploaded By" />
          <Table.Head id="date" label="Date" />
          <Table.Head id="actions" />
        </Table.Header>
        <Table.Body items={evidence}>
          {(item: Evidence) => (
            <Table.Row id={item.id} className="odd:bg-secondary_subtle cursor-pointer hover:bg-secondary_hover" onAction={() => onRowClick(item)}>
              <Table.Cell>
                <div className="flex items-center gap-3">
                  <FileIcon type={getFileIconType(item.type)} theme="light" className="size-10 dark:hidden" />
                  <FileIcon type={getFileIconType(item.type)} theme="dark" className="size-10 not-dark:hidden" />
                  <div>
                    <p className="text-sm font-medium text-primary">{item.name}</p>
                    <p className="text-sm text-tertiary">{item.size}</p>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <Cpu size={16} color="currentColor" className="text-tertiary" />
                  <span className="text-sm text-secondary whitespace-nowrap">{item.systemName}</span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <Badge size="sm" color={getLinkedToBadgeColor(item.linkedToId)}>
                  {item.linkedTo}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <Avatar src={item.uploadedByAvatar} size="xs" />
                  <span className="text-sm text-secondary whitespace-nowrap">{item.uploadedBy}</span>
                </div>
              </Table.Cell>
              <Table.Cell>
                <span className="text-sm text-tertiary whitespace-nowrap">{item.uploadedAt}</span>
              </Table.Cell>
              <Table.Cell className="px-4">
                <TableRowActionsDropdown />
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </TableCard.Root>
  );
};

export default EvidenceTable;
