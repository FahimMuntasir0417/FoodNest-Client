import { mealsService } from "@/services/meals.service";
import Link from "next/link";

export default async function Page() {
  const { data, error } = await mealsService.getAll();

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  const meals = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.items)
      ? (data as any).items
      : Array.isArray((data as any)?.data)
        ? (data as any).data
        : [];

  if (meals.length === 0) {
    return <div>No meals found</div>;
  }

  return (
    <div>
      <h1>Meals</h1>

      <ul className="space-y-2">
        {meals.map((m) => (
          <li key={m.id} className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="font-medium">{m.title}</span>
              <span className="text-sm opacity-70">{m.price}</span>
            </div>

            <Link
              href={`/maels/${m.id}`} // change to `/meals/${m.id}` if your folder is meals
              className="text-sm font-semibold text-primary hover:underline"
            >
              Read More &rarr;
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
