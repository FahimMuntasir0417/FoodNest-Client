import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/foodnest-data";
import type { User } from "@/types/user/user";

export function UserCard({ user }: { user: User }) {
  return (
    <div className="flex gap-4 rounded-lg border p-4">
      <Avatar className="size-12 rounded-md">
        <AvatarImage src={user.image ?? undefined} alt={user.name} />
        <AvatarFallback className="rounded-md">
          {initials(user.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="font-semibold">{user.name}</div>
        <div className="text-sm text-muted-foreground">{user.email}</div>

        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-md border px-2 py-1">Role: {user.role}</span>
          <span className="rounded-md border px-2 py-1">
            Status: {user.status}
          </span>
          <span className="rounded-md border px-2 py-1">
            Verified: {user.emailVerified ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
}
