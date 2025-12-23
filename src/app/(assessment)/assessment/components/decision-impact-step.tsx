"use client";

import { Checkbox } from "@/components/base/checkbox/checkbox";
import { decisionImpactOptions, automationLevelOptions, type AssessmentData } from "../data/assessment-options";
import { cx } from "@/utils/cx";

interface DecisionImpactStepProps {
  data: AssessmentData;
  updateData: (field: keyof AssessmentData, value: unknown) => void;
}

export const DecisionImpactStep = ({ data, updateData }: DecisionImpactStepProps) => {
  return (
    <div className="space-y-8">
      {/* Context Box */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
        <p className="text-sm font-medium text-brand-700">Final Step: Assessing Risk Level</p>
        <p className="mt-1 text-sm text-brand-600">
          The impact of AI decisions on individuals and the level of human oversight are critical factors in determining your compliance requirements. High-impact decisions with limited human oversight typically require the most stringent compliance measures under the EU AI Act.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-md font-semibold text-primary">How do AI-generated outputs affect people?</p>
        <p className="text-sm text-tertiary">
          Consider the real-world consequences of decisions made or influenced by your AI systems on individuals' lives, rights, and opportunities.
        </p>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {decisionImpactOptions.map((option) => (
            <label
              key={option.value}
              className={cx(
                "flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors",
                data.decisionImpact === option.value
                  ? "border-brand-500 bg-brand-50"
                  : "border-secondary bg-primary hover:bg-secondary"
              )}
            >
              <Checkbox
                isSelected={data.decisionImpact === option.value}
                onChange={() => updateData("decisionImpact", option.value)}
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={cx(
                    "font-semibold",
                    data.decisionImpact === option.value ? "text-gray-900" : "text-primary"
                  )}>{option.label}</p>
                  {option.badge && (
                    <span className="rounded-full bg-error-100 px-2 py-0.5 text-xs font-medium text-error-700">
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className={cx(
                  "mt-1 text-sm",
                  data.decisionImpact === option.value ? "text-gray-600" : "text-tertiary"
                )}>{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-md font-semibold text-primary">What level of human oversight exists?</p>
        <p className="text-sm text-tertiary">
          Human oversight is a key requirement under the EU AI Act. Higher levels of automation with less human review typically require more compliance measures.
        </p>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {automationLevelOptions.map((option) => (
            <label
              key={option.value}
              className={cx(
                "flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors",
                data.automationLevel === option.value
                  ? "border-brand-500 bg-brand-50"
                  : "border-secondary bg-primary hover:bg-secondary"
              )}
            >
              <Checkbox
                isSelected={data.automationLevel === option.value}
                onChange={() => updateData("automationLevel", option.value)}
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={cx(
                    "font-semibold",
                    data.automationLevel === option.value ? "text-gray-900" : "text-primary"
                  )}>{option.label}</p>
                  {option.badge && (
                    <span className="rounded-full bg-error-100 px-2 py-0.5 text-xs font-medium text-error-700">
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className={cx(
                  "mt-1 text-sm",
                  data.automationLevel === option.value ? "text-gray-600" : "text-tertiary"
                )}>{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DecisionImpactStep;
