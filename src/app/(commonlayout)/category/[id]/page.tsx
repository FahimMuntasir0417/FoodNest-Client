import Link from "next/link";
import { notFound } from "next/navigation";

import { MealListingCard } from "@/components/meals/meal-listing-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categoryService, mealsService } from "@/services";
import { toArray } from "@/lib/foodnest-data";
import type { Meal } from "@/types/meal/meal";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const [categoryResult, mealsResult] = await Promise.all([
    categoryService.getById(id),
    mealsService.getAll(),
  ]);

  if (!categoryResult.data) notFound();

  const category = categoryResult.data;
  const meals = toArray<Meal>(mealsResult.data).filter(
    (meal) => meal.categoryId === category.id,
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Category</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {category.name}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {meals.length} meal{meals.length === 1 ? "" : "s"} found in this
            category.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-md">
          <Link href="/category">Back to categories</Link>
        </Button>
      </div>

      {meals.length ? (
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {meals.map((meal) => (
            <MealListingCard key={meal.id} meal={meal} />
          ))}
        </section>
      ) : (
        <Card className="mt-8 rounded-lg">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Meals will appear here after providers add items to this category.
          </CardContent>
        </Card>
      )}
    </main>
  );
}
