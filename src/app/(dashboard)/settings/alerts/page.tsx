"use client";

import { useState } from "react";
import { Notification, Sms, Message, Link21, Timer1 } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import { Select } from "@/components/base/select/select";
import { useToast } from "@/components/base/toast/toast";

const errorRateOptions = [
  { id: "1", label: "1%" },
  { id: "2", label: "2%" },
  { id: "5", label: "5%" },
  { id: "10", label: "10%" },
  { id: "15", label: "15%" },
];

const overrideRateOptions = [
  { id: "5", label: "5%" },
  { id: "10", label: "10%" },
  { id: "15", label: "15%" },
  { id: "20", label: "20%" },
  { id: "25", label: "25%" },
];

const disconnectionOptions = [
  { id: "5", label: "5 minutes" },
  { id: "15", label: "15 minutes" },
  { id: "30", label: "30 minutes" },
  { id: "60", label: "1 hour" },
  { id: "120", label: "2 hours" },
];

const evaluationWindowOptions = [
  { id: "5", label: "5 minutes" },
  { id: "15", label: "15 minutes" },
  { id: "30", label: "30 minutes" },
  { id: "60", label: "1 hour" },
];

export default function AlertsSettingsPage() {
  const [settings, setSettings] = useState({
    errorRateThreshold: "5",
    errorRateWindow: "15",
    overrideRateThreshold: "10",
    overrideRateWindow: "60",
    disconnectionTimeout: "30",
    destinations: {
      email: {
        enabled: true,
        recipients: "admin@company.com, security@company.com",
      },
      slack: {
        enabled: true,
        channel: "#ai-agent-alerts",
      },
      webhook: {
        enabled: false,
        url: "",
      },
      pagerduty: {
        enabled: false,
        integrationKey: "",
      },
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { addToast } = useToast();

  const updateSetting = <K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };

  const updateDestination = (
    destination: keyof typeof settings.destinations,
    field: string,
    value: string | boolean
  ) => {
    setSettings({
      ...settings,
      destinations: {
        ...settings.destinations,
        [destination]: {
          ...settings.destinations[destination],
          [field]: value,
        },
      },
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
      addToast({ type: "success", title: "Settings saved", message: "Alert settings saved successfully!" });
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Alerts & Notifications</h1>
          <p className="mt-1 text-sm text-tertiary">
            Configure alert thresholds and notification destinations for your AI systems.
          </p>
        </div>
        <Button 
          size="md"
          onClick={handleSave}
          isDisabled={!hasChanges || isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Alert Thresholds */}
      <div className="rounded-xl border border-secondary bg-primary">
        <div className="border-b border-secondary px-6 py-4">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Timer1 size={20} color="currentColor" />
            Alert Thresholds
          </h2>
          <p className="mt-1 text-sm text-tertiary">
            Define when alerts should be triggered based on system metrics.
          </p>
        </div>

        <div className="flex flex-col gap-6 p-6">
          {/* Error Rate Alert */}
          <div className="flex flex-col gap-3 pb-6 border-b border-secondary">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-primary">Error Rate Alert</h3>
                <p className="text-sm text-tertiary">Alert when error rate exceeds threshold</p>
              </div>
              <Badge color="success" size="sm">Active</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-primary">Threshold</label>
                <Select
                  size="md"
                  selectedKey={settings.errorRateThreshold}
                  onSelectionChange={(key) => updateSetting("errorRateThreshold", key as string)}
                  items={errorRateOptions}
                  className="mt-1"
                >
                  {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-primary">Evaluation Window</label>
                <Select
                  size="md"
                  selectedKey={settings.errorRateWindow}
                  onSelectionChange={(key) => updateSetting("errorRateWindow", key as string)}
                  items={evaluationWindowOptions}
                  className="mt-1"
                >
                  {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                </Select>
              </div>
            </div>
          </div>

          {/* Human Override Spike */}
          <div className="flex flex-col gap-3 pb-6 border-b border-secondary">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-primary">Human Override Spike</h3>
                <p className="text-sm text-tertiary">Alert when HITL override rate exceeds threshold</p>
              </div>
              <Badge color="success" size="sm">Active</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-primary">Threshold</label>
                <Select
                  size="md"
                  selectedKey={settings.overrideRateThreshold}
                  onSelectionChange={(key) => updateSetting("overrideRateThreshold", key as string)}
                  items={overrideRateOptions}
                  className="mt-1"
                >
                  {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-primary">Evaluation Window</label>
                <Select
                  size="md"
                  selectedKey={settings.overrideRateWindow}
                  onSelectionChange={(key) => updateSetting("overrideRateWindow", key as string)}
                  items={evaluationWindowOptions}
                  className="mt-1"
                >
                  {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                </Select>
              </div>
            </div>
          </div>

          {/* Agent Disconnection */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-primary">Agent Disconnection</h3>
                <p className="text-sm text-tertiary">Alert when agent hasn't sent events for specified duration</p>
              </div>
              <Badge color="success" size="sm">Active</Badge>
            </div>
            <div className="w-64">
              <label className="text-sm font-medium text-primary">Timeout Duration</label>
              <Select
                size="md"
                selectedKey={settings.disconnectionTimeout}
                onSelectionChange={(key) => updateSetting("disconnectionTimeout", key as string)}
                items={disconnectionOptions}
                className="mt-1"
              >
                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Destinations */}
      <div className="rounded-xl border border-secondary bg-primary">
        <div className="border-b border-secondary px-6 py-4">
          <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Notification size={20} color="currentColor" />
            Alert Destinations
          </h2>
          <p className="mt-1 text-sm text-tertiary">
            Configure where alerts should be sent when thresholds are exceeded.
          </p>
        </div>

        <div className="flex flex-col gap-0">
          {/* Email */}
          <div className="flex items-start gap-4 p-6 border-b border-secondary">
            <input
              type="checkbox"
              checked={settings.destinations.email.enabled}
              onChange={(e) => updateDestination("email", "enabled", e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Sms size={18} color="currentColor" className="text-tertiary" />
                <h3 className="font-medium text-primary">Email</h3>
                {settings.destinations.email.enabled && (
                  <Badge color="success" size="sm">Enabled</Badge>
                )}
              </div>
              {settings.destinations.email.enabled && (
                <div className="mt-3">
                  <label className="text-sm font-medium text-primary">Recipients</label>
                  <input
                    type="text"
                    value={settings.destinations.email.recipients}
                    onChange={(e) => updateDestination("email", "recipients", e.target.value)}
                    placeholder="email1@company.com, email2@company.com"
                    className="mt-1 w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary placeholder:text-quaternary focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100"
                  />
                  <p className="mt-1 text-xs text-tertiary">Separate multiple emails with commas</p>
                </div>
              )}
            </div>
            <Button size="sm" color="secondary">Configure</Button>
          </div>

          {/* Slack */}
          <div className="flex items-start gap-4 p-6 border-b border-secondary">
            <input
              type="checkbox"
              checked={settings.destinations.slack.enabled}
              onChange={(e) => updateDestination("slack", "enabled", e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Message size={18} color="currentColor" className="text-tertiary" />
                <h3 className="font-medium text-primary">Slack</h3>
                {settings.destinations.slack.enabled && (
                  <Badge color="success" size="sm">Enabled</Badge>
                )}
              </div>
              {settings.destinations.slack.enabled && (
                <div className="mt-3">
                  <label className="text-sm font-medium text-primary">Channel</label>
                  <input
                    type="text"
                    value={settings.destinations.slack.channel}
                    onChange={(e) => updateDestination("slack", "channel", e.target.value)}
                    placeholder="#channel-name"
                    className="mt-1 w-full max-w-xs rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary placeholder:text-quaternary focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100"
                  />
                </div>
              )}
            </div>
            <Button size="sm" color="secondary">Configure</Button>
          </div>

          {/* Webhook */}
          <div className="flex items-start gap-4 p-6 border-b border-secondary">
            <input
              type="checkbox"
              checked={settings.destinations.webhook.enabled}
              onChange={(e) => updateDestination("webhook", "enabled", e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Link21 size={18} color="currentColor" className="text-tertiary" />
                <h3 className="font-medium text-primary">Webhook</h3>
                {!settings.destinations.webhook.enabled && (
                  <span className="text-sm text-tertiary">Not configured</span>
                )}
              </div>
              {settings.destinations.webhook.enabled && (
                <div className="mt-3">
                  <label className="text-sm font-medium text-primary">Webhook URL</label>
                  <input
                    type="url"
                    value={settings.destinations.webhook.url}
                    onChange={(e) => updateDestination("webhook", "url", e.target.value)}
                    placeholder="https://your-webhook-endpoint.com/alerts"
                    className="mt-1 w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary placeholder:text-quaternary focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100"
                  />
                </div>
              )}
            </div>
            <Button size="sm" color="secondary">Configure</Button>
          </div>

          {/* PagerDuty */}
          <div className="flex items-start gap-4 p-6">
            <input
              type="checkbox"
              checked={settings.destinations.pagerduty.enabled}
              onChange={(e) => updateDestination("pagerduty", "enabled", e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Notification size={18} color="currentColor" className="text-tertiary" />
                <h3 className="font-medium text-primary">PagerDuty</h3>
                {!settings.destinations.pagerduty.enabled && (
                  <span className="text-sm text-tertiary">Not connected</span>
                )}
              </div>
              {settings.destinations.pagerduty.enabled && (
                <div className="mt-3">
                  <label className="text-sm font-medium text-primary">Integration Key</label>
                  <input
                    type="text"
                    value={settings.destinations.pagerduty.integrationKey}
                    onChange={(e) => updateDestination("pagerduty", "integrationKey", e.target.value)}
                    placeholder="Enter your PagerDuty integration key"
                    className="mt-1 w-full max-w-md rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary placeholder:text-quaternary focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100"
                  />
                </div>
              )}
            </div>
            <Button size="sm" color="secondary">
              {settings.destinations.pagerduty.enabled ? "Configure" : "Connect"}
            </Button>
          </div>
        </div>
      </div>

      {/* Test Alert */}
      <div className="rounded-xl border border-secondary bg-secondary_subtle p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-primary">Test Your Configuration</h3>
            <p className="text-sm text-tertiary">Send a test alert to verify your notification destinations are working correctly.</p>
          </div>
          <Button 
            size="md" 
            color="secondary"
            onClick={() => addToast({ type: "success", title: "Test alert sent", message: "Test alert sent to all enabled destinations!" })}
          >
            Send Test Alert
          </Button>
        </div>
      </div>
    </div>
  );
}
