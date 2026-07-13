"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireWorkspace } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import {
  areaSchema,
  captureSchema,
  projectSchema,
  taskSchema,
  vaultSchema,
} from "@/lib/validators/records";
import type { ActionState } from "@/types/domain";

function validationState(error: z.ZodError): ActionState {
  return {
    ok: false,
    message: "Please correct the highlighted fields.",
    fieldErrors: error.flatten().fieldErrors as Record<string, string[]>,
  };
}

function failureState(message: string): ActionState {
  return { ok: false, message };
}

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function logActivity(
  supabase: SupabaseServerClient,
  workspaceId: string,
  actorId: string,
  action: string,
  recordType: string,
  recordId: string,
  metadata: Record<string, unknown> = {},
) {
  const { error } = await supabase.from("activity_log").insert({
    workspace_id: workspaceId,
    actor_id: actorId,
    action,
    record_type: recordType,
    record_id: recordId,
    metadata,
  });
  if (error) console.error("Activity log failed", error.message);
}

async function attachTags(
  supabase: SupabaseServerClient,
  workspaceId: string,
  ownerId: string,
  recordType: string,
  recordId: string,
  rawTags: string | null,
) {
  const names = Array.from(
    new Set(
      (rawTags ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 20),
    ),
  );
  if (!names.length) return;

  const rows = names.map((name) => ({
    workspace_id: workspaceId,
    owner_id: ownerId,
    name,
    slug: slugify(name),
  }));

  const { data: tags, error: tagError } = await supabase
    .from("tags")
    .upsert(rows, { onConflict: "workspace_id,slug" })
    .select("id");
  if (tagError) throw new Error(`Tags could not be saved: ${tagError.message}`);

  const { error: linkError } = await supabase.from("record_tags").upsert(
    (tags ?? []).map((tag) => ({
      workspace_id: workspaceId,
      record_type: recordType,
      record_id: recordId,
      tag_id: tag.id,
    })),
    { onConflict: "record_type,record_id,tag_id", ignoreDuplicates: true },
  );
  if (linkError) throw new Error(`Tags could not be linked: ${linkError.message}`);
}

export async function createProjectAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = projectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationState(parsed.error);

  const { user, workspace } = await requireWorkspace();
  const supabase = await createClient();
  const { tags, ...project } = parsed.data;
  const { data, error } = await supabase
    .from("projects")
    .insert({ ...project, workspace_id: workspace.id, owner_id: user.id })
    .select("id")
    .single();

  if (error || !data) return failureState(`The project was not saved. ${error?.message ?? "Unknown error."}`);

  try {
    await attachTags(supabase, workspace.id, user.id, "project", data.id, tags);
    await logActivity(supabase, workspace.id, user.id, "created", "project", data.id);
  } catch (error) {
    console.error(error);
  }

  revalidatePath("/home");
  revalidatePath("/projects");
  redirect(`/projects/${data.id}`);
}

export async function createAreaAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = areaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationState(parsed.error);

  const { user, workspace } = await requireWorkspace();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("areas")
    .insert({ ...parsed.data, workspace_id: workspace.id, owner_id: user.id })
    .select("id")
    .single();
  if (error || !data) return failureState(`The area was not saved. ${error?.message ?? "Unknown error."}`);

  await logActivity(supabase, workspace.id, user.id, "created", "area", data.id);
  revalidatePath("/areas");
  revalidatePath("/home");
  redirect("/areas?created=1");
}

export async function createTaskAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = taskSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationState(parsed.error);

  const { user, workspace } = await requireWorkspace();
  const supabase = await createClient();
  const { tags, ...task } = parsed.data;
  const normalizedStatus = task.waiting_on_name && task.status === "next" ? "waiting" : task.status;
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      ...task,
      status: normalizedStatus,
      workspace_id: workspace.id,
      owner_id: user.id,
    })
    .select("id")
    .single();
  if (error || !data) return failureState(`The task was not saved. ${error?.message ?? "Unknown error."}`);

  try {
    await attachTags(supabase, workspace.id, user.id, "task", data.id, tags);
    await logActivity(supabase, workspace.id, user.id, "created", "task", data.id);
  } catch (error) {
    console.error(error);
  }

  revalidatePath("/tasks");
  revalidatePath("/today");
  revalidatePath("/home");
  if (task.project_id) revalidatePath(`/projects/${task.project_id}`);
  redirect(task.project_id ? `/projects/${task.project_id}?taskCreated=1` : "/tasks?created=1");
}

export async function createCaptureAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = captureSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationState(parsed.error);

  const { user, workspace } = await requireWorkspace();
  const supabase = await createClient();
  const { tags, ...capture } = parsed.data;
  const { data, error } = await supabase
    .from("inbox_items")
    .insert({
      ...capture,
      workspace_id: workspace.id,
      owner_id: user.id,
      status: "inbox",
      ai_processing_status: "not_requested",
    })
    .select("id")
    .single();
  if (error || !data) return failureState(`The capture was not saved. ${error?.message ?? "Unknown error."}`);

  try {
    await attachTags(supabase, workspace.id, user.id, "inbox_item", data.id, tags);
    await logActivity(supabase, workspace.id, user.id, "created", "inbox_item", data.id);
  } catch (error) {
    console.error(error);
  }

  revalidatePath("/inbox");
  revalidatePath("/home");
  redirect("/inbox?captured=1");
}

