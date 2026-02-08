// src/app/(commonlayout)/maels/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { mealsService } from "@/services";
import type { Category, Provider } from "@/types";
import type { Review } from "@/services/reviews.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ id: string }>;
};

export type Meal = {
  id: string;
  providerId: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  cuisine: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  provider?: Provider;
  category?: Category;
  reviews?: Review[];
};

function formatBDT(amount: number) {
  try {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  } catch {
    return `৳${amount}`;
  }
}

function clampRating(r: number) {
  if (Number.isNaN(r)) return 0;
  return Math.min(5, Math.max(0, Math.round(r)));
}

function Stars({ rating }: { rating: number }) {
  const r = clampRating(rating);
  return (
    <span
      aria-label={`${r} out of 5 stars`}
      className="inline-flex items-center gap-0.5 text-sm"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < r ? "text-amber-500" : "text-muted-foreground/30"}
        >
          ★
        </span>
      ))}
    </span>
  );
}

async function fetchMeal(id: string): Promise<Meal | null> {
  try {
    const res = await mealsService.getById(id);
    const meal = res?.data ?? null;
    return meal?.id ? meal : null;
  } catch (e: any) {
    const status = e?.status ?? e?.response?.status;
    if (status === 404) return null;
    throw e;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const meal = await fetchMeal(id);
  if (!meal) return { title: "Meal not found" };

  return {
    title: `${meal.title} • Meal Details`,
    description: meal.description ?? undefined,
    openGraph: {
      title: meal.title,
      description: meal.description ?? undefined,
      images: meal.imageUrl ? [meal.imageUrl] : undefined,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const meal = await fetchMeal(id);
  if (!meal) notFound();

  const reviews = meal.reviews ?? [];
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length
    : 0;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
      {/* Top header */}
      <div className="mb-6 flex flex-col gap-3 md:mb-8">
        <div className="text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          <span className="mx-2">/</span>
          <Link href="/maels" className="hover:underline">
            Meals
          </Link>{" "}
          <span className="mx-2">/</span>
          <span className="text-foreground">{meal.title}</span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold tracking-tight md:text-3xl">
              {meal.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {meal.cuisine ? `${meal.cuisine} • ` : ""}
              {meal.category?.name ?? "Uncategorized"}
            </p>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/maels">Back</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px,1fr]">
        {/* Left: Meal */}
        <Card className="overflow-hidden rounded-3xl">
          <div className="relative aspect-[4/3] w-full bg-muted">
            {meal.imageUrl ? (
              <Image
                src={meal.imageUrl}
                alt={meal.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No image
              </div>
            )}

            <div className="absolute left-4 top-4">
              <span
                className={[
                  "rounded-full border bg-background/70 px-3 py-1 text-xs font-medium backdrop-blur",
                  meal.isAvailable
                    ? "border-emerald-200 text-emerald-700"
                    : "border-rose-200 text-rose-700",
                ].join(" ")}
              >
                {meal.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>

          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-2xl font-semibold">
                  {formatBDT(meal.price)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">per item</p>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Stars rating={avgRating} />
                  <span className="text-sm text-muted-foreground">
                    {avgRating ? avgRating.toFixed(1) : "—"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {reviews.length} review(s)
                </p>
              </div>
            </div>

            <Separator className="my-5" />

            <div className="flex flex-col gap-3">
              <Button
                asChild
                className="h-11 rounded-xl"
                disabled={!meal.isAvailable}
              >
                <Link href={`/maels/${id}/add-cart`}>
                  {meal.isAvailable ? "Add to cart" : "Unavailable"}
                </Link>
              </Button>
            </div>

            {meal.description ? (
              <div className="mt-5">
                <h3 className="text-sm font-semibold">Description</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {meal.description}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Right: Provider + Reviews */}
        <section className="space-y-6">
          {/* Provider */}
          <Card className="rounded-3xl">
            <CardHeader className="pb-0">
              <CardTitle className="text-base">Provider</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm font-semibold">
                {meal.provider?.shopName?.trim()
                  ? meal.provider.shopName
                  : "Unnamed shop"}
              </p>

              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                {meal.provider?.address ? (
                  <p>📍 {meal.provider.address}</p>
                ) : null}
                {meal.provider?.phone ? <p>📞 {meal.provider.phone}</p> : null}
              </div>

              <Separator className="my-5" />

              <Button asChild variant="outline" className="rounded-xl">
                <Link href={`/providers/${meal.providerId}`}>
                  View provider
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card className="rounded-3xl">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Reviews</CardTitle>
              <Button asChild className="rounded-xl">
                <Link href={`/maels/${id}/reviews/`}>Add review</Link>
              </Button>
            </CardHeader>

            <CardContent className="pt-4">
              {reviews.length === 0 ? (
                <div className="rounded-2xl border bg-muted/20 p-5 text-sm text-muted-foreground">
                  No reviews yet.
                </div>
              ) : (
                <ul className="space-y-4">
                  {reviews.map((r) => (
                    <li key={r.id} className="rounded-2xl border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {r.customer?.name ?? "Customer"}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {new Date(r.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <Stars rating={r.rating} />
                          <p className="mt-1 text-xs text-muted-foreground">
                            {clampRating(r.rating)}/5
                          </p>
                        </div>
                      </div>

                      {r.comment ? (
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">
                          {r.comment}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
