"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { adminDeleteUser, adminUpdateUserRole, adminUpdateUserStatus } from "@/actions/users.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/foodnest-data";
import type { User } from "@/types";

const PAGE_SIZE = 8;

function RoleBadge({ role }: { role: User["role"] }) {
  return <Badge variant="outline">{role}</Badge>;
}

function StatusBadge({ status }: { status: User["status"] }) {
  return (
    <Badge variant={status === "ACTIVE" ? "default" : "destructive"}>
      {status}
    </Badge>
  );
}

export function UsersTable({ users }: { users: User[] }) {
  const [query, setQuery] = React.useState("");
  const [role, setRole] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return users.filter((user) => {
      const matchesQuery =
        !normalized ||
        [user.name, user.email, user.id, user.phone]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      const matchesRole = role === "all" || user.role === role;
      const matchesStatus = status === "all" || user.status === status;

      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [query, role, status, users]);

  React.useEffect(() => {
    setPage(1);
  }, [query, role, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  async function onChangeRole(userId: string, nextRole: User["role"]) {
    const toastId = toast.loading("Updating role...");
    const res = await adminUpdateUserRole(userId, nextRole);
    if (res?.error) {
      toast.error(res.error.message, { id: toastId });
      return;
    }
    toast.success("Role updated", { id: toastId });
  }

  async function onChangeStatus(userId: string, nextStatus: User["status"]) {
    const toastId = toast.loading("Updating status...");
    const res = await adminUpdateUserStatus(userId, nextStatus);
    if (res?.error) {
      toast.error(res.error.message, { id: toastId });
      return;
    }
    toast.success("Status updated", { id: toastId });
  }

  async function onDelete(userId: string) {
    const ok = window.confirm("Delete this user? This cannot be undone.");
    if (!ok) return;

    setDeletingId(userId);
    const toastId = toast.loading("Deleting user...");
    const res = await adminDeleteUser(userId);
    if (res?.error) {
      toast.error(res.error.message, { id: toastId });
      setDeletingId(null);
      return;
    }
    toast.success("User deleted", { id: toastId });
    setDeletingId(null);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by name, email, phone, or ID"
          className="rounded-md"
        />
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="rounded-md">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
            <SelectItem value="PROVIDER">PROVIDER</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="rounded-md">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
            <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[260px]">User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Verified</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                    <span className="mt-1 break-all font-mono text-[10px] text-muted-foreground">
                      {user.id}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-2">
                    <RoleBadge role={user.role} />
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value) =>
                        onChangeRole(user.id, value as User["role"])
                      }
                    >
                      <SelectTrigger className="h-8 w-[140px] rounded-md">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CUSTOMER">CUSTOMER</SelectItem>
                        <SelectItem value="PROVIDER">PROVIDER</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={user.status} />
                    <Select
                      defaultValue={user.status}
                      onValueChange={(value) =>
                        onChangeStatus(user.id, value as User["status"])
                      }
                    >
                      <SelectTrigger className="h-8 w-[140px] rounded-md">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                        <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="secondary">
                    {user.emailVerified ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          navigator.clipboard.writeText(user.id);
                          toast.success("Copied user ID");
                        }}
                      >
                        Copy user ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(user.id)}
                        disabled={deletingId === user.id}
                      >
                        {deletingId === user.id ? "Deleting..." : "Delete user"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                  No users match the current filters.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={currentPage}
        pageCount={pageCount}
        total={filtered.length}
        onPrevious={() => setPage((value) => Math.max(1, value - 1))}
        onNext={() => setPage((value) => Math.min(pageCount, value + 1))}
      />
    </div>
  );
}

function Pagination({
  page,
  pageCount,
  total,
  onPrevious,
  onNext,
}: {
  page: number;
  pageCount: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>{total} result(s)</span>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-md"
          onClick={onPrevious}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {pageCount}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-md"
          onClick={onNext}
          disabled={page >= pageCount}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
