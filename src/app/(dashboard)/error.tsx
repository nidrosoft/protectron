"use client";

import { useEffect } from "react";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { AlertCircle } from "@untitledui/icons";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8">
      <FeaturedIcon
        icon={AlertCircle}
        size="xl"
        color="error"
        theme="light"
      />
      <div className="text-center">
        <h2 className="text-xl font-semibold text-primary">Something went wrong</h2>
        <p className="mt-2 text-sm text-tertiary max-w-md">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-quaternary">Error ID: {error.digest}</p>
        )}
      </div>
      <div className="flex gap-3">
        <Button color="secondary" onClick={() => window.location.href = "/dashboard"}>
          Go to Dashboard
        </Button>
        <Button onClick={reset}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
