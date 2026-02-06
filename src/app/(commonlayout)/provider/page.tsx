// app/providers/page.tsx
import Link from "next/link";
import { providersService } from "@/services/providers.service";
import type { Provider } from "@/types/provider/provider";
import { BeautifulProviderCard } from "@/components/provider/BeautifulProviderCard";

export default async function Page() {
  const result = await providersService.getAll();
  const providers = (result?.data ?? null) as Provider[] | null;

  // Error state
  if (result?.error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="relative overflow-hidden rounded-3xl border bg-background p-8 shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-muted/40 via-transparent to-transparent" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Couldn’t load providers
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please refresh the page or try again in a moment.
          </p>

          <div className="mt-5 rounded-2xl bg-muted p-4 text-sm">
            <span className="font-medium">Error:</span> {result.error.message}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/providers"
              className="inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Refresh
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!providers?.length) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="relative overflow-hidden rounded-3xl border bg-background p-12 text-center shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-muted/40 via-transparent to-transparent" />
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-muted">
            <span className="text-xl">🏪</span>
          </div>

          <h1 className="mt-5 text-3xl font-semibold tracking-tight">
            No providers yet
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Providers will appear here once they’re created.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Back home
            </Link>
            <Link
              href="/providers/new"
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Add provider
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main page
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Providers</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage all providers •{" "}
            <span className="font-medium">{providers.length}</span> total
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/providers/new"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            + New provider
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-7 rounded-3xl border bg-background p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-muted/40 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Total providers
            </p>
            <p className="mt-2 text-2xl font-semibold">{providers.length}</p>
          </div>

          <div className="rounded-2xl bg-muted/40 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Newest (API order)
            </p>
            <p className="mt-2 truncate text-sm font-semibold">
              {providers[0]?.shopName ?? "—"}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {providers[0]?.address ?? "—"}
            </p>
          </div>

          <div className="rounded-2xl bg-muted/40 p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Quick actions
            </p>
            <div className="mt-3 flex gap-2">
              <Link
                href="/providers"
                className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-xs font-medium hover:bg-muted"
              >
                Refresh
              </Link>
              <Link
                href="/providers/new"
                className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-xs font-medium hover:bg-muted"
              >
                Add
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((p) => (
          <BeautifulProviderCard key={p.id} provider={p} />
        ))}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Tip: Hover a card for subtle lift.
      </p>
    </div>
  );
}
