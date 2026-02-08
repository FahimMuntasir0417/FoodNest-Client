import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function UserDashboard() {
  return (
    <div className="mx-auto w-full max-w-5xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight">
            Provider Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">Overview</p>
        </div>
        <Badge variant="secondary">Active</Badge>
      </div>

      <Separator />

      {/* Minimal stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-2xl font-semibold">12</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Meals
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-2xl font-semibold">5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-2xl font-semibold">$240</p>
          </CardContent>
        </Card>
      </div>

      {/* Minimal recent list */}
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium">Recent</CardTitle>
        </CardHeader>
        <CardContent className="pb-4 space-y-3">
          {[
            { title: "Order #1024", meta: "2h ago" },
            { title: "Order #1023", meta: "Yesterday" },
            { title: "Meal updated", meta: "2d ago" },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between text-sm"
            >
              <span>{item.title}</span>
              <span className="text-muted-foreground">{item.meta}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
