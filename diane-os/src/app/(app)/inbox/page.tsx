import type { Metadata } from "next";
import { ArrowRight, Check, FolderKanban, ListTodo } from "lucide-react";
import { convertInboxItemAction, markInboxProcessedAction } from "@/actions/records";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { PrivacyBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getInboxItems } from "@/lib/data";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Inbox" };

export default async function InboxPage() {
  const items = await getInboxItems();
  return (
    <>
      <PageHeader title="Inbox and review queue" description="Fast captures remain here until you deliberately process, convert or defer them." />
      {items.length ? <div className="space-y-4">{items.map((item) => <Card key={item.id}><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap gap-2">{item.proposed_record_type ? <StatusBadge value={item.proposed_record_type} /> : null}<PrivacyBadge value={item.confidentiality} /></div><h2 className="font-bold">{item.title || "Untitled capture"}</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--muted)]">{item.content}</p><p className="mt-3 text-xs text-[var(--muted)]">Captured {formatDateTime(item.created_at)}</p></div><div className="flex shrink-0 flex-wrap gap-2 sm:max-w-48"><form action={convertInboxItemAction}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="target" value="task" /><Button type="submit" size="sm" variant="secondary"><ListTodo className="h-4 w-4" />Task</Button></form><form action={convertInboxItemAction}><input type="hidden" name="id" value={item.id} /><input type="hidden" name="target" value="project" /><Button type="submit" size="sm" variant="secondary"><FolderKanban className="h-4 w-4" />Project</Button></form><form action={markInboxProcessedAction}><input type="hidden" name="id" value={item.id} /><Button type="submit" size="sm" variant="ghost"><Check className="h-4 w-4" />Processed</Button></form></div></div></Card>)}</div> : <EmptyState title="Inbox is clear" description="New quick captures and future AI suggestions will appear here for review." />}
      <a href="/capture" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-strong)]">Capture something new <ArrowRight className="h-4 w-4" /></a>
    </>
  );
}
