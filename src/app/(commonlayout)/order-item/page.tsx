// src/app/(commonlayout)/cart/page.tsx
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { getDraftMe, type OrderItem } from "@/services/order-items.service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CartItemActions from "@/lib/components/postModule/cart/ui/cart-item-actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Cart",
  description: "Your draft cart items",
};

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

export default async function CartPage() {
  const res = await getDraftMe();

  if (res.error) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-10">
        <Card className="overflow-hidden rounded-3xl border">
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-500/12 via-transparent to-transparent"
            />
            <CardContent className="relative p-6 md:p-8">
              <h1 className="text-lg font-semibold tracking-tight">
                Failed to load cart
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {res.error.message}
              </p>

              <div className="mt-5">
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href="/maels">Back to meals</Link>
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </main>
    );
  }

  const items: OrderItem[] = res.data ?? [];
  const subtotal = items.reduce((sum, it) => sum + (it.lineTotal || 0), 0);
  const totalQty = items.reduce((sum, it) => sum + (it.quantity || 0), 0);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Cart</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} item(s) • {totalQty} qty
          </p>
        </div>

        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/maels">Continue shopping</Link>
        </Button>
      </div>

      <Separator className="my-6" />

      {/* Empty */}
      {items.length === 0 ? (
        <Card className="rounded-3xl">
          <CardContent className="p-10 text-center md:p-14">
            <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-muted text-2xl">
              🛒
            </div>
            <h2 className="mt-4 text-lg font-semibold tracking-tight">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add some meals to see them here.
            </p>

            <div className="mt-6 flex justify-center">
              <Button asChild className="rounded-xl">
                <Link href="/maels">Browse meals</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,360px]">
          {/* Items */}
          <section className="space-y-4">
            {items.map((it) => {
              const m = it.meal;

              return (
                <Card key={it.id} className="rounded-3xl">
                  <CardContent className="p-5">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-muted">
                        {m?.imageUrl ? (
                          <Image
                            src={m.imageUrl}
                            alt={m.title ?? "Meal"}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-base font-semibold tracking-tight">
                              {m?.title ?? "Meal"}
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                              {m?.cuisine ? `${m.cuisine} • ` : ""}
                              <span
                                className={[
                                  "inline-flex items-center rounded-full border px-2 py-0.5 text-xs",
                                  m?.isAvailable
                                    ? "border-emerald-200 text-emerald-700"
                                    : "border-rose-200 text-rose-700",
                                ].join(" ")}
                              >
                                {m?.isAvailable ? "Available" : "Unavailable"}
                              </span>
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Line total
                            </p>
                            <p className="text-base font-semibold">
                              {formatBDT(it.lineTotal)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span>
                              Qty:{" "}
                              <span className="font-semibold text-foreground">
                                {it.quantity}
                              </span>
                            </span>
                            <span className="text-muted-foreground/40">•</span>
                            <span>
                              Unit:{" "}
                              <span className="font-semibold text-foreground">
                                {formatBDT(it.unitPrice)}
                              </span>
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {m?.id ? (
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="rounded-xl"
                              >
                                <Link href={`/maels/${m.id}`}>View</Link>
                              </Button>
                            ) : null}

                            {/* ✅ actions (client component) */}
                            <CartItemActions
                              itemId={it.id}
                              quantity={it.quantity}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </section>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24">
            <Card className="rounded-3xl">
              <CardHeader>
                <CardTitle className="text-base">Order summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Items</span>
                    <span className="font-medium text-foreground">
                      {items.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Total quantity</span>
                    <span className="font-medium text-foreground">
                      {totalQty}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">{formatBDT(subtotal)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-lg font-semibold">
                    {formatBDT(subtotal)}
                  </span>
                </div>

                <Button asChild className="h-11 w-full rounded-xl">
                  <Link href="/order">Checkout</Link>
                </Button>

                <p className="text-xs text-muted-foreground">
                  Checkout button is UI-only for now (no checkout logic added).
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      )}
    </main>
  );
}

// // src/app/(commonlayout)/cart/page.tsx
// import Image from "next/image";
// import Link from "next/link";
// import type { Metadata } from "next";

// import { getDraftMe } from "@/services/order-items.service";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";

// export const dynamic = "force-dynamic";

// export const metadata: Metadata = {
//   title: "My Cart",
//   description: "Your draft cart items",
// };

// type Meal = {
//   id: string;
//   providerId: string;
//   categoryId: string;
//   title: string;
//   description: string;
//   price: number;
//   imageUrl: string | null;
//   cuisine: string | null;
//   isAvailable: boolean;
//   createdAt: string;
//   updatedAt: string;
// };

// type OrderItem = {
//   id: string;
//   orderId: string | null;
//   customerId: string;
//   mealId: string;
//   quantity: number;
//   unitPrice: number;
//   lineTotal: number;
//   meal?: Meal;
// };

// function formatBDT(amount: number) {
//   try {
//     return new Intl.NumberFormat("bn-BD", {
//       style: "currency",
//       currency: "BDT",
//     }).format(amount);
//   } catch {
//     return `৳${amount}`;
//   }
// }

// export default async function CartPage() {
//   const res = await getDraftMe();

//   // ✅ Error state (shadcn)
//   if (res.error) {
//     return (
//       <main className="mx-auto w-full max-w-5xl px-4 py-10">
//         <Card className="overflow-hidden rounded-3xl border">
//           <div className="relative">
//             <div
//               aria-hidden
//               className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-500/12 via-transparent to-transparent"
//             />
//             <CardContent className="relative p-6 md:p-8">
//               <h1 className="text-lg font-semibold tracking-tight">
//                 Failed to load cart
//               </h1>
//               <p className="mt-2 text-sm text-muted-foreground">
//                 {res.error.message}
//               </p>
//               <p className="mt-1 text-xs text-muted-foreground">
//                 Check API_URL and the{" "}
//                 <span className="font-mono">/order-items/draft/me</span>{" "}
//                 endpoint.
//               </p>

//               <div className="mt-5">
//                 <Button asChild variant="outline" className="rounded-xl">
//                   <Link href="/maels">Back to meals</Link>
//                 </Button>
//               </div>
//             </CardContent>
//           </div>
//         </Card>
//       </main>
//     );
//   }

//   const items: OrderItem[] = res.data ?? [];
//   const subtotal = items.reduce((sum, it) => sum + (it.lineTotal || 0), 0);
//   const totalQty = items.reduce((sum, it) => sum + (it.quantity || 0), 0);

//   return (
//     <main className="mx-auto w-full max-w-6xl px-4 py-10">
//       {/* Header */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold tracking-tight">My Cart</h1>
//           <p className="mt-1 text-sm text-muted-foreground">
//             {items.length} item(s) • {totalQty} qty
//           </p>
//         </div>

//         <Button asChild variant="outline" className="rounded-xl">
//           <Link href="/maels">Continue shopping</Link>
//         </Button>
//       </div>

//       <Separator className="my-6" />

//       {/* Empty */}
//       {items.length === 0 ? (
//         <Card className="rounded-3xl">
//           <CardContent className="p-10 text-center md:p-14">
//             <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-muted text-2xl">
//               🛒
//             </div>
//             <h2 className="mt-4 text-lg font-semibold tracking-tight">
//               Your cart is empty
//             </h2>
//             <p className="mt-2 text-sm text-muted-foreground">
//               Add some meals to see them here.
//             </p>

//             <div className="mt-6 flex justify-center">
//               <Button asChild className="rounded-xl">
//                 <Link href="/maels">Browse meals</Link>
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,360px]">
//           {/* Items */}
//           <section className="space-y-4">
//             {items.map((it) => {
//               const m = it.meal;

//               return (
//                 <Card key={it.id} className="rounded-3xl">
//                   <CardContent className="p-5">
//                     <div className="flex gap-4">
//                       {/* Image */}
//                       <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-muted">
//                         {m?.imageUrl ? (
//                           <Image
//                             src={m.imageUrl}
//                             alt={m.title ?? "Meal"}
//                             fill
//                             className="object-cover"
//                             sizes="96px"
//                           />
//                         ) : (
//                           <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
//                             No image
//                           </div>
//                         )}
//                       </div>

//                       <div className="min-w-0 flex-1">
//                         <div className="flex items-start justify-between gap-3">
//                           <div className="min-w-0">
//                             <p className="truncate text-base font-semibold tracking-tight">
//                               {m?.title ?? "Meal"}
//                             </p>

//                             <p className="mt-1 text-sm text-muted-foreground">
//                               {m?.cuisine ? `${m.cuisine} • ` : ""}
//                               <span
//                                 className={[
//                                   "inline-flex items-center rounded-full border px-2 py-0.5 text-xs",
//                                   m?.isAvailable
//                                     ? "border-emerald-200 text-emerald-700"
//                                     : "border-rose-200 text-rose-700",
//                                 ].join(" ")}
//                               >
//                                 {m?.isAvailable ? "Available" : "Unavailable"}
//                               </span>
//                             </p>
//                           </div>

//                           <div className="text-right">
//                             <p className="text-xs text-muted-foreground">
//                               Line total
//                             </p>
//                             <p className="text-base font-semibold">
//                               {formatBDT(it.lineTotal)}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
//                           <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
//                             <span>
//                               Qty:{" "}
//                               <span className="font-semibold text-foreground">
//                                 {it.quantity}
//                               </span>
//                             </span>
//                             <span className="text-muted-foreground/40">•</span>
//                             <span>
//                               Unit:{" "}
//                               <span className="font-semibold text-foreground">
//                                 {formatBDT(it.unitPrice)}
//                               </span>
//                             </span>
//                           </div>

//                           <div className="flex flex-wrap items-center gap-2">
//                             {m?.id ? (
//                               <Button
//                                 asChild
//                                 variant="outline"
//                                 size="sm"
//                                 className="rounded-xl"
//                               >
//                                 <Link href={`/maels/${m.id}`}>View meal</Link>
//                               </Button>
//                             ) : null}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </section>

//           {/* Summary */}
//           <aside className="lg:sticky lg:top-24">
//             <Card className="rounded-3xl">
//               <CardHeader>
//                 <CardTitle className="text-base">Order summary</CardTitle>
//               </CardHeader>

//               <CardContent className="space-y-4">
//                 <div className="space-y-2 text-sm">
//                   <div className="flex items-center justify-between text-muted-foreground">
//                     <span>Items</span>
//                     <span className="font-medium text-foreground">
//                       {items.length}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between text-muted-foreground">
//                     <span>Total quantity</span>
//                     <span className="font-medium text-foreground">
//                       {totalQty}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <span className="text-muted-foreground">Subtotal</span>
//                     <span className="font-semibold">{formatBDT(subtotal)}</span>
//                   </div>
//                 </div>

//                 <Separator />

//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-semibold">Total</span>
//                   <span className="text-lg font-semibold">
//                     {formatBDT(subtotal)}
//                   </span>
//                 </div>

//                 <Button asChild className="h-11 w-full rounded-xl">
//                   <Link href="/order">Checkout</Link>
//                 </Button>

//                 <p className="text-xs text-muted-foreground">
//                   Checkout button is UI-only for now (no logic added).
//                 </p>
//               </CardContent>
//             </Card>
//           </aside>
//         </div>
//       )}
//     </main>
//   );
// }
