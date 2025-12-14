"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { TickCircle, CloseCircle, InfoCircle, Warning2, CloseSquare } from "iconsax-react";
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

const toastConfig = {
  success: {
    icon: TickCircle,
    bgColor: "bg-success-50",
    borderColor: "border-success-200",
    iconColor: "text-success-600",
    titleColor: "text-success-800",
    messageColor: "text-success-700",
  },
  error: {
    icon: CloseCircle,
    bgColor: "bg-error-50",
    borderColor: "border-error-200",
    iconColor: "text-error-600",
    titleColor: "text-error-800",
    messageColor: "text-error-700",
  },
  info: {
    icon: InfoCircle,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-600",
    titleColor: "text-blue-800",
    messageColor: "text-blue-700",
  },
  warning: {
    icon: Warning2,
    bgColor: "bg-warning-50",
    borderColor: "border-warning-200",
    iconColor: "text-warning-600",
    titleColor: "text-warning-800",
    messageColor: "text-warning-700",
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
    <div
      className={cx(
        "flex items-start gap-3 rounded-xl border p-4 shadow-lg animate-in slide-in-from-right-full duration-300",
        config.bgColor,
        config.borderColor
      )}
    >
      <Icon size={20} color="currentColor" className={config.iconColor} variant="Bold" />
      <div className="flex-1 min-w-0">
        <p className={cx("text-sm font-semibold", config.titleColor)}>{toast.title}</p>
        {toast.message && (
          <p className={cx("mt-1 text-sm", config.messageColor)}>{toast.message}</p>
        )}
      </div>
      <button
        onClick={onRemove}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <CloseSquare size={18} color="currentColor" />
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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
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
