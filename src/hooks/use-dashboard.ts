"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface DashboardAISystem {
  id: string;
  name: string;
  riskLevel: "high" | "limited" | "minimal";
  status: "compliant" | "in_progress" | "not_started";
  progress: number;
  requirements: { completed: number; total: number };
  deadline: string | null;
}

export interface DashboardActivity {
  id: string;
  unseen: boolean;
  date: string;
  user: {
    avatarUrl: string | null;
    name: string;
    href: string;
    status: "online" | "offline";
  };
  action: {
    content: string;
    target: string;
    href: string;
  };
  attachment?: {
    type: string;
    name: string;
    size: string;
  };
}

export interface DocumentStats {
  total: number;
  byType: {
    technical: number;
    risk: number;
    policy: number;
    model_card: number;
  };
}

export interface PendingActionsStats {
  total: number;
  urgent: number;
  upcoming: number;
}

export interface DashboardData {
  user: {
    name: string;
    company: string;
  };
  aiSystems: DashboardAISystem[];
  recentActivity: DashboardActivity[];
  teamActivity: { name: string; initials: string; completedToday: number; avatar: string | null }[];
  stats: {
    totalSystems: number;
    compliantCount: number;
    inProgressCount: number;
    notStartedCount: number;
    totalRequirements: number;
    completedRequirements: number;
    overallProgress: number;
    riskDistribution: {
      high: number;
      limited: number;
      minimal: number;
    };
    documents: DocumentStats;
    pendingActions: PendingActionsStats;
  };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Get current user and profile - first try to get session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        setError("Session error - please refresh the page");
        setIsLoading(false);
        return;
      }

      // If no session, try to get user directly
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("User error:", userError);
        // Don't set error for auth errors - just redirect will happen via middleware
        setIsLoading(false);
        return;
      }
      
      if (!user) {
        setError("Not authenticated");
        setIsLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, organization_id, organizations(name)")
        .eq("id", user.id)
        .single();

      // Get AI systems for the organization
      const orgId = profile?.organization_id;
      if (!orgId) {
        setError("No organization found");
        setIsLoading(false);
        return;
      }

      const { data: systems, error: systemsError } = await supabase
        .from("ai_systems")
        .select(`
          id,
          name,
          risk_level,
          compliance_status,
          compliance_progress,
          ai_system_requirements(id, status)
        `)
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false });

      if (systemsError) {
        console.error("Error fetching systems:", systemsError);
      }

      // Get recent activity
      const { data: activities } = await supabase
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
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false })
        .limit(6);

      // Get documents count by type
      const { data: documents, error: documentsError } = await supabase
        .from("documents")
        .select("document_type")
        .eq("organization_id", orgId);

      console.log("Documents fetch - orgId:", orgId, "documents:", documents, "error:", documentsError);

      // Get pending requirements (not completed)
      const { data: pendingRequirements } = await supabase
        .from("ai_system_requirements")
        .select(`
          id,
          status,
          ai_systems!inner(organization_id)
        `)
        .neq("status", "completed")
        .eq("ai_systems.organization_id", orgId);

      // Transform AI systems data
      const aiSystems: DashboardAISystem[] = (systems || []).map((system) => {
        const requirements = system.ai_system_requirements || [];
        const completed = requirements.filter((r: { id: string; status: string | null }) => r.status === "completed").length;
        const total = requirements.length || 1; // Avoid division by zero
        const progress = Math.round((completed / total) * 100);

        let status: "compliant" | "in_progress" | "not_started" = "not_started";
        if (system.compliance_status === "compliant" || progress === 100) {
          status = "compliant";
        } else if (progress > 0 || system.compliance_status === "in_progress") {
          status = "in_progress";
        }

        return {
          id: system.id,
          name: system.name,
          riskLevel: (system.risk_level || "minimal") as "high" | "limited" | "minimal",
          status,
          progress,
          requirements: { completed, total },
          deadline: system.risk_level === "high" ? "Aug 2, 2026" : null, // EU AI Act deadline for high-risk
        };
      });

      // Transform activity data
      const recentActivity: DashboardActivity[] = (activities || []).map((activity) => ({
        id: activity.id,
        unseen: false,
        date: formatTimeAgo(new Date(activity.created_at || new Date().toISOString())),
        user: {
          avatarUrl: activity.user_avatar_url || null,
          name: activity.user_name || "Unknown User",
          href: "#",
          status: "online" as const,
        },
        action: {
          content: activity.action_description || "performed action on",
          target: activity.target_name || "Unknown",
          href: "#",
        },
      }));

      // Calculate team activity from activity log - group by user and count today's actions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const teamActivityMap = new Map<string, { name: string; avatar: string | null; count: number }>();
      
      (activities || []).forEach((activity) => {
        const activityDate = new Date(activity.created_at || "");
        if (activityDate >= today) {
          const userName = activity.user_name || "Unknown User";
          const existing = teamActivityMap.get(userName);
          if (existing) {
            existing.count++;
          } else {
            teamActivityMap.set(userName, {
              name: userName,
              avatar: activity.user_avatar_url || null,
              count: 1,
            });
          }
        }
      });

      const teamActivity = Array.from(teamActivityMap.values()).map((member) => ({
        name: member.name,
        initials: getInitials(member.name),
        completedToday: member.count,
        avatar: member.avatar,
      }));

      // Calculate stats
      const totalSystems = aiSystems.length;
      const compliantCount = aiSystems.filter((s) => s.status === "compliant").length;
      const inProgressCount = aiSystems.filter((s) => s.status === "in_progress").length;
      const notStartedCount = aiSystems.filter((s) => s.status === "not_started").length;
      const totalRequirements = aiSystems.reduce((sum, s) => sum + s.requirements.total, 0);
      const completedRequirements = aiSystems.reduce((sum, s) => sum + s.requirements.completed, 0);
      const overallProgress = totalRequirements > 0 
        ? Math.round((completedRequirements / totalRequirements) * 100) 
        : 0;

      const riskDistribution = {
        high: aiSystems.filter((s) => s.riskLevel === "high").length,
        limited: aiSystems.filter((s) => s.riskLevel === "limited").length,
        minimal: aiSystems.filter((s) => s.riskLevel === "minimal").length,
      };

      // Calculate document stats
      const documentStats: DocumentStats = {
        total: documents?.length || 0,
        byType: {
          technical: documents?.filter((d) => d.document_type === "technical").length || 0,
          risk: documents?.filter((d) => d.document_type === "risk").length || 0,
          policy: documents?.filter((d) => d.document_type === "policy").length || 0,
          model_card: documents?.filter((d) => d.document_type === "model_card").length || 0,
        },
      };

      // Calculate pending actions stats
      // Urgent = requirements with status "pending" (needs immediate attention)
      // Upcoming = requirements with status "in_progress" or other non-completed
      const pendingList = pendingRequirements || [];
      const urgentCount = pendingList.filter((r) => r.status === "pending").length;
      const upcomingCount = pendingList.filter((r) => r.status !== "pending").length;
      
      const pendingActionsStats: PendingActionsStats = {
        total: pendingList.length,
        urgent: urgentCount,
        upcoming: upcomingCount,
      };

      // Get organization name safely
      const orgData = profile?.organizations as { name: string } | null;
      const companyName = orgData?.name || "Your Organization";

      setData({
        user: {
          name: profile?.full_name?.split(" ")[0] || "User",
          company: companyName,
        },
        aiSystems,
        recentActivity,
        teamActivity,
        stats: {
          totalSystems,
          compliantCount,
          inProgressCount,
          notStartedCount,
          totalRequirements,
          completedRequirements,
          overallProgress,
          riskDistribution,
          documents: documentStats,
          pendingActions: pendingActionsStats,
        },
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, isLoading, error, refetch: fetchDashboard };
}
