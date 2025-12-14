"use client";

import { Avatar } from "@/components/base/avatar/avatar";
import { Table, TableCard } from "@/components/application/table/table";
import * as Paginations from "@/components/application/pagination/pagination";

interface ActivityItem {
  id: string;
  user: string;
  avatarUrl: string;
  action: string;
  target: string;
  time: string;
}

interface ActivityTabProps {
  activity: ActivityItem[];
  paginatedActivity: ActivityItem[];
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

export const ActivityTab = ({
  activity,
  paginatedActivity,
  currentPage,
  onPageChange,
  itemsPerPage,
}: ActivityTabProps) => {
  return (
    <>
      <TableCard.Root>
        <TableCard.Header
          title="Activity History"
          description="Recent actions and changes for this AI system."
        />
        <Table aria-label="Activity" selectionMode="none">
          <Table.Header>
            <Table.Head id="user" isRowHeader label="User" />
            <Table.Head id="action" label="Action" />
            <Table.Head id="target" label="Target" />
            <Table.Head id="time" label="Time" />
          </Table.Header>
          <Table.Body items={paginatedActivity}>
            {(item) => (
              <Table.Row id={item.id} className="odd:bg-secondary_subtle">
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <Avatar src={item.avatarUrl} alt={item.user} size="sm" />
                    <span className="text-sm font-medium text-primary whitespace-nowrap">{item.user}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-sm text-secondary whitespace-nowrap">{item.action}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-sm font-medium text-primary whitespace-nowrap">{item.target}</span>
                </Table.Cell>
                <Table.Cell>
                  <span className="text-sm text-tertiary whitespace-nowrap">{item.time}</span>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </TableCard.Root>
      {activity.length > itemsPerPage && (
        <Paginations.PaginationCardDefault 
          page={currentPage} 
          onPageChange={onPageChange}
          total={Math.ceil(activity.length / itemsPerPage)}
        />
      )}
    </>
  );
};

export default ActivityTab;
