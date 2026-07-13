import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { TaskForm } from "@/components/forms/task-form";
import { TaskCard } from "@/components/records/task-card";
import { EmptyState } from "@/components/ui/empty-state";
import { getFormOptions, getTasks } from "@/lib/data";
import { addDaysIso, todayIso } from "@/lib/format";

export const metadata: Metadata = { title: "Tasks" };

export default async function TasksPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const [{ view = "open" }, tasks, options] = await Promise.all([searchParams, getTasks(), getFormOptions()]);
  const today = todayIso();
  const week = addDaysIso(today, 7);
  const filtered = tasks.filter((task) => {
    if (view === "overdue") return Boolean(task.due_date && task.due_date < today && task.status !== "completed" && task.status !== "cancelled");
    if (view === "waiting") return task.status === "waiting" || Boolean(task.waiting_on_name);
    if (view === "completed") return task.status === "completed";
    if (view === "week") return Boolean(task.due_date && task.due_date >= today && task.due_date <= week && task.status !== "completed");
    return task.status !== "completed" && task.status !== "cancelled";
  });
  return (
    <>
      <PageHeader title="Tasks" description="Next actions, scheduled work, delegated items and waiting follow-ups." />
      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Task views">{[["open","Open"],["overdue","Overdue"],["week","This week"],["waiting","Waiting"],["completed","Completed"]].map(([key,label]) => <a key={key} href={`/tasks?view=${key}`} className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${view===key ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-[var(--surface)]"}`}>{label}</a>)}</nav>
      <details id="new" className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]"><summary className="cursor-pointer font-bold">Create a task</summary><div className="mt-5"><TaskForm vaults={options.vaults} areas={options.areas} projects={options.projects} /></div></details>
      <Card><div className="space-y-3">{filtered.length ? filtered.map((task) => <TaskCard key={task.id} task={task} />) : <EmptyState title="No tasks in this view" description="Change the task view or create a new task above." />}</div></Card>
    </>
  );
}
