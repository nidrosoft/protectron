"use client";

import { Chart, DocumentText } from "iconsax-react";
import { cx } from "@/utils/cx";

export type ReportType = "full" | "executive";

interface ReportTypeCardProps {
  type: ReportType;
  isSelected: boolean;
  onSelect: () => void;
}

const reportTypeConfig: Record<ReportType, {
  title: string;
  description: string;
  icon: typeof Chart;
}> = {
  full: {
    title: "Full Compliance Report",
    description: "Complete audit report for regulators with all details and documentation.",
    icon: Chart,
  },
  executive: {
    title: "Executive Summary",
    description: "2-page overview for leadership and investors with key metrics.",
    icon: DocumentText,
  },
};

export const ReportTypeCard = ({
  type,
  isSelected,
  onSelect,
}: ReportTypeCardProps) => {
  const config = reportTypeConfig[type];
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cx(
        "flex flex-1 flex-col items-start gap-3 rounded-xl border-2 p-4 text-left transition-all",
        isSelected
          ? "border-brand-500 bg-brand-50 ring-1 ring-brand-500"
          : "border-secondary bg-primary hover:border-brand-300 hover:bg-secondary_hover"
      )}
    >
      <div className={cx(
        "flex size-10 items-center justify-center rounded-lg",
        isSelected ? "bg-brand-100" : "bg-secondary_subtle"
      )}>
        <Icon
          size={20}
          color="currentColor"
          variant="Bold"
          className={isSelected ? "text-brand-600" : "text-tertiary"}
        />
      </div>
      <div>
        <p className={cx(
          "text-sm font-semibold",
          isSelected ? "text-brand-700" : "text-primary"
        )}>
          {config.title}
        </p>
        <p className="mt-1 text-xs text-tertiary">
          {config.description}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className={cx(
          "size-4 rounded-full border-2 flex items-center justify-center",
          isSelected ? "border-brand-500" : "border-gray-300"
        )}>
          {isSelected && (
            <div className="size-2 rounded-full bg-brand-500" />
          )}
        </div>
        <span className={cx(
          "text-xs font-medium",
          isSelected ? "text-brand-600" : "text-tertiary"
        )}>
          {isSelected ? "Selected" : "Select"}
        </span>
      </div>
    </button>
  );
};

export default ReportTypeCard;
