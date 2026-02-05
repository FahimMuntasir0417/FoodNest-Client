// src/app/(commonlayout)/cart/ui/cart-item-actions.tsx
"use client";

import * as React from "react";
import { toast } from "sonner";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  removeDraftItem,
  updateDraftItemQuantity,
} from "@/actions/cart.action";

export default function CartItemActions({
  itemId,
  quantity,
}: {
  itemId: string;
  quantity: number;
}) {
  const [pending, startTransition] = React.useTransition();

  function inc() {
    startTransition(async () => {
      const t = toast.loading("Updating...");
      const res = await updateDraftItemQuantity(itemId, quantity + 1);

      if (res?.error) {
        toast.error(res.error.message, { id: t });
        return;
      }

      toast.success("Updated", { id: t });
    });
  }

  function dec() {
    if (quantity <= 1) return;

    startTransition(async () => {
      const t = toast.loading("Updating...");
      const res = await updateDraftItemQuantity(itemId, quantity - 1);

      if (res?.error) {
        toast.error(res.error.message, { id: t });
        return;
      }

      toast.success("Updated", { id: t });
    });
  }

  function remove() {
    const ok = window.confirm("Remove this item from cart?");
    if (!ok) return;

    startTransition(async () => {
      const t = toast.loading("Removing...");
      const res = await removeDraftItem(itemId);

      if (res?.error) {
        toast.error(res.error.message, { id: t });
        return;
      }

      toast.success("Removed", { id: t });
    });
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-xl border bg-background">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl"
          onClick={dec}
          disabled={pending || quantity <= 1}
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <span className="min-w-8 text-center text-sm font-semibold">
          {quantity}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl"
          onClick={inc}
          disabled={pending}
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-xl"
        onClick={remove}
        disabled={pending}
        aria-label="Remove item"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
