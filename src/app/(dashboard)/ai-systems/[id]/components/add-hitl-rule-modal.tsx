"use client";

import { useState } from "react";
import { Add, Trash, InfoCircle } from "iconsax-react";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";

export interface HITLRule {
  id?: string;
  name: string;
  description: string;
  conditions: TriggerCondition[];
  timeout: number;
  timeoutAction: "approve" | "reject" | "escalate";
  notifyEmail: string;
  notifySlack: string;
}

interface TriggerCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface AddHITLRuleModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (rule: HITLRule) => void;
  editingRule?: HITLRule | null;
}

const fieldOptions = [
  { id: "action_name", label: "Action Name" },
  { id: "amount", label: "Amount" },
  { id: "tool_name", label: "Tool Name" },
  { id: "data_category", label: "Data Category" },
  { id: "confidence", label: "Decision Confidence" },
  { id: "user_type", label: "User Type" },
];

const operatorOptions = [
  { id: "equals", label: "equals" },
  { id: "not_equals", label: "not equals" },
  { id: "greater_than", label: "greater than" },
  { id: "less_than", label: "less than" },
  { id: "contains", label: "contains" },
  { id: "in", label: "in list" },
];

const timeoutOptions = [
  { id: "5", label: "5 minutes" },
  { id: "15", label: "15 minutes" },
  { id: "30", label: "30 minutes" },
  { id: "60", label: "60 minutes" },
  { id: "120", label: "2 hours" },
  { id: "1440", label: "24 hours" },
];

const defaultCondition: TriggerCondition = {
  id: crypto.randomUUID(),
  field: "action_name",
  operator: "equals",
  value: "",
};

const defaultRule: HITLRule = {
  name: "",
  description: "",
  conditions: [{ ...defaultCondition, id: crypto.randomUUID() }],
  timeout: 60,
  timeoutAction: "reject",
  notifyEmail: "",
  notifySlack: "",
};

