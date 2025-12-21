"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Plus, Clock } from "@untitledui/icons";
import { FeedItem, type FeedItemType } from "@/components/application/activity-feed/activity-feed";
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";
import { Badge } from "@/components/base/badges/badges";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Button } from "@/components/base/buttons/button";
import { ActivitySlideout } from "@/components/application/slideout-menus/activity-slideout";

interface ActivitySectionProps {
  recentActivity: FeedItemType[];
  teamActivity: { name: string; initials: string; completedToday: number }[];
  riskDistribution: {
    high: number;
    limited: number;
    minimal: number;
  };
}

export const ActivitySection = ({
  recentActivity,
  teamActivity,
  riskDistribution,
}: ActivitySectionProps) => {
  const [isActivitySlideoutOpen, setIsActivitySlideoutOpen] = useState(false);

  return (
    <>
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Recent Activity */}
      <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-primary">Recent Activity</h3>
          <button 
            type="button"
            onClick={() => setIsActivitySlideoutOpen(true)}
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all
          </button>
        </div>
        {recentActivity.length > 0 ? (
          <ul className="flex flex-col divide-y divide-border-secondary">
            {recentActivity.map((item) => (
              <li key={item.id} className="py-4 first:pt-0 last:pb-0">
                <FeedItem {...item} connector={false} size="sm" />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState size="sm">
            <EmptyState.Header pattern="grid">
              <EmptyState.FeaturedIcon icon={Clock} color="gray" theme="modern" />
            </EmptyState.Header>
            <EmptyState.Content>
              <EmptyState.Title>No activity yet</EmptyState.Title>
              <EmptyState.Description>
                Start by adding your first AI system to track compliance progress.
              </EmptyState.Description>
            </EmptyState.Content>
            <EmptyState.Footer>
              <Button size="md" iconLeading={Plus} href="/ai-systems/new">
                Add AI System
              </Button>
            </EmptyState.Footer>
          </EmptyState>
        )}
      </div>

      {/* Right Column: Risk Distribution + Team Activity */}
      <div className="flex flex-col gap-6">
        {/* Risk Distribution Chart */}
        <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
          <h3 className="mb-4 text-lg font-semibold text-primary">Risk Distribution</h3>
          <div className="flex items-center gap-4">
            <div className="h-24 w-24 shrink-0">
              <ResponsiveContainer width={96} height={96}>
                <PieChart width={96} height={96}>
                  <Pie
                    data={[
                      { name: "High Risk", value: riskDistribution.high, color: "#F79009" },
                      { name: "Limited", value: riskDistribution.limited, color: "#2E90FA" },
                      { name: "Minimal", value: riskDistribution.minimal, color: "#12B76A" },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    <Cell fill="#F79009" />
                    <Cell fill="#2E90FA" />
                    <Cell fill="#12B76A" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-warning-500" />
                <span className="text-sm text-secondary">{riskDistribution.high} High Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span className="text-sm text-secondary">{riskDistribution.limited} Limited</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-success-500" />
                <span className="text-sm text-secondary">{riskDistribution.minimal} Minimal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Activity */}
        <div className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
          <h3 className="mb-4 text-lg font-semibold text-primary">Team Activity</h3>
          {teamActivity.length > 0 ? (
            <div className="flex flex-col gap-3">
              {teamActivity.map((member) => (
                <div key={member.name} className="flex items-center justify-between">
                  <AvatarLabelGroup
                    size="sm"
                    initials={member.initials}
                    title={member.name}
                    subtitle=""
                    className="flex-1 min-w-0"
                  />
                  <Badge color="success" size="sm">{member.completedToday} today</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-sm text-tertiary">No team activity today</p>
              <p className="text-xs text-quaternary mt-1">Activity will appear as team members work</p>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Activity Slideout */}
    <ActivitySlideout 
      isOpen={isActivitySlideoutOpen} 
      onOpenChange={setIsActivitySlideoutOpen} 
    />
    </>
  );
};

export default ActivitySection;
