import { LogOut } from "lucide-react";
import { signOutAction } from "@/actions/auth";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-[var(--surface-muted)]">
        <LogOut className="h-5 w-5 text-[var(--muted)]" aria-hidden="true" />
        Sign out
      </button>
    </form>
  );
}