export const AddHITLRuleModal = ({
  isOpen,
  onOpenChange,
  onSave,
  editingRule,
}: AddHITLRuleModalProps) => {
  const [rule, setRule] = useState<HITLRule>(editingRule || defaultRule);

  const handleClose = () => {
    setRule(defaultRule);
    onOpenChange(false);
  };

  const handleSave = () => {
    if (!rule.name.trim()) {
      return;
    }
    if (rule.conditions.some(c => !c.value.trim())) {
      return;
    }
    onSave(rule);
    setRule(defaultRule);
    onOpenChange(false);
  };

  const addCondition = () => {
    setRule({
      ...rule,
      conditions: [...rule.conditions, { ...defaultCondition, id: crypto.randomUUID() }],
    });
  };

  const removeCondition = (id: string) => {
    if (rule.conditions.length === 1) return;
    setRule({
      ...rule,
      conditions: rule.conditions.filter(c => c.id !== id),
    });
  };

  const updateCondition = (id: string, field: keyof TriggerCondition, value: string) => {
    setRule({
      ...rule,
      conditions: rule.conditions.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <CloseButton 
                onClick={handleClose} 
                theme="light" 
                size="lg" 
                className="absolute top-3 right-3 z-20" 
              />
              
              {/* Header */}
              <div className="border-b border-secondary px-6 py-4">
                <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                  {editingRule ? "Edit HITL Rule" : "Add HITL Rule"}
                </AriaHeading>
                <p className="mt-1 text-sm text-tertiary">
                  Define when this agent should pause and request human approval.
                </p>
              </div>

              {/* Form Content */}
              <div className="flex flex-col gap-6 p-6">
                {/* Basic Info */}
                <div className="flex flex-col gap-4">
                  <Input
                    label="Rule Name *"
                    placeholder="e.g., High-Value Refund Approval"
                    value={rule.name}
                    onChange={(value: string) => setRule({ ...rule, name: value })}
                  />

                  <Input
                    label="Description"
                    placeholder="Describe when and why this rule triggers"
                    value={rule.description}
                    onChange={(value: string) => setRule({ ...rule, description: value })}
                  />
                </div>

                {/* Trigger Conditions */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-primary">Trigger Conditions</h4>
                  </div>
                  <p className="text-xs text-tertiary">When ALL of the following conditions are met:</p>

                  <div className="flex flex-col gap-3">
                    {rule.conditions.map((condition, index) => (
                      <div key={condition.id}>
                        {index > 0 && (
                          <div className="flex items-center gap-2 py-2">
                            <div className="h-px flex-1 bg-secondary" />
                            <span className="text-xs font-medium text-tertiary">AND</span>
                            <div className="h-px flex-1 bg-secondary" />
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Select
                            size="sm"
                            selectedKey={condition.field}
                            onSelectionChange={(key) => updateCondition(condition.id, "field", key as string)}
                            items={fieldOptions}
                            className="w-36"
                          >
                            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                          </Select>
                          <Select
                            size="sm"
                            selectedKey={condition.operator}
                            onSelectionChange={(key) => updateCondition(condition.id, "operator", key as string)}
                            items={operatorOptions}
                            className="w-32"
                          >
                            {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                          </Select>
                          <input
                            type="text"
                            placeholder="Value"
                            value={condition.value}
                            onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
                            className="flex-1 rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary placeholder:text-quaternary focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100"
                          />
                          {rule.conditions.length > 1 && (
                            <Button
                              size="sm"
                              color="secondary"
                              className="!p-2"
                              onClick={() => removeCondition(condition.id)}
                            >
                              <Trash size={16} color="currentColor" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    color="secondary"
                    iconLeading={({ className }) => <Add size={16} color="currentColor" className={className} />}
                    onClick={addCondition}
                    className="w-fit"
                  >
                    Add Condition
                  </Button>
                </div>

                {/* Approval Settings */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-semibold text-primary">Approval Settings</h4>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-primary">Timeout</label>
                      <Select
                        size="md"
                        selectedKey={String(rule.timeout)}
                        onSelectionChange={(key) => setRule({ ...rule, timeout: Number(key) })}
                        items={timeoutOptions}
                        className="mt-1"
                      >
                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-primary">On Timeout</label>
                    <div className="mt-2 flex flex-col gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="timeoutAction"
                          checked={rule.timeoutAction === "approve"}
                          onChange={() => setRule({ ...rule, timeoutAction: "approve" })}
                          className="h-4 w-4 text-brand-600"
                        />
                        <span className="text-sm text-secondary">Auto-approve action</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="timeoutAction"
                          checked={rule.timeoutAction === "reject"}
                          onChange={() => setRule({ ...rule, timeoutAction: "reject" })}
                          className="h-4 w-4 text-brand-600"
                        />
                        <span className="text-sm text-secondary">Auto-reject action</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="timeoutAction"
                          checked={rule.timeoutAction === "escalate"}
                          onChange={() => setRule({ ...rule, timeoutAction: "escalate" })}
                          className="h-4 w-4 text-brand-600"
                        />
                        <span className="text-sm text-secondary">Escalate to secondary approvers</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-semibold text-primary">Notifications</h4>
                  
                  <Input
                    label="Notify via Email"
                    placeholder="e.g., finance-team@company.com"
                    value={rule.notifyEmail}
                    onChange={(value: string) => setRule({ ...rule, notifyEmail: value })}
                    hint="Separate multiple emails with commas"
                  />

                  <Input
                    label="Notify via Slack"
                    placeholder="e.g., #finance-approvals"
                    value={rule.notifySlack}
                    onChange={(value: string) => setRule({ ...rule, notifySlack: value })}
                  />
                </div>

                {/* Info Box */}
                <div className="flex items-start gap-2 rounded-lg bg-brand-50 p-3">
                  <InfoCircle size={18} className="text-brand-600 shrink-0 mt-0.5" color="currentColor" />
                  <p className="text-sm text-brand-700">
                    HITL rules help fulfill EU AI Act Article 14 requirements for human oversight of high-risk AI systems.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-secondary px-6 py-4 flex justify-end gap-3">
                <Button color="secondary" size="lg" onClick={handleClose}>
                  Cancel
                </Button>
                <Button size="lg" onClick={handleSave}>
                  {editingRule ? "Save Changes" : "Create Rule"}
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};

export default AddHITLRuleModal;
