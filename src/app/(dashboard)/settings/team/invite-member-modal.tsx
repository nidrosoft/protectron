"use client";

import { useState } from "react";
import type { Key } from "react-aria-components";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Select, type SelectItemType } from "@/components/base/select/select";

interface InviteMemberModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userRole: string;
  onInviteSent: () => void;
}

const roleOptions: SelectItemType[] = [
  { id: "member", label: "Member - Can view and edit AI systems" },
  { id: "admin", label: "Admin - Can also invite and manage team" },
];

export const InviteMemberModal = ({
  isOpen,
  onOpenChange,
  userRole,
  onInviteSent,
}: InviteMemberModalProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("member");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admins can only invite members, owners can invite admin or member
  const availableRoles = userRole === "owner" ? roleOptions : roleOptions.filter(r => r.id === "member");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/team/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      if (response.ok) {
        setEmail("");
        setRole("member");
        onOpenChange(false);
        onInviteSent();
      } else {
        const { error: errorMsg } = await response.json();
        setError(errorMsg || "Failed to send invitation");
      }
    } catch (err) {
      setError("Failed to send invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setRole("member");
    setError(null);
    onOpenChange(false);
  };

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-md">
              <CloseButton 
                onClick={handleClose} 
                theme="light" 
                size="lg" 
                className="absolute top-3 right-3 z-20" 
              />
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6">
                  <div className="z-10 flex flex-col gap-1">
                    <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                      Invite Team Member
                    </AriaHeading>
                    <p className="text-sm text-tertiary">
                      Send an invitation to join your organization.
                    </p>
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-secondary">
                      Email address <span className="text-brand-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="colleague@company.com"
                      required
                      className="w-full rounded-lg border border-secondary bg-primary px-3.5 py-2.5 text-sm text-primary placeholder:text-quaternary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  {/* Role Select */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-secondary">Role</label>
                    <Select
                      size="md"
                      placeholder="Select role"
                      selectedKey={role}
                      onSelectionChange={(key: Key | null) => key && setRole(String(key))}
                      items={availableRoles}
                    >
                      {(item) => (
                        <Select.Item key={item.id} id={item.id} textValue={item.label}>
                          {item.label}
                        </Select.Item>
                      )}
                    </Select>
                    <p className="text-xs text-tertiary">
                      {role === "admin" 
                        ? "Admins can invite members and manage team settings."
                        : "Members can view and edit AI systems, documents, and evidence."}
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="rounded-lg bg-error-50 p-3 text-sm text-error-700">
                      {error}
                    </div>
                  )}
                </div>

                <div className="z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pt-6 sm:pb-6">
                  <Button 
                    type="button"
                    color="secondary" 
                    size="lg" 
                    onClick={handleClose}
                    isDisabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    color="primary" 
                    size="lg" 
                    isDisabled={isSubmitting || !email}
                  >
                    {isSubmitting ? "Sending..." : "Send Invitation"}
                  </Button>
                </div>
              </form>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};

export default InviteMemberModal;
