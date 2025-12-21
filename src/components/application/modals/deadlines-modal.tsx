"use client";

import { useState, useEffect } from "react";
import { Calendar, Warning2, TickCircle } from "iconsax-react";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";

interface Deadline {
  id: string;
  title: string;
  date: string;
  daysRemaining: number;
  systemsAffected: number;
  riskLevel: "high" | "limited" | "minimal";
  description: string;
}

interface DeadlinesModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const riskColors = {
  high: "error",
  limited: "warning",
  minimal: "success",
} as const;

export const DeadlinesModal = ({ isOpen, onOpenChange }: DeadlinesModalProps) => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchDeadlines();
    }
  }, [isOpen]);

  const fetchDeadlines = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/ai-systems");
      if (response.ok) {
        const result = await response.json();
        const systems = result.data || [];
        
        // Calculate deadlines based on risk levels
        const now = new Date();
        const highRiskDeadline = new Date("2026-08-02");
        const legacyDeadline = new Date("2027-08-02");
        
        const highRiskSystems = systems.filter((s: any) => s.risk_level === "high");
        const limitedRiskSystems = systems.filter((s: any) => s.risk_level === "limited");
        
        const calculatedDeadlines: Deadline[] = [];
        
        if (highRiskSystems.length > 0) {
          const daysRemaining = Math.ceil((highRiskDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          calculatedDeadlines.push({
            id: "high-risk-deadline",
            title: "High-Risk AI Compliance Deadline",
            date: "August 2, 2026",
            daysRemaining,
            systemsAffected: highRiskSystems.length,
            riskLevel: "high",
            description: "All high-risk AI systems must be fully compliant with EU AI Act requirements.",
          });
        }
        
        if (limitedRiskSystems.length > 0) {
          const daysRemaining = Math.ceil((legacyDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          calculatedDeadlines.push({
            id: "limited-risk-deadline",
            title: "Limited-Risk AI Transparency Deadline",
            date: "August 2, 2027",
            daysRemaining,
            systemsAffected: limitedRiskSystems.length,
            riskLevel: "limited",
            description: "All limited-risk AI systems must meet transparency requirements.",
          });
        }
        
        // Add general deadline for all systems
        const gpaiDeadline = new Date("2025-08-02");
        const gpaiDaysRemaining = Math.ceil((gpaiDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (gpaiDaysRemaining > 0) {
          calculatedDeadlines.push({
            id: "gpai-deadline",
            title: "GPAI Provider Obligations",
            date: "August 2, 2025",
            daysRemaining: gpaiDaysRemaining,
            systemsAffected: systems.length,
            riskLevel: "minimal",
            description: "General-purpose AI providers must comply with transparency and documentation requirements.",
          });
        }
        
        setDeadlines(calculatedDeadlines.sort((a, b) => a.daysRemaining - b.daysRemaining));
      }
    } catch (error) {
      console.error("Error fetching deadlines:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-lg">
              <CloseButton
                onClick={() => onOpenChange(false)}
                theme="light"
                size="lg"
                className="absolute top-4 right-4 z-20"
              />

              {/* Header */}
              <div className="border-b border-secondary px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50">
                    <Calendar size={20} color="currentColor" className="text-brand-600" variant="Bold" />
                  </div>
                  <div>
                    <AriaHeading slot="title" className="text-lg font-semibold text-primary">
                      Upcoming Deadlines
                    </AriaHeading>
                    <p className="text-sm text-tertiary">EU AI Act compliance milestones</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto px-6 py-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingIndicator type="dot-circle" size="md" label="Loading deadlines..." />
                  </div>
                ) : deadlines.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <TickCircle size={48} color="currentColor" className="text-success-500" variant="Bold" />
                    <h3 className="mt-4 text-lg font-semibold text-primary">No Upcoming Deadlines</h3>
                    <p className="mt-2 text-sm text-tertiary">
                      You don't have any AI systems with upcoming compliance deadlines.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deadlines.map((deadline) => (
                      <div
                        key={deadline.id}
                        className={cx(
                          "rounded-xl border p-4 transition-colors",
                          deadline.daysRemaining < 180
                            ? "border-error-200 bg-error-50"
                            : deadline.daysRemaining < 365
                            ? "border-warning-200 bg-warning-50"
                            : "border-secondary bg-secondary_subtle"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Warning2
                              size={20}
                              color="currentColor"
                              className={cx(
                                deadline.daysRemaining < 180
                                  ? "text-error-600"
                                  : deadline.daysRemaining < 365
                                  ? "text-warning-600"
                                  : "text-gray-600"
                              )}
                              variant="Bold"
                            />
                            <h4 className="font-semibold text-primary">{deadline.title}</h4>
                          </div>
                          <Badge size="sm" color={riskColors[deadline.riskLevel]}>
                            {deadline.riskLevel.charAt(0).toUpperCase() + deadline.riskLevel.slice(1)} Risk
                          </Badge>
                        </div>
                        
                        <p className="mt-2 text-sm text-tertiary">{deadline.description}</p>
                        
                        <div className="mt-3 flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} color="currentColor" className="text-tertiary" />
                            <span className="font-medium text-primary">{deadline.date}</span>
                          </div>
                          <span className="text-tertiary">•</span>
                          <span
                            className={cx(
                              "font-semibold",
                              deadline.daysRemaining < 180
                                ? "text-error-600"
                                : deadline.daysRemaining < 365
                                ? "text-warning-600"
                                : "text-success-600"
                            )}
                          >
                            {deadline.daysRemaining} days remaining
                          </span>
                          <span className="text-tertiary">•</span>
                          <span className="text-secondary">{deadline.systemsAffected} system(s)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-secondary px-6 py-4">
                <Button
                  size="md"
                  color="secondary"
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};
