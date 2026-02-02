export type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt: string;
};

export type CreateCategoryInput = {
  name: string;
  slug: string;
};
