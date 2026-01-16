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
  Activity,
  Shield,
  Timer1,
  Award,
} from "iconsax-react";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";

type PlanId = "professional" | "growth" | "scale";

interface Plan {
  id: PlanId;
  name: string;
  price: number;
  currency?: string;
  description: string;
  icon: typeof Crown;
  color: string;
  bgColor: string;
  popular?: boolean;
  features: {
    aiSystems: number | "Unlimited";
    aiAgents: number | string;
    eventsPerMonth: string;
    sdkIntegration: boolean;
    auditTrail: boolean;
    hitlRules: boolean;
    logRetention: string;
    certificationBadges: boolean;
    support: string;
  };
}

const plans: Plan[] = [
  {
    id: "professional",
    name: "Professional",
    price: 99,
    description: "For solo founders and early startups",
    icon: Flash,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    features: {
      aiSystems: 3,
      aiAgents: "1*",
      eventsPerMonth: "10,000",
      sdkIntegration: false,
      auditTrail: false,
      hitlRules: false,
      logRetention: "N/A",
      certificationBadges: false,
      support: "Email",
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
      aiAgents: "3",
      eventsPerMonth: "100,000",
      sdkIntegration: true,
      auditTrail: true,
      hitlRules: true,
      logRetention: "6 months",
      certificationBadges: false,
      support: "Email + Chat",
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
      aiSystems: 25,
      aiAgents: "10",
      eventsPerMonth: "500,000",
      sdkIntegration: true,
      auditTrail: true,
      hitlRules: true,
      logRetention: "12 months",
      certificationBadges: true,
      support: "Priority",
    },
  },
];

interface UpgradePlanModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentPlan?: PlanId | "free";
  onSelectPlan?: (planId: PlanId) => void;
  createCheckout?: (priceId: string, planSlug: string) => Promise<string | null>;
  stripePriceIds?: Record<string, string>;
}

export const UpgradePlanModal = ({
  isOpen,
  onOpenChange,
  currentPlan = "free",
  onSelectPlan,
  createCheckout,
  stripePriceIds = {},
}: UpgradePlanModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setSelectedPlan(null);
    setIsProcessing(false);
    setError(null);
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      // Get the Stripe price ID for the selected plan
      const priceId = stripePriceIds[selectedPlan];
      
      if (!priceId) {
        setError("Price configuration not found. Please contact support.");
        setIsProcessing(false);
        return;
      }

      if (!createCheckout) {
        setError("Checkout not available. Please try again later.");
        setIsProcessing(false);
        return;
      }

      // Create Stripe checkout session and redirect
      const checkoutUrl = await createCheckout(priceId, selectedPlan);
      
      if (checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = checkoutUrl;
      } else {
        setError("Failed to create checkout session. Please try again.");
        setIsProcessing(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsProcessing(false);
    }
  };

  const FeatureRow = ({ 
    label, 
    value, 
    isBoolean = false 
  }: { 
    label: string; 
    value: string | number | boolean; 
    isBoolean?: boolean;
  }) => (
    <div className="flex items-center gap-2 py-1.5">
      {isBoolean ? (
        value ? (
          <TickCircle size={16} color="currentColor" className="text-success-500 shrink-0" variant="Bold" />
        ) : (
          <CloseCircle size={16} color="currentColor" className="text-gray-300 shrink-0" />
        )
      ) : (
        <TickCircle size={16} color="currentColor" className="text-success-500 shrink-0" variant="Bold" />
      )}
      <span className="text-sm text-secondary">
        {label}{!isBoolean && `: ${value}`}
      </span>
    </div>
  );

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-5xl">
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
                          <span className="text-3xl font-bold text-primary">{plan.currency || "€"}{plan.price}</span>
                          <span className="text-sm text-tertiary">/month</span>
                        </div>

                        <div className="mt-4 flex-1 border-t border-secondary pt-4">
                          {/* Always included features first */}
                          <FeatureRow label="AI Systems" value={plan.features.aiSystems} />
                          <FeatureRow label="AI Agents (SDK)" value={plan.features.aiAgents} />
                          <FeatureRow label="Events/month" value={plan.features.eventsPerMonth} />
                          <FeatureRow label="Support" value={plan.features.support} />
                          
                          {/* Conditional features - included ones first */}
                          {plan.features.sdkIntegration && (
                            <FeatureRow label="SDK Integration" value={plan.features.sdkIntegration} isBoolean />
                          )}
                          {plan.features.auditTrail && (
                            <FeatureRow label="Audit Trail & HITL" value={plan.features.auditTrail} isBoolean />
                          )}
                          {plan.features.logRetention !== "N/A" && (
                            <FeatureRow label="Log Retention" value={plan.features.logRetention} />
                          )}
                          {plan.features.certificationBadges && (
                            <FeatureRow label="Certification Badges" value={plan.features.certificationBadges} isBoolean />
                          )}
                          
                          {/* Not included features last */}
                          {!plan.features.sdkIntegration && (
                            <FeatureRow label="SDK Integration" value={plan.features.sdkIntegration} isBoolean />
                          )}
                          {!plan.features.auditTrail && (
                            <FeatureRow label="Audit Trail & HITL" value={plan.features.auditTrail} isBoolean />
                          )}
                          {plan.features.logRetention === "N/A" && (
                            <FeatureRow label="Log Retention" value={false} isBoolean />
                          )}
                          {!plan.features.certificationBadges && (
                            <FeatureRow label="Certification Badges" value={plan.features.certificationBadges} isBoolean />
                          )}
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

              {/* Error Message */}
              {error && (
                <div className="mx-6 mb-4 rounded-lg bg-error-50 border border-error-200 px-4 py-3">
                  <p className="text-sm text-error-700">{error}</p>
                </div>
              )}

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
