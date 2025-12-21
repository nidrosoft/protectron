"use client";

import { useState, useEffect, useCallback } from "react";

export interface SDKConfig {
  apiKey: string | null;
  isConnected: boolean;
  lastConnectedAt: string | null;
  createdAt: string | null;
}

interface UseSDKConfigParams {
  systemId: string;
}

interface UseSDKConfigReturn {
  config: SDKConfig | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  generateApiKey: () => Promise<string | null>;
  isGenerating: boolean;
}

export function useSDKConfig({ systemId }: UseSDKConfigParams): UseSDKConfigReturn {
  const [config, setConfig] = useState<SDKConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    if (!systemId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/agents/${systemId}/sdk-config`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // No config exists yet
          setConfig({
            apiKey: null,
            isConnected: false,
            lastConnectedAt: null,
            createdAt: null,
          });
          return;
        }
        throw new Error("Failed to fetch SDK config");
      }

      const result = await response.json();
      setConfig(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [systemId]);

  const generateApiKey = useCallback(async (): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/agents/${systemId}/sdk-config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate API key");
      }

      const result = await response.json();
      await fetchConfig(); // Refresh the config
      return result.data?.apiKey || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [systemId, fetchConfig]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return {
    config,
    isLoading,
    error,
    refetch: fetchConfig,
    generateApiKey,
    isGenerating,
  };
}
