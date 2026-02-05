// src/app/admin-dashboard/admin-users/page.tsx

import { UsersTable } from "@/lib/components/ui/users-table";

import { usersService } from "@/services/user.service";

export default async function Page() {
  const { data, error } = await usersService.getAll();

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border p-4 text-sm">
          <p className="font-medium text-destructive">Failed to load users</p>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  const users = Array.isArray(data) ? data : [];

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage roles, status, and delete users
        </p>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
