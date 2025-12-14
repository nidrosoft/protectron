"use client";

import { useRouter } from "next/navigation";
import { Cpu, Warning2 } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { ProgressBarBase } from "@/components/base/progress-indicators/progress-indicators";
import { riskLevelConfig, statusConfig, type AISystem } from "../data/mock-data";

interface SystemCardListProps {
  system: AISystem;
}

export const SystemCardList = ({ system }: SystemCardListProps) => {
  const router = useRouter();
  const riskConfig = riskLevelConfig[system.riskLevel];
  const statusCfg = statusConfig[system.status];
  const progress = Math.round((system.requirementsComplete / system.requirementsTotal) * 100);

  return (
    <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        {/* Left: System Info */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100">
            <Cpu size={24} className="text-brand-600" color="currentColor" variant="Bold" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">{system.name}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="text-tertiary">Risk:</span>
                <BadgeWithDot size="sm" color={riskConfig.color}>
                  {riskConfig.label}
                </BadgeWithDot>
              </span>
              <span className="text-quaternary">│</span>
              <span className="text-tertiary">
                Provider: <span className="text-secondary">{system.provider}</span>
              </span>
              <span className="text-quaternary">│</span>
              <span className="flex items-center gap-1.5">
                <span className="text-tertiary">Status:</span>
                <BadgeWithDot size="sm" color={statusCfg.color}>
                  {statusCfg.label}
                </BadgeWithDot>
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-tertiary">
              <span>
                Requirements: <span className="font-medium text-secondary">{system.requirementsComplete}/{system.requirementsTotal}</span> complete
              </span>
              <span>│</span>
              <span>
                Documents: <span className="font-medium text-secondary">{system.documentsGenerated}</span> generated
              </span>
            </div>
            {system.deadline && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-warning-50 px-3 py-1.5">
                <Warning2 size={16} className="text-warning-600" color="currentColor" />
                <span className="text-sm font-medium text-warning-700">
                  Deadline: {system.deadline} ({system.daysRemaining} days)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 lg:shrink-0">
          <Button 
            size="sm" 
            color="secondary"
            onClick={() => router.push(`/ai-systems/${system.id}`)}
          >
            View Details
          </Button>
          {system.status === "in_progress" && (
            <Button 
              size="sm"
              onClick={() => router.push(`/ai-systems/${system.id}`)}
            >
              Continue Setup
            </Button>
          )}
          {system.status === "compliant" && (
            <Button 
              size="sm" 
              color="secondary"
              onClick={() => {
                console.log("Generate report for:", system.id);
                alert("Report generation started!");
              }}
            >
              Generate Report
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {system.status !== "compliant" && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-tertiary">Progress</span>
            <span className="font-medium text-primary">{progress}%</span>
          </div>
          <ProgressBarBase value={progress} className="mt-1.5 h-2" progressClassName="bg-gradient-to-r from-success-600 to-success-400" />
        </div>
      )}
    </div>
  );
};

export default SystemCardList;
