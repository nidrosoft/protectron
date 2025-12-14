"use client";

import { Checkbox } from "@/components/base/checkbox/checkbox";
import { useCaseOptions, type AssessmentData } from "../data/assessment-options";
import { cx } from "@/utils/cx";

interface UseCasesStepProps {
  data: AssessmentData;
  toggleArrayItem: (field: keyof AssessmentData, item: string) => void;
}

export const UseCasesStep = ({ data, toggleArrayItem }: UseCasesStepProps) => {
  return (
    <div className="space-y-6">
      {/* Context Box */}
      <div className="rounded-xl border border-warning-200 bg-warning-50 p-4">
        <p className="text-sm font-medium text-warning-700">Important: High-Risk Use Cases</p>
        <p className="mt-1 text-sm text-warning-600">
          The EU AI Act defines specific "high-risk" use cases that require strict compliance measures, including conformity assessments, documentation, and human oversight. Use cases marked with a red badge are considered high-risk under the regulation.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-md font-semibold text-primary">How is AI used in your organization? Select all that apply:</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {useCaseOptions.map((useCase) => (
          <label
            key={useCase.id}
            className={cx(
              "flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors",
              data.useCases.includes(useCase.id)
                ? "border-brand-500 bg-brand-50"
                : "border-secondary hover:bg-secondary"
            )}
          >
            <Checkbox
              isSelected={data.useCases.includes(useCase.id)}
              onChange={() => toggleArrayItem("useCases", useCase.id)}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-primary">{useCase.label}</p>
                {useCase.risk === "high" && (
                  <span className="rounded-full bg-error-100 px-2 py-0.5 text-xs font-medium text-error-700">
                    High Risk
                  </span>
                )}
                {useCase.risk === "limited" && (
                  <span className="rounded-full bg-warning-100 px-2 py-0.5 text-xs font-medium text-warning-700">
                    Limited Risk
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-tertiary">{useCase.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default UseCasesStep;
