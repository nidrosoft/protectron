"use client";

import { useState } from "react";
import type { Key } from "react-aria-components";
import {
  TickCircle,
  DocumentText1,
  FolderOpen,
  DocumentUpload,
  Document,
  Cpu,
  Clock,
  Trash,
} from "iconsax-react";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Badge } from "@/components/base/badges/badges";
import { Select, type SelectItemType } from "@/components/base/select/select";
import { TextArea } from "@/components/base/textarea/textarea";
import { type Requirement, type RequirementStatus } from "./requirement-item";
import { cx } from "@/utils/cx";

interface RequirementDetailSlideoutProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  requirement: Requirement | null;
  onStatusChange?: (requirementId: string, status: RequirementStatus) => void;
  onUploadEvidence?: () => void;
  onGenerateDocument?: () => void;
  onUnlinkEvidence?: () => void;
  onUnlinkDocument?: () => void;
}

const statusOptions: SelectItemType[] = [
  { id: "not_started", label: "Not Started" },
  { id: "in_progress", label: "In Progress" },
  { id: "complete", label: "Complete" },
  { id: "not_applicable", label: "Not Applicable" },
];

const statusConfig: Record<RequirementStatus, { label: string; color: "success" | "warning" | "gray" | "blue" }> = {
  complete: { label: "Complete", color: "success" },
  in_progress: { label: "In Progress", color: "warning" },
  not_started: { label: "Not Started", color: "gray" },
  not_applicable: { label: "N/A", color: "blue" },
};

const Divider = () => (
  <svg className="h-[2.5px] w-full">
    <line
      x1="1.2"
      y1="1.2"
      x2="100%"
      y2="1.2"
      className="stroke-border-primary"
      stroke="black"
      strokeWidth="2.4"
      strokeDasharray="0,6"
      strokeLinecap="round"
    />
  </svg>
);

