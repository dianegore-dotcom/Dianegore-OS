"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Command, Plus, Search, X } from "lucide-react";
import { primaryNav } from "@/components/layout/nav-items";

const commands = [
  { href: "/capture", label: "Quick capture", keywords: "new note idea task" },
  { href: "/projects#new", label: "Create project", keywords: "new project" },
  { href: "/tasks#new", label: "Create task", keywords: "new task" },
  { href: "/areas#new", label: "Create area", keywords: "new area" },
  ...primaryNav.map((item) => ({ href: item.href, label: `Open ${item.label}`, keywords: item.label })),
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return commands;
    return commands.filter((command) => `${command.label} ${command.keywords}`.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden min-h-11 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-semibold md:flex"
        aria-label="Open command palette"
      >
        <Command className="h-4 w-4" aria-hidden="true" />
        <span className="hidden xl:inline">Commands</span>
        <kbd className="rounded border border-[var(--border)] px-1.5 py-0.5 text-xs text-[var(--muted)]">⌘K</kbd>
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[10vh]" role="presentation" onMouseDown={() => setOpen(false)}>
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[var(--border)] p-3">
              <Search className="h-5 w-5 text-[var(--muted)]" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Type a command"
                className="min-h-11 flex-1 bg-transparent outline-none"
              />
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-[var(--surface-muted)]" aria-label="Close commands">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {results.length ? (
                results.map((command) => (
                  <Link
                    key={`${command.href}-${command.label}`}
                    href={command.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[var(--surface-muted)]"
                  >
                    <Plus className="h-4 w-4 text-[var(--muted)]" aria-hidden="true" />
                    {command.label}
                  </Link>
                ))
              ) : (
                <p className="p-6 text-center text-sm text-[var(--muted)]">No matching command.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
