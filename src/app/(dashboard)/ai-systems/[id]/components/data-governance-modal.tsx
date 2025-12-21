"use client";

import { useState } from "react";
import {
  DialogTrigger as AriaDialogTrigger,
  Heading as AriaHeading,
} from "react-aria-components";
import { TickCircle, CloseCircle, DocumentText, Data } from "iconsax-react";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Button } from "@/components/base/buttons/button";
import { useToast } from "@/components/base/toast/toast";

interface DataGovernanceModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  systemName: string;
}

interface ChecklistSection {
  id: string;
  title: string;
  description: string;
  items: {
    id: string;
    label: string;
    completed: boolean;
    notes?: string;
  }[];
}

const initialChecklist: ChecklistSection[] = [
  {
    id: "data_quality",
    title: "1. Data Quality & Relevance",
    description: "Ensure training and input data meets quality standards (Article 10)",
    items: [
      { id: "dq1", label: "Training data is relevant to the intended purpose", completed: false },
      { id: "dq2", label: "Data is sufficiently representative of the target population", completed: false },
      { id: "dq3", label: "Data has been checked for errors, gaps, and inconsistencies", completed: false },
      { id: "dq4", label: "Data sources are documented and traceable", completed: false },
      { id: "dq5", label: "Data freshness and update frequency is appropriate", completed: false },
    ],
  },
  {
    id: "bias_fairness",
    title: "2. Bias & Fairness",
    description: "Address potential biases in data and model outputs",
    items: [
      { id: "bf1", label: "Data has been analyzed for demographic biases", completed: false },
      { id: "bf2", label: "Underrepresented groups have been identified and addressed", completed: false },
      { id: "bf3", label: "Bias testing procedures are documented", completed: false },
      { id: "bf4", label: "Fairness metrics have been defined and measured", completed: false },
      { id: "bf5", label: "Mitigation strategies for identified biases are in place", completed: false },
    ],
  },
  {
    id: "privacy_protection",
    title: "3. Privacy & Data Protection",
    description: "Ensure compliance with GDPR and data protection requirements",
    items: [
      { id: "pp1", label: "Legal basis for data processing is documented", completed: false },
      { id: "pp2", label: "Data minimization principles are applied", completed: false },
      { id: "pp3", label: "Personal data is properly anonymized/pseudonymized where required", completed: false },
      { id: "pp4", label: "Data retention periods are defined and enforced", completed: false },
      { id: "pp5", label: "Data subject rights procedures are in place", completed: false },
      { id: "pp6", label: "Data Processing Impact Assessment (DPIA) completed if required", completed: false },
    ],
  },
  {
    id: "data_security",
    title: "4. Data Security",
    description: "Implement appropriate security measures for data handling",
    items: [
      { id: "ds1", label: "Data encryption at rest and in transit is implemented", completed: false },
      { id: "ds2", label: "Access controls and authentication are in place", completed: false },
      { id: "ds3", label: "Audit logging for data access is enabled", completed: false },
      { id: "ds4", label: "Data breach response procedures are documented", completed: false },
      { id: "ds5", label: "Regular security assessments are conducted", completed: false },
    ],
  },
  {
    id: "data_lifecycle",
    title: "5. Data Lifecycle Management",
    description: "Manage data throughout its lifecycle",
    items: [
      { id: "dl1", label: "Data collection procedures are documented", completed: false },
      { id: "dl2", label: "Data storage locations and jurisdictions are documented", completed: false },
      { id: "dl3", label: "Data sharing agreements are in place where applicable", completed: false },
      { id: "dl4", label: "Data deletion/archival procedures are defined", completed: false },
      { id: "dl5", label: "Data lineage and provenance is tracked", completed: false },
    ],
  },
];

export const DataGovernanceModal = ({ isOpen, onOpenChange, systemName }: DataGovernanceModalProps) => {
  const { addToast } = useToast();
  const [checklist, setChecklist] = useState<ChecklistSection[]>(initialChecklist);
  const [isGenerating, setIsGenerating] = useState(false);

  const totalItems = checklist.reduce((acc, s) => acc + s.items.length, 0);
  const completedItems = checklist.reduce(
    (acc, s) => acc + s.items.filter((item) => item.completed).length,
    0
  );
  const progress = Math.round((completedItems / totalItems) * 100);

  const toggleItem = (sectionId: string, itemId: string) => {
    setChecklist((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            }
          : section
      )
    );
  };

  const handleGenerateDocument = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      addToast({
        title: "Data Governance Report Generated",
        message: "Your Data Governance compliance report has been created and added to Documents.",
        type: "success",
      });
      onOpenChange(false);
    }, 2000);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-3xl">
              <CloseButton
                onClick={handleClose}
                theme="light"
                size="lg"
                className="absolute top-4 right-4 z-20"
              />

              {/* Header */}
              <div className="border-b border-secondary px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <Data size={20} className="text-purple-600" color="currentColor" variant="Bold" />
                  </div>
                  <div>
                    <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                      Data Governance Checklist
                    </AriaHeading>
                    <p className="text-sm text-tertiary">{systemName} • Article 10 Compliance</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="border-b border-secondary px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-secondary">Checklist Progress</span>
                  <span className="text-sm font-medium text-primary">{progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-purple-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-tertiary">
                  {completedItems} of {totalItems} items completed
                </p>
              </div>

              {/* Content */}
              <div className="max-h-[50vh] overflow-y-auto px-6 py-4">
                <div className="space-y-6">
                  {checklist.map((section) => {
                    const sectionCompleted = section.items.filter((i) => i.completed).length;
                    const sectionTotal = section.items.length;
                    
                    return (
                      <div key={section.id} className="rounded-lg border border-secondary p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-primary">{section.title}</h4>
                          <span className="text-xs text-tertiary">
                            {sectionCompleted}/{sectionTotal}
                          </span>
                        </div>
                        <p className="text-sm text-tertiary mb-3">{section.description}</p>
                        <div className="space-y-2">
                          {section.items.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => toggleItem(section.id, item.id)}
                              className="flex w-full items-start gap-3 rounded-lg p-2 text-left hover:bg-secondary transition"
                            >
                              {item.completed ? (
                                <TickCircle
                                  size={20}
                                  className="text-success-500 shrink-0 mt-0.5"
                                  color="currentColor"
                                  variant="Bold"
                                />
                              ) : (
                                <CloseCircle
                                  size={20}
                                  className="text-gray-300 shrink-0 mt-0.5"
                                  color="currentColor"
                                />
                              )}
                              <span className="text-sm text-secondary">{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-secondary px-6 py-4 flex justify-between">
                <Button size="md" color="secondary" onClick={handleClose}>
                  Save & Close
                </Button>
                <Button
                  size="md"
                  color="primary"
                  disabled={progress < 100 || isGenerating}
                  isLoading={isGenerating}
                  iconLeading={({ className }) => (
                    <DocumentText size={18} color="currentColor" className={className} />
                  )}
                  onClick={handleGenerateDocument}
                >
                  Generate Report
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};

export default DataGovernanceModal;
