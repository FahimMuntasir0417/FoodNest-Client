import { UserCard } from "@/lib/components/user/UserCard";
import { userService } from "@/services/user.service";
import type { User } from "@/types/user/user";

export default async function Page() {
  const result = await userService.getAll();
  const users = result?.data as User[] | null;

  if (result?.error) return <div className="p-6">{result.error.message}</div>;
  if (!users?.length) return <div className="p-6">No users found</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Users</h1>
      <div className="space-y-3">
        {users.map((u) => (
          <UserCard key={u.id} user={u} />
        ))}
      </div>
    </div>
  );
}
