"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock, TickCircle, CloseCircle } from "iconsax-react";
import { Plus, Headphones01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { createClient } from "@/lib/supabase/client";
import { cx } from "@/utils/cx";
import { NewTicketSlideout } from "./components/new-ticket-slideout";
import { TicketDetailSlideout } from "./components/ticket-detail-slideout";

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
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

export default function ContactSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const supabase = createClient();

  const fetchTickets = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("support_tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tickets:", error);
        return;
      }

      setTickets(data || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleTicketCreated = () => {
    setIsNewTicketOpen(false);
    fetchTickets();
  };

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-display-xs font-semibold text-primary lg:text-display-sm">
            Contact Support
          </h1>
          <p className="mt-1 text-sm text-tertiary lg:text-md">
            Get help from our support team. View your ticket history or submit a new request.
          </p>
        </div>
        <Button
          size="md"
          color="primary"
          iconLeading={Plus}
          onClick={() => setIsNewTicketOpen(true)}
        >
          New Ticket
        </Button>
      </div>

      {/* Ticket List */}
      <div className="rounded-xl bg-primary shadow-xs ring-1 ring-secondary ring-inset">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingIndicator type="dot-circle" size="md" label="Loading tickets..." />
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-12">
            <EmptyState size="sm">
              <EmptyState.Header pattern="grid">
                <EmptyState.FeaturedIcon icon={Headphones01} color="gray" theme="modern" />
              </EmptyState.Header>
              <EmptyState.Content>
                <EmptyState.Title>No support tickets</EmptyState.Title>
                <EmptyState.Description>
                  You haven't submitted any support requests yet. Click "New Ticket" to get help.
                </EmptyState.Description>
              </EmptyState.Content>
              <EmptyState.Footer>
                <Button
                  size="md"
                  color="primary"
                  iconLeading={Plus}
                  onClick={() => setIsNewTicketOpen(true)}
                >
                  New Ticket
                </Button>
              </EmptyState.Footer>
            </EmptyState>
          </div>
        ) : (
          <div className="divide-y divide-border-secondary">
            {tickets.map((ticket) => {
              const statusConfig = getStatusConfig(ticket.status);
              const priorityConfig = getPriorityConfig(ticket.priority);

              return (
                <button
                  key={ticket.id}
                  type="button"
                  onClick={() => setSelectedTicket(ticket)}
                  className="flex w-full flex-col gap-3 p-4 text-left transition-colors hover:bg-secondary_subtle sm:flex-row sm:items-center sm:justify-between lg:p-5"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-primary truncate">
                        {ticket.subject}
                      </h3>
                    </div>
                    <p className="mt-1 text-sm text-tertiary line-clamp-1">
                      {ticket.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-tertiary">
                      <span>{getCategoryLabel(ticket.category)}</span>
                      <span>•</span>
                      <span>{formatDate(ticket.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge color={priorityConfig.color} size="sm">
                      {priorityConfig.label}
                    </Badge>
                    <Badge color={statusConfig.color} size="sm">
                      {statusConfig.label}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* New Ticket Slideout */}
      <NewTicketSlideout
        isOpen={isNewTicketOpen}
        onOpenChange={setIsNewTicketOpen}
        onTicketCreated={handleTicketCreated}
      />

      {/* Ticket Detail Slideout */}
      <TicketDetailSlideout
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onOpenChange={(open: boolean) => !open && setSelectedTicket(null)}
      />
    </div>
  );
}
