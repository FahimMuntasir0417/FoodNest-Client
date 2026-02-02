import type { Provider } from "@/types/provider/provider";

export function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <div className="rounded-xl border p-4 space-y-2">
      <div className="font-semibold">{provider.shopName || "Unnamed shop"}</div>

      {provider.user && (
        <div className="text-sm text-muted-foreground">
          Owner: {provider.user.name} — {provider.user.email}
        </div>
      )}

      <div className="text-sm">
        {provider.address ? `📍 ${provider.address}` : "No address"}
      </div>

      <div className="text-sm">
        {provider.phone ? `📞 ${provider.phone}` : "No phone"}
      </div>
    </div>
  );
}
