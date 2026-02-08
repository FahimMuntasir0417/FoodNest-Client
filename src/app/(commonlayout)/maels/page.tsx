import Image from "next/image";
import Link from "next/link";
import { mealsService } from "@/services/meals.service";
import { ArrowLeft, ArrowRight, ChefHat, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const revalidate = 60;

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

function toPosInt(v: unknown, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : fallback;
}

function normalizeMeals(data: unknown): any[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const d: any = data;
    if (Array.isArray(d.items)) return d.items;
    if (Array.isArray(d.data)) return d.data;
    if (Array.isArray(d.results)) return d.results;
  }
  return [];
}

// Optional: try to read total (if your API returns it)
function readTotal(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;
  const d: any = data;
  if (typeof d.total === "number") return d.total;
  if (typeof d.count === "number") return d.count;
  if (typeof d.totalItems === "number") return d.totalItems;
  return null;
}

type SearchParams = { page?: string; limit?: string };

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const page = toPosInt(sp.page, 1);
  const limit = toPosInt(sp.limit, 9);

  const { data, error } = await mealsService.getAll({ page, limit });

  const meals = normalizeMeals(data);

  // Pagination flags
  const total = readTotal(data);
  const hasPrev = page > 1;

  // If API gives total → compute properly
  const hasNext =
    typeof total === "number" ? page * limit < total : meals.length === limit;

  if (error) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <Card className="overflow-hidden rounded-3xl border">
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-500/12 via-transparent to-transparent"
            />
            <CardContent className="relative p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-700">
                  <RefreshCcw className="size-5" />
                </div>

                <div className="min-w-0">
                  <h1 className="text-lg font-semibold tracking-tight text-foreground">
                    Failed to load meals
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {error.message}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button asChild variant="outline" className="rounded-xl">
                      <Link href="/">Back to home</Link>
                    </Button>
                    <Button asChild className="rounded-xl">
                      <Link href={`/maels?page=${page}&limit=${limit}`}>
                        Try again
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </main>
    );
  }

  if (meals.length === 0) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <Card className="rounded-3xl border">
          <CardContent className="p-10 text-center md:p-14">
            <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-muted text-2xl">
              🍽️
            </div>
            <h1 className="mt-4 text-xl font-semibold tracking-tight">
              No meals found
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another page or check later.
            </p>

            <div className="mt-6 flex justify-center gap-2">
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/">Back to home</Link>
              </Button>

              {hasPrev ? (
                <Button asChild className="rounded-xl">
                  <Link href={`/maels?page=${page - 1}&limit=${limit}`}>
                    Previous page
                  </Link>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
            <ChefHat className="size-3.5 text-primary" />
            Fresh picks
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Meals
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Page <span className="font-medium text-foreground">{page}</span> •
            Showing{" "}
            <span className="font-medium text-foreground">{meals.length}</span>
            {typeof total === "number" ? ` of ${total}` : ""}
          </p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/">Back</Link>
          </Button>
          <Button asChild className="rounded-xl">
            <Link href="/offers">Deals</Link>
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {meals.map((m: any) => (
          <Card
            key={m.id}
            className="group overflow-hidden rounded-3xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              {m.imageUrl ? (
                <Image
                  src={m.imageUrl}
                  alt={m.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  No image
                </div>
              )}

              <div className="absolute left-3 top-3">
                <span
                  className={[
                    "rounded-full border bg-background/70 px-3 py-1 text-xs font-medium backdrop-blur",
                    m.isAvailable
                      ? "border-emerald-200 text-emerald-700"
                      : "border-rose-200 text-rose-700",
                  ].join(" ")}
                >
                  {m.isAvailable ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>

            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold tracking-tight">
                    {m.title}
                  </h2>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {m.cuisine ? `${m.cuisine} • ` : ""}
                    {m.category?.name ?? "Uncategorized"}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-lg font-semibold">
                    {formatBDT(Number(m.price ?? 0))}
                  </p>
                  <p className="text-xs text-muted-foreground">per item</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href={`/maels/${m.id}`}>View</Link>
                </Button>

                <Button
                  asChild
                  className="rounded-xl"
                  disabled={!m.isAvailable}
                >
                  <Link href={`/maels/${m.id}`}>
                    {m.isAvailable ? "Order" : "Unavailable"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="my-8" />

      {/* Pagination */}
      <div className="flex items-center justify-between gap-3">
        <Button
          asChild
          variant="outline"
          className="rounded-xl"
          disabled={!hasPrev}
        >
          <Link href={`/maels?page=${Math.max(1, page - 1)}&limit=${limit}`}>
            <ArrowLeft className="mr-2 size-4" />
            Previous
          </Link>
        </Button>

        <div className="text-sm text-muted-foreground">
          Page <span className="font-medium text-foreground">{page}</span>
        </div>

        <Button
          asChild
          variant="outline"
          className="rounded-xl"
          disabled={!hasNext}
        >
          <Link href={`/maels?page=${page + 1}&limit=${limit}`}>
            Next
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
