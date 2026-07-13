"use client";

import { useActionState } from "react";
import { createAreaAction } from "@/actions/records";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";
import { CONFIDENTIALITY_LEVELS, humanize } from "@/lib/constants";
import { INITIAL_ACTION_STATE } from "@/types/domain";

export function AreaForm({ vaults }: { vaults: Array<{ id: string; name: string }> }) {
  const [state, action, pending] = useActionState(createAreaAction, INITIAL_ACTION_STATE);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <FormMessage state={state} />
      <Field label="Area title" htmlFor="area-title" error={state.fieldErrors?.title} className="sm:col-span-2">
        <Input id="area-title" name="title" required />
      </Field>
      <Field label="Purpose" htmlFor="area-purpose" className="sm:col-span-2">
        <Textarea id="area-purpose" name="purpose" placeholder="What standard or responsibility does this area maintain?" />
      </Field>
      <Field label="Category" htmlFor="area-category">
        <Input id="area-category" name="category" placeholder="Work, personal, family…" />
      </Field>
      <Field label="Review frequency" htmlFor="area-review">
        <Input id="area-review" name="review_frequency" placeholder="Weekly, monthly, quarterly" />
      </Field>
      <Field label="Vault" htmlFor="area-vault">
        <Select id="area-vault" name="vault_id" defaultValue="">
          <option value="">No vault yet</option>
          {vaults.map((vault) => <option key={vault.id} value={vault.id}>{vault.name}</option>)}
        </Select>
      </Field>
      <Field label="Confidentiality" htmlFor="area-confidentiality">
        <Select id="area-confidentiality" name="confidentiality" defaultValue="personal_private">
          {CONFIDENTIALITY_LEVELS.map((value) => <option key={value} value={value}>{humanize(value)}</option>)}
        </Select>
      </Field>
      <div className="sm:col-span-2"><Button type="submit" disabled={pending}>{pending ? "Saving…" : "Create area"}</Button></div>
    </form>
  );
}
