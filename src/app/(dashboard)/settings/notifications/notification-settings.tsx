"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Toggle } from "@/components/base/toggle/toggle";
import { useToast } from "@/components/base/toast/toast";
import { EmailPreviewModal } from "@/components/application/email-preview";
import { createClient } from "@/lib/supabase/client";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";

interface NotificationPreference {
  id: string;
  dbColumn: string;
  title: string;
  description: string;
  enabled: boolean;
}

const preferenceConfig: Omit<NotificationPreference, "enabled">[] = [
  {
    id: "team-activity",
    dbColumn: "team_activity",
    title: "Team Activity",
    description: "Get notified when team members join, leave, or change roles.",
  },
  {
    id: "document-generated",
    dbColumn: "document_generated",
    title: "Document Generated",
    description: "Get notified when AI-generated documents are ready for review.",
  },
  {
    id: "compliance-updates",
    dbColumn: "compliance_updates",
    title: "Compliance Updates",
    description: "Get notified when compliance requirements change or new regulations are announced.",
  },
  {
    id: "deadline-reminders",
    dbColumn: "deadline_reminders",
    title: "Deadline Reminders",
    description: "Receive reminders about upcoming compliance deadlines.",
  },
  {
    id: "incidents",
    dbColumn: "incidents",
    title: "Incidents",
    description: "Get notified when new incidents are reported or status changes.",
  },
  {
    id: "security-alerts",
    dbColumn: "security_alerts",
    title: "Security Alerts",
    description: "Important security notifications about your account and API keys.",
  },
  {
    id: "billing",
    dbColumn: "billing",
    title: "Billing & Payments",
    description: "Get notified about payment confirmations, failures, and subscription changes.",
  },
  {
    id: "product-updates",
    dbColumn: "product_updates",
    title: "Product Updates",
    description: "News about new features and improvements to Protectron.",
  },
];

export const NotificationSettings = () => {
  const { addToast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [isEmailPreviewOpen, setIsEmailPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  // Fetch preferences from database
  const fetchPreferences = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching preferences:", error);
        return;
      }

      // If no preferences exist, create default ones
      if (!data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: insertError } = await (supabase as any)
          .from("notification_preferences")
          .insert({ user_id: user.id });
        
        if (insertError) {
          console.error("Error creating preferences:", insertError);
        }
        
        // Set defaults
        setPreferences(preferenceConfig.map(p => ({
          ...p,
          enabled: p.dbColumn === "product_updates" ? false : true,
        })));
      } else {
        // Map database values to preferences
        setPreferences(preferenceConfig.map(p => ({
          ...p,
          enabled: data[p.dbColumn] ?? true,
        })));
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const togglePreference = (id: string) => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        addToast({
          title: "Error",
          message: "You must be logged in to save preferences.",
          type: "error",
        });
        return;
      }

      // Build update object from preferences
      const updateData: Record<string, boolean | string> = {};
      preferences.forEach(p => {
        updateData[p.dbColumn] = p.enabled;
      });
      updateData.updated_at = new Date().toISOString();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("notification_preferences")
        .update(updateData)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error saving preferences:", error);
        addToast({
          title: "Error",
          message: "Failed to save preferences. Please try again.",
          type: "error",
        });
        return;
      }

      addToast({
        title: "Preferences saved",
        message: "Your notification preferences have been updated.",
        type: "success",
      });
    } catch (err) {
      console.error("Error:", err);
      addToast({
        title: "Error",
        message: "An unexpected error occurred.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-center py-12">
            <LoadingIndicator type="dot-circle" size="md" label="Loading preferences..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6">
          {/* Section Header */}
          <div className="border-b border-secondary pb-5">
            <h2 className="text-lg font-semibold text-primary">Notification Preferences</h2>
            <p className="mt-1 text-sm text-tertiary">
              Choose which email notifications you want to receive.
            </p>
          </div>

          {/* Notification Preferences */}
          <div className="flex flex-col">
            {preferences.map((pref, index) => (
              <div key={pref.id}>
                <div className="flex items-center justify-between py-4">
                  <div className="flex-1 pr-8">
                    <label className="text-sm font-medium text-primary">{pref.title}</label>
                    <p className="mt-0.5 text-sm text-tertiary">{pref.description}</p>
                  </div>
                  <Toggle
                    size="md"
                    isSelected={pref.enabled}
                    onChange={() => togglePreference(pref.id)}
                    aria-label={`Toggle ${pref.title} notifications`}
                  />
                </div>
                {index !== preferences.length - 1 && (
                  <hr className="h-px w-full border-none bg-border-secondary" />
                )}
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 border-t border-secondary pt-5">
            <div className="flex items-center gap-3">
              <Button
                color="secondary"
                size="sm"
                onClick={() =>
                  setPreferences((prev) =>
                    prev.map((p) => ({ ...p, enabled: true }))
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
                    prev.map((p) => ({ ...p, enabled: false }))
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
              <Button 
                type="button" 
                color="secondary" 
                size="md"
                onClick={fetchPreferences}
              >
                Cancel
              </Button>
              <Button 
                color="primary" 
                size="md" 
                onClick={handleSave}
                isLoading={isSaving}
              >
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
