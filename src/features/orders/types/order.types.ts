export type OrderStatus =
  | "DRAFT"
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "DELIVERED"
  | "CANCELLED"
  | string;

export type Order = {
  id: string;
  customerId?: string;
  providerId?: string;
  status?: OrderStatus;
  deliveryAddress?: string | null;
  phone?: string | null;
  note?: string | null;
  subTotal?: number;
  deliveryFee?: number;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
  items?: unknown[];
};

export type CreateOrderFromDraftsInput = {
  deliveryAddress: string;
  phone: string;
  note?: string;
  deliveryFee: number;
};
