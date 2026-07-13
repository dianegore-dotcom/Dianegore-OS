import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { PrivacyBadge, StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { compactText } from "@/lib/utils";
import type { Project } from "@/types/domain";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.id}`} className="group block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] hover:border-[var(--accent)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-bold group-hover:text-[var(--accent-strong)]">{project.title}</h2>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{compactText(project.desired_outcome || project.description, 150) || "No outcome recorded yet."}</p>
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--muted)]" aria-hidden="true" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge value={project.status} />
        <StatusBadge value={project.health} />
        <StatusBadge value={project.priority} />
        <PrivacyBadge value={project.confidentiality} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--muted)]">
        {project.target_date ? <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />Target {formatDate(project.target_date)}</span> : null}
        {project.areas?.title ? <span>{project.areas.title}</span> : null}
        {project.vaults?.name ? <span>{project.vaults.name}</span> : null}
      </div>
    </Link>
  );
}
