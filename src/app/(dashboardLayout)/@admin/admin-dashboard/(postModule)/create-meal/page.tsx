// src/app/admin-dashboard/meals/page.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminMeal, MealsTable } from "@/lib/components/meal/meals-table";
import { mealsService } from "@/services/meals.service";

function money(n: number) {
  return `৳ ${Number(n || 0).toLocaleString()}`;
}

export default async function Page() {
  const { data, error } = await mealsService.getAll();

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Meals</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-destructive">Failed to load meals</p>
            <p className="text-muted-foreground">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const meals = (
    Array.isArray(data)
      ? data
      : Array.isArray((data as any)?.items)
        ? (data as any).items
        : Array.isArray((data as any)?.data)
          ? (data as any).data
          : []
  ) as AdminMeal[];

  const total = meals.length;
  const available = meals.filter((m) => m.isAvailable).length;
  const avgPrice = total
    ? Math.round(meals.reduce((s, m) => s + (m.price ?? 0), 0) / total)
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Meals</h1>
          <p className="text-sm text-muted-foreground">
            Manage meals across all providers
          </p>
        </div>

        <Badge variant="secondary">{total} total</Badge>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Meals
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{total}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {available}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Price
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {money(avgPrice)}
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Meals</CardTitle>
        </CardHeader>
        <CardContent>
          {meals.length === 0 ? (
            <div className="rounded-md border p-6 text-sm text-muted-foreground">
              No meals found.
            </div>
          ) : (
            <MealsTable meals={meals} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