export async function createVaultAction(_state: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = vaultSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return validationState(parsed.error);

  const { user, workspace } = await requireWorkspace();
  const supabase = await createClient();
  const { count } = await supabase
    .from("vaults")
    .select("id", { head: true, count: "exact" })
    .eq("workspace_id", workspace.id);
  const { data, error } = await supabase
    .from("vaults")
    .insert({
      ...parsed.data,
      slug: slugify(parsed.data.name),
      position: count ?? 0,
      workspace_id: workspace.id,
      owner_id: user.id,
    })
    .select("id")
    .single();
  if (error || !data) return failureState(`The vault was not saved. ${error?.message ?? "Unknown error."}`);

  await logActivity(supabase, workspace.id, user.id, "created", "vault", data.id);
  revalidatePath("/vaults");
  redirect("/vaults?created=1");
}

export async function updateTaskStatusAction(formData: FormData) {
  const parsed = z
    .object({ id: z.uuid(), status: z.enum(["next", "in_progress", "waiting", "completed", "cancelled"]) })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const { user, workspace } = await requireWorkspace();
  const supabase = await createClient();
  const completedAt = parsed.data.status === "completed" ? new Date().toISOString() : null;
  const { error } = await supabase
    .from("tasks")
    .update({ status: parsed.data.status, completed_at: completedAt })
    .eq("workspace_id", workspace.id)
    .eq("id", parsed.data.id);
  if (error) throw new Error(`Task status could not be changed: ${error.message}`);

  await logActivity(supabase, workspace.id, user.id, "status_changed", "task", parsed.data.id, {
    status: parsed.data.status,
  });
  revalidatePath("/tasks");
  revalidatePath("/today");
  revalidatePath("/home");
  revalidatePath("/projects/[id]", "page");
}

export async function markInboxProcessedAction(formData: FormData) {
  const parsed = z.object({ id: z.uuid() }).safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const { user, workspace } = await requireWorkspace();
  const supabase = await createClient();
  const { error } = await supabase
    .from("inbox_items")
    .update({ status: "processed" })
    .eq("workspace_id", workspace.id)
    .eq("id", parsed.data.id);
  if (error) throw new Error(`Inbox item could not be updated: ${error.message}`);
  await logActivity(supabase, workspace.id, user.id, "processed", "inbox_item", parsed.data.id);
  revalidatePath("/inbox");
  revalidatePath("/home");
}

export async function convertInboxItemAction(formData: FormData) {
  const parsed = z
    .object({ id: z.uuid(), target: z.enum(["task", "project"]) })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  const { user, workspace } = await requireWorkspace();
  const supabase = await createClient();
  const { data: item, error: readError } = await supabase
    .from("inbox_items")
    .select("*")
    .eq("workspace_id", workspace.id)
    .eq("id", parsed.data.id)
    .single();
  if (readError || !item) throw new Error("The inbox item could not be loaded.");

  const title = item.title || item.content.replace(/\s+/g, " ").trim().slice(0, 120);
  let destination = "/inbox";

  if (parsed.data.target === "task") {
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        workspace_id: workspace.id,
        owner_id: user.id,
        title,
        description: item.content,
        status: "next",
        priority: "medium",
        due_date: item.due_date,
        vault_id: item.vault_id,
        project_id: item.project_id,
        area_id: item.area_id,
        confidentiality: item.confidentiality,
        source_inbox_item_id: item.id,
      })
      .select("id")
      .single();
    if (error || !data) throw new Error(`Task conversion failed: ${error?.message ?? "Unknown error."}`);
    destination = "/tasks?converted=1";
    await logActivity(supabase, workspace.id, user.id, "created_from_inbox", "task", data.id, { inbox_item_id: item.id });
  } else {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        workspace_id: workspace.id,
        owner_id: user.id,
        title,
        description: item.content,
        status: "planned",
        priority: "medium",
        health: "unknown",
        vault_id: item.vault_id,
        area_id: item.area_id,
        confidentiality: item.confidentiality,
        source_inbox_item_id: item.id,
      })
      .select("id")
      .single();
    if (error || !data) throw new Error(`Project conversion failed: ${error?.message ?? "Unknown error."}`);
    destination = `/projects/${data.id}?converted=1`;
    await logActivity(supabase, workspace.id, user.id, "created_from_inbox", "project", data.id, { inbox_item_id: item.id });
  }

  await supabase
    .from("inbox_items")
    .update({ status: "processed" })
    .eq("workspace_id", workspace.id)
    .eq("id", item.id);

  revalidatePath("/inbox");
  revalidatePath("/home");
  revalidatePath("/tasks");
  revalidatePath("/projects");
  redirect(destination);
}
