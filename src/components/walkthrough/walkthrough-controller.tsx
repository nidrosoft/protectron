"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useWalkthrough } from "@/contexts/walkthrough-context";
import { WALKTHROUGH_STEPS, getStepByNumber } from "@/lib/walkthrough/steps";
import { Spotlight } from "./spotlight";
import { WalkthroughTooltip } from "./walkthrough-tooltip";
import { WelcomeModal } from "./welcome-modal";
import { ResumeModal } from "./resume-modal";
import { CompletionModal } from "./completion-modal";
import { ProgressIndicator } from "./progress-indicator";

export function WalkthroughController() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isActive,
    status,
    currentStep,
    totalSteps,
    stepsCompleted,
    assessmentContext,
    showWelcomeModal,
    showResumeModal,
    startWalkthrough,
    nextStep,
    previousStep,
    skipWalkthrough,
    completeWalkthrough,
    resetWalkthrough,
    dismissWelcomeModal,
    dismissResumeModal,
  } = useWalkthrough();

  const [showCompletion, setShowCompletion] = useState(false);

  const currentStepData = getStepByNumber(currentStep);

  // Handle navigation for steps that require specific pages
  useEffect(() => {
    if (!isActive || !currentStepData) return;

    const targetPage = currentStepData.targetPage;
    if (targetPage && pathname !== targetPage) {
      router.push(targetPage);
    }
  }, [isActive, currentStep, currentStepData, pathname, router]);

  // Handle completion
  useEffect(() => {
    if (currentStep === totalSteps - 1 && isActive) {
      setShowCompletion(true);
    }
  }, [currentStep, totalSteps, isActive]);

  const handleNext = () => {
    if (currentStep === totalSteps - 2) {
      // About to go to completion step
      nextStep();
    } else {
      nextStep();
    }
  };

  const handleSkip = () => {
    skipWalkthrough();
    dismissWelcomeModal();
    dismissResumeModal();
  };

  const handleCompletionClose = () => {
    setShowCompletion(false);
    completeWalkthrough();
  };

  const handleResumeStartOver = () => {
    resetWalkthrough();
    dismissResumeModal();
  };

  const handleResumeContinue = () => {
    dismissResumeModal();
    // The walkthrough will continue from current step
  };

  // Render welcome modal
  if (showWelcomeModal) {
    return (
      <WelcomeModal
        isOpen={showWelcomeModal}
        assessmentContext={assessmentContext}
        onStart={startWalkthrough}
        onSkip={handleSkip}
      />
    );
  }

  // Render resume modal
  if (showResumeModal) {
    return (
      <ResumeModal
        isOpen={showResumeModal}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onContinue={handleResumeContinue}
        onStartOver={handleResumeStartOver}
        onSkip={handleSkip}
      />
    );
  }

  // Render completion modal
  if (showCompletion) {
    return (
      <CompletionModal
        isOpen={showCompletion}
        assessmentContext={assessmentContext}
        onClose={handleCompletionClose}
      />
    );
  }

  // Don't render anything if walkthrough is not active
  if (!isActive || !currentStepData || currentStep === 0) {
    return null;
  }

  return (
    <>
      {/* Spotlight overlay */}
      <Spotlight
        targetSelector={currentStepData.targetSelector}
        isActive={isActive}
      />

      {/* Tooltip */}
      <WalkthroughTooltip
        step={currentStepData}
        currentStepNumber={currentStep}
        totalSteps={totalSteps}
        targetSelector={currentStepData.targetSelector}
        onNext={handleNext}
        onPrevious={previousStep}
        onSkip={handleSkip}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === totalSteps - 2}
      />

      {/* Progress indicator */}
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepTitle={currentStepData.title}
      />
    </>
  );
}
