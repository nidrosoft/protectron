"use client";

import { useState } from "react";
import { Warning2, Calendar, Link21 } from "iconsax-react";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { BackgroundPattern } from "@/components/shared-assets/background-patterns";

export interface IncidentReport {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  individualsAffected: number;
  categoriesAffected: string[];
  occurredAt: string;
  detectedAt: string;
  linkedEvents: string[];
  reportToRegulator: boolean;
  aiSystemId?: string;
}

interface ReportIncidentModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (incident: IncidentReport) => void;
  availableEvents?: { id: string; type: string; description: string; timestamp: string }[];
  aiSystems?: { id: string; name: string }[];
}

const incidentTypes = [
  { id: "safety_incident", label: "Safety Incident" },
  { id: "rights_violation", label: "Rights Violation" },
  { id: "malfunction", label: "Malfunction" },
  { id: "security_breach", label: "Security Breach" },
  { id: "other", label: "Other" },
];

const severityOptions = [
  { value: "low", label: "Low", description: "Minor issue, no harm caused" },
  { value: "medium", label: "Medium", description: "Potential harm, contained impact" },
  { value: "high", label: "High", description: "Significant harm or risk to individuals" },
  { value: "critical", label: "Critical", description: "Serious harm, immediate regulatory notification needed" },
];

const impactCategories = [
  { id: "privacy", label: "Privacy / Data Protection" },
  { id: "financial", label: "Financial" },
  { id: "physical_safety", label: "Physical Safety" },
  { id: "discrimination", label: "Discrimination" },
  { id: "fundamental_rights", label: "Other Fundamental Rights" },
];

const mockAuditEvents = [
  { id: "evt_abc123", type: "tool_call", description: "query_customer_database", timestamp: "13:45:02" },
  { id: "evt_abc124", type: "action", description: "send_response", timestamp: "13:45:08" },
  { id: "evt_abc125", type: "decision", description: "approve_refund", timestamp: "13:46:15" },
];

const defaultIncident: IncidentReport = {
  type: "safety_incident",
  severity: "medium",
  title: "",
  description: "",
  individualsAffected: 1,
  categoriesAffected: [],
  occurredAt: "",
  detectedAt: "",
  linkedEvents: [],
  reportToRegulator: false,
  aiSystemId: "",
};

