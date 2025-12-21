"use client";

import Image from "next/image";
import { cx } from "@/utils/cx";

interface ProtectronLogoProps {
  className?: string;
  showText?: boolean;
}

// Full logo - used when sidebar is expanded
export const ProtectronLogo = ({ className }: ProtectronLogoProps) => (
  <div className={cx("flex items-center", className)}>
    <Image
      src="/assets/images/logo-light.png"
      alt="Protectron"
      width={180}
      height={40}
      className="h-10 w-auto dark:hidden"
      priority
    />
    <Image
      src="/assets/images/logo-dark.png"
      alt="Protectron"
      width={180}
      height={40}
      className="h-10 w-auto hidden dark:block"
      priority
    />
  </div>
);

// Minimal logo (favicon) - used when sidebar is collapsed
export const ProtectronLogoMinimal = ({ className }: { className?: string }) => (
  <div className={cx("flex items-center justify-center", className)}>
    <Image
      src="/assets/images/favicon.png"
      alt="Protectron"
      width={32}
      height={32}
      className="h-8 w-8"
      priority
    />
  </div>
);
