import "server-only";
import { createClient } from "@/lib/supabase/server";
import { requireWorkspace } from "@/lib/auth";
import { addDaysIso, todayIso } from "@/lib/format";
import { OPEN_TASK_STATUSES } from "@/lib/constants";
import type { Area, InboxItem, Project, SearchResult, Task, Vault } from "@/types/domain";

function fail(error: { message: string } | null, context: string) {
  if (error) throw new Error(`${context}: ${error.message}`);
}

export async function getFormOptions() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();
  const [vaultsResult, areasResult, projectsResult] = await Promise.all([
    supabase
      .from("vaults")
      .select("id, name")
      .eq("workspace_id", workspace.id)
      .is("archived_at", null)
      .order("position"),
    supabase
      .from("areas")
      .select("id, title")
      .eq("workspace_id", workspace.id)
      .is("archived_at", null)
      .order("title"),
    supabase
      .from("projects")
      .select("id, title")
      .eq("workspace_id", workspace.id)
      .is("archived_at", null)
      .not("status", "in", "(completed,cancelled,archived)")
      .order("title"),
  ]);
  fail(vaultsResult.error, "Could not load vaults");
  fail(areasResult.error, "Could not load areas");
  fail(projectsResult.error, "Could not load projects");
  return {
    vaults: vaultsResult.data ?? [],
    areas: areasResult.data ?? [],
    projects: projectsResult.data ?? [],
  };
}

export async function getDashboardData() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();
  const [tasksResult, projectsResult, inboxResult] = await Promise.all([
    supabase
      .from("tasks")
      .select("*, projects(title), areas(title)")
      .eq("workspace_id", workspace.id)
      .is("archived_at", null)
      .order("updated_at", { ascending: false })
      .limit(250),
    supabase
      .from("projects")
      .select("*, vaults(name), areas(title)")
      .eq("workspace_id", workspace.id)
      .is("archived_at", null)
      .not("status", "in", "(completed,cancelled,archived)")
      .order("updated_at", { ascending: false })
      .limit(12),
    supabase
      .from("inbox_items")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspace.id)
      .eq("status", "inbox")
      .is("archived_at", null),
  ]);
  fail(tasksResult.error, "Could not load tasks");
  fail(projectsResult.error, "Could not load projects");
  fail(inboxResult.error, "Could not load inbox count");

  const tasks = (tasksResult.data ?? []) as unknown as Task[];
  const openTasks = tasks.filter((task) => OPEN_TASK_STATUSES.has(task.status));
  const today = todayIso();
  const dueSoonCutoff = addDaysIso(today, 7);
  const priorityWeight = { urgent: 5, high: 4, medium: 3, low: 2, none: 1 } as const;

  const overdue = openTasks
    .filter((task) => task.due_date && task.due_date < today)
    .sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""));
  const todayTasks = openTasks
    .filter((task) => task.due_date === today || task.next_action)
    .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
  const dueSoon = openTasks
    .filter((task) => task.due_date && task.due_date > today && task.due_date <= dueSoonCutoff)
    .sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""));
  const waiting = openTasks
    .filter((task) => task.status === "waiting" || Boolean(task.waiting_on_name))
    .sort((a, b) => (a.follow_up_date ?? "9999").localeCompare(b.follow_up_date ?? "9999"));

  return {
    today,
    todayTasks: todayTasks.slice(0, 8),
    overdue: overdue.slice(0, 8),
    dueSoon: dueSoon.slice(0, 8),
    waiting: waiting.slice(0, 8),
    projects: (projectsResult.data ?? []) as unknown as Project[],
    inboxCount: inboxResult.count ?? 0,
    openTaskCount: openTasks.length,
  };
}

export async function getProjects() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, vaults(name), areas(title)")
    .eq("workspace_id", workspace.id)
    .is("archived_at", null)
    .order("pinned", { ascending: false })
    .order("updated_at", { ascending: false });
  fail(error, "Could not load projects");
  return (data ?? []) as unknown as Project[];
}

export async function getProject(id: string) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();
  const [projectResult, tasksResult] = await Promise.all([
    supabase
      .from("projects")
      .select("*, vaults(name), areas(title)")
      .eq("workspace_id", workspace.id)
      .eq("id", id)
      .is("archived_at", null)
      .maybeSingle(),
    supabase
      .from("tasks")
      .select("*, projects(title), areas(title)")
      .eq("workspace_id", workspace.id)
      .eq("project_id", id)
      .is("archived_at", null)
      .order("completed_at", { ascending: true, nullsFirst: true })
      .order("due_date", { ascending: true, nullsFirst: false }),
  ]);
  fail(projectResult.error, "Could not load project");
  fail(tasksResult.error, "Could not load project tasks");
  return {
    project: projectResult.data as unknown as Project | null,
    tasks: (tasksResult.data ?? []) as unknown as Task[],
  };
}

export async function getAreas() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("areas")
    .select("*")
    .eq("workspace_id", workspace.id)
    .is("archived_at", null)
    .order("title");
  fail(error, "Could not load areas");
  return (data ?? []) as unknown as Area[];
}

export async function getTasks() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*, projects(title), areas(title)")
    .eq("workspace_id", workspace.id)
    .is("archived_at", null)
    .order("completed_at", { ascending: true, nullsFirst: true })
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });
  fail(error, "Could not load tasks");
  return (data ?? []) as unknown as Task[];
}

export async function getVaults() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vaults")
    .select("*")
    .eq("workspace_id", workspace.id)
    .is("archived_at", null)
    .order("position")
    .order("name");
  fail(error, "Could not load vaults");
  return (data ?? []) as unknown as Vault[];
}

export async function getInboxItems() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inbox_items")
    .select("*")
    .eq("workspace_id", workspace.id)
    .eq("status", "inbox")
    .is("archived_at", null)
    .order("created_at", { ascending: false });
  fail(error, "Could not load inbox");
  return (data ?? []) as unknown as InboxItem[];
}

export async function searchRecords(query: string) {
  const { workspace } = await requireWorkspace();
  if (query.trim().length < 2) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_records", {
    p_workspace_id: workspace.id,
    p_query: query.trim(),
    p_limit: 60,
  });
  fail(error, "Search failed");
  return (data ?? []) as unknown as SearchResult[];
}
