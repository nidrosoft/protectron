"use client";

import type { FC } from "react";
import { Trash01, AlertCircle, CheckCircle } from "@untitledui/icons";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { BackgroundPattern } from "@/components/shared-assets/background-patterns";

export type ConfirmationModalVariant = "destructive" | "warning" | "success";

interface ConfirmationModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when the modal open state changes */
  onOpenChange: (isOpen: boolean) => void;
  /** The title of the modal */
  title: string;
  /** The description/message of the modal */
  description: string;
  /** The variant/type of confirmation (affects colors and default icon) */
  variant?: ConfirmationModalVariant;
  /** Custom icon to display (overrides variant default) */
  icon?: FC<{ className?: string }>;
  /** Text for the confirm button */
  confirmText?: string;
  /** Text for the cancel button */
  cancelText?: string;
  /** Callback when confirm is clicked */
  onConfirm?: () => void;
  /** Callback when cancel is clicked */
  onCancel?: () => void;
  /** Whether the confirm action is loading */
  isLoading?: boolean;
}

const variantConfig = {
  destructive: {
    color: "error" as const,
    buttonColor: "primary-destructive" as const,
    defaultIcon: Trash01,
  },
  warning: {
    color: "warning" as const,
    buttonColor: "primary" as const,
    defaultIcon: AlertCircle,
  },
  success: {
    color: "success" as const,
    buttonColor: "primary" as const,
    defaultIcon: CheckCircle,
  },
};

export const ConfirmationModal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  variant = "destructive",
  icon,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmationModalProps) => {
  const config = variantConfig[variant];
  const IconComponent = icon || config.defaultIcon;

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-100">
              <CloseButton 
                onClick={handleCancel} 
                theme="light" 
                size="lg" 
                className="absolute top-3 right-3 z-20" 
              />
              <div className="flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6">
                <div className="relative w-max">
                  <FeaturedIcon 
                    color={config.color} 
                    size="lg" 
                    theme="light" 
                    icon={IconComponent} 
                  />
                  <BackgroundPattern 
                    pattern="circle" 
                    size="sm" 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                  />
                </div>
                <div className="z-10 flex flex-col gap-0.5">
                  <AriaHeading slot="title" className="text-md font-semibold text-primary">
                    {title}
                  </AriaHeading>
                  <p className="text-sm text-tertiary">{description}</p>
                </div>
              </div>
              <div className="z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pt-8 sm:pb-6">
                <Button 
                  color="secondary" 
                  size="lg" 
                  onClick={handleCancel}
                  isDisabled={isLoading}
                >
                  {cancelText}
                </Button>
                <Button 
                  color={config.buttonColor} 
                  size="lg" 
                  onClick={handleConfirm}
                  isDisabled={isLoading}
                >
                  {isLoading ? "Loading..." : confirmText}
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};

export default ConfirmationModal;
