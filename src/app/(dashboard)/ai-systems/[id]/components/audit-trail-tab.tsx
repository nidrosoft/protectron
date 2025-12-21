"use client";

import { useState } from "react";
import { SearchNormal1, ArrowUp, ArrowDown, ExportSquare, Filter } from "iconsax-react";
import { ChevronDown, FileSearch02 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { cx } from "@/utils/cx";
import {
  type AISystemData,
  type AuditEvent,
  type AuditEventType,
  auditEventTypeConfig,
} from "../data/mock-data";
import { useAuditEvents } from "@/hooks";

interface AuditTrailTabProps {
  system: AISystemData;
}

// Stat card component
const StatCard = ({
  value,
  label,
  change,
}: {
  value: number | string;
  label: string;
  change?: number;
}) => (
  <div className="flex flex-col rounded-lg border border-secondary bg-primary p-4">
    <span className="text-2xl font-semibold text-primary">
      {typeof value === "number" ? value.toLocaleString() : value}
    </span>
    <span className="text-sm text-tertiary">{label}</span>
    {change !== undefined && (
      <div className={cx("mt-1 flex items-center gap-1 text-xs", change >= 0 ? "text-success-600" : "text-error-600")}>
        {change >= 0 ? <ArrowUp size={12} color="currentColor" /> : <ArrowDown size={12} color="currentColor" />}
        <span>{Math.abs(change)}%</span>
      </div>
    )}
  </div>
);

// Audit event card component
const AuditEventCard = ({ event }: { event: AuditEvent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = auditEventTypeConfig[event.type];
  const time = new Date(event.timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="rounded-lg border border-secondary bg-primary p-4">
      <div className="flex items-start gap-4">
        {/* Time */}
        <div className="shrink-0 text-sm font-mono text-tertiary">{time}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2">
            <span className={cx("flex h-6 w-6 items-center justify-center rounded text-sm", config.color)}>
              {config.icon}
            </span>
            <span className="font-medium text-primary">{config.label}</span>
          </div>

          {/* Action */}
          <p className="mt-1 text-sm font-medium text-secondary">{event.action}</p>

          {/* Agent Delegation specific layout */}
          {event.type === "agent_delegation" && event.details.fromAgent && (
            <div className="mt-2 rounded-lg border border-teal-200 bg-teal-50 p-3">
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-tertiary">From:</span>
                  <span className="font-medium text-primary">{String(event.details.fromAgent)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-tertiary">To:</span>
                  <span className="font-medium text-primary">{String(event.details.toAgent)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-tertiary">Task:</span>
                  <span className="text-secondary">"{String(event.details.task)}"</span>
                </div>
                {event.details.contextPassed && (
                  <div className="flex items-center gap-2">
                    <span className="text-tertiary">Context passed:</span>
                    <span className="text-secondary font-mono text-xs">{String(event.details.contextPassed)}</span>
                  </div>
                )}
                {event.details.priority && (
                  <div className="flex items-center gap-2">
                    <span className="text-tertiary">Priority:</span>
                    <Badge color={event.details.priority === "High" ? "error" : event.details.priority === "Medium" ? "warning" : "gray"} size="sm">
                      {String(event.details.priority)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Details - for non-delegation events */}
          {event.type !== "agent_delegation" && (
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-tertiary">
              {Object.entries(event.details).map(([key, value]) => (
                <span key={key} className="rounded bg-secondary_subtle px-2 py-1">
                  {key}: {String(value)}
                </span>
              ))}
              {event.duration && (
                <span className="rounded bg-secondary_subtle px-2 py-1">
                  Duration: {event.duration}s
                </span>
              )}
              {event.tokens && (
                <span className="rounded bg-secondary_subtle px-2 py-1">
                  Tokens: {event.tokens}
                </span>
              )}
            </div>
          )}

          {/* Duration for delegation events */}
          {event.type === "agent_delegation" && event.duration && (
            <div className="mt-2 text-xs text-tertiary">
              Delegation time: {event.duration}s
            </div>
          )}

          {/* Trace/Session IDs */}
          {(event.traceId || event.sessionId) && (
            <div className="mt-2 flex gap-4 text-xs text-quaternary">
              {event.traceId && <span>Trace: {event.traceId}</span>}
              {event.sessionId && <span>Session: {event.sessionId}</span>}
            </div>
          )}

          {/* Expanded content for specific event types */}
          {isExpanded && (
            <div className="mt-3 rounded-lg bg-secondary_subtle p-3 text-sm">
              {event.reasoning && (
                <div className="mb-2">
                  <span className="font-medium text-primary">Reasoning: </span>
                  <span className="text-secondary">{event.reasoning}</span>
                </div>
              )}
              {event.confidence !== undefined && (
                <div className="mb-2">
                  <span className="font-medium text-primary">Confidence: </span>
                  <span className="text-secondary">{(event.confidence * 100).toFixed(0)}%</span>
                </div>
              )}
              {event.alternatives && event.alternatives.length > 0 && (
                <div className="mb-2">
                  <span className="font-medium text-primary">Alternatives: </span>
                  <span className="text-secondary">{event.alternatives.join(", ")}</span>
                </div>
              )}
              {event.overrideBy && (
                <div className="mb-2">
                  <span className="font-medium text-primary">Override by: </span>
                  <span className="text-secondary">{event.overrideBy}</span>
                </div>
              )}
              {event.overrideDecision && (
                <div className="mb-2">
                  <span className="font-medium text-primary">Decision: </span>
                  <Badge color={event.overrideDecision === "approved" ? "success" : "error"} size="sm">
                    {event.overrideDecision === "approved" ? "✅ Approved" : "❌ Rejected"}
                  </Badge>
                </div>
              )}
              {event.overrideReason && (
                <div className="mb-2">
                  <span className="font-medium text-primary">Reason: </span>
                  <span className="text-secondary">{event.overrideReason}</span>
                </div>
              )}
              {event.responseTime && (
                <div>
                  <span className="font-medium text-primary">Response time: </span>
                  <span className="text-secondary">{event.responseTime} seconds</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Expand button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0 text-sm text-brand-600 hover:text-brand-700"
        >
          {isExpanded ? "Collapse ▲" : "Expand ▼"}
        </button>
      </div>
    </div>
  );
};

export const AuditTrailTab = ({ system }: AuditTrailTabProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState<AuditEventType | "all">("all");
  const [isLive, setIsLive] = useState(true);

  // Fetch real audit events from API
  const { events: apiEvents, statistics: apiStats, isLoading } = useAuditEvents({
    systemId: system.id,
    eventType: eventTypeFilter !== "all" ? eventTypeFilter : undefined,
  });

  // Use API data if available, fallback to system prop data
  const stats = apiStats || system.auditStatistics;
  const events = (apiEvents as AuditEvent[]) || system.auditEvents || [];

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(event.details).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = eventTypeFilter === "all" || event.type === eventTypeFilter;
    return matchesSearch && matchesType;
  });

  if (!stats) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <EmptyState size="md">
          <EmptyState.Header pattern="grid">
            <EmptyState.FeaturedIcon icon={FileSearch02} color="gray" theme="modern" />
          </EmptyState.Header>
          <EmptyState.Content>
            <EmptyState.Title>No audit data available</EmptyState.Title>
            <EmptyState.Description>
              Connect the Protectron SDK to start logging agent actions and decisions automatically.
            </EmptyState.Description>
          </EmptyState.Content>
          <EmptyState.Footer>
            <Button size="lg">
              Set Up SDK Integration
            </Button>
          </EmptyState.Footer>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Statistics Panel */}
      <div className="rounded-xl border border-secondary bg-secondary_subtle p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-primary">Audit Statistics (Last 30 days)</h3>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard value={stats.totalActions} label="Total Actions" change={stats.totalActionsChange} />
          <StatCard value={stats.toolCalls} label="Tool Calls" change={stats.toolCallsChange} />
          <StatCard value={stats.decisionsMade} label="Decisions Made" change={stats.decisionsMadeChange} />
          <StatCard value={stats.humanOverrides} label="Human Overrides" change={stats.humanOverridesChange} />
          <StatCard value={stats.errors} label="Errors" change={stats.errorsChange} />
        </div>

        {/* Additional Metrics */}
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-secondary pt-4 sm:grid-cols-4">
          <div className="text-sm">
            <span className="text-tertiary">Human Oversight Rate: </span>
            <span className="font-medium text-primary">{stats.humanOversightRate}%</span>
          </div>
          <div className="text-sm">
            <span className="text-tertiary">Escalation Rate: </span>
            <span className="font-medium text-primary">{stats.escalationRate}%</span>
          </div>
          <div className="text-sm">
            <span className="text-tertiary">Avg Response Time: </span>
            <span className="font-medium text-primary">{stats.avgResponseTime}s</span>
          </div>
          <div className="text-sm">
            <span className="text-tertiary">Avg Tokens/Action: </span>
            <span className="font-medium text-primary">{stats.avgTokensPerAction.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative min-w-[200px] max-w-md">
            <SearchNormal1
              size={20}
              color="currentColor"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-quaternary z-10"
            />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-secondary bg-primary py-2 pl-10 pr-4 text-sm text-primary placeholder:text-quaternary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Event Type Filter */}
          <Dropdown.Root>
            <Button 
              size="sm" 
              color="secondary" 
              iconLeading={({ className }) => <Filter size={16} color="currentColor" className={className} />}
              iconTrailing={ChevronDown}
            >
              {eventTypeFilter === "all" ? "All Events" : auditEventTypeConfig[eventTypeFilter].label}
            </Button>
            <Dropdown.Popover>
              <Dropdown.Menu 
                onAction={(key) => setEventTypeFilter(key as AuditEventType | "all")}
                selectedKeys={[eventTypeFilter]}
              >
                <Dropdown.Item id="all" label="All Events" />
                <Dropdown.Separator />
                {Object.entries(auditEventTypeConfig).map(([key, config]) => (
                  <Dropdown.Item 
                    key={key} 
                    id={key} 
                    label={`${config.icon} ${config.label}`}
                  />
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown.Root>
        </div>

        {/* Live Toggle and Export */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={cx(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isLive ? "bg-success-50 text-success-700" : "bg-secondary text-secondary"
            )}
          >
            <span className={cx("h-2 w-2 rounded-full", isLive ? "bg-success-500 animate-pulse" : "bg-gray-400")} />
            {isLive ? "Live" : "Paused"}
          </button>

          <div className="flex items-center gap-1">
            <Button size="sm" color="secondary" iconLeading={({ className }) => <ExportSquare size={16} color="currentColor" className={className} />}>
              CSV
            </Button>
            <Button size="sm" color="secondary" iconLeading={({ className }) => <ExportSquare size={16} color="currentColor" className={className} />}>
              JSON
            </Button>
            <Button size="sm" color="secondary" iconLeading={({ className }) => <ExportSquare size={16} color="currentColor" className={className} />}>
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Event Timeline */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <span>TODAY — {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="rounded-lg border border-secondary bg-primary p-8 text-center">
            <p className="text-sm text-tertiary">No events match your filters.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredEvents.map((event) => (
              <AuditEventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredEvents.length > 0 && (
          <Button size="md" color="secondary" className="mx-auto">
            Load More ↓
          </Button>
        )}
      </div>
    </div>
  );
};

export default AuditTrailTab;
