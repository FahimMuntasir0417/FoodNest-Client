"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { useId, useMemo, useState } from "react";
import { toast } from "sonner";
import { Link, Minus, Plus, ShoppingCart } from "lucide-react";

import { addToDraftCart } from "@/actions/order-items.action";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function AddToCartClient({
  mealId,
  className,
}: {
  mealId: string;
  className?: string;
}) {
  const router = useRouter();
  const inputId = useId();
  const [qty, setQty] = useState<number>(1);
  const [loading, setLoading] = useState(false);

  const safeQty = useMemo(() => {
    const n = Number(qty);
    if (!Number.isFinite(n) || n < 1) return 1;
    return Math.floor(n);
  }, [qty]);

  const canSubmit = safeQty >= 1 && !loading;

  async function onAdd() {
    if (!canSubmit) return;

    setLoading(true);
    const t = toast.loading("Adding to cart...");

    try {
      const res = await addToDraftCart({ mealId, quantity: safeQty });

      if (res?.error) {
        toast.error(res.error.message, { id: t });
        return;
      }

      toast.success("Added to cart!", { id: t });
      router.push("/order-item");
    } catch (e: any) {
      toast.error(e?.message ?? "Something went wrong", { id: t });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-3xl border bg-background shadow-sm",
        className,
      )}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <span className="inline-flex size-8 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShoppingCart className="size-4" />
              </span>
              Add to cart
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose quantity, then add this meal to your draft cart.
            </p>
          </div>

          <span className="rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
            Qty
          </span>
        </div>

        <Separator className="my-4" />

        {/* Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 min-w-[180px]">
            <label
              htmlFor={inputId}
              className="block text-xs font-medium text-muted-foreground"
            >
              Quantity
            </label>

            <div className="mt-2 flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-xl"
                onClick={() => setQty((q) => Math.max(1, (Number(q) || 1) - 1))}
                disabled={loading}
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" />
              </Button>

              <div className="relative flex-1">
                <Input
                  id={inputId}
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={safeQty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="h-11 rounded-xl text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-11 w-11 rounded-xl"
                onClick={() => setQty((q) => (Number(q) || 1) + 1)}
                disabled={loading}
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </Button>
            </div>

            <p className="mt-2 text-[11px] text-muted-foreground">
              Minimum quantity is 1.
            </p>
          </div>

          <Button
            type="button"
            disabled={!canSubmit || loading}
            className="h-11 rounded-xl px-6 sm:min-w-[180px]"
            onClick={async () => {
              if (!canSubmit || loading) return;
              await onAdd();
              // if success → router.push("/order-item")
            }}
          >
            {loading ? (
              "Adding..."
            ) : (
              <>
                <span>Checkout</span>
                <span className="ml-2 text-muted-foreground/80">•</span>
                <span className="ml-2 tabular-nums">{safeQty}</span>
              </>
            )}
          </Button>

          {/* <Button asChild
            disabled={!canSubmit}
            className="h-11 rounded-xl px-6 sm:min-w-[180px]"
            onClick={onAdd}
          >
            {loading ? (
              "Adding..."
            ) : (
              <>
               
                 <Link href="/order">Checkout</Link>
                <span className="ml-2 text-muted-foreground/80">•</span>
                <span className="ml-2 tabular-nums">{safeQty}</span>
              </>
            )}
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}
