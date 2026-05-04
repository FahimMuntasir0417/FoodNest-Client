import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="mt-8 rounded-lg border bg-card p-4">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto]">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </div>

      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-lg border bg-card p-4">
            <Skeleton className="aspect-[4/3] w-full rounded-md" />
            <Skeleton className="mt-5 h-5 w-3/4" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
            <Skeleton className="mt-6 h-10 w-full" />
          </div>
        ))}
      </section>
    </main>
  );
}
