import type { User } from "@/types/user/user";

export function UserCard({ user }: { user: User }) {
  return (
    <div className="rounded-xl border p-4 flex gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={user.image ?? "https://via.placeholder.com/48"}
        alt={user.name}
        className="h-12 w-12 rounded-full object-cover"
      />

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
