"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock } from "@untitledui/icons";
import { Avatar } from "@/components/base/avatar/avatar";
import { Table, TableCard } from "@/components/application/table/table";
import * as Paginations from "@/components/application/pagination/pagination";
import { EmptyState } from "@/components/application/empty-state/empty-state";

interface ActivityItem {
  id: string;
  user: string;
  avatarUrl: string;
  action: string;
  target: string;
  time: string;
}

interface ActivityTabProps {
  systemId: string;
  activity?: ActivityItem[];
  paginatedActivity?: ActivityItem[];
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export const ActivityTab = ({
  systemId,
  currentPage,
  onPageChange,
  itemsPerPage,
}: ActivityTabProps) => {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivity = useCallback(async () => {
    setIsLoading(true);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await fetch(
        `/api/v1/ai-systems/${systemId}/activity?limit=${itemsPerPage}&offset=${offset}`
      );
      if (response.ok) {
        const data = await response.json();
        const transformedActivity = data.data.map((item: any) => ({
          id: item.id,
          user: item.userName || "System",
          avatarUrl: item.userAvatar || "",
          action: item.description || item.actionType,
          target: item.targetName || "-",
          time: formatTimeAgo(item.createdAt),
        }));
        setActivity(transformedActivity);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
    } finally {
      setIsLoading(false);
    }
  }, [systemId, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-2xl">
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
          <div className="h-12 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }
  // Show empty state when no activity
  if (activity.length === 0) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <EmptyState size="md">
          <EmptyState.Header pattern="grid">
            <EmptyState.FeaturedIcon icon={Clock} color="gray" theme="modern" />
          </EmptyState.Header>
          <EmptyState.Content>
            <EmptyState.Title>No activity yet</EmptyState.Title>
            <EmptyState.Description>
              Activity will appear here as you work on compliance requirements, upload evidence, and generate documents.
            </EmptyState.Description>
          </EmptyState.Content>
        </EmptyState>
      </div>
    );
  }

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
          <Table.Body items={activity}>
            {(item: ActivityItem) => (
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
      {total > itemsPerPage && (
        <Paginations.PaginationCardDefault 
          page={currentPage} 
          onPageChange={onPageChange}
          total={Math.ceil(total / itemsPerPage)}
        />
      )}
    </>
  );
};

export default ActivityTab;
