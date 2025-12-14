"use client";

import { ShieldTick } from "iconsax-react";
import { cx } from "@/utils/cx";

interface ProtectronLogoProps {
  className?: string;
  showText?: boolean;
}

export const ProtectronLogo = ({ className, showText = true }: ProtectronLogoProps) => (
  <div className={cx("flex items-center gap-3", className)}>
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
      <ShieldTick size={20} color="#fff" variant="Bold" />
    </div>
    {showText && <span className="text-lg font-semibold text-primary">Protectron</span>}
  </div>
);

export const ProtectronLogoMinimal = ({ className }: { className?: string }) => (
  <div className={cx("flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600", className)}>
    <ShieldTick size={20} color="#fff" variant="Bold" />
  </div>
);
