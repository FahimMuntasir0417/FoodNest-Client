import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Folder, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { categoryService } from "@/services";
import type { Category } from "@/types";

type SearchParams = {
  q?: string;
  page?: string;
};

const PAGE_SIZE = 6;

function toPage(value?: string) {
  const page = Number(value);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

function matchesCategory(category: Category, query: string) {
  if (!query) return true;

  const target = [category.name, category.slug, category.id]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return target.includes(query.toLowerCase());
}

function buildHref(params: SearchParams, next: Partial<SearchParams>) {
  const search = new URLSearchParams();

  Object.entries({ ...params, ...next }).forEach(([key, value]) => {
    if (!value) return;
    search.set(key, value);
  });

  const query = search.toString();
  return query ? `/category?${query}` : "/category";
}

function PaginationButton({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: ReactNode;
}) {
  if (disabled) {
    return (
      <Button variant="outline" className="rounded-md" disabled>
        {children}
      </Button>
    );
  }

  return (
    <Button asChild variant="outline" className="rounded-md">
      <Link href={href}>{children}</Link>
    </Button>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (await searchParams) ?? {};
  const query = params.q?.trim() ?? "";
  const page = toPage(params.page);
  const { data, error } = await categoryService.getAll();

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Failed to load categories</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {error.message}
          </CardContent>
        </Card>
      </main>
    );
  }

  const categories = Array.isArray(data) ? data : [];
  const filteredCategories = categories.filter((category) =>
    matchesCategory(category, query),
  );
  const pageCount = Math.max(
    1,
    Math.ceil(filteredCategories.length / PAGE_SIZE),
  );
  const currentPage = Math.min(page, pageCount);
  const pageItems = filteredCategories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Categories</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Menu categories
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse {categories.length} FoodNest{" "}
            {categories.length === 1 ? "category" : "categories"} and open
            matching meals.
          </p>
        </div>
        <Button asChild className="rounded-md">
          <Link href="/maels">Explore meals</Link>
        </Button>
      </div>

      <form
        action="/category"
        className="mt-8 rounded-lg border bg-card p-4 shadow-sm"
      >
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <label className="grid gap-2 text-sm font-medium">
            Search categories
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={query}
                placeholder="Search by category name or slug"
                className="h-10 rounded-md pl-9"
              />
            </div>
          </label>
          <Button type="submit" className="h-10 rounded-md">
            Search
          </Button>
          <Button asChild variant="outline" className="h-10 rounded-md">
            <Link href="/category">Reset</Link>
          </Button>
        </div>
      </form>

      {pageItems.length ? (
        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pageItems.map((category) => (
            <Card key={category.id} className="rounded-lg">
              <CardHeader>
                <Folder className="size-5 text-primary" />
                <CardTitle className="text-base">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Slug: {category.slug}
                </p>
                <Link
                  href={`/maels?category=${encodeURIComponent(category.id)}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  View meals
                  <ArrowRight className="size-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : (
        <Card className="mt-8 rounded-lg">
          <CardContent className="p-8 text-center">
            <h2 className="text-lg font-semibold">
              {categories.length
                ? "No categories match your search"
                : "No categories yet"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {categories.length
                ? "Try a different category name or slug."
                : "Categories will appear here after they are created by an admin."}
            </p>
            {categories.length ? (
              <Button asChild className="mt-5 rounded-md">
                <Link href="/category">Clear search</Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      )}

      {filteredCategories.length ? (
        <div className="mt-8 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {pageItems.length} of {filteredCategories.length}{" "}
            {filteredCategories.length === 1 ? "category" : "categories"}.
            Page {currentPage} of {pageCount}.
          </p>
          <div className="flex items-center gap-2">
            <PaginationButton
              href={buildHref(params, { page: String(currentPage - 1) })}
              disabled={currentPage <= 1}
            >
              Previous
            </PaginationButton>
            <PaginationButton
              href={buildHref(params, { page: String(currentPage + 1) })}
              disabled={currentPage >= pageCount}
            >
              Next
            </PaginationButton>
          </div>
        </div>
      ) : null}
    </main>
  );
}
