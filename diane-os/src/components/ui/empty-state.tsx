import { Inbox } from "lucide-react";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center">
      <Inbox className="mx-auto mb-3 h-8 w-8 text-[var(--muted)]" aria-hidden="true" />
      <h2 className="font-bold">{title}</h2>
      <p className="mx-auto mt-1 max-w-lg text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}
