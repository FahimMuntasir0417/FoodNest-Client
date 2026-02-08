import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Page = () => {
  return (
    <div className="mx-auto w-full max-w-4xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight">Admin</h1>
          <p className="text-sm text-muted-foreground">Dashboard</p>
        </div>
        <Badge variant="secondary">Admin</Badge>
      </div>

      <Separator />

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-base font-medium">Welcome</CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground">
            Welcome to the admin dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
