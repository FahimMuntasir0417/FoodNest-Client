export interface ReviewInput {
  mealId: string;
  rating: number; // 1..5
  comment?: string;
}

export type CreateReviewInput = {
  mealId: string;
  rating: number; // 1..5
  comment?: string;
};
