import type { Metadata } from "next";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { PrivacyBadge } from "@/components/ui/badge";
import { VaultForm } from "@/components/forms/vault-form";
import { EmptyState } from "@/components/ui/empty-state";
import { getVaults } from "@/lib/data";

export const metadata: Metadata = { title: "Vaults" };

export default async function VaultsPage() {
  const vaults = await getVaults();
  return (
    <>
      <PageHeader title="Vaults" description="Flexible organizational containers. Records can still relate across vault boundaries." />
      <details className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]"><summary className="cursor-pointer font-bold">Create a vault</summary><div className="mt-5"><VaultForm /></div></details>
      {vaults.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{vaults.map((vault) => <Card key={vault.id}><CardHeader><div className="flex items-center gap-3"><span className="text-2xl" aria-hidden="true">{vault.icon || "🗂️"}</span><CardTitle>{vault.name}</CardTitle></div><PrivacyBadge value={vault.privacy_level} /></CardHeader><p className="text-sm leading-6 text-[var(--muted)]">{vault.description || "No description recorded."}</p></Card>)}</div> : <EmptyState title="No vaults" description="Your default vaults should be created when the owner account is provisioned." />}
    </>
  );
}
