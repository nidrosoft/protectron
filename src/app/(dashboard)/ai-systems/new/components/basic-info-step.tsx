"use client";

import { Input, TextField } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import { cx } from "@/utils/cx";
import { 
  providers, 
  deploymentStatuses, 
  agentFrameworks,
  agentCapabilitiesConfig,
  type FormData,
  type AgentCapability 
} from "../data/form-options";

interface BasicInfoStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  toggleArrayItem: (field: "dataTypes" | "dataSubjects" | "agentCapabilities", item: string) => void;
}

export const BasicInfoStep = ({ formData, updateFormData, toggleArrayItem }: BasicInfoStepProps) => {
  const isAgent = formData.systemType === "ai_agent";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-primary">
          {isAgent ? "Tell us about your AI Agent" : "Basic Information"}
        </h2>
        <p className="mt-1 text-sm text-tertiary">
          {isAgent 
            ? "Provide details about your agent's name, framework, and capabilities."
            : "Tell us about your AI system and its provider."}
        </p>
      </div>

      <TextField label={isAgent ? "Agent Name" : "System Name"} isRequired>
        <Input
          placeholder={isAgent ? "e.g., Customer Support Agent" : "e.g., Customer Support Chatbot"}
          value={formData.name}
          onChange={(value: string) => updateFormData({ name: value })}
        />
      </TextField>

      <TextArea
        label="Description"
        placeholder={isAgent 
          ? "Describe what this agent does, its responsibilities, and how it interacts with users..."
          : "Briefly describe what this AI system does..."}
        value={formData.description}
        onChange={(value: string) => updateFormData({ description: value })}
      />

      {isAgent ? (
        <>
          <Select
            label="Agent Framework"
            placeholder="Select framework"
            selectedKey={formData.agentFramework}
            onSelectionChange={(key) => key && updateFormData({ agentFramework: String(key) as FormData["agentFramework"] })}
            items={agentFrameworks}
            isRequired
          >
            {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
          </Select>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-primary">
              Agent Capabilities <span className="text-error-500">*</span>
            </label>
            <p className="text-sm text-tertiary -mt-2">Select all that apply to this agent.</p>
            <div className="flex flex-col gap-2">
              {agentCapabilitiesConfig.map((capability) => {
                const isSelected = formData.agentCapabilities.includes(capability.id);
                return (
                  <button
                    key={capability.id}
                    type="button"
                    onClick={() => toggleArrayItem("agentCapabilities", capability.id)}
                    className={cx(
                      "flex items-start gap-3 rounded-lg border p-3 text-left transition-all",
                      isSelected
                        ? "border-brand-500 bg-brand-50"
                        : "border-secondary hover:border-brand-300 hover:bg-secondary_subtle"
                    )}
                  >
                    <div className={cx(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2",
                      isSelected ? "border-brand-500 bg-brand-500" : "border-gray-300"
                    )}>
                      {isSelected && (
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10.28 2.28L4 8.56 1.72 6.28a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l7-7a.75.75 0 00-1.06-1.06z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <span className={cx("font-medium", isSelected ? "text-brand-700" : "text-primary")}>
                        {capability.label}
                      </span>
                      <p className="text-sm text-tertiary">{capability.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-primary">Is this part of a multi-agent system?</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => updateFormData({ isMultiAgent: false })}
                className={cx(
                  "flex items-center gap-2 rounded-lg border px-4 py-2.5 transition-all",
                  !formData.isMultiAgent
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-secondary text-secondary hover:border-brand-300"
                )}
              >
                <div className={cx(
                  "h-4 w-4 rounded-full border-2",
                  !formData.isMultiAgent ? "border-brand-500 bg-brand-500" : "border-gray-300"
                )}>
                  {!formData.isMultiAgent && <div className="h-full w-full rounded-full bg-white scale-50" />}
                </div>
                No, standalone agent
              </button>
              <button
                type="button"
                onClick={() => updateFormData({ isMultiAgent: true })}
                className={cx(
                  "flex items-center gap-2 rounded-lg border px-4 py-2.5 transition-all",
                  formData.isMultiAgent
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-secondary text-secondary hover:border-brand-300"
                )}
              >
                <div className={cx(
                  "h-4 w-4 rounded-full border-2",
                  formData.isMultiAgent ? "border-brand-500 bg-brand-500" : "border-gray-300"
                )}>
                  {formData.isMultiAgent && <div className="h-full w-full rounded-full bg-white scale-50" />}
                </div>
                Yes, works with other agents
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <Select
            label="Provider"
            placeholder="Select provider"
            selectedKey={formData.provider}
            onSelectionChange={(key) => key && updateFormData({ provider: key as string })}
            items={providers}
          >
            {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
          </Select>

          <TextField label="Model Name">
            <Input
              placeholder="e.g., GPT-4, Claude 3, Custom ML"
              value={formData.modelName}
              onChange={(value: string) => updateFormData({ modelName: value })}
            />
          </TextField>

          <Select
            label="Deployment Status"
            placeholder="Select status"
            selectedKey={formData.deploymentStatus}
            onSelectionChange={(key) => key && updateFormData({ deploymentStatus: key as string })}
            items={deploymentStatuses}
          >
            {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
          </Select>
        </>
      )}
    </div>
  );
};

export default BasicInfoStep;
