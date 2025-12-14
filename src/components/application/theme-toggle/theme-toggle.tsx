"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun1 } from "iconsax-react";
import { cx } from "@/utils/cx";

interface ThemeToggleProps {
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle = ({ size = "sm", showLabel = true, className }: ThemeToggleProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cx("flex items-center gap-2", className)}>
        <div className={cx(
          "rounded-full bg-tertiary",
          size === "sm" ? "h-5 w-9" : "h-6 w-11"
        )} />
        {showLabel && <span className="text-sm text-tertiary">Theme</span>}
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const sizes = {
    sm: {
      track: "h-5 w-9 p-0.5",
      thumb: "size-4",
      translate: isDark ? "translate-x-4" : "translate-x-0",
      icon: 12,
    },
    md: {
      track: "h-6 w-11 p-0.5",
      thumb: "size-5",
      translate: isDark ? "translate-x-5" : "translate-x-0",
      icon: 14,
    },
  };

  const currentSize = sizes[size];

  return (
    <div className={cx("flex items-center gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        onClick={handleToggle}
        className={cx(
          "relative cursor-pointer rounded-full transition duration-150 ease-linear",
          "outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-2",
          isDark ? "bg-brand-solid hover:bg-brand-solid_hover" : "bg-tertiary hover:bg-quaternary",
          currentSize.track,
        )}
      >
        <div
          className={cx(
            "flex items-center justify-center rounded-full bg-fg-white shadow-sm transition-transform duration-150 ease-in-out",
            currentSize.thumb,
            currentSize.translate,
          )}
        >
          {isDark ? (
            <Moon size={currentSize.icon} color="currentColor" className="text-brand-600" variant="Bold" />
          ) : (
            <Sun1 size={currentSize.icon} color="currentColor" className="text-warning-500" variant="Bold" />
          )}
        </div>
      </button>
      
      {showLabel && (
        <span className="text-sm font-medium text-secondary">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </div>
  );
};

export default ThemeToggle;