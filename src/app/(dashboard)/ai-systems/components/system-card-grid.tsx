"use client";

import { useRouter } from "next/navigation";
import { Cpu, Warning2 } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { ProgressBarBase } from "@/components/base/progress-indicators/progress-indicators";
import { riskLevelConfig, statusConfig, type AISystem } from "../data/mock-data";

interface SystemCardGridProps {
  system: AISystem;
}

export const SystemCardGrid = ({ system }: SystemCardGridProps) => {
  const router = useRouter();
  const riskConfig = riskLevelConfig[system.riskLevel];
  const statusCfg = statusConfig[system.status];
  const progress = Math.round((system.requirementsComplete / system.requirementsTotal) * 100);

  return (
    <div
      className="flex flex-col rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset transition-shadow hover:shadow-md cursor-pointer"
      onClick={() => router.push(`/ai-systems/${system.id}`)}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100">
          <Cpu size={20} className="text-brand-600" color="currentColor" variant="Bold" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-md font-semibold text-primary truncate">{system.name}</h3>
          <p className="text-sm text-tertiary truncate">{system.provider}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <BadgeWithDot size="sm" color={riskConfig.color}>
          {riskConfig.label}
        </BadgeWithDot>
        <BadgeWithDot size="sm" color={statusCfg.color}>
          {statusCfg.label}
        </BadgeWithDot>
      </div>

      <div className="mt-4 flex-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-tertiary">Requirements</span>
          <span className="font-medium text-secondary">{system.requirementsComplete}/{system.requirementsTotal}</span>
        </div>
        <ProgressBarBase value={progress} className="mt-1.5 h-2" progressClassName="bg-gradient-to-r from-success-600 to-success-400" />
      </div>

      {system.deadline && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-warning-600">
          <Warning2 size={14} color="currentColor" />
          <span className="font-medium">Deadline: {system.deadline}</span>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-secondary">
        <Button 
          size="sm" 
          color={system.status === "in_progress" ? "primary" : "secondary"}
          className="w-full"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            router.push(`/ai-systems/${system.id}`);
          }}
        >
          {system.status === "in_progress" ? "Continue Setup" : "View Details"}
        </Button>
      </div>
    </div>
  );
};

export default SystemCardGrid;
