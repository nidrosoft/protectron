"use client";

import { useState, useEffect, useCallback } from "react";
import { SlideoutMenu } from "./slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/base/avatar/avatar";
import { Clock } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";

// Simple time ago formatter
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

// Format date for section headers
const formatDateHeader = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", { 
      weekday: "long", 
      month: "short", 
      day: "numeric" 
    });
  }
};

interface ActivityItem {
  id: string;
  action_type: string;
  action_description: string;
  target_type: string | null;
  target_name: string | null;
  user_name: string | null;
  user_avatar_url: string | null;
  created_at: string | null;
}

interface ActivitySlideoutProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Group activities by date
const groupActivitiesByDate = (activities: ActivityItem[]): Map<string, ActivityItem[]> => {
  const groups = new Map<string, ActivityItem[]>();
  
  activities.forEach(activity => {
    const dateKey = new Date(activity.created_at || new Date().toISOString()).toDateString();
    const existing = groups.get(dateKey) || [];
    groups.set(dateKey, [...existing, activity]);
  });
  
  return groups;
};

export const ActivitySlideout = ({ isOpen, onOpenChange }: ActivitySlideoutProps) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchActivities = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's organization
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      if (!profile?.organization_id) return;

      // Fetch all activities for the organization (last 100)
      const { data, error } = await supabase
        .from("activity_log")
        .select(`
          id,
          action_type,
          action_description,
          target_type,
          target_name,
          user_name,
          user_avatar_url,
          created_at
        `)
        .eq("organization_id", profile.organization_id)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching activities:", error);
        return;
      }

      setActivities(data || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (isOpen) {
      fetchActivities();
    }
  }, [isOpen, fetchActivities]);

  const groupedActivities = groupActivitiesByDate(activities);

  return (
    <SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <SlideoutMenu isDismissable>
        <SlideoutMenu.Header 
          onClose={() => onOpenChange(false)} 
          className="relative flex w-full flex-col gap-0.5 px-4 pt-6 md:px-6"
        >
          <div className="flex items-center justify-between pr-8">
            <h1 className="text-md font-semibold text-primary md:text-lg">Activity Feed</h1>
            <span className="text-sm text-tertiary">{activities.length} activities</span>
          </div>
          <p className="text-sm text-tertiary">Track all actions performed by your team.</p>
        </SlideoutMenu.Header>

        <SlideoutMenu.Content>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingIndicator type="dot-circle" size="md" label="Loading activity..." />
            </div>
          ) : activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-primary">No activity yet</p>
              <p className="mt-1 text-sm text-tertiary">
                When team members perform actions, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {Array.from(groupedActivities.entries()).map(([dateKey, dateActivities], groupIndex) => (
                <div key={dateKey}>
                  {/* Date header */}
                  <div className="sticky top-0 z-10 bg-secondary_subtle px-4 py-2 md:px-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-tertiary">
                      {formatDateHeader(dateActivities[0].created_at || new Date().toISOString())}
                    </span>
                  </div>
                  
                  {/* Activities for this date */}
                  {dateActivities.map((activity, index) => (
                    <div key={activity.id}>
                      <div className="flex gap-3 px-4 py-3 md:px-6">
                        {/* Avatar - small and compact */}
                        <Avatar
                          size="sm"
                          src={activity.user_avatar_url || undefined}
                          initials={activity.user_name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??"}
                        />

                        {/* Content - stacked layout */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-primary">
                            <span className="font-medium">{activity.user_name || "Unknown User"}</span>
                            {" "}
                            <span className="text-tertiary">{activity.action_description || "performed an action"}</span>
                            {activity.target_name && (
                              <>
                                {" "}
                                <span className="font-medium text-brand-600 break-all">{activity.target_name}</span>
                              </>
                            )}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-tertiary">
                            <span>{formatTimeAgo(activity.created_at || new Date().toISOString())}</span>
                            {activity.target_type && (
                              <>
                                <span className="text-quaternary">•</span>
                                <span className="capitalize">{activity.target_type.replace(/_/g, " ")}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {index !== dateActivities.length - 1 && (
                        <hr className="h-px w-full border-none bg-border-secondary" />
                      )}
                    </div>
                  ))}
                  
                  {/* Separator between date groups */}
                  {groupIndex !== groupedActivities.size - 1 && (
                    <div className="h-2 bg-secondary_subtle" />
                  )}
                </div>
              ))}
            </div>
          )}
        </SlideoutMenu.Content>

        <SlideoutMenu.Footer className="flex w-full items-center justify-end gap-3">
          <Button 
            size="md" 
            color="secondary" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </SlideoutMenu.Footer>
      </SlideoutMenu>
    </SlideoutMenu.Trigger>
  );
};

export default ActivitySlideout;
