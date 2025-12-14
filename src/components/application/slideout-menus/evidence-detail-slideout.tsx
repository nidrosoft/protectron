"use client";

import { useState } from "react";
import type { Key } from "react-aria-components";
import {
  DocumentDownload,
  Trash,
  Edit2,
  Link21,
  Calendar,
  User,
  Cpu,
  DocumentText1,
  FolderOpen,
} from "iconsax-react";
import { FileIcon } from "@untitledui/file-icons";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { Badge } from "@/components/base/badges/badges";
import { Avatar } from "@/components/base/avatar/avatar";
import { Input } from "@/components/base/input/input";
import { Select, type SelectItemType } from "@/components/base/select/select";
import { TextArea } from "@/components/base/textarea/textarea";

// Evidence type
interface Evidence {
  id: string;
  name: string;
  type: string;
  systemId: string;
  systemName: string;
  linkedTo: string;
  linkedToId: string;
  uploadedBy: string;
  uploadedByAvatar: string;
  uploadedAt: string;
  size: string;
}

interface EvidenceDetailSlideoutProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  evidence: Evidence | null;
  onSave?: (evidence: Evidence) => void;
  onDelete?: () => void;
}

// System options
const systemOptions: SelectItemType[] = [
  { id: "system-01", label: "Customer Support Chatbot" },
  { id: "system-02", label: "Automated Hiring Screener" },
  { id: "system-03", label: "Fraud Detection System" },
];

// Linked to options
const linkedToOptions: SelectItemType[] = [
  { id: "risk-management", label: "Risk Management System" },
  { id: "data-governance", label: "Data Governance" },
  { id: "human-oversight", label: "Human Oversight" },
  { id: "technical-documentation", label: "Technical Documentation" },
];

// Get file icon type
const getFileIconType = (type: string): string => {
  const typeMap: Record<string, string> = {
    PDF: "pdf",
    CSV: "csv",
    XLSX: "xls",
    JSON: "json",
    PNG: "image",
    JPG: "image",
    JPEG: "image",
  };
  return typeMap[type.toUpperCase()] || "file";
};

