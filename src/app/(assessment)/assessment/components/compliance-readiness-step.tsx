"use client";

import { Checkbox } from "@/components/base/checkbox/checkbox";
import { type AssessmentData, existingComplianceOptions } from "../data/assessment-options";
import { cx } from "@/utils/cx";

interface ComplianceReadinessStepProps {
  data: AssessmentData;
  updateData: (field: keyof AssessmentData, value: unknown) => void;
  toggleArrayItem: (field: keyof AssessmentData, item: string) => void;
}

export const ComplianceReadinessStep = ({ data, updateData, toggleArrayItem }: ComplianceReadinessStepProps) => {
  return (
    <div className="space-y-6">
      {/* Context Box */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
        <p className="text-sm font-medium text-brand-700">Why does this matter?</p>
        <p className="mt-1 text-sm text-brand-600">
          The EU AI Act requires a Quality Management System (Article 17), incident response capabilities (Article 62), and post-market monitoring (Article 61). Understanding your existing compliance posture helps us identify gaps and prioritize your compliance roadmap.
        </p>
      </div>

      {/* Existing compliance checkboxes */}
      <div className="space-y-3">
        <p className="text-md font-semibold text-primary">Do you have any existing compliance frameworks?</p>
        <p className="text-sm text-tertiary">Select all that apply to your organization.</p>
      </div>

      <div className="space-y-3">
        {existingComplianceOptions.map((option) => {
          const isSelected = data.existingCompliance.includes(option.id);
          return (
            <label
              key={option.id}
              className={cx(
                "flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors",
                isSelected ? "border-brand-500 bg-brand-50" : "border-secondary bg-primary hover:bg-secondary"
              )}
            >
              <Checkbox
                isSelected={isSelected}
                onChange={() => toggleArrayItem("existingCompliance", option.id)}
              />
              <div>
                <p className={cx(
                  "font-semibold text-sm",
                  isSelected ? "text-gray-900" : "text-primary"
                )}>{option.label}</p>
                <p className={cx(
                  "mt-0.5 text-xs",
                  isSelected ? "text-gray-600" : "text-tertiary"
                )}>{option.desc}</p>
              </div>
            </label>
          );
        })}
      </div>

      {/* Boolean questions */}
      <div className="space-y-3 pt-2">
        <p className="text-md font-semibold text-primary">Current capabilities:</p>
      </div>

      <div className="space-y-4">
        <label className={cx(
          "flex items-start gap-4 rounded-xl border p-5 cursor-pointer transition-colors",
          data.hasExistingQMS ? "border-brand-500 bg-brand-50" : "border-secondary bg-primary hover:bg-secondary"
        )}>
          <Checkbox
            isSelected={data.hasExistingQMS}
            onChange={(checked) => updateData("hasExistingQMS", checked)}
          />
          <div>
            <p className={cx(
              "font-semibold",
              data.hasExistingQMS ? "text-gray-900" : "text-primary"
            )}>Quality Management System (QMS)</p>
            <p className={cx(
              "mt-1 text-sm",
              data.hasExistingQMS ? "text-gray-600" : "text-tertiary"
            )}>Your organization has an existing quality management system with documented procedures, policies, and review processes.</p>
          </div>
        </label>

        <label className={cx(
          "flex items-start gap-4 rounded-xl border p-5 cursor-pointer transition-colors",
          data.hasIncidentResponsePlan ? "border-brand-500 bg-brand-50" : "border-secondary bg-primary hover:bg-secondary"
        )}>
          <Checkbox
            isSelected={data.hasIncidentResponsePlan}
            onChange={(checked) => updateData("hasIncidentResponsePlan", checked)}
          />
          <div>
            <p className={cx(
              "font-semibold",
              data.hasIncidentResponsePlan ? "text-gray-900" : "text-primary"
            )}>Incident Response Plan</p>
            <p className={cx(
              "mt-1 text-sm",
              data.hasIncidentResponsePlan ? "text-gray-600" : "text-tertiary"
            )}>You have documented procedures for handling AI system failures, malfunctions, or security incidents, including reporting timelines and escalation paths.</p>
          </div>
        </label>

        <label className={cx(
          "flex items-start gap-4 rounded-xl border p-5 cursor-pointer transition-colors",
          data.hasPostMarketMonitoring ? "border-brand-500 bg-brand-50" : "border-secondary bg-primary hover:bg-secondary"
        )}>
          <Checkbox
            isSelected={data.hasPostMarketMonitoring}
            onChange={(checked) => updateData("hasPostMarketMonitoring", checked)}
          />
          <div>
            <p className={cx(
              "font-semibold",
              data.hasPostMarketMonitoring ? "text-gray-900" : "text-primary"
            )}>Post-Market Monitoring</p>
            <p className={cx(
              "mt-1 text-sm",
              data.hasPostMarketMonitoring ? "text-gray-600" : "text-tertiary"
            )}>You systematically collect and analyze data on AI system performance after deployment, including user feedback, accuracy metrics, and bias monitoring.</p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ComplianceReadinessStep;
