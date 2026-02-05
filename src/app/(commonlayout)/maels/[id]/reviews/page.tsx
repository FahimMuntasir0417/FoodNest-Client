import { CreateReviewFormClient } from "./../../../../../lib/components/postModule/CreateReviewFormClient";

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Add Review</h1>
      <CreateReviewFormClient mealId={id} />
    </div>
  );
}
