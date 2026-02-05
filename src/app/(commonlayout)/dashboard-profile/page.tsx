// src/app/admin-dashboard/me/page.tsx

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usersService } from "@/services/user.service";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function Page() {
  const { data, error } = await usersService.getMe();

  if (error || !data) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-destructive">Failed to load profile</p>
            <p className="text-muted-foreground">{error?.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const u = data;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground">
          Account details and access level
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Role
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            <Badge variant="outline">{u.role}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            <Badge variant={u.status === "ACTIVE" ? "default" : "destructive"}>
              {u.status}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Email Verified
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xl font-semibold">
            <Badge variant="secondary">{u.emailVerified ? "Yes" : "No"}</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border p-3">
              <div className="text-muted-foreground">Name</div>
              <div className="font-medium">{u.name}</div>
            </div>

            <div className="rounded-md border p-3">
              <div className="text-muted-foreground">Email</div>
              <div className="font-medium">{u.email}</div>
            </div>

            <div className="rounded-md border p-3">
              <div className="text-muted-foreground">Phone</div>
              <div className="font-medium">{u.phone ?? "—"}</div>
            </div>

            <div className="rounded-md border p-3">
              <div className="text-muted-foreground">Provider ID</div>
              <div className="font-mono text-xs break-all">
                {u.providerId ?? "—"}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border p-3">
              <div className="text-muted-foreground">Created</div>
              <div className="font-medium">{fmtDate(u.createdAt)}</div>
            </div>

            <div className="rounded-md border p-3">
              <div className="text-muted-foreground">Updated</div>
              <div className="font-medium">{fmtDate(u.updatedAt)}</div>
            </div>

            <div className="rounded-md border p-3 md:col-span-2">
              <div className="text-muted-foreground">User ID</div>
              <div className="mt-1 font-mono text-xs break-all">{u.id}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