export const ReportIncidentModal = ({
  isOpen,
  onOpenChange,
  onSubmit,
  availableEvents = mockAuditEvents,
  aiSystems = [],
}: ReportIncidentModalProps) => {
  const [incident, setIncident] = useState<IncidentReport>(defaultIncident);

  const canSubmit = 
    incident.title.trim().length > 0 && 
    incident.description.trim().length > 0 &&
    incident.occurredAt.length > 0 &&
    incident.detectedAt.length > 0;

  const handleClose = () => {
    setIncident(defaultIncident);
    onOpenChange(false);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(incident);
    handleClose();
  };

  const toggleCategory = (categoryId: string) => {
    setIncident({
      ...incident,
      categoriesAffected: incident.categoriesAffected.includes(categoryId)
        ? incident.categoriesAffected.filter(c => c !== categoryId)
        : [...incident.categoriesAffected, categoryId],
    });
  };

  const toggleEvent = (eventId: string) => {
    setIncident({
      ...incident,
      linkedEvents: incident.linkedEvents.includes(eventId)
        ? incident.linkedEvents.filter(e => e !== eventId)
        : [...incident.linkedEvents, eventId],
    });
  };

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
              <CloseButton 
                onClick={handleClose} 
                theme="light" 
                size="lg" 
                className="absolute top-3 right-3 z-20" 
              />
              
              {/* Header */}
              <div className="flex flex-col gap-4 px-6 pt-6 pb-4 border-b border-secondary">
                <div className="relative w-max">
                  <FeaturedIcon 
                    color="warning" 
                    size="lg" 
                    theme="light" 
                    icon={({ className }) => <Warning2 className={className} color="currentColor" variant="Bold" />} 
                  />
                  <BackgroundPattern 
                    pattern="circle" 
                    size="sm" 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                  />
                </div>
                <div>
                  <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                    Report Incident
                  </AriaHeading>
                  <p className="mt-1 text-sm text-tertiary">
                    Report a serious incident for EU AI Act Article 26(5) compliance.
                  </p>
                </div>
              </div>

              {/* Form Content */}
              <div className="flex flex-col gap-6 p-6">
                {/* AI System Selection */}
                {aiSystems.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-primary">AI System *</label>
                    <Select
                      size="md"
                      selectedKey={incident.aiSystemId || ""}
                      onSelectionChange={(key) => setIncident({ ...incident, aiSystemId: key as string })}
                      items={aiSystems.map(s => ({ id: s.id, label: s.name }))}
                      className="mt-1"
                      placeholder="Select AI System"
                    >
                      {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                    </Select>
                  </div>
                )}

                {/* Incident Type & Severity */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-primary">Incident Type *</label>
                    <Select
                      size="md"
                      selectedKey={incident.type}
                      onSelectionChange={(key) => setIncident({ ...incident, type: key as string })}
                      items={incidentTypes}
                      className="mt-1"
                    >
                      {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                    </Select>
                  </div>
                </div>

                {/* Severity */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-primary">Severity *</label>
                  <div className="flex flex-col gap-2">
                    {severityOptions.map((option) => (
                      <label 
                        key={option.value} 
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          incident.severity === option.value 
                            ? "border-brand-300 bg-brand-50" 
                            : "border-secondary hover:bg-secondary_subtle"
                        }`}
                      >
                        <input
                          type="radio"
                          name="severity"
                          value={option.value}
                          checked={incident.severity === option.value}
                          onChange={() => setIncident({ ...incident, severity: option.value as IncidentReport["severity"] })}
                          className="mt-0.5 h-4 w-4 text-brand-600"
                        />
                        <div>
                          <span className="text-sm font-medium text-primary">{option.label}</span>
                          <span className="text-sm text-tertiary"> - {option.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-secondary" />

                {/* Title & Description */}
                <Input
                  label="Incident Title *"
                  placeholder="Brief summary of the incident"
                  value={incident.title}
                  onChange={(value: string) => setIncident({ ...incident, title: value })}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-primary">Description *</label>
                  <textarea
                    value={incident.description}
                    onChange={(e) => setIncident({ ...incident, description: e.target.value })}
                    placeholder="Provide detailed information about what happened, how it was discovered, and any immediate actions taken..."
                    rows={4}
                    className="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary placeholder:text-quaternary focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100 resize-none"
                  />
                </div>

                {/* Divider */}
                <div className="h-px bg-secondary" />

                {/* Impact Assessment */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-semibold text-primary">Impact Assessment</h4>
                  
                  <div className="w-48">
                    <label className="text-sm font-medium text-primary">Number of individuals affected</label>
                    <input
                      type="number"
                      min={0}
                      value={incident.individualsAffected}
                      onChange={(e) => setIncident({ ...incident, individualsAffected: parseInt(e.target.value) || 0 })}
                      className="mt-1 w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-primary">Categories affected (select all that apply)</label>
                    <div className="flex flex-col gap-2">
                      {impactCategories.map((category) => (
                        <label key={category.id} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={incident.categoriesAffected.includes(category.id)}
                            onChange={() => toggleCategory(category.id)}
                            className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                          />
                          <span className="text-sm text-secondary">{category.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-secondary" />

                {/* Timeline */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Calendar size={16} color="currentColor" />
                    Timeline
                  </h4>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-primary">When did this occur? *</label>
                      <input
                        type="datetime-local"
                        value={incident.occurredAt}
                        onChange={(e) => setIncident({ ...incident, occurredAt: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-primary">When was this detected? *</label>
                      <input
                        type="datetime-local"
                        value={incident.detectedAt}
                        onChange={(e) => setIncident({ ...incident, detectedAt: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-secondary" />

                {/* Related Audit Events */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                    <Link21 size={16} color="currentColor" />
                    Related Audit Events
                  </h4>
                  <p className="text-xs text-tertiary">Link events from audit trail (optional):</p>
                  
                  <div className="flex flex-col gap-2 rounded-lg border border-secondary p-3 bg-secondary_subtle">
                    {availableEvents.map((event) => (
                      <label key={event.id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={incident.linkedEvents.includes(event.id)}
                          onChange={() => toggleEvent(event.id)}
                          className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm text-secondary font-mono">
                          {event.id} - {event.type}: {event.description} at {event.timestamp}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-secondary" />

                {/* Regulatory Reporting */}
                <div className={`flex items-start gap-3 p-4 rounded-lg border ${
                  incident.severity === "critical" ? "border-error-200 bg-error-50" : "border-secondary"
                }`}>
                  <input
                    type="checkbox"
                    checked={incident.reportToRegulator}
                    onChange={(e) => setIncident({ ...incident, reportToRegulator: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-primary">Report to regulatory authority</span>
                    {incident.severity === "critical" && (
                      <p className="text-xs text-error-600 mt-1">Required for Critical severity incidents</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-secondary px-6 py-4 flex justify-end gap-3">
                <Button color="secondary" size="lg" onClick={handleClose}>
                  Cancel
                </Button>
                <Button 
                  size="lg" 
                  onClick={handleSubmit}
                  isDisabled={!canSubmit}
                  iconLeading={({ className }) => <Warning2 size={18} color="currentColor" className={className} />}
                >
                  Report Incident
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};

export default ReportIncidentModal;
