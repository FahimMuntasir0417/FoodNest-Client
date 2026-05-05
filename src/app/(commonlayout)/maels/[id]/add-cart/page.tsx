import { AddToCartClient } from "@/lib/components/postModule/AddToCartClient";

export default async function AddToCartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
      <AddToCartClient mealId={id} />
    </main>
  );
}
