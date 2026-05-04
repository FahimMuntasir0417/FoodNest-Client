import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateReviewFormClient } from "@/lib/components/postModule/CreateReviewFormClient";
import { reviewsService } from "@/services/reviews.service";
import { getSession } from "@/services/auth.service";

type ReviewPreview = {
  customerId?: string | null;
  customer?: { id?: string | null };
  rating?: number | string | null;
  comment?: string | null;
};

function getUserId(authData: any): string | null {
  return authData?.session?.userId ?? authData?.user?.id ?? null;
}

function findExistingReview(reviews: unknown[], userId: string) {
  return (
    reviews.find((review): review is ReviewPreview => {
      if (!review || typeof review !== "object") return false;

      const value = review as ReviewPreview;
      return value.customerId === userId || value.customer?.id === userId;
    }) ?? null
  );
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [reviewsResult, sessionResult] = await Promise.all([
    reviewsService.getByMeal(id),
    getSession(),
  ]);
  const userId = getUserId(sessionResult.data);
  const reviews = Array.isArray(reviewsResult.data) ? reviewsResult.data : [];
  const existingReview = userId ? findExistingReview(reviews, userId) : null;

  if (!userId) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Log in to add a review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You need a customer account before submitting meal feedback.
            </p>
            <Button asChild className="mt-5 rounded-md">
              <Link href="/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (existingReview) {
    const rating = Number(existingReview.rating ?? 0);

    return (
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>You already reviewed this meal</CardTitle>
          </CardHeader>
          <CardContent>
            {Number.isFinite(rating) && rating > 0 ? (
              <p className="text-sm font-medium">{rating.toFixed(1)} / 5</p>
            ) : null}
            {existingReview.comment ? (
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {existingReview.comment}
              </p>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Your review is already saved for this meal.
              </p>
            )}
            <Button asChild className="mt-5 rounded-md">
              <Link href={`/maels/${id}`}>Back to meal</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="mb-4 text-xl font-semibold">Add Review</h1>
      <CreateReviewFormClient mealId={id} />
    </main>
  );
}
