export type ServiceError = {
  message: string;
  status?: number;
  detail?: unknown;
};

export type ServiceResult<T> = {
  data: T | null;
  error: ServiceError | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
