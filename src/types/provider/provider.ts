export type ProviderUserMini = {
  id: string;
  name: string;
  email: string;
  role: "PROVIDER" | string;
};

export type Provider = {
  id: string;
  userId: string;
  shopName: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
  user?: ProviderUserMini;
};
