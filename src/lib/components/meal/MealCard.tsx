import { MealListingCard } from "@/components/meals/meal-listing-card";
import type { Meal } from "@/types/meal/meal";

export function MealCard({ meal }: { meal: Meal }) {
  return <MealListingCard meal={meal} />;
}
