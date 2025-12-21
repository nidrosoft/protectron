"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tab, TabList, Tabs } from "@/components/application/tabs/tabs";
import { NativeSelect } from "@/components/base/select/select-native";
import { TickCircle, CloseCircle } from "iconsax-react";

// Import tab content components
import { OrganizationSettings } from "./organization/organization-settings";
import { TeamSettings } from "./team/team-settings";
import { BillingSettings } from "./billing/billing-settings";
import { ApiSettings } from "./api/api-settings";
import { NotificationSettings } from "./notifications/notification-settings";

const tabs = [
  { id: "organization", label: "Organization" },
  { id: "team", label: "Team" },
  { id: "billing", label: "Billing" },
  { id: "api", label: "API" },
  { id: "notifications", label: "Notifications" },
];

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabFromUrl = searchParams.get("tab");
  const successParam = searchParams.get("success");
  
  const [selectedTab, setSelectedTab] = useState<string>(
    tabs.some(t => t.id === tabFromUrl) ? tabFromUrl! : "organization"
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showCanceledMessage, setShowCanceledMessage] = useState(false);

  // Sync tab with URL on mount and URL changes
  useEffect(() => {
    if (tabFromUrl && tabs.some(t => t.id === tabFromUrl)) {
      setSelectedTab(tabFromUrl);
    }
    // Show success message if redirected from Stripe checkout
    if (successParam === "true") {
      setShowSuccessMessage(true);
      setSelectedTab("billing"); // Go to billing tab after successful payment
      // Auto-hide after 8 seconds
      setTimeout(() => setShowSuccessMessage(false), 8000);
    }
    // Show canceled message if user canceled checkout
    if (searchParams.get("canceled") === "true") {
      setShowCanceledMessage(true);
      setSelectedTab("billing");
      setTimeout(() => setShowCanceledMessage(false), 5000);
    }
    // Clear the params from URL after showing
    if (successParam || searchParams.get("canceled")) {
      const newParams = new URLSearchParams();
      newParams.set("tab", "billing");
      router.replace(`/settings?${newParams.toString()}`, { scroll: false });
    }
  }, [tabFromUrl, successParam, searchParams, router]);

  // Update URL when tab changes
  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId);
    router.push(`/settings?tab=${tabId}`, { scroll: false });
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "organization":
        return <OrganizationSettings />;
      case "team":
        return <TeamSettings />;
      case "billing":
        return <BillingSettings />;
      case "api":
        return <ApiSettings />;
      case "notifications":
        return <NotificationSettings />;
      default:
        return <OrganizationSettings />;
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Success Banner */}
      {showSuccessMessage && (
        <div className="shrink-0 bg-success-50 border-b border-success-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-100">
              <TickCircle size={24} className="text-success-600" variant="Bold" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-success-800">
                Payment Successful!
              </h3>
              <p className="text-sm text-success-700">
                Thank you for upgrading! Your new plan is now active and all features have been unlocked.
              </p>
            </div>
            <button
              onClick={() => setShowSuccessMessage(false)}
              className="text-success-600 hover:text-success-800"
            >
              <CloseCircle size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Canceled Banner */}
      {showCanceledMessage && (
        <div className="shrink-0 bg-warning-50 border-b border-warning-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm text-warning-700">
                Checkout was canceled. No charges were made. You can try again anytime.
              </p>
            </div>
            <button
              onClick={() => setShowCanceledMessage(false)}
              className="text-warning-600 hover:text-warning-800"
            >
              <CloseCircle size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="shrink-0 border-b border-secondary bg-primary px-6 py-4 lg:px-8">
        <div>
          <h1 className="text-display-sm font-semibold text-primary">Settings</h1>
          <p className="mt-1 text-sm text-tertiary">
            Manage your organization, team, and account settings.
          </p>
        </div>
      </div>

      {/* Tabs - same style as AI System detail page */}
      <div className="shrink-0 border-b border-secondary bg-primary px-6 pt-4 lg:px-8">
        {/* Mobile select for tabs */}
        <NativeSelect
          aria-label="Settings tabs"
          className="md:hidden mb-4"
          value={selectedTab}
          onChange={(event) => handleTabChange(event.target.value)}
          options={tabs.map((tab) => ({ label: tab.label, value: tab.id }))}
        />

        {/* Desktop underline tabs */}
        <Tabs
          className="hidden md:flex"
          selectedKey={selectedTab}
          onSelectionChange={(value) => handleTabChange(value as string)}
        >
          <TabList type="underline" size="sm" items={tabs}>
            {(item) => (
              <Tab key={item.id} id={item.id} label={item.label} />
            )}
          </TabList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
}
