import Link from "next/link";

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center p-6"><div className="text-center"><h1 className="text-3xl font-bold">Record not found</h1><p className="mt-2 text-[var(--muted)]">It may have been archived, removed, or you may not have access.</p><Link href="/home" className="mt-5 inline-block font-semibold text-[var(--accent-strong)]">Return home</Link></div></main>;
}
