"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import type { ProgressFeaturedIconType } from "@/components/application/progress-steps/progress-types";
import { cx } from "@/utils/cx";
import { createClient } from "@/lib/supabase/client";
import {
  CompanyDetailsStep,
  EUPresenceStep,
  AISystemsStep,
  UseCasesStep,
  DataTypesStep,
  DecisionImpactStep,
} from "./components";
import { stepDefinitions, initialAssessmentData, type AssessmentData } from "./data/assessment-options";

export default function AssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<AssessmentData>(initialAssessmentData);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  // Fetch user's organization data to pre-fill company name
  useEffect(() => {
    const fetchUserOrganization = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsLoadingUserData(false);
          return;
        }

        // First check user metadata for company name (from signup)
        const companyNameFromMetadata = user.user_metadata?.company_name;
        
        if (companyNameFromMetadata) {
          setData(prev => ({ ...prev, companyName: companyNameFromMetadata }));
          setIsLoadingUserData(false);
          return;
        }

        // Otherwise, try to get from organization
        const { data: profile } = await supabase
          .from("profiles")
          .select("organization_id")
          .eq("id", user.id)
          .single();

        if (profile?.organization_id) {
          const { data: org } = await supabase
            .from("organizations")
            .select("name, industry, company_size, country, has_eu_presence")
            .eq("id", profile.organization_id)
            .single();

          if (org) {
            setData(prev => ({
              ...prev,
              companyName: org.name || prev.companyName,
              industry: org.industry || prev.industry,
              companySize: org.company_size || prev.companySize,
              country: org.country || prev.country,
              hasEUOperations: org.has_eu_presence || prev.hasEUOperations,
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching user organization:", err);
      } finally {
        setIsLoadingUserData(false);
      }
    };

    fetchUserOrganization();
  }, []);

  // Generate progress steps with status for the official Progress component
  const progressSteps: ProgressFeaturedIconType[] = stepDefinitions.map((step) => ({
    title: step.title,
    description: step.description,
    status: step.id < currentStep ? "complete" : step.id === currentStep ? "current" : "incomplete",
    icon: step.icon,
  }));

  const handleNext = () => {
    if (currentStep < stepDefinitions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem("assessmentData", JSON.stringify(data));
      router.push("/assessment/results");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (field: keyof AssessmentData, value: unknown) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof AssessmentData, item: string) => {
    const currentArray = data[field] as string[];
    if (currentArray.includes(item)) {
      updateData(field, currentArray.filter((i) => i !== item));
    } else {
      updateData(field, [...currentArray, item]);
    }
  };

  const currentStepData = stepDefinitions[currentStep - 1];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <CompanyDetailsStep data={data} updateData={updateData} />;
      case 2:
        return <EUPresenceStep data={data} updateData={updateData} />;
      case 3:
        return <AISystemsStep data={data} toggleArrayItem={toggleArrayItem} />;
      case 4:
        return <UseCasesStep data={data} toggleArrayItem={toggleArrayItem} />;
      case 5:
        return <DataTypesStep data={data} toggleArrayItem={toggleArrayItem} />;
      case 6:
        return <DecisionImpactStep data={data} updateData={updateData} />;
      default:
        return null;
    }
  };

  return (
    <div className="grid h-full min-h-0 lg:grid-cols-3">
      {/* Left Panel - Progress Steps (1/3 of screen) - Fixed */}
      <aside className="hidden min-h-0 overflow-y-auto border-r border-secondary bg-secondary_subtle px-8 py-8 lg:flex lg:flex-col">
        {/* Header Section */}
        <div className="mb-6 shrink-0">
          <h2 className="text-lg font-semibold text-primary">
            EU AI Act Compliance Assessment
          </h2>
          <p className="mt-3 text-md text-tertiary leading-relaxed">
            Complete this quick assessment to understand your organization's compliance requirements under the EU AI Act. We'll analyze your AI systems and provide a personalized compliance roadmap.
          </p>
          <p className="mt-2 text-sm text-quaternary">
            Estimated time: 5-10 minutes
          </p>
        </div>
        
        {/* Custom stepper matching screenshot design */}
        <div className="flex flex-col justify-between flex-1">
          {progressSteps.map((step, index) => {
            const isComplete = step.status === "complete";
            const isCurrent = step.status === "current";
            const isLast = index === progressSteps.length - 1;
            const Icon = step.icon;
            
            return (
              <div key={step.title} className="relative flex-1">
                {/* Connector line - positioned to connect icon centers */}
                {!isLast && (
                  <div
                    className={cx(
                      "absolute left-[18px] top-[48px] bottom-0 w-0.5",
                      isComplete ? "bg-brand-600" : "bg-border-secondary dark:bg-gray-700"
                    )}
                  />
                )}
                
                <div className="flex items-start gap-4 py-3">
                  {/* Icon - smaller and rounded */}
                  <div
                    className={cx(
                      "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      isComplete && "bg-brand-100 dark:bg-brand-900/30",
                      isCurrent && "bg-brand-100 dark:bg-brand-900/30 ring-2 ring-brand-600 ring-offset-2 ring-offset-secondary_subtle dark:ring-offset-gray-900",
                      !isComplete && !isCurrent && "bg-primary dark:bg-gray-800 border border-secondary dark:border-gray-700"
                    )}
                  >
                    {Icon && (
                      <Icon
                        className={cx(
                          "h-4 w-4",
                          isComplete && "text-brand-600",
                          isCurrent && "text-brand-600",
                          !isComplete && !isCurrent && "text-fg-quaternary dark:text-gray-500"
                        )}
                      />
                    )}
                  </div>
                  
                  {/* Text */}
                  <div className="flex-1">
                    <p
                      className={cx(
                        "text-sm font-semibold",
                        (isComplete || isCurrent) ? "text-primary dark:text-white" : "text-tertiary dark:text-gray-400"
                      )}
                    >
                      {step.title}
                    </p>
                    <p className={cx(
                      "mt-1 text-xs leading-relaxed",
                      isCurrent ? "text-tertiary dark:text-gray-400" : "text-quaternary dark:text-gray-500"
                    )}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Right Panel - Step Content (2/3 of screen) */}
      <div className="flex min-h-0 flex-col lg:col-span-2">
        {/* Step Header - Fixed at top */}
        <div className="shrink-0 border-b border-secondary px-4 pt-6 pb-4 sm:px-8 sm:pt-8 sm:pb-6 lg:px-12 lg:pt-10">
          {/* Mobile progress indicator */}
          <div className="mb-4 flex items-center gap-2 lg:hidden">
            {stepDefinitions.map((step, index) => (
              <div
                key={step.id}
                className={cx(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  index + 1 < currentStep && "bg-brand-600",
                  index + 1 === currentStep && "bg-brand-600",
                  index + 1 > currentStep && "bg-gray-200"
                )}
              />
            ))}
          </div>
          <p className="text-xs font-medium text-brand-600 sm:text-sm">
            STEP {currentStep} OF {stepDefinitions.length}
          </p>
          <h1 className="mt-1 text-lg font-semibold text-primary sm:mt-2 sm:text-display-sm">
            {currentStepData.title}
          </h1>
          <p className="mt-1 text-sm text-tertiary sm:mt-2 sm:text-base">
            {currentStepData.description}
          </p>
        </div>

        {/* Step Content - Scrollable */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
          {renderStepContent()}
        </div>

        {/* Navigation Footer - Fixed at bottom */}
        <div className="shrink-0 border-t border-secondary bg-primary px-4 py-4 sm:px-8 sm:py-6 lg:px-12">
          <div className="flex justify-between">
            {currentStep > 1 ? (
              <Button
                color="secondary"
                size="lg"
                onClick={handleBack}
              >
                Back
              </Button>
            ) : (
              <div />
            )}
            
            <Button
              color="primary"
              size="lg"
              onClick={handleNext}
            >
              {currentStep === stepDefinitions.length ? "See Results" : "Save and continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
