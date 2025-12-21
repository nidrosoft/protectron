"use client";

import { useState, useEffect, useMemo } from "react";
import type { Key } from "react-aria-components";
import { useRouter, useSearchParams } from "next/navigation";
import { Cpu, Add, SearchNormal1 } from "iconsax-react";
import { List, Grid01, SearchLg, Server01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Select } from "@/components/base/select/select";
import { cx } from "@/utils/cx";
import { SystemCardGrid, SystemCardList } from "./components";
import { useAISystems } from "@/hooks";
import {
  riskFilterOptions,
  statusFilterOptions,
  systemTypeOptions,
  lifecycleStatusOptions,
  type RiskFilter,
  type StatusFilter,
  type TypeFilter,
  type LifecycleStatus,
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

export default function AISystemsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlTypeFilter = searchParams.get("type") as TypeFilter | null;
  
  // Fetch real data
  const { systems: apiSystems, isLoading, error } = useAISystems();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(urlTypeFilter || "all");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [lifecycleFilter, setLifecycleFilter] = useState<LifecycleStatus | "all">("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  // Sync type filter with URL params
  useEffect(() => {
    if (urlTypeFilter) {
      setTypeFilter(urlTypeFilter);
    } else {
      setTypeFilter("all");
    }
  }, [urlTypeFilter]);

  // Transform API data to match component expectations
  const systems = useMemo(() => {
    return (apiSystems || []).map((system: any) => {
      // Use actual requirements count from API
      const reqTotal = system.requirements_total || 0;
      const reqCompleted = system.requirements_completed || 0;
      const progress = reqTotal > 0 ? Math.round((reqCompleted / reqTotal) * 100) : (system.compliance_progress || 0);
      
      return {
        id: system.id,
        name: system.name,
        type: (system.system_type || "ml_model") as TypeFilter,
        riskLevel: (system.risk_level || "minimal") as "high" | "limited" | "minimal",
        provider: system.provider || system.model_name || "Unknown",
        status: (system.compliance_status || "not_started") as "compliant" | "in_progress" | "not_started",
        lifecycleStatus: (system.lifecycle_status || "draft") as LifecycleStatus,
        sdkStatus: (system.sdk_connected === true) ? "connected" as const : "disconnected" as const,
        sdkAgentId: system.sdk_agent_id || null,
        requirementsComplete: reqCompleted,
        requirementsTotal: reqTotal,
        requirementsProgress: progress,
        documentsGenerated: system.documents_generated || 0,
        deadline: system.risk_level === "high" ? "Aug 2, 2026" : null,
        lastActivity: system.updated_at ? formatTimeAgo(new Date(system.updated_at)) : "Never",
        agentFramework: system.agent_framework || undefined,
        eventsLogged: system.sdk_events_total || 0,
      };
    });
  }, [apiSystems]);

  // Filter systems
  const filteredSystems = systems.filter((system) => {
    const matchesSearch = system.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      system.provider.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter: "other" means all non-agent types
    let matchesType = true;
    if (typeFilter === "ai_agent") {
      matchesType = system.type === "ai_agent";
    } else if (typeFilter === "other") {
      matchesType = system.type !== "ai_agent";
    } else if (typeFilter !== "all") {
      matchesType = system.type === typeFilter;
    }
    
    const matchesRisk = riskFilter === "all" || system.riskLevel === riskFilter;
    const matchesStatus = statusFilter === "all" || system.status === statusFilter;
    const matchesLifecycle = lifecycleFilter === "all" || system.lifecycleStatus === lifecycleFilter;
    return matchesSearch && matchesType && matchesRisk && matchesStatus && matchesLifecycle;
  });

  const isEmpty = systems.length === 0;

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <div className="shrink-0 border-b border-secondary bg-primary px-6 py-5 lg:px-8">
          <div className="animate-pulse">
            <div className="h-7 w-48 bg-secondary rounded mb-2" />
            <div className="h-4 w-96 bg-secondary rounded" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-secondary rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-secondary bg-primary px-6 py-5 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-primary lg:text-2xl">
              {typeFilter === "ai_agent" ? "AI Agents" : typeFilter === "other" ? "Models & Apps" : "AI Systems"}
            </h1>
            <p className="mt-1 text-sm text-tertiary">
              {typeFilter === "ai_agent" 
                ? "Track and manage autonomous AI agents with SDK integration."
                : typeFilter === "other"
                ? "Track and manage ML models, LLM applications, and other AI systems."
                : "Track and manage all AI systems used in your organization."}
            </p>
          </div>
          <Button 
            size="md" 
            iconLeading={({ className }) => <Add size={20} color="currentColor" className={className} />}
            onClick={() => router.push("/ai-systems/new")}
          >
            Add AI System
          </Button>
        </div>

        {/* Filters */}
        {!isEmpty && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <SearchNormal1 
                  size={20} 
                  color="currentColor" 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-quaternary z-10" 
                />
                <input
                  type="text"
                  placeholder="Search AI systems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-secondary bg-primary py-2 pl-10 pr-4 text-sm text-primary placeholder:text-quaternary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {/* Type Filter */}
              <div className="w-[140px]">
                <Select
                  selectedKey={typeFilter}
                  onSelectionChange={(key) => key && setTypeFilter(String(key) as TypeFilter)}
                  items={systemTypeOptions}
                  size="sm"
                  placeholder="All Types"
                >
                  {(item) => <Select.Item key={item.id} id={item.id} textValue={item.label}>{item.label}</Select.Item>}
                </Select>
              </div>

              {/* Risk Filter */}
              <div className="w-[160px]">
                <Select
                  selectedKey={riskFilter}
                  onSelectionChange={(key) => key && setRiskFilter(String(key) as RiskFilter)}
                  items={riskFilterOptions}
                  size="sm"
                  placeholder="All Risk Levels"
                >
                  {(item) => <Select.Item key={item.id} id={item.id} textValue={item.label}>{item.label}</Select.Item>}
                </Select>
              </div>

              {/* Compliance Status Filter */}
              <div className="w-[150px]">
                <Select
                  selectedKey={statusFilter}
                  onSelectionChange={(key) => key && setStatusFilter(String(key) as StatusFilter)}
                  items={statusFilterOptions}
                  size="sm"
                  placeholder="All Statuses"
                >
                  {(item) => <Select.Item key={item.id} id={item.id} textValue={item.label}>{item.label}</Select.Item>}
                </Select>
              </div>

              {/* Lifecycle Status Filter */}
              <div className="w-[140px]">
                <Select
                  selectedKey={lifecycleFilter}
                  onSelectionChange={(key) => key && setLifecycleFilter(String(key) as LifecycleStatus | "all")}
                  items={lifecycleStatusOptions}
                  size="sm"
                  placeholder="All Lifecycle"
                >
                  {(item) => <Select.Item key={item.id} id={item.id} textValue={item.label}>{item.label}</Select.Item>}
                </Select>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 rounded-lg border border-secondary p-1">
              <button
                onClick={() => setViewMode("list")}
                className={cx(
                  "flex items-center justify-center rounded-md p-2 transition-colors",
                  viewMode === "list" 
                    ? "bg-brand-50 text-brand-600" 
                    : "text-quaternary hover:bg-secondary hover:text-secondary"
                )}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={cx(
                  "flex items-center justify-center rounded-md p-2 transition-colors",
                  viewMode === "grid" 
                    ? "bg-brand-50 text-brand-600" 
                    : "text-quaternary hover:bg-secondary hover:text-secondary"
                )}
                title="Grid view"
              >
                <Grid01 className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
        {/* Empty State */}
        {isEmpty && (
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <EmptyState size="md">
              <EmptyState.Header pattern="grid">
                <EmptyState.FeaturedIcon icon={Server01} color="gray" theme="modern" />
              </EmptyState.Header>
              <EmptyState.Content>
                <EmptyState.Title>No AI systems yet</EmptyState.Title>
                <EmptyState.Description>
                  Start tracking your AI systems to ensure compliance with the EU AI Act. Add your first system to get started.
                </EmptyState.Description>
              </EmptyState.Content>
              <EmptyState.Footer>
                <Button 
                  size="lg" 
                  iconLeading={({ className }) => <Add size={20} color="currentColor" className={className} />}
                  onClick={() => router.push("/ai-systems/new")}
                >
                  Add Your First AI System
                </Button>
              </EmptyState.Footer>
            </EmptyState>
          </div>
        )}

        {/* No Results */}
        {!isEmpty && filteredSystems.length === 0 && (
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <EmptyState size="md">
              <EmptyState.Header pattern="grid">
                <EmptyState.FeaturedIcon icon={SearchLg} color="gray" theme="modern" />
              </EmptyState.Header>
              <EmptyState.Content>
                <EmptyState.Title>No results found</EmptyState.Title>
                <EmptyState.Description>
                  No AI systems match your current filters. Try adjusting your search or filters.
                </EmptyState.Description>
              </EmptyState.Content>
              <EmptyState.Footer>
                <Button 
                  size="lg" 
                  color="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("all");
                    setRiskFilter("all");
                    setStatusFilter("all");
                    setLifecycleFilter("all");
                    router.push("/ai-systems");
                  }}
                >
                  Clear Filters
                </Button>
              </EmptyState.Footer>
            </EmptyState>
          </div>
        )}

        {/* AI Systems List/Grid */}
        {filteredSystems.length > 0 && (
          <div className={cx(
            viewMode === "list" ? "flex flex-col gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          )}>
            {filteredSystems.map((system) => (
              viewMode === "grid" 
                ? <SystemCardGrid key={system.id} system={system as any} />
                : <SystemCardList key={system.id} system={system as any} />
            ))}

            {/* Add Another System Card */}
            <div className={cx(
              "rounded-xl border-2 border-dashed border-secondary bg-secondary_subtle p-6 text-center",
              viewMode === "grid" && "flex flex-col items-center justify-center min-h-[200px]"
            )}>
              <h4 className="text-md font-semibold text-primary">+ Add Another AI System</h4>
              <p className="mt-1 text-sm text-tertiary">
                Track all AI systems used in your organization to ensure compliance.
              </p>
              <Button 
                size="md" 
                className="mt-4"
                iconLeading={({ className }) => <Add size={20} color="currentColor" className={className} />}
                onClick={() => router.push("/ai-systems/new")}
              >
                Add AI System
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
