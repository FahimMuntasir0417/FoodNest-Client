import Image from "next/image";
import Link from "next/link";
import { ChefHat, MapPin, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  averageRating,
  formatMoney,
  mealImage,
} from "@/lib/foodnest-data";
import type { Meal } from "@/types/meal/meal";

export function MealListingCard({ meal }: { meal: Meal }) {
  const rating = averageRating(meal.reviews);
  const provider = meal.provider?.shopName?.trim();
  const category = meal.category?.name?.trim();
  const description =
    meal.description?.trim() ||
    `Prepared by ${provider || "a FoodNest kitchen"} with clear pricing and availability.`;

  return (
    <Card className="group h-full overflow-hidden rounded-lg border bg-card py-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={mealImage(meal)}
          alt={meal.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute left-3 top-3 rounded-md border bg-background/90 px-2.5 py-1 text-xs font-medium shadow-sm">
          {meal.isAvailable ? "Available" : "Unavailable"}
        </div>
      </div>

      <CardContent className="flex min-h-[270px] flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="line-clamp-1 text-base font-semibold tracking-tight">
              {meal.title}
            </h2>
            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <ChefHat className="size-4 shrink-0" />
              <span className="truncate">
                {meal.cuisine || category || "Fresh meal"}
              </span>
            </div>
          </div>
          <div className="shrink-0 text-right text-base font-semibold">
            {formatMoney(meal.price)}
          </div>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Star className="size-4 text-secondary-foreground" />
            <span>
              {rating ? rating.toFixed(1) : "New"} rating
              {Array.isArray(meal.reviews) ? ` (${meal.reviews.length})` : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <span className="truncate">{provider || "FoodNest provider"}</span>
          </div>
        </div>

        <div className="mt-auto pt-5">
          <Button asChild className="h-10 w-full rounded-md">
            <Link href={`/maels/${meal.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
