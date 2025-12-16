"use client";

import { Warning2 } from "iconsax-react";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import { useCaseCategories, decisionTypes, impactLevels, type FormData } from "../data/form-options";
import { cx } from "@/utils/cx";

interface UseCaseStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const UseCaseStep = ({ formData, updateFormData }: UseCaseStepProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-primary">Use Case Classification</h2>
        <p className="mt-1 text-sm text-tertiary">
          Help us understand how this AI system is used.
        </p>
      </div>

      <Select
        label="Primary Use Case"
        placeholder="Select use case category"
        selectedKey={formData.useCase}
        onSelectionChange={(key) => key && updateFormData({ useCase: key as string })}
        items={useCaseCategories}
      >
        {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
      </Select>

      {["hiring", "healthcare", "finance"].includes(formData.useCase) && (
        <div className="rounded-lg border border-warning-200 bg-warning-50 p-4">
          <div className="flex gap-3">
            <Warning2 size={20} className="shrink-0 text-warning-600" color="currentColor" />
            <div>
              <p className="text-sm font-medium text-warning-800">High-Risk Category</p>
              <p className="mt-1 text-sm text-warning-700">
                This use case is classified as high-risk under the EU AI Act and requires full compliance.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-primary">
          Does this AI make or assist decisions about people?
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => updateFormData({ makesDecisions: true })}
            className={cx(
              "flex-1 rounded-lg border p-4 text-left transition",
              formData.makesDecisions
                ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600"
                : "border-secondary hover:border-brand-300"
            )}
          >
            <span className="text-sm font-medium text-primary">Yes</span>
          </button>
          <button
            type="button"
            onClick={() => updateFormData({ makesDecisions: false })}
            className={cx(
              "flex-1 rounded-lg border p-4 text-left transition",
              !formData.makesDecisions
                ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600"
                : "border-secondary hover:border-brand-300"
            )}
          >
            <span className="text-sm font-medium text-primary">No</span>
          </button>
        </div>
      </div>

      {formData.makesDecisions && (
        <>
          <Select
            label="Decision Automation Level"
            placeholder="Select automation level"
            selectedKey={formData.decisionType}
            onSelectionChange={(key) => key && updateFormData({ decisionType: key as string })}
            items={decisionTypes}
          >
            {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
          </Select>

          <Select
            label="Impact Level of Decisions"
            placeholder="Select impact level"
            selectedKey={formData.impactLevel}
            onSelectionChange={(key) => key && updateFormData({ impactLevel: key as string })}
            items={impactLevels}
          >
            {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
          </Select>
        </>
      )}
    </div>
  );
};

export default UseCaseStep;
