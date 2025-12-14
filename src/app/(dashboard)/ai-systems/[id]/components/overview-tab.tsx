"use client";

import {
  DocumentText,
  Folder,
  TickCircle,
  Clock,
} from "iconsax-react";
import { AlertCircle } from "@untitledui/icons";
import { FeedItem, type FeedItemType } from "@/components/application/activity-feed/activity-feed";
import { ProgressBarBase } from "@/components/base/progress-indicators/progress-indicators";

interface OverviewTabProps {
  system: {
    name: string;
    description: string;
    riskLevel: "high" | "limited" | "minimal";
    progress: number;
    provider: string;
    modelName: string;
    deploymentStatus: string;
    updatedAt: string;
    requirements: {
      completed: number;
      total: number;
    };
    documents: { id: string }[];
    evidence: { id: string }[];
    activity: {
      id: string;
      user: string;
      avatarUrl: string;
      action: string;
      target: string;
      time: string;
    }[];
  };
  onViewAllActivity: () => void;
}

export const OverviewTab = ({ system, onViewAllActivity }: OverviewTabProps) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Progress Card */}
      <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
        <h3 className="text-lg font-semibold text-primary">Compliance Progress</h3>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-tertiary">Overall Progress</span>
              <span className="font-medium text-primary">{system.progress}%</span>
            </div>
            <ProgressBarBase value={system.progress} className="mt-2 h-3" />
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-primary">{system.requirements.completed}/{system.requirements.total}</p>
            <p className="text-sm text-tertiary">Requirements Complete</p>
          </div>
        </div>
        {system.riskLevel === "high" && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-warning-50 px-3 py-2">
            <AlertCircle className="h-5 w-5 text-warning-600" />
            <span className="text-sm font-medium text-warning-700">
              Deadline: Aug 2, 2026 — Full compliance required for high-risk AI
            </span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100">
            <DocumentText size={20} className="text-brand-600" color="currentColor" variant="Bold" />
          </div>
          <p className="mt-3 text-2xl font-semibold text-primary">{system.documents.length}</p>
          <p className="text-sm text-tertiary">Documents</p>
        </div>
        <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <Folder size={20} className="text-purple-600" color="currentColor" variant="Bold" />
          </div>
          <p className="mt-3 text-2xl font-semibold text-primary">{system.evidence.length}</p>
          <p className="text-sm text-tertiary">Evidence Files</p>
        </div>
        <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-100">
            <TickCircle size={20} className="text-success-600" color="currentColor" variant="Bold" />
          </div>
          <p className="mt-3 text-2xl font-semibold text-primary">{system.requirements.completed}</p>
          <p className="text-sm text-tertiary">Completed</p>
        </div>
        <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-100">
            <Clock size={20} className="text-warning-600" color="currentColor" variant="Bold" />
          </div>
          <p className="mt-3 text-2xl font-semibold text-primary">{system.requirements.total - system.requirements.completed}</p>
          <p className="text-sm text-tertiary">Pending</p>
        </div>
      </div>

      {/* System Details */}
      <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
        <h3 className="text-lg font-semibold text-primary">System Details</h3>
        <p className="mt-2 text-sm text-tertiary">{system.description}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-tertiary">Provider</p>
            <p className="mt-1 text-sm font-medium text-primary">{system.provider}</p>
          </div>
          <div>
            <p className="text-xs text-tertiary">Model</p>
            <p className="mt-1 text-sm font-medium text-primary">{system.modelName}</p>
          </div>
          <div>
            <p className="text-xs text-tertiary">Deployment Status</p>
            <p className="mt-1 text-sm font-medium text-primary">{system.deploymentStatus}</p>
          </div>
          <div>
            <p className="text-xs text-tertiary">Last Updated</p>
            <p className="mt-1 text-sm font-medium text-primary">{system.updatedAt}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Recent Activity</h3>
          <button
            onClick={onViewAllActivity}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all
          </button>
        </div>
        <ul className="flex flex-col gap-4 divide-y divide-border-secondary">
          {system.activity.slice(0, 3).map((item) => {
            const feedItem: FeedItemType = {
              id: item.id,
              date: item.time,
              user: {
                avatarUrl: "",
                name: item.user,
                href: "#",
              },
              action: {
                content: item.action,
                target: item.target,
                href: "#",
              },
            };
            return (
              <li key={item.id} className="pt-4 first:pt-0">
                <FeedItem {...feedItem} connector={false} size="sm" />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default OverviewTab;
