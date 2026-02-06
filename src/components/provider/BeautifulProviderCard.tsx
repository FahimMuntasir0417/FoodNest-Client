// src/lib/components/provider/BeautifulProviderCard.tsx
import Link from "next/link";
import type { Provider } from "@/types/provider/provider";

export function BeautifulProviderCard({ provider }: { provider: Provider }) {
  const initials =
    provider.shopName
      ?.split(" ")
      .slice(0, 2)
      .map((s) => s?.[0] ?? "")
      .join("")
      .toUpperCase() || "PR";

  const updatedLabel = provider.updatedAt
    ? new Date(provider.updatedAt).toLocaleDateString()
    : "—";

  return (
    <Link
      href={`/providers/${provider.id}`}
      className="group relative block overflow-hidden rounded-3xl border bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* soft hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-muted/60 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-48 w-48 rounded-full bg-muted/60 blur-3xl" />
      </div>

      <div className="relative flex items-start gap-4">
        {/* Logo / initials */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border bg-muted flex items-center justify-center">
          {provider.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={provider.logoUrl}
              alt={provider.shopName ?? "Provider"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold">{initials}</span>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="truncate text-base font-semibold">
              {provider.shopName ?? "Unnamed shop"}
            </h3>

            <span className="shrink-0 rounded-xl border bg-muted/40 px-2.5 py-1 text-[11px] font-medium">
              {provider.user?.role ?? "PROVIDER"}
            </span>
          </div>

          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {provider.description ?? "No description provided."}
          </p>

          <div className="mt-4 space-y-2 text-xs text-muted-foreground">
            <div className="truncate">📍 {provider.address ?? "—"}</div>

            <div className="flex items-center justify-between gap-3">
              <span className="truncate">📞 {provider.phone ?? "—"}</span>
              <span className="truncate">👤 {provider.user?.name ?? "—"}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <span className="text-[11px] text-muted-foreground">
              Updated: {updatedLabel}
            </span>
            <span className="text-xs font-medium group-hover:underline">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
