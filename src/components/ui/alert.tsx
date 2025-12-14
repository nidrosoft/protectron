"use client";

import { type ReactNode } from "react";
import { InfoCircle, TickCircle, Warning2, CloseCircle, CloseSquare } from "iconsax-react";
import { cx } from "@/utils/cx";

type AlertVariant = "info" | "success" | "warning" | "error";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
  icon?: ReactNode;
}

const variantStyles: Record<AlertVariant, { container: string; icon: string; title: string }> = {
  info: {
    container: "bg-blue-50 border-blue-200",
    icon: "text-blue-600",
    title: "text-blue-800",
  },
  success: {
    container: "bg-success-50 border-success-200",
    icon: "text-success-600",
    title: "text-success-800",
  },
  warning: {
    container: "bg-warning-50 border-warning-200",
    icon: "text-warning-600",
    title: "text-warning-800",
  },
  error: {
    container: "bg-error-50 border-error-200",
    icon: "text-error-600",
    title: "text-error-800",
  },
};

const defaultIcons: Record<AlertVariant, ReactNode> = {
  info: <InfoCircle size={20} variant="Bold" />,
  success: <TickCircle size={20} variant="Bold" />,
  warning: <Warning2 size={20} variant="Bold" />,
  error: <CloseCircle size={20} variant="Bold" />,
};

export function Alert({
  variant = "info",
  title,
  children,
  onClose,
  className,
  icon,
}: AlertProps) {
  const styles = variantStyles[variant];

  return (
    <div
      role="alert"
      className={cx(
        "flex gap-3 rounded-lg border p-4",
        styles.container,
        className
      )}
    >
      <div className={cx("shrink-0", styles.icon)}>
        {icon || defaultIcons[variant]}
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={cx("text-sm font-semibold", styles.title)}>{title}</h4>
        )}
        <div className={cx("text-sm", title ? "mt-1" : "", styles.title, "opacity-80")}>
          {children}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={cx(
            "shrink-0 p-0.5 rounded hover:bg-black/5 transition-colors",
            styles.icon
          )}
        >
          <CloseSquare size={18} />
        </button>
      )}
    </div>
  );
}
