import { type FeedItemType } from "@/components/application/activity-feed/activity-feed";
import { Warning2, TickCircle, InfoCircle } from "iconsax-react";

// Mock user data (will come from auth later)
export const currentUser = {
  name: "Olivia",
  company: "Acme Corp",
};

// Mock recent activity data using FeedItemType
export const recentActivity: FeedItemType[] = [
  {
    id: "activity-001",
    unseen: true,
    date: "2 hours ago",
    user: {
      avatarUrl: "https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80",
      name: "Sarah Chen",
      href: "#",
      status: "online",
    },
    action: {
      content: "Completed requirement",
      target: "Risk Assessment Documentation",
      href: "#",
    },
  },
  {
    id: "activity-002",
    unseen: true,
    date: "4 hours ago",
    user: {
      avatarUrl: "https://www.untitledui.com/images/avatars/lana-steiner?fm=webp&q=80",
      name: "John Miller",
      href: "#",
      status: "offline",
    },
    attachment: {
      type: "pdf",
      name: "Model Training Data Audit.pdf",
      size: "1.2 MB",
    },
    action: {
      content: "Uploaded evidence to",
      target: "Fraud Detection System",
      href: "#",
    },
  },
  {
    id: "activity-003",
    date: "Yesterday",
    user: {
      avatarUrl: "https://www.untitledui.com/images/avatars/demi-wilkinson?fm=webp&q=80",
      name: "Olivia Rhye",
      href: "#",
      status: "online",
    },
    attachment: {
      type: "pdf",
      name: "Technical Documentation.pdf",
      size: "720 KB",
    },
    action: {
      content: "Generated document for",
      target: "Customer Chatbot",
      href: "#",
    },
  },
  {
    id: "activity-004",
    date: "2 days ago",
    user: {
      avatarUrl: "https://www.untitledui.com/images/avatars/candice-wu?fm=webp&q=80",
      name: "David Park",
      href: "#",
      status: "online",
    },
    action: {
      content: "Added new AI system",
      target: "Lead Scoring Model",
      href: "#",
    },
  },
];

// Mock team activity data
export const teamActivity = [
  { name: "Sarah Chen", initials: "SC", completedToday: 3, avatar: null },
  { name: "John Miller", initials: "JM", completedToday: 2, avatar: null },
  { name: "David Park", initials: "DP", completedToday: 1, avatar: null },
];

// Mock data for AI Systems
export const aiSystems = [
  {
    id: "system-01",
    name: "Customer Support Chatbot",
    riskLevel: "limited" as const,
    status: "compliant" as const,
    progress: 100,
    requirements: { completed: 8, total: 8 },
    deadline: null,
  },
  {
    id: "system-02",
    name: "Automated Hiring Screener",
    riskLevel: "high" as const,
    status: "in_progress" as const,
    progress: 50,
    requirements: { completed: 12, total: 24 },
    deadline: "Aug 2, 2026",
  },
  {
    id: "system-03",
    name: "Fraud Detection System",
    riskLevel: "high" as const,
    status: "in_progress" as const,
    progress: 75,
    requirements: { completed: 18, total: 24 },
    deadline: "Aug 2, 2026",
  },
  {
    id: "system-04",
    name: "Content Recommender",
    riskLevel: "minimal" as const,
    status: "compliant" as const,
    progress: 100,
    requirements: { completed: 4, total: 4 },
    deadline: null,
  },
  {
    id: "system-05",
    name: "Lead Scoring Model",
    riskLevel: "limited" as const,
    status: "not_started" as const,
    progress: 0,
    requirements: { completed: 0, total: 8 },
    deadline: null,
  },
];

// Risk level config
export const riskLevelConfig = {
  high: { label: "High Risk", color: "warning" as const, icon: Warning2 },
  limited: { label: "Limited", color: "blue" as const, icon: InfoCircle },
  minimal: { label: "Minimal", color: "success" as const, icon: TickCircle },
};

// Status config
export const statusConfig = {
  compliant: { label: "Compliant", color: "success" as const },
  in_progress: { label: "In Progress", color: "warning" as const },
  not_started: { label: "Not Started", color: "gray" as const },
};

// Calculate days until deadline
export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
