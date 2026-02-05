// src/app/(commonlayout)/reviews/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

import { reviewsService } from "@/services/reviews.service";
import type { Review } from "@/services/reviews.service";

export const dynamic = "force-dynamic"; // because your service uses cache: "no-store"

export const metadata: Metadata = {
  title: "All Reviews",
  description: "Browse all customer reviews",
};

function clampRating(r: number) {
  if (Number.isNaN(r)) return 0;
  return Math.min(5, Math.max(0, Math.round(r)));
}

function Stars({ rating }: { rating: number }) {
  const r = clampRating(rating);
  return (
    <span
      aria-label={`${r} out of 5 stars`}
      className="inline-flex items-center gap-0.5"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < r ? "text-amber-500" : "text-zinc-300"}>
          ★
        </span>
      ))}
    </span>
  );
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ReviewsPage() {
  const res = await reviewsService.getAll();

  if (res.error) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
          <h1 className="text-lg font-semibold text-rose-800">
            Failed to load reviews
          </h1>
          <p className="mt-2 text-sm text-rose-700">{res.error.message}</p>
          <p className="mt-1 text-xs text-rose-700/80">
            Try refreshing the page. If it keeps happening, check API_URL and
            the /reviews endpoint.
          </p>
        </div>
      </main>
    );
  }

  const reviews: Review[] = res.data ?? [];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            All Reviews
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            {reviews.length} review(s) in total
          </p>
        </div>

        <Link
          href="/maels"
          className="inline-flex items-center justify-center rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
        >
          Back to meals
        </Link>
      </div>

      {/* Empty */}
      {reviews.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-zinc-600">No reviews found.</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-zinc-900">
                    {r.customer?.name ?? "Customer"}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                    <span>{formatDateTime(r.createdAt)}</span>

                    {r.mealId ? (
                      <>
                        <span className="text-zinc-300">•</span>
                        <span className="font-mono">Meal: {r.mealId}</span>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Stars rating={r.rating} />
                    <span className="text-sm text-zinc-700">
                      {clampRating(r.rating)}/5
                    </span>
                  </div>

                  {r.mealId ? (
                    <Link
                      href={`/maels/${r.mealId}`}
                      className="mt-2 inline-flex items-center justify-center rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-50"
                    >
                      View meal
                    </Link>
                  ) : null}
                </div>
              </div>

              {r.comment ? (
                <p className="mt-4 text-sm leading-6 text-zinc-700">
                  {r.comment}
                </p>
              ) : (
                <p className="mt-4 text-sm text-zinc-500">No comment.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
