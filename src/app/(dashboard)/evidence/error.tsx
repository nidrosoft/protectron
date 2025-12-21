"use client";

import { useEffect } from "react";
import { Button } from "@/components/base/buttons/button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { AlertCircle } from "@untitledui/icons";

export default function EvidenceError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Evidence error:", error);
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
        <h2 className="text-xl font-semibold text-primary">Failed to load Evidence</h2>
        <p className="mt-2 text-sm text-tertiary max-w-md">
          We couldn&apos;t load your evidence. Please try again.
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
