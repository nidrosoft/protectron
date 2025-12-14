"use client";

import { useState } from "react";
import {
  TickCircle,
  CloseCircle,
  Crown,
  Flash,
  Building,
  Cpu,
  People,
  FolderOpen,
  Chart,
  Code,
  Headphones,
} from "iconsax-react";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";

type PlanId = "starter" | "growth" | "scale";

interface Plan {
  id: PlanId;
  name: string;
  price: number;
  description: string;
  icon: typeof Crown;
  color: string;
  bgColor: string;
  popular?: boolean;
  features: {
    aiSystems: number | "Unlimited";
    storage: string;
    teamMembers: number;
    reportsPerMonth: number | "Unlimited";
    apiAccess: boolean;
    support: string;
    customTemplates: boolean;
  };
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    description: "For small teams getting started with AI compliance",
    icon: Flash,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    features: {
      aiSystems: 3,
      storage: "1GB",
      teamMembers: 2,
      reportsPerMonth: 2,
      apiAccess: false,
      support: "Email",
      customTemplates: false,
    },
  },
  {
    id: "growth",
    name: "Growth",
    price: 299,
    description: "For growing organizations with multiple AI systems",
    icon: Crown,
    color: "text-brand-600",
    bgColor: "bg-brand-100",
    popular: true,
    features: {
      aiSystems: 10,
      storage: "5GB",
      teamMembers: 5,
      reportsPerMonth: 10,
      apiAccess: true,
      support: "Priority",
      customTemplates: false,
    },
  },
  {
    id: "scale",
    name: "Scale",
    price: 999,
    description: "For enterprises with advanced compliance needs",
    icon: Building,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    features: {
      aiSystems: 50,
      storage: "25GB",
      teamMembers: 15,
      reportsPerMonth: "Unlimited",
      apiAccess: true,
      support: "Dedicated",
      customTemplates: true,
    },
  },
];

interface UpgradePlanModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentPlan?: PlanId;
  onSelectPlan?: (planId: PlanId) => void;
}

export const UpgradePlanModal = ({
  isOpen,
  onOpenChange,
  currentPlan = "growth",
  onSelectPlan,
}: UpgradePlanModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClose = () => {
    setSelectedPlan(null);
    setIsProcessing(false);
    onOpenChange(false);
  };

  const handleConfirm = () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    // Simulate checkout redirect
    setTimeout(() => {
      onSelectPlan?.(selectedPlan);
      setIsProcessing(false);
      handleClose();
    }, 1500);
  };

  const FeatureRow = ({ 
    icon: Icon, 
    label, 
    value, 
    isBoolean = false 
  }: { 
    icon: typeof Cpu; 
    label: string; 
    value: string | number | boolean; 
    isBoolean?: boolean;
  }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Icon size={16} color="currentColor" className="text-tertiary" />
        <span className="text-sm text-secondary">{label}</span>
      </div>
      {isBoolean ? (
        value ? (
          <TickCircle size={18} color="currentColor" className="text-success-500" variant="Bold" />
        ) : (
          <CloseCircle size={18} color="currentColor" className="text-gray-300" />
        )
      ) : (
        <span className="text-sm font-medium text-primary">{value}</span>
      )}
    </div>
  );

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-4xl">
              <CloseButton
                onClick={handleClose}
                theme="light"
                size="lg"
                className="absolute top-4 right-4 z-20"
              />

              {/* Header */}
              <div className="border-b border-secondary px-6 py-5">
                <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                  Choose Your Plan
                </AriaHeading>
                <p className="mt-1 text-sm text-tertiary">
                  Select the plan that best fits your compliance needs
                </p>
              </div>

              {/* Content */}
              <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {plans.map((plan) => {
                    const Icon = plan.icon;
                    const isSelected = selectedPlan === plan.id;
                    const isCurrent = currentPlan === plan.id;

                    return (
                      <button
                        key={plan.id}
                        onClick={() => !isCurrent && setSelectedPlan(plan.id)}
                        disabled={isCurrent}
                        className={cx(
                          "relative flex flex-col rounded-xl p-5 text-left transition-all ring-1 ring-inset",
                          isSelected
                            ? "bg-brand-50 ring-2 ring-brand-500"
                            : isCurrent
                            ? "bg-gray-50 ring-gray-200 cursor-not-allowed"
                            : "bg-primary ring-secondary hover:bg-secondary_subtle"
                        )}
                      >
                        {plan.popular && (
                          <Badge
                            size="sm"
                            color="brand"
                            className="absolute -top-2.5 left-1/2 -translate-x-1/2"
                          >
                            Most Popular
                          </Badge>
                        )}

                        {isCurrent && (
                          <Badge
                            size="sm"
                            color="gray"
                            className="absolute -top-2.5 left-1/2 -translate-x-1/2"
                          >
                            Current Plan
                          </Badge>
                        )}

                        <div className={cx("flex h-10 w-10 items-center justify-center rounded-lg", plan.bgColor)}>
                          <Icon size={20} className={plan.color} color="currentColor" variant="Bold" />
                        </div>

                        <h3 className="mt-4 text-lg font-semibold text-primary">{plan.name}</h3>
                        <p className="mt-1 text-sm text-tertiary">{plan.description}</p>

                        <div className="mt-4">
                          <span className="text-3xl font-bold text-primary">${plan.price}</span>
                          <span className="text-sm text-tertiary">/month</span>
                        </div>

                        <div className="mt-4 flex-1 border-t border-secondary pt-4">
                          <FeatureRow icon={Cpu} label="AI Systems" value={plan.features.aiSystems} />
                          <FeatureRow icon={FolderOpen} label="Storage" value={plan.features.storage} />
                          <FeatureRow icon={People} label="Team Members" value={plan.features.teamMembers} />
                          <FeatureRow icon={Chart} label="Reports/month" value={plan.features.reportsPerMonth} />
                          <FeatureRow icon={Code} label="API Access" value={plan.features.apiAccess} isBoolean />
                          <FeatureRow icon={Headphones} label="Support" value={plan.features.support} />
                        </div>

                        {isSelected && (
                          <div className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-brand-600">
                            <TickCircle size={16} color="currentColor" variant="Bold" />
                            Selected
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Enterprise CTA */}
                <div className="mt-6 rounded-xl border border-secondary bg-secondary_subtle p-5">
                  <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div>
                      <h4 className="text-md font-semibold text-primary">Need more?</h4>
                      <p className="mt-1 text-sm text-tertiary">
                        Contact us for custom enterprise pricing with unlimited everything.
                      </p>
                    </div>
                    <Button size="md" color="secondary">
                      Contact Sales
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-secondary px-6 py-4">
                <p className="text-xs text-tertiary">
                  You can cancel or change your plan at any time.
                </p>
                <div className="flex gap-3">
                  <Button size="md" color="secondary" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    size="md"
                    onClick={handleConfirm}
                    isDisabled={!selectedPlan || isProcessing}
                  >
                    {isProcessing ? "Processing..." : selectedPlan ? `Upgrade to ${plans.find(p => p.id === selectedPlan)?.name}` : "Select a Plan"}
                  </Button>
                </div>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};

export default UpgradePlanModal;
