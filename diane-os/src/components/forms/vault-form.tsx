"use client";

import { useActionState } from "react";
import { createVaultAction } from "@/actions/records";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";
import { CONFIDENTIALITY_LEVELS, humanize } from "@/lib/constants";
import { INITIAL_ACTION_STATE } from "@/types/domain";

export function VaultForm() {
  const [state, action, pending] = useActionState(createVaultAction, INITIAL_ACTION_STATE);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <FormMessage state={state} />
      <Field label="Vault name" htmlFor="vault-name" error={state.fieldErrors?.name}><Input id="vault-name" name="name" required /></Field>
      <Field label="Icon" htmlFor="vault-icon" hint="One emoji works well"><Input id="vault-icon" name="icon" maxLength={12} /></Field>
      <Field label="Description" htmlFor="vault-description" className="sm:col-span-2"><Textarea id="vault-description" name="description" /></Field>
      <Field label="Default privacy" htmlFor="vault-privacy">
        <Select id="vault-privacy" name="privacy_level" defaultValue="personal_private">
          {CONFIDENTIALITY_LEVELS.map((value) => <option key={value} value={value}>{humanize(value)}</option>)}
        </Select>
      </Field>
      <div className="self-end"><Button type="submit" disabled={pending}>{pending ? "Saving…" : "Create vault"}</Button></div>
    </form>
  );
}
