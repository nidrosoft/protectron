"use client";

import { useState } from "react";
import type { Key } from "react-aria-components";
import { useRouter } from "next/navigation";
import { Cpu, Add, SearchNormal1 } from "iconsax-react";
import { List, Grid01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Select } from "@/components/base/select/select";
import { cx } from "@/utils/cx";
import { SystemCardGrid, SystemCardList } from "./components";
import {
  mockAISystems,
  riskFilterOptions,
  statusFilterOptions,
  type RiskFilter,
  type StatusFilter,
} from "./data/mock-data";

export default function AISystemsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  // Filter systems
  const filteredSystems = mockAISystems.filter((system) => {
    const matchesSearch = system.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      system.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === "all" || system.riskLevel === riskFilter;
    const matchesStatus = statusFilter === "all" || system.status === statusFilter;
    return matchesSearch && matchesRisk && matchesStatus;
  });

  const isEmpty = mockAISystems.length === 0;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-secondary bg-primary px-6 py-5 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-primary lg:text-2xl">AI Systems</h1>
            <p className="mt-1 text-sm text-tertiary">
              Track and manage all AI systems used in your organization.
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

              {/* Status Filter */}
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
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Cpu size={32} color="currentColor" className="text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-primary">No AI Systems Yet</h3>
            <p className="mt-2 max-w-sm text-sm text-tertiary">
              Start tracking your AI systems to ensure compliance with the EU AI Act. 
              Add your first system to get started.
            </p>
            <Button 
              size="lg" 
              className="mt-6"
              iconLeading={({ className }) => <Add size={20} color="currentColor" className={className} />}
              onClick={() => router.push("/ai-systems/new")}
            >
              Add Your First AI System
            </Button>
          </div>
        )}

        {/* No Results */}
        {!isEmpty && filteredSystems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <SearchNormal1 size={32} color="currentColor" className="text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-primary">No Results Found</h3>
            <p className="mt-2 max-w-sm text-sm text-tertiary">
              No AI systems match your current filters. Try adjusting your search or filters.
            </p>
            <Button 
              size="md" 
              color="secondary"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setRiskFilter("all");
                setStatusFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* AI Systems List/Grid */}
        {filteredSystems.length > 0 && (
          <div className={cx(
            viewMode === "list" ? "flex flex-col gap-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          )}>
            {filteredSystems.map((system) => (
              viewMode === "grid" 
                ? <SystemCardGrid key={system.id} system={system} />
                : <SystemCardList key={system.id} system={system} />
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
