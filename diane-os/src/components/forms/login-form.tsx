"use client";

import { useActionState } from "react";
import { authenticateAction } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";
import { INITIAL_ACTION_STATE } from "@/types/domain";

export function LoginForm({ allowSignUp }: { allowSignUp: boolean }) {
  const [state, action, pending] = useActionState(authenticateAction, INITIAL_ACTION_STATE);
  return (
    <form action={action} className="space-y-4">
      <FormMessage state={state} />
      <Field label="Email" htmlFor="email" error={state.fieldErrors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required autoFocus />
      </Field>
      <Field label="Password" htmlFor="password" error={state.fieldErrors?.password}>
        <Input id="password" name="password" type="password" autoComplete="current-password" minLength={8} required />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button type="submit" name="intent" value="login" size="lg" disabled={pending}>
          {pending ? "Working…" : "Sign in"}
        </Button>
        {allowSignUp ? (
          <Button type="submit" name="intent" value="signup" size="lg" variant="secondary" disabled={pending}>
            Create owner account
          </Button>
        ) : null}
      </div>
      {allowSignUp ? (
        <p className="text-xs leading-5 text-[var(--muted)]">
          After the owner account is created, set NEXT_PUBLIC_ALLOW_SIGN_UP to false in Netlify and redeploy.
        </p>
      ) : null}
    </form>
  );
}
