/**
 * Shared types for Quick Comply landing page components
 */

export interface AISystem {
  id: string;
  name: string;
  description: string | null;
  risk_level: string;
  compliance_status: string | null;
  compliance_progress: number | null;
  category: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assessment_data: any;
  created_at: string | null;
}

export interface QuickComplySession {
  id: string;
  ai_system_id: string | null;
  status: string;
  progress_percentage: number;
  current_section: string | null;
  sections_completed: string[];
  last_activity_at: string;
}

/** Risk-level metadata used across landing page sections */
export const RISK_META: Record<
  string,
  {
    label: string;
    docs: number;
    requirements: number;
    estimatedTime: string;
    deadline: string;
    deadlineDate: Date;
    badgeBg: string;
    badgeText: string;
  }
> = {
  prohibited: {
    label: "Prohibited",
    docs: 0,
    requirements: 0,
    estimatedTime: "N/A",
    deadline: "Immediately",
    deadlineDate: new Date(),
    badgeBg: "bg-error-secondary border-secondary",
    badgeText: "text-error-primary",
  },
  high: {
    label: "High Risk",
    docs: 16,
    requirements: 52,
    estimatedTime: "~45 min",
    deadline: "Aug 2, 2026",
    deadlineDate: new Date("2026-08-02"),
    badgeBg: "bg-error-primary border-secondary",
    badgeText: "text-error-primary",
  },
  limited: {
    label: "Limited Risk",
    docs: 5,
    requirements: 8,
    estimatedTime: "~30 min",
    deadline: "Aug 2, 2027",
    deadlineDate: new Date("2027-08-02"),
    badgeBg: "bg-warning-primary border-secondary",
    badgeText: "text-warning-primary",
  },
  minimal: {
    label: "Minimal Risk",
    docs: 2,
    requirements: 2,
    estimatedTime: "~15 min",
    deadline: "Aug 2, 2027",
    deadlineDate: new Date("2027-08-02"),
    badgeBg: "bg-success-primary border-secondary",
    badgeText: "text-success-primary",
  },
};

export function RiskBadge({ level }: { level: string }) {
  const meta = RISK_META[level] || RISK_META.minimal;
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${meta.badgeBg} ${meta.badgeText}`}
    >
      {meta.label}
    </span>
  );
}

export function daysUntil(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
