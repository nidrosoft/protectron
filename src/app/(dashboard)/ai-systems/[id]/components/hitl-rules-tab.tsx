"use client";

import { useState } from "react";
import { Add, TickCircle, Warning2, Edit2, Trash, Clock, Profile2User } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import { EmergencyStopModal } from "./emergency-stop-modal";
import { AddHITLRuleModal, type HITLRule } from "./add-hitl-rule-modal";
import { type AISystemData } from "../data/mock-data";
import { useHITLRules } from "@/hooks";
import { useToast } from "@/components/base/toast/toast";

interface HITLRulesTabProps {
  system: AISystemData;
  onEmergencyStop?: () => void;
}

// Mock HITL rules data - enhanced with PRD stats
const mockHITLRules = [
  {
    id: "rule-1",
    name: "High-Value Refund Approval",
    description: "Requires human approval for refunds exceeding $100",
    trigger: 'action_name = "process_refund" AND amount > 100',
    timeout: 60,
    timeoutAction: "auto-reject",
    notifyEmail: "finance-team@company.com",
    status: "active",
    stats: {
      triggered: 247,
      approved: 241,
      rejected: 6,
      modified: 0,
      avgResponseTime: 12,
    },
  },
  {
    id: "rule-2",
    name: "Low Confidence Decision Review",
    description: "Review decisions where agent confidence is below 70%",
    trigger: "decision.confidence < 0.7",
    timeout: 30,
    timeoutAction: "escalate",
    notifyEmail: "support-leads@company.com",
    notifySlack: "#agent-alerts",
    status: "active",
    stats: {
      triggered: 89,
      approved: 72,
      rejected: 3,
      modified: 14,
      avgResponseTime: 8,
    },
  },
  {
    id: "rule-3",
    name: "PII Data Access",
    description: "Require approval for accessing customer records or PII data",
    trigger: 'tool_name IN ("access_customer_records", "query_user_database") AND data_category = "pii"',
    timeout: 15,
    timeoutAction: "deny",
    notifyEmail: "privacy-team@company.com",
    status: "active",
    stats: {
      triggered: 1203,
      approved: 1198,
      rejected: 5,
      modified: 0,
      avgResponseTime: 2,
    },
  },
];

