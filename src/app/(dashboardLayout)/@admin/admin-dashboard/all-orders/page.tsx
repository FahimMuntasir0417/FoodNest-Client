import { OrdersTable, type DashboardOrderRow } from "@/components/dashboard/orders-table";
import { MetricCard } from "@/components/dashboard/dashboard-widgets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney, toArray } from "@/lib/foodnest-data";
import { ordersService } from "@/services/orders.service";

type ApiOrder = {
  id: string;
  status?: string;
  deliveryAddress?: string | null;
  phone?: string | null;
  total?: number;
  createdAt?: string;
  customer?: { name?: string; email?: string };
  items?: unknown[];
};

function countStatus(orders: ApiOrder[], status: string) {
  return orders.filter((order) => order.status === status).length;
}

export default async function Page() {
  const { data, error } = await ordersService.getAll();

  if (error) {
    return (
      <div className="space-y-4">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-destructive">Failed to load orders</p>
            <p className="text-muted-foreground">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orders = toArray<ApiOrder>(data);
  const revenue = orders.reduce((sum, order) => sum + Number(order.total ?? 0), 0);
  const rows: DashboardOrderRow[] = orders.map((order) => ({
    id: order.id,
    status: order.status,
    customerName: order.customer?.name,
    customerEmail: order.customer?.email,
    phone: order.phone,
    deliveryAddress: order.deliveryAddress,
    total: order.total,
    createdAt: order.createdAt,
    itemCount: order.items?.length ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Filter, inspect, and paginate platform orders.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total orders" value={String(orders.length)} detail="All platform orders" />
        <MetricCard title="Revenue" value={formatMoney(revenue)} detail="Total order value" />
        <MetricCard title="Preparing" value={String(countStatus(orders, "PREPARING"))} detail="Orders in progress" />
        <MetricCard title="Delivered" value={String(countStatus(orders, "DELIVERED"))} detail="Completed orders" />
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-base">All orders</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={rows} />
        </CardContent>
      </Card>
    </div>
  );
}
