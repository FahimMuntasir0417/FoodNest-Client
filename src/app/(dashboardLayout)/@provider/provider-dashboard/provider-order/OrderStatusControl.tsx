"use client";

import * as React from "react";
import { toast } from "sonner";
import { updateProviderOrderStatus } from "@/actions/provider-order.action";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PROVIDER_STATUSES = [
  "PLACED",
  "PREPARING",
  "READY",
  "DELIVERED",
] as const;

export function OrderStatusControl({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = React.useState(currentStatus);
  const [pending, startTransition] = React.useTransition();

  const changed = status !== currentStatus;

  return (
    <div className="flex items-center justify-end gap-2">
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="h-8 w-[150px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>

        <SelectContent>
          {PROVIDER_STATUSES.map((s) => (
            <SelectItem key={s} value={s} disabled={s === currentStatus}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        size="sm"
        variant="outline"
        disabled={!changed || pending}
        onClick={() => {
          startTransition(async () => {
            const t = toast.loading("Updating status...");

            const res = await updateProviderOrderStatus(orderId, status);

            if (res?.error) {
              toast.error(res.error.message, { id: t });
              return;
            }

            toast.success("Status updated", { id: t });
          });
        }}
      >
        Update
      </Button>
    </div>
  );
}
