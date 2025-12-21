"use client";

import { useState, useEffect } from "react";
import { Edit01 } from "@untitledui/icons";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Input } from "@/components/base/input/input";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { BackgroundPattern } from "@/components/shared-assets/background-patterns";

interface RenameModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentName: string;
  itemType?: string;
  onConfirm: (newName: string) => void;
  isLoading?: boolean;
}

export const RenameModal = ({
  isOpen,
  onOpenChange,
  currentName,
  itemType = "item",
  onConfirm,
  isLoading = false,
}: RenameModalProps) => {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    setName(currentName);
  }, [currentName, isOpen]);

  const handleCancel = () => {
    setName(currentName);
    onOpenChange(false);
  };

  const handleConfirm = () => {
    if (name.trim() && name !== currentName) {
      onConfirm(name.trim());
    }
  };

  const canSubmit = name.trim().length > 0 && name !== currentName;

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
                    color="brand" 
                    size="lg" 
                    theme="light" 
                    icon={Edit01} 
                  />
                  <BackgroundPattern 
                    pattern="circle" 
                    size="sm" 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
                  />
                </div>
                <div>
                  <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                    Rename {itemType}
                  </AriaHeading>
                  <p className="mt-1 text-sm text-tertiary">
                    Enter a new name for this {itemType.toLowerCase()}.
                  </p>
                </div>
              </div>

              <div className="px-4 py-5 sm:px-6">
                <Input
                  label="Name"
                  value={name}
                  onChange={setName}
                  placeholder={`Enter ${itemType.toLowerCase()} name`}
                  autoFocus
                />
              </div>

              <div className="flex flex-1 flex-col-reverse gap-3 p-4 pt-6 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pt-8 sm:pb-6">
                <Button 
                  size="lg" 
                  color="secondary" 
                  onClick={handleCancel}
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  size="lg" 
                  onClick={handleConfirm}
                  isDisabled={!canSubmit || isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};
