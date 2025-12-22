"use client";

import { useState, useEffect, createContext, useContext, useCallback, type FC } from "react";
import { CheckCircle, XCircle, AlertCircle, AlertTriangle, X } from "@untitledui/icons";
import { cx } from "@/utils/cx";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const toastConfig: Record<ToastType, {
  icon: FC<{ className?: string }>;
  iconBgColor: string;
  iconColor: string;
}> = {
  success: {
    icon: CheckCircle,
    iconBgColor: "bg-success-100",
    iconColor: "text-success-600",
  },
  error: {
    icon: XCircle,
    iconBgColor: "bg-error-100",
    iconColor: "text-error-600",
  },
  info: {
    icon: AlertCircle,
    iconBgColor: "bg-brand-100",
    iconColor: "text-brand-600",
  },
  warning: {
    icon: AlertTriangle,
    iconBgColor: "bg-warning-100",
    iconColor: "text-warning-600",
  },
};

const ToastItem = ({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: () => void;
}) => {
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  useEffect(() => {
    const duration = toast.duration || 4000;
    const timer = setTimeout(onRemove, duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onRemove]);

  return (
    <div className="flex items-start gap-4 rounded-xl border border-secondary bg-primary p-4 shadow-lg animate-in slide-in-from-right-full duration-300">
      {/* Icon */}
      <div className={cx("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", config.iconBgColor)}>
        <Icon className={cx("h-5 w-5", config.iconColor)} />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-sm font-semibold text-primary">{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-sm text-tertiary">{toast.message}</p>
        )}
      </div>
      
      {/* Close button */}
      <button
        onClick={onRemove}
        className="shrink-0 rounded-lg p-1.5 text-quaternary hover:bg-secondary hover:text-tertiary transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

const ToastContainer = ({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};
