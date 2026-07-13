import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, ArrowRight, CalendarClock, Inbox, Plus, TimerReset } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "@/components/records/task-card";
import { ProjectCard } from "@/components/records/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getDashboardData } from "@/lib/data";
import { formatDate, greeting } from "@/lib/format";
import { requireWorkspace } from "@/lib/auth";

export const metadata: Metadata = { title: "Home" };

export default async function HomePage() {
  const [data, context] = await Promise.all([getDashboardData(), requireWorkspace()]);
  return (
    <>
      <PageHeader
        title={`${greeting()}, ${context.user.displayName}`}
        description={`${formatDate(data.today, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}. Here is what needs your attention.`}
        action={<Link href="/capture" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--accent-strong)] px-4 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" />Quick capture</Link>}
      />

      <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Overview">
        <SummaryCard label="Open tasks" value={data.openTaskCount} icon={CalendarClock} href="/tasks" />
        <SummaryCard label="Overdue" value={data.overdue.length} icon={AlertTriangle} href="/tasks?view=overdue" urgent={data.overdue.length > 0} />
        <SummaryCard label="Waiting" value={data.waiting.length} icon={TimerReset} href="/tasks?view=waiting" />
        <SummaryCard label="Inbox" value={data.inboxCount} icon={Inbox} href="/inbox" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Today and next actions</CardTitle><Link href="/today" className="text-sm font-semibold text-[var(--accent-strong)]">Open Today</Link></CardHeader>
            <div className="space-y-3">
              {data.todayTasks.length ? data.todayTasks.map((task) => <TaskCard key={task.id} task={task} compact />) : <EmptyState title="No priorities selected" description="Create a task with today’s due date or mark it as a next action." />}
            </div>
          </Card>

          {data.overdue.length ? (
            <Card>
              <CardHeader><CardTitle>Overdue</CardTitle><Badge tone="danger">Needs attention</Badge></CardHeader>
              <div className="space-y-3">{data.overdue.map((task) => <TaskCard key={task.id} task={task} compact />)}</div>
            </Card>
          ) : null}
        </section>

        <section className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Waiting on others</CardTitle><Link href="/tasks?view=waiting" className="text-sm font-semibold text-[var(--accent-strong)]">View all</Link></CardHeader>
            <div className="space-y-3">
              {data.waiting.length ? data.waiting.slice(0, 5).map((task) => <TaskCard key={task.id} task={task} compact />) : <p className="text-sm text-[var(--muted)]">Nothing is currently marked as waiting.</p>}
            </div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Due soon</CardTitle><Link href="/tasks?view=week" className="text-sm font-semibold text-[var(--accent-strong)]">This week</Link></CardHeader>
            <div className="space-y-3">
              {data.dueSoon.length ? data.dueSoon.map((task) => <TaskCard key={task.id} task={task} compact />) : <p className="text-sm text-[var(--muted)]">No dated tasks are due in the next seven days.</p>}
            </div>
          </Card>
        </section>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-4"><h2 className="text-xl font-bold">Recently updated projects</h2><Link href="/projects" className="flex items-center gap-1 text-sm font-semibold text-[var(--accent-strong)]">All projects <ArrowRight className="h-4 w-4" /></Link></div>
        {data.projects.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.projects.slice(0, 6).map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <EmptyState title="No active projects" description="Create a work or personal project to begin organizing outcomes and next actions." />}
      </section>
    </>
  );
}

function SummaryCard({ label, value, icon: Icon, href, urgent = false }: { label: string; value: number; icon: typeof Inbox; href: string; urgent?: boolean }) {
  return (
    <Link href={href} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] hover:border-[var(--accent)]">
      <div className="flex items-center justify-between"><span className="text-sm font-semibold text-[var(--muted)]">{label}</span><Icon className={`h-5 w-5 ${urgent ? "text-[var(--danger)]" : "text-[var(--accent)]"}`} aria-hidden="true" /></div>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </Link>
  );
}
