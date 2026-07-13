"use client";

import { useActionState } from "react";
import { createCaptureAction } from "@/actions/records";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";
import { CONFIDENTIALITY_LEVELS, RECORD_TYPES, humanize } from "@/lib/constants";
import { INITIAL_ACTION_STATE } from "@/types/domain";

export function CaptureForm({
  vaults,
  areas,
  projects,
}: {
  vaults: Array<{ id: string; name: string }>;
  areas: Array<{ id: string; title: string }>;
  projects: Array<{ id: string; title: string }>;
}) {
  const [state, action, pending] = useActionState(createCaptureAction, INITIAL_ACTION_STATE);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <FormMessage state={state} />
      <Field label="Capture" htmlFor="capture-content" error={state.fieldErrors?.content} className="sm:col-span-2">
        <Textarea id="capture-content" name="content" autoFocus required className="min-h-44" placeholder="Type or paste anything. It will land safely in your inbox for review." />
      </Field>
      <Field label="Optional title" htmlFor="capture-title" className="sm:col-span-2"><Input id="capture-title" name="title" /></Field>
      <Field label="Likely type" htmlFor="capture-type">
        <Select id="capture-type" name="proposed_record_type" defaultValue="note">
          {RECORD_TYPES.map((value) => <option key={value} value={value}>{humanize(value)}</option>)}
        </Select>
      </Field>
      <Field label="Optional due date" htmlFor="capture-due"><Input id="capture-due" name="due_date" type="date" /></Field>
      <Field label="Project" htmlFor="capture-project">
        <Select id="capture-project" name="project_id" defaultValue="">
          <option value="">Unassigned</option>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
        </Select>
      </Field>
      <Field label="Area" htmlFor="capture-area">
        <Select id="capture-area" name="area_id" defaultValue="">
          <option value="">Unassigned</option>
          {areas.map((area) => <option key={area.id} value={area.id}>{area.title}</option>)}
        </Select>
      </Field>
      <Field label="Vault" htmlFor="capture-vault">
        <Select id="capture-vault" name="vault_id" defaultValue="">
          <option value="">Unassigned</option>
          {vaults.map((vault) => <option key={vault.id} value={vault.id}>{vault.name}</option>)}
        </Select>
      </Field>
      <Field label="Confidentiality" htmlFor="capture-confidentiality">
        <Select id="capture-confidentiality" name="confidentiality" defaultValue="personal_private">
          {CONFIDENTIALITY_LEVELS.map((value) => <option key={value} value={value}>{humanize(value)}</option>)}
        </Select>
      </Field>
      <Field label="Tags" htmlFor="capture-tags" hint="Comma-separated"><Input id="capture-tags" name="tags" /></Field>
      <div className="self-end"><Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>{pending ? "Saving…" : "Save to inbox"}</Button></div>
    </form>
  );
}
