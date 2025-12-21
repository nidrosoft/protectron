"use client";

import { Warning2, InfoCircle, TickCircle, Danger, Clock, TickSquare } from "iconsax-react";
import { Badge } from "@/components/base/badges/badges";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { 
  providers, 
  useCaseCategories, 
  calculateRiskLevel,
  systemTypeConfig,
  agentFrameworks,
  type FormData 
} from "../data/form-options";
import { cx } from "@/utils/cx";

interface ReviewStepProps {
  formData: FormData;
}

const riskConfig = {
  prohibited: { color: "error" as const, icon: Danger, label: "Prohibited", bgColor: "bg-error-50", textColor: "text-error-700", borderColor: "border-error-200" },
  high: { color: "warning" as const, icon: Warning2, label: "High Risk", bgColor: "bg-warning-50", textColor: "text-warning-700", borderColor: "border-warning-200" },
  limited: { color: "brand" as const, icon: InfoCircle, label: "Limited Risk", bgColor: "bg-brand-50", textColor: "text-brand-700", borderColor: "border-brand-200" },
  minimal: { color: "success" as const, icon: TickCircle, label: "Minimal Risk", bgColor: "bg-success-50", textColor: "text-success-700", borderColor: "border-success-200" },
};

export const ReviewStep = ({ formData }: ReviewStepProps) => {
  const riskResult = calculateRiskLevel(formData);
  const isAgent = formData.systemType === "ai_agent";
  const systemType = systemTypeConfig.find(t => t.id === formData.systemType);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-primary">Risk Assessment Results</h2>
        <p className="mt-1 text-sm text-tertiary">
          Based on your responses, this {isAgent ? "AI Agent" : "AI system"} is classified under the EU AI Act.
        </p>
      </div>

      {/* Risk Level Card */}
      <div className={cx("rounded-xl border-2 p-6", riskConfig[riskResult.level].bgColor, riskConfig[riskResult.level].borderColor)}>
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
              {riskResult.level === "high" && `Based on your responses, this ${isAgent ? "AI Agent" : "AI system"} is classified as HIGH RISK under the EU AI Act.`}
              {riskResult.level === "limited" && "Transparency requirements apply. Users must be informed when interacting with AI."}
              {riskResult.level === "minimal" && "No specific obligations under the EU AI Act. We recommend following best practices."}
              {riskResult.level === "prohibited" && "This AI practice is prohibited under the EU AI Act. You must discontinue use."}
            </p>
          </div>
        </div>
      </div>

      {/* Why This Risk Level - Triggers */}
      {riskResult.triggers.length > 0 && riskResult.level !== "minimal" && (
        <div className="rounded-lg border border-secondary p-4">
          <h4 className="text-sm font-semibold text-primary">Why {riskConfig[riskResult.level].label}?</h4>
          <p className="mt-1 text-xs text-tertiary">Your AI system triggered the following criteria:</p>
          <div className="mt-3 flex flex-col gap-3">
            {riskResult.triggers.map((trigger, index) => (
              <div key={index} className="flex items-start gap-3 rounded-lg bg-secondary_subtle p-3">
                <TickSquare size={18} className="mt-0.5 shrink-0 text-success-500" color="currentColor" variant="Bold" />
                <div>
                  <p className="text-sm font-medium text-primary">{trigger.criterion}</p>
                  <p className="text-xs text-tertiary">
                    <span className="font-medium text-brand-600">{trigger.article}</span>: {trigger.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Requirements */}
      {riskResult.level !== "minimal" && (
        <div className="rounded-lg border border-secondary p-4">
          <h4 className="text-sm font-semibold text-primary">Compliance Requirements</h4>
          <p className="mt-1 text-xs text-tertiary">This classification means you must comply with:</p>
          <div className="mt-3 flex flex-col gap-2">
            {riskResult.articles.map((article, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg bg-secondary_subtle px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary">{article.article}:</span>
                  <span className="text-sm text-secondary">{article.title}</span>
                </div>
                <Badge color="gray" size="sm">{article.items} items</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deadline */}
      {riskResult.level !== "minimal" && riskResult.daysRemaining > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-warning-50 border border-warning-200 p-4">
          <Clock size={20} className="text-warning-600" color="currentColor" />
          <div>
            <p className="text-sm font-semibold text-warning-700">
              Compliance Deadline: {riskResult.deadline}
            </p>
            <p className="text-xs text-warning-600">
              {riskResult.daysRemaining} days remaining
            </p>
          </div>
        </div>
      )}

      {/* System Summary */}
      <div className="rounded-lg border border-secondary p-4">
        <h4 className="text-sm font-semibold text-primary">System Summary</h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-tertiary">Name</p>
            <p className="text-sm font-medium text-primary">{formData.name || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-tertiary">Type</p>
            <p className="text-sm font-medium text-primary">{systemType?.label || "—"}</p>
          </div>
          {isAgent ? (
            <div>
              <p className="text-xs text-tertiary">Framework</p>
              <p className="text-sm font-medium text-primary">
                {agentFrameworks.find(f => f.id === formData.agentFramework)?.label || "—"}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-tertiary">Provider</p>
              <p className="text-sm font-medium text-primary">
                {providers.find(p => p.id === formData.provider)?.label || "—"}
              </p>
            </div>
          )}
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
          {isAgent && (
            <div>
              <p className="text-xs text-tertiary">Multi-Agent System</p>
              <p className="text-sm font-medium text-primary">
                {formData.isMultiAgent ? "Yes" : "No, standalone agent"}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-tertiary">Initial Status</p>
            <p className="text-sm font-medium text-primary">Draft</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
