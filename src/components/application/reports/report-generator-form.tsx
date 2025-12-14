"use client";

import { useState } from "react";
import type { Key } from "react-aria-components";
import { Chart, Cpu } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Select, type SelectItemType } from "@/components/base/select/select";
import { ReportTypeCard, type ReportType } from "./report-type-card";

interface ReportGeneratorFormProps {
  onGenerate: (config: ReportConfig) => void;
  isGenerating?: boolean;
}

export interface ReportConfig {
  type: ReportType;
  scope: "all" | "specific";
  selectedSystems: string[];
  includeOptions: {
    riskClassifications: boolean;
    requirementsStatus: boolean;
    documentInventory: boolean;
    evidenceSummary: boolean;
    auditTrail: boolean;
  };
}

const systemOptions: SelectItemType[] = [
  { id: "system-01", label: "Customer Support Chatbot" },
  { id: "system-02", label: "Automated Hiring Screener" },
  { id: "system-03", label: "Fraud Detection System" },
];

export const ReportGeneratorForm = ({
  onGenerate,
  isGenerating = false,
}: ReportGeneratorFormProps) => {
  const [reportType, setReportType] = useState<ReportType>("full");
  const [scope, setScope] = useState<"all" | "specific">("all");
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [includeOptions, setIncludeOptions] = useState({
    riskClassifications: true,
    requirementsStatus: true,
    documentInventory: true,
    evidenceSummary: true,
    auditTrail: true,
  });

  const handleIncludeChange = (key: keyof typeof includeOptions) => {
    setIncludeOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleGenerate = () => {
    onGenerate({
      type: reportType,
      scope,
      selectedSystems,
      includeOptions,
    });
  };

  return (
    <div className="rounded-xl border border-secondary bg-primary p-6">
      <h2 className="text-lg font-semibold text-primary">Generate Compliance Report</h2>
      <p className="mt-1 text-sm text-tertiary">
        Create a comprehensive compliance report for your AI systems.
      </p>

      {/* Report Type Selection */}
      <div className="mt-6">
        <label className="text-sm font-medium text-secondary">Report Type</label>
        <div className="mt-2 flex gap-4">
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
      <div className="mt-6">
        <label className="text-sm font-medium text-secondary">Scope</label>
        <div className="mt-2 flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="scope"
              checked={scope === "all"}
              onChange={() => setScope("all")}
              className="size-4 accent-brand-500"
            />
            <span className="text-sm text-primary">All AI Systems</span>
          </label>
          <div className="flex items-start gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="scope"
                checked={scope === "specific"}
                onChange={() => setScope("specific")}
                className="size-4 accent-brand-500"
              />
              <span className="text-sm text-primary">Specific Systems</span>
            </label>
            {scope === "specific" && (
              <div className="flex-1 max-w-xs">
                <Select
                  size="sm"
                  placeholder="Select systems..."
                  selectedKey={selectedSystems[0] || null}
                  onSelectionChange={(key: Key | null) => {
                    if (key) {
                      setSelectedSystems([String(key)]);
                    }
                  }}
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
        </div>
      </div>

      {/* Include Options */}
      <div className="mt-6">
        <label className="text-sm font-medium text-secondary">Include in Report</label>
        <div className="mt-2 flex flex-col gap-2">
          <Checkbox
            isSelected={includeOptions.riskClassifications}
            onChange={() => handleIncludeChange("riskClassifications")}
          >
            Risk classifications
          </Checkbox>
          <Checkbox
            isSelected={includeOptions.requirementsStatus}
            onChange={() => handleIncludeChange("requirementsStatus")}
          >
            Requirements status
          </Checkbox>
          <Checkbox
            isSelected={includeOptions.documentInventory}
            onChange={() => handleIncludeChange("documentInventory")}
          >
            Document inventory
          </Checkbox>
          <Checkbox
            isSelected={includeOptions.evidenceSummary}
            onChange={() => handleIncludeChange("evidenceSummary")}
          >
            Evidence summary
          </Checkbox>
          <Checkbox
            isSelected={includeOptions.auditTrail}
            onChange={() => handleIncludeChange("auditTrail")}
          >
            Audit trail
          </Checkbox>
        </div>
      </div>

      {/* Generate Button */}
      <div className="mt-6 flex justify-end">
        <Button
          size="md"
          color="primary"
          onClick={handleGenerate}
          isDisabled={isGenerating}
          iconLeading={({ className }) => <Chart size={18} color="currentColor" className={className} />}
        >
          {isGenerating ? "Generating..." : "Generate Report"}
        </Button>
      </div>
    </div>
  );
};

export default ReportGeneratorForm;
