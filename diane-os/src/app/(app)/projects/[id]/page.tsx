import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, CheckCircle2, Target } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { PrivacyBadge, StatusBadge } from "@/components/ui/badge";
import { TaskCard } from "@/components/records/task-card";
import { TaskForm } from "@/components/forms/task-form";
import { getFormOptions, getProject } from "@/lib/data";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { project } = await getProject(id);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [{ project, tasks }, options] = await Promise.all([getProject(id), getFormOptions()]);
  if (!project) notFound();
  const completed = tasks.filter((task) => task.status === "completed").length;
  return (
    <>
      <PageHeader title={project.title} description={project.description ?? "No description recorded."} />
      <div className="mb-6 flex flex-wrap gap-2"><StatusBadge value={project.status} /><StatusBadge value={project.health} /><StatusBadge value={project.priority} /><PrivacyBadge value={project.confidentiality} /></div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Outcome and direction</CardTitle></CardHeader>
            <div className="space-y-5 text-sm leading-6">
              <Info icon={Target} label="Desired outcome" value={project.desired_outcome || "Not recorded"} />
              <Info icon={CheckCircle2} label="Success criteria" value={project.success_criteria || "Not recorded"} />
              <Info icon={CalendarDays} label="Next action" value={project.next_action || "No next action selected"} />
              <div className="grid gap-3 sm:grid-cols-2"><div><span className="block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Target date</span>{project.target_date ? formatDate(project.target_date) : "Not set"}</div><div><span className="block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Area</span>{project.areas?.title || "Unassigned"}</div></div>
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Tasks</CardTitle><span className="text-sm text-[var(--muted)]">{completed}/{tasks.length} completed</span></CardHeader>
            <div className="space-y-3">{tasks.length ? tasks.map((task) => <TaskCard key={task.id} task={task} />) : <p className="text-sm text-[var(--muted)]">No tasks are linked to this project.</p>}</div>
          </Card>
        </section>
        <section>
          <Card>
            <CardHeader><CardTitle>Add a project task</CardTitle></CardHeader>
            <TaskForm vaults={options.vaults} areas={options.areas} projects={options.projects} defaultProjectId={project.id} />
          </Card>
        </section>
      </div>
    </>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return <div className="flex gap-3"><Icon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" aria-hidden="true" /><div><span className="block text-xs font-bold uppercase tracking-wide text-[var(--muted)]">{label}</span><p>{value}</p></div></div>;
}
