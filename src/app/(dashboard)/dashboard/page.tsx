"use client";

import { Calendar, ChevronDown, Plus, Edit05, Upload01, CheckCircle } from "@untitledui/icons";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Button } from "@/components/base/buttons/button";
import {
  MetricsSection,
  ComplianceOverview,
  ActivitySection,
  StatsCards,
  AISystemsTable,
  DeadlinesSection,
} from "./components";
import { currentUser, recentActivity, teamActivity, aiSystems } from "./data/mock-data";

export default function DashboardPage() {
  // Calculate overall stats
  const totalRequirements = aiSystems.reduce((sum, s) => sum + s.requirements.total, 0);
  const completedRequirements = aiSystems.reduce((sum, s) => sum + s.requirements.completed, 0);
  const overallProgress = Math.round((completedRequirements / totalRequirements) * 100);
  
  const compliantCount = aiSystems.filter(s => s.status === "compliant").length;
  const inProgressCount = aiSystems.filter(s => s.status === "in_progress").length;
  const notStartedCount = aiSystems.filter(s => (s.status as string) === "not_started").length;

  const riskDistribution = {
    high: aiSystems.filter(s => s.riskLevel === "high").length,
    limited: aiSystems.filter(s => s.riskLevel === "limited").length,
    minimal: aiSystems.filter(s => s.riskLevel === "minimal").length,
  };

  return (
    <div className="flex flex-col gap-8 p-6 lg:p-8">
      {/* Header with Welcome Message */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-primary lg:text-display-xs">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-md text-tertiary">
            Track, manage and monitor your EU AI Act compliance status.
          </p>
        </div>
        <div className="flex gap-3">
          <Button size="md" color="secondary" iconLeading={Calendar}>
            View Deadlines
          </Button>
          <Dropdown.Root>
            <Button size="md" iconTrailing={ChevronDown}>
              Quick Actions
            </Button>
            <Dropdown.Popover>
              <Dropdown.Menu>
                <Dropdown.Item label="Add AI System" icon={Plus} href="/ai-systems/new" />
                <Dropdown.Item label="Generate Document" icon={Edit05} onAction={() => {}} />
                <Dropdown.Item label="Upload Evidence" icon={Upload01} onAction={() => {}} />
                <Dropdown.Item label="Mark Requirement Complete" icon={CheckCircle} onAction={() => {}} />
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown.Root>
        </div>
      </div>

      {/* Key Metrics Row */}
      <MetricsSection
        overallProgress={overallProgress}
        totalSystems={aiSystems.length}
        completedRequirements={completedRequirements}
        totalRequirements={totalRequirements}
      />

      {/* Overall Compliance Status Card */}
      <ComplianceOverview
        overallProgress={overallProgress}
        completedRequirements={completedRequirements}
        totalRequirements={totalRequirements}
      />

      {/* Recent Activity, Risk Distribution, Team Activity */}
      <ActivitySection
        recentActivity={recentActivity}
        teamActivity={teamActivity}
        riskDistribution={riskDistribution}
      />

      {/* Stats Cards Row */}
      <StatsCards
        totalSystems={aiSystems.length}
        compliantCount={compliantCount}
        inProgressCount={inProgressCount}
        notStartedCount={notStartedCount}
      />

      {/* AI Systems Table */}
      <AISystemsTable systems={aiSystems} />

      {/* Upcoming Deadlines */}
      <DeadlinesSection />
    </div>
  );
}
