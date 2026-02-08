"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Cpu, Edit2, Pause, Play, Danger, MessageText, Box1, Judge, TickCircle } from "iconsax-react";
import { ArrowLeft, DotsVertical, Copy01, Download01, Trash01, Archive } from "@untitledui/icons";
import { ConfirmationModal } from "@/components/application/modals/confirmation-modal";
import { UploadModal } from "@/components/application/modals/upload-modal";
import { Button } from "@/components/base/buttons/button";
import { BadgeWithDot, Badge } from "@/components/base/badges/badges";
import { Tabs, TabList, Tab } from "@/components/application/tabs/tabs";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import {
  OverviewTab,
  RequirementsTab,
  DocumentsTab,
  EvidenceTab,
  ActivityTab,
  AuditTrailTab,
  SDKSetupTab,
  HITLRulesTab,
  CertificationTab,
} from "./components";
import { EmergencyStopModal } from "./components/emergency-stop-modal";
import { ResumeAgentModal } from "./components/resume-agent-modal";
import { FRIAModal } from "./components/fria-modal";
import { DataGovernanceModal } from "./components/data-governance-modal";
import { useAISystem } from "@/hooks";
import { useToast } from "@/components/base/toast/toast";
import { ComplianceChecklist, type ChecklistItem } from "@/components/application/compliance-checklist";
import { 
  mockAISystems, 
  riskLevelConfig, 
  statusConfig, 
  lifecycleStatusConfig,
  sdkStatusConfig,
  systemTypeConfig,
  ITEMS_PER_PAGE 
} from "./data/mock-data";

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

