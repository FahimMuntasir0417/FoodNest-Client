import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type LoadingSkeletonProps = {
  rows?: number;
  className?: string;
};

export function LoadingSkeleton({ rows = 4, className }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)} aria-busy="true">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-16 w-full rounded-lg" />
      ))}
    </div>
  );
}
