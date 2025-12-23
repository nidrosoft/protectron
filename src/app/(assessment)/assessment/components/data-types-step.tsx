"use client";

import { Checkbox } from "@/components/base/checkbox/checkbox";
import { dataTypeOptions, type AssessmentData } from "../data/assessment-options";
import { cx } from "@/utils/cx";

interface DataTypesStepProps {
  data: AssessmentData;
  toggleArrayItem: (field: keyof AssessmentData, item: string) => void;
}

export const DataTypesStep = ({ data, toggleArrayItem }: DataTypesStepProps) => {
  return (
    <div className="space-y-6">
      {/* Context Box */}
      <div className="rounded-xl border border-error-200 bg-error-50 p-4">
        <p className="text-sm font-medium text-error-700">Sensitive Data Categories</p>
        <p className="mt-1 text-sm text-error-600">
          Processing certain types of data significantly increases your compliance obligations under both the EU AI Act and GDPR. Data marked as "Sensitive" requires additional safeguards, documentation, and may trigger higher risk classifications for your AI systems.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-md font-semibold text-primary">What types of data do your AI systems process? Select all that apply:</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {dataTypeOptions.map((dataType) => (
          <label
            key={dataType.id}
            className={cx(
              "flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors",
              data.dataTypes.includes(dataType.id)
                ? "border-brand-500 bg-brand-50"
                : "border-secondary bg-primary hover:bg-secondary"
            )}
          >
            <Checkbox
              isSelected={data.dataTypes.includes(dataType.id)}
              onChange={() => toggleArrayItem("dataTypes", dataType.id)}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className={cx(
                  "font-semibold",
                  data.dataTypes.includes(dataType.id) ? "text-gray-900" : "text-primary"
                )}>{dataType.label}</p>
                {dataType.risk === "high" && (
                  <span className="rounded-full bg-error-100 px-2 py-0.5 text-xs font-medium text-error-700">
                    Sensitive
                  </span>
                )}
              </div>
              <p className={cx(
                "mt-1 text-sm",
                data.dataTypes.includes(dataType.id) ? "text-gray-600" : "text-tertiary"
              )}>{dataType.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default DataTypesStep;
