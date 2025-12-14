"use client";

import { useState } from "react";
import { Sms, Mobile, Eye } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { useToast } from "@/components/base/toast/toast";
import { EmailPreviewModal } from "@/components/application/email-preview";

interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
}

const defaultPreferences: NotificationPreference[] = [
  {
    id: "compliance-updates",
    title: "Compliance Updates",
    description: "Get notified when compliance requirements change or new regulations are announced.",
    email: true,
    push: true,
  },
  {
    id: "deadline-reminders",
    title: "Deadline Reminders",
    description: "Receive reminders about upcoming compliance deadlines.",
    email: true,
    push: true,
  },
  {
    id: "document-generated",
    title: "Document Generated",
    description: "Get notified when AI-generated documents are ready for review.",
    email: true,
    push: false,
  },
  {
    id: "team-activity",
    title: "Team Activity",
    description: "Updates about team member actions and changes.",
    email: false,
    push: true,
  },
  {
    id: "security-alerts",
    title: "Security Alerts",
    description: "Important security notifications about your account.",
    email: true,
    push: true,
  },
  {
    id: "product-updates",
    title: "Product Updates",
    description: "News about new features and improvements to ComplyAI.",
    email: true,
    push: false,
  },
];

export const NotificationSettings = () => {
  const { addToast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreference[]>(defaultPreferences);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);

  const togglePreference = (id: string, type: "email" | "push") => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.id === id ? { ...pref, [type]: !pref[type] } : pref
      )
    );
  };

  const handleSave = () => {
    console.log("Saving preferences:", preferences);
    addToast({
      title: "Preferences saved",
      message: "Your notification preferences have been updated.",
      type: "success",
    });
  };

  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col gap-6">
          {/* Section Header */}
          <div className="border-b border-secondary pb-5">
            <h2 className="text-lg font-semibold text-primary">Notification Preferences</h2>
            <p className="mt-1 text-sm text-tertiary">
              Choose how you want to be notified about important updates.
            </p>
          </div>

          {/* Notification Preferences - Two column layout */}
          {preferences.map((pref, index) => (
            <div key={pref.id}>
              <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[240px_1fr] lg:gap-12">
                <div>
                  <label className="text-sm font-medium text-secondary">{pref.title}</label>
                  <p className="mt-0.5 text-xs text-tertiary">{pref.description}</p>
                </div>
                <div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        isSelected={pref.email}
                        onChange={() => togglePreference(pref.id, "email")}
                      />
                      <Sms size={16} color="currentColor" className="text-tertiary" />
                      <span className="text-sm text-secondary">Email</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        isSelected={pref.push}
                        onChange={() => togglePreference(pref.id, "push")}
                      />
                      <Mobile size={16} color="currentColor" className="text-tertiary" />
                      <span className="text-sm text-secondary">Push</span>
                    </label>
                  </div>
                </div>
              </div>
              {index !== preferences.length - 1 && (
                <hr className="h-px w-full border-none bg-border-secondary mt-5" />
              )}
            </div>
          ))}

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 border-t border-secondary pt-5">
            <div className="flex items-center gap-3">
              <Button
                color="secondary"
                size="sm"
                onClick={() =>
                  setPreferences((prev) =>
                    prev.map((p) => ({ ...p, email: true, push: true }))
                  )
                }
              >
                Enable All
              </Button>
              <Button
                color="secondary"
                size="sm"
                onClick={() =>
                  setPreferences((prev) =>
                    prev.map((p) => ({ ...p, email: false, push: false }))
                  )
                }
              >
                Disable All
              </Button>
              <Button
                color="secondary"
                size="sm"
                iconLeading={({ className }) => <Eye size={16} color="currentColor" className={className} />}
                onClick={() => setIsEmailPreviewOpen(true)}
              >
                Preview Emails
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" color="secondary" size="md">
                Cancel
              </Button>
              <Button color="primary" size="md" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Preview Modal */}
      <EmailPreviewModal
        isOpen={isEmailPreviewOpen}
        onOpenChange={setIsEmailPreviewOpen}
      />
    </div>
  );
};

export default NotificationSettings;
