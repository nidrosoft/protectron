"use client";

import { useRouter } from "next/navigation";
import { Warning2, ArrowRight2 } from "iconsax-react";
import { ArrowRight } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { ProgressBarBase } from "@/components/base/progress-indicators/progress-indicators";
import { cx } from "@/utils/cx";
import { 
  riskLevelConfig, 
  statusConfig, 
  systemTypeConfig,
  lifecycleStatusConfig,
  sdkStatusConfig,
  agentFrameworkConfig,
  type AISystem 
} from "../data/mock-data";

interface SystemCardGridProps {
  system: AISystem;
}

export const SystemCardGrid = ({ system }: SystemCardGridProps) => {
  const router = useRouter();
  const riskConfig = riskLevelConfig[system.riskLevel];
  const statusCfg = statusConfig[system.status];
  const typeConfig = systemTypeConfig[system.type];
  const lifecycleConfig = lifecycleStatusConfig[system.lifecycleStatus];
  const sdkConfig = sdkStatusConfig[system.sdkStatus];
  const progress = Math.round((system.requirementsComplete / system.requirementsTotal) * 100);
  const isAgent = system.type === "ai_agent";
  const TypeIcon = typeConfig.icon;
  
  // Determine card styling and CTA based on status
  const needsAttention = system.status === "not_started";
  const isInProgress = system.status === "in_progress";
  
  // Get CTA text and color based on status
  // "Start Compliance" = primary (needs attention, vibrant)
  // "Continue Setup" = secondary (already in progress, calmer)
  // "View Details" = secondary (neutral)
  const getCtaConfig = () => {
    if (isInProgress) {
      return { text: "Continue Setup", color: "secondary" as const, highlight: true };
    }
    if (needsAttention) {
      return { text: "Start Compliance", color: "primary" as const, highlight: true };
    }
    return { text: "View Details", color: "secondary" as const, highlight: false };
  };
  
  const ctaConfig = getCtaConfig();

  return (
    <div
      className="flex flex-col rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset transition-shadow hover:shadow-md cursor-pointer"
      onClick={() => router.push(`/ai-systems/${system.id}`)}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          isAgent ? "bg-brand-100" : "bg-gray-100"
        }`}>
          <TypeIcon size={20} className={isAgent ? "text-brand-600" : "text-gray-600"} color="currentColor" variant="Bold" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-md font-semibold text-primary truncate">{system.name}</h3>
            {/* Lifecycle Status Dot */}
            <span className={`h-2 w-2 rounded-full ${lifecycleConfig.dotColor}`} title={lifecycleConfig.label} />
          </div>
          <p className="text-sm text-tertiary truncate">
            {typeConfig.shortLabel}
            {isAgent && system.agentFramework && ` (${agentFrameworkConfig[system.agentFramework as keyof typeof agentFrameworkConfig]?.label})`}
            {!isAgent && ` • ${system.provider}`}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <BadgeWithDot size="sm" color={riskConfig.color}>
          {riskConfig.label}
        </BadgeWithDot>
        <BadgeWithDot size="sm" color={statusCfg.color}>
          {statusCfg.label}
        </BadgeWithDot>
        {isAgent && (
          <BadgeWithDot size="sm" color={sdkConfig.color}>
            SDK {sdkConfig.label}
          </BadgeWithDot>
        )}
      </div>

      <div className="mt-4 flex-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-tertiary">Requirements</span>
          <span className="font-medium text-secondary">{system.requirementsComplete}/{system.requirementsTotal}</span>
        </div>
        <ProgressBarBase value={progress} className="mt-1.5 h-2" progressClassName="bg-gradient-to-r from-success-600 to-success-400" />
      </div>

      {/* Agent-specific: Events logged */}
      {isAgent && system.eventsLogged !== undefined && system.eventsLogged > 0 && (
        <div className="mt-3 flex items-center justify-between text-xs text-tertiary">
          <span>Actions logged</span>
          <span className="font-medium text-secondary">{system.eventsLogged.toLocaleString()}</span>
        </div>
      )}

      {system.deadline && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-warning-600">
          <Warning2 size={14} color="currentColor" />
          <span className="font-medium">Deadline: {system.deadline}</span>
        </div>
      )}

      {/* Last Activity */}
      <div className="mt-2 text-xs text-quaternary">
        Last activity: {system.lastActivity}
      </div>

      <div className="mt-4 pt-4 border-t border-secondary">
        {/* Custom gradient buttons for actionable states */}
        {needsAttention ? (
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-sm transition-all"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              router.push(`/ai-systems/${system.id}`);
            }}
          >
            Start Compliance
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : isInProgress ? (
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-sm transition-all"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              router.push(`/ai-systems/${system.id}`);
            }}
          >
            Continue Setup
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <Button 
            size="sm" 
            color="secondary"
            className="w-full"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              router.push(`/ai-systems/${system.id}`);
            }}
          >
            View Details
          </Button>
        )}
      </div>
    </div>
  );
};

export default SystemCardGrid;
