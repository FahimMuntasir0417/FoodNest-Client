// src/actions/category.action.ts
"use server";

import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";

import { categoryService } from "@/services";
import type { CreateCategoryInput } from "@/types/category/category";

export type ActionResult<T> = {
  data: T | null;
  error: { message: string; detail?: any } | null;
};

// ✅ CREATE
export async function createCategory(
  data: CreateCategoryInput,
): Promise<ActionResult<any>> {
  const res = await categoryService.createCategory(data);

  if (res?.error) return { data: null, error: res.error };

  // ✅ single argument only

  // ✅ redirect (nothing after this will run)
  redirect("/meals"); // change if your route is different
}

// ✅ DELETE (admin)
export async function adminDeleteCategory(
  categoryId: string,
): Promise<ActionResult<null>> {
  try {
    if (!categoryId) {
      return { data: null, error: { message: "Category id is required" } };
    }

    // ⚠️ ensure categoryService.delete(id) exists
    const res = await categoryService.delete(categoryId);

    if (res?.error) return { data: null, error: res.error };

    revalidatePath("/admin-dashboard/categories");

    return { data: null, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: { message: err?.message ?? "Something went wrong" },
    };
  }
}
