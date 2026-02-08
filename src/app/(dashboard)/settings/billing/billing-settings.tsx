"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, Cpu, FolderOpen, People, Chart, TickCircle, Crown } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import { useToast } from "@/components/base/toast/toast";
import { UpgradePlanModal } from "@/components/application/modals/upgrade-plan-modal";
import { PaymentMethodSlideout } from "@/components/application/slideout-menus/payment-method-slideout";
import { BillingHistoryTable } from "./components/billing-history-table";
import { useBilling } from "@/hooks";

interface UsageItem {
  label: string;
  used: number;
  limit: number;
  icon: typeof Cpu;
}

export const BillingSettings = () => {
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  
  const { 
    subscription, 
    plans, 
    paymentMethods,
    invoices,
    isLoading, 
    openBillingPortal, 
    createCheckout, 
    refetch,
    fetchPaymentMethods,
    setDefaultPaymentMethod,
    fetchInvoices,
  } = useBilling();

  // Fetch payment methods when slideout opens
  useEffect(() => {
    if (isPaymentMethodOpen) {
      fetchPaymentMethods();
    }
  }, [isPaymentMethodOpen, fetchPaymentMethods]);

  // Fetch invoices on mount
  useEffect(() => {
    const loadInvoices = async () => {
      setIsLoadingInvoices(true);
      await fetchInvoices();
      setIsLoadingInvoices(false);
    };
    loadInvoices();
  }, [fetchInvoices]);

  // Refetch data when returning from Stripe checkout (handled by parent for UI)
  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "true") {
      refetch();
    }
  }, [searchParams, refetch]);

  // Calculate usage items based on subscription limits
  // TODO: Replace mock "used" values with real usage data from API
  const limits = subscription?.plan?.limits as Record<string, number> | undefined;
  const usageItems: UsageItem[] = [
    { 
      label: "AI Systems", 
      used: 0, // TODO: Fetch from API
      limit: limits?.ai_systems ?? 1, 
      icon: Cpu 
    },
    { 
      label: "Documents/mo", 
      used: 0, // TODO: Fetch from API
      limit: limits?.documents_per_month ?? 2, 
      icon: FolderOpen 
    },
    { 
      label: "Team Members", 
      used: 1, // Current user always counts as 1
      limit: limits?.team_members ?? 1, 
      icon: People 
    },
    { 
      label: "Quick Comply/mo", 
      used: 0, // TODO: Fetch from API
      limit: limits?.quick_comply_sessions ?? 1, 
      icon: Chart 
    },
  ];

  const handleChangePlan = () => {
    setIsUpgradeModalOpen(true);
  };

  const handlePlanSelected = (planId: string) => {
    addToast({
      title: "Plan Updated",
      message: `Your subscription has been updated to the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan.`,
      type: "success",
    });
  };

  const handleManageBilling = async () => {
    if (subscription?.isFreePlan) {
      addToast({
        title: "No Billing Account",
        message: "Upgrade to a paid plan to access billing management.",
        type: "info",
      });
      return;
    }

    setIsLoadingPortal(true);
    try {
      const url = await openBillingPortal();
      if (url) {
        window.location.href = url;
      } else {
        addToast({
          title: "Error",
          message: "Failed to open billing portal. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      addToast({
        title: "Error",
        message: "Failed to open billing portal.",
        type: "error",
      });
    } finally {
      setIsLoadingPortal(false);
    }
  };

  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6">
          {/* Section Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-secondary pb-5">
            <div>
              <h2 className="text-lg font-semibold text-primary">Billing & Subscription</h2>
              <p className="mt-1 text-sm text-tertiary">
                Manage your subscription plan and billing information.
              </p>
            </div>
          </div>

          {/* Current Plan - Two column layout */}
          <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[240px_1fr] lg:gap-12">
            <div>
              <label className="text-sm font-medium text-secondary">Current Plan</label>
              <p className="mt-0.5 text-xs text-tertiary">Your active subscription tier</p>
            </div>
            <div>
              <div className="rounded-xl border border-secondary bg-primary p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50">
                      <Card size={24} color="currentColor" variant="Bold" className="text-brand-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-primary">
                          {subscription?.plan?.name || "Free"}
                        </h3>
                        <Badge size="sm" color={subscription?.isFreePlan ? "gray" : "brand"}>
                          {subscription?.isFreePlan ? "Free Plan" : "Current Plan"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-2xl font-bold text-primary">
                        {subscription?.isFreePlan ? (
                          "€0"
                        ) : (
                          `€${((subscription?.plan?.priceMonthly || 0) / 100).toFixed(0)}`
                        )}
                        <span className="text-sm font-normal text-tertiary">/month</span>
                      </p>
                      {subscription?.currentPeriodEnd && !subscription?.isFreePlan && (
                        <p className="mt-2 text-sm text-tertiary">
                          Next billing date: {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                      )}
                      {subscription?.cancelAtPeriodEnd && (
                        <p className="mt-2 text-sm text-warning-600">
                          Cancels at end of billing period
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!subscription?.isFreePlan && (
                      <Button 
                        color="primary" 
                        size="md" 
                        onClick={handleManageBilling}
                        isLoading={isLoadingPortal}
                      >
                        Manage
                      </Button>
                    )}
                    <Button color="secondary" size="md" onClick={handleChangePlan}>
                      {subscription?.isFreePlan ? "Upgrade" : "Change Plan"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="h-px w-full border-none bg-border-secondary" />

          {/* Usage This Month - Two column layout */}
          <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[240px_1fr] lg:gap-12">
            <div>
              <label className="text-sm font-medium text-secondary">Usage This Month</label>
              <p className="mt-0.5 text-xs text-tertiary">Track your resource consumption</p>
            </div>
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {usageItems.map((item) => {
                  const Icon = item.icon;
                  const hasLimit = item.limit > 0;
                  const isUnlimited = item.limit === -1;
                  const percentage = hasLimit && !isUnlimited 
                    ? Math.min(Math.round((item.used / item.limit) * 100), 100) 
                    : 0;
                  const isOverLimit = hasLimit && !isUnlimited && item.used > item.limit;
                  const isStorageItem = item.label.includes("Storage");
                  
                  // Format the limit display
                  const formatValue = (val: number) => isStorageItem ? `${val}` : val;
                  const limitDisplay = isUnlimited 
                    ? "Unlimited" 
                    : hasLimit 
                      ? formatValue(item.limit) 
                      : "0";
                  
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 rounded-lg border border-secondary p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                        <Icon size={20} color="currentColor" className="text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-primary truncate">{item.label}</p>
                          <p className="text-sm text-tertiary whitespace-nowrap">
                            {formatValue(item.used)} of {limitDisplay}
                          </p>
                        </div>
                        <div className="mt-2 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              !hasLimit && !isUnlimited 
                                ? "bg-gray-300" 
                                : isOverLimit 
                                  ? "bg-error-500" 
                                  : percentage >= 80 
                                    ? "bg-warning-500" 
                                    : "bg-brand-500"
                            }`}
                            style={{ width: `${!hasLimit && !isUnlimited ? 100 : hasLimit ? percentage : 0}%` }}
                          />
                        </div>
                        {!hasLimit && !isUnlimited && (
                          <p className="mt-1 text-xs text-tertiary">Upgrade to unlock</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <hr className="h-px w-full border-none bg-border-secondary" />

          {/* Payment Method - Two column layout */}
          <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[240px_1fr] lg:gap-12">
            <div>
              <label className="text-sm font-medium text-secondary">Payment Method</label>
              <p className="mt-0.5 text-xs text-tertiary">Card used for billing</p>
            </div>
            <div>
              <div className="flex items-center justify-between rounded-lg border border-secondary p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <Card size={20} color="currentColor" className="text-gray-600" />
                  </div>
                  <div>
                    {paymentMethods.length > 0 ? (
                      <>
                        <p className="text-sm font-medium text-primary">
                          {paymentMethods.find(pm => pm.isDefault)?.brand || paymentMethods[0]?.brand} ending in {paymentMethods.find(pm => pm.isDefault)?.last4 || paymentMethods[0]?.last4}
                        </p>
                        <p className="text-sm text-tertiary">
                          Expires {(paymentMethods.find(pm => pm.isDefault)?.expMonth || paymentMethods[0]?.expMonth)?.toString().padStart(2, '0')}/{paymentMethods.find(pm => pm.isDefault)?.expYear || paymentMethods[0]?.expYear}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-primary">No payment method</p>
                        <p className="text-sm text-tertiary">Add a card to subscribe</p>
                      </>
                    )}
                  </div>
                </div>
                <Button 
                  color="secondary" 
                  size="sm" 
                  onClick={() => setIsPaymentMethodOpen(true)}
                >
                  {paymentMethods.length > 0 ? "Manage" : "Add"}
                </Button>
              </div>
            </div>
          </div>

          <hr className="h-px w-full border-none bg-border-secondary" />

          {/* Billing History - Two column layout */}
          <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[240px_1fr] lg:gap-12">
            <div>
              <label className="text-sm font-medium text-secondary">Billing History</label>
              <p className="mt-0.5 text-xs text-tertiary">View and download past invoices</p>
            </div>
            <div>
              <BillingHistoryTable invoices={invoices} isLoading={isLoadingInvoices} />
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onOpenChange={setIsUpgradeModalOpen}
        currentPlan={(subscription?.plan?.slug || "free") as any}
        onSelectPlan={handlePlanSelected}
        createCheckout={createCheckout}
        stripePriceIds={plans.reduce((acc, plan) => {
          if (plan.stripePriceId) {
            acc[plan.slug] = plan.stripePriceId;
          }
          return acc;
        }, {} as Record<string, string>)}
      />

      {/* Payment Method Slideout */}
      <PaymentMethodSlideout
        isOpen={isPaymentMethodOpen}
        onOpenChange={setIsPaymentMethodOpen}
        paymentMethods={paymentMethods}
        onAddCard={async () => {
          // Redirect to Stripe's hosted billing portal to add card
          const url = await openBillingPortal();
          if (url) {
            window.location.href = url;
          } else {
            addToast({
              title: "Error",
              message: "Unable to open payment portal. Please try again.",
              type: "error",
            });
          }
        }}
        onSetDefault={async (cardId) => {
          const success = await setDefaultPaymentMethod(cardId);
          if (success) {
            addToast({
              title: "Default Card Updated",
              message: "Your default payment method has been updated.",
              type: "success",
            });
          }
        }}
      />
    </div>
  );
};

export default BillingSettings;
