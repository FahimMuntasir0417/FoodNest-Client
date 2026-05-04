import { getProviderOrders } from "@/actions/provider-order.action";
import { MetricCard } from "@/components/dashboard/dashboard-widgets";
import { OrdersTable, type DashboardOrderRow } from "@/components/dashboard/orders-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney, toArray } from "@/lib/foodnest-data";

type ProviderOrder = {
  id: string;
  status?: string;
  deliveryAddress?: string | null;
  phone?: string | null;
  total?: number;
  createdAt?: string;
  customer?: { name?: string; email?: string; phone?: string | null };
  items?: unknown[];
};

function countStatus(orders: ProviderOrder[], status: string) {
  return orders.filter((order) => order.status === status).length;
}

export default async function Page() {
  const { data, error } = await getProviderOrders();

  if (error) {
    return (
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Provider Orders</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="text-destructive">Failed to load orders</p>
          <p className="text-muted-foreground">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const orders = toArray<ProviderOrder>(data);
  const revenue = orders.reduce((sum, order) => sum + Number(order.total ?? 0), 0);
  const rows: DashboardOrderRow[] = orders.map((order) => ({
    id: order.id,
    status: order.status,
    customerName: order.customer?.name,
    customerEmail: order.customer?.email,
    phone: order.phone || order.customer?.phone,
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
          Filter provider orders, paginate results, and update status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Total orders" value={String(orders.length)} detail="Orders assigned to this provider" />
        <MetricCard title="Placed" value={String(countStatus(orders, "PLACED"))} detail="Waiting for provider action" />
        <MetricCard title="Revenue" value={formatMoney(revenue)} detail="Total provider order value" />
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="text-base">Provider order table</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={rows} showStatusControl />
        </CardContent>
      </Card>
    </div>
  );
}
