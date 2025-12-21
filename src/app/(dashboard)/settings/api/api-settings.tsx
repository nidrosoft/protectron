"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Add, Copy, Trash, Eye, EyeSlash, Key } from "iconsax-react";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import { Table, TableCard } from "@/components/application/table/table";
import { useToast } from "@/components/base/toast/toast";
import { ConfirmationModal } from "@/components/application/modals/confirmation-modal";
import { Modal, ModalOverlay, Dialog } from "@/components/application/modals/modal";
import { CloseButton } from "@/components/base/buttons/close-button";

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  environment: string;
  created_at: string;
  last_used_at: string | null;
  status: "active" | "revoked";
}

export const ApiSettings = () => {
  const { addToast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyEnvironment, setNewKeyEnvironment] = useState<"production" | "development">("production");
  const [isCreating, setIsCreating] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  const fetchApiKeys = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/organization/api-keys");
      if (response.ok) {
        const result = await response.json();
        setApiKeys(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching API keys:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      addToast({
        title: "Error",
        message: "Please enter a name for the API key.",
        type: "error",
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/v1/organization/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newKeyName.trim(),
          environment: newKeyEnvironment,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setNewlyCreatedKey(result.data.key);
        addToast({
          title: "API Key Created",
          message: "Your new API key has been created. Copy it now - it won't be shown again.",
          type: "success",
        });
        fetchApiKeys();
      } else {
        const error = await response.json();
        addToast({
          title: "Error",
          message: error.error || "Failed to create API key.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error creating API key:", error);
      addToast({
        title: "Error",
        message: "Failed to create API key.",
        type: "error",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    addToast({
      title: "Copied",
      message: "API key copied to clipboard.",
      type: "success",
    });
  };

  const handleRevokeKey = async () => {
    if (!keyToRevoke) return;

    try {
      const response = await fetch(`/api/v1/organization/api-keys/${keyToRevoke.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "revoked" }),
      });

      if (response.ok) {
        addToast({
          title: "Key Revoked",
          message: `API key "${keyToRevoke.name}" has been revoked.`,
          type: "warning",
        });
        fetchApiKeys();
      } else {
        const error = await response.json();
        addToast({
          title: "Error",
          message: error.error || "Failed to revoke API key.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error revoking API key:", error);
      addToast({
        title: "Error",
        message: "Failed to revoke API key.",
        type: "error",
      });
    } finally {
      setIsRevokeModalOpen(false);
      setKeyToRevoke(null);
    }
  };

  const maskKey = (keyPrefix: string) => {
    return keyPrefix + "•".repeat(20);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewKeyName("");
    setNewKeyEnvironment("production");
    setNewlyCreatedKey(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-sm text-tertiary">Loading API keys...</div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6">
          {/* Section Header */}
          <div className="border-b border-secondary pb-5">
            <h2 className="text-lg font-semibold text-primary">API Keys</h2>
            <p className="mt-1 text-sm text-tertiary">
              Manage your API keys for programmatic access to Protectron SDK.
            </p>
          </div>

          {/* API Keys Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-secondary">Your API Keys</label>
                <p className="mt-0.5 text-xs text-tertiary">Keys for programmatic access to the Protectron API</p>
              </div>
              <Button
                color="primary"
                size="md"
                iconLeading={({ className }) => <Add size={18} color="currentColor" className={className} />}
                onClick={() => setIsCreateModalOpen(true)}
              >
                Create API Key
              </Button>
            </div>

            {apiKeys.length === 0 ? (
              <div className="rounded-xl border border-secondary bg-secondary_subtle p-8 text-center">
                <Key size={32} color="currentColor" className="mx-auto text-tertiary" />
                <p className="mt-2 text-sm font-medium text-primary">No API keys yet</p>
                <p className="mt-1 text-xs text-tertiary">Create your first API key to start using the Protectron SDK.</p>
              </div>
            ) : (
              <TableCard.Root>
                <Table aria-label="API Keys" selectionMode="none">
                  <Table.Header>
                    <Table.Head id="name" isRowHeader label="Name" />
                    <Table.Head id="key" label="API Key" />
                    <Table.Head id="environment" label="Environment" />
                    <Table.Head id="created" label="Created" />
                    <Table.Head id="lastUsed" label="Last Used" />
                    <Table.Head id="status" label="Status" />
                    <Table.Head id="actions" label="" />
                  </Table.Header>
                  <Table.Body items={apiKeys}>
                    {(apiKey: ApiKey) => (
                      <Table.Row id={apiKey.id} className="odd:bg-secondary_subtle">
                        <Table.Cell>
                          <div className="flex items-center gap-2">
                            <Key size={16} color="currentColor" className="text-tertiary" />
                            <span className="text-sm font-medium text-primary">{apiKey.name}</span>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <code className="text-xs text-tertiary font-mono">
                            {maskKey(apiKey.key_prefix)}
                          </code>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge size="sm" color={apiKey.environment === "production" ? "brand" : "gray"}>
                            {apiKey.environment}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="text-sm text-tertiary">{formatDate(apiKey.created_at)}</span>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="text-sm text-tertiary">
                            {apiKey.last_used_at ? formatDate(apiKey.last_used_at) : "Never"}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <Badge
                            size="sm"
                            color={apiKey.status === "active" ? "success" : "error"}
                          >
                            {apiKey.status === "active" ? "Active" : "Revoked"}
                          </Badge>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              color="tertiary"
                              iconLeading={({ className }) => <Copy size={14} color="currentColor" className={className} />}
                              onClick={() => handleCopyKey(apiKey.key_prefix)}
                            >
                              Copy
                            </Button>
                            {apiKey.status === "active" && (
                              <Button
                                size="sm"
                                color="tertiary"
                                iconLeading={({ className }) => <Trash size={14} color="currentColor" className={className} />}
                                onClick={() => {
                                  setKeyToRevoke(apiKey);
                                  setIsRevokeModalOpen(true);
                                }}
                              >
                                Revoke
                              </Button>
                            )}
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </TableCard.Root>
            )}
          </div>

          <hr className="h-px w-full border-none bg-border-secondary" />

          {/* API Documentation */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-secondary">Documentation</label>
              <p className="mt-0.5 text-xs text-tertiary">Learn how to use the API</p>
            </div>
            <div className="rounded-xl border border-secondary bg-secondary_subtle p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
                  <Key size={20} color="currentColor" className="text-brand-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-primary">API Documentation</h3>
                  <p className="mt-1 text-sm text-tertiary">
                    Learn how to integrate Protectron SDK into your AI agents.
                  </p>
                  <Link 
                    href="https://protectron.ai/docs/api" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button color="secondary" size="sm" className="mt-3">
                      View Documentation
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      <AriaDialogTrigger isOpen={isCreateModalOpen} onOpenChange={closeCreateModal}>
        <ModalOverlay isDismissable>
          <Modal>
            <Dialog>
              <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-md">
                <CloseButton 
                  onClick={closeCreateModal} 
                  theme="light" 
                  size="lg" 
                  className="absolute top-3 right-3 z-20" 
                />
                <div className="flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6">
                  <div className="z-10 flex flex-col gap-1">
                    <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                      {newlyCreatedKey ? "API Key Created" : "Create API Key"}
                    </AriaHeading>
                    <p className="text-sm text-tertiary">
                      {newlyCreatedKey 
                        ? "Your new API key is ready to use."
                        : "Create a new API key for programmatic access."}
                    </p>
                  </div>

                  {newlyCreatedKey ? (
                    <div className="flex flex-col gap-4">
                      <div className="rounded-lg bg-success-50 border border-success-200 p-4">
                        <p className="text-sm font-medium text-success-700">
                          Your API key has been created successfully!
                        </p>
                        <p className="mt-1 text-xs text-success-600">
                          Copy this key now. You won&apos;t be able to see it again.
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-secondary">API Key</label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 rounded-lg bg-secondary_subtle px-3 py-2.5 font-mono text-xs text-secondary break-all">
                            {newlyCreatedKey}
                          </code>
                          <Button
                            size="md"
                            color="primary"
                            iconLeading={({ className }) => <Copy size={16} color="currentColor" className={className} />}
                            onClick={() => handleCopyKey(newlyCreatedKey)}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-secondary">
                          Name <span className="text-brand-500">*</span>
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-lg border border-secondary bg-primary px-3.5 py-2.5 text-sm text-primary placeholder:text-quaternary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                          placeholder="e.g., Production API Key"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-secondary">Environment</label>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                              newKeyEnvironment === "production"
                                ? "border-brand-500 bg-brand-50 text-brand-700"
                                : "border-secondary bg-primary text-secondary hover:bg-secondary_subtle"
                            }`}
                            onClick={() => setNewKeyEnvironment("production")}
                          >
                            Production
                          </button>
                          <button
                            type="button"
                            className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                              newKeyEnvironment === "development"
                                ? "border-brand-500 bg-brand-50 text-brand-700"
                                : "border-secondary bg-primary text-secondary hover:bg-secondary_subtle"
                            }`}
                            onClick={() => setNewKeyEnvironment("development")}
                          >
                            Development
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pt-6 sm:pb-6">
                  {newlyCreatedKey ? (
                    <>
                      <div />
                      <Button color="primary" size="lg" onClick={closeCreateModal}>
                        Done
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button color="secondary" size="lg" onClick={closeCreateModal}>
                        Cancel
                      </Button>
                      <Button
                        color="primary"
                        size="lg"
                        onClick={handleCreateKey}
                        isDisabled={isCreating || !newKeyName.trim()}
                      >
                        {isCreating ? "Creating..." : "Create Key"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Dialog>
          </Modal>
        </ModalOverlay>
      </AriaDialogTrigger>

      {/* Revoke Confirmation Modal */}
      <ConfirmationModal
        isOpen={isRevokeModalOpen}
        onOpenChange={setIsRevokeModalOpen}
        title="Revoke API Key"
        description={`Are you sure you want to revoke "${keyToRevoke?.name}"? This action cannot be undone and any applications using this key will stop working immediately.`}
        variant="warning"
        confirmText="Revoke Key"
        cancelText="Cancel"
        onConfirm={handleRevokeKey}
      />
    </div>
  );
};

export default ApiSettings;
