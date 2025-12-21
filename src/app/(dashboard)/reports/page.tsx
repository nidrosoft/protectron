"use client";

import { useState, useMemo } from "react";
import type { Key } from "react-aria-components";
import {
  Chart,
  DocumentText1,
  DocumentDownload,
  Share,
  Eye,
  Cpu,
  TickCircle,
  Clock,
  CloseCircle,
} from "iconsax-react";
import { FileIcon } from "@untitledui/file-icons";
import { Button } from "@/components/base/buttons/button";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Select, type SelectItemType } from "@/components/base/select/select";
import { useToast } from "@/components/base/toast/toast";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { Table, TableCard } from "@/components/application/table/table";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { ReportTypeCard, type ReportType } from "@/components/application/reports";
import { useAISystems, useReports } from "@/hooks";
import type { Report } from "@/hooks/use-reports";

const statusConfig = {
  ready: { label: "Ready", color: "success" as const, icon: TickCircle },
  generating: { label: "Generating", color: "warning" as const, icon: Clock },
  failed: { label: "Failed", color: "error" as const, icon: CloseCircle },
};

export default function ReportsPage() {
  // Fetch real reports data
  const { reports, isLoading, generateReport, isGenerating } = useReports();
  
  // Fetch real AI systems for the dropdown
  const { systems: aiSystems } = useAISystems();
  
  // Build system options from real data
  const systemOptions: SelectItemType[] = useMemo(() => 
    aiSystems.map(s => ({ id: s.id, label: s.name })),
  [aiSystems]);
  
  // Form state
  const [reportType, setReportType] = useState<ReportType>("full");
  const [scope, setScope] = useState<"all" | "specific">("all");
  const [selectedSystem, setSelectedSystem] = useState<string>("");
  const [includeOptions, setIncludeOptions] = useState({
    riskClassifications: true,
    requirementsStatus: true,
    documentInventory: true,
    evidenceSummary: true,
    auditTrail: true,
  });

  const { addToast } = useToast();

  const handleIncludeChange = (key: keyof typeof includeOptions) => {
    setIncludeOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerate = async () => {
    await generateReport({
      reportType,
      scope,
      selectedSystemId: selectedSystem,
      includeOptions,
    });
  };

  const isEmpty = reports.length === 0;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-secondary bg-primary px-6 py-5 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-display-sm font-semibold text-primary">Reports</h1>
            <p className="mt-1 text-sm text-tertiary">
              Generate and manage compliance reports for your AI systems.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-secondary bg-secondary_subtle px-3 py-2">
              <Chart size={18} color="currentColor" className="text-brand-500" />
              <span className="text-sm font-medium text-primary">{reports.length} Reports Generated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
        {/* Report Generator Section */}
        <div className="rounded-xl border border-secondary bg-primary shadow-sm">
          {/* Section Header */}
          <div className="border-b border-secondary px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50">
                <Chart size={20} color="currentColor" variant="Bold" className="text-brand-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">Generate Compliance Report</h2>
                <p className="text-sm text-tertiary">Create a comprehensive compliance report for regulators or stakeholders.</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Report Type & Scope */}
              <div className="space-y-6">
                {/* Report Type Selection */}
                <div>
                  <label className="text-sm font-medium text-secondary">Report Type</label>
                  <div className="mt-3 flex gap-4">
                    <ReportTypeCard
                      type="full"
                      isSelected={reportType === "full"}
                      onSelect={() => setReportType("full")}
                    />
                    <ReportTypeCard
                      type="executive"
                      isSelected={reportType === "executive"}
                      onSelect={() => setReportType("executive")}
                    />
                  </div>
                </div>

                {/* Scope Selection */}
                <div>
                  <label className="text-sm font-medium text-secondary">Scope</label>
                  <div className="mt-3 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-secondary p-3 hover:bg-secondary_hover transition-colors">
                      <input
                        type="radio"
                        name="scope"
                        checked={scope === "all"}
                        onChange={() => setScope("all")}
                        className="size-4 accent-brand-500"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-primary">All AI Systems</span>
                        <p className="text-xs text-tertiary">Include all 3 registered AI systems in the report</p>
                      </div>
                      <Cpu size={20} color="currentColor" className="text-tertiary" />
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-secondary p-3 hover:bg-secondary_hover transition-colors">
                      <input
                        type="radio"
                        name="scope"
                        checked={scope === "specific"}
                        onChange={() => setScope("specific")}
                        className="mt-1 size-4 accent-brand-500"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-primary">Specific Systems</span>
                        <p className="text-xs text-tertiary mb-2">Select which systems to include</p>
                        {scope === "specific" && (
                          <div className="w-full">
                            <Select
                              size="sm"
                              placeholder="Select system..."
                              selectedKey={selectedSystem || null}
                              onSelectionChange={(key: Key | null) => key && setSelectedSystem(String(key))}
                              items={systemOptions}
                            >
                              {(item) => (
                                <Select.Item key={item.id} id={item.id} textValue={item.label}>
                                  {item.label}
                                </Select.Item>
                              )}
                            </Select>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column - Include Options */}
              <div>
                <label className="text-sm font-medium text-secondary">Include in Report</label>
                <div className="mt-3 rounded-lg border border-secondary overflow-hidden">
                  <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary_hover transition-colors">
                    <Checkbox
                      isSelected={includeOptions.riskClassifications}
                      onChange={() => handleIncludeChange("riskClassifications")}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-primary">Risk Classifications</span>
                      <p className="text-xs text-tertiary">AI Act risk levels for each system</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary_hover transition-colors border-t border-secondary">
                    <Checkbox
                      isSelected={includeOptions.requirementsStatus}
                      onChange={() => handleIncludeChange("requirementsStatus")}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-primary">Requirements Status</span>
                      <p className="text-xs text-tertiary">Compliance progress for each requirement</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary_hover transition-colors border-t border-secondary">
                    <Checkbox
                      isSelected={includeOptions.documentInventory}
                      onChange={() => handleIncludeChange("documentInventory")}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-primary">Document Inventory</span>
                      <p className="text-xs text-tertiary">List of all generated documents</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary_hover transition-colors border-t border-secondary">
                    <Checkbox
                      isSelected={includeOptions.evidenceSummary}
                      onChange={() => handleIncludeChange("evidenceSummary")}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-primary">Evidence Summary</span>
                      <p className="text-xs text-tertiary">Overview of uploaded evidence files</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-secondary_hover transition-colors border-t border-secondary">
                    <Checkbox
                      isSelected={includeOptions.auditTrail}
                      onChange={() => handleIncludeChange("auditTrail")}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-primary">Audit Trail</span>
                      <p className="text-xs text-tertiary">Timeline of compliance activities</p>
                    </div>
                  </label>
                </div>

                {/* Generate Button */}
                <div className="mt-6">
                  <Button
                    size="lg"
                    color="primary"
                    className="w-full"
                    onClick={handleGenerate}
                    isDisabled={isGenerating}
                    iconLeading={({ className }) => <Chart size={20} color="currentColor" className={className} />}
                  >
                    {isGenerating ? "Generating Report..." : "Generate Report"}
                  </Button>
                  <p className="mt-2 text-center text-xs text-tertiary">
                    Report generation typically takes 30-60 seconds
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Reports Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-primary">Previous Reports</h2>
              <p className="text-sm text-tertiary">View and download your previously generated reports.</p>
            </div>
          </div>

          {/* Reports Table */}
          {!isEmpty && (
            <TableCard.Root>
              <Table aria-label="Reports" selectionMode="none">
                <Table.Header>
                  <Table.Head id="name" isRowHeader label="Report" />
                  <Table.Head id="type" label="Type" />
                  <Table.Head id="systems" label="Systems" />
                  <Table.Head id="status" label="Status" />
                  <Table.Head id="date" label="Generated" />
                  <Table.Head id="actions" label="" />
                </Table.Header>
                <Table.Body items={reports}>
                  {(report: Report) => (
                    <Table.Row id={report.id} className="odd:bg-secondary_subtle">
                      <Table.Cell>
                        <div className="flex items-center gap-3">
                          <FileIcon type="pdf" theme="light" className="size-10 dark:hidden" />
                          <FileIcon type="pdf" theme="dark" className="size-10 not-dark:hidden" />
                          <div>
                            <p className="text-sm font-medium text-primary">{report.name}</p>
                            <p className="text-sm text-tertiary">{report.fileSize}</p>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge size="sm" color={report.type === "full" ? "brand" : "purple"}>
                          {report.type === "full" ? "Full Report" : "Executive"}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-1.5">
                          <Cpu size={14} color="currentColor" className="text-tertiary" />
                          <span className="text-sm text-secondary">{report.systemsIncluded} systems</span>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <BadgeWithDot size="sm" color={statusConfig[report.status].color}>
                          {statusConfig[report.status].label}
                        </BadgeWithDot>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-sm text-tertiary whitespace-nowrap">{report.generatedAt}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            color="tertiary"
                            iconLeading={({ className }) => <Eye size={16} color="currentColor" className={className} />}
                            onClick={() => window.open(`/api/v1/reports/${report.id}/pdf`, "_blank")}
                            isDisabled={report.status !== "ready"}
                          >
                            View
                          </Button>
                          <Dropdown.Root>
                            <Button
                              size="sm"
                              color="tertiary"
                              iconLeading={({ className }) => <DocumentDownload size={16} color="currentColor" className={className} />}
                              isDisabled={report.status !== "ready"}
                            >
                              Download
                            </Button>
                            <Dropdown.Popover>
                              <Dropdown.Menu>
                                <Dropdown.Item 
                                  label="Download as PDF" 
                                  onAction={() => {
                                    const link = document.createElement("a");
                                    link.href = `/api/v1/reports/${report.id}/pdf`;
                                    link.download = `${report.name}.pdf`;
                                    link.click();
                                  }} 
                                />
                                <Dropdown.Item 
                                  label="Download as DOCX" 
                                  onAction={() => {
                                    const link = document.createElement("a");
                                    link.href = `/api/v1/reports/${report.id}/download`;
                                    link.download = `${report.name}.docx`;
                                    link.click();
                                  }} 
                                />
                              </Dropdown.Menu>
                            </Dropdown.Popover>
                          </Dropdown.Root>
                          <Button
                            size="sm"
                            color="tertiary"
                            iconLeading={({ className }) => <Share size={16} color="currentColor" className={className} />}
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/api/v1/reports/${report.id}/pdf`);
                              addToast({ type: "success", title: "Link copied", message: "Download link copied to clipboard!" });
                            }}
                            isDisabled={report.status !== "ready"}
                          >
                            Share
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </TableCard.Root>
          )}

          {/* Empty State */}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-secondary">
              <FeaturedIcon color="gray" size="xl" theme="light">
                <DocumentText1 size={28} color="currentColor" />
              </FeaturedIcon>
              <h3 className="mt-4 text-lg font-semibold text-primary">No Reports Yet</h3>
              <p className="mt-2 max-w-sm text-center text-sm text-tertiary">
                Generate your first compliance report using the form above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
