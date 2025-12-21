"use client";

import { useState } from "react";
import { Play, TickCircle } from "iconsax-react";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { BackgroundPattern } from "@/components/shared-assets/background-patterns";

interface ResumeAgentModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  systemName: string;
  pausedAt?: string;
  pausedBy?: string;
  pauseReason?: string;
  onConfirm: (resumeReason: string) => void;
}

export const ResumeAgentModal = ({
  isOpen,
  onOpenChange,
  systemName,
  pausedAt = "December 16, 2025 at 14:30:00",
  pausedBy = "john.smith@company.com",
  pauseReason = "Detected unexpected behavior in customer refund processing.",
  onConfirm,
}: ResumeAgentModalProps) => {
  const [resumeReason, setResumeReason] = useState("");
  const [checklist, setChecklist] = useState({
    rootCause: false,
    corrective: false,
    stakeholders: false,
  });

  const allChecked = checklist.rootCause && checklist.corrective && checklist.stakeholders;
  const canResume = allChecked && resumeReason.trim().length > 0;

  const handleClose = () => {
    setResumeReason("");
    setChecklist({ rootCause: false, corrective: false, stakeholders: false });
    onOpenChange(false);
  };

  const handleConfirm = () => {
    if (!canResume) return;
    onConfirm(resumeReason);
    handleClose();
  };

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-[520px]">
              <CloseButton 
                onClick={handleClose} 
                theme="light" 
                size="lg" 
                className="absolute top-3 right-3 z-20" 
              />
              <div className="flex flex-col gap-5 px-6 pt-6">
                <div className="relative w-max">
                  <FeaturedIcon 
                    color="success" 
                    size="lg" 
                    theme="light" 
                    icon={({ className }) => <Play className={className} color="currentColor" variant="Bold" />} 
                  />
                  <BackgroundPattern 
                    pattern="circle" 
                    size="sm" 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                  />
                </div>
                
                <div className="z-10 flex flex-col gap-4">
                  <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                    Resume Agent
                  </AriaHeading>

                  {/* Pause Details */}
                  <div className="rounded-lg border border-secondary bg-secondary_subtle p-4">
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-tertiary">Agent:</span>
                        <span className="font-medium text-primary">{systemName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-tertiary">Paused since:</span>
                        <span className="text-secondary">{pausedAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-tertiary">Paused by:</span>
                        <span className="text-secondary">{pausedBy}</span>
                      </div>
                      <div className="flex flex-col gap-1 pt-2 border-t border-secondary mt-2">
                        <span className="text-tertiary">Reason:</span>
                        <span className="text-secondary italic">"{pauseReason}"</span>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Checklist */}
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium text-primary">Before resuming, confirm:</p>
                    
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.rootCause}
                        onChange={(e) => setChecklist({ ...checklist, rootCause: e.target.checked })}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm text-secondary">Root cause has been identified</span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.corrective}
                        onChange={(e) => setChecklist({ ...checklist, corrective: e.target.checked })}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm text-secondary">Corrective measures have been implemented</span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checklist.stakeholders}
                        onChange={(e) => setChecklist({ ...checklist, stakeholders: e.target.checked })}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm text-secondary">Relevant stakeholders have been notified</span>
                    </label>
                  </div>

                  {/* Resume Reason */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-primary">Resume Reason *</label>
                    <textarea
                      value={resumeReason}
                      onChange={(e) => setResumeReason(e.target.value)}
                      placeholder="Describe what was fixed and why it's safe to resume..."
                      rows={3}
                      className="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary placeholder:text-quaternary focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100 resize-none"
                    />
                  </div>

                  {/* Validation Message */}
                  {!canResume && (
                    <p className="text-xs text-tertiary">
                      ⚠️ Please check all confirmations and provide a resume reason to continue.
                    </p>
                  )}
                </div>
              </div>
              
              <div className="z-10 flex flex-col-reverse gap-3 p-6 pt-6 sm:flex-row sm:justify-end">
                <Button 
                  color="secondary" 
                  size="lg" 
                  onClick={handleClose}
                  className="sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  size="lg" 
                  onClick={handleConfirm}
                  isDisabled={!canResume}
                  iconLeading={({ className }) => <Play size={18} color="currentColor" className={className} />}
                  className="sm:w-auto"
                >
                  Resume Agent
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};

export default ResumeAgentModal;
