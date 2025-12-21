"use client";

import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import { Clock, TickCircle, CloseCircle } from "iconsax-react";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface TicketDetailSlideoutProps {
  ticket: SupportTicket | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "open":
      return { color: "blue" as const, label: "Open", icon: Clock };
    case "in_progress":
      return { color: "warning" as const, label: "In Progress", icon: Clock };
    case "resolved":
      return { color: "success" as const, label: "Resolved", icon: TickCircle };
    case "closed":
      return { color: "gray" as const, label: "Closed", icon: CloseCircle };
    default:
      return { color: "gray" as const, label: status, icon: Clock };
  }
};

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case "urgent":
      return { color: "error" as const, label: "Urgent" };
    case "high":
      return { color: "warning" as const, label: "High" };
    case "normal":
      return { color: "gray" as const, label: "Normal" };
    case "low":
      return { color: "gray" as const, label: "Low" };
    default:
      return { color: "gray" as const, label: priority };
  }
};

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    bug: "Bug Report",
    feature: "Feature Request",
    billing: "Billing",
    compliance: "Compliance",
    account: "Account",
    other: "Other",
  };
  return labels[category] || category;
};

export const TicketDetailSlideout = ({
  ticket,
  isOpen,
  onOpenChange,
}: TicketDetailSlideoutProps) => {
  if (!ticket) return null;

  const statusConfig = getStatusConfig(ticket.status);
  const priorityConfig = getPriorityConfig(ticket.priority);

  return (
    <SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <SlideoutMenu isDismissable>
        <SlideoutMenu.Header
          onClose={() => onOpenChange(false)}
          className="relative flex w-full flex-col gap-0.5 px-4 pt-6 md:px-6"
        >
          <div className="flex items-center gap-2 pr-8">
            <Badge color={statusConfig.color} size="sm">
              {statusConfig.label}
            </Badge>
            <Badge color={priorityConfig.color} size="sm">
              {priorityConfig.label}
            </Badge>
          </div>
          <h1 className="mt-2 text-md font-semibold text-primary md:text-lg">
            {ticket.subject}
          </h1>
          <p className="text-sm text-tertiary">
            {getCategoryLabel(ticket.category)} • Submitted {formatDate(ticket.created_at)}
          </p>
        </SlideoutMenu.Header>

        <SlideoutMenu.Content>
          <div className="flex flex-col gap-6">
            {/* Description */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-secondary">Description</h3>
              <div className="rounded-lg bg-secondary_subtle p-4">
                <p className="text-sm text-primary whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-medium text-secondary">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-tertiary">Ticket ID</p>
                  <p className="text-sm font-mono text-primary">{ticket.id.slice(0, 8)}...</p>
                </div>
                <div>
                  <p className="text-xs text-tertiary">Status</p>
                  <p className="text-sm text-primary">{statusConfig.label}</p>
                </div>
                <div>
                  <p className="text-xs text-tertiary">Priority</p>
                  <p className="text-sm text-primary">{priorityConfig.label}</p>
                </div>
                <div>
                  <p className="text-xs text-tertiary">Category</p>
                  <p className="text-sm text-primary">{getCategoryLabel(ticket.category)}</p>
                </div>
                <div>
                  <p className="text-xs text-tertiary">Created</p>
                  <p className="text-sm text-primary">{formatDate(ticket.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs text-tertiary">Last Updated</p>
                  <p className="text-sm text-primary">{formatDate(ticket.updated_at)}</p>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="rounded-lg border border-secondary bg-secondary_subtle p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100">
                  <statusConfig.icon size={16} color="currentColor" className="text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">
                    {ticket.status === "open" && "Your ticket is being reviewed"}
                    {ticket.status === "in_progress" && "We're working on your request"}
                    {ticket.status === "resolved" && "This ticket has been resolved"}
                    {ticket.status === "closed" && "This ticket is closed"}
                  </p>
                  <p className="mt-1 text-sm text-tertiary">
                    {ticket.status === "open" && "Our support team will respond within 24-48 hours."}
                    {ticket.status === "in_progress" && "A team member is actively working on this issue."}
                    {ticket.status === "resolved" && "If you need further assistance, please create a new ticket."}
                    {ticket.status === "closed" && "This ticket has been closed. Create a new ticket if you need help."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SlideoutMenu.Content>

        <SlideoutMenu.Footer className="flex w-full items-center justify-end gap-3">
          <Button size="md" color="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </SlideoutMenu.Footer>
      </SlideoutMenu>
    </SlideoutMenu.Trigger>
  );
};

export default TicketDetailSlideout;
