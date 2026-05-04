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

const PROVIDER_STATUSES = ["PLACED", "PREPARING", "READY", "DELIVERED"] as const;

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
        <SelectTrigger className="h-8 w-[150px] rounded-md">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {PROVIDER_STATUSES.map((item) => (
            <SelectItem key={item} value={item} disabled={item === currentStatus}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="rounded-md"
        disabled={!changed || pending}
        onClick={() => {
          startTransition(async () => {
            const toastId = toast.loading("Updating status...");
            const res = await updateProviderOrderStatus(orderId, status);

            if (res?.error) {
              toast.error(res.error.message, { id: toastId });
              return;
            }

            toast.success("Status updated", { id: toastId });
          });
        }}
      >
        {pending ? "Updating..." : "Update"}
      </Button>
    </div>
  );
}
