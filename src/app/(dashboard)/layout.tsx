"use client";

import type { FC, HTMLAttributes } from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Category,
  Cpu,
  DocumentText,
  Chart2,
  FolderOpen,
  TickSquare,
  Setting2,
  Book1,
  MessageQuestion,
  AddCircle,
  Building,
  People,
  Card,
  Code,
  Book,
  InfoCircle,
  Headphone,
  Notification,
  Calendar,
  MessageQuestion as HelpIcon,
  Warning2,
  Flash,
  Medal,
} from "iconsax-react";
import { ChevronLeft, ChevronRight } from "@untitledui/icons";
import type { Icon as IconSaxIcon } from "iconsax-react";
import { FeaturedCardProgressCircle } from "@/components/application/app-navigation/base-components/featured-cards";
import type { NavItemType, NavItemDividerType } from "@/components/application/app-navigation/config";
import { SidebarNavigationSimple } from "@/components/application/app-navigation/sidebar-navigation/sidebar-simple";
import { ToastProvider } from "@/components/base/toast/toast";
import { SidebarNavigationSlim } from "@/components/application/app-navigation/sidebar-navigation/sidebar-slim";
import { NotificationsSlideout } from "@/components/application/slideout-menus/notifications-slideout";
import { UpgradePlanModal } from "@/components/application/modals/upgrade-plan-modal";
import { WalkthroughProvider } from "@/contexts/walkthrough-context";
import { WalkthroughController } from "@/components/walkthrough";
import { cx } from "@/utils/cx";
import { useIncidents } from "@/hooks";
import { createClient } from "@/lib/supabase/client";

// Wrapper to make IconSax icons compatible with the sidebar
// IconSax icons use size/color props, we wrap them to accept className for styling
const createIcon = (IconComponent: IconSaxIcon): FC<HTMLAttributes<HTMLOrSVGElement>> => {
  const WrappedIcon: FC<HTMLAttributes<HTMLOrSVGElement>> = ({ className }) => (
    <span className={className}>
      <IconComponent size={20} variant="Linear" color="currentColor" />
    </span>
  );
  WrappedIcon.displayName = `IconSax(${IconComponent.name || 'Icon'})`;
  return WrappedIcon;
};

interface AISystemsStats {
  total: number;
  notStarted: number;
  inProgress: number;
  compliant: number;
}

const getAISystemsBadge = (stats: AISystemsStats): React.ReactNode => {
  if (stats.total === 0) return undefined;
  
  // Determine color based on status
  // Red = not started (needs immediate attention)
  // Orange = in progress (needs work)
  // Green = all compliant
  let bgColor = "bg-success-500"; // green
  let textColor = "text-white";
  
  if (stats.notStarted > 0) {
    bgColor = "bg-error-500"; // red
  } else if (stats.inProgress > 0) {
    bgColor = "bg-warning-500"; // orange
  }
  
  return (
    <span className={cx("ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold", bgColor, textColor)}>
      {stats.total}
    </span>
  );
};

const getNavItems = (incidentsCount: number, aiSystemsStats: AISystemsStats): NavItemType[] => [
  {
    label: "Quick Comply",
    href: "/quick-comply",
    icon: createIcon(Flash),
    badge: (
      <span className="ml-auto rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold text-brand-700">
        AI
      </span>
    ),
    dataWalkthrough: "nav-quick-comply",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: createIcon(Category),
    dataWalkthrough: "nav-dashboard",
  },
  {
    label: "AI Systems",
    href: "/ai-systems",
    icon: createIcon(Cpu),
    badge: getAISystemsBadge(aiSystemsStats),
    dataWalkthrough: "nav-ai-systems",
    items: [
      { label: "All Systems", href: "/ai-systems" },
      { label: "Agents", href: "/ai-systems?type=ai_agent" },
      { label: "Models & Apps", href: "/ai-systems?type=other" },
    ],
  },
  {
    label: "Requirements",
    href: "/requirements",
    icon: createIcon(TickSquare),
    dataWalkthrough: "nav-requirements",
  },
  {
    label: "Documents",
    href: "/documents",
    icon: createIcon(DocumentText),
    dataWalkthrough: "nav-documents",
  },
  {
    label: "Certifications",
    href: "/certifications",
    icon: createIcon(Medal),
  },
  {
    label: "Evidence",
    href: "/evidence",
    icon: createIcon(FolderOpen),
    dataWalkthrough: "nav-evidence",
  },
  {
    label: "Incidents",
    href: "/incidents",
    icon: createIcon(Warning2),
    badge: incidentsCount > 0 ? incidentsCount : undefined,
    dataWalkthrough: "nav-incidents",
  },
  {
    label: "Reports",
    href: "/reports",
    icon: createIcon(Chart2),
    dataWalkthrough: "nav-reports",
  },
  {
    label: "Resources",
    href: "/resources",
    icon: createIcon(Book),
    dataWalkthrough: "nav-resources",
    items: [
      { label: "EU AI Act Guide", href: "/resources/guide", icon: createIcon(Book1) },
      { label: "Help Center", href: "/resources/help", icon: createIcon(InfoCircle) },
      { label: "Contact Support", href: "/resources/support", icon: createIcon(Headphone) },
    ],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: createIcon(Setting2),
    dataWalkthrough: "nav-settings",
  },
];

