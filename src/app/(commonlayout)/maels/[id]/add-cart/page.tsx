"use client";

import { useParams } from "next/navigation";

export default function AddCartPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      Meal ID: {id}
      s <b />
      order has beeb created by tegerring url "draft/me"
    </div>
  );
}
