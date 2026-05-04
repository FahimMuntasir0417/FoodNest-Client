import { UsersTable } from "@/lib/components/ui/users-table";
import { usersService } from "@/services/user.service";
import { toArray } from "@/lib/foodnest-data";
import type { User } from "@/types";

export default async function Page() {
  const result = await usersService.getAll();
  const users = toArray<User>(result.data);

  if (result.error) {
    return <div className="text-sm text-destructive">{result.error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Filter and paginate users, roles, and account status.
        </p>
      </div>
      <UsersTable users={users} />
    </div>
  );
}
