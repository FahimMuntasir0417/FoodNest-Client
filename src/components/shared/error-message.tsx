import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type ErrorMessageProps = {
  title?: string;
  message: string;
  className?: string;
};

export function ErrorMessage({
  title = "Something went wrong",
  message,
  className,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive",
        className,
      )}
    >
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="mt-1 text-destructive/90">{message}</p>
        </div>
      </div>
    </div>
  );
}
