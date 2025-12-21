"use client";

import { useState } from "react";
import {
  DocumentText,
  Folder,
  TickCircle,
  Clock,
  ArrowRight2,
} from "iconsax-react";
import { AlertCircle, Plus, Clock as ClockIcon } from "@untitledui/icons";
import { FeedItem, type FeedItemType } from "@/components/application/activity-feed/activity-feed";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { ProgressBarBase } from "@/components/base/progress-indicators/progress-indicators";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { DelegationsSlideout } from "@/components/application/slideout-menus/delegations-slideout";
import { type AgentRelationshipType, type RelatedAgent } from "../data/mock-data";

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
      avatarUrl?: string;
      action: string;
      target: string;
      time: string;
    }[];
    // Multi-agent fields
    agentRole?: AgentRelationshipType;
    relatedAgents?: RelatedAgent[];
    multiAgentStats?: {
      delegationsToday: number;
      avgDelegationTime: number;
    };
  };
  onViewAllActivity: () => void;
}

const relationshipConfig: Record<AgentRelationshipType, { label: string; color: "brand" | "purple" | "blue" | "success" }> = {
  coordinator: { label: "Coordinator", color: "brand" },
  specialist: { label: "Specialist", color: "purple" },
  peer: { label: "Peer", color: "blue" },
  supervisor: { label: "Supervisor", color: "success" },
};

export const OverviewTab = ({ system, onViewAllActivity }: OverviewTabProps) => {
  const [isDelegationsSlideoutOpen, setIsDelegationsSlideoutOpen] = useState(false);

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

      {/* Multi-Agent Relationships - only show for agents with related agents */}
      {system.relatedAgents && system.relatedAgents.length > 0 && (
        <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">Multi-Agent Relationships</h3>
            <Button 
              size="sm" 
              color="secondary"
              iconTrailing={({ className }) => <ArrowRight2 size={16} color="currentColor" className={className} />}
              onClick={() => setIsDelegationsSlideoutOpen(true)}
            >
              View All Delegations
            </Button>
          </div>

          {/* Visual Hierarchy with dot pattern background */}
          <div 
            className="flex flex-col items-center py-8 rounded-lg relative overflow-hidden"
            style={{
              backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
              backgroundSize: '16px 16px',
            }}
          >
            {/* Coordinator (this agent) */}
            <div className="flex flex-col items-center relative z-10">
              <div className="rounded-xl border-2 border-brand-300 bg-brand-50 px-6 py-4 text-center shadow-sm">
                <p className="font-semibold text-primary">{system.name}</p>
                {system.agentRole && (
                  <Badge color={relationshipConfig[system.agentRole].color} size="sm" className="mt-1">
                    {relationshipConfig[system.agentRole].label}
                  </Badge>
                )}
              </div>
              
              {/* Connector line */}
              <div className="h-8 w-px bg-gray-300" />
              
              {/* Horizontal connector */}
              <div className="relative w-full">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-gray-300" style={{ width: `${Math.min(system.relatedAgents.length * 200, 600)}px` }} />
                
                {/* Vertical connectors to children */}
                <div className="flex justify-center gap-6 pt-0 flex-wrap">
                  {system.relatedAgents.map((agent) => (
                    <div key={agent.id} className="flex flex-col items-center">
                      <div className="h-4 w-px bg-gray-300" />
                      <div className="rounded-lg border border-secondary bg-white px-4 py-3 text-center min-w-[180px] shadow-sm">
                        <p className="text-sm font-medium text-primary">{agent.name}</p>
                        <Badge color={relationshipConfig[agent.relationship].color} size="sm" className="mt-1">
                          {relationshipConfig[agent.relationship].label}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          {system.multiAgentStats && (
            <div className="flex items-center justify-center gap-8 pt-4 border-t border-secondary text-sm text-tertiary">
              <span>
                Delegations today: <strong className="text-primary">{system.multiAgentStats.delegationsToday}</strong>
              </span>
              <span className="text-secondary">│</span>
              <span>
                Avg delegation time: <strong className="text-primary">{system.multiAgentStats.avgDelegationTime}s</strong>
              </span>
            </div>
          )}
        </div>
      )}

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
        {system.activity.length > 0 ? (
          <ul className="flex flex-col gap-4 divide-y divide-border-secondary">
            {system.activity.slice(0, 3).map((item) => {
              const feedItem: FeedItemType = {
                id: item.id,
                date: item.time,
                user: {
                  avatarUrl: item.avatarUrl,
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
        ) : (
          <div className="py-8 text-center">
            <EmptyState size="sm">
              <EmptyState.Header pattern="grid">
                <EmptyState.FeaturedIcon icon={ClockIcon} color="gray" theme="modern" />
              </EmptyState.Header>
              <EmptyState.Content>
                <EmptyState.Title>No activity yet</EmptyState.Title>
                <EmptyState.Description>
                  Activity will appear here as you work on compliance requirements.
                </EmptyState.Description>
              </EmptyState.Content>
            </EmptyState>
          </div>
        )}
      </div>

      {/* Delegations Slideout */}
      {system.relatedAgents && system.relatedAgents.length > 0 && (
        <DelegationsSlideout
          isOpen={isDelegationsSlideoutOpen}
          onOpenChange={setIsDelegationsSlideoutOpen}
          agentName={system.name}
          delegations={[]}
          stats={system.multiAgentStats}
        />
      )}
    </div>
  );
};

export default OverviewTab;
