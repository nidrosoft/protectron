/**
 * API Input Validation Schemas using Zod
 * Centralized validation for all API endpoints
 */

import { z, ZodError, ZodIssue } from "zod";

// Common field validators
const uuidSchema = z.string().uuid();
const emailSchema = z.string().email().toLowerCase();
const nonEmptyString = z.string().min(1).max(1000);
const optionalString = z.string().max(1000).optional().nullable();

// AI System schemas
export const createAISystemSchema = z.object({
  name: nonEmptyString,
  description: optionalString,
  system_type: z.enum(["ml_model", "ai_agent", "gpai", "custom"]).optional(),
  risk_level: z.enum(["minimal", "limited", "high_risk", "unacceptable"]).optional(),
  provider: optionalString,
  model_name: optionalString,
  category: optionalString,
  deployment_status: z.enum(["development", "staging", "production", "deprecated"]).optional(),
  agent_framework: optionalString,
  agent_capabilities: z.array(z.string()).optional(),
  is_multi_agent: z.boolean().optional(),
  serves_eu: z.boolean().optional(),
  processes_in_eu: z.boolean().optional(),
  established_in_eu: z.boolean().optional(),
  assessment_data: z.record(z.string(), z.unknown()).optional(),
});

export const updateAISystemSchema = createAISystemSchema.partial();

// Agent schemas
export const createAgentSchema = z.object({
  name: nonEmptyString,
  description: optionalString,
  agent_framework: optionalString,
  agent_capabilities: z.array(z.string()).optional(),
  risk_level: z.enum(["minimal", "limited", "high_risk", "unacceptable"]).optional(),
  provider: optionalString,
  model_name: optionalString,
  category: optionalString,
  serves_eu: z.boolean().optional(),
  processes_in_eu: z.boolean().optional(),
  established_in_eu: z.boolean().optional(),
});

// Team invite schemas
export const createInviteSchema = z.object({
  email: emailSchema,
  role: z.enum(["admin", "member"]).optional().default("member"),
});

// Document schemas
export const createDocumentSchema = z.object({
  ai_system_id: uuidSchema,
  document_type: z.enum(["technical", "risk", "policy", "model_card"]),
  title: nonEmptyString,
  content: z.record(z.string(), z.unknown()).optional(),
});

// Evidence schemas
export const createEvidenceSchema = z.object({
  ai_system_id: uuidSchema.optional(),
  title: nonEmptyString,
  description: optionalString,
  evidence_type: z.string().optional(),
  file_url: z.string().url().optional(),
  file_name: z.string().optional(),
  file_size: z.number().optional(),
  file_type: z.string().optional(),
});

// Incident schemas
export const createIncidentSchema = z.object({
  ai_system_id: uuidSchema,
  title: nonEmptyString,
  description: optionalString,
  severity: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["open", "investigating", "resolved", "closed"]).optional(),
  incident_type: z.string().optional(),
});

// SDK Event schemas (for external SDK ingestion)
export const sdkEventSchema = z.object({
  event_id: z.string().min(1).max(255),
  event_type: z.string().min(1).max(100),
  trace_id: z.string().min(1).max(255),
  timestamp: z.string().datetime(),
  span_id: z.string().max(255).optional(),
  parent_span_id: z.string().max(255).optional(),
  session_id: z.string().max(255).optional(),
  event_name: z.string().max(255).optional(),
  action: z.string().max(255).optional(),
  input: z.unknown().optional(),
  output: z.unknown().optional(),
  details: z.unknown().optional(),
  reasoning: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  alternatives: z.array(z.unknown()).optional(),
  override_by: z.string().optional(),
  override_decision: z.string().optional(),
  override_reason: z.string().optional(),
  response_time: z.number().optional(),
  duration_ms: z.number().optional(),
  tokens_input: z.number().optional(),
  tokens_output: z.number().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  pii_detected: z.boolean().optional(),
  pii_redacted: z.boolean().optional(),
});

export const sdkEventBatchSchema = z.object({
  events: z.array(sdkEventSchema).min(1).max(100),
});

// HITL Rule schemas
export const createHITLRuleSchema = z.object({
  name: nonEmptyString,
  description: optionalString,
  rule_type: z.enum(["approval", "review", "escalation"]),
  trigger_conditions: z.record(z.string(), z.unknown()),
  is_active: z.boolean().optional().default(true),
  priority: z.number().int().min(0).max(100).optional(),
});

// Report schemas
export const createReportSchema = z.object({
  name: nonEmptyString,
  report_type: z.enum(["compliance", "audit", "incident", "custom"]),
  ai_system_ids: z.array(uuidSchema).optional(),
  date_range_start: z.string().datetime().optional(),
  date_range_end: z.string().datetime().optional(),
  include_sections: z.array(z.string()).optional(),
});

// Organization update schema
export const updateOrganizationSchema = z.object({
  name: nonEmptyString.optional(),
  legal_name: optionalString,
  industry: optionalString,
  company_size: optionalString,
  country: optionalString,
  vat_number: optionalString,
  has_eu_presence: z.boolean().optional(),
});

// Profile update schema
export const updateProfileSchema = z.object({
  full_name: optionalString,
  avatar_url: z.string().url().optional().nullable(),
  email_notifications: z.boolean().optional(),
});

// Notification preferences schema
export const updateNotificationPreferencesSchema = z.object({
  team_activity: z.boolean().optional(),
  document_generated: z.boolean().optional(),
  compliance_updates: z.boolean().optional(),
  deadline_reminders: z.boolean().optional(),
  incidents: z.boolean().optional(),
  security_alerts: z.boolean().optional(),
  billing: z.boolean().optional(),
  product_updates: z.boolean().optional(),
});

/**
 * Validate request body against a schema
 * Returns parsed data or throws an error with details
 */
export async function validateBody<T extends z.ZodSchema>(
  request: Request,
  schema: T
): Promise<z.infer<T>> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.issues.map((e: ZodIssue) => `${e.path.join(".")}: ${e.message}`);
      throw new ValidationError(messages.join(", "));
    }
    throw new ValidationError("Invalid JSON body");
  }
}

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Helper to handle validation errors in API routes
 */
export function handleValidationError(error: unknown): { error: string; status: number } {
  if (error instanceof ValidationError) {
    return { error: error.message, status: 400 };
  }
  return { error: "Invalid request", status: 400 };
}
