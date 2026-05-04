"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-destructive">Application error</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We could not complete your request. Please try again.
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
