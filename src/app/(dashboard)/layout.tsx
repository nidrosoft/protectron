"use client";

import type { FC, HTMLAttributes } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";
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
} from "iconsax-react";
import { ChevronLeft, ChevronRight } from "@untitledui/icons";
import type { Icon as IconSaxIcon } from "iconsax-react";
import { FeaturedCardProgressCircle } from "@/components/application/app-navigation/base-components/featured-cards";
import type { NavItemType, NavItemDividerType } from "@/components/application/app-navigation/config";
import { SidebarNavigationSimple } from "@/components/application/app-navigation/sidebar-navigation/sidebar-simple";
import { ToastProvider } from "@/components/base/toast/toast";
import { SidebarNavigationSlim } from "@/components/application/app-navigation/sidebar-navigation/sidebar-slim";
import { cx } from "@/utils/cx";

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

const navItems: NavItemType[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: createIcon(Category),
  },
  {
    label: "AI Systems",
    href: "/ai-systems",
    icon: createIcon(Cpu),
  },
  {
    label: "Requirements",
    href: "/requirements",
    icon: createIcon(TickSquare),
    badge: 12,
  },
  {
    label: "Documents",
    href: "/documents",
    icon: createIcon(DocumentText),
  },
  {
    label: "Evidence",
    href: "/evidence",
    icon: createIcon(FolderOpen),
  },
  {
    label: "Reports",
    href: "/reports",
    icon: createIcon(Chart2),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: createIcon(Setting2),
  },
  {
    label: "Resources",
    href: "/resources",
    icon: createIcon(Book),
    items: [
      { label: "EU AI Act Guide", href: "/resources/guide", icon: createIcon(Book1) },
      { label: "Help Center", href: "/resources/help", icon: createIcon(InfoCircle) },
      { label: "Contact Support", href: "/resources/support", icon: createIcon(Headphone) },
    ],
  },
];

const footerItems: NavItemType[] = [];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <ToastProvider>
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
              description="Your organization is 35% compliant. Complete pending requirements to improve."
              confirmLabel="Upgrade Plan"
              progress={35}
              className="hidden lg:flex"
              onDismiss={() => {}}
              onConfirm={() => {}}
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
            <div className="flex items-center gap-2 rounded-lg border border-secondary bg-secondary_subtle px-3 py-1.5">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-warning-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-warning-500" />
                </span>
                <span className="text-sm font-semibold text-primary">72%</span>
              </div>
              <span className="text-xs text-tertiary">Compliant</span>
            </div>

            {/* Upcoming Deadline */}
            <div className="hidden sm:flex items-center gap-2 rounded-lg border border-warning-200 bg-warning-50 px-3 py-1.5">
              <Calendar size={16} color="currentColor" className="text-warning-600" />
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-warning-700">Next deadline:</span>
                <span className="text-xs font-semibold text-warning-800">45 days</span>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2">
            {/* Help */}
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary bg-primary text-tertiary hover:bg-secondary_hover hover:text-secondary transition-colors shadow-sm"
              onClick={() => window.location.href = "/resources/help"}
              aria-label="Help Center"
            >
              <HelpIcon size={20} color="currentColor" />
            </button>

            {/* Notifications */}
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-secondary bg-primary text-tertiary hover:bg-secondary_hover hover:text-secondary transition-colors shadow-sm"
              onClick={() => alert("Notifications coming soon!")}
              aria-label="Notifications"
            >
              <Notification size={20} color="currentColor" />
              {/* Notification badge */}
              <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-error-500 ring-2 ring-white" />
              </span>
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
    </div>
    </ToastProvider>
  );
}
