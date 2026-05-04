import Link from "next/link";
import { Filter, RefreshCcw, Search } from "lucide-react";

import { MealListingCard } from "@/components/meals/meal-listing-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { categoryService, mealsService } from "@/services";
import {
  averageRating,
  formatMoney,
  toArray,
} from "@/lib/foodnest-data";
import type { Category } from "@/types";
import type { Meal } from "@/types/meal/meal";

export const revalidate = 60;

type SearchParams = {
  q?: string;
  category?: string;
  cuisine?: string;
  availability?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
};

const PAGE_SIZE = 6;

function toPage(value?: string) {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

function matchesText(meal: Meal, query: string) {
  if (!query) return true;
  const target = [
    meal.title,
    meal.description,
    meal.cuisine,
    meal.category?.name,
    meal.provider?.shopName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return target.includes(query.toLowerCase());
}

function filterMeals(meals: Meal[], params: SearchParams) {
  const query = params.q?.trim() ?? "";
  const maxPrice = Number(params.maxPrice);

  return meals.filter((meal) => {
    const matchesCategory =
      !params.category ||
      params.category === "all" ||
      meal.categoryId === params.category ||
      meal.category?.slug === params.category ||
      meal.category?.name === params.category;
    const matchesCuisine =
      !params.cuisine ||
      params.cuisine === "all" ||
      (meal.cuisine ?? "").toLowerCase() === params.cuisine.toLowerCase();
    const matchesAvailability =
      !params.availability ||
      params.availability === "all" ||
      (params.availability === "available" && meal.isAvailable) ||
      (params.availability === "unavailable" && !meal.isAvailable);
    const matchesPrice =
      !Number.isFinite(maxPrice) || maxPrice <= 0 || meal.price <= maxPrice;

    return (
      matchesText(meal, query) &&
      matchesCategory &&
      matchesCuisine &&
      matchesAvailability &&
      matchesPrice
    );
  });
}

function sortMeals(meals: Meal[], sort = "newest") {
  return [...meals].sort((a, b) => {
    if (sort === "price-asc") return Number(a.price) - Number(b.price);
    if (sort === "price-desc") return Number(b.price) - Number(a.price);
    if (sort === "rating") return averageRating(b.reviews) - averageRating(a.reviews);
    if (sort === "title") return a.title.localeCompare(b.title);

    return (
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });
}

function buildHref(params: SearchParams, next: Partial<SearchParams>) {
  const search = new URLSearchParams();
  Object.entries({ ...params, ...next }).forEach(([key, value]) => {
    if (!value || value === "all") return;
    search.set(key, value);
  });

  const query = search.toString();
  return query ? `/maels?${query}` : "/maels";
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (await searchParams) ?? {};
  const page = toPage(params.page);

  const [mealsResult, categoriesResult] = await Promise.all([
    mealsService.getAll(),
    categoryService.getAll(),
  ]);

  const allMeals = toArray<Meal>(mealsResult.data);
  const categories = toArray<Category>(categoriesResult.data);
  const cuisines = Array.from(
    new Set(allMeals.map((meal) => meal.cuisine).filter(Boolean) as string[]),
  ).sort((a, b) => a.localeCompare(b));
  const filtered = sortMeals(filterMeals(allMeals, params), params.sort);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const prices = allMeals.map((meal) => Number(meal.price ?? 0));
  const maxKnownPrice = prices.length ? Math.max(...prices) : 0;

  if (mealsResult.error) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
        <Card className="rounded-lg">
          <CardContent className="flex gap-4 p-6">
            <div className="flex size-11 items-center justify-center rounded-md bg-destructive/10 text-destructive">
              <RefreshCcw className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Failed to load meals</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {mealsResult.error.message}
              </p>
              <Button asChild className="mt-5 rounded-md">
                <Link href="/maels">Try again</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
      <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Explore</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Meals
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Showing {pageItems.length} of {filtered.length} meals. Lowest live
            price: {prices.length ? formatMoney(Math.min(...prices)) : "Not available"}.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-md">
          <Link href="/category">Browse categories</Link>
        </Button>
      </section>

      <form
        action="/maels"
        className="mt-8 rounded-lg border bg-card p-4 shadow-sm"
      >
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto]">
          <label className="grid gap-2 text-sm font-medium">
            Search
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={params.q ?? ""}
                placeholder="Search meals, providers, cuisine"
                className="h-10 rounded-md pl-9"
              />
            </div>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Category
            <select
              name="category"
              defaultValue={params.category ?? "all"}
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Cuisine
            <select
              name="cuisine"
              defaultValue={params.cuisine ?? "all"}
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              <option value="all">All cuisines</option>
              {cuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Availability
            <select
              name="availability"
              defaultValue={params.availability ?? "all"}
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              <option value="all">All meals</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium">
            Max price
            <Input
              name="maxPrice"
              type="number"
              min="0"
              max={maxKnownPrice || undefined}
              defaultValue={params.maxPrice ?? ""}
              placeholder={maxKnownPrice ? String(maxKnownPrice) : "Any"}
              className="h-10 rounded-md"
            />
          </label>

          <div className="grid gap-2 text-sm font-medium">
            Sort
            <select
              name="sort"
              defaultValue={params.sort ?? "newest"}
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Rating</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button type="submit" className="rounded-md">
            <Filter className="size-4" />
            Apply filters
          </Button>
          <Button asChild variant="outline" className="rounded-md">
            <Link href="/maels">Reset</Link>
          </Button>
        </div>
      </form>

      {pageItems.length ? (
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((meal) => (
            <MealListingCard key={meal.id} meal={meal} />
          ))}
        </section>
      ) : (
        <Card className="mt-8 rounded-lg">
          <CardContent className="p-8 text-center">
            <h2 className="text-lg font-semibold">No meals match the filters</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Adjust search, category, cuisine, availability, or price to see
              more results.
            </p>
            <Button asChild className="mt-5 rounded-md">
              <Link href="/maels">Clear filters</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 flex items-center justify-between gap-3 border-t pt-6">
        <Button
          asChild
          variant="outline"
          className="rounded-md"
          disabled={currentPage <= 1}
        >
          <Link href={buildHref(params, { page: String(currentPage - 1) })}>
            Previous
          </Link>
        </Button>

        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {pageCount}
        </p>

        <Button
          asChild
          variant="outline"
          className="rounded-md"
          disabled={currentPage >= pageCount}
        >
          <Link href={buildHref(params, { page: String(currentPage + 1) })}>
            Next
          </Link>
        </Button>
      </div>
    </main>
  );
}
