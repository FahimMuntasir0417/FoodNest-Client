"use client";

import * as React from "react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { MapPin, Phone, StickyNote, Truck, ShieldCheck } from "lucide-react";

import { createOrderFromDrafts } from "@/actions/orders.action";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const DELIVERY_FEE = 50;

const orderSchema = z.object({
  deliveryAddress: z
    .string()
    .min(5, "Delivery address must be at least 5 characters")
    .max(200, "Delivery address must be less than 200 characters"),
  phone: z
    .string()
    .min(6, "Phone must be at least 6 characters")
    .max(20, "Phone must be less than 20 characters"),
  note: z.string().max(300, "Note must be less than 300 characters").optional(),
});

type OrderFormErrors = Partial<
  Record<keyof z.infer<typeof orderSchema>, string>
>;

function formatBDT(amount: number) {
  try {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
    }).format(amount);
  } catch {
    return `৳${amount}`;
  }
}

export default function OrderForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const [touched, setTouched] = useState({
    deliveryAddress: false,
    phone: false,
    note: false,
  });

  const [errors, setErrors] = useState<OrderFormErrors>({});

  const validate = () => {
    const result = orderSchema.safeParse({
      deliveryAddress: deliveryAddress.trim(),
      phone: phone.trim(),
      note: note.trim() ? note.trim() : undefined,
    });

    if (result.success) {
      setErrors({});
      return { ok: true as const, value: result.data };
    }

    const fieldErrors = result.error.flatten().fieldErrors;
    const next: OrderFormErrors = {
      deliveryAddress: fieldErrors.deliveryAddress?.[0],
      phone: fieldErrors.phone?.[0],
      note: fieldErrors.note?.[0],
    };
    setErrors(next);
    return { ok: false as const };
  };

  const canSubmit = useMemo(() => {
    const result = orderSchema.safeParse({
      deliveryAddress: deliveryAddress.trim(),
      phone: phone.trim(),
      note: note.trim() ? note.trim() : undefined,
    });
    return result.success && !isPending;
  }, [deliveryAddress, phone, note, isPending]);

  const submit = () => {
    setTouched({ deliveryAddress: true, phone: true, note: true });

    const v = validate();
    if (!v.ok) {
      toast.error("Please fix the form errors");
      return;
    }

    const toastId = toast.loading("Placing order...");

    startTransition(() => {
      (async () => {
        const res = await createOrderFromDrafts({
          deliveryAddress: v.value.deliveryAddress,
          phone: v.value.phone,
          note: v.value.note,
          deliveryFee: DELIVERY_FEE,
        });

        if (res?.error) {
          toast.error(res.error.message, { id: toastId });
          return;
        }

        toast.success("Order placed successfully!", { id: toastId });

        router.push("/customer-dashboard/customer-order");
        router.refresh();
      })();
    });
  };

  return (
    <Card className="rounded-3xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base">Order details</CardTitle>
        <p className="text-sm text-muted-foreground">
          Confirm delivery information to place the order.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Form */}
        <div className="grid gap-4">
          {/* Address */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              Delivery address
            </label>

            <Input
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              onBlur={() => {
                setTouched((t) => ({ ...t, deliveryAddress: true }));
                validate();
              }}
              placeholder="Dhanmondi, Dhaka"
              className={[
                "h-11 rounded-xl",
                touched.deliveryAddress && errors.deliveryAddress
                  ? "border-rose-300 focus-visible:ring-rose-200"
                  : "",
              ].join(" ")}
            />

            {touched.deliveryAddress && errors.deliveryAddress ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.deliveryAddress}
              </p>
            ) : null}
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Phone className="size-4 text-primary" />
              Phone
            </label>

            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => {
                setTouched((t) => ({ ...t, phone: true }));
                validate();
              }}
              placeholder="01700000000"
              className={[
                "h-11 rounded-xl",
                touched.phone && errors.phone
                  ? "border-rose-300 focus-visible:ring-rose-200"
                  : "",
              ].join(" ")}
            />

            {touched.phone && errors.phone ? (
              <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>
            ) : null}
          </div>

          {/* Note */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <StickyNote className="size-4 text-primary" />
              Note (optional)
            </label>

            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => {
                setTouched((t) => ({ ...t, note: true }));
                validate();
              }}
              rows={3}
              placeholder="Call before delivery"
              className={[
                "rounded-xl",
                touched.note && errors.note
                  ? "border-rose-300 focus-visible:ring-rose-200"
                  : "",
              ].join(" ")}
            />

            {touched.note && errors.note ? (
              <p className="mt-1 text-xs text-rose-600">{errors.note}</p>
            ) : null}
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl border bg-muted/20 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Truck className="size-4" />
              Delivery fee
            </span>
            <span className="font-medium">
              {formatBDT(DELIVERY_FEE)}{" "}
              <span className="text-xs text-muted-foreground">(fixed)</span>
            </span>
          </div>

          <Separator className="my-3" />

          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4" />
            Secure checkout • We’ll confirm by phone if needed.
          </div>
        </div>

        {/* Submit */}
        <Button
          type="button"
          className="h-11 w-full rounded-xl"
          disabled={!canSubmit}
          onClick={submit}
        >
          {isPending ? "Placing order..." : "Place order"}
        </Button>

        <p className="text-xs text-muted-foreground">
          Delivery fee is fixed at ৳50.
        </p>
      </CardContent>
    </Card>
  );
}
