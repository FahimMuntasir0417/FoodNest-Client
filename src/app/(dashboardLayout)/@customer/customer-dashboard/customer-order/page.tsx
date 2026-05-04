import { OrdersTable, type DashboardOrderRow } from "@/components/dashboard/orders-table";
import { MetricCard } from "@/components/dashboard/dashboard-widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney, toArray } from "@/lib/foodnest-data";
import { ordersService, type Order } from "@/services/orders.service";

type OrderItem = {
  id?: string;
  meal?: { title?: string };
};

function countStatus(orders: Order[], status: string) {
  return orders.filter((order) => order.status === status).length;
}

export default async function Page() {
  const { data, error } = await ordersService.getMe();

  if (error) {
    return (
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="text-destructive">Failed to load orders</p>
          <p className="text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const orders = toArray<Order>(data);
  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.total ?? 0),
    0,
  );
  const rows: DashboardOrderRow[] = orders.map((order) => {
    const items = Array.isArray(order.items) ? (order.items as OrderItem[]) : [];

    return {
      id: order.id,
      status: order.status,
      customerName: "Your account",
      phone: order.phone,
      deliveryAddress: order.deliveryAddress,
      total: order.total,
      createdAt: order.createdAt,
      itemCount: items.length,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Filter and paginate your FoodNest order history.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Total orders" value={String(orders.length)} detail="Orders connected to your account" />
        <MetricCard title="Delivered" value={String(countStatus(orders, "DELIVERED"))} detail="Completed deliveries" />
        <MetricCard title="Total spent" value={formatMoney(totalSpent)} detail="Sum of your order totals" />
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-base">Order history</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={rows} />
        </CardContent>
      </Card>
    </div>
  );
}
