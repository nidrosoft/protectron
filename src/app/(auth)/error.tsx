"use client";

import { useEffect } from "react";
import { Button } from "@/components/base/buttons/button";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Auth error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 bg-primary">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-primary">Authentication Error</h2>
        <p className="mt-2 text-sm text-tertiary max-w-md">
          We encountered an error during authentication. Please try again.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-quaternary">Error ID: {error.digest}</p>
        )}
      </div>
      <div className="flex gap-3">
        <Button color="secondary" onClick={() => window.location.href = "/"}>
          Go Home
        </Button>
        <Button onClick={reset}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
