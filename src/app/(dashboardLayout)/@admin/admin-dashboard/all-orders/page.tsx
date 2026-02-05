// app/admin-dashboard/orders/page.tsx
import { ordersService } from "@/services/odders.service";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  meal?: {
    title?: string;
    provider?: { shopName?: string | null };
    category?: { name?: string | null };
  };
};

type Order = {
  id: string;
  status: string;
  deliveryAddress: string;
  phone?: string | null;
  note?: string | null;
  subTotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  customer?: { name?: string; email?: string; role?: string };
  items: OrderItem[];
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

const money = (n: number) => `৳ ${n.toLocaleString()}`;

function statusBadgeVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "DELIVERED":
      return "default";
    case "CANCELLED":
      return "destructive";
    case "PREPARING":
    case "READY":
      return "secondary";
    default:
      return "outline"; // PLACED or unknown
  }
}

export default async function Page() {
  const { data, error } = await ordersService.getAll();

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Failed to load orders: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  const orders: Order[] = Array.isArray(data)
    ? (data as Order[])
    : Array.isArray((data as any)?.data)
      ? ((data as any).data as Order[])
      : [];

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);
  const placed = orders.filter((o) => o.status === "PLACED").length;
  const preparing = orders.filter((o) => o.status === "PREPARING").length;
  const delivered = orders.filter((o) => o.status === "DELIVERED").length;
  const cancelled = orders.filter((o) => o.status === "CANCELLED").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            View and manage orders across the platform.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total orders:{" "}
          <span className="font-medium text-foreground">{orders.length}</span>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <div className="text-sm text-muted-foreground">Revenue</div>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {money(totalRevenue)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="text-sm text-muted-foreground">Placed</div>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{placed}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="text-sm text-muted-foreground">Preparing</div>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {preparing}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="text-sm text-muted-foreground">Delivered</div>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {delivered}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="text-sm text-muted-foreground">Cancelled</div>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {cancelled}
          </CardContent>
        </Card>
      </div>

      {/* Empty state */}
      {orders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No orders</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Orders will appear here once customers start placing them.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <Card key={o.id} className="overflow-hidden">
              <CardHeader className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Order</div>
                    <div className="font-mono text-xs break-all">{o.id}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={statusBadgeVariant(o.status)}>
                      {o.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {fmtDate(o.createdAt)}
                    </div>
                    <div className="text-base font-semibold">
                      {money(o.total)}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg border bg-muted/20 p-3">
                    <div className="text-sm font-medium">Customer</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {o.customer?.name ?? "Unknown"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {o.customer?.email ?? ""}
                    </div>
                    {o.customer?.role ? (
                      <div className="text-xs text-muted-foreground mt-1">
                        Role: {o.customer.role}
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-lg border bg-muted/20 p-3">
                    <div className="text-sm font-medium">Delivery</div>
                    <div className="mt-1 text-sm text-muted-foreground break-words">
                      {o.deliveryAddress}
                    </div>
                    {o.phone ? (
                      <div className="text-sm text-muted-foreground mt-1">
                        Phone: {o.phone}
                      </div>
                    ) : null}
                    {o.note ? (
                      <div className="text-sm text-muted-foreground mt-1">
                        Note: {o.note}
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-lg border bg-muted/20 p-3">
                    <div className="text-sm font-medium">Amounts</div>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Subtotal</span>
                        <span className="text-foreground">
                          {money(o.subTotal)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Delivery fee</span>
                        <span className="text-foreground">
                          {money(o.deliveryFee)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-medium">
                        <span>Total</span>
                        <span className="text-foreground">
                          {money(o.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Meal</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Unit</TableHead>
                        <TableHead className="text-right">Line total</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {o.items?.map((it) => (
                        <TableRow key={it.id}>
                          <TableCell className="font-medium">
                            {it.meal?.title ?? "Unknown meal"}
                          </TableCell>
                          <TableCell>
                            {it.meal?.provider?.shopName ?? "—"}
                          </TableCell>
                          <TableCell>
                            {it.meal?.category?.name ?? "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            {it.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {money(it.unitPrice)}
                          </TableCell>
                          <TableCell className="text-right">
                            {money(it.lineTotal)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
