import Link from "next/link";
import { ArrowRight, Folder } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryService } from "@/services";

export default async function Page() {
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

      {categories.length ? (
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
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
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Categories will appear here after they are created by an admin.
          </CardContent>
        </Card>
      )}
    </main>
  );
}