// Linked to badge color
const getLinkedToBadgeColor = (linkedToId: string): "brand" | "warning" | "purple" | "blue" => {
  const colorMap: Record<string, "brand" | "warning" | "purple" | "blue"> = {
    "risk-management": "warning",
    "data-governance": "purple",
    "human-oversight": "blue",
    "technical-documentation": "brand",
  };
  return colorMap[linkedToId] || "brand";
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

export const EvidenceDetailSlideout = ({
  isOpen,
  onOpenChange,
  evidence,
  onSave,
  onDelete,
}: EvidenceDetailSlideoutProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState(evidence?.systemId || "");
  const [selectedLinkedTo, setSelectedLinkedTo] = useState(evidence?.linkedToId || "");
  const [description, setDescription] = useState("");

  // Reset state when evidence changes
  if (evidence && selectedSystem !== evidence.systemId) {
    setSelectedSystem(evidence.systemId);
    setSelectedLinkedTo(evidence.linkedToId);
    setDescription("");
    setIsEditing(false);
  }

  const handleSave = () => {
    if (evidence && onSave) {
      const systemOption = systemOptions.find((s) => s.id === selectedSystem);
      const linkedToOption = linkedToOptions.find((l) => l.id === selectedLinkedTo);
      
      onSave({
        ...evidence,
        systemId: selectedSystem,
        systemName: systemOption?.label || evidence.systemName,
        linkedToId: selectedLinkedTo,
        linkedTo: linkedToOption?.label || evidence.linkedTo,
      });
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    onOpenChange(false);
  };

  if (!evidence) return null;

  return (
    <SlideoutMenu.Trigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <SlideoutMenu isDismissable>
        <div className="relative w-full">
          <CloseButton 
            className="absolute top-3 right-3 z-10" 
            theme="dark" 
            onClick={handleClose} 
          />
          
          {/* Header with file preview */}
          <div className="bg-secondary_subtle px-4 pt-4 pb-6 md:px-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <FileIcon 
                  type={getFileIconType(evidence.type)} 
                  theme="light" 
                  className="size-16 dark:hidden" 
                />
                <FileIcon 
                  type={getFileIconType(evidence.type)} 
                  theme="dark" 
                  className="size-16 not-dark:hidden" 
                />
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <h2 className="truncate text-lg font-semibold text-primary">
                  {evidence.name}
                </h2>
                <p className="mt-1 text-sm text-tertiary">
                  {evidence.size} • {evidence.type}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    size="sm"
                    color="secondary"
                    iconLeading={({ className }) => (
                      <DocumentDownload size={16} color="currentColor" className={className} />
                    )}
                    onClick={() => alert("Download functionality coming soon!")}
                  >
                    Download
                  </Button>
                  {!isEditing && (
                    <Button
                      size="sm"
                      color="secondary"
                      iconLeading={({ className }) => (
                        <Edit2 size={16} color="currentColor" className={className} />
                      )}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                  )}
                </div>
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
              {isEditing ? (
                <Select
                  size="sm"
                  placeholder="Select AI System"
                  selectedKey={selectedSystem}
                  onSelectionChange={(key: Key | null) => key && setSelectedSystem(String(key))}
                  items={systemOptions}
                >
                  {(item) => (
                    <Select.Item key={item.id} id={item.id} textValue={item.label}>
                      {item.label}
                    </Select.Item>
                  )}
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <Cpu size={16} color="currentColor" className="text-tertiary" />
                  <span className="text-sm text-primary">{evidence.systemName}</span>
                </div>
              )}
            </div>

            <Divider />

            {/* Linked To */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-secondary">Linked To</label>
              {isEditing ? (
                <Select
                  size="sm"
                  placeholder="Select Category"
                  selectedKey={selectedLinkedTo}
                  onSelectionChange={(key: Key | null) => key && setSelectedLinkedTo(String(key))}
                  items={linkedToOptions}
                >
                  {(item) => (
                    <Select.Item key={item.id} id={item.id} textValue={item.label}>
                      {item.label}
                    </Select.Item>
                  )}
                </Select>
              ) : (
                <Badge size="sm" color={getLinkedToBadgeColor(evidence.linkedToId)}>
                  {evidence.linkedTo}
                </Badge>
              )}
            </div>

            <Divider />

            {/* Description */}
            {isEditing && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-secondary">Description (Optional)</label>
                  <TextArea
                    placeholder="Add a description for this evidence..."
                    value={description}
                    onChange={(value: string) => setDescription(value)}
                  />
                </div>
                <Divider />
              </>
            )}

            {/* Upload Info */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-tertiary">Uploaded by</span>
                <div className="flex items-center gap-2">
                  <Avatar src={evidence.uploadedByAvatar} size="xs" />
                  <span className="text-sm font-medium text-primary">{evidence.uploadedBy}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-tertiary">Upload date</span>
                <span className="text-sm font-medium text-primary">{evidence.uploadedAt}</span>
              </div>
            </div>

            <Divider />

            {/* Danger Zone */}
            {!isEditing && (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-error-600">Danger Zone</p>
                <Button
                  size="sm"
                  color="primary-destructive"
                  iconLeading={({ className }) => (
                    <Trash size={16} color="currentColor" className={className} />
                  )}
                  onClick={handleDelete}
                >
                  Delete Evidence
                </Button>
              </div>
            )}
          </div>
        </SlideoutMenu.Content>

        <SlideoutMenu.Footer className="flex w-full items-center justify-end gap-3">
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
            <Button size="md" color="secondary" onClick={handleClose}>
              Close
            </Button>
          )}
        </SlideoutMenu.Footer>
      </SlideoutMenu>
    </SlideoutMenu.Trigger>
  );
};

export default EvidenceDetailSlideout;
