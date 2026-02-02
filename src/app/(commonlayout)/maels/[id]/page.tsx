import { mealsService } from "@/services/meals.service";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>; // ✅ params is a Promise in your Next version
};

export default async function MealsPage({ params }: Props) {
  const { id } = await params; // ✅ unwrap params first

  const { data, error } = await mealsService.getById(id);

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Meal Details</h1>
        <div className="mt-4 rounded-md border p-4">
          <p className="font-medium text-red-600">Error</p>
          <p className="mt-2 text-sm">{error.message}</p>

          {"detail" in error && (error as any).detail ? (
            <pre className="mt-3 overflow-auto rounded bg-muted p-3 text-xs">
              {JSON.stringify((error as any).detail, null, 2)}
            </pre>
          ) : null}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Meal Details</h1>
        <p className="mt-4">Meal not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">{data.title}</h1>

      {data.description ? (
        <p className="mt-2 text-sm text-muted-foreground">{data.description}</p>
      ) : null}

      <div className="mt-4 text-sm">
        <p>
          <span className="font-medium">Price:</span>{" "}
          {typeof data.price === "number"
            ? `$${data.price.toFixed(2)}`
            : data.price}
        </p>

        {data.cuisine ? (
          <p className="mt-1">
            <span className="font-medium">Cuisine:</span> {data.cuisine}
          </p>
        ) : null}

        <p className="mt-1">
          <span className="font-medium">Available:</span>{" "}
          {data.isAvailable ? "Yes" : "No"}
        </p>
      </div>

      <Link
        href={`/maels/${id}/add-cart/`} // change to `/meals/${m.id}` if your folder is meals
        className="text-sm font-semibold text-primary hover:underline"
      >
        Read More &rarr;
      </Link>
    </div>
  );
}
