"use server";

import { categoryService } from "@/services";
import type { CreateCategoryInput } from "@/types/category/category";
import { revalidateTag } from "next/cache";

export const createCategory = async (data: CreateCategoryInput) => {
  const res = await categoryService.createCategory(data);

  // instant refresh of cached categories
  if (!res.error) {
    revalidateTag("categories", "default");
  }

  return res;
};
