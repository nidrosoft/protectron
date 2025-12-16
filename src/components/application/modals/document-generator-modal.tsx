"use client";

import { useState } from "react";
import type { Key } from "react-aria-components";
import {
  DocumentText1,
  ClipboardText,
  Note,
  Document,
  ArrowLeft,
  ArrowRight,
  TickCircle,
  Cpu,
} from "iconsax-react";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Select, type SelectItemType } from "@/components/base/select/select";
import { cx } from "@/utils/cx";

type DocumentType = "technical" | "risk" | "policy" | "model_card";

interface DocumentGeneratorModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onGenerate?: (data: {
    type: DocumentType;
    systemId: string;
    answers: Record<string, string>;
  }) => void;
  preselectedType?: DocumentType;
}

const documentTypes = [
  {
    id: "technical" as const,
    name: "Technical Documentation",
    description: "Comprehensive technical documentation required for high-risk AI systems under Article 11 of the EU AI Act. This document covers system architecture, data processing, algorithms, and performance metrics. Essential for demonstrating compliance to regulators and auditors.",
    icon: DocumentText1,
    color: "brand",
    bgColor: "bg-brand-100",
    textColor: "text-brand-600",
  },
  {
    id: "risk" as const,
    name: "Risk Assessment Report",
    description: "A detailed analysis identifying and evaluating potential risks associated with your AI system. Covers foreseeable misuse, bias risks, and safety concerns with proposed mitigation strategies. Required for high-risk systems and recommended for all AI deployments.",
    icon: ClipboardText,
    color: "warning",
    bgColor: "bg-warning-100",
    textColor: "text-warning-600",
  },
  {
    id: "policy" as const,
    name: "Data Governance Policy",
    description: "Documents your organization's approach to data quality, collection, and bias mitigation. Outlines procedures for ensuring training data is representative, accurate, and ethically sourced. Critical for demonstrating responsible AI development practices.",
    icon: Note,
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
  },
  {
    id: "model_card" as const,
    name: "Model Card",
    description: "A transparency document that describes your AI model's intended use, capabilities, and limitations. Includes performance benchmarks, ethical considerations, and deployment recommendations. Helps users understand what the model can and cannot do.",
    icon: Document,
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
  },
];

// Mock AI Systems for selection
const aiSystemOptions: SelectItemType[] = [
  { id: "system-01", label: "Customer Support Chatbot" },
  { id: "system-02", label: "Automated Hiring Screener" },
  { id: "system-03", label: "Fraud Detection System" },
  { id: "system-04", label: "Content Recommender" },
  { id: "system-05", label: "Lead Scoring Model" },
];

// Questions per document type
const questionsByType: Record<DocumentType, { id: string; label: string; placeholder: string }[]> = {
  technical: [
    { id: "purpose", label: "Describe the AI system's intended purpose", placeholder: "This AI system is designed to..." },
    { id: "data", label: "What data does the system process?", placeholder: "The system processes..." },
    { id: "decisions", label: "How are outputs used in decision-making?", placeholder: "The outputs are used to..." },
    { id: "users", label: "Who are the intended users of this system?", placeholder: "The intended users are..." },
  ],
  risk: [
    { id: "risks", label: "What are the known risks of this AI system?", placeholder: "The known risks include..." },
    { id: "mitigation", label: "What risk mitigation measures are in place?", placeholder: "We have implemented..." },
    { id: "monitoring", label: "How do you monitor for new risks?", placeholder: "We monitor risks by..." },
  ],
  policy: [
    { id: "data_sources", label: "What are your data sources?", placeholder: "Our data comes from..." },
    { id: "quality", label: "How do you ensure data quality?", placeholder: "We ensure quality by..." },
    { id: "bias", label: "What bias mitigation measures are in place?", placeholder: "We mitigate bias by..." },
  ],
  model_card: [
    { id: "capabilities", label: "What are the model's capabilities?", placeholder: "The model can..." },
    { id: "limitations", label: "What are the model's limitations?", placeholder: "The model cannot..." },
    { id: "performance", label: "How does the model perform?", placeholder: "The model achieves..." },
  ],
};

