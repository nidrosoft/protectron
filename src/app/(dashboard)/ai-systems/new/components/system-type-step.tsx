"use client";

import { Cpu, MessageText, Box1, Judge } from "iconsax-react";
import { Warning2 } from "iconsax-react";
import { cx } from "@/utils/cx";
import { systemTypeConfig, type FormData, type SystemType } from "../data/form-options";

interface SystemTypeStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const typeIcons: Record<SystemType, typeof Cpu> = {
  ai_agent: Cpu,
  llm_application: MessageText,
  ml_model: Box1,
  automated_decision: Judge,
  other: Box1,
};

export const SystemTypeStep = ({ formData, updateFormData }: SystemTypeStepProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-primary">What type of AI system is this?</h2>
        <p className="mt-1 text-sm text-tertiary">
          Select the category that best describes your AI system. This helps determine compliance requirements.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {systemTypeConfig.map((type) => {
          const Icon = typeIcons[type.id];
          const isSelected = formData.systemType === type.id;
          
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => updateFormData({ systemType: type.id })}
              className={cx(
                "flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all",
                isSelected
                  ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20"
                  : "border-secondary hover:border-brand-300 hover:bg-secondary_subtle"
              )}
            >
              <div className={cx(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                isSelected ? "bg-brand-100" : "bg-gray-100"
              )}>
                <Icon 
                  size={20} 
                  className={isSelected ? "text-brand-600" : "text-gray-500"} 
                  color="currentColor" 
                  variant="Bold" 
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={cx(
                    "font-semibold",
                    isSelected ? "text-brand-700" : "text-primary"
                  )}>
                    {type.label}
                  </span>
                  {/* Selection indicator */}
                  <div className={cx(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2",
                    isSelected 
                      ? "border-brand-500 bg-brand-500" 
                      : "border-gray-300"
                  )}>
                    {isSelected && (
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10.28 2.28L4 8.56 1.72 6.28a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l7-7a.75.75 0 00-1.06-1.06z" />
                      </svg>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-sm text-tertiary">
                  {type.description}
                </p>
                {type.warning && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-warning-600">
                    <Warning2 size={14} color="currentColor" />
                    <span className="font-medium">{type.warning}</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SystemTypeStep;
