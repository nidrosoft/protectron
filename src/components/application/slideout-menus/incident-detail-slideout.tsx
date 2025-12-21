"use client";

import { Warning2, Calendar, Cpu, User, Link21, DocumentText1, TickCircle, CloseCircle } from "iconsax-react";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";

export interface Incident {
  id: string;
  title: string;
  type: string;
  typeLabel: string;
  severity: "low" | "medium" | "high" | "critical";
  status: string;
  statusLabel: string;
  aiSystem: string;
  aiSystemId: string;
  individualsAffected: number;
  occurredAt: string;
  detectedAt: string;
  reportedAt: string;
  reportedBy: string;
  description: string;
  categoriesAffected?: string[];
  linkedEvents?: string[];
  reportedToRegulator?: boolean;
  resolutionNotes?: string;
}

interface IncidentDetailSlideoutProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  incident: Incident | null;
  onResolve?: (incident: Incident) => void;
  onEscalate?: (incident: Incident) => void;
}

const severityConfig = {
  low: { color: "gray" as const, label: "Low", bgColor: "bg-gray-50", textColor: "text-gray-600" },
  medium: { color: "warning" as const, label: "Medium", bgColor: "bg-warning-50", textColor: "text-warning-600" },
  high: { color: "error" as const, label: "High", bgColor: "bg-error-50", textColor: "text-error-600" },
  critical: { color: "error" as const, label: "Critical", bgColor: "bg-error-100", textColor: "text-error-700" },
};

const statusConfig = {
  investigating: { color: "warning" as const, label: "Investigating" },
  resolved: { color: "success" as const, label: "Resolved" },
  reported: { color: "brand" as const, label: "Reported to Authority" },
  closed: { color: "gray" as const, label: "Closed" },
};

const Divider = () => (
  <svg className="h-[2.5px] w-full">
    <line
      x1="1.2"
      y1="1.2"
      x2="100%"
      y2="1.2"
      className="stroke-border-primary"
      stroke="black"
      strokeWidth="2.4"
      strokeDasharray="0,6"
      strokeLinecap="round"
    />
  </svg>
);

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const IncidentDetailSlideout = ({
  isOpen,
  onOpenChange,
  incident,
  onResolve,
  onEscalate,
}: IncidentDetailSlideoutProps) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  if (!incident) return null;

  const severity = severityConfig[incident.severity];
  const status = statusConfig[incident.status as keyof typeof statusConfig] || statusConfig.investigating;

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
          <div className={`${severity.bgColor} px-4 pt-4 pb-6 md:px-6`}>
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${severity.bgColor}`}>
                <Warning2 size={28} className={severity.textColor} color="currentColor" variant="Bold" />
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="text-xs font-mono text-tertiary">{incident.id}</span>
                  <BadgeWithDot color={severity.color} size="sm">
                    {severity.label}
                  </BadgeWithDot>
                  <Badge color={status.color} size="sm">
                    {status.label}
                  </Badge>
                </div>
                <h2 className="text-lg font-semibold text-primary">
                  {incident.title}
                </h2>
                <p className="mt-1 text-sm text-tertiary">
                  {incident.typeLabel}
                </p>
              </div>
            </div>
          </div>
        </div>

        <SlideoutMenu.Content>
          <div className="flex flex-col gap-4">
            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary">Description</label>
              <p className="text-sm text-primary">{incident.description}</p>
            </div>

            <Divider />

            {/* AI System */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary">AI System</label>
              <div className="flex items-center gap-2">
                <Cpu size={16} color="currentColor" className="text-tertiary" />
                <span className="text-sm text-primary">{incident.aiSystem}</span>
              </div>
            </div>

            <Divider />

            {/* Impact */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-secondary">Impact Assessment</label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-tertiary">Individuals affected</span>
                <span className="text-sm font-medium text-primary">{incident.individualsAffected}</span>
              </div>
              {incident.categoriesAffected && incident.categoriesAffected.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm text-tertiary">Categories affected</span>
                  <div className="flex flex-wrap gap-1">
                    {incident.categoriesAffected.map((category) => (
                      <Badge key={category} color="gray" size="sm">{category}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Divider />

            {/* Timeline */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-secondary flex items-center gap-2">
                <Calendar size={16} color="currentColor" />
                Timeline
              </label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-tertiary">Occurred</span>
                <span className="text-sm font-medium text-primary">{formatDate(incident.occurredAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-tertiary">Detected</span>
                <span className="text-sm font-medium text-primary">{formatDate(incident.detectedAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-tertiary">Reported</span>
                <span className="text-sm font-medium text-primary">{formatDate(incident.reportedAt)}</span>
              </div>
            </div>

            <Divider />

            {/* Reported By */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary">Reported By</label>
              <div className="flex items-center gap-2">
                <User size={16} color="currentColor" className="text-tertiary" />
                <span className="text-sm text-primary">{incident.reportedBy}</span>
              </div>
            </div>

            <Divider />

            {/* Linked Events */}
            {incident.linkedEvents && incident.linkedEvents.length > 0 && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-secondary flex items-center gap-2">
                    <Link21 size={16} color="currentColor" />
                    Linked Audit Events
                  </label>
                  <div className="flex flex-col gap-1 rounded-lg border border-secondary bg-secondary_subtle p-3">
                    {incident.linkedEvents.map((event) => (
                      <span key={event} className="text-sm font-mono text-secondary">{event}</span>
                    ))}
                  </div>
                </div>
                <Divider />
              </>
            )}

            {/* Regulatory Reporting */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-tertiary">Reported to regulatory authority</span>
              <div className="flex items-center gap-1.5">
                {incident.reportedToRegulator ? (
                  <>
                    <TickCircle size={16} className="text-success-600" color="currentColor" variant="Bold" />
                    <span className="text-sm font-medium text-success-600">Yes</span>
                  </>
                ) : (
                  <>
                    <CloseCircle size={16} className="text-tertiary" color="currentColor" />
                    <span className="text-sm text-tertiary">No</span>
                  </>
                )}
              </div>
            </div>

            {/* Resolution Notes */}
            {incident.status === "resolved" && incident.resolutionNotes && (
              <>
                <Divider />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-secondary">Resolution Notes</label>
                  <p className="text-sm text-primary">{incident.resolutionNotes}</p>
                </div>
              </>
            )}
          </div>
        </SlideoutMenu.Content>

        <SlideoutMenu.Footer className="flex w-full items-center justify-between gap-3">
          <div>
            {incident.status === "investigating" && onEscalate && (
              <Button 
                size="md" 
                color="primary-destructive"
                onClick={() => onEscalate(incident)}
              >
                Escalate
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            {incident.status === "investigating" && onResolve && (
              <Button 
                size="md" 
                color="primary"
                iconLeading={({ className }) => <TickCircle size={18} color="currentColor" className={className} />}
                onClick={() => onResolve(incident)}
              >
                Mark Resolved
              </Button>
            )}
            <Button size="md" color="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </SlideoutMenu.Footer>
      </SlideoutMenu>
    </SlideoutMenu.Trigger>
  );
};

export default IncidentDetailSlideout;
