"use client";

import { Input, TextField } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { Select } from "@/components/base/select/select";
import { SelectItem } from "@/components/base/select/select-item";
import { providers, deploymentStatuses, type FormData } from "../data/form-options";

interface BasicInfoStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const BasicInfoStep = ({ formData, updateFormData }: BasicInfoStepProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-primary">Basic Information</h2>
        <p className="mt-1 text-sm text-tertiary">
          Tell us about your AI system and its provider.
        </p>
      </div>

      <TextField label="System Name" isRequired>
        <Input
          placeholder="e.g., Customer Support Chatbot"
          value={formData.name}
          onChange={(value: string) => updateFormData({ name: value })}
        />
      </TextField>

      <TextArea
        label="Description"
        placeholder="Briefly describe what this AI system does..."
        value={formData.description}
        onChange={(value: string) => updateFormData({ description: value })}
      />

      <Select
        label="Provider"
        placeholder="Select provider"
        selectedKey={formData.provider}
        onSelectionChange={(key: React.Key) => updateFormData({ provider: key as string })}
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
        onSelectionChange={(key: React.Key) => updateFormData({ deploymentStatus: key as string })}
        items={deploymentStatuses}
      >
        {(item) => <SelectItem id={item.id}>{item.label}</SelectItem>}
      </Select>
    </div>
  );
};

export default BasicInfoStep;