export const HITLRulesTab = ({ system, onEmergencyStop }: HITLRulesTabProps) => {
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);
  const [isEmergencyStopModalOpen, setIsEmergencyStopModalOpen] = useState(false);

  // Fetch real HITL rules from API
  const { rules: apiRules, isLoading, createRule } = useHITLRules({
    systemId: system.id,
  });
  const { addToast } = useToast();

  // Use API data if available, fallback to mock data
  const rules = apiRules.length > 0 ? apiRules : mockHITLRules;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-primary">Human-in-the-Loop Rules</h3>
          <p className="mt-1 text-sm text-tertiary">
            Configure when this agent should pause and request human approval before taking action.
          </p>
        </div>
        <Button 
          size="md" 
          iconLeading={({ className }) => <Add size={20} color="currentColor" className={className} />}
          onClick={() => setIsAddRuleModalOpen(true)}
        >
          Add Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-secondary bg-primary p-4">
          <p className="text-2xl font-semibold text-primary">{mockHITLRules.filter(r => r.status === "active").length}</p>
          <p className="text-sm text-tertiary">Active Rules</p>
        </div>
        <div className="rounded-lg border border-secondary bg-primary p-4">
          <p className="text-2xl font-semibold text-primary">{mockHITLRules.reduce((sum, r) => sum + r.stats.triggered, 0).toLocaleString()}</p>
          <p className="text-sm text-tertiary">Total Triggers (30 days)</p>
        </div>
        <div className="rounded-lg border border-secondary bg-primary p-4">
          <p className="text-2xl font-semibold text-primary">
            {Math.round(mockHITLRules.reduce((sum, r) => sum + r.stats.avgResponseTime, 0) / mockHITLRules.length)} min
          </p>
          <p className="text-sm text-tertiary">Avg Response Time</p>
        </div>
      </div>

      {/* Rules List */}
      <div className="flex flex-col gap-4">
        {mockHITLRules.map((rule) => (
          <div key={rule.id} className="rounded-xl border border-secondary bg-primary p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xl">
                  📋
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-primary">{rule.name}</h4>
                    <Badge color={rule.status === "active" ? "success" : "warning"} size="sm">
                      ● {rule.status === "active" ? "Active" : "Paused"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-tertiary">{rule.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" color="secondary" iconLeading={({ className }) => <Edit2 size={16} color="currentColor" className={className} />}>
                  Edit
                </Button>
                <Button size="sm" color="secondary">
                  Disable
                </Button>
              </div>
            </div>

            {/* Rule Details */}
            <div className="mt-4 rounded-lg bg-secondary_subtle p-3">
              <p className="text-xs font-medium text-tertiary uppercase tracking-wide">Trigger</p>
              <code className="mt-1 block font-mono text-sm text-secondary">{rule.trigger}</code>
            </div>

            {/* Timeout & Notify */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5 text-tertiary">
                <Clock size={14} color="currentColor" />
                Timeout: <span className="text-secondary">{rule.timeout} minutes ({rule.timeoutAction} on timeout)</span>
              </span>
              <span className="flex items-center gap-1.5 text-tertiary">
                <Profile2User size={14} color="currentColor" />
                Notify: <span className="text-secondary">{rule.notifyEmail}</span>
              </span>
            </div>

            {/* Stats per rule - matching PRD */}
            <div className="mt-3 pt-3 border-t border-secondary">
              <p className="text-xs text-tertiary mb-2">Stats (30d):</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="text-secondary">
                  <strong className="text-primary">{rule.stats.triggered.toLocaleString()}</strong> triggered
                </span>
                <span className="text-secondary">│</span>
                <span className="text-secondary">
                  <strong className="text-success-600">{rule.stats.approved.toLocaleString()}</strong> approved
                </span>
                {rule.stats.modified > 0 && (
                  <>
                    <span className="text-secondary">│</span>
                    <span className="text-secondary">
                      <strong className="text-warning-600">{rule.stats.modified}</strong> modified
                    </span>
                  </>
                )}
                <span className="text-secondary">│</span>
                <span className="text-secondary">
                  <strong className="text-error-600">{rule.stats.rejected}</strong> rejected
                </span>
              </div>
              <p className="mt-1 text-xs text-tertiary">
                Avg response time: <strong className="text-primary">{rule.stats.avgResponseTime} minutes</strong>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Stop Section */}
      <div className="rounded-xl border-2 border-error-200 bg-error-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-error-100">
            <span className="text-xl">🛑</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-error-700">Emergency Stop</h4>
            <p className="mt-1 text-sm text-error-600">
              Immediately halt all agent actions. Use this in case of unexpected behavior or security concerns.
            </p>
            <Button 
              size="md" 
              color="primary-destructive" 
              className="mt-3"
              onClick={() => setIsEmergencyStopModalOpen(true)}
            >
              Activate Emergency Stop
            </Button>
          </div>
        </div>
      </div>

      {/* Add Rule Modal */}
      <AddHITLRuleModal
        isOpen={isAddRuleModalOpen}
        onOpenChange={setIsAddRuleModalOpen}
        onSave={(rule: HITLRule) => {
          addToast({ type: "success", title: "Rule created", message: `Rule "${rule.name}" created successfully!` });
        }}
      />

      {/* Emergency Stop Modal */}
      <EmergencyStopModal
        isOpen={isEmergencyStopModalOpen}
        onOpenChange={setIsEmergencyStopModalOpen}
        systemName={system.name}
        onConfirm={(reason, notifications) => {
          if (onEmergencyStop) onEmergencyStop();
          addToast({ type: "warning", title: "Emergency Stop activated", message: "Agent has been halted. All stakeholders have been notified." });
        }}
      />
    </div>
  );
};

export default HITLRulesTab;
