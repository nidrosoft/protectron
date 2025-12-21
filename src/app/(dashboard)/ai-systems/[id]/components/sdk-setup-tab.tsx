"use client";

import { useState } from "react";
import { Copy, TickCircle, CloseCircle, InfoCircle, Eye, EyeSlash, Refresh2, Send2, Warning2, ExportSquare } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import { ConfirmationModal } from "@/components/application/modals/confirmation-modal";
import { type AISystemData, sdkStatusConfig } from "../data/mock-data";
import { cx } from "@/utils/cx";
import { useSDKConfig } from "@/hooks";
import { useToast } from "@/components/base/toast/toast";

interface SDKSetupTabProps {
  system: AISystemData;
}

// Framework guide cards data
const frameworkGuides = [
  {
    id: "langchain",
    name: "LangChain",
    icon: "🦜",
    description: "Callback handler for LangChain agents",
    docsUrl: "https://docs.protectron.ai/sdk/langchain",
  },
  {
    id: "crewai",
    name: "CrewAI",
    icon: "👥",
    description: "Integration for CrewAI multi-agent systems",
    docsUrl: "https://docs.protectron.ai/sdk/crewai",
  },
  {
    id: "autogen",
    name: "AutoGen",
    icon: "🔄",
    description: "Microsoft AutoGen agent integration",
    docsUrl: "https://docs.protectron.ai/sdk/autogen",
  },
  {
    id: "custom",
    name: "Custom",
    icon: "⚙️",
    description: "Build your own integration",
    docsUrl: "https://docs.protectron.ai/sdk/custom",
  },
];

// Fallback API key for display when no real key exists
const FALLBACK_API_KEY = "pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

