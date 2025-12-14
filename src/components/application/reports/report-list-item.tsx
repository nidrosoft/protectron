"use client";

import { Chart, DocumentText, DocumentDownload, Share, Trash, Eye } from "iconsax-react";
import { Button } from "@/components/base/buttons/button";
import { Badge } from "@/components/base/badges/badges";
import type { ReportType } from "./report-type-card";

export interface Report {
  id: string;
  type: ReportType;
  name: string;
  generatedAt: string;
  systemsIncluded: number;
  status: "ready" | "generating" | "failed";
  fileSize?: string;
}

interface ReportListItemProps {
  report: Report;
  onDownload?: () => void;
  onShare?: () => void;
  onView?: () => void;
  onDelete?: () => void;
}

const reportTypeConfig: Record<ReportType, { label: string; icon: typeof Chart }> = {
  full: { label: "Full Compliance Report", icon: Chart },
  executive: { label: "Executive Summary", icon: DocumentText },
};

export const ReportListItem = ({
  report,
  onDownload,
  onShare,
  onView,
  onDelete,
}: ReportListItemProps) => {
  const config = reportTypeConfig[report.type];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-secondary bg-primary p-4 transition-colors hover:bg-secondary_hover">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50">
          <Icon size={20} color="currentColor" variant="Bold" className="text-brand-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-primary">{report.name}</p>
            {report.status === "generating" && (
              <Badge size="sm" color="warning">Generating...</Badge>
            )}
            {report.status === "failed" && (
              <Badge size="sm" color="error">Failed</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-tertiary">{report.generatedAt}</span>
            <span className="text-xs text-quaternary">•</span>
            <span className="text-xs text-tertiary">{report.systemsIncluded} systems</span>
            {report.fileSize && (
              <>
                <span className="text-xs text-quaternary">•</span>
                <span className="text-xs text-tertiary">{report.fileSize}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {report.status === "ready" && (
          <>
            <Button
              size="sm"
              color="secondary"
              iconLeading={({ className }) => <Eye size={16} color="currentColor" className={className} />}
              onClick={onView}
            >
              View
            </Button>
            <Button
              size="sm"
              color="secondary"
              iconLeading={({ className }) => <DocumentDownload size={16} color="currentColor" className={className} />}
              onClick={onDownload}
            >
              Download
            </Button>
            <Button
              size="sm"
              color="secondary"
              iconLeading={({ className }) => <Share size={16} color="currentColor" className={className} />}
              onClick={onShare}
            >
              Share
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportListItem;
