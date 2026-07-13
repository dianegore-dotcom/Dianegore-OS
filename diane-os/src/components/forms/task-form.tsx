"use client";

import { useActionState } from "react";
import { createTaskAction } from "@/actions/records";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form-controls";
import { FormMessage } from "@/components/ui/form-message";
import { CONFIDENTIALITY_LEVELS, PRIORITIES, TASK_STATUSES, humanize } from "@/lib/constants";
import { INITIAL_ACTION_STATE } from "@/types/domain";

export function TaskForm({
  vaults,
  areas,
  projects,
  defaultProjectId,
}: {
  vaults: Array<{ id: string; name: string }>;
  areas: Array<{ id: string; title: string }>;
  projects: Array<{ id: string; title: string }>;
  defaultProjectId?: string;
}) {
  const [state, action, pending] = useActionState(createTaskAction, INITIAL_ACTION_STATE);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <FormMessage state={state} />
      <Field label="Task title" htmlFor="task-title" error={state.fieldErrors?.title} className="sm:col-span-2">
        <Input id="task-title" name="title" required />
      </Field>
      <Field label="Description" htmlFor="task-description" className="sm:col-span-2">
        <Textarea id="task-description" name="description" />
      </Field>
      <Field label="Status" htmlFor="task-status">
        <Select id="task-status" name="status" defaultValue="next">
          {TASK_STATUSES.map((value) => <option key={value} value={value}>{humanize(value)}</option>)}
        </Select>
      </Field>
      <Field label="Priority" htmlFor="task-priority">
        <Select id="task-priority" name="priority" defaultValue="medium">
          {PRIORITIES.map((value) => <option key={value} value={value}>{humanize(value)}</option>)}
        </Select>
      </Field>
      <Field label="Due date" htmlFor="task-due"><Input id="task-due" name="due_date" type="date" /></Field>
      <Field label="Follow-up date" htmlFor="task-follow-up"><Input id="task-follow-up" name="follow_up_date" type="date" /></Field>
      <Field label="Project" htmlFor="task-project">
        <Select id="task-project" name="project_id" defaultValue={defaultProjectId ?? ""}>
          <option value="">No project</option>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
        </Select>
      </Field>
      <Field label="Area" htmlFor="task-area">
        <Select id="task-area" name="area_id" defaultValue="">
          <option value="">No area</option>
          {areas.map((area) => <option key={area.id} value={area.id}>{area.title}</option>)}
        </Select>
      </Field>
      <Field label="Waiting on" htmlFor="task-waiting"><Input id="task-waiting" name="waiting_on_name" placeholder="Person or organization" /></Field>
      <Field label="Delegated to" htmlFor="task-delegated"><Input id="task-delegated" name="delegated_to_name" /></Field>
      <Field label="Vault" htmlFor="task-vault">
        <Select id="task-vault" name="vault_id" defaultValue="">
          <option value="">No vault</option>
          {vaults.map((vault) => <option key={vault.id} value={vault.id}>{vault.name}</option>)}
        </Select>
      </Field>
      <Field label="Confidentiality" htmlFor="task-confidentiality">
        <Select id="task-confidentiality" name="confidentiality" defaultValue="personal_private">
          {CONFIDENTIALITY_LEVELS.map((value) => <option key={value} value={value}>{humanize(value)}</option>)}
        </Select>
      </Field>
      <Field label="Tags" htmlFor="task-tags" hint="Comma-separated"><Input id="task-tags" name="tags" /></Field>
      <div className="pt-6"><Checkbox name="next_action" label="This is a next action" defaultChecked /></div>
      <div className="sm:col-span-2"><Button type="submit" disabled={pending}>{pending ? "Saving…" : "Create task"}</Button></div>
    </form>
  );
}
