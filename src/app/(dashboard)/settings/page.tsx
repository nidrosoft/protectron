"use client";

import { useState } from "react";
import { Tab, TabList, Tabs } from "@/components/application/tabs/tabs";
import { NativeSelect } from "@/components/base/select/select-native";

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
  const [selectedTab, setSelectedTab] = useState<string>("organization");

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
          onChange={(event) => setSelectedTab(event.target.value)}
          options={tabs.map((tab) => ({ label: tab.label, value: tab.id }))}
        />

        {/* Desktop underline tabs */}
        <Tabs
          className="hidden md:flex"
          selectedKey={selectedTab}
          onSelectionChange={(value) => setSelectedTab(value as string)}
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
