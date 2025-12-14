"use client";

import { ShieldTick } from "iconsax-react";
import Link from "next/link";

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-primary">
      {/* Header - Fixed */}
      <header className="shrink-0 border-b border-secondary bg-primary">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <ShieldTick size={18} color="#fff" variant="Bold" />
            </div>
            <span className="text-lg font-semibold text-primary">Protectron</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/resources/help" 
              className="text-sm font-medium text-tertiary hover:text-secondary"
            >
              Help & Assistance
            </Link>
            <Link 
              href="/" 
              className="text-sm font-medium text-tertiary hover:text-secondary"
            >
              Log out
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Takes remaining height, no overflow */}
      <main className="flex min-h-0 flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