export default function AISystemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  // Fetch real data
  const { system: apiSystem, isLoading, error } = useAISystem(id);
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [requirementFilter, setRequirementFilter] = useState<"all" | "pending" | "complete">("all");
  const [documentsPage, setDocumentsPage] = useState(1);
  const [evidencePage, setEvidencePage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploadEvidenceModalOpen, setIsUploadEvidenceModalOpen] = useState(false);
  const [isGenerateDocModalOpen, setIsGenerateDocModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isEmergencyStopModalOpen, setIsEmergencyStopModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFRIAModalOpen, setIsFRIAModalOpen] = useState(false);
  const [isDataGovernanceModalOpen, setIsDataGovernanceModalOpen] = useState(false);
  const [isChecklistMinimized, setIsChecklistMinimized] = useState(false);
  const [showChecklist, setShowChecklist] = useState(true);

  // Transform API data to match component expectations
  const system = useMemo(() => {
    if (!apiSystem) {
      // Fallback to mock data structure for loading state
      return mockAISystems["system-03"];
    }
    
    const requirements = apiSystem.ai_system_requirements || [];
    const completedReqs = requirements.filter(r => r.status === "completed").length;
    
    const totalReqs = requirements.length || 1;
    const progress = Math.round((completedReqs / totalReqs) * 100);
    
    // Group requirements by article for sections
    const groupedByArticle = requirements.reduce((acc, r) => {
      const key = r.article_id;
      if (!acc[key]) {
        acc[key] = {
          id: key,
          title: r.article_title,
          article: `Article ${key}`,
          items: [],
        };
      }
      acc[key].items.push({
        id: r.id,
        title: r.title,
        status: r.status === "completed" ? "complete" as const : 
                r.status === "in_progress" ? "in_progress" as const : "not_started" as const,
        evidence: r.linked_evidence_id ? "Evidence attached" : undefined,
        document: r.linked_document_id ? "Document linked" : undefined,
      });
      return acc;
    }, {} as Record<string, { id: string; title: string; article: string; items: { id: string; title: string; status: "complete" | "in_progress" | "not_started"; evidence?: string; document?: string; }[] }>);
    
    const sections = Object.values(groupedByArticle).sort((a, b) => {
      const aNum = parseInt(a.id) || 0;
      const bNum = parseInt(b.id) || 0;
      return aNum - bNum;
    });
    
    return {
      id: apiSystem.id,
      name: apiSystem.name,
      description: apiSystem.description || "",
      type: (apiSystem.system_type || "ml_model") as keyof typeof systemTypeConfig,
      riskLevel: (apiSystem.risk_level || "minimal") as "high" | "limited" | "minimal",
      provider: apiSystem.provider || "Unknown",
      model: apiSystem.model_name || "",
      modelName: apiSystem.model_name || "",
      category: apiSystem.category || "",
      status: (apiSystem.compliance_status || "not_started") as "compliant" | "in_progress" | "not_started",
      lifecycleStatus: (apiSystem.lifecycle_status || "draft") as keyof typeof lifecycleStatusConfig,
      sdkStatus: apiSystem.sdk_connected ? "connected" as const : "disconnected" as const,
      progress,
      deploymentStatus: apiSystem.deployment_status || "development",
      updatedAt: apiSystem.updated_at || new Date().toISOString(),
      createdAt: apiSystem.created_at || new Date().toISOString(),
      requirements: {
        completed: completedReqs,
        total: requirements.length || 0,
        items: requirements.map(r => ({
          id: r.id,
          article: r.article_id,
          articleTitle: r.article_title,
          title: r.title,
          description: r.description || "",
          status: r.status || "pending",
          linkedEvidence: r.linked_evidence_id,
          linkedDocument: r.linked_document_id,
        })),
        sections,
      },
      documents: (apiSystem.documents || []).map(d => ({
        id: d.id,
        name: d.name,
        type: d.document_type,
        status: (d.status || "draft") as "pending" | "draft" | "generated",
        createdAt: (d as any).generated_at || d.created_at || new Date().toISOString(),
        size: "—",
      })),
      evidence: (apiSystem.evidence || []).map(e => ({
        id: e.id,
        name: e.name,
        type: e.file_type,
        uploadedAt: e.uploaded_at || new Date().toISOString(),
        uploadedBy: "User",
        linkedTo: (e as any).linked_to_description || "",
        size: e.file_size ? `${Math.round(Number(e.file_size) / 1024)} KB` : "—",
      })),
      activity: (apiSystem.activity || []).map(a => ({
        id: a.id,
        user: a.user_name || "System",
        avatarUrl: a.user_avatar_url || "",
        action: a.action_description || "",
        target: a.target_name || "",
        time: a.created_at ? formatTimeAgo(new Date(a.created_at)) : "Just now",
      })),
      eventsLogged: apiSystem.sdk_events_total || 0,
      agentFramework: apiSystem.agent_framework || undefined,
      hitlRules: apiSystem.agent_hitl_rules || [],
      sdkConfig: apiSystem.agent_sdk_configs?.[0] || undefined,
      certifications: apiSystem.ai_system_certifications || [],
      statistics: apiSystem.agent_statistics || [],
    };
  }, [apiSystem]);

  // Generate checklist items from requirements
  const checklistItems: ChecklistItem[] = useMemo(() => {
    if (!system) return [];
    
    const items: ChecklistItem[] = [];
    
    // Add document generation task
    const pendingDocs = system.requirements.sections.flatMap(s => 
      s.items.filter(i => i.status !== "complete")
    );
    
    if (pendingDocs.length > 0) {
      items.push({
        id: "complete-requirements",
        title: "Complete Compliance Requirements",
        description: `${system.requirements.completed}/${system.requirements.total} requirements done`,
        status: system.requirements.completed > 0 ? "in_progress" : "pending",
        action: {
          label: "View",
          onClick: () => setActiveTab("requirements"),
        },
        subItems: pendingDocs.slice(0, 5).map(doc => ({
          id: doc.id,
          title: doc.title,
          status: doc.status === "complete" ? "complete" : "pending",
        })),
      });
    } else {
      items.push({
        id: "complete-requirements",
        title: "Complete Compliance Requirements",
        description: "All requirements satisfied",
        status: "complete",
      });
    }

    // Add documentation task
    items.push({
      id: "generate-docs",
      title: "Generate Required Documents",
      description: system.documents.length > 0 ? `${system.documents.length} document(s) created` : "Create compliance documentation",
      status: system.documents.length > 0 ? "in_progress" : "pending",
      action: {
        label: "Create",
        onClick: () => setActiveTab("documents"),
      },
    });

    // Add evidence upload task
    items.push({
      id: "upload-evidence",
      title: "Upload Supporting Evidence",
      description: system.evidence.length > 0 ? `${system.evidence.length} file(s) uploaded` : "Attach evidence to requirements",
      status: system.evidence.length > 0 ? "in_progress" : "pending",
      action: {
        label: "Upload",
        onClick: () => setActiveTab("evidence"),
      },
    });

    // Add certification task (only if progress is significant)
    if (system.progress >= 50) {
      items.push({
        id: "certification",
        title: "Review Certification Status",
        description: system.progress >= 70 ? "Eligible for certification" : "Need 70% to qualify",
        status: system.progress >= 70 ? "in_progress" : "pending",
        action: {
          label: "Check",
          onClick: () => setActiveTab("certification"),
        },
      });
    }

    return items;
  }, [system]);

  // Show loading state with improved skeleton
  if (isLoading) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        {/* Header Skeleton */}
        <div className="shrink-0 border-b border-secondary bg-primary px-6 py-4">
          <div className="animate-pulse">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 bg-gray-200 rounded-lg" />
              <div className="h-7 w-64 bg-gray-200 rounded" />
              <div className="h-5 w-16 bg-gray-200 rounded-full" />
            </div>
            <div className="h-4 w-96 bg-gray-200 rounded" />
          </div>
        </div>
        
        {/* Tabs Skeleton */}
        <div className="shrink-0 border-b border-secondary bg-primary px-6">
          <div className="animate-pulse flex gap-4 py-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="flex-1 overflow-auto p-6">
          <div className="animate-pulse space-y-6">
            {/* Progress Card Skeleton */}
            <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
              <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
                <div className="text-right">
                  <div className="h-8 w-16 bg-gray-200 rounded mb-1" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
            
            {/* Stats Grid Skeleton */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-xl bg-primary p-5 shadow-xs ring-1 ring-secondary ring-inset">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg mb-3" />
                  <div className="h-7 w-12 bg-gray-200 rounded mb-1" />
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
            
            {/* Activity Skeleton */}
            <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary ring-inset">
              <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                      <div className="h-3 w-48 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-primary">Error loading AI System</h2>
          <p className="text-tertiary mt-2">{error}</p>
          <Button className="mt-4" onClick={() => router.push("/ai-systems")}>
            Back to AI Systems
          </Button>
        </div>
      </div>
    );
  }

  const isAgent = system.type === "ai_agent";
  const typeConfig = systemTypeConfig[system.type] || systemTypeConfig["ml_model"];
  const lifecycleConfig = lifecycleStatusConfig[system.lifecycleStatus] || lifecycleStatusConfig["draft"];
  const sdkConfig = sdkStatusConfig[system.sdkStatus] || sdkStatusConfig["disconnected"];

  // Paginated data
  const paginatedDocuments = system.documents.slice(
    (documentsPage - 1) * ITEMS_PER_PAGE,
    documentsPage * ITEMS_PER_PAGE
  );
  const paginatedEvidence = system.evidence.slice(
    (evidencePage - 1) * ITEMS_PER_PAGE,
    evidencePage * ITEMS_PER_PAGE
  );
  const paginatedActivity = system.activity.slice(
    (activityPage - 1) * ITEMS_PER_PAGE,
    activityPage * ITEMS_PER_PAGE
  );

  // Base tabs for all systems
  const baseTabs = [
    { id: "overview", label: "Overview" },
    { id: "certification", label: "Certification" },
    { id: "requirements", label: "Requirements", badge: `${system.requirements.completed}/${system.requirements.total}` },
    { id: "documents", label: "Documents", badge: system.documents.length },
    { id: "evidence", label: "Evidence", badge: system.evidence.length },
    { id: "activity", label: "Activity" },
  ];

  // Agent-only tabs
  const agentTabs = [
    { id: "audit-trail", label: "Audit Trail", badge: system.eventsLogged?.toLocaleString() },
    { id: "hitl-rules", label: "HITL Rules" },
    { id: "sdk-setup", label: "SDK Setup" },
  ];

  const tabs = isAgent ? [...baseTabs, ...agentTabs] : baseTabs;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="shrink-0 border-b border-secondary bg-primary px-6 py-4 lg:px-8">
        {/* Back link */}
        <Link
          href="/ai-systems"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-tertiary hover:text-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to AI Systems
        </Link>

        {/* System header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isAgent ? "bg-brand-100" : "bg-gray-100"}`}>
              {system.type === "ai_agent" && <Cpu size={24} className="text-brand-600" color="currentColor" variant="Bold" />}
              {system.type === "llm_application" && <MessageText size={24} className="text-gray-600" color="currentColor" variant="Bold" />}
              {system.type === "ml_model" && <Box1 size={24} className="text-gray-600" color="currentColor" variant="Bold" />}
              {system.type === "automated_decision" && <Judge size={24} className="text-gray-600" color="currentColor" variant="Bold" />}
              {system.type === "other" && <Box1 size={24} className="text-gray-600" color="currentColor" variant="Bold" />}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-primary lg:text-2xl">{system.name}</h1>
                {/* Risk Level Badge - Red with blinking for High Risk */}
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                  system.riskLevel === "high" 
                    ? "bg-error-50 text-error-700 ring-1 ring-error-200" 
                    : system.riskLevel === "limited" 
                    ? "bg-warning-50 text-warning-700 ring-1 ring-warning-200"
                    : "bg-success-50 text-success-700 ring-1 ring-success-200"
                }`}>
                  <span className={`h-2 w-2 rounded-full ${
                    system.riskLevel === "high" 
                      ? "bg-error-500 animate-pulse" 
                      : system.riskLevel === "limited"
                      ? "bg-warning-500"
                      : "bg-success-500"
                  }`} />
                  {riskLevelConfig[system.riskLevel].label}
                </span>
                <BadgeWithDot size="md" type="modern" color={statusConfig[system.status].color}>
                  {statusConfig[system.status].label}
                </BadgeWithDot>
                <span className="text-sm font-medium text-secondary">{system.progress}%</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-tertiary">
                {isAgent ? (
                  <>
                    <span>{system.agentFramework} Agent</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className={`h-2 w-2 rounded-full ${lifecycleConfig.dotColor}`} />
                      {lifecycleConfig.label}
                    </span>
                    <span>•</span>
                    {/* SDK Status with icon indicator */}
                    <span className="flex items-center gap-1">
                      {system.sdkStatus === "connected" && (
                        <TickCircle size={14} className="text-success-500" color="currentColor" variant="Bold" />
                      )}
                      {system.sdkStatus === "disconnected" && (
                        <span className="h-2 w-2 rounded-full bg-error-500" />
                      )}
                      {system.sdkStatus === "not_applicable" && (
                        <span className="h-2 w-2 rounded-full bg-gray-400" />
                      )}
                      SDK {sdkConfig.label}
                    </span>
                  </>
                ) : (
                  <>
                    {system.category && <span>{system.category}</span>}
                    {system.provider && system.provider !== "Unknown" && (
                      <>
                        {system.category && <span>•</span>}
                        <span>Provider: {system.provider}</span>
                      </>
                    )}
                    {system.modelName && (
                      <>
                        <span>•</span>
                        <span>Model: {system.modelName}</span>
                      </>
                    )}
                    {!system.provider && !system.modelName && (
                      <>
                        {system.category && <span>•</span>}
                        <span className="text-warning-600 italic">Provider/Model not configured</span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Agent action buttons */}
            {isAgent && (
              <>
                {isPaused ? (
                  <Button 
                    size="sm" 
                    color="secondary" 
                    iconLeading={({ className }) => <Play size={16} color="currentColor" className={className} />}
                    onClick={() => setIsResumeModalOpen(true)}
                  >
                    Resume
                  </Button>
                ) : (
                  <>
                    <Button 
                      size="sm" 
                      color="secondary" 
                      iconLeading={({ className }) => <Pause size={16} color="currentColor" className={className} />}
                      onClick={() => {
                        setIsPaused(true);
                        addToast({ type: "success", title: "Agent paused", message: "Click Resume to reactivate." });
                      }}
                    >
                      Pause
                    </Button>
                    <Button 
                      size="sm" 
                      color="primary-destructive" 
                      iconLeading={({ className }) => <Danger size={16} color="currentColor" className={className} />} 
                      onClick={() => setIsEmergencyStopModalOpen(true)}
                    >
                      Emergency Stop
                    </Button>
                  </>
                )}
              </>
            )}
            <Button size="sm" color="secondary" iconLeading={({ className }) => <Edit2 size={16} color="currentColor" className={className} />} onClick={() => router.push(`/ai-systems/${id}/edit`)}>
              Edit
            </Button>
            <Dropdown.Root>
              <Button size="sm" color="secondary" className="!p-2 aspect-square">
                <DotsVertical className="h-4 w-4" />
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu>
                  <Dropdown.Item label="Duplicate System" icon={Copy01} onAction={() => setIsDuplicateModalOpen(true)} />
                  <Dropdown.Item label="Export Data" icon={Download01} onAction={() => setIsExportModalOpen(true)} />
                  <Dropdown.Item label="Archive System" icon={Archive} onAction={() => addToast({ type: "success", title: "System archived", message: "The AI system has been archived." })} />
                  <Dropdown.Separator />
                  <Dropdown.Item label="Delete System" icon={Trash01} onAction={() => setIsDeleteModalOpen(true)} />
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown.Root>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 border-b border-secondary bg-primary px-6 pt-4 lg:px-8">
        <Tabs selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as string)}>
          <TabList type="underline" size="sm" items={tabs}>
            {(item) => (
              <Tab key={item.id} id={item.id} label={item.label} badge={item.badge} />
            )}
          </TabList>
        </Tabs>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
        {activeTab === "overview" && (
          <OverviewTab
            system={system}
            onViewAllActivity={() => setActiveTab("activity")}
          />
        )}

        {activeTab === "certification" && (
          <CertificationTab system={system} />
        )}

        {activeTab === "requirements" && (
          <RequirementsTab
            system={system}
            requirementFilter={requirementFilter}
            onFilterChange={setRequirementFilter}
            onUploadEvidence={() => setIsUploadEvidenceModalOpen(true)}
            onGenerateDocument={() => setIsGenerateDocModalOpen(true)}
            onOpenFRIA={() => setIsFRIAModalOpen(true)}
            onOpenDataGovernance={() => setIsDataGovernanceModalOpen(true)}
          />
        )}

        {activeTab === "documents" && (
          <DocumentsTab
            documents={system.documents}
            paginatedDocuments={paginatedDocuments}
            currentPage={documentsPage}
            onPageChange={setDocumentsPage}
            itemsPerPage={ITEMS_PER_PAGE}
            onGenerateDocument={() => setIsGenerateDocModalOpen(true)}
          />
        )}

        {activeTab === "evidence" && (
          <EvidenceTab
            evidence={system.evidence}
            paginatedEvidence={paginatedEvidence}
            currentPage={evidencePage}
            onPageChange={setEvidencePage}
            itemsPerPage={ITEMS_PER_PAGE}
            onUploadEvidence={() => setIsUploadEvidenceModalOpen(true)}
          />
        )}

        {activeTab === "activity" && (
          <ActivityTab
            systemId={id}
            currentPage={activityPage}
            onPageChange={setActivityPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        )}

        {/* Agent-only tabs */}
        {activeTab === "audit-trail" && isAgent && (
          <AuditTrailTab system={system} />
        )}

        {activeTab === "hitl-rules" && isAgent && (
          <HITLRulesTab system={system} />
        )}

        {activeTab === "sdk-setup" && isAgent && (
          <SDKSetupTab system={system} />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete AI System"
        description={`Are you sure you want to delete "${system.name}"? This action cannot be undone and all associated documents, evidence, and activity history will be permanently removed.`}
        variant="destructive"
        confirmText="Delete System"
        cancelText="Cancel"
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          addToast({ type: "success", title: "System deleted", message: "The AI system has been deleted." });
        }}
      />

      {/* Duplicate System Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDuplicateModalOpen}
        onOpenChange={setIsDuplicateModalOpen}
        title="Duplicate AI System"
        description={`Create a copy of "${system.name}"? This will duplicate all system settings, requirements, and documents. Evidence files will need to be re-uploaded.`}
        variant="warning"
        confirmText="Duplicate"
        cancelText="Cancel"
        onConfirm={() => {
          setIsDuplicateModalOpen(false);
          addToast({ type: "success", title: "System duplicated", message: "A copy of the AI system has been created." });
        }}
      />

      {/* Export Data Confirmation Modal */}
      <ConfirmationModal
        isOpen={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        title="Export System Data"
        description={`Export all data for "${system.name}"? This will generate a ZIP file containing system configuration, documents, evidence files, and activity logs.`}
        variant="success"
        confirmText="Export Data"
        cancelText="Cancel"
        onConfirm={() => {
          setIsExportModalOpen(false);
          addToast({ type: "success", title: "Export started", message: "You will receive a download link shortly." });
        }}
      />

      {/* Generate Document Confirmation Modal */}
      <ConfirmationModal
        isOpen={isGenerateDocModalOpen}
        onOpenChange={setIsGenerateDocModalOpen}
        title="Generate Document"
        description="Generate a new compliance document using AI? This will analyze your system data and create a draft document based on EU AI Act requirements."
        variant="success"
        confirmText="Generate Document"
        cancelText="Cancel"
        onConfirm={() => {
          setIsGenerateDocModalOpen(false);
          addToast({ type: "success", title: "Document generation started", message: "This may take a few minutes." });
        }}
      />

      {/* Upload Evidence Modal */}
      <UploadModal
        isOpen={isUploadEvidenceModalOpen}
        onOpenChange={setIsUploadEvidenceModalOpen}
        title="Upload Evidence"
        description="Upload files to serve as evidence for compliance requirements. Supported formats: PDF, DOC, XLS, CSV, PNG, JPG."
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
        uploadButtonText="Upload Evidence"
        onUpload={(files) => {
          addToast({ type: "success", title: "Upload complete", message: `${files.length} file(s) uploaded successfully!` });
        }}
      />

      {/* Emergency Stop Modal */}
      <EmergencyStopModal
        isOpen={isEmergencyStopModalOpen}
        onOpenChange={setIsEmergencyStopModalOpen}
        systemName={system.name}
        onConfirm={(reason, notifications) => {
          setIsPaused(true);
          addToast({ type: "warning", title: "Emergency Stop activated", message: "Agent has been halted. All stakeholders have been notified." });
        }}
      />

      {/* Resume Agent Modal */}
      <ResumeAgentModal
        isOpen={isResumeModalOpen}
        onOpenChange={setIsResumeModalOpen}
        systemName={system.name}
        onConfirm={(resumeReason) => {
          setIsPaused(false);
          addToast({ type: "success", title: "Agent resumed", message: "Operations have been reactivated." });
        }}
      />

      {/* FRIA Modal */}
      <FRIAModal
        isOpen={isFRIAModalOpen}
        onOpenChange={setIsFRIAModalOpen}
        systemId={id}
        systemName={system.name}
        riskLevel={system.riskLevel}
      />

      {/* Data Governance Modal */}
      <DataGovernanceModal
        isOpen={isDataGovernanceModalOpen}
        onOpenChange={setIsDataGovernanceModalOpen}
        systemName={system.name}
      />

      {/* Floating Compliance Checklist - TODO: Debug and re-enable */}
    </div>
  );
}
