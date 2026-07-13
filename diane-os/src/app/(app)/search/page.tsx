import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { PrivacyBadge, StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { searchRecords } from "@/lib/data";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Search" };

const paths: Record<string, (id: string) => string> = {
  project: (id) => `/projects/${id}`,
  task: () => "/tasks",
  area: () => "/areas",
  vault: () => "/vaults",
  inbox_item: () => "/inbox",
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = await searchRecords(q);
  return (
    <>
      <PageHeader title="Search" description="Keyword and phrase search across Phase 1 records. Results explain the matching field." />
      <form className="mb-6 flex gap-2"><label className="relative flex-1"><span className="sr-only">Search query</span><Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]" /><input name="q" defaultValue={q} className="min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-11 pr-4" placeholder="Try: QIZ, health, waiting, knowledge centre…" /></label><button className="min-h-12 rounded-xl bg-[var(--accent-strong)] px-5 font-bold text-white">Search</button></form>
      {!q ? <EmptyState title="Search Diane OS" description="Enter at least two characters. Search works without AI and combines text fields with tag matches." /> : results.length ? <div className="space-y-3">{results.map((result) => { const href = paths[result.record_type]?.(result.record_id) ?? "/search"; return <Link key={`${result.record_type}-${result.record_id}`} href={href}><Card className="mb-3 hover:border-[var(--accent)]"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap gap-2"><StatusBadge value={result.record_type} /><PrivacyBadge value={result.confidentiality} /></div><h2 className="font-bold">{result.title}</h2><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{result.snippet}</p><p className="mt-3 text-xs font-semibold text-[var(--accent-strong)]">Why it matched: {result.reason}</p></div><time className="text-xs text-[var(--muted)]">{formatDateTime(result.updated_at)}</time></div></Card></Link>; })}</div> : <EmptyState title="No results" description={`Nothing matched “${q}”. Try fewer words or a related term.`} />}
    </>
  );
}
