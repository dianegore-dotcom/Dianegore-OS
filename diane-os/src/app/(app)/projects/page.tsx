import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectCard } from "@/components/records/project-card";
import { ProjectForm } from "@/components/forms/project-form";
import { getFormOptions, getProjects } from "@/lib/data";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const [projects, options] = await Promise.all([getProjects(), getFormOptions()]);
  return (
    <>
      <PageHeader title="Projects" description="Defined outcomes that can eventually be completed. Keep the next action and health visible." />
      <details id="new" className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
        <summary className="cursor-pointer font-bold">Create a project</summary>
        <div className="mt-5"><ProjectForm vaults={options.vaults} areas={options.areas} /></div>
      </details>
      {projects.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <EmptyState title="No projects yet" description="Create the first work or personal project above." />}
    </>
  );
}
