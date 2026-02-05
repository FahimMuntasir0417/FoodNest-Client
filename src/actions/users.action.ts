// src/actions/users.action.ts
"use server";

import { usersService } from "@/services/user.service";
import { revalidatePath } from "next/cache";

export async function adminUpdateUserRole(userId: string, role: string) {
  const res = await usersService.updateUser(userId, { role });
  revalidatePath("/admin-dashboard/users");
  return res;
}

export async function adminUpdateUserStatus(userId: string, status: string) {
  const res = await usersService.updateUser(userId, { status });
  revalidatePath("/admin-dashboard/users");
  return res;
}

export async function adminDeleteUser(userId: string) {
  const res = await usersService.deleteUser(userId);
  revalidatePath("/admin-dashboard/users");
  return res;
}
