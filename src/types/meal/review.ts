// src/types/meal/review.ts
export type ReviewCustomer = {
  id: string;
  name: string;
};

export type Review = {
  id: string;
  customerId: string;
  mealId: string;
  rating: number; // 1..5
  comment: string | null;
  createdAt: string;
  customer: ReviewCustomer;
};
