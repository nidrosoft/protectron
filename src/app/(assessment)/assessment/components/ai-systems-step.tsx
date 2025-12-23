"use client";

import { Checkbox } from "@/components/base/checkbox/checkbox";
import { aiSystemTypes, type AssessmentData } from "../data/assessment-options";
import { cx } from "@/utils/cx";

interface AISystemsStepProps {
  data: AssessmentData;
  toggleArrayItem: (field: keyof AssessmentData, item: string) => void;
}

export const AISystemsStep = ({ data, toggleArrayItem }: AISystemsStepProps) => {
  return (
    <div className="space-y-6">
      {/* Context Box */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
        <p className="text-sm font-medium text-brand-700">Understanding AI Systems</p>
        <p className="mt-1 text-sm text-brand-600">
          The EU AI Act categorizes AI systems based on their risk level. Different types of AI technologies may have different compliance requirements. Select all AI technologies your organization currently uses, plans to use, or is developing.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-md font-semibold text-primary">Select all types of AI systems your organization uses or develops:</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {aiSystemTypes.map((system) => (
          <label
            key={system.id}
            className={cx(
              "flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors",
              data.aiSystemTypes.includes(system.id)
                ? "border-brand-500 bg-brand-50"
                : "border-secondary bg-primary hover:bg-secondary"
            )}
          >
            <Checkbox
              isSelected={data.aiSystemTypes.includes(system.id)}
              onChange={() => toggleArrayItem("aiSystemTypes", system.id)}
            />
            <div>
              <p className={cx(
                "font-semibold",
                data.aiSystemTypes.includes(system.id) ? "text-gray-900" : "text-primary"
              )}>{system.label}</p>
              <p className={cx(
                "mt-1 text-sm",
                data.aiSystemTypes.includes(system.id) ? "text-gray-600" : "text-tertiary"
              )}>{system.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default AISystemsStep;
