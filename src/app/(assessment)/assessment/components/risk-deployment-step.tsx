"use client";

import { Checkbox } from "@/components/base/checkbox/checkbox";
import { type AssessmentData, aiRoleOptions, deploymentEnvironmentOptions } from "../data/assessment-options";
import { cx } from "@/utils/cx";

interface RiskDeploymentStepProps {
  data: AssessmentData;
  updateData: (field: keyof AssessmentData, value: unknown) => void;
}

export const RiskDeploymentStep = ({ data, updateData }: RiskDeploymentStepProps) => {
  return (
    <div className="space-y-6">
      {/* Context Box */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
        <p className="text-sm font-medium text-brand-700">Why does this matter?</p>
        <p className="mt-1 text-sm text-brand-600">
          The EU AI Act distinguishes between AI providers (developers) and deployers (users). Different obligations apply to each role. Additionally, AI systems affecting vulnerable groups or used in public services face stricter requirements including mandatory Fundamental Rights Impact Assessments (Article 27).
        </p>
      </div>

      {/* AI Role Selection */}
      <div className="space-y-3">
        <p className="text-md font-semibold text-primary">What is your role in the AI value chain?</p>
        <p className="text-sm text-tertiary">This determines which specific obligations apply to your organization.</p>
      </div>

      <div className="space-y-3">
        {aiRoleOptions.map((option) => {
          const isSelected = data.aiRole === option.value;
          return (
            <label
              key={option.value}
              className={cx(
                "flex items-start gap-4 rounded-xl border p-5 cursor-pointer transition-colors",
                isSelected ? "border-brand-500 bg-brand-50" : "border-secondary bg-primary hover:bg-secondary"
              )}
            >
              <div className="pt-0.5">
                <div
                  className={cx(
                    "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                    isSelected ? "border-brand-600" : "border-gray-300"
                  )}
                >
                  {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
                </div>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => updateData("aiRole", option.value)}
                onKeyDown={(e) => e.key === "Enter" && updateData("aiRole", option.value)}
              >
                <p className={cx(
                  "font-semibold",
                  isSelected ? "text-gray-900" : "text-primary"
                )}>{option.label}</p>
                <p className={cx(
                  "mt-1 text-sm",
                  isSelected ? "text-gray-600" : "text-tertiary"
                )}>{option.desc}</p>
              </div>
            </label>
          );
        })}
      </div>

      {/* Deployment Environment */}
      <div className="space-y-3 pt-2">
        <p className="text-md font-semibold text-primary">What is your AI deployment stage?</p>
      </div>

      <div className="space-y-3">
        {deploymentEnvironmentOptions.map((option) => {
          const isSelected = data.deploymentEnvironment === option.value;
          return (
            <label
              key={option.value}
              className={cx(
                "flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition-colors",
                isSelected ? "border-brand-500 bg-brand-50" : "border-secondary bg-primary hover:bg-secondary"
              )}
            >
              <div className="pt-0.5">
                <div
                  className={cx(
                    "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                    isSelected ? "border-brand-600" : "border-gray-300"
                  )}
                >
                  {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
                </div>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => updateData("deploymentEnvironment", option.value)}
                onKeyDown={(e) => e.key === "Enter" && updateData("deploymentEnvironment", option.value)}
                className="flex-1"
              >
                <div className="flex items-center gap-2">
                  <p className={cx(
                    "font-semibold text-sm",
                    isSelected ? "text-gray-900" : "text-primary"
                  )}>{option.label}</p>
                  {option.badge && (
                    <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className={cx(
                  "mt-0.5 text-xs",
                  isSelected ? "text-gray-600" : "text-tertiary"
                )}>{option.desc}</p>
              </div>
            </label>
          );
        })}
      </div>

      {/* Additional context */}
      <div className="space-y-3 pt-2">
        <p className="text-md font-semibold text-primary">Additional context:</p>
      </div>

      <div className="space-y-4">
        <label className={cx(
          "flex items-start gap-4 rounded-xl border p-5 cursor-pointer transition-colors",
          data.servesPublicSector ? "border-brand-500 bg-brand-50" : "border-secondary bg-primary hover:bg-secondary"
        )}>
          <Checkbox
            isSelected={data.servesPublicSector}
            onChange={(checked) => updateData("servesPublicSector", checked)}
          />
          <div>
            <p className={cx(
              "font-semibold",
              data.servesPublicSector ? "text-gray-900" : "text-primary"
            )}>Public Sector / Public Services</p>
            <p className={cx(
              "mt-1 text-sm",
              data.servesPublicSector ? "text-gray-600" : "text-tertiary"
            )}>Your organization is a public body or provides services of public interest (e.g., healthcare, education, social services, utilities, transportation).</p>
          </div>
        </label>

        <label className={cx(
          "flex items-start gap-4 rounded-xl border p-5 cursor-pointer transition-colors",
          data.hasVulnerableGroups ? "border-brand-500 bg-brand-50" : "border-secondary bg-primary hover:bg-secondary"
        )}>
          <Checkbox
            isSelected={data.hasVulnerableGroups}
            onChange={(checked) => updateData("hasVulnerableGroups", checked)}
          />
          <div>
            <p className={cx(
              "font-semibold",
              data.hasVulnerableGroups ? "text-gray-900" : "text-primary"
            )}>Affects Vulnerable Groups</p>
            <p className={cx(
              "mt-1 text-sm",
              data.hasVulnerableGroups ? "text-gray-600" : "text-tertiary"
            )}>Your AI systems may affect children, elderly persons, persons with disabilities, or other groups in a vulnerable position due to social, economic, or health circumstances.</p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default RiskDeploymentStep;
