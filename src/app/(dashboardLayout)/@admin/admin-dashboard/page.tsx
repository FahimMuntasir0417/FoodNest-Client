import { MealCard } from "@/lib/components/meal/MealCard";
import { mealsService } from "@/services";
import type { Meal } from "@/types";

export default async function AdminDashboard() {
  const result = await mealsService.getAll();

  if (result?.error) {
    return <div className="p-6">Error: {result.error.message}</div>;
  }

  const raw = result?.data;

  const meals: Meal[] = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as any)?.meals)
      ? (raw as any).meals
      : Array.isArray((raw as any)?.data)
        ? (raw as any).data
        : [];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>

      <h2 className="text-lg font-semibold">Meals</h2>
      <div className="space-y-3">
        {meals.length === 0 ? (
          <div>No meals found</div>
        ) : (
          meals.map((m) => <MealCard key={m.id} meal={m} />)
        )}
      </div>
    </div>
  );
}
