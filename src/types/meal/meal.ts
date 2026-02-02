import type { Category } from "@/types/category/category";
import { Provider } from "../provider/provider";

export type Meal = {
  id: string;
  providerId: string;
  categoryId: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  cuisine: string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;

  provider?: Provider;
  category?: Category;
  reviews?: unknown[];
};
