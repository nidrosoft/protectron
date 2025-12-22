"use client";

import Image from "next/image";
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
        <div className="flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/images/logo-light.png"
              alt="Protectron"
              width={615}
              height={126}
              className="h-7 w-auto sm:h-8"
              priority
            />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              href="/resources/help" 
              className="text-xs font-medium text-tertiary hover:text-secondary sm:text-sm"
            >
              Help
            </Link>
            <Link 
              href="/" 
              className="text-xs font-medium text-tertiary hover:text-secondary sm:text-sm"
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