export const RequirementDetailSlideout = ({
  isOpen,
  onOpenChange,
  requirement,
  onStatusChange,
  onUploadEvidence,
  onGenerateDocument,
  onUnlinkEvidence,
  onUnlinkDocument,
}: RequirementDetailSlideoutProps) => {
  const [selectedStatus, setSelectedStatus] = useState<RequirementStatus>(
    requirement?.status || "not_started"
  );
  const [justification, setJustification] = useState(requirement?.justification || "");
  const [isEditing, setIsEditing] = useState(false);

  // Reset state when requirement changes
  if (requirement && selectedStatus !== requirement.status) {
    setSelectedStatus(requirement.status);
    setJustification(requirement.justification || "");
    setIsEditing(false);
  }

  const handleSave = () => {
    if (requirement && onStatusChange) {
      onStatusChange(requirement.id, selectedStatus);
    }
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
    onOpenChange(false);
  };

  if (!requirement) return null;

  const config = statusConfig[requirement.status];
  const isComplete = requirement.status === "complete";
  const isNotApplicable = requirement.status === "not_applicable";

  return (
    <SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <SlideoutMenu isDismissable>
        <div className="relative w-full">
          <CloseButton
            className="absolute top-3 right-3 z-10"
            theme="dark"
            onClick={handleClose}
          />

          {/* Header */}
          <div className="bg-secondary_subtle px-4 pt-4 pb-6 md:px-6">
            <div className="flex items-start gap-3">
              {/* Status Icon */}
              <div className="mt-1 shrink-0">
                {isComplete ? (
                  <div className="flex size-8 items-center justify-center rounded-full bg-success-100">
                    <TickCircle size={20} color="currentColor" variant="Bold" className="text-success-600" />
                  </div>
                ) : isNotApplicable ? (
                  <div className="flex size-8 items-center justify-center rounded-full bg-gray-100">
                    <span className="text-sm font-medium text-gray-500">—</span>
                  </div>
                ) : (
                  <div className="flex size-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                    <Clock size={16} color="currentColor" className="text-gray-400" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <Badge size="sm" color={config.color} className="mb-2">
                  {config.label}
                </Badge>
                <h2 className="text-lg font-semibold text-primary">
                  {requirement.title}
                </h2>
                <p className="mt-1 text-sm text-tertiary">
                  {requirement.articleTitle} • {requirement.articleId}
                </p>
              </div>
            </div>
          </div>
        </div>

        <SlideoutMenu.Content>
          <div className="flex flex-col gap-4">
            <Divider />

            {/* AI System */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary">AI System</label>
              <div className="flex items-center gap-2">
                <Cpu size={16} color="currentColor" className="text-tertiary" />
                <span className="text-sm text-primary">{requirement.systemName}</span>
              </div>
            </div>

            <Divider />

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary">Status</label>
              {isEditing ? (
                <Select
                  size="sm"
                  placeholder="Select Status"
                  selectedKey={selectedStatus}
                  onSelectionChange={(key: Key | null) => key && setSelectedStatus(key as RequirementStatus)}
                  items={statusOptions}
                >
                  {(item) => (
                    <Select.Item key={item.id} id={item.id} textValue={item.label}>
                      {item.label}
                    </Select.Item>
                  )}
                </Select>
              ) : (
                <Badge size="sm" color={config.color}>
                  {config.label}
                </Badge>
              )}
            </div>

            {/* Justification for N/A (only in edit mode or if already set) */}
            {(isEditing && selectedStatus === "not_applicable") || (isNotApplicable && requirement.justification) ? (
              <>
                <Divider />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-secondary">Justification</label>
                  {isEditing ? (
                    <TextArea
                      placeholder="Explain why this requirement is not applicable..."
                      value={justification}
                      onChange={(value: string) => setJustification(value)}
                    />
                  ) : (
                    <p className="text-sm text-tertiary italic">{requirement.justification}</p>
                  )}
                </div>
              </>
            ) : null}

            <Divider />

            {/* Linked Evidence */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-secondary">Evidence</label>
              {requirement.linkedEvidence ? (
                <div className="flex items-center justify-between rounded-lg border border-secondary bg-secondary_subtle p-3">
                  <div className="flex items-center gap-2">
                    <FolderOpen size={16} color="currentColor" className="text-tertiary" />
                    <span className="text-sm text-primary">{requirement.linkedEvidence.name}</span>
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      color="tertiary"
                      iconLeading={({ className }) => <Trash size={14} color="currentColor" className={className} />}
                      onClick={onUnlinkEvidence}
                    >
                      Unlink
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  size="sm"
                  color="secondary"
                  iconLeading={({ className }) => <DocumentUpload size={16} color="currentColor" className={className} />}
                  onClick={onUploadEvidence}
                >
                  Upload Evidence
                </Button>
              )}
            </div>

            <Divider />

            {/* Linked Document */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-secondary">Document</label>
              {requirement.linkedDocument ? (
                <div className="flex items-center justify-between rounded-lg border border-secondary bg-secondary_subtle p-3">
                  <div className="flex items-center gap-2">
                    <DocumentText1 size={16} color="currentColor" className="text-tertiary" />
                    <span className="text-sm text-primary">{requirement.linkedDocument.name}</span>
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      color="tertiary"
                      iconLeading={({ className }) => <Trash size={14} color="currentColor" className={className} />}
                      onClick={onUnlinkDocument}
                    >
                      Unlink
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  size="sm"
                  color="secondary"
                  iconLeading={({ className }) => <Document size={16} color="currentColor" className={className} />}
                  onClick={onGenerateDocument}
                >
                  Generate Document
                </Button>
              )}
            </div>

            <Divider />
          </div>
        </SlideoutMenu.Content>

        <SlideoutMenu.Footer className="flex w-full items-center justify-between gap-3">
          {isEditing ? (
            <>
              <Button size="md" color="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="md" color="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button size="md" color="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button size="md" color="primary" onClick={() => setIsEditing(true)}>
                Edit Status
              </Button>
            </>
          )}
        </SlideoutMenu.Footer>
      </SlideoutMenu>
    </SlideoutMenu.Trigger>
  );
};

export default RequirementDetailSlideout;
