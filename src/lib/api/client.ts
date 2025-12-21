// API client for making requests to the backend

const API_BASE = "/api/v1";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "An error occurred" };
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    return { error: "Network error" };
  }
}

// AI Systems API
export const aiSystemsApi = {
  list: () => fetchApi<AISystem[]>("/ai-systems"),

  get: (id: string) => fetchApi<AISystemDetail>(`/ai-systems/${id}`),

  create: (data: CreateAISystemInput) =>
    fetchApi<AISystem>("/ai-systems", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateAISystemInput) =>
    fetchApi<AISystem>(`/ai-systems/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<{ success: boolean }>(`/ai-systems/${id}`, {
      method: "DELETE",
    }),
};

// Agent Events API
export const agentEventsApi = {
  list: (agentId: string, params?: EventsListParams) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.offset) searchParams.set("offset", params.offset.toString());
    if (params?.type) searchParams.set("type", params.type);
    if (params?.traceId) searchParams.set("trace_id", params.traceId);
    if (params?.sessionId) searchParams.set("session_id", params.sessionId);

    const query = searchParams.toString();
    return fetchApi<AuditEvent[]>(`/agents/${agentId}/events${query ? `?${query}` : ""}`);
  },
};

// HITL Rules API
export const hitlRulesApi = {
  list: (agentId: string) => fetchApi<HITLRule[]>(`/agents/${agentId}/hitl-rules`),

  create: (agentId: string, data: CreateHITLRuleInput) =>
    fetchApi<HITLRule>(`/agents/${agentId}/hitl-rules`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Incidents API
export const incidentsApi = {
  list: (agentId: string, params?: IncidentsListParams) => {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set("status", params.status);
    if (params?.severity) searchParams.set("severity", params.severity);

    const query = searchParams.toString();
    return fetchApi<Incident[]>(`/agents/${agentId}/incidents${query ? `?${query}` : ""}`);
  },

  create: (agentId: string, data: CreateIncidentInput) =>
    fetchApi<Incident>(`/agents/${agentId}/incidents`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Agent Control API
export const agentControlApi = {
  emergencyStop: (agentId: string, reason?: string) =>
    fetchApi<{ success: boolean; message: string }>(`/agents/${agentId}/emergency-stop`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),

  resume: (agentId: string, reason?: string) =>
    fetchApi<{ success: boolean; message: string }>(`/agents/${agentId}/resume`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
};

// Requirements API
export const requirementsApi = {
  get: (id: string) => fetchApi<Requirement>(`/requirements/${id}`),

  update: (id: string, data: UpdateRequirementInput) =>
    fetchApi<Requirement>(`/requirements/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// Documents API
export const documentsApi = {
  list: (aiSystemId: string) => fetchApi<Document[]>(`/ai-systems/${aiSystemId}/documents`),

  generate: (aiSystemId: string, data: GenerateDocumentInput) =>
    fetchApi<Document>(`/ai-systems/${aiSystemId}/documents`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Evidence API
export const evidenceApi = {
  list: (aiSystemId: string) => fetchApi<Evidence[]>(`/ai-systems/${aiSystemId}/evidence`),

  upload: (aiSystemId: string, data: UploadEvidenceInput) =>
    fetchApi<Evidence>(`/ai-systems/${aiSystemId}/evidence`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export interface UpdateRequirementInput {
  status?: "pending" | "in_progress" | "completed";
  linked_evidence_id?: string | null;
  linked_document_id?: string | null;
  notes?: string;
}

export interface GenerateDocumentInput {
  document_type: string;
  name: string;
}

export interface UploadEvidenceInput {
  name: string;
  file_type: string;
  file_url?: string;
  file_size?: number;
  linked_requirement_id?: string;
  description?: string;
}

// Types
export interface AISystem {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  system_type: string;
  risk_level: string;
  provider: string | null;
  model_name: string | null;
  category: string | null;
  deployment_status: string | null;
  agent_framework: string | null;
  agent_capabilities: string[] | null;
  is_multi_agent: boolean | null;
  lifecycle_status: string | null;
  sdk_connected: boolean | null;
  sdk_last_event_at: string | null;
  sdk_events_total: number | null;
  compliance_progress: number | null;
  compliance_status: string | null;
  serves_eu: boolean | null;
  processes_in_eu: boolean | null;
  established_in_eu: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AISystemDetail extends AISystem {
  ai_system_certifications: Certification[] | null;
  agent_sdk_configs: SDKConfig[] | null;
  ai_system_requirements: Requirement[] | null;
  documents: Document[] | null;
  evidence: Evidence[] | null;
  agent_hitl_rules: HITLRule[] | null;
  agent_statistics: Statistics[] | null;
  activity: ActivityLog[] | null;
  auditEvents: AuditEvent[] | null;
  relatedAgents: AgentRelationship[] | null;
}

export interface Certification {
  id: string;
  ai_system_id: string;
  status: string | null;
  cert_id: string | null;
  certified_at: string | null;
  valid_until: string | null;
  compliance_score: number | null;
  requirements_snapshot: Record<string, unknown> | null;
}

export interface SDKConfig {
  id: string;
  ai_system_id: string;
  agent_id_external: string;
  is_active: boolean | null;
}

export interface Requirement {
  id: string;
  ai_system_id: string;
  article_id: string;
  article_title: string;
  title: string;
  description: string | null;
  status: string | null;
  linked_evidence_id: string | null;
  linked_document_id: string | null;
}

export interface Document {
  id: string;
  name: string;
  document_type: string;
  status: string | null;
  file_size: string | null;
  created_at: string | null;
}

export interface Evidence {
  id: string;
  name: string;
  file_type: string;
  file_size: string | null;
  linked_to_article: string | null;
  uploaded_at: string | null;
}

export interface HITLRule {
  id: string;
  ai_system_id: string;
  rule_name: string;
  rule_description: string | null;
  trigger_conditions: Record<string, unknown>;
  is_active: boolean | null;
  requires_approval: boolean | null;
  approval_timeout_minutes: number | null;
}

export interface Statistics {
  id: string;
  ai_system_id: string;
  period_type: string;
  total_events: number | null;
  tool_calls: number | null;
  decisions: number | null;
  human_overrides: number | null;
  errors: number | null;
  error_rate: number | null;
}

export interface ActivityLog {
  id: string;
  action_type: string;
  action_description: string;
  user_name: string | null;
  user_avatar_url: string | null;
  target_name: string | null;
  created_at: string | null;
}

export interface AuditEvent {
  id: string;
  event_type: string;
  event_name: string | null;
  action: string | null;
  event_timestamp: string;
  trace_id: string;
  session_id: string | null;
  details: Record<string, unknown> | null;
  reasoning: string | null;
  confidence: number | null;
  duration_ms: number | null;
  tokens_input: number | null;
  tokens_output: number | null;
  override_by: string | null;
  override_decision: string | null;
  override_reason: string | null;
}

export interface AgentRelationship {
  id: string;
  parent_agent_id: string;
  child_agent_id: string;
  relationship_type: string;
  child_agent: {
    id: string;
    name: string;
    system_type: string;
  };
}

export interface Incident {
  id: string;
  ai_system_id: string;
  incident_type: string;
  severity: string;
  title: string;
  description: string;
  status: string | null;
  affected_individuals_count: number | null;
  incident_occurred_at: string;
  incident_detected_at: string;
  created_at: string | null;
}

// Input types
export interface CreateAISystemInput {
  name: string;
  description?: string;
  system_type?: string;
  risk_level?: string;
  provider?: string;
  model_name?: string;
  category?: string;
  deployment_status?: string;
  agent_framework?: string;
  agent_capabilities?: string[];
  is_multi_agent?: boolean;
  serves_eu?: boolean;
  processes_in_eu?: boolean;
  established_in_eu?: boolean;
  assessment_data?: Record<string, unknown>;
}

export interface UpdateAISystemInput {
  name?: string;
  description?: string;
  provider?: string;
  model_name?: string;
  category?: string;
  deployment_status?: string;
  lifecycle_status?: string;
}

export interface CreateHITLRuleInput {
  rule_name: string;
  rule_description?: string;
  trigger_conditions: Record<string, unknown>;
  requires_approval?: boolean;
  approval_timeout_minutes?: number;
  auto_reject_on_timeout?: boolean;
  notify_emails?: string[];
  notify_slack_channel?: string;
  is_active?: boolean;
}

export interface CreateIncidentInput {
  incident_type: string;
  severity: string;
  title: string;
  description: string;
  affected_individuals_count?: number;
  affected_individual_categories?: string[];
  harm_description?: string;
  incident_occurred_at?: string;
  incident_detected_at?: string;
  related_event_ids?: string[];
}

export interface EventsListParams {
  limit?: number;
  offset?: number;
  type?: string;
  traceId?: string;
  sessionId?: string;
}

export interface IncidentsListParams {
  status?: string;
  severity?: string;
}
