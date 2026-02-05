// "use client";

import { AddToCartClient } from "@/lib/components/postModule/AddToCartClient";

// import { useParams } from "next/navigation";

// export default function AddCartPage() {
//   const { id } = useParams<{ id: string }>();
//   return (
//     <div>
//       Meal ID: {id}
//       s <b />
//       order has beeb created by tegerring url "draft/me"
//     </div>
//   );
// }

export default async function AddToCartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AddToCartClient mealId={id} />;
}
