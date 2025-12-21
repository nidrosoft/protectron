"use client";

import { useState, useEffect, useCallback } from "react";

export interface Incident {
  id: string;
  title: string;
  type: string;
  typeLabel: string;
  severity: "low" | "medium" | "high" | "critical";
  status: string;
  statusLabel: string;
  aiSystem: string;
  aiSystemId: string;
  individualsAffected: number;
  occurredAt: string;
  detectedAt: string;
  reportedAt: string;
  reportedBy: string;
  description: string;
  harmDescription?: string;
  affectedCategories?: string[];
  reportedToRegulator?: boolean;
  regulatorReference?: string;
  resolutionDescription?: string;
  preventiveMeasures?: string;
}

export interface IncidentFormData {
  aiSystemId: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  individualsAffected: number;
  categoriesAffected: string[];
  occurredAt: string;
  detectedAt: string;
  linkedEvents?: string[];
  reportToRegulator?: boolean;
}

interface UseIncidentsReturn {
  incidents: Incident[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createIncident: (data: IncidentFormData) => Promise<Incident | null>;
  isCreating: boolean;
}

const typeLabels: Record<string, string> = {
  safety_incident: "Safety Incident",
  rights_violation: "Rights Violation",
  malfunction: "Malfunction",
  security_breach: "Security Breach",
  other: "Other",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  investigating: "Investigating",
  resolved: "Resolved",
  reported: "Reported to Authority",
  closed: "Closed",
};

export function useIncidents(): UseIncidentsReturn {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/incidents");
      
      if (!response.ok) {
        throw new Error("Failed to fetch incidents");
      }

      const result = await response.json();
      
      // Transform incidents to match frontend expectations
      const transformedIncidents: Incident[] = (result.data || []).map((incident: any) => ({
        id: incident.id,
        title: incident.title,
        type: incident.incident_type,
        typeLabel: typeLabels[incident.incident_type] || incident.incident_type,
        severity: incident.severity,
        status: incident.status,
        statusLabel: statusLabels[incident.status] || incident.status,
        aiSystem: incident.ai_system?.name || "Unknown System",
        aiSystemId: incident.ai_system_id,
        individualsAffected: incident.affected_individuals_count || 0,
        occurredAt: incident.incident_occurred_at,
        detectedAt: incident.incident_detected_at,
        reportedAt: incident.incident_reported_at || incident.created_at,
        reportedBy: incident.reported_by_email || "Unknown",
        description: incident.description,
        harmDescription: incident.harm_description,
        affectedCategories: incident.affected_individual_categories,
        reportedToRegulator: incident.reported_to_regulator,
        regulatorReference: incident.regulator_reference,
        resolutionDescription: incident.resolution_description,
        preventiveMeasures: incident.preventive_measures,
      }));

      setIncidents(transformedIncidents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createIncident = useCallback(async (data: IncidentFormData): Promise<Incident | null> => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ai_system_id: data.aiSystemId,
          incident_type: data.type,
          severity: data.severity,
          title: data.title,
          description: data.description,
          affected_individuals_count: data.individualsAffected,
          affected_individual_categories: data.categoriesAffected,
          incident_occurred_at: data.occurredAt,
          incident_detected_at: data.detectedAt,
          related_event_ids: data.linkedEvents,
          reported_to_regulator: data.reportToRegulator,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create incident");
      }

      const result = await response.json();
      await fetchIncidents(); // Refresh the list
      return result.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [fetchIncidents]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return {
    incidents,
    isLoading,
    error,
    refetch: fetchIncidents,
    createIncident,
    isCreating,
  };
}
