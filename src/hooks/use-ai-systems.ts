"use client";

import { useState, useEffect, useCallback } from "react";
import { aiSystemsApi, type AISystem, type AISystemDetail, type CreateAISystemInput, type UpdateAISystemInput } from "@/lib/api/client";

export function useAISystems() {
  const [systems, setSystems] = useState<AISystem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSystems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const response = await aiSystemsApi.list();
    
    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setSystems(response.data);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSystems();
  }, [fetchSystems]);

  const createSystem = async (data: CreateAISystemInput) => {
    const response = await aiSystemsApi.create(data);
    if (response.data) {
      setSystems((prev) => [response.data!, ...prev]);
    }
    return response;
  };

  const deleteSystem = async (id: string) => {
    const response = await aiSystemsApi.delete(id);
    if (response.data?.success) {
      setSystems((prev) => prev.filter((s) => s.id !== id));
    }
    return response;
  };

  return {
    systems,
    isLoading,
    error,
    refetch: fetchSystems,
    createSystem,
    deleteSystem,
  };
}

export function useAISystem(id: string) {
  const [system, setSystem] = useState<AISystemDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSystem = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    const response = await aiSystemsApi.get(id);
    
    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setSystem(response.data);
    }
    
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    fetchSystem();
  }, [fetchSystem]);

  const updateSystem = async (data: UpdateAISystemInput) => {
    const response = await aiSystemsApi.update(id, data);
    if (response.data) {
      setSystem((prev) => prev ? { ...prev, ...response.data } : null);
    }
    return response;
  };

  return {
    system,
    isLoading,
    error,
    refetch: fetchSystem,
    updateSystem,
  };
}
