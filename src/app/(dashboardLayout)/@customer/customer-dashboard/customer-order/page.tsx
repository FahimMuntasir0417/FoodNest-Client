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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { ordersService, type Order } from "@/services/odders.service";

function fmtDate(iso: string) {
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

function StatusBadge({ status }: { status: string }) {
  return <Badge variant="outline">{status}</Badge>;
}

export default async function Page() {
  const { data, error } = await ordersService.getMe();

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-destructive">Failed to load orders</p>
            <p className="text-muted-foreground">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orders: Order[] = Array.isArray(data) ? data : [];

  const totalOrders = orders.length;
  const delivered = orders.filter(
    (o: Order) => o.status === "DELIVERED",
  ).length;
  const totalSpent = orders.reduce(
    (sum: number, o: Order) => sum + (o.total ?? 0),
    0,
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">My Orders</h1>
        <p className="text-sm text-muted-foreground">
          Track your recent orders and view details
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
              Delivered
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {delivered}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {money(totalSpent)}
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
                      <TableHead className="w-[260px]">Order</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {orders.map((o: Order) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-mono text-xs">
                          {o.id}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={o.status} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {fmtDate(o.createdAt)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {money(o.total)}
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
                  {orders.map((o: Order) => (
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
                            {o.phone ? (
                              <div className="mt-2 text-sm text-muted-foreground">
                                Phone: {o.phone}
                              </div>
                            ) : null}
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
                            <div className="text-sm font-medium">Status</div>
                            <div className="mt-2">
                              <StatusBadge status={o.status} />
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">
                              Updated: {fmtDate(o.updatedAt)}
                            </div>
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
                              {o.items?.map((it: OrderItem) => (
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
