"use client";

import { useState } from "react";
import { Danger } from "iconsax-react";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { BackgroundPattern } from "@/components/shared-assets/background-patterns";

interface EmergencyStopModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  systemName: string;
  activeSessions?: number;
  onConfirm: (reason: string, notifications: { security: boolean; cto: boolean; regulator: boolean }) => void;
}

export const EmergencyStopModal = ({
  isOpen,
  onOpenChange,
  systemName,
  activeSessions = 3,
  onConfirm,
}: EmergencyStopModalProps) => {
  const [reason, setReason] = useState("");
  const [notifications, setNotifications] = useState({
    security: true,
    cto: true,
    regulator: false,
  });

  const canSubmit = reason.trim().length > 0;

  const handleCancel = () => {
    setReason("");
    setNotifications({ security: true, cto: true, regulator: false });
    onOpenChange(false);
  };

  const handleConfirm = () => {
    if (!canSubmit) return;
    onConfirm(reason, notifications);
    handleCancel();
  };

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
              <CloseButton 
                onClick={handleCancel} 
                theme="light" 
                size="lg" 
                className="absolute top-3 right-3 z-20" 
              />
              <div className="flex flex-col gap-5 px-6 pt-6">
                <div className="relative w-max">
                  <FeaturedIcon 
                    color="error" 
                    size="lg" 
                    theme="light" 
                    icon={({ className }) => <Danger className={className} color="currentColor" variant="Bold" />} 
                  />
                  <BackgroundPattern 
                    pattern="circle" 
                    size="sm" 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                  />
                </div>
                
                <div className="z-10 flex flex-col gap-4">
                  <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                    🛑 Emergency Stop
                  </AriaHeading>
                  
                  <div className="rounded-lg border border-error-200 bg-error-50 p-4">
                    <p className="text-sm font-medium text-error-700 mb-1">⚠️ WARNING: This will immediately stop all agent operations</p>
                    <p className="text-sm text-error-600">
                      Active sessions that will be terminated: <strong>{activeSessions}</strong>
                    </p>
                  </div>

                  <div className="rounded-lg border border-secondary bg-secondary_subtle p-4">
                    <p className="text-sm font-medium text-primary mb-2">This action will:</p>
                    <ul className="space-y-1.5 text-sm text-secondary">
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                        <span>Terminate all active agent sessions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                        <span>Reject incoming requests to this agent</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                        <span>Set agent status to "Paused"</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                        <span>Log this action in the audit trail</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                        <span>Notify all configured contacts</span>
                      </li>
                    </ul>
                  </div>

                  {/* Reason Field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-primary">Reason for Emergency Stop *</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Describe the unexpected behavior or security concern..."
                      rows={3}
                      className="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary placeholder:text-quaternary focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100 resize-none"
                    />
                  </div>

                  {/* Additional Notifications */}
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium text-primary">Notify (in addition to default contacts):</p>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.security}
                        onChange={(e) => setNotifications({ ...notifications, security: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm text-secondary">security@company.com</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.cto}
                        onChange={(e) => setNotifications({ ...notifications, cto: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm text-secondary">cto@company.com</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.regulator}
                        onChange={(e) => setNotifications({ ...notifications, regulator: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-sm text-secondary">External - regulator notification</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="z-10 flex flex-col-reverse gap-3 p-6 pt-6 sm:flex-row sm:justify-end">
                <Button 
                  color="secondary" 
                  size="lg" 
                  onClick={handleCancel}
                  className="sm:w-auto"
                >
                  Cancel
                </Button>
                <Button 
                  color="primary-destructive" 
                  size="lg" 
                  onClick={handleConfirm}
                  isDisabled={!canSubmit}
                  className="sm:w-auto whitespace-nowrap"
                >
                  🛑 Confirm Emergency Stop
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};

export default EmergencyStopModal;
