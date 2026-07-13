"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[var(--shadow)]">
        <h1 className="text-2xl font-bold">Diane OS could not complete that request</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Your data may still be saved. It is safe to retry once. If the error continues, check the troubleshooting guide and Netlify or Supabase logs.</p>
        <Button className="mt-5" onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}
