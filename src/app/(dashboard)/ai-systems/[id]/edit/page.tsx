"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Cpu, TickCircle, MessageText, Box1, Judge } from "iconsax-react";
import { ArrowLeft } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import { useToast } from "@/components/base/toast/toast";
import { Select } from "@/components/base/select/select";
import { mockAISystems, riskLevelConfig, systemTypeConfig } from "../data/mock-data";

export default function EditAISystemPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const id = params.id as string;

  const system = mockAISystems[id] || mockAISystems["system-03"];
  const typeConfig = systemTypeConfig[system.type];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: system.name,
    description: system.description,
    provider: system.provider,
    modelName: system.modelName,
    category: system.category,
    deploymentStatus: system.deploymentStatus,
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addToast({
        title: "System Updated",
        message: `${formData.name} has been updated successfully.`,
        type: "success",
      });
      router.push(`/ai-systems/${id}`);
    }, 1500);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-secondary bg-primary px-6 py-4 lg:px-8">
        <Link
          href={`/ai-systems/${id}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-tertiary hover:text-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {system.name}
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${system.type === "ai_agent" ? "bg-brand-100" : "bg-gray-100"}`}>
              {system.type === "ai_agent" && <Cpu size={24} className="text-brand-600" color="currentColor" variant="Bold" />}
              {system.type === "llm_application" && <MessageText size={24} className="text-gray-600" color="currentColor" variant="Bold" />}
              {system.type === "ml_model" && <Box1 size={24} className="text-gray-600" color="currentColor" variant="Bold" />}
              {system.type === "automated_decision" && <Judge size={24} className="text-gray-600" color="currentColor" variant="Bold" />}
              {system.type === "other" && <Box1 size={24} className="text-gray-600" color="currentColor" variant="Bold" />}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-primary">Edit AI System</h1>
              <p className="text-sm text-tertiary">{system.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge color={riskLevelConfig[system.riskLevel].color} size="md">
              {riskLevelConfig[system.riskLevel].label}
            </Badge>
            <Badge color="gray" size="md">
              {typeConfig.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Basic Information */}
          <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
            <h2 className="text-lg font-semibold text-primary mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  System Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full rounded-lg border border-secondary bg-primary px-3 py-2 text-sm text-primary placeholder:text-tertiary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Enter system name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-secondary bg-primary px-3 py-2 text-sm text-primary placeholder:text-tertiary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                  placeholder="Describe what this AI system does"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Provider
                  </label>
                  <input
                    type="text"
                    value={formData.provider}
                    onChange={(e) => handleChange("provider", e.target.value)}
                    className="w-full rounded-lg border border-secondary bg-primary px-3 py-2 text-sm text-primary placeholder:text-tertiary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g., OpenAI, Anthropic"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Model Name
                  </label>
                  <input
                    type="text"
                    value={formData.modelName}
                    onChange={(e) => handleChange("modelName", e.target.value)}
                    className="w-full rounded-lg border border-secondary bg-primary px-3 py-2 text-sm text-primary placeholder:text-tertiary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g., GPT-4, Claude 3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="w-full rounded-lg border border-secondary bg-primary px-3 py-2 text-sm text-primary placeholder:text-tertiary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="e.g., Customer Service"
                  />
                </div>
                <div>
                  <Select
                    label="Deployment Status"
                    size="md"
                    selectedKey={formData.deploymentStatus}
                    onSelectionChange={(key) => handleChange("deploymentStatus", key as string)}
                    items={[
                      { id: "Development", label: "Development" },
                      { id: "Staging", label: "Staging" },
                      { id: "Production", label: "Production" },
                      { id: "Deprecated", label: "Deprecated" },
                    ]}
                  >
                    {(item) => <Select.Item id={item.id} key={item.id}>{item.label}</Select.Item>}
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Read-only Information */}
          <div className="mt-6 rounded-xl bg-secondary_subtle p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">System Classification</h2>
            <p className="text-sm text-tertiary mb-4">
              The following fields are determined by your initial assessment and cannot be changed. 
              To modify risk classification, please create a new system.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-tertiary mb-1">
                  System Type
                </label>
                <p className="text-sm font-medium text-primary">{typeConfig.label}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-tertiary mb-1">
                  Risk Level
                </label>
                <p className="text-sm font-medium text-primary">{riskLevelConfig[system.riskLevel].label}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-tertiary mb-1">
                  Created
                </label>
                <p className="text-sm font-medium text-primary">{system.createdAt}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-tertiary mb-1">
                  Last Updated
                </label>
                <p className="text-sm font-medium text-primary">{system.updatedAt}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <Button
              size="md"
              color="secondary"
              onClick={() => router.push(`/ai-systems/${id}`)}
            >
              Cancel
            </Button>
            <Button
              size="md"
              color="primary"
              isLoading={isSubmitting}
              iconLeading={({ className }) => (
                <TickCircle size={18} color="currentColor" className={className} />
              )}
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
