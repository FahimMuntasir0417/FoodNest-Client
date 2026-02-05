import { getProviderOrders } from "@/actions/provider-order.action";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { OrderStatusControl } from "./OrderStatusControl";

type ProviderOrder = {
  id: string;
  status: string;
  deliveryAddress: string;
  phone?: string | null;
  note?: string | null;
  subTotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  customer?: { id: string; name: string; phone?: string | null };
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    meal?: { id: string; title?: string; price?: number; providerId?: string };
  }>;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function money(n: number) {
  return `৳ ${Number(n || 0).toLocaleString()}`;
}

function statusBadge(status: string) {
  return <Badge variant="outline">{status}</Badge>;
}

export default async function Page() {
  const { data, error } = await getProviderOrders();

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Provider Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-destructive">Failed to load orders</p>
            <p className="text-muted-foreground">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orders: ProviderOrder[] = Array.isArray(data)
    ? (data as ProviderOrder[])
    : [];

  const totalOrders = orders.length;
  const placed = orders.filter((o) => o.status === "PLACED").length;
  const revenue = orders.reduce((sum, o) => sum + (o.total ?? 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Manage incoming orders for your meals
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {totalOrders}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Placed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{placed}</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {money(revenue)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Orders</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {orders.length === 0 ? (
            <div className="rounded-md border p-6 text-sm text-muted-foreground">
              No orders found.
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[220px]">Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {orders.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-mono text-xs">
                          {o.id}
                        </TableCell>
                        <TableCell>{statusBadge(o.status)}</TableCell>

                        <TableCell className="text-sm">
                          <div className="font-medium">
                            {o.customer?.name ?? "Unknown"}
                          </div>
                          {o.phone ? (
                            <div className="text-muted-foreground">
                              {o.phone}
                            </div>
                          ) : null}
                        </TableCell>

                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(o.createdAt)}
                        </TableCell>

                        <TableCell className="text-right font-medium">
                          {money(o.total)}
                        </TableCell>

                        <TableCell className="text-right">
                          <OrderStatusControl
                            orderId={o.id}
                            currentStatus={o.status}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-sm font-medium">Order details</div>

                <Accordion type="single" collapsible className="w-full">
                  {orders.map((o) => (
                    <AccordionItem key={o.id} value={o.id}>
                      <AccordionTrigger className="text-sm">
                        <div className="flex w-full items-center justify-between pr-2">
                          <span className="font-mono text-xs">{o.id}</span>
                          <span className="text-muted-foreground">
                            {money(o.total)} • {o.items?.length ?? 0} item(s)
                          </span>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="rounded-md border p-3">
                            <div className="text-sm font-medium">Delivery</div>
                            <div className="mt-1 text-sm text-muted-foreground break-words">
                              {o.deliveryAddress}
                            </div>
                            {o.note ? (
                              <div className="mt-2 text-sm text-muted-foreground">
                                Note: {o.note}
                              </div>
                            ) : null}
                          </div>

                          <div className="rounded-md border p-3">
                            <div className="text-sm font-medium">Amounts</div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              Subtotal: {money(o.subTotal)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Delivery fee: {money(o.deliveryFee)}
                            </div>
                            <div className="text-sm font-medium mt-2">
                              Total: {money(o.total)}
                            </div>
                          </div>

                          <div className="rounded-md border p-3">
                            <div className="text-sm font-medium">Customer</div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {o.customer?.name ?? "Unknown"}
                            </div>
                            {o.customer?.phone ? (
                              <div className="text-sm text-muted-foreground">
                                {o.customer.phone}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-4 rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Meal</TableHead>
                                <TableHead className="text-right">
                                  Qty
                                </TableHead>
                                <TableHead className="text-right">
                                  Unit
                                </TableHead>
                                <TableHead className="text-right">
                                  Line Total
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {o.items?.map((it) => (
                                <TableRow key={it.id}>
                                  <TableCell className="text-sm">
                                    {it.meal?.title ?? "Unknown meal"}
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
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
