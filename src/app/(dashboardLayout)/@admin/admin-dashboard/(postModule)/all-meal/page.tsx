import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminMeal, MealsTable } from "@/lib/components/meal/meals-table";
import { formatMoney, toArray } from "@/lib/foodnest-data";
import { mealsService } from "@/services/meals.service";

export default async function Page() {
  const { data, error } = await mealsService.getAll();

  if (error) {
    return (
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Meals</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="text-destructive">Failed to load meals</p>
          <p className="text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const meals = toArray<AdminMeal>(data);
  const total = meals.length;
  const available = meals.filter((meal) => meal.isAvailable).length;
  const avgPrice = total
    ? Math.round(meals.reduce((sum, meal) => sum + (meal.price ?? 0), 0) / total)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Meals</h1>
          <p className="text-sm text-muted-foreground">
            Manage meals across all providers with filtering and pagination.
          </p>
        </div>
        <Badge variant="secondary">{total} total</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Summary title="Total Meals" value={String(total)} />
        <Summary title="Available" value={String(available)} />
        <Summary title="Avg Price" value={formatMoney(avgPrice)} />
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-base">All Meals</CardTitle>
        </CardHeader>
        <CardContent>
          <MealsTable meals={meals} />
        </CardContent>
      </Card>
    </div>
  );
}

function Summary({ title, value }: { title: string; value: string }) {
  return (
    <Card className="rounded-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-semibold">{value}</CardContent>
    </Card>
  );
}
