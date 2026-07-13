import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  const allowSignUp = process.env.NEXT_PUBLIC_ALLOW_SIGN_UP === "true";
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-strong)] text-2xl font-bold text-white">D</span>
          <h1 className="text-3xl font-bold">Diane OS</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Your projects, knowledge, decisions, and next actions in one place.</p>
        </div>
        <Card className="p-6 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <LockKeyhole className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
            <div>
              <h2 className="font-bold">Private sign-in</h2>
              <p className="text-xs text-[var(--muted)]">Authentication is handled by your Supabase project.</p>
            </div>
          </div>
          <LoginForm allowSignUp={allowSignUp} />
        </Card>
      </div>
    </main>
  );
}
