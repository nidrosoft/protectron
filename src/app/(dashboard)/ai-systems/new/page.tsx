"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Cpu } from "iconsax-react";
import { ArrowLeft as ArrowLeftIcon, Building07, Target04, Database02, Globe04, CheckCircle } from "@untitledui/icons";
import { Progress } from "@/components/application/progress-steps/progress-steps";
import type { ProgressFeaturedIconType } from "@/components/application/progress-steps/progress-types";
import { Button } from "@/components/base/buttons/button";
import {
  BasicInfoStep,
  UseCaseStep,
  DataPrivacyStep,
  EUExposureStep,
  ReviewStep,
} from "./components";
import { initialFormData, type FormData } from "./data/form-options";

// Step definitions for display
const stepNames = [
  { id: 1, name: "Basic Information", description: "System name and provider" },
  { id: 2, name: "Use Case", description: "How the AI is used" },
  { id: 3, name: "Data & Privacy", description: "Data types processed" },
  { id: 4, name: "EU Exposure", description: "EU market presence" },
  { id: 5, name: "Risk Classification", description: "Review and confirm" },
];

// Function to generate progress steps based on current step
const getProgressSteps = (currentStep: number): ProgressFeaturedIconType[] => [
  { 
    title: "Basic Information", 
    description: "System name and provider", 
    status: currentStep > 1 ? "complete" : currentStep === 1 ? "current" : "incomplete",
    icon: Building07 
  },
  { 
    title: "Use Case", 
    description: "How the AI is used", 
    status: currentStep > 2 ? "complete" : currentStep === 2 ? "current" : "incomplete",
    icon: Target04 
  },
  { 
    title: "Data & Privacy", 
    description: "Data types processed", 
    status: currentStep > 3 ? "complete" : currentStep === 3 ? "current" : "incomplete",
    icon: Database02 
  },
  { 
    title: "EU Exposure", 
    description: "EU market presence", 
    status: currentStep > 4 ? "complete" : currentStep === 4 ? "current" : "incomplete",
    icon: Globe04 
  },
  { 
    title: "Risk Classification", 
    description: "Review and confirm", 
    status: currentStep === 5 ? "current" : "incomplete",
    icon: CheckCircle 
  },
];

export default function NewAISystemPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const toggleArrayItem = (field: "dataTypes" | "dataSubjects", item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== "" && formData.provider !== "";
      case 2:
        return formData.useCase !== "";
      case 3:
        return formData.dataTypes.length > 0;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log("Submitting AI System:", formData);
    await new Promise(resolve => setTimeout(resolve, 2500));
    router.push("/ai-systems");
  };

  // Show loading overlay when submitting
  if (isSubmitting) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
          <Cpu size={32} className="animate-pulse text-brand-600" color="currentColor" variant="Bold" />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-xl font-semibold text-primary">Adding Your AI System</h2>
          <p className="text-sm text-tertiary">
            Setting up {formData.name} and configuring compliance requirements...
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-brand-600" style={{ animationDelay: "0ms" }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-brand-600" style={{ animationDelay: "150ms" }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-brand-600" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="shrink-0 border-b border-secondary bg-primary px-6 py-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="/ai-systems"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-secondary hover:bg-secondary"
          >
            <ArrowLeftIcon className="h-5 w-5 text-quaternary" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-primary">Add AI System</h1>
            <p className="text-sm text-tertiary">Step {currentStep} of 5: {stepNames[currentStep - 1].name}</p>
          </div>
        </div>
      </div>

      {/* Fixed Progress Bar */}
      <div className="shrink-0 border-b border-secondary bg-primary px-6 py-4 lg:px-8">
        <Progress.IconsWithText 
          type="number" 
          items={getProgressSteps(currentStep)} 
          size="sm" 
          orientation="horizontal" 
          className="max-md:hidden" 
        />
        <Progress.IconsWithText 
          type="number" 
          items={getProgressSteps(currentStep)} 
          size="sm" 
          orientation="vertical" 
          className="md:hidden" 
        />
      </div>

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {currentStep === 1 && (
            <BasicInfoStep formData={formData} updateFormData={updateFormData} />
          )}

          {currentStep === 2 && (
            <UseCaseStep formData={formData} updateFormData={updateFormData} />
          )}

          {currentStep === 3 && (
            <DataPrivacyStep formData={formData} toggleArrayItem={toggleArrayItem} />
          )}

          {currentStep === 4 && (
            <EUExposureStep formData={formData} updateFormData={updateFormData} />
          )}

          {currentStep === 5 && (
            <ReviewStep formData={formData} />
          )}
        </div>
      </div>

      {/* Fixed Footer Navigation */}
      <div className="shrink-0 border-t border-secondary bg-primary px-6 py-4 lg:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Button
            size="md"
            color="secondary"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          
          <div className="flex gap-3">
            <Button size="md" color="secondary" onClick={() => router.push("/ai-systems")}>
              Cancel
            </Button>
            {currentStep < 5 ? (
              <Button size="md" onClick={handleNext} disabled={!canProceed()}>
                Continue
              </Button>
            ) : (
              <Button size="md" onClick={handleSubmit}>
                Add AI System
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
