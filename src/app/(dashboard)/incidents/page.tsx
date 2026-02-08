"use client";

import { useState } from "react";
import { Warning2, SearchNormal1, Filter, Add, Calendar, ArrowRight2 } from "iconsax-react";
import { AlertCircle } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Select } from "@/components/base/select/select";
import { ReportIncidentModal, type IncidentReport } from "@/components/application/modals/report-incident-modal";
import { IncidentDetailSlideout, type Incident } from "@/components/application/slideout-menus/incident-detail-slideout";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { useIncidents } from "@/hooks";
import { useAISystems } from "@/hooks";
import { useToast } from "@/components/base/toast/toast";


const severityConfig = {
  low: { color: "gray" as const, label: "Low" },
  medium: { color: "warning" as const, label: "Medium" },
  high: { color: "error" as const, label: "High" },
  critical: { color: "error" as const, label: "Critical" },
};

const statusConfig = {
  open: { color: "blue" as const, label: "Open" },
  investigating: { color: "warning" as const, label: "Investigating" },
  resolved: { color: "success" as const, label: "Resolved" },
  reported: { color: "brand" as const, label: "Reported to Authority" },
  closed: { color: "gray" as const, label: "Closed" },
};

const severityFilterOptions = [
  { id: "all", label: "All Severities" },
  { id: "critical", label: "Critical" },
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "Low" },
];

