"use client";

import { Add, Clock, Warning2, Data, DocumentText, InfoCircle, Timer1 } from "iconsax-react";
import { Upload01, Check, ClipboardCheck, File01, Lightbulb01, ArrowRight } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { ProgressBarBase } from "@/components/base/progress-indicators/progress-indicators";
import { Table, TableCard, TableRowActionsDropdown } from "@/components/application/table/table";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { cx } from "@/utils/cx";
import { articleDescriptions, getRequirementGuidance, getArticleInfo } from "../data/article-guidance";

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
      {getFilteredRequirements().map((section) => {
        const articleInfo = getArticleInfo(section.id);
        
        return (
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
            
            {/* Article Explanation Box */}
            {articleInfo && (
              <div className="mx-4 mb-4 rounded-lg bg-brand-50 border border-brand-200 p-4">
                <div className="flex gap-3">
                  <div className="shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100">
                      <Lightbulb01 className="h-4 w-4 text-brand-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-brand-900">{articleInfo.summary}</h4>
                    <p className="mt-1 text-sm text-brand-700">{articleInfo.whatItMeans}</p>
                  </div>
                </div>
              </div>
            )}

            <Table aria-label={section.title} selectionMode="none">
              <Table.Header>
                <Table.Head id="requirement" isRowHeader label="Requirement" className="w-[45%]" />
                <Table.Head id="status" label="Status" className="w-[15%]" />
                <Table.Head id="evidence" label="Evidence/Document" className="w-[20%]" />
                <Table.Head id="actions" className="w-[20%]" />
              </Table.Header>
              <Table.Body items={section.items}>
                {(item) => {
                  const guidance = getRequirementGuidance(section.id, item.title);
                  
                  return (
                    <Table.Row id={item.id}>
                      <Table.Cell>
                        <div className="flex flex-col gap-2 py-2">
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
                              "text-sm font-medium",
                              item.status === "complete" ? "text-tertiary" : "text-primary"
                            )}>
                              {item.title}
                            </span>
                          </div>
                          
                          {/* Show guidance for non-complete items */}
                          {item.status !== "complete" && guidance && (
                            <div className="ml-9 space-y-2">
                              <p className="text-xs text-tertiary">{guidance.description}</p>
                              <div className="flex items-start gap-2 p-2 rounded bg-warning-50 border border-warning-100">
                                <ArrowRight className="h-3.5 w-3.5 text-warning-600 mt-0.5 shrink-0" />
                                <p className="text-xs text-warning-700 font-medium">{guidance.whatToDo}</p>
                              </div>
                              {guidance.estimatedTime && (
                                <div className="flex items-center gap-1.5 text-xs text-tertiary">
                                  <Timer1 size={12} color="currentColor" />
                                  <span>Estimated time: {guidance.estimatedTime}</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Show success message for complete items */}
                          {item.status === "complete" && (
                            <div className="ml-9">
                              <p className="text-xs text-success-600 flex items-center gap-1">
                                <Check className="h-3 w-3" />
                                Requirement satisfied - no action needed
                              </p>
                            </div>
                          )}
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
                        {!item.evidence && !item.document && item.status !== "complete" && guidance?.documentType && (
                          <span className="text-xs text-tertiary italic">
                            Needs: {guidance.documentType}
                          </span>
                        )}
                        {!item.evidence && !item.document && !guidance?.documentType && (
                          <span className="text-sm text-tertiary">—</span>
                        )}
                      </Table.Cell>
                      <Table.Cell className="px-4">
                        {item.status !== "complete" && (
                          <div className="flex flex-col gap-2">
                            <Button 
                              size="sm" 
                              color="primary" 
                              onClick={onGenerateDocument}
                              iconLeading={({ className }) => <File01 className={cx("h-4 w-4", className)} />}
                            >
                              Generate Doc
                            </Button>
                            <Button 
                              size="sm" 
                              color="secondary" 
                              onClick={onUploadEvidence}
                              iconLeading={({ className }) => <Upload01 className={cx("h-4 w-4", className)} />}
                            >
                              Upload Evidence
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
                  );
                }}
              </Table.Body>
            </Table>
          </TableCard.Root>
        );
      })}
    </div>
  );
};

export default RequirementsTab;