const footerItems: NavItemType[] = [];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [complianceScore, setComplianceScore] = useState(0);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [aiSystemsStats, setAISystemsStats] = useState<AISystemsStats>({
    total: 0,
    notStarted: 0,
    inProgress: 0,
    compliant: 0,
  });
  const supabase = createClient();
  
  // Fetch incidents count for sidebar badge
  const { incidents } = useIncidents();
  const navItems = useMemo(() => getNavItems(incidents.length, aiSystemsStats), [incidents.length, aiSystemsStats]);

  // Fetch compliance score and AI systems stats
  const fetchComplianceScore = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's organization
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      if (!profile?.organization_id) return;

      // Get all AI systems for this organization with compliance status
      const { data: systems } = await supabase
        .from("ai_systems")
        .select("compliance_progress, compliance_status")
        .eq("organization_id", profile.organization_id);

      if (systems && systems.length > 0) {
        const totalProgress = systems.reduce((sum, s) => sum + (s.compliance_progress || 0), 0);
        const avgProgress = Math.round(totalProgress / systems.length);
        setComplianceScore(avgProgress);

        // Calculate AI systems stats for sidebar badge
        const notStarted = systems.filter(s => s.compliance_status === "not_started" || (!s.compliance_status && (s.compliance_progress || 0) === 0)).length;
        const compliant = systems.filter(s => s.compliance_status === "compliant" || (s.compliance_progress || 0) === 100).length;
        const inProgress = systems.length - notStarted - compliant;

        setAISystemsStats({
          total: systems.length,
          notStarted,
          inProgress,
          compliant,
        });
      }
    } catch (err) {
      console.error("Error fetching compliance score:", err);
    }
  }, [supabase]);

  // Fetch unread notification count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { count } = await (supabase as any)
        .from("notification_log")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      setUnreadNotificationCount(count || 0);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  }, [supabase]);

  useEffect(() => {
    fetchComplianceScore();
    fetchUnreadCount();
  }, [fetchComplianceScore, fetchUnreadCount]);

  // Handle upgrade plan click
  const handleUpgradePlan = () => {
    setIsUpgradeModalOpen(true);
  };

  return (
    <ToastProvider>
    <WalkthroughProvider>
    <div className="h-screen overflow-hidden bg-primary">
      {/* Sidebar - Simple (expanded) or Slim (collapsed) */}
      {isCollapsed ? (
        <SidebarNavigationSlim
          activeUrl={pathname}
          items={navItems as (NavItemType & { icon: FC<{ className?: string }> })[]}
          footerItems={footerItems as (NavItemType & { icon: FC<{ className?: string }> })[]}
        />
      ) : (
        <SidebarNavigationSimple
          activeUrl={pathname}
          items={navItems}
          footerItems={footerItems}
          featureCard={
            <FeaturedCardProgressCircle
              title="Compliance Progress"
              description={`Your organization is ${complianceScore}% compliant. Complete pending requirements to improve.`}
              confirmLabel="Upgrade Plan"
              progress={complianceScore}
              className="hidden lg:flex"
              onDismiss={() => {}}
              onConfirm={handleUpgradePlan}
            />
          }
        />
      )}
      
      {/* Main content - offset by sidebar width */}
      <div className={cx(
        "flex h-screen flex-col transition-all",
        isCollapsed ? "lg:ml-[80px]" : "lg:ml-[296px]"
      )}>
        {/* Top Header Bar */}
        <header className="shrink-0 flex items-center justify-between gap-4 border-b border-secondary bg-primary px-4 py-2.5 lg:px-6">
          {/* Left side - Compliance Status & Deadline */}
          <div className="flex items-center gap-4">
            {/* Compliance Status */}
            <div className={cx(
              "flex items-center gap-2 rounded-lg border px-3 py-1.5",
              complianceScore >= 80 
                ? "border-success-200 bg-success-50" 
                : complianceScore >= 50 
                  ? "border-warning-200 bg-warning-50"
                  : "border-error-200 bg-error-50"
            )}>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={cx(
                    "absolute inline-flex h-full w-full animate-pulse rounded-full opacity-75",
                    complianceScore >= 80 ? "bg-success-400" : complianceScore >= 50 ? "bg-warning-400" : "bg-error-400"
                  )} />
                  <span className={cx(
                    "relative inline-flex h-2.5 w-2.5 rounded-full",
                    complianceScore >= 80 ? "bg-success-500" : complianceScore >= 50 ? "bg-warning-500" : "bg-error-500"
                  )} />
                </span>
                <span className={cx(
                  "text-sm font-semibold",
                  complianceScore >= 80 ? "text-success-700" : complianceScore >= 50 ? "text-warning-700" : "text-error-700"
                )}>{complianceScore}%</span>
              </div>
              <span className={cx(
                "text-xs",
                complianceScore >= 80 ? "text-success-600" : complianceScore >= 50 ? "text-warning-600" : "text-error-600"
              )}>Compliant</span>
            </div>

            {/* Upcoming Deadline */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-secondary bg-secondary_subtle px-3 py-1.5">
              <Calendar size={16} color="currentColor" className="text-tertiary" />
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-tertiary">Next deadline:</span>
                <span className="text-xs font-semibold text-primary">Aug 2, 2026</span>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {/* Help */}
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary bg-primary text-tertiary hover:bg-secondary_hover hover:text-secondary transition-colors shadow-sm"
              onClick={() => router.push("/resources/help")}
              aria-label="Help Center"
            >
              <HelpIcon size={20} color="currentColor" />
            </button>

            {/* Notifications */}
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-secondary bg-primary text-tertiary hover:bg-secondary_hover hover:text-secondary transition-colors shadow-sm"
              onClick={() => setIsNotificationsOpen(true)}
              aria-label="Notifications"
            >
              <Notification size={20} color="currentColor" />
              {/* Notification badge with count */}
              {(unreadNotificationCount > 0 || aiSystemsStats.notStarted > 0) && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-error-500 px-1 text-xs font-semibold text-white ring-2 ring-white">
                  {unreadNotificationCount + aiSystemsStats.notStarted}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-8">
          {children}
        </main>
      </div>

      {/* Collapse Toggle Button - positioned exactly on sidebar border */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ left: isCollapsed ? 68 : 296 }}
        className="fixed z-50 hidden lg:flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-secondary bg-primary shadow-xs transition-all hover:bg-secondary_hover top-7"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="size-3.5 text-fg-quaternary" />
        ) : (
          <ChevronLeft className="size-3.5 text-fg-quaternary" />
        )}
      </button>

      {/* Notifications Slideout */}
      <NotificationsSlideout 
        isOpen={isNotificationsOpen} 
        onOpenChange={(open) => {
          setIsNotificationsOpen(open);
          if (!open) {
            // Refresh unread count when closing
            fetchUnreadCount();
          }
        }} 
      />

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        onOpenChange={setIsUpgradeModalOpen}
        onSelectPlan={(planId) => {
          // Navigate to billing tab to complete upgrade
          setIsUpgradeModalOpen(false);
          router.push("/settings?tab=billing");
        }}
      />

      {/* Walkthrough Controller */}
      <WalkthroughController />
    </div>
    </WalkthroughProvider>
    </ToastProvider>
  );
}
