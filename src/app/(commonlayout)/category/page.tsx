import Link from "next/link";
import { categoryService } from "@/services";

export default async function Page() {
  const { data, error } = await categoryService.getAll();

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div>No categories found</div>;
  }

  return (
    <div>
      <h1>Categories</h1>

      <ul>
        {data.map((c) => (
          <li key={c.id} className="flex items-center gap-3">
            <div>
              {c.name} <small>({c.slug})</small>
            </div>

            <Link
              href={`/category/${c.id}`}
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
