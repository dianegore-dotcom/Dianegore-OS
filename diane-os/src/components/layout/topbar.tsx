import Link from "next/link";
import { Command, Plus, Search } from "lucide-react";
import { CommandPalette } from "@/components/layout/command-palette";

export function Topbar({ displayName }: { displayName: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_90%,transparent)] px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        <Link href="/home" className="flex items-center gap-2 font-bold lg:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-strong)] text-white">D</span>
          <span className="hidden sm:inline">Diane OS</span>
        </Link>
        <form action="/search" className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" aria-hidden="true" />
          <input
            name="q"
            type="search"
            aria-label="Search Diane OS"
            placeholder="Search projects, tasks, areas, vaults and captures"
            className="min-h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 text-sm"
          />
        </form>
        <CommandPalette />
        <Link
          href="/capture"
          className="hidden min-h-11 items-center gap-2 rounded-xl bg-[var(--accent-strong)] px-4 text-sm font-bold text-white sm:flex"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Capture
        </Link>
        <span className="hidden max-w-32 truncate text-sm font-semibold xl:inline">{displayName}</span>
        <span className="sr-only">Press Command K to open commands</span>
        <Command className="hidden h-4 w-4 text-[var(--muted)]" aria-hidden="true" />
      </div>
    </header>
  );
}
