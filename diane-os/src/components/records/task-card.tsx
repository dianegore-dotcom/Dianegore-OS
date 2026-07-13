import Link from "next/link";
import { ArrowRight, Check, Clock3, UserRound } from "lucide-react";
import { updateTaskStatusAction } from "@/actions/records";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { Task } from "@/types/domain";

export function TaskCard({ task, compact = false }: { task: Task; compact?: boolean }) {
  const complete = task.status === "completed";
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start gap-3">
        <form action={updateTaskStatusAction}>
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="status" value={complete ? "next" : "completed"} />
          <button
            className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] hover:bg-[var(--surface-muted)]"
            aria-label={complete ? `Reopen ${task.title}` : `Complete ${task.title}`}
          >
            {complete ? <Check className="h-4 w-4 text-[var(--success)]" aria-hidden="true" /> : null}
          </button>
        </form>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className={`font-semibold ${complete ? "text-[var(--muted)] line-through" : ""}`}>{task.title}</h3>
            <div className="flex flex-wrap gap-1.5"><StatusBadge value={task.status} /><StatusBadge value={task.priority} /></div>
          </div>
          {!compact && task.description ? <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{task.description}</p> : null}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--muted)]">
            {task.due_date ? <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />Due {formatDate(task.due_date)}</span> : null}
            {task.waiting_on_name ? <span className="flex items-center gap-1.5"><UserRound className="h-3.5 w-3.5" aria-hidden="true" />Waiting on {task.waiting_on_name}</span> : null}
            {task.delegated_to_name ? <span>Delegated to {task.delegated_to_name}</span> : null}
            {task.projects?.title && task.project_id ? <Link href={`/projects/${task.project_id}`} className="font-semibold text-[var(--accent-strong)] hover:underline">{task.projects.title}</Link> : null}
            {task.areas?.title ? <Badge>{task.areas.title}</Badge> : null}
          </div>
          {!complete && task.status !== "in_progress" ? (
            <form action={updateTaskStatusAction} className="mt-3">
              <input type="hidden" name="id" value={task.id} />
              <input type="hidden" name="status" value="in_progress" />
              <Button variant="ghost" size="sm" type="submit"><ArrowRight className="h-4 w-4" aria-hidden="true" />Start</Button>
            </form>
          ) : null}
        </div>
      </div>
    </article>
  );
}
