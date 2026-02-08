import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Loading</CardTitle>
        </CardHeader>

        <CardContent className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Loading meal…</p>
            <p className="text-xs text-muted-foreground">
              Fetching something tasty for you.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
