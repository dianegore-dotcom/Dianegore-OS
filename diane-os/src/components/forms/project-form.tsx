"use client";

import { useActionState } from "react";
import { createProjectAction } from "@/actions/records";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";
import { CONFIDENTIALITY_LEVELS, PRIORITIES, PROJECT_HEALTH, PROJECT_STATUSES, humanize } from "@/lib/constants";
import { INITIAL_ACTION_STATE } from "@/types/domain";

export function ProjectForm({
  vaults,
  areas,
}: {
  vaults: Array<{ id: string; name: string }>;
  areas: Array<{ id: string; title: string }>;
}) {
  const [state, action, pending] = useActionState(createProjectAction, INITIAL_ACTION_STATE);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <FormMessage state={state} />
      <Field label="Project title" htmlFor="project-title" error={state.fieldErrors?.title} className="sm:col-span-2">
        <Input id="project-title" name="title" autoFocus required />
      </Field>
      <Field label="Desired outcome" htmlFor="desired-outcome" error={state.fieldErrors?.desired_outcome} className="sm:col-span-2">
        <Textarea id="desired-outcome" name="desired_outcome" placeholder="What will be true when this project is successful?" />
      </Field>
      <Field label="Description" htmlFor="project-description" error={state.fieldErrors?.description} className="sm:col-span-2">
        <Textarea id="project-description" name="description" />
      </Field>
      <Field label="Status" htmlFor="project-status">
        <Select id="project-status" name="status" defaultValue="planned">
          {PROJECT_STATUSES.map((value) => <option key={value} value={value}>{humanize(value)}</option>)}
        </Select>
      </Field>
      <Field label="Priority" htmlFor="project-priority">
        <Select id="project-priority" name="priority" defaultValue="medium">
          {PRIORITIES.map((value) => <option key={value} value={value}>{humanize(value)}</option>)}
        </Select>
      </Field>
      <Field label="Health" htmlFor="project-health">
        <Select id="project-health" name="health" defaultValue="unknown">
          {PROJECT_HEALTH.map((value) => <option key={value} value={value}>{humanize(value)}</option>)}
        </Select>
      </Field>
      <Field label="Target date" htmlFor="project-target">
        <Input id="project-target" name="target_date" type="date" />
      </Field>
      <Field label="Area" htmlFor="project-area">
        <Select id="project-area" name="area_id" defaultValue="">
          <option value="">No area yet</option>
          {areas.map((area) => <option key={area.id} value={area.id}>{area.title}</option>)}
        </Select>
      </Field>
      <Field label="Vault" htmlFor="project-vault">
        <Select id="project-vault" name="vault_id" defaultValue="">
          <option value="">No vault yet</option>
          {vaults.map((vault) => <option key={vault.id} value={vault.id}>{vault.name}</option>)}
        </Select>
      </Field>
      <Field label="Next action" htmlFor="project-next" className="sm:col-span-2">
        <Input id="project-next" name="next_action" placeholder="The single next physical action" />
      </Field>
      <Field label="Success criteria" htmlFor="project-success" className="sm:col-span-2">
        <Textarea id="project-success" name="success_criteria" />
      </Field>
      <Field label="Tags" htmlFor="project-tags" hint="Comma-separated. Example: CIT, SOP, 2026">
        <Input id="project-tags" name="tags" />
      </Field>
      <Field label="Confidentiality" htmlFor="project-confidentiality">
        <Select id="project-confidentiality" name="confidentiality" defaultValue="personal_private">
          {CONFIDENTIALITY_LEVELS.map((value) => <option key={value} value={value}>{humanize(value)}</option>)}
        </Select>
      </Field>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Create project"}</Button>
      </div>
    </form>
  );
}
