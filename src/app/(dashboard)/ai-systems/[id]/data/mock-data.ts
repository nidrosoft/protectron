// Mock AI System data - will be replaced with real API calls

// System types
export type SystemType = "ai_agent" | "llm_application" | "ml_model" | "automated_decision" | "other";
export type LifecycleStatus = "draft" | "active" | "paused" | "archived";
export type SDKStatus = "connected" | "disconnected" | "not_applicable";

// Audit event types
export type AuditEventType = 
  | "agent_invoked" 
  | "tool_call" 
  | "decision_made" 
  | "human_override" 
  | "action_completed" 
  | "error" 
  | "escalation" 
  | "agent_delegation" 
  | "emergency_stop";

export interface AuditEvent {
  id: string;
  timestamp: string;
  type: AuditEventType;
  action: string;
  details: Record<string, string | number | boolean>;
  traceId?: string;
  sessionId?: string;
  duration?: number;
  tokens?: number;
  confidence?: number;
  reasoning?: string;
  alternatives?: string[];
  overrideBy?: string;
  overrideDecision?: "approved" | "rejected";
  overrideReason?: string;
  responseTime?: number;
}

export interface AuditStatistics {
  totalActions: number;
  totalActionsChange: number;
  toolCalls: number;
  toolCallsChange: number;
  decisionsMade: number;
  decisionsMadeChange: number;
  humanOverrides: number;
  humanOverridesChange: number;
  errors: number;
  errorsChange: number;
  humanOversightRate: number;
  escalationRate: number;
  avgResponseTime: number;
  avgTokensPerAction: number;
}

// Multi-agent relationship types
export type AgentRelationshipType = "coordinator" | "specialist" | "peer" | "supervisor";

export interface RelatedAgent {
  id: string;
  name: string;
  relationship: AgentRelationshipType;
  delegationsToday?: number;
  avgDelegationTime?: number;
}

export interface AISystemData {
  id: string;
  name: string;
  description: string;
  riskLevel: "high" | "limited" | "minimal";
  status: "compliant" | "in_progress" | "not_started";
  progress: number;
  provider: string;
  modelName: string;
  category: string;
  deploymentStatus: string;
  createdAt: string;
  updatedAt: string;
  // Agent-specific fields
  type: SystemType;
  lifecycleStatus: LifecycleStatus;
  sdkStatus: SDKStatus;
  agentFramework?: string;
  lastActivity?: string;
  eventsLogged?: number;
  auditStatistics?: AuditStatistics;
  auditEvents?: AuditEvent[];
  // Multi-agent fields
  agentRole?: AgentRelationshipType;
  relatedAgents?: RelatedAgent[];
  multiAgentStats?: {
    delegationsToday: number;
    avgDelegationTime: number;
  };
  // Certification fields
  certification?: {
    status: "certified" | "pending" | "not_eligible";
    certId?: string;
    validUntil?: string;
    nextVerification?: string;
    requirements: {
      allRequirementsComplete: boolean;
      sdkConnectedDays: number;
      hitlRulesActive: boolean;
      noHighSeverityIncidents: boolean;
      humanOversightRate: number;
      errorRate: number;
    };
  };
  requirements: {
    completed: number;
    total: number;
    sections: {
      id: string;
      title: string;
      article: string;
      items: {
        id: string;
        title: string;
        status: "complete" | "in_progress" | "not_started";
        evidence?: string;
        document?: string;
      }[];
    }[];
  };
  documents: {
    id: string;
    name: string;
    type: string;
    status: "generated" | "draft" | "pending";
    createdAt: string;
    size: string;
  }[];
  evidence: {
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
    uploadedBy: string;
    linkedTo: string;
    size: string;
  }[];
  activity: {
    id: string;
    user: string;
    avatarUrl: string;
    action: string;
    target: string;
    time: string;
  }[];
}

