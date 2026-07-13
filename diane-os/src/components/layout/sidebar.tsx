import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { primaryNav } from "@/components/layout/nav-items";
import { SignOutButton } from "@/components/layout/sign-out-button";

export function Sidebar({ workspaceName }: { workspaceName: string }) {
  return (
    <aside className="app-scrollbar hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-[var(--border)] bg-[var(--surface)] p-4 lg:flex lg:flex-col">
      <Link href="/home" className="mb-6 flex items-center gap-3 rounded-xl px-2 py-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-strong)] text-lg font-bold text-white">D</span>
        <span>
          <span className="block font-bold">Diane OS</span>
          <span className="block max-w-40 truncate text-xs text-[var(--muted)]">{workspaceName}</span>
        </span>
      </Link>

      <Link
        href="/capture"
        className="mb-4 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--accent-strong)] px-4 py-2.5 text-sm font-bold text-white hover:opacity-90"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Quick capture
      </Link>

      <nav aria-label="Primary navigation" className="space-y-1">
        {primaryNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[var(--surface-muted)]"
          >
            <item.icon className="h-5 w-5 text-[var(--muted)]" aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <div className="mb-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3 text-xs text-[var(--muted)]">
          <div className="mb-1 flex items-center gap-2 font-bold text-[var(--foreground)]">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Phase 1 foundation
          </div>
          AI review and conversation import are intentionally held for the next secure increment.
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}
