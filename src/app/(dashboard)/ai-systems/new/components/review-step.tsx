"use client";

import { Warning2, InfoCircle, TickCircle, Danger } from "iconsax-react";
import { Badge } from "@/components/base/badges/badges";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { 
  providers, 
  useCaseCategories, 
  calculateRiskLevel, 
  type FormData 
} from "../data/form-options";
import { cx } from "@/utils/cx";

interface ReviewStepProps {
  formData: FormData;
}

const riskConfig = {
  prohibited: { color: "error" as const, icon: Danger, label: "Prohibited", bgColor: "bg-error-50", textColor: "text-error-700" },
  high: { color: "warning" as const, icon: Warning2, label: "High Risk", bgColor: "bg-warning-50", textColor: "text-warning-700" },
  limited: { color: "brand" as const, icon: InfoCircle, label: "Limited Risk", bgColor: "bg-brand-50", textColor: "text-brand-700" },
  minimal: { color: "success" as const, icon: TickCircle, label: "Minimal Risk", bgColor: "bg-success-50", textColor: "text-success-700" },
};

export const ReviewStep = ({ formData }: ReviewStepProps) => {
  const riskResult = calculateRiskLevel(formData);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-primary">Risk Classification</h2>
        <p className="mt-1 text-sm text-tertiary">
          Based on your answers, we've determined the risk level for this AI system.
        </p>
      </div>

      {/* Risk Level Card */}
      <div className={cx("rounded-xl border-2 p-6", riskConfig[riskResult.level].bgColor, `border-${riskConfig[riskResult.level].color}-200`)}>
        <div className="flex items-start gap-4">
          <FeaturedIcon
            size="lg"
            icon={({ className }) => {
              const Icon = riskConfig[riskResult.level].icon;
              return <Icon size={24} className={className} color="currentColor" />;
            }}
            color={riskConfig[riskResult.level].color}
            theme="light"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className={cx("text-xl font-semibold", riskConfig[riskResult.level].textColor)}>
                {riskConfig[riskResult.level].label}
              </h3>
              <Badge color={riskConfig[riskResult.level].color} size="md">
                {riskResult.requirements} Requirements
              </Badge>
            </div>
            <p className={cx("mt-2 text-sm", riskConfig[riskResult.level].textColor)}>
              {riskResult.level === "high" && "Full compliance required by August 2, 2026. This system requires comprehensive documentation and oversight."}
              {riskResult.level === "limited" && "Transparency requirements apply. Users must be informed when interacting with AI."}
              {riskResult.level === "minimal" && "No specific obligations under the EU AI Act. We recommend following best practices."}
              {riskResult.level === "prohibited" && "This AI practice is prohibited under the EU AI Act. You must discontinue use."}
            </p>
          </div>
        </div>
      </div>

      {/* Reasons */}
      {riskResult.reasons.length > 0 && (
        <div className="rounded-lg border border-secondary p-4">
          <h4 className="text-sm font-medium text-primary">Classification Factors</h4>
          <ul className="mt-2 flex flex-col gap-1">
            {riskResult.reasons.map((reason, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-tertiary">
                <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary */}
      <div className="rounded-lg border border-secondary p-4">
        <h4 className="text-sm font-medium text-primary">System Summary</h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-tertiary">Name</p>
            <p className="text-sm font-medium text-primary">{formData.name || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-tertiary">Provider</p>
            <p className="text-sm font-medium text-primary">
              {providers.find(p => p.id === formData.provider)?.label || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-tertiary">Use Case</p>
            <p className="text-sm font-medium text-primary">
              {useCaseCategories.find(c => c.id === formData.useCase)?.label || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-tertiary">EU Exposure</p>
            <p className="text-sm font-medium text-primary">
              {formData.servesEU || formData.processesInEU || formData.establishedInEU ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
