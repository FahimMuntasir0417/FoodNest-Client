import Link from "next/link";
import type { Metadata } from "next";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, toArray } from "@/lib/foodnest-data";
import { reviewsService, type Review } from "@/services/reviews.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Reviews | FoodNest",
  description: "Browse customer reviews on FoodNest.",
};

function clampRating(rating: number) {
  if (Number.isNaN(rating)) return 0;
  return Math.min(5, Math.max(0, Math.round(rating)));
}

export default async function ReviewsPage() {
  const result = await reviewsService.getAll();

  if (result.error) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Failed to load reviews</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {result.error.message}
          </CardContent>
        </Card>
      </main>
    );
  }

  const reviews = toArray<Review>(result.data);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Reviews</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Customer reviews
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {reviews.length} review{reviews.length === 1 ? "" : "s"} returned
            by the API.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-md">
          <Link href="/maels">Back to meals</Link>
        </Button>
      </div>

      {reviews.length ? (
        <ul className="mt-8 grid gap-4">
          {reviews.map((review) => (
            <li key={review.id}>
              <Card className="rounded-lg">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-semibold">
                        {review.customer?.name || "FoodNest customer"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDateTime(review.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="size-4 text-secondary-foreground" />
                      <span>{clampRating(Number(review.rating ?? 0))} / 5</span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {review.comment || "No written comment was added."}
                  </p>
                  {review.mealId ? (
                    <Button asChild variant="outline" size="sm" className="mt-4 rounded-md">
                      <Link href={`/maels/${review.mealId}`}>View meal</Link>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Card className="mt-8 rounded-lg">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Reviews will appear here after customers submit feedback.
          </CardContent>
        </Card>
      )}
    </main>
  );
}
