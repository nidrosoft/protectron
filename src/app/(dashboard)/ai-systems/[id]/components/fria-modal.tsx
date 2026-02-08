"use client";

import { useState } from "react";
import {
  DialogTrigger as AriaDialogTrigger,
  Heading as AriaHeading,
} from "react-aria-components";
import { TickCircle, CloseCircle, DocumentText, Warning2 } from "iconsax-react";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import { useToast } from "@/components/base/toast/toast";

interface FRIAModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  systemId: string;
  systemName: string;
  riskLevel: "high" | "limited" | "minimal";
}

interface FRIASection {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    question: string;
    completed: boolean;
    response?: string;
  }[];
}

const initialFRIASections: FRIASection[] = [
  {
    id: "applicability",
    title: "1. Applicability Assessment",
    description: "Determine if FRIA is required for your organization",
    questions: [
      { id: "q1", question: "Is your organization a public body or authority?", completed: false },
      { id: "q2", question: "Does your organization provide public services (healthcare, education, utilities)?", completed: false },
      { id: "q3", question: "Is the AI system used for creditworthiness assessment in banking/insurance?", completed: false },
      { id: "q4", question: "Is the AI system used in life or health insurance risk assessment?", completed: false },
      { id: "q5", question: "Is the AI system used in HR, recruitment, or employment decisions?", completed: false },
    ],
  },
  {
    id: "rights_impact",
    title: "2. Fundamental Rights Impact",
    description: "Assess potential impacts on fundamental rights",
    questions: [
      { id: "q6", question: "Could the AI system affect individuals' right to non-discrimination?", completed: false },
      { id: "q7", question: "Could the AI system impact privacy and data protection rights?", completed: false },
      { id: "q8", question: "Could the AI system affect freedom of expression or information?", completed: false },
      { id: "q9", question: "Could the AI system impact human dignity?", completed: false },
      { id: "q10", question: "Could the AI system affect access to essential services?", completed: false },
    ],
  },
  {
    id: "risk_categories",
    title: "3. Risk Categories",
    description: "Identify specific risk categories applicable to your use case",
    questions: [
      { id: "q11", question: "Have you identified all groups potentially affected by the AI system?", completed: false },
      { id: "q12", question: "Have you assessed risks of bias or discrimination in AI outputs?", completed: false },
      { id: "q13", question: "Have you evaluated transparency and explainability of AI decisions?", completed: false },
      { id: "q14", question: "Have you considered risks of over-reliance on AI recommendations?", completed: false },
    ],
  },
  {
    id: "mitigations",
    title: "4. Mitigation Measures",
    description: "Document measures to address identified risks",
    questions: [
      { id: "q15", question: "Have you implemented bias testing and monitoring procedures?", completed: false },
      { id: "q16", question: "Have you established human oversight mechanisms?", completed: false },
      { id: "q17", question: "Have you created appeal/redress procedures for affected individuals?", completed: false },
      { id: "q18", question: "Have you documented transparency measures for AI-assisted decisions?", completed: false },
    ],
  },
  {
    id: "stakeholders",
    title: "5. Stakeholder Consultation",
    description: "Track consultations with relevant stakeholders",
    questions: [
      { id: "q19", question: "Have you consulted with data protection officers?", completed: false },
      { id: "q20", question: "Have you engaged with representatives of affected groups?", completed: false },
      { id: "q21", question: "Have you consulted with legal/compliance teams?", completed: false },
      { id: "q22", question: "Have you documented all stakeholder feedback and responses?", completed: false },
    ],
  },
];

export const FRIAModal = ({ isOpen, onOpenChange, systemId, systemName, riskLevel }: FRIAModalProps) => {
  const { addToast } = useToast();
  const [sections, setSections] = useState<FRIASection[]>(initialFRIASections);
  const [isGenerating, setIsGenerating] = useState(false);

  const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0);
  const completedQuestions = sections.reduce(
    (acc, s) => acc + s.questions.filter((q) => q.completed).length,
    0
  );
  const progress = Math.round((completedQuestions / totalQuestions) * 100);

  const toggleQuestion = (sectionId: string, questionId: string) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              questions: section.questions.map((q) =>
                q.id === questionId ? { ...q, completed: !q.completed } : q
              ),
            }
          : section
      )
    );
  };

  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    
    try {
      // Build the FRIA answers from completed questions
      const completedItems = sections.flatMap(s => 
        s.questions.filter(q => q.completed).map(q => `${s.title}: ${q.question}`)
      );
      
      const friaAnswers = {
        knownRisks: `The following fundamental rights impact areas have been assessed as applicable: ${completedItems.join('; ')}`,
        mitigationMeasures: sections.find(s => s.id === 'mitigations')?.questions
          .filter(q => q.completed)
          .map(q => q.question)
          .join('; ') || 'No mitigation measures documented yet.',
        riskMonitoring: sections.find(s => s.id === 'stakeholders')?.questions
          .filter(q => q.completed)
          .map(q => q.question)
          .join('; ') || 'No stakeholder consultations documented yet.',
      };

      // Call the document generation API
      const response = await fetch('/api/v1/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: 'risk',
          systemId: systemId,
          answers: friaAnswers,
          documentName: `FRIA - ${systemName}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate document');
      }

      addToast({
        title: "FRIA Document Generated",
        message: "Your Fundamental Rights Impact Assessment document has been created and added to Documents.",
        type: "success",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error generating FRIA document:', error);
      addToast({
        title: "Generation Failed",
        message: error instanceof Error ? error.message : "Failed to generate FRIA document. Please try again.",
        type: "error",
      });
    } finally {
      setIsGenerating(false);
    }
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-100">
                    <Warning2 size={20} className="text-warning-600" color="currentColor" variant="Bold" />
                  </div>
                  <div>
                    <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                      Fundamental Rights Impact Assessment
                    </AriaHeading>
                    <p className="text-sm text-tertiary">{systemName}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="border-b border-secondary px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-secondary">Assessment Progress</span>
                  <span className="text-sm font-medium text-primary">{progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-brand-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-tertiary">
                  {completedQuestions} of {totalQuestions} items completed
                </p>
              </div>

              {/* Content */}
              <div className="max-h-[50vh] overflow-y-auto px-6 py-4">
                {riskLevel !== "high" && (
                  <div className="mb-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <p className="text-sm text-blue-700">
                      <strong>Note:</strong> FRIA is typically required for high-risk AI systems. Your system is classified as{" "}
                      <Badge color={riskLevel === "limited" ? "warning" : "success"} size="sm">
                        {riskLevel}
                      </Badge>
                      . You may still complete this assessment for best practices.
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                  {sections.map((section) => (
                    <div key={section.id} className="rounded-lg border border-secondary p-4">
                      <h4 className="font-semibold text-primary">{section.title}</h4>
                      <p className="text-sm text-tertiary mb-3">{section.description}</p>
                      <div className="space-y-2">
                        {section.questions.map((question) => (
                          <button
                            key={question.id}
                            onClick={() => toggleQuestion(section.id, question.id)}
                            className="flex w-full items-start gap-3 rounded-lg p-2 text-left hover:bg-secondary transition"
                          >
                            {question.completed ? (
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
                            <span className="text-sm text-secondary">{question.question}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
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
                  disabled={completedQuestions === 0 || isGenerating}
                  isLoading={isGenerating}
                  iconLeading={({ className }) => (
                    <DocumentText size={18} color="currentColor" className={className} />
                  )}
                  onClick={handleGenerateDocument}
                >
                  Generate FRIA Document
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};

export default FRIAModal;