export default function IncidentsPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDetailSlideoutOpen, setIsDetailSlideoutOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  // Fetch real incidents from API
  const { incidents, isLoading, createIncident, refetch } = useIncidents();
  const { systems } = useAISystems();
  const { addToast } = useToast();

  const handleViewIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsDetailSlideoutOpen(true);
  };

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.aiSystem.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "all" || incident.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Incidents</h1>
          <p className="mt-1 text-sm text-tertiary">
            Track and report incidents for EU AI Act Article 26(5) compliance.
          </p>
        </div>
        <Button 
          size="md"
          iconLeading={({ className }) => <Add size={20} color="currentColor" className={className} />}
          onClick={() => setIsReportModalOpen(true)}
        >
          Report Incident
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-secondary bg-primary p-4">
          <p className="text-2xl font-semibold text-primary">{incidents.length}</p>
          <p className="text-sm text-tertiary">Total Incidents</p>
        </div>
        <div className="rounded-xl border border-secondary bg-primary p-4">
          <p className="text-2xl font-semibold text-warning-600">
            {incidents.filter(i => i.status === "investigating").length}
          </p>
          <p className="text-sm text-tertiary">Under Investigation</p>
        </div>
        <div className="rounded-xl border border-secondary bg-primary p-4">
          <p className="text-2xl font-semibold text-error-600">
            {incidents.filter(i => i.severity === "critical" || i.severity === "high").length}
          </p>
          <p className="text-sm text-tertiary">High/Critical Severity</p>
        </div>
        <div className="rounded-xl border border-secondary bg-primary p-4">
          <p className="text-2xl font-semibold text-brand-600">
            {incidents.filter(i => i.status === "reported").length}
          </p>
          <p className="text-sm text-tertiary">Reported to Authority</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <SearchNormal1 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-quaternary" color="currentColor" />
          <input
            type="text"
            placeholder="Search incidents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-primary bg-primary py-2 pl-10 pr-4 text-sm text-primary placeholder:text-quaternary focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-tertiary" color="currentColor" />
          <Select
            size="sm"
            selectedKey={severityFilter}
            onSelectionChange={(key) => setSeverityFilter(key as string)}
            items={severityFilterOptions}
            className="w-40"
          >
            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
          </Select>
        </div>
      </div>

      {/* Incidents List */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingIndicator type="dot-circle" size="md" label="Loading incidents..." />
          </div>
        ) : incidents.length === 0 ? (
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <EmptyState size="md">
              <EmptyState.Header pattern="grid">
                <EmptyState.FeaturedIcon icon={AlertCircle} color="gray" theme="modern" />
              </EmptyState.Header>
              <EmptyState.Content>
                <EmptyState.Title>No incidents reported</EmptyState.Title>
                <EmptyState.Description>
                  Track and report incidents for EU AI Act Article 26(5) compliance. Report your first incident to get started.
                </EmptyState.Description>
              </EmptyState.Content>
              <EmptyState.Footer>
                <Button 
                  size="lg" 
                  iconLeading={({ className }) => <Add size={20} color="currentColor" className={className} />}
                  onClick={() => setIsReportModalOpen(true)}
                >
                  Report Incident
                </Button>
              </EmptyState.Footer>
            </EmptyState>
          </div>
        ) : filteredIncidents.length === 0 ? (
          <div className="flex h-full min-h-[300px] items-center justify-center">
            <EmptyState size="sm">
              <EmptyState.Header pattern="grid">
                <EmptyState.FeaturedIcon icon={SearchNormal1} color="gray" theme="modern" />
              </EmptyState.Header>
              <EmptyState.Content>
                <EmptyState.Title>No matching incidents</EmptyState.Title>
                <EmptyState.Description>
                  Try adjusting your search or filter criteria.
                </EmptyState.Description>
              </EmptyState.Content>
            </EmptyState>
          </div>
        ) : (
          filteredIncidents.map((incident) => (
            <div 
              key={incident.id} 
              className="rounded-xl border border-secondary bg-primary p-5 hover:border-brand-200 transition-colors cursor-pointer"
              onClick={() => handleViewIncident(incident as Incident)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    incident.severity === "critical" || incident.severity === "high" 
                      ? "bg-error-50" 
                      : incident.severity === "medium" 
                        ? "bg-warning-50" 
                        : "bg-gray-50"
                  }`}>
                    <Warning2 
                      size={20} 
                      className={
                        incident.severity === "critical" || incident.severity === "high" 
                          ? "text-error-600" 
                          : incident.severity === "medium" 
                            ? "text-warning-600" 
                            : "text-gray-600"
                      } 
                      color="currentColor" 
                      variant="Bold" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-tertiary">{incident.id}</span>
                      <BadgeWithDot color={severityConfig[incident.severity].color} size="sm">
                        {severityConfig[incident.severity].label}
                      </BadgeWithDot>
                      <Badge color={statusConfig[incident.status as keyof typeof statusConfig].color} size="sm">
                        {statusConfig[incident.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                    <h3 className="mt-1 font-semibold text-primary">{incident.title}</h3>
                    <p className="mt-1 text-sm text-tertiary line-clamp-2">{incident.description}</p>
                    
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-tertiary">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">AI System:</span> {incident.aiSystem}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Type:</span> {incident.typeLabel}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} color="currentColor" />
                        {formatDate(incident.occurredAt)}
                      </span>
                      {incident.individualsAffected > 0 && (
                        <>
                          <span>•</span>
                          <span>{incident.individualsAffected} individual(s) affected</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  color="secondary" 
                  iconTrailing={({ className }) => <ArrowRight2 size={16} color="currentColor" className={className} />}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleViewIncident(incident as Incident);
                  }}
                >
                  View
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Incident Modal */}
      <ReportIncidentModal
        isOpen={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
        aiSystems={systems}
        onSubmit={async (incident: IncidentReport) => {
          const result = await createIncident({
            aiSystemId: (incident as any).aiSystemId || systems[0]?.id || "",
            type: incident.type,
            severity: incident.severity,
            title: incident.title,
            description: incident.description,
            individualsAffected: incident.individualsAffected,
            categoriesAffected: incident.categoriesAffected,
            occurredAt: incident.occurredAt,
            detectedAt: incident.detectedAt,
            linkedEvents: incident.linkedEvents,
            reportToRegulator: incident.reportToRegulator,
          });
          if (result) {
            addToast({ type: "success", title: "Incident reported", message: `Incident "${incident.title}" reported successfully!` });
            refetch();
          }
        }}
      />

      {/* Incident Detail Slideout */}
      <IncidentDetailSlideout
        isOpen={isDetailSlideoutOpen}
        onOpenChange={setIsDetailSlideoutOpen}
        incident={selectedIncident}
        onResolve={async (incident) => {
          try {
            const response = await fetch(`/api/v1/incidents/${incident.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "resolved" }),
            });
            
            if (response.ok) {
              await refetch();
              setIsDetailSlideoutOpen(false);
            } else {
              console.error("Failed to resolve incident");
            }
          } catch (error) {
            console.error("Error resolving incident:", error);
          }
        }}
        onEscalate={async (incident) => {
          try {
            const response = await fetch(`/api/v1/incidents/${incident.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ reported_to_regulator: true, status: "reported" }),
            });
            
            if (response.ok) {
              await refetch();
            } else {
              console.error("Failed to escalate incident");
            }
          } catch (error) {
            console.error("Error escalating incident:", error);
          }
        }}
      />
    </div>
  );
}
