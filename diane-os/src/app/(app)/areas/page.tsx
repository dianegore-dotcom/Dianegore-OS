import type { Metadata } from "next";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { PrivacyBadge } from "@/components/ui/badge";
import { AreaForm } from "@/components/forms/area-form";
import { EmptyState } from "@/components/ui/empty-state";
import { getAreas, getFormOptions } from "@/lib/data";

export const metadata: Metadata = { title: "Areas" };

export default async function AreasPage() {
  const [areas, options] = await Promise.all([getAreas(), getFormOptions()]);
  return (
    <>
      <PageHeader title="Areas" description="Ongoing responsibilities and standards that do not have a finish line." />
      <details id="new" className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]"><summary className="cursor-pointer font-bold">Create an area</summary><div className="mt-5"><AreaForm vaults={options.vaults} /></div></details>
      {areas.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{areas.map((area) => <Card key={area.id}><CardHeader><CardTitle>{area.title}</CardTitle><PrivacyBadge value={area.confidentiality} /></CardHeader><p className="text-sm leading-6 text-[var(--muted)]">{area.purpose || "No purpose recorded yet."}</p><div className="mt-4 text-xs text-[var(--muted)]"><span>{area.category || "Uncategorized"}</span>{area.review_frequency ? <span> · Review {area.review_frequency.toLowerCase()}</span> : null}</div></Card>)}</div> : <EmptyState title="No areas yet" description="Create ongoing areas such as CIT Management, Health, Family, Finances or Home." />}
    </>
  );
}
