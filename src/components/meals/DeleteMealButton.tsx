"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteMealAction } from "@/actions/meals.action";

export function DeleteMealButton({
  mealId,
  label = "Delete",
}: {
  mealId: string;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="destructive"
      disabled={pending}
      onClick={() => {
        const ok = window.confirm("Delete this meal?");
        if (!ok) return;

        startTransition(async () => {
          const t = toast.loading("Deleting meal...");

          try {
            // If the action redirects, code after may not run (that’s OK)
            const res = await deleteMealAction(mealId);

            // only runs if action returns error (no redirect)
            if (res?.error) {
              toast.error(res.error.message, { id: t });
              return;
            }

            toast.success("Deleted", { id: t });
          } catch {
            toast.error("Something went wrong", { id: t });
          }
        });
      }}
    >
      {pending ? "Deleting..." : label}
    </Button>
  );
}
