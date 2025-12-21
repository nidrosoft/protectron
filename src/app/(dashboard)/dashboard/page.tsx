"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { DeadlinesModal } from "@/components/application/modals/deadlines-modal";
import { DocumentGeneratorModal } from "@/components/application/modals/document-generator-modal";
import { UploadModal } from "@/components/application/modals/upload-modal";
import { useDashboard } from "@/hooks";
import { riskLevelConfig, statusConfig, daysUntil } from "./data/mock-data";

export default function DashboardPage() {
  const router = useRouter();
  const { data, isLoading, error } = useDashboard();
  
  // Modal states
  const [isDeadlinesModalOpen, setIsDeadlinesModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-secondary rounded mb-2" />
          <div className="h-4 w-96 bg-secondary rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-secondary rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col gap-8 p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="text-error-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-primary mb-2">Something went wrong</h2>
          <p className="text-tertiary mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  // Use real data or fallback to empty state
  const currentUser = data?.user || { name: "User", company: "Your Organization" };
  const aiSystems = data?.aiSystems || [];
  const recentActivity = data?.recentActivity || [];
  const teamActivity = data?.teamActivity || [];
  const stats = data?.stats || {
    totalSystems: 0,
    compliantCount: 0,
    inProgressCount: 0,
    notStartedCount: 0,
    totalRequirements: 0,
    completedRequirements: 0,
    overallProgress: 0,
    riskDistribution: { high: 0, limited: 0, minimal: 0 },
    documents: { total: 0, byType: { technical: 0, risk: 0, policy: 0, model_card: 0 } },
    pendingActions: { total: 0, urgent: 0, upcoming: 0 },
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
          <Button size="md" color="secondary" iconLeading={Calendar} onClick={() => setIsDeadlinesModalOpen(true)}>
            View Deadlines
          </Button>
          <Dropdown.Root>
            <Button size="md" iconTrailing={ChevronDown}>
              Quick Actions
            </Button>
            <Dropdown.Popover>
              <Dropdown.Menu>
                <Dropdown.Item label="Add AI System" icon={Plus} href="/ai-systems/new" />
                <Dropdown.Item label="Generate Document" icon={Edit05} onAction={() => setIsDocumentModalOpen(true)} />
                <Dropdown.Item label="Upload Evidence" icon={Upload01} onAction={() => setIsUploadModalOpen(true)} />
                <Dropdown.Item label="Mark Requirement Complete" icon={CheckCircle} onAction={() => router.push("/requirements")} />
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown.Root>
        </div>
      </div>

      {/* Key Metrics Row */}
      <MetricsSection
        overallProgress={stats.overallProgress}
        totalSystems={stats.totalSystems}
        completedRequirements={stats.completedRequirements}
        totalRequirements={stats.totalRequirements}
      />

      {/* Overall Compliance Status Card */}
      <ComplianceOverview
        overallProgress={stats.overallProgress}
        completedRequirements={stats.completedRequirements}
        totalRequirements={stats.totalRequirements}
      />

      {/* Recent Activity, Risk Distribution, Team Activity */}
      <ActivitySection
        recentActivity={recentActivity as any}
        teamActivity={teamActivity}
        riskDistribution={stats.riskDistribution}
      />

      {/* Stats Cards Row */}
      <StatsCards
        totalSystems={stats.totalSystems}
        compliantCount={stats.compliantCount}
        inProgressCount={stats.inProgressCount}
        notStartedCount={stats.notStartedCount}
        documents={stats.documents}
        pendingActions={stats.pendingActions}
      />

      {/* AI Systems Table */}
      <AISystemsTable systems={aiSystems} />

      {/* Upcoming Deadlines */}
      <DeadlinesSection 
        highRiskCount={stats.riskDistribution.high}
        limitedRiskCount={stats.riskDistribution.limited}
      />

      {/* Modals */}
      <DeadlinesModal
        isOpen={isDeadlinesModalOpen}
        onOpenChange={setIsDeadlinesModalOpen}
      />
      
      <DocumentGeneratorModal
        isOpen={isDocumentModalOpen}
        onOpenChange={setIsDocumentModalOpen}
        onGenerate={(data) => {
          setIsDocumentModalOpen(false);
        }}
      />
      
      <UploadModal
        isOpen={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        title="Upload Evidence"
        description="Select an AI system and upload evidence files."
        aiSystemId={aiSystems[0]?.id}
        uploadToApi={true}
        onUpload={async (files) => {
          setIsUploadModalOpen(false);
        }}
      />
    </div>
  );
}