export const DocumentGeneratorModal = ({
  isOpen,
  onOpenChange,
  onGenerate,
  preselectedType,
}: DocumentGeneratorModalProps) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<DocumentType | null>(preselectedType || null);
  const [selectedSystem, setSelectedSystem] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleClose = () => {
    setStep(1);
    setSelectedType(preselectedType || null);
    setSelectedSystem("");
    setAnswers({});
    setIsGenerating(false);
    setIsGenerated(false);
    onOpenChange(false);
  };

  const handleNext = () => {
    if (step === 1 && selectedType) {
      setStep(2);
    } else if (step === 2) {
      setIsGenerating(true);
      // Simulate generation
      setTimeout(() => {
        setIsGenerating(false);
        setIsGenerated(true);
        setStep(3);
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setIsGenerated(false);
      setStep(2);
    }
  };

  const handleSave = () => {
    if (selectedType && selectedSystem) {
      onGenerate?.({
        type: selectedType,
        systemId: selectedSystem,
        answers,
      });
    }
    handleClose();
  };

  const currentQuestions = selectedType ? questionsByType[selectedType] : [];
  const selectedTypeConfig = documentTypes.find((t) => t.id === selectedType);

  const canProceedStep1 = selectedType !== null;
  const canProceedStep2 = selectedSystem !== "" && currentQuestions.every((q) => answers[q.id]?.trim());

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-5xl">
              <CloseButton
                onClick={handleClose}
                theme="light"
                size="lg"
                className="absolute top-4 right-4 z-20"
              />

              {/* Header */}
              <div className="border-b border-secondary px-6 py-5">
                <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                  Generate Document
                </AriaHeading>
                <p className="mt-1 text-sm text-tertiary">
                  Step {step} of 3: {step === 1 ? "Select Document Type" : step === 2 ? "Provide Details" : "Review & Save"}
                </p>
                
                {/* Progress indicator */}
                <div className="mt-4 flex gap-2">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={cx(
                        "h-1.5 flex-1 rounded-full transition-colors",
                        s <= step ? "bg-brand-500" : "bg-quaternary"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="min-h-[400px] max-h-[70vh] overflow-y-auto px-8 py-8">
                {/* Step 1: Select Document Type */}
                {step === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {documentTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedType === type.id;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={cx(
                            "flex flex-col items-start rounded-xl p-6 text-left transition-all ring-1 ring-inset min-h-[180px]",
                            isSelected
                              ? "bg-brand-50 ring-2 ring-brand-500"
                              : "bg-primary ring-secondary hover:bg-secondary_subtle"
                          )}
                        >
                          <div className={cx("flex h-12 w-12 items-center justify-center rounded-lg", type.bgColor)}>
                            <Icon size={24} className={type.textColor} color="currentColor" variant="Bold" />
                          </div>
                          <h4 className="mt-4 text-md font-semibold text-primary">{type.name}</h4>
                          <p className="mt-2 text-sm text-tertiary leading-relaxed">{type.description}</p>
                          {isSelected && (
                            <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand-600">
                              <TickCircle size={16} color="currentColor" variant="Bold" />
                              Selected
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Step 2: Provide Details */}
                {step === 2 && selectedType && (
                  <div className="flex flex-col gap-6">
                    {/* AI System Selection */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-primary">
                        Select AI System <span className="text-error-500">*</span>
                      </label>
                      <Select
                        selectedKey={selectedSystem}
                        onSelectionChange={(key) => key && setSelectedSystem(String(key))}
                        items={aiSystemOptions}
                        size="md"
                        placeholder="Choose an AI system..."
                        placeholderIcon={Cpu}
                      >
                        {(item) => (
                          <Select.Item key={item.id} id={item.id} textValue={item.label}>
                            {item.label}
                          </Select.Item>
                        )}
                      </Select>
                    </div>

                    {/* Dynamic Questions */}
                    {currentQuestions.map((question) => (
                      <div key={question.id}>
                        <label className="mb-1.5 block text-sm font-medium text-primary">
                          {question.label} <span className="text-error-500">*</span>
                        </label>
                        <textarea
                          value={answers[question.id] || ""}
                          onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                          placeholder={question.placeholder}
                          rows={3}
                          className="w-full rounded-lg border border-secondary bg-primary px-3.5 py-2.5 text-sm text-primary placeholder:text-quaternary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 3: Review & Save */}
                {step === 3 && isGenerated && selectedTypeConfig && (
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 rounded-lg bg-success-50 p-4">
                      <TickCircle size={24} className="text-success-600" color="currentColor" variant="Bold" />
                      <div>
                        <p className="text-sm font-semibold text-success-700">Document generated successfully!</p>
                        <p className="text-sm text-success-600">Your {selectedTypeConfig.name.toLowerCase()} is ready to review.</p>
                      </div>
                    </div>

                    {/* Document Preview */}
                    <div className="rounded-xl border border-secondary bg-secondary_subtle p-6">
                      <div className="flex items-start gap-4">
                        <div className={cx("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg", selectedTypeConfig.bgColor)}>
                          <selectedTypeConfig.icon size={24} className={selectedTypeConfig.textColor} color="currentColor" variant="Bold" />
                        </div>
                        <div>
                          <h4 className="text-md font-semibold text-primary">{selectedTypeConfig.name}</h4>
                          <p className="mt-1 text-sm text-tertiary">
                            {aiSystemOptions.find((s) => s.id === selectedSystem)?.label}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 rounded-lg bg-primary p-4 ring-1 ring-secondary ring-inset">
                        <h5 className="text-sm font-semibold text-primary uppercase tracking-wide">
                          {selectedTypeConfig.name}
                        </h5>
                        <div className="mt-4 space-y-4 text-sm text-secondary">
                          <div>
                            <p className="font-medium text-primary">1. General Description</p>
                            <p className="mt-1 text-tertiary">
                              {answers.purpose || answers.risks || answers.data_sources || answers.capabilities || "Document content will appear here..."}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-primary">2. Technical Details</p>
                            <p className="mt-1 text-tertiary">
                              {answers.data || answers.mitigation || answers.quality || answers.limitations || "Additional details..."}
                            </p>
                          </div>
                          <p className="text-xs text-quaternary italic">[Document continues... click "Edit in Full Editor" to see more]</p>
                        </div>
                      </div>

                      <Button size="sm" color="secondary" className="mt-4">
                        Edit in Full Editor
                      </Button>
                    </div>

                    {/* Document name */}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-primary">Document Name</label>
                      <input
                        type="text"
                        defaultValue={`${selectedType}_${selectedSystem.replace("system-", "")}_${new Date().toISOString().split("T")[0]}.pdf`}
                        className="w-full rounded-lg border border-secondary bg-primary px-3.5 py-2.5 text-sm text-primary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </div>
                  </div>
                )}

                {/* Generating State */}
                {step === 2 && isGenerating && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
                    <p className="mt-4 text-sm font-medium text-primary">Generating your document...</p>
                    <p className="mt-1 text-sm text-tertiary">This may take a few moments</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-secondary px-6 py-4">
                <div>
                  {step > 1 && !isGenerating && (
                    <Button
                      size="md"
                      color="secondary"
                      iconLeading={ArrowLeft}
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button size="md" color="secondary" onClick={handleClose}>
                    Cancel
                  </Button>
                  {step === 1 && (
                    <Button
                      size="md"
                      iconTrailing={ArrowRight}
                      onClick={handleNext}
                      isDisabled={!canProceedStep1}
                    >
                      Next: Provide Details
                    </Button>
                  )}
                  {step === 2 && !isGenerating && (
                    <Button
                      size="md"
                      onClick={handleNext}
                      isDisabled={!canProceedStep2}
                    >
                      Generate Document
                    </Button>
                  )}
                  {step === 3 && (
                    <div className="flex gap-3">
                      <Button size="md" color="secondary" onClick={() => { setIsGenerated(false); handleNext(); }}>
                        Regenerate
                      </Button>
                      <Button size="md" onClick={handleSave}>
                        Save to Documents
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};
