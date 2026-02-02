import { providersService } from "@/services/providers.service";
import type { Provider } from "@/types/provider/provider";
import { ProviderCard } from "./../../../lib/components/provider/ProviderCard";

export default async function Page() {
  const result = await providersService.getAll();
  const providers = result?.data as Provider[] | null;

  if (result?.error) return <div className="p-6">{result.error.message}</div>;
  if (!providers?.length) return <div className="p-6">No providers found</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Providers</h1>
      <div className="space-y-3">
        {providers.map((p) => (
          <ProviderCard key={p.id} provider={p} />
        ))}
      </div>
    </div>
  );
}
