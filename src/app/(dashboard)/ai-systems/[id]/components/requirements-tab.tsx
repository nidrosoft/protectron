"use client";

import { Add, Clock, Warning2, Data } from "iconsax-react";
import { Upload01, Check, ClipboardCheck } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { ProgressBarBase } from "@/components/base/progress-indicators/progress-indicators";
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { cx } from "@/utils/cx";

interface RequirementItem {
  id: string;
  title: string;
  status: "complete" | "in_progress" | "not_started";
  evidence?: string;
  document?: string;
}

interface RequirementSection {
  id: string;
  title: string;
  article: string;
  items: RequirementItem[];
}

interface RequirementsTabProps {
  system: {
    progress: number;
    riskLevel: "high" | "limited" | "minimal";
    requirements: {
      completed: number;
      total: number;
      sections: RequirementSection[];
    };
  };
  requirementFilter: "all" | "pending" | "complete";
  onFilterChange: (filter: "all" | "pending" | "complete") => void;
  onUploadEvidence: () => void;
  onGenerateDocument: () => void;
  onOpenFRIA?: () => void;
  onOpenDataGovernance?: () => void;
}

const reqStatusConfig = {
  complete: { label: "Complete", color: "success" as const, icon: Check },
  in_progress: { label: "In Progress", color: "warning" as const, icon: Clock },
  not_started: { label: "Not Started", color: "gray" as const, icon: Clock },
};

export const RequirementsTab = ({
  system,
  requirementFilter,
  onFilterChange,
  onUploadEvidence,
  onGenerateDocument,
  onOpenFRIA,
  onOpenDataGovernance,
}: RequirementsTabProps) => {
  const getFilteredRequirements = () => {
    return system.requirements.sections.map(section => ({
      ...section,
      items: section.items.filter(item => {
        if (requirementFilter === "all") return true;
        if (requirementFilter === "complete") return item.status === "complete";
        if (requirementFilter === "pending") return item.status !== "complete";
        return true;
      }),
    })).filter(section => section.items.length > 0);
  };

  // Show empty state when no requirements
  if (system.requirements.total === 0) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <EmptyState size="md">
          <EmptyState.Header pattern="grid">
            <EmptyState.FeaturedIcon icon={ClipboardCheck} color="gray" theme="modern" />
          </EmptyState.Header>
          <EmptyState.Content>
            <EmptyState.Title>No requirements assigned</EmptyState.Title>
            <EmptyState.Description>
              Requirements will be automatically assigned based on your AI system&apos;s risk level and type.
            </EmptyState.Description>
          </EmptyState.Content>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Compliance Tools */}
      <div className="rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary ring-inset">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-primary">Compliance Tools</h3>
            <p className="text-xs text-tertiary mt-0.5">Generate required assessments and documentation</p>
          </div>
          <div className="flex gap-2">
            {onOpenFRIA && (
              <Button
                size="sm"
                color="secondary"
                iconLeading={({ className }) => <Warning2 size={16} color="currentColor" className={className} />}
                onClick={onOpenFRIA}
              >
                FRIA Assessment
              </Button>
            )}
            {onOpenDataGovernance && (
              <Button
                size="sm"
                color="secondary"
                iconLeading={({ className }) => <Data size={16} color="currentColor" className={className} />}
                onClick={onOpenDataGovernance}
              >
                Data Governance
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Progress Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(["all", "pending", "complete"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={cx(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                requirementFilter === filter
                  ? "bg-brand-50 text-brand-700"
                  : "text-tertiary hover:bg-secondary"
              )}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-tertiary">Progress:</span>
          <div className="flex items-center gap-2">
            <ProgressBarBase value={system.progress} className="w-24" />
            <span className="text-sm font-medium text-primary">
              {system.requirements.completed}/{system.requirements.total}
            </span>
          </div>
        </div>
      </div>

      {/* Requirements Sections as Tables */}
      {getFilteredRequirements().map((section) => (
        <TableCard.Root key={section.id}>
          <TableCard.Header
            title={section.title}
            description={section.article}
            contentTrailing={
              <div className="absolute top-5 right-4 md:right-6">
                <Badge color="gray" size="md">
                  {section.items.filter(i => i.status === "complete").length}/{section.items.length} Complete
                </Badge>
              </div>
            }
          />
          <Table aria-label={section.title} selectionMode="none">
            <Table.Header>
              <Table.Head id="requirement" isRowHeader label="Requirement" />
              <Table.Head id="status" label="Status" />
              <Table.Head id="evidence" label="Evidence/Document" />
              <Table.Head id="actions" />
            </Table.Header>
            <Table.Body items={section.items}>
              {(item) => (
                <Table.Row id={item.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <div className={cx(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded",
                        item.status === "complete" ? "bg-success-100" : "bg-gray-100"
                      )}>
                        {item.status === "complete" ? (
                          <Check className="h-3.5 w-3.5 text-success-600" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-gray-300" />
                        )}
                      </div>
                      <span className={cx(
                        "text-sm font-medium whitespace-nowrap",
                        item.status === "complete" ? "text-tertiary" : "text-primary"
                      )}>
                        {item.title}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <BadgeWithDot size="sm" color={reqStatusConfig[item.status].color}>
                      {reqStatusConfig[item.status].label}
                    </BadgeWithDot>
                  </Table.Cell>
                  <Table.Cell>
                    {item.evidence && (
                      <span className="text-sm text-secondary whitespace-nowrap">{item.evidence}</span>
                    )}
                    {item.document && (
                      <span className="text-sm text-secondary whitespace-nowrap">{item.document}</span>
                    )}
                    {!item.evidence && !item.document && (
                      <span className="text-sm text-tertiary">—</span>
                    )}
                  </Table.Cell>
                  <Table.Cell className="px-4">
                    {item.status !== "complete" && (
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" color="secondary" onClick={onUploadEvidence}>
                          <Upload01 className="h-4 w-4" />
                        </Button>
                        <Button size="sm" color="secondary" onClick={onGenerateDocument}>
                          <Add size={16} color="currentColor" />
                        </Button>
                      </div>
                    )}
                    {item.status === "complete" && (
                      <div className="flex items-center justify-end">
                        <TableRowActionsDropdown />
                      </div>
                    )}
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </TableCard.Root>
      ))}
    </div>
  );
};

export default RequirementsTab;
