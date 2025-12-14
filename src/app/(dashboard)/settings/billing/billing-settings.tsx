"use client";

import { useState } from "react";
import { Card, Receipt, Cpu, FolderOpen, People, Chart } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import { useToast } from "@/components/base/toast/toast";
import { UpgradePlanModal } from "@/components/application/modals/upgrade-plan-modal";

interface UsageItem {
  label: string;
  used: number;
  limit: number;
  icon: typeof Cpu;
}

const usageItems: UsageItem[] = [
  { label: "AI Systems", used: 5, limit: 10, icon: Cpu },
  { label: "Storage", used: 1.2, limit: 5, icon: FolderOpen },
  { label: "Team Members", used: 3, limit: 5, icon: People },
  { label: "Reports Generated", used: 4, limit: 10, icon: Chart },
];

export const BillingSettings = () => {
  const { addToast } = useToast();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [currentPlan] = useState({
    name: "Growth",
    price: 299,
    billingCycle: "monthly",
    nextBillingDate: "January 12, 2026",
  });

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

  const handleUpdatePayment = () => {
    addToast({
      title: "Update Payment",
      message: "Payment method update modal would open here.",
      type: "info",
    });
  };

  const handleViewInvoices = () => {
    addToast({
      title: "View Invoices",
      message: "Invoices page would open here.",
      type: "info",
    });
  };

  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
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
                        <h3 className="text-lg font-semibold text-primary">{currentPlan.name}</h3>
                        <Badge size="sm" color="brand">Current Plan</Badge>
                      </div>
                      <p className="mt-1 text-2xl font-bold text-primary">
                        ${currentPlan.price}
                        <span className="text-sm font-normal text-tertiary">/month</span>
                      </p>
                      <p className="mt-2 text-sm text-tertiary">
                        Next billing date: {currentPlan.nextBillingDate}
                      </p>
                    </div>
                  </div>
                  <Button color="secondary" size="md" onClick={handleChangePlan}>
                    Change Plan
                  </Button>
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
                  const percentage = Math.round((item.used / item.limit) * 100);
                  const isStorageItem = item.label === "Storage";
                  
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 rounded-lg border border-secondary p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                        <Icon size={20} color="currentColor" className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-primary">{item.label}</p>
                          <p className="text-sm text-tertiary">
                            {isStorageItem ? `${item.used}GB` : item.used} of {isStorageItem ? `${item.limit}GB` : item.limit}
                          </p>
                        </div>
                        <div className="mt-2 h-2 w-full rounded-full bg-gray-100">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              percentage >= 80 ? "bg-warning-500" : "bg-brand-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
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
                    <p className="text-sm font-medium text-primary">Visa ending in 4242</p>
                    <p className="text-sm text-tertiary">Expires 12/2026</p>
                  </div>
                </div>
                <Button color="secondary" size="sm" onClick={handleUpdatePayment}>
                  Update
                </Button>
              </div>
            </div>
          </div>

          <hr className="h-px w-full border-none bg-border-secondary" />

          {/* Invoices - Two column layout */}
          <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[240px_1fr] lg:gap-12">
            <div>
              <label className="text-sm font-medium text-secondary">Invoices</label>
              <p className="mt-0.5 text-xs text-tertiary">Download past invoices</p>
            </div>
            <div>
              <div className="flex items-center justify-between rounded-lg border border-secondary p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <Receipt size={20} color="currentColor" className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">Billing History</p>
                    <p className="text-sm text-tertiary">12 invoices available</p>
                  </div>
                </div>
                <Button color="secondary" size="sm" onClick={handleViewInvoices}>
                  View All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onOpenChange={setIsUpgradeModalOpen}
        currentPlan="growth"
        onSelectPlan={handlePlanSelected}
      />
    </div>
  );
};

export default BillingSettings;