export const mockAISystems: Record<string, AISystemData> = {
  "system-01": {
    id: "system-01",
    name: "Customer Support Chatbot",
    description: "AI-powered chatbot for handling customer inquiries and support tickets. Uses GPT-4 for natural language understanding.",
    riskLevel: "limited",
    status: "compliant",
    progress: 100,
    provider: "OpenAI",
    modelName: "GPT-4",
    category: "Customer Service / Chatbots",
    deploymentStatus: "Production",
    createdAt: "2024-01-15",
    updatedAt: "2024-12-10",
    type: "llm_application",
    lifecycleStatus: "active",
    sdkStatus: "not_applicable",
    certification: {
      status: "certified",
      certId: "cert_k8x72mN4pQ7rS9tU",
      validUntil: "2026-12-16",
      nextVerification: "2026-01-16",
      requirements: {
        allRequirementsComplete: true,
        sdkConnectedDays: 45,
        hitlRulesActive: true,
        noHighSeverityIncidents: true,
        humanOversightRate: 2.1,
        errorRate: 1.2,
      },
    },
    requirements: {
      completed: 8,
      total: 8,
      sections: [
        {
          id: "sec-1",
          title: "Transparency Requirements",
          article: "Article 52",
          items: [
            { id: "req-1", title: "Disclose AI interaction to users", status: "complete", evidence: "transparency_notice.pdf" },
            { id: "req-2", title: "Provide clear AI identification", status: "complete", document: "User Disclosure Policy" },
          ],
        },
      ],
    },
    documents: [
      { id: "doc-1", name: "Transparency Notice", type: "PDF", status: "generated", createdAt: "2024-12-01", size: "245 KB" },
      { id: "doc-2", name: "User Instructions", type: "PDF", status: "generated", createdAt: "2024-11-28", size: "180 KB" },
    ],
    evidence: [
      { id: "ev-1", name: "transparency_notice.pdf", type: "PDF", uploadedAt: "2024-12-01", uploadedBy: "Sarah Chen", linkedTo: "Transparency Requirements", size: "245 KB" },
    ],
    activity: [
      { id: "act-1", user: "Sarah Chen", avatarUrl: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80", action: "marked requirement complete", target: "Disclose AI interaction", time: "2 hours ago" },
      { id: "act-2", user: "John Miller", avatarUrl: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80", action: "uploaded evidence", target: "transparency_notice.pdf", time: "1 day ago" },
    ],
  },
  "system-02": {
    id: "system-02",
    name: "Automated Hiring Screener",
    description: "ML model for screening job applications and ranking candidates based on qualifications and experience.",
    riskLevel: "high",
    status: "in_progress",
    progress: 50,
    provider: "Custom / In-house",
    modelName: "Custom ML Model",
    category: "Hiring / Recruitment",
    deploymentStatus: "Production",
    createdAt: "2024-02-20",
    updatedAt: "2024-12-12",
    type: "automated_decision",
    lifecycleStatus: "active",
    sdkStatus: "not_applicable",
    requirements: {
      completed: 12,
      total: 24,
      sections: [
        {
          id: "sec-1",
          title: "Risk Management System",
          article: "Article 9",
          items: [
            { id: "req-1", title: "Establish risk management system", status: "complete", evidence: "risk_management_policy.pdf" },
            { id: "req-2", title: "Identify and analyze known and foreseeable risks", status: "complete", document: "Risk Assessment Report" },
            { id: "req-3", title: "Implement risk mitigation measures", status: "in_progress" },
            { id: "req-4", title: "Conduct testing for risk management", status: "not_started" },
          ],
        },
        {
          id: "sec-2",
          title: "Data Governance",
          article: "Article 10",
          items: [
            { id: "req-5", title: "Implement data governance practices", status: "not_started" },
            { id: "req-6", title: "Document training data characteristics", status: "not_started" },
            { id: "req-7", title: "Ensure data quality for training sets", status: "not_started" },
            { id: "req-8", title: "Address bias in training data", status: "not_started" },
          ],
        },
        {
          id: "sec-3",
          title: "Technical Documentation",
          article: "Article 11",
          items: [
            { id: "req-9", title: "Create comprehensive technical documentation", status: "in_progress" },
            { id: "req-10", title: "Document system architecture", status: "complete" },
            { id: "req-11", title: "Document training methodology", status: "not_started" },
          ],
        },
        {
          id: "sec-4",
          title: "Human Oversight",
          article: "Article 14",
          items: [
            { id: "req-12", title: "Enable human oversight mechanisms", status: "complete" },
            { id: "req-13", title: "Document human review procedures", status: "in_progress" },
          ],
        },
      ],
    },
    documents: [
      { id: "doc-1", name: "Risk Assessment Report", type: "PDF", status: "generated", createdAt: "2024-12-05", size: "1.2 MB" },
      { id: "doc-2", name: "Technical Documentation", type: "PDF", status: "draft", createdAt: "2024-12-10", size: "890 KB" },
      { id: "doc-3", name: "System Architecture", type: "PDF", status: "generated", createdAt: "2024-11-20", size: "2.1 MB" },
      { id: "doc-4", name: "Data Governance Policy", type: "PDF", status: "generated", createdAt: "2024-11-15", size: "520 KB" },
      { id: "doc-5", name: "Bias Mitigation Report", type: "PDF", status: "draft", createdAt: "2024-11-10", size: "1.5 MB" },
      { id: "doc-6", name: "Model Card", type: "PDF", status: "generated", createdAt: "2024-10-28", size: "340 KB" },
      { id: "doc-7", name: "Training Data Summary", type: "PDF", status: "pending", createdAt: "2024-10-20", size: "2.8 MB" },
      { id: "doc-8", name: "Human Oversight Procedures", type: "PDF", status: "generated", createdAt: "2024-10-15", size: "410 KB" },
      { id: "doc-9", name: "Conformity Assessment", type: "PDF", status: "draft", createdAt: "2024-10-10", size: "1.1 MB" },
      { id: "doc-10", name: "EU Declaration of Conformity", type: "PDF", status: "pending", createdAt: "2024-10-05", size: "280 KB" },
      { id: "doc-11", name: "Incident Response Plan", type: "PDF", status: "generated", createdAt: "2024-09-28", size: "650 KB" },
      { id: "doc-12", name: "Post-Market Monitoring Plan", type: "PDF", status: "draft", createdAt: "2024-09-20", size: "720 KB" },
    ],
    evidence: [
      { id: "ev-1", name: "risk_management_policy.pdf", type: "PDF", uploadedAt: "2024-12-01", uploadedBy: "David Park", linkedTo: "Risk Management System", size: "450 KB" },
      { id: "ev-2", name: "bias_audit_report.pdf", type: "PDF", uploadedAt: "2024-11-28", uploadedBy: "Sarah Chen", linkedTo: "Data Governance", size: "780 KB" },
      { id: "ev-3", name: "human_review_logs.csv", type: "CSV", uploadedAt: "2024-12-08", uploadedBy: "John Miller", linkedTo: "Human Oversight", size: "125 KB" },
      { id: "ev-4", name: "training_data_manifest.xlsx", type: "XLSX", uploadedAt: "2024-11-25", uploadedBy: "Olivia Rhye", linkedTo: "Data Governance", size: "2.3 MB" },
      { id: "ev-5", name: "model_validation_results.pdf", type: "PDF", uploadedAt: "2024-11-20", uploadedBy: "David Park", linkedTo: "Technical Documentation", size: "1.8 MB" },
      { id: "ev-6", name: "fairness_metrics.json", type: "JSON", uploadedAt: "2024-11-18", uploadedBy: "Sarah Chen", linkedTo: "Data Governance", size: "45 KB" },
      { id: "ev-7", name: "system_architecture_diagram.png", type: "PNG", uploadedAt: "2024-11-15", uploadedBy: "John Miller", linkedTo: "Technical Documentation", size: "3.2 MB" },
      { id: "ev-8", name: "oversight_committee_minutes.pdf", type: "PDF", uploadedAt: "2024-11-10", uploadedBy: "Olivia Rhye", linkedTo: "Human Oversight", size: "320 KB" },
      { id: "ev-9", name: "data_quality_assessment.pdf", type: "PDF", uploadedAt: "2024-11-05", uploadedBy: "David Park", linkedTo: "Data Governance", size: "890 KB" },
      { id: "ev-10", name: "incident_log_q4.csv", type: "CSV", uploadedAt: "2024-10-30", uploadedBy: "Sarah Chen", linkedTo: "Risk Management System", size: "156 KB" },
      { id: "ev-11", name: "user_feedback_analysis.pdf", type: "PDF", uploadedAt: "2024-10-25", uploadedBy: "John Miller", linkedTo: "Human Oversight", size: "540 KB" },
      { id: "ev-12", name: "compliance_checklist_signed.pdf", type: "PDF", uploadedAt: "2024-10-20", uploadedBy: "Olivia Rhye", linkedTo: "Risk Management System", size: "180 KB" },
    ],
    activity: [
      { id: "act-1", user: "David Park", avatarUrl: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80", action: "started working on", target: "Technical Documentation", time: "3 hours ago" },
      { id: "act-2", user: "Sarah Chen", avatarUrl: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80", action: "uploaded evidence", target: "bias_audit_report.pdf", time: "2 days ago" },
      { id: "act-3", user: "John Miller", avatarUrl: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80", action: "marked requirement complete", target: "Enable human oversight", time: "4 days ago" },
      { id: "act-4", user: "Olivia Rhye", avatarUrl: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80", action: "generated document", target: "Risk Assessment Report", time: "1 week ago" },
      { id: "act-5", user: "David Park", avatarUrl: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80", action: "uploaded evidence", target: "model_validation_results.pdf", time: "1 week ago" },
      { id: "act-6", user: "Sarah Chen", avatarUrl: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80", action: "marked requirement complete", target: "Document system architecture", time: "2 weeks ago" },
      { id: "act-7", user: "John Miller", avatarUrl: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80", action: "generated document", target: "Human Oversight Procedures", time: "2 weeks ago" },
      { id: "act-8", user: "Olivia Rhye", avatarUrl: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80", action: "uploaded evidence", target: "training_data_manifest.xlsx", time: "3 weeks ago" },
      { id: "act-9", user: "David Park", avatarUrl: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80", action: "started working on", target: "Data Governance Policy", time: "3 weeks ago" },
      { id: "act-10", user: "Sarah Chen", avatarUrl: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80", action: "generated document", target: "Model Card", time: "1 month ago" },
      { id: "act-11", user: "John Miller", avatarUrl: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80", action: "uploaded evidence", target: "system_architecture_diagram.png", time: "1 month ago" },
      { id: "act-12", user: "Olivia Rhye", avatarUrl: "https://www.untitledui.com/images/avatars/olivia-rhye?fm=webp&q=80", action: "marked requirement complete", target: "Establish risk management system", time: "1 month ago" },
    ],
  },
  // AI Agent system with full audit trail
  "system-03": {
    id: "system-03",
    name: "Customer Support Agent",
    description: "Autonomous AI agent that handles customer inquiries, processes refunds, and escalates complex issues to human agents.",
    riskLevel: "high",
    status: "in_progress",
    progress: 78,
    provider: "LangChain",
    modelName: "GPT-4 Turbo",
    category: "Customer Service / AI Agent",
    deploymentStatus: "Production",
    createdAt: "2024-06-15",
    updatedAt: "2024-12-16",
    type: "ai_agent",
    lifecycleStatus: "active",
    sdkStatus: "connected",
    agentFramework: "LangChain",
    lastActivity: "3 minutes ago",
    eventsLogged: 12847,
    // Multi-agent configuration
    agentRole: "coordinator",
    relatedAgents: [
      { id: "system-04", name: "Data Analysis Agent", relationship: "specialist", delegationsToday: 23, avgDelegationTime: 1.8 },
      { id: "system-05", name: "Email Composer Agent", relationship: "specialist", delegationsToday: 15, avgDelegationTime: 2.1 },
      { id: "system-06", name: "Knowledge Base Agent", relationship: "specialist", delegationsToday: 9, avgDelegationTime: 0.9 },
    ],
    multiAgentStats: {
      delegationsToday: 47,
      avgDelegationTime: 2.3,
    },
    // Certification - pending (not all requirements met)
    certification: {
      status: "pending",
      requirements: {
        allRequirementsComplete: false,
        sdkConnectedDays: 32,
        hitlRulesActive: true,
        noHighSeverityIncidents: false,
        humanOversightRate: 1.9,
        errorRate: 3.2,
      },
    },
    auditStatistics: {
      totalActions: 12847,
      totalActionsChange: 23,
      toolCalls: 3421,
      toolCallsChange: 18,
      decisionsMade: 1892,
      decisionsMadeChange: 12,
      humanOverrides: 247,
      humanOverridesChange: -5,
      errors: 12,
      errorsChange: -31,
      humanOversightRate: 1.9,
      escalationRate: 14.7,
      avgResponseTime: 2.3,
      avgTokensPerAction: 1247,
    },
    auditEvents: [
      {
        id: "evt-000",
        timestamp: "2024-12-16T14:23:01Z",
        type: "agent_delegation",
        action: "delegate_task",
        details: { 
          fromAgent: "Customer Support Agent", 
          toAgent: "Data Analysis Agent", 
          task: "Analyze Q4 sales data",
          contextPassed: "order_ids, date_range",
          priority: "High"
        },
        traceId: "trace_abc123",
        sessionId: "sess_8x7k",
        duration: 2.3,
      },
      {
        id: "evt-001",
        timestamp: "2024-12-16T14:23:05Z",
        type: "action_completed",
        action: "process_refund",
        details: { amount: 247.00, customerId: "#12847", status: "success" },
        traceId: "trace_abc123",
        sessionId: "sess_8x7k",
        duration: 1.2,
        tokens: 847,
      },
      {
        id: "evt-002",
        timestamp: "2024-12-16T14:23:04Z",
        type: "human_override",
        action: "process_refund",
        details: { hitlRule: "High-value refund approval", amount: 247.00 },
        overrideBy: "sarah.chen@company.com",
        overrideDecision: "approved",
        overrideReason: "Approved - loyal customer exception",
        responseTime: 45,
      },
      {
        id: "evt-003",
        timestamp: "2024-12-16T14:23:03Z",
        type: "decision_made",
        action: "escalate_to_human",
        details: { reason: "Amount exceeds threshold" },
        confidence: 0.94,
        reasoning: "Refund amount $247 exceeds threshold of $100 - requires human approval",
        alternatives: ["continue_conversation", "deny_refund"],
      },
      {
        id: "evt-004",
        timestamp: "2024-12-16T14:22:58Z",
        type: "tool_call",
        action: "lookup_customer",
        details: { customerId: "#12847", database: "CRM" },
        traceId: "trace_abc123",
        sessionId: "sess_8x7k",
        duration: 0.3,
        tokens: 124,
      },
      {
        id: "evt-005",
        timestamp: "2024-12-16T14:22:55Z",
        type: "agent_invoked",
        action: "start_session",
        details: { channel: "web_chat", userId: "user_9x2m" },
        traceId: "trace_abc123",
        sessionId: "sess_8x7k",
      },
      {
        id: "evt-006",
        timestamp: "2024-12-16T14:15:30Z",
        type: "action_completed",
        action: "send_email",
        details: { recipient: "customer@example.com", template: "order_confirmation" },
        traceId: "trace_def456",
        sessionId: "sess_7y3j",
        duration: 0.8,
        tokens: 523,
      },
      {
        id: "evt-007",
        timestamp: "2024-12-16T14:10:22Z",
        type: "error",
        action: "fetch_order_details",
        details: { error: "API timeout", orderId: "#98765", retryCount: 3 },
        traceId: "trace_ghi789",
        sessionId: "sess_6z4k",
      },
      {
        id: "evt-008",
        timestamp: "2024-12-16T14:05:15Z",
        type: "escalation",
        action: "escalate_to_tier2",
        details: { reason: "Complex technical issue", ticketId: "#TK-4521" },
        traceId: "trace_jkl012",
        sessionId: "sess_5w2m",
        reasoning: "Customer issue requires specialized technical support",
      },
      {
        id: "evt-009",
        timestamp: "2024-12-16T13:58:40Z",
        type: "decision_made",
        action: "apply_discount",
        details: { discountPercent: 15, reason: "Customer retention" },
        confidence: 0.87,
        reasoning: "Customer has been waiting 3+ days for resolution - applying goodwill discount",
        alternatives: ["no_discount", "escalate_to_manager"],
      },
      {
        id: "evt-010",
        timestamp: "2024-12-16T13:45:00Z",
        type: "agent_delegation",
        action: "delegate_to_billing_agent",
        details: { targetAgent: "Billing Support Agent", reason: "Payment dispute" },
        traceId: "trace_mno345",
        sessionId: "sess_4v1n",
      },
    ],
    requirements: {
      completed: 71,
      total: 91,
      sections: [
        {
          id: "sec-1",
          title: "Risk Management System",
          article: "Article 9",
          items: [
            { id: "req-1", title: "Establish risk management system", status: "complete", evidence: "risk_management_policy.pdf" },
            { id: "req-2", title: "Identify and analyze known risks", status: "complete", document: "Risk Assessment Report" },
            { id: "req-3", title: "Implement risk mitigation measures", status: "complete" },
            { id: "req-4", title: "Conduct testing for risk management", status: "in_progress" },
          ],
        },
        {
          id: "sec-2",
          title: "Record-Keeping & Logging",
          article: "Article 12",
          items: [
            { id: "req-5", title: "Automatic logging of agent actions", status: "complete", evidence: "SDK integration active" },
            { id: "req-6", title: "Log retention for compliance period", status: "complete" },
            { id: "req-7", title: "Audit trail accessibility", status: "complete" },
            { id: "req-8", title: "Log integrity verification", status: "in_progress" },
          ],
        },
        {
          id: "sec-3",
          title: "Human Oversight",
          article: "Article 14",
          items: [
            { id: "req-9", title: "Human-in-the-loop mechanisms", status: "complete" },
            { id: "req-10", title: "Override capability for all actions", status: "complete" },
            { id: "req-11", title: "Emergency stop functionality", status: "complete" },
            { id: "req-12", title: "Human review procedures documented", status: "in_progress" },
          ],
        },
      ],
    },
    documents: [
      { id: "doc-1", name: "Risk Assessment Report", type: "PDF", status: "generated", createdAt: "2024-12-05", size: "1.2 MB" },
      { id: "doc-2", name: "Agent Architecture Documentation", type: "PDF", status: "generated", createdAt: "2024-12-10", size: "2.4 MB" },
      { id: "doc-3", name: "HITL Procedures Manual", type: "PDF", status: "generated", createdAt: "2024-11-20", size: "890 KB" },
    ],
    evidence: [
      { id: "ev-1", name: "sdk_integration_proof.pdf", type: "PDF", uploadedAt: "2024-12-01", uploadedBy: "David Park", linkedTo: "Record-Keeping & Logging", size: "450 KB" },
      { id: "ev-2", name: "hitl_audit_logs.csv", type: "CSV", uploadedAt: "2024-11-28", uploadedBy: "Sarah Chen", linkedTo: "Human Oversight", size: "2.1 MB" },
    ],
    activity: [
      { id: "act-1", user: "System", avatarUrl: "", action: "SDK event received", target: "process_refund completed", time: "3 minutes ago" },
      { id: "act-2", user: "Sarah Chen", avatarUrl: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80", action: "approved HITL request", target: "High-value refund", time: "3 minutes ago" },
      { id: "act-3", user: "David Park", avatarUrl: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80", action: "updated HITL rule", target: "Refund threshold", time: "2 hours ago" },
    ],
  },
};

// Config objects
export const riskLevelConfig = {
  high: { label: "High Risk", color: "warning" as const },
  limited: { label: "Limited Risk", color: "blue" as const },
  minimal: { label: "Minimal Risk", color: "success" as const },
};

export const statusConfig = {
  compliant: { label: "Compliant", color: "success" as const },
  in_progress: { label: "In Progress", color: "warning" as const },
  not_started: { label: "Not Started", color: "gray" as const },
};

export const lifecycleStatusConfig: Record<LifecycleStatus, { label: string; dotColor: string }> = {
  draft: { label: "Draft", dotColor: "bg-gray-400" },
  active: { label: "Active", dotColor: "bg-success-500" },
  paused: { label: "Paused", dotColor: "bg-warning-500" },
  archived: { label: "Archived", dotColor: "bg-gray-400" },
};

export const sdkStatusConfig: Record<SDKStatus, { label: string; color: "success" | "error" | "gray" }> = {
  connected: { label: "Connected", color: "success" },
  disconnected: { label: "Disconnected", color: "error" },
  not_applicable: { label: "N/A", color: "gray" },
};

export const auditEventTypeConfig: Record<AuditEventType, { label: string; icon: string; color: string }> = {
  agent_invoked: { label: "Agent Invoked", icon: "▶", color: "text-blue-600 bg-blue-50" },
  tool_call: { label: "Tool Call", icon: "🔧", color: "text-gray-600 bg-gray-50" },
  decision_made: { label: "Decision Made", icon: "🧠", color: "text-purple-600 bg-purple-50" },
  human_override: { label: "Human Override", icon: "👤", color: "text-orange-600 bg-orange-50" },
  action_completed: { label: "Action Completed", icon: "✓", color: "text-success-600 bg-success-50" },
  error: { label: "Error", icon: "✕", color: "text-error-600 bg-error-50" },
  escalation: { label: "Escalation", icon: "⚠", color: "text-warning-600 bg-warning-50" },
  agent_delegation: { label: "Agent Delegation", icon: "🔄", color: "text-teal-600 bg-teal-50" },
  emergency_stop: { label: "Emergency Stop", icon: "🛑", color: "text-error-600 bg-error-50" },
};

export const systemTypeConfig: Record<SystemType, { label: string; icon: string }> = {
  ai_agent: { label: "AI Agent", icon: "🤖" },
  llm_application: { label: "LLM Application", icon: "💬" },
  ml_model: { label: "ML Model", icon: "🧠" },
  automated_decision: { label: "Automated Decision", icon: "⚖️" },
  other: { label: "Other", icon: "📦" },
};

export const ITEMS_PER_PAGE = 8;
