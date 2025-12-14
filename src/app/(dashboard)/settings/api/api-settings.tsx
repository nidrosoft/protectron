"use client";

import { useState } from "react";
import { Add, Copy, Trash, Eye, EyeSlash, Key } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import { Table, TableCard } from "@/components/application/table/table";
import { useToast } from "@/components/base/toast/toast";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  status: "active" | "revoked";
}

const mockApiKeys: ApiKey[] = [
  {
    id: "key-1",
    name: "Production API Key",
    key: "cai_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    createdAt: "Nov 15, 2024",
    lastUsed: "Dec 12, 2024",
    status: "active",
  },
  {
    id: "key-2",
    name: "Development API Key",
    key: "cai_dev_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    createdAt: "Oct 20, 2024",
    lastUsed: "Dec 10, 2024",
    status: "active",
  },
  {
    id: "key-3",
    name: "Old Integration Key",
    key: "cai_prod_yyyyyyyyyyyyyyyyyyyyyyyyyyyyy",
    createdAt: "Sep 5, 2024",
    lastUsed: null,
    status: "revoked",
  },
];

export const ApiSettings = () => {
  const { addToast } = useToast();
  const [apiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

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

  const handleCreateKey = () => {
    addToast({
      title: "Create API Key",
      message: "API key creation modal would open here.",
      type: "info",
    });
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    addToast({
      title: "Copied",
      message: "API key copied to clipboard.",
      type: "success",
    });
  };

  const handleRevokeKey = (keyId: string) => {
    addToast({
      title: "Key revoked",
      message: `API key ${keyId} has been revoked.`,
      type: "warning",
    });
  };

  const maskKey = (key: string) => {
    return key.substring(0, 7) + "•".repeat(20) + key.substring(key.length - 4);
  };

  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-6">
          {/* Section Header */}
          <div className="border-b border-secondary pb-5">
            <h2 className="text-lg font-semibold text-primary">API Keys</h2>
            <p className="mt-1 text-sm text-tertiary">
              Manage your API keys for programmatic access to ComplyAI.
            </p>
          </div>

          {/* API Keys Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-secondary">Your API Keys</label>
                <p className="mt-0.5 text-xs text-tertiary">Keys for programmatic access to the ComplyAI API</p>
              </div>
              <Button
                color="primary"
                size="md"
                iconLeading={({ className }) => <Add size={18} color="currentColor" className={className} />}
                onClick={handleCreateKey}
              >
                Create API Key
              </Button>
            </div>
            <TableCard.Root>
              <Table aria-label="API Keys" selectionMode="none">
                <Table.Header>
                  <Table.Head id="name" isRowHeader label="Name" />
                  <Table.Head id="key" label="API Key" />
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
                        <div className="flex items-center gap-2">
                          <code className="text-xs text-tertiary font-mono">
                            {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                          </code>
                          <button
                            type="button"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            className="text-tertiary hover:text-secondary"
                          >
                            {visibleKeys.has(apiKey.id) ? (
                              <EyeSlash size={14} color="currentColor" />
                            ) : (
                              <Eye size={14} color="currentColor" />
                            )}
                          </button>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-sm text-tertiary">{apiKey.createdAt}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-sm text-tertiary">
                          {apiKey.lastUsed || "Never"}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          size="sm"
                          color={apiKey.status === "active" ? "success" : "gray"}
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
                            onClick={() => handleCopyKey(apiKey.key)}
                          >
                            Copy
                          </Button>
                          {apiKey.status === "active" && (
                            <Button
                              size="sm"
                              color="tertiary"
                              iconLeading={({ className }) => <Trash size={14} color="currentColor" className={className} />}
                              onClick={() => handleRevokeKey(apiKey.id)}
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
                    Learn how to integrate ComplyAI into your applications.
                  </p>
                  <Button color="secondary" size="sm" className="mt-3">
                    View Documentation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiSettings;
