export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type DashboardRole = "customer" | "provider" | "admin";

export type AuthSession = {
  expiresAt: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
  id: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
  phone: string | null;
  status: string;
  providerId?: string | null;
};

export type AuthResponse = {
  session: AuthSession;
  user: AuthUser;
};
