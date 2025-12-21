"use client";

import { useState, useEffect, useCallback } from "react";
import { SlideoutMenu } from "./slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { createClient } from "@/lib/supabase/client";
import { 
  People, 
  DocumentText, 
  ShieldTick, 
  Calendar, 
  Warning2, 
  SecuritySafe, 
  Card, 
  Notification,
} from "iconsax-react";
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

interface NotificationItem {
  id: string;
  notification_type: string;
  subject: string;
  recipient_email: string;
  status: string;
  metadata: Record<string, unknown>;
  created_at: string;
  is_read?: boolean;
}

interface NotificationsSlideoutProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const getNotificationIcon = (type: string) => {
  const iconProps = { size: 20, color: "currentColor" };
  
  switch (type) {
    case "team-invite":
    case "team-member-joined":
    case "team-member-removed":
    case "team-role-changed":
      return <People {...iconProps} />;
    case "document-generated":
      return <DocumentText {...iconProps} />;
    case "compliance-update":
      return <ShieldTick {...iconProps} />;
    case "deadline-reminder":
      return <Calendar {...iconProps} />;
    case "incident-created":
    case "incident-resolved":
      return <Warning2 {...iconProps} />;
    case "security-alert":
      return <SecuritySafe {...iconProps} />;
    case "billing-payment-success":
    case "billing-payment-failed":
      return <Card {...iconProps} />;
    default:
      return <Notification {...iconProps} />;
  }
};

const getNotificationColor = (type: string): string => {
  switch (type) {
    case "incident-created":
    case "security-alert":
    case "billing-payment-failed":
      return "bg-error-50 text-error-600";
    case "incident-resolved":
    case "billing-payment-success":
      return "bg-success-50 text-success-600";
    case "deadline-reminder":
      return "bg-warning-50 text-warning-600";
    case "team-invite":
    case "team-member-joined":
      return "bg-brand-50 text-brand-600";
    default:
      return "bg-gray-50 text-gray-600";
  }
};

const formatNotificationType = (type: string): string => {
  return type
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const NotificationsSlideout = ({ isOpen, onOpenChange }: NotificationsSlideoutProps) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const supabase = createClient();

  const fetchNotifications = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("notification_log")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      setNotifications(data || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("notification_log")
      .update({ is_read: true })
      .eq("user_id", user.id);

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <SlideoutMenu isDismissable>
        <SlideoutMenu.Header 
          onClose={() => onOpenChange(false)} 
          className="relative flex w-full flex-col gap-0.5 px-4 pt-6 md:px-6"
        >
          <div className="flex items-center justify-between pr-8">
            <h1 className="text-md font-semibold text-primary md:text-lg">Notifications</h1>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-error-500 px-1.5 text-xs font-medium text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-tertiary">Stay updated on your compliance activities.</p>
          
          {/* Filter tabs */}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cx(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                filter === "all" 
                  ? "bg-brand-50 text-brand-700" 
                  : "text-tertiary hover:bg-secondary"
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={cx(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                filter === "unread" 
                  ? "bg-brand-50 text-brand-700" 
                  : "text-tertiary hover:bg-secondary"
              )}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
        </SlideoutMenu.Header>

        <SlideoutMenu.Content>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingIndicator type="dot-circle" size="md" label="Loading notifications..." />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Notification size={24} color="currentColor" className="text-gray-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-primary">
                {filter === "unread" ? "No unread notifications" : "No notifications yet"}
              </p>
              <p className="mt-1 text-sm text-tertiary">
                {filter === "unread" 
                  ? "You're all caught up!" 
                  : "When you receive notifications, they'll appear here."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <div 
                    className={cx(
                      "flex gap-3 py-4 transition-colors",
                      !notification.is_read && "bg-brand-25"
                    )}
                  >
                    {/* Icon */}
                    <div className={cx(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      getNotificationColor(notification.notification_type)
                    )}>
                      {getNotificationIcon(notification.notification_type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-primary line-clamp-2">
                          {notification.subject}
                        </p>
                        {!notification.is_read && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-tertiary">
                          {formatNotificationType(notification.notification_type)}
                        </span>
                        <span className="text-xs text-quaternary">•</span>
                        <span className="text-xs text-tertiary">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {index !== filteredNotifications.length - 1 && (
                    <hr className="h-px w-full border-none bg-border-secondary" />
                  )}
                </div>
              ))}
            </div>
          )}
        </SlideoutMenu.Content>

        <SlideoutMenu.Footer className="flex w-full items-center justify-between gap-3">
          <Button 
            size="md" 
            color="secondary" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          {unreadCount > 0 && (
            <Button 
              size="md" 
              color="primary"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </SlideoutMenu.Footer>
      </SlideoutMenu>
    </SlideoutMenu.Trigger>
  );
};

export default NotificationsSlideout;
