import { FoodNestHome } from "@/components/home/foodnest-home";
import { categoryService, mealsService } from "@/services";
import { providersService } from "@/services/providers.service";
import { reviewsService } from "@/services/reviews.service";
import { toArray } from "@/lib/foodnest-data";
import type { Category, Provider } from "@/types";
import type { Meal } from "@/types/meal/meal";
import type { Review } from "@/services/reviews.service";

export default async function Page() {
  const [mealsResult, categoriesResult, providersResult, reviewsResult] =
    await Promise.all([
      mealsService.getAll(),
      categoryService.getAll(),
      providersService.getAll(),
      reviewsService.getAll(),
    ]);

  return (
    <FoodNestHome
      meals={toArray<Meal>(mealsResult.data)}
      categories={toArray<Category>(categoriesResult.data)}
      providers={toArray<Provider>(providersResult.data)}
      reviews={toArray<Review>(reviewsResult.data)}
    />
  );
}
