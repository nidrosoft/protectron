"use client";

import { ArrowRight2, Clock, Cpu } from "iconsax-react";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Badge } from "@/components/base/badges/badges";

export interface Delegation {
  id: string;
  timestamp: string;
  fromAgent: string;
  toAgent: string;
  task: string;
  contextPassed: string;
  priority: "High" | "Medium" | "Low";
  duration: number;
  status: "completed" | "in_progress" | "failed";
}

interface DelegationsSlideoutProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  agentName: string;
  delegations: Delegation[];
  stats?: {
    delegationsToday: number;
    avgDelegationTime: number;
  };
}

const priorityConfig = {
  High: { color: "error" as const },
  Medium: { color: "warning" as const },
  Low: { color: "gray" as const },
};

const statusConfig = {
  completed: { color: "success" as const, label: "Completed" },
  in_progress: { color: "warning" as const, label: "In Progress" },
  failed: { color: "error" as const, label: "Failed" },
};

const mockDelegations: Delegation[] = [
  {
    id: "del-001",
    timestamp: "2024-12-16T14:23:01Z",
    fromAgent: "Customer Support Agent",
    toAgent: "Data Analysis Agent",
    task: "Analyze Q4 sales data",
    contextPassed: "order_ids, date_range",
    priority: "High",
    duration: 2.3,
    status: "completed",
  },
  {
    id: "del-002",
    timestamp: "2024-12-16T14:18:45Z",
    fromAgent: "Customer Support Agent",
    toAgent: "Email Composer Agent",
    task: "Draft refund confirmation email",
    contextPassed: "customer_email, refund_amount, order_id",
    priority: "Medium",
    duration: 1.8,
    status: "completed",
  },
  {
    id: "del-003",
    timestamp: "2024-12-16T14:15:22Z",
    fromAgent: "Customer Support Agent",
    toAgent: "Knowledge Base Agent",
    task: "Lookup return policy for electronics",
    contextPassed: "product_category, purchase_date",
    priority: "Low",
    duration: 0.9,
    status: "completed",
  },
  {
    id: "del-004",
    timestamp: "2024-12-16T14:10:15Z",
    fromAgent: "Customer Support Agent",
    toAgent: "Data Analysis Agent",
    task: "Check customer purchase history",
    contextPassed: "customer_id",
    priority: "Medium",
    duration: 1.2,
    status: "completed",
  },
  {
    id: "del-005",
    timestamp: "2024-12-16T14:05:30Z",
    fromAgent: "Customer Support Agent",
    toAgent: "Email Composer Agent",
    task: "Generate order status update",
    contextPassed: "order_id, tracking_number",
    priority: "Low",
    duration: 2.1,
    status: "completed",
  },
];

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const DelegationsSlideout = ({
  isOpen,
  onOpenChange,
  agentName,
  delegations = mockDelegations,
  stats,
}: DelegationsSlideoutProps) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <SlideoutMenu isDismissable>
        <div className="relative w-full">
          <CloseButton 
            className="absolute top-3 right-3 z-10" 
            theme="dark" 
            onClick={handleClose} 
          />
          
          {/* Header */}
          <div className="bg-brand-50 px-4 pt-4 pb-6 md:px-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100">
                <Cpu size={24} className="text-brand-600" color="currentColor" />
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <h2 className="text-lg font-semibold text-primary">
                  Agent Delegations
                </h2>
                <p className="mt-1 text-sm text-tertiary">
                  {agentName}
                </p>
                {stats && (
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <span className="text-tertiary">
                      Today: <strong className="text-primary">{stats.delegationsToday}</strong>
                    </span>
                    <span className="text-tertiary">
                      Avg time: <strong className="text-primary">{stats.avgDelegationTime}s</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <SlideoutMenu.Content>
          <div className="flex flex-col gap-3">
            {delegations.map((delegation) => (
              <div 
                key={delegation.id} 
                className="rounded-lg border border-secondary bg-primary p-4 hover:border-brand-200 transition-colors"
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-tertiary">{formatTime(delegation.timestamp)}</span>
                  <div className="flex items-center gap-2">
                    <Badge color={priorityConfig[delegation.priority].color} size="sm">
                      {delegation.priority}
                    </Badge>
                    <Badge color={statusConfig[delegation.status].color} size="sm">
                      {statusConfig[delegation.status].label}
                    </Badge>
                  </div>
                </div>

                {/* From → To */}
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span className="font-medium text-primary">{delegation.fromAgent}</span>
                  <ArrowRight2 size={14} className="text-tertiary" color="currentColor" />
                  <span className="font-medium text-primary">{delegation.toAgent}</span>
                </div>

                {/* Task */}
                <p className="text-sm text-secondary mb-2">"{delegation.task}"</p>

                {/* Context & Duration */}
                <div className="flex items-center justify-between text-xs text-tertiary">
                  <span>Context: <span className="font-mono">{delegation.contextPassed}</span></span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} color="currentColor" />
                    {delegation.duration}s
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SlideoutMenu.Content>

        <SlideoutMenu.Footer className="flex w-full items-center justify-end gap-3">
          <Button size="md" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </SlideoutMenu.Footer>
      </SlideoutMenu>
    </SlideoutMenu.Trigger>
  );
};

export default DelegationsSlideout;
