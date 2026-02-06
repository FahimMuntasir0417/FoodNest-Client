import Link from "next/link";
import { categoryService } from "@/services";

export default async function Page() {
  const { data, error } = await categoryService.getAll();

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border bg-background p-6 shadow-sm">
          <h1 className="text-xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn’t load categories. Please try again.
          </p>

          <div className="mt-4 rounded-xl bg-muted p-4 text-sm">
            <span className="font-medium">Error:</span> {error.message}
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href="/categories"
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Refresh
            </Link>
            <Link
              href="/categories/new"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Create category
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-2xl border bg-background p-10 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
            <span className="text-lg">📁</span>
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            No categories yet
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first category to start organizing your content.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Back home
            </Link>
            <Link
              href="/categories/new"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Create category
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your category list ({data.length} total)
          </p>
        </div>

        <Link
          href="/categories/new"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + New category
        </Link>
      </div>

      {/* List */}
      <div className="mt-8 overflow-hidden rounded-2xl border bg-background shadow-sm">
        <div className="border-b px-6 py-4">
          <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground">
            <div className="col-span-7">Name</div>
            <div className="col-span-4">Slug</div>
            <div className="col-span-1 text-right">Action</div>
          </div>
        </div>

        <ul className="divide-y">
          {data.map((c) => (
            <li key={c.id} className="px-6 py-4 hover:bg-muted/50">
              <div className="grid grid-cols-12 items-center gap-3">
                <div className="col-span-12 sm:col-span-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                      <span className="text-sm font-semibold">
                        {c.name?.slice(0, 2)?.toUpperCase()}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        ID: {c.id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-span-11 sm:col-span-4">
                  <span className="inline-flex items-center rounded-xl border bg-muted/40 px-3 py-1 text-xs font-medium">
                    {c.slug}
                  </span>
                </div>

                <div className="col-span-1 flex justify-end">
                  <Link
                    href={`/categories/${c.id}`}
                    className="inline-flex items-center justify-center rounded-xl border px-3 py-2 text-xs font-medium hover:bg-muted"
                  >
                    View
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer hint */}
      <p className="mt-4 text-xs text-muted-foreground">
        Tip: Click <span className="font-medium">View</span> to open a category
        detail page.
      </p>
    </div>
  );
}
