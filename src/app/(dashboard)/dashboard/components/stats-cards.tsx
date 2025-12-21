"use client";

import Link from "next/link";
import { Cpu, DocumentText, ArrowRight, Danger } from "iconsax-react";
import { Badge } from "@/components/base/badges/badges";

interface DocumentStats {
  total: number;
  byType: {
    technical: number;
    risk: number;
    policy: number;
    model_card: number;
  };
}

interface PendingActionsStats {
  total: number;
  urgent: number;
  upcoming: number;
}

interface StatsCardsProps {
  totalSystems: number;
  compliantCount: number;
  inProgressCount: number;
  notStartedCount: number;
  documents: DocumentStats;
  pendingActions: PendingActionsStats;
}

export const StatsCards = ({
  totalSystems,
  compliantCount,
  inProgressCount,
  notStartedCount,
  documents,
  pendingActions,
}: StatsCardsProps) => {
  // Calculate document type counts for display
  const technicalAndRisk = documents.byType.technical + documents.byType.risk;
  const policyAndModelCard = documents.byType.policy + documents.byType.model_card;

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {/* AI Systems Card */}
      <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
            <Cpu size={20} color="currentColor" className="text-brand-600" variant="Bold" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-display-sm font-semibold text-primary">{totalSystems}</p>
          <p className="text-sm text-tertiary">AI Systems</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge color="success" size="sm">{compliantCount} Compliant</Badge>
          <Badge color="warning" size="sm">{inProgressCount} In Progress</Badge>
          <Badge color="gray" size="sm">{notStartedCount} Not Started</Badge>
        </div>
        <Link href="/ai-systems" className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
          View all <ArrowRight size={16} color="currentColor" />
        </Link>
      </div>

      {/* Documents Card */}
      <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <DocumentText size={20} color="currentColor" className="text-purple-600" variant="Bold" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-display-sm font-semibold text-primary">{documents.total}</p>
          <p className="text-sm text-tertiary">Documents Generated</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {technicalAndRisk > 0 && <Badge color="gray" size="sm">{technicalAndRisk} Technical/Risk</Badge>}
          {policyAndModelCard > 0 && <Badge color="gray" size="sm">{policyAndModelCard} Policies</Badge>}
          {documents.total === 0 && <Badge color="gray" size="sm">No documents yet</Badge>}
        </div>
        <Link href="/documents" className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
          View all <ArrowRight size={16} color="currentColor" />
        </Link>
      </div>

      {/* Pending Actions Card */}
      <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-error-100">
            <Danger size={20} color="currentColor" className="text-error-600" variant="Bold" />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-display-sm font-semibold text-primary">{pendingActions.total}</p>
          <p className="text-sm text-tertiary">Pending Actions</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {pendingActions.urgent > 0 && <Badge color="error" size="sm">{pendingActions.urgent} Urgent</Badge>}
          {pendingActions.upcoming > 0 && <Badge color="warning" size="sm">{pendingActions.upcoming} Upcoming</Badge>}
          {pendingActions.total === 0 && <Badge color="success" size="sm">All caught up!</Badge>}
        </div>
        <Link href="/requirements" className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
          View all <ArrowRight size={16} color="currentColor" />
        </Link>
      </div>
    </div>
  );
};

export default StatsCards;
