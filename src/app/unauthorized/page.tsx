import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-muted-foreground">403</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Unauthorized
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You do not have permission to access this page.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </main>
  );
}
