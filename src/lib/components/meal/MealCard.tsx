import type { Meal } from "@/types/meal/meal";

export function MealCard({ meal }: { meal: Meal }) {
  return (
    <div className="rounded-xl border p-4 flex gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={meal.imageUrl ?? "https://via.placeholder.com/96"}
        alt={meal.title}
        className="h-24 w-24 rounded-lg object-cover"
      />

      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold">{meal.title}</div>
            <div className="text-sm text-muted-foreground line-clamp-2">
              {meal.description}
            </div>
          </div>

          <div className="font-semibold">৳{meal.price}</div>
        </div>

        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-md border px-2 py-1">
            {meal.isAvailable ? "Available" : "Unavailable"}
          </span>

          {meal.cuisine && (
            <span className="rounded-md border px-2 py-1">
              Cuisine: {meal.cuisine}
            </span>
          )}

          {meal.category?.name && (
            <span className="rounded-md border px-2 py-1">
              Category: {meal.category.name}
            </span>
          )}

          {meal.provider?.shopName && (
            <span className="rounded-md border px-2 py-1">
              Provider: {meal.provider.shopName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
