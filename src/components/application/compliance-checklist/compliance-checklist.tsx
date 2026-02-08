"use client";

import { useState, useEffect } from "react";
import { 
  TickCircle, 
  CloseCircle, 
  ArrowRight2, 
  ArrowDown2,
  Maximize4,
  Minus,
  DocumentText,
  ShieldTick,
  Timer1,
} from "iconsax-react";
import { Check, ChevronDown, ChevronRight, X } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { ProgressBarBase } from "@/components/base/progress-indicators/progress-indicators";
import { cx } from "@/utils/cx";

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: "complete" | "in_progress" | "pending";
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  subItems?: {
    id: string;
    title: string;
    status: "complete" | "pending";
  }[];
}

interface ComplianceChecklistProps {
  progress: number;
  items: ChecklistItem[];
  systemName: string;
  deadline?: string;
  onClose?: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export const ComplianceChecklist = ({
  progress,
  items,
  systemName,
  deadline,
  onClose,
  isMinimized = false,
  onToggleMinimize,
}: ComplianceChecklistProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(true);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Find next action item
  const nextAction = items.find(item => item.status !== "complete");
  const completedCount = items.filter(item => item.status === "complete").length;

  if (!isVisible) return null;

  // Minimized state - just show a small floating button
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onToggleMinimize}
          className="flex items-center gap-3 rounded-full bg-brand-600 px-4 py-3 text-white shadow-lg hover:bg-brand-700 transition-all"
        >
          <div className="relative">
            <ShieldTick size={24} color="currentColor" variant="Bold" />
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-warning-400 text-[10px] font-bold flex items-center justify-center text-warning-900">
              {items.length - completedCount}
            </div>
          </div>
          <span className="font-medium">{progress}% Complete</span>
          <Maximize4 size={16} color="currentColor" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[70vh] overflow-hidden rounded-xl bg-primary shadow-2xl border border-secondary">
      {/* Header */}
      <div className="bg-brand-600 px-4 py-3 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldTick size={20} color="currentColor" variant="Bold" />
            <h3 className="font-semibold text-sm">Compliance Checklist</h3>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={onToggleMinimize}
              className="p-1 hover:bg-brand-500 rounded transition-colors"
            >
              <Minus size={16} color="currentColor" />
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-brand-500 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="text-xs text-brand-100 truncate">{systemName}</p>
        
        {/* Progress */}
        <div className="mt-3 flex items-center gap-3">
          <ProgressBarBase 
            value={progress} 
            className="flex-1 bg-brand-400" 
            progressClassName="bg-white"
          />
          <span className="text-sm font-bold">{progress}%</span>
        </div>
        
        <div className="mt-2 flex items-center justify-between text-xs text-brand-100">
          <span>{completedCount}/{items.length} tasks complete</span>
          {deadline && (
            <span className="flex items-center gap-1">
              <Timer1 size={12} color="currentColor" />
              Due: {deadline}
            </span>
          )}
        </div>
      </div>

      {/* Next Action Highlight */}
      {nextAction && (
        <div className="bg-warning-50 border-b border-warning-200 px-4 py-3">
          <p className="text-xs font-semibold text-warning-800 uppercase tracking-wide mb-1">
            Next Action
          </p>
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-warning-900 truncate">{nextAction.title}</p>
              <p className="text-xs text-warning-700 truncate">{nextAction.description}</p>
            </div>
            {nextAction.action && (
              <Button 
                size="sm" 
                color="primary"
                onClick={nextAction.action.onClick}
              >
                {nextAction.action.label}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Checklist Items */}
      <div className="max-h-[40vh] overflow-y-auto">
        <ul className="divide-y divide-secondary">
          {items.map((item, index) => (
            <li key={item.id}>
              <div 
                className={cx(
                  "flex items-start gap-3 px-4 py-3 transition-colors",
                  item.status === "complete" ? "bg-success-50/50" : "hover:bg-secondary_subtle"
                )}
              >
                {/* Status Icon */}
                <div className="mt-0.5">
                  {item.status === "complete" ? (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success-500">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  ) : item.status === "in_progress" ? (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500">
                      <span className="text-[10px] font-bold text-white">{index + 1}</span>
                    </div>
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                      <span className="text-[10px] font-medium text-gray-400">{index + 1}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cx(
                      "text-sm font-medium",
                      item.status === "complete" ? "text-success-700 line-through" : "text-primary"
                    )}>
                      {item.title}
                    </p>
                    {item.subItems && item.subItems.length > 0 && (
                      <button 
                        onClick={() => toggleExpanded(item.id)}
                        className="p-0.5 hover:bg-gray-100 rounded"
                      >
                        {expandedItems.has(item.id) ? (
                          <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>
                  <p className={cx(
                    "text-xs",
                    item.status === "complete" ? "text-success-600" : "text-tertiary"
                  )}>
                    {item.status === "complete" ? "Completed" : item.description}
                  </p>

                  {/* Sub-items */}
                  {item.subItems && expandedItems.has(item.id) && (
                    <ul className="mt-2 space-y-1 pl-2 border-l-2 border-gray-200">
                      {item.subItems.map(subItem => (
                        <li key={subItem.id} className="flex items-center gap-2 py-1">
                          {subItem.status === "complete" ? (
                            <Check className="h-3 w-3 text-success-500" />
                          ) : (
                            <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                          )}
                          <span className={cx(
                            "text-xs",
                            subItem.status === "complete" ? "text-success-600 line-through" : "text-secondary"
                          )}>
                            {subItem.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Action Button */}
                {item.status !== "complete" && item.action && (
                  <button
                    onClick={item.action.onClick}
                    className="shrink-0 flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                  >
                    {item.action.label}
                    <ArrowRight2 size={12} color="currentColor" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-secondary px-4 py-3 bg-secondary_subtle">
        <p className="text-xs text-tertiary text-center">
          Complete all items to achieve full compliance
        </p>
      </div>
    </div>
  );
};

export default ComplianceChecklist;