export const SDKSetupTab = ({ system }: SDKSetupTabProps) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<{
    success: boolean;
    timestamp: string;
    latency: number;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Fetch real SDK config from API
  const { config, isLoading: isLoadingConfig, generateApiKey, isGenerating } = useSDKConfig({
    systemId: system.id,
  });
  const { addToast } = useToast();

  // Use API key from config or fallback
  const apiKey = config?.apiKey || FALLBACK_API_KEY;
  const isConnected = config?.isConnected || system.sdkStatus === "connected";
  const sdkConfig = sdkStatusConfig[system.sdkStatus];

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLastTestResult({
      success: true,
      timestamp: new Date().toLocaleTimeString(),
      latency: Math.floor(Math.random() * 50) + 20,
    });
    setIsTestingConnection(false);
  };

  const handleRegenerateKey = async () => {
    setIsRegenerateModalOpen(false);
    const newKey = await generateApiKey();
    if (newKey) {
      addToast({ type: "success", title: "API key regenerated", message: "Please update your agent configuration." });
    }
  };

  const maskedApiKey = showApiKey ? apiKey : "pk_live_••••••••••••••••••••••••";

  return (
    <div className="flex flex-col gap-6">
      {/* Connection Status */}
      <div className="rounded-xl border border-secondary bg-primary p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary">SDK Integration</h3>
            <p className="mt-1 text-sm text-tertiary">
              Connect the Protectron SDK to automatically log agent actions and decisions.
            </p>
          </div>
          <Badge color={sdkConfig.color} size="md">
            {isConnected ? (
              <span className="flex items-center gap-1">
                <TickCircle size={14} color="currentColor" variant="Bold" />
                {sdkConfig.label}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <CloseCircle size={14} color="currentColor" variant="Bold" />
                {sdkConfig.label}
              </span>
            )}
          </Badge>
        </div>

        {isConnected && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-secondary_subtle p-3">
              <p className="text-xs text-tertiary">Last event received</p>
              <p className="text-sm font-medium text-primary">{system.lastActivity || "3 minutes ago"}</p>
            </div>
            <div className="rounded-lg bg-secondary_subtle p-3">
              <p className="text-xs text-tertiary">Events today</p>
              <p className="text-sm font-medium text-primary">1,247</p>
            </div>
            <div className="rounded-lg bg-secondary_subtle p-3">
              <p className="text-xs text-tertiary">Events this month</p>
              <p className="text-sm font-medium text-primary">38,921</p>
            </div>
            <div className="rounded-lg bg-secondary_subtle p-3">
              <p className="text-xs text-tertiary">Buffer status</p>
              <p className="text-sm font-medium text-success-600">Empty (all synced)</p>
            </div>
          </div>
        )}
      </div>

      {/* Credentials */}
      <div className="rounded-xl border border-secondary bg-primary p-6">
        <h3 className="text-lg font-semibold text-primary">Credentials</h3>
        <p className="mt-1 text-sm text-tertiary">
          Use these credentials to initialize the Protectron SDK in your agent code.
        </p>

        <div className="mt-4 flex flex-col gap-4">
          {/* Agent ID */}
          <div>
            <label className="text-sm font-medium text-primary">Agent ID</label>
            <div className="mt-1 flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-secondary_subtle px-3 py-2 font-mono text-sm text-secondary">
                agt_{system.id.replace("system-", "")}k8x72mN4pQ7rS9tU
              </code>
              <Button 
                size="sm" 
                color="secondary" 
                iconLeading={({ className }) => <Copy size={16} color="currentColor" className={className} />}
                onClick={() => handleCopy(`agt_${system.id.replace("system-", "")}k8x72mN4pQ7rS9tU`, "agentId")}
              >
                {copiedField === "agentId" ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="text-sm font-medium text-primary">API Key</label>
            <div className="mt-1 flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-secondary_subtle px-3 py-2 font-mono text-sm text-secondary">
                {maskedApiKey}
              </code>
              <Button 
                size="sm" 
                color="secondary" 
                iconLeading={({ className }) => showApiKey ? <EyeSlash size={16} color="currentColor" className={className} /> : <Eye size={16} color="currentColor" className={className} />}
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? "Hide" : "Show"}
              </Button>
              <Button 
                size="sm" 
                color="secondary" 
                iconLeading={({ className }) => <Copy size={16} color="currentColor" className={className} />}
                onClick={() => handleCopy(apiKey, "apiKey")}
              >
                {copiedField === "apiKey" ? "Copied!" : "Copy"}
              </Button>
              <Button 
                size="sm" 
                color="secondary" 
                iconLeading={({ className }) => <Refresh2 size={16} color="currentColor" className={className} />}
                onClick={() => setIsRegenerateModalOpen(true)}
              >
                Regenerate
              </Button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-warning-600">
              <Warning2 size={14} color="currentColor" />
              <span>Regenerating invalidates the current key immediately. Update your agent configuration after regenerating.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <div className="rounded-xl border border-secondary bg-primary p-6">
        <h3 className="text-lg font-semibold text-primary">Quick Start</h3>
        <p className="mt-1 text-sm text-tertiary">
          Install the SDK and add a few lines of code to start logging.
        </p>

        <div className="mt-4 flex flex-col gap-4">
          {/* Step 1 */}
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-primary">1. Install the SDK</p>
              <Button 
                size="sm" 
                color="secondary" 
                iconLeading={({ className }) => <Copy size={16} color="currentColor" className={className} />}
                onClick={() => handleCopy("pip install protectron-agent", "install")}
              >
                {copiedField === "install" ? "Copied!" : "Copy"}
              </Button>
            </div>
            <code className="mt-2 block rounded-lg bg-gray-900 px-4 py-3 font-mono text-sm text-gray-100">
              pip install protectron-agent
            </code>
          </div>

          {/* Step 2 */}
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-primary">2. Initialize in your code</p>
              <Button 
                size="sm" 
                color="secondary" 
                iconLeading={({ className }) => <Copy size={16} color="currentColor" className={className} />}
                onClick={() => handleCopy(`from protectron import ProtectronAgent

protectron = ProtectronAgent(
    api_key="${apiKey}",
    agent_id="agt_${system.id.replace("system-", "")}k8x72mN4pQ7rS9tU",
    environment="production",
    # Offline resilience settings
    buffer_size=1000,        # Events buffered offline
    flush_interval=5,        # Seconds between flushes
    retry_attempts=3         # Retries before buffering
)`, "init")}
              >
                {copiedField === "init" ? "Copied!" : "Copy"}
              </Button>
            </div>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-900 px-4 py-3 font-mono text-sm text-gray-100">
{`from protectron import ProtectronAgent

protectron = ProtectronAgent(
    api_key="${showApiKey ? apiKey : "pk_live_••••••••••••"}",
    agent_id="agt_${system.id.replace("system-", "")}k8x72mN4pQ7rS9tU",
    environment="production",
    # Offline resilience settings
    buffer_size=1000,        # Events buffered offline
    flush_interval=5,        # Seconds between flushes
    retry_attempts=3         # Retries before buffering
)`}
            </pre>
          </div>
        </div>
      </div>

      {/* Framework-Specific Guides */}
      <div className="rounded-xl border border-secondary bg-primary p-6">
        <h3 className="text-lg font-semibold text-primary">Framework-Specific Guides</h3>
        <p className="mt-1 text-sm text-tertiary">
          Choose your agent framework for detailed integration instructions.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {frameworkGuides.map((guide) => (
            <button
              key={guide.id}
              className="flex flex-col items-center gap-2 rounded-xl border border-secondary bg-primary p-4 text-center transition-all hover:border-brand-300 hover:bg-brand-50"
              onClick={() => window.open(guide.docsUrl, "_blank")}
            >
              <span className="text-3xl">{guide.icon}</span>
              <span className="font-semibold text-primary">{guide.name}</span>
              <span className="text-xs text-tertiary">{guide.description}</span>
              <span className="mt-1 flex items-center gap-1 text-xs font-medium text-brand-600">
                View Guide <ExportSquare size={12} color="currentColor" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Test Connection */}
      <div className="rounded-xl border border-secondary bg-primary p-6">
        <h3 className="text-lg font-semibold text-primary">Test Connection</h3>
        <p className="mt-1 text-sm text-tertiary">
          Send a test event to verify your SDK integration is working correctly.
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            size="md"
            iconLeading={({ className }) => <Send2 size={18} color="currentColor" className={className} />}
            onClick={handleTestConnection}
            isDisabled={isTestingConnection}
          >
            {isTestingConnection ? "Sending..." : "Send Test Event"}
          </Button>

          {lastTestResult && (
            <div className={cx(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm",
              lastTestResult.success ? "bg-success-50 text-success-700" : "bg-error-50 text-error-700"
            )}>
              {lastTestResult.success ? (
                <TickCircle size={16} color="currentColor" variant="Bold" />
              ) : (
                <CloseCircle size={16} color="currentColor" variant="Bold" />
              )}
              <span>
                {lastTestResult.success ? "✓ Successful" : "✗ Failed"} at {lastTestResult.timestamp}
                {lastTestResult.success && ` (latency: ${lastTestResult.latency}ms)`}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-brand-50 p-3">
          <InfoCircle size={20} className="text-brand-600 shrink-0" color="currentColor" />
          <p className="text-sm text-brand-700">
            Need help? Visit our <a href="https://docs.protectron.ai" target="_blank" rel="noopener noreferrer" className="font-medium underline">documentation</a> or contact <a href="mailto:support@protectron.ai" className="font-medium underline">support@protectron.ai</a>
          </p>
        </div>
      </div>

      {/* Regenerate API Key Modal */}
      <ConfirmationModal
        isOpen={isRegenerateModalOpen}
        onOpenChange={setIsRegenerateModalOpen}
        title="Regenerate API Key"
        description="Are you sure you want to regenerate your API key? The current key will be invalidated immediately and any agents using it will stop sending events until updated with the new key."
        variant="warning"
        confirmText="Regenerate Key"
        cancelText="Cancel"
        onConfirm={handleRegenerateKey}
      />
    </div>
  );
};

export default SDKSetupTab;
