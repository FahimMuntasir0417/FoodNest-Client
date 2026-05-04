import { Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-6">
      <Card className="w-full max-w-sm rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Loading</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Loader2 className="size-5 animate-spin" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Loading meal...</p>
            <p className="text-xs text-muted-foreground">
              Fetching the latest FoodNest details.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
