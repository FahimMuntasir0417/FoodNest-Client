import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ChefHat,
  Clock,
  MapPin,
  Phone,
  ShoppingCart,
  Star,
  Store,
} from "lucide-react";

import { MealListingCard } from "@/components/meals/meal-listing-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  averageRating,
  fallbackMealImage,
  formatDate,
  formatDateTime,
  formatMoney,
  mealImage,
  toArray,
} from "@/lib/foodnest-data";
import { mealsService } from "@/services";
import type { Category, Provider } from "@/types";
import type { Review } from "@/services/reviews.service";

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

async function fetchMeal(id: string): Promise<Meal | null> {
  const result = await mealsService.getById(id);
  const meal = result.data as Meal | null;
  return meal?.id ? meal : null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const meal = await fetchMeal(id);

  if (!meal) return { title: "Meal not found" };

  return {
    title: `${meal.title} | FoodNest`,
    description: meal.description || `FoodNest meal details for ${meal.title}.`,
    openGraph: {
      title: meal.title,
      description: meal.description || undefined,
      images: [mealImage(meal)],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const meal = await fetchMeal(id);

  if (!meal) notFound();

  const allMealsResult = await mealsService.getAll();
  const allMeals = toArray<Meal>(allMealsResult.data);
  const relatedMeals = allMeals
    .filter(
      (item) =>
        item.id !== meal.id &&
        (item.categoryId === meal.categoryId || item.cuisine === meal.cuisine),
    )
    .slice(0, 4);
  const reviews = meal.reviews ?? [];
  const rating = averageRating(reviews);
  const gallery = [
    mealImage(meal),
    ...relatedMeals.map((item) => mealImage(item)),
    fallbackMealImage(meal),
  ].slice(0, 3);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm text-muted-foreground">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/maels" className="hover:underline">
              Meals
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{meal.title}</span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            {meal.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {meal.cuisine || "FoodNest meal"} from{" "}
            {meal.provider?.shopName || "a verified provider"}
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-md">
          <Link href="/maels">
            <ArrowLeft className="size-4" />
            Back to meals
          </Link>
        </Button>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-3 sm:grid-cols-[1.4fr_0.8fr]">
          <div className="relative min-h-[360px] overflow-hidden rounded-lg border bg-muted">
            <Image
              src={gallery[0]}
              alt={meal.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 700px"
            />
          </div>
          <div className="grid gap-3">
            {gallery.slice(1).map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative min-h-[174px] overflow-hidden rounded-lg border bg-muted"
              >
                <Image
                  src={src}
                  alt={`${meal.title} related media ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 320px"
                />
              </div>
            ))}
          </div>
        </div>

        <Card className="rounded-lg">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-xl">Order summary</CardTitle>
                <p className="mt-2 text-sm text-muted-foreground">
                  Public details for availability, price, provider, and reviews.
                </p>
              </div>
              <span className="rounded-md border bg-background px-3 py-1 text-xs font-medium">
                {meal.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <Metric label="Price" value={formatMoney(meal.price)} />
              <Metric
                label="Rating"
                value={rating ? `${rating.toFixed(1)} / 5` : "New"}
              />
              <Metric
                label="Category"
                value={meal.category?.name || "Uncategorized"}
              />
              <Metric label="Updated" value={formatDate(meal.updatedAt)} />
            </div>

            <Separator className="my-5" />

            <Button
              asChild
              className="h-11 w-full rounded-md"
              disabled={!meal.isAvailable}
            >
              <Link href={`/maels/${id}/add-cart`}>
                <ShoppingCart className="size-4" />
                {meal.isAvailable ? "Add to cart" : "Unavailable"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Description and overview</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              {meal.description?.trim() ||
                `${meal.title} is part of the FoodNest menu and can be compared by cuisine, category, provider, pricing, and availability before ordering.`}
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Key information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <InfoRow icon={ChefHat} label="Cuisine" value={meal.cuisine || "Not specified"} />
              <InfoRow
                icon={Store}
                label="Provider"
                value={meal.provider?.shopName || "FoodNest provider"}
              />
              <InfoRow
                icon={MapPin}
                label="Address"
                value={meal.provider?.address || "Provider address unavailable"}
              />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={meal.provider?.phone || "Provider phone unavailable"}
              />
              <InfoRow
                icon={Clock}
                label="Created"
                value={formatDateTime(meal.createdAt)}
              />
              <InfoRow
                icon={Star}
                label="Reviews"
                value={`${reviews.length} review${reviews.length === 1 ? "" : "s"}`}
              />
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Reviews and ratings</CardTitle>
              <Button asChild className="rounded-md">
                <Link href={`/maels/${id}/reviews`}>Add review</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {reviews.length ? (
                <ul className="space-y-4">
                  {reviews.slice(0, 5).map((review) => (
                    <li key={review.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">
                            {review.customer?.name || "FoodNest customer"}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatDateTime(review.createdAt)}
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          {Number(review.rating ?? 0).toFixed(1)} / 5
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {review.comment || "No written comment was added."}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-lg border bg-muted/30 p-5 text-sm text-muted-foreground">
                  This meal has no reviews yet. Customers can add feedback from
                  the review page.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Provider</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                {meal.provider?.shopName || "FoodNest provider"}
              </p>
              <p>{meal.provider?.description || "Provider details are managed from the provider dashboard."}</p>
              <Button asChild variant="outline" className="mt-2 rounded-md">
                <Link href="/provider">View providers</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Related meals</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Similar items from the menu
            </h2>
          </div>
          <Button asChild variant="outline" className="rounded-md">
            <Link href="/maels">Explore all</Link>
          </Button>
        </div>
        {relatedMeals.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedMeals.map((item) => (
              <MealListingCard key={item.id} meal={item} />
            ))}
          </div>
        ) : (
          <Card className="rounded-lg">
            <CardContent className="p-6 text-sm text-muted-foreground">
              Related meals will appear when the API returns other meals in this
              category or cuisine.
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border p-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
