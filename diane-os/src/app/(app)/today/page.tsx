import type { Metadata } from "next";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { TaskCard } from "@/components/records/task-card";
import { getDashboardData } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Today" };

export default async function TodayPage() {
  const data = await getDashboardData();
  const priorities = [...data.overdue, ...data.todayTasks].filter((task, index, all) => all.findIndex((candidate) => candidate.id === task.id) === index).slice(0, 3);
  return (
    <>
      <PageHeader title="Today" description={`${formatDate(data.today, { weekday: "long", month: "long", day: "numeric" })}. Keep this page focused on what must move now.`} />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Top three priorities</CardTitle></CardHeader>
            <div className="space-y-3">{priorities.length ? priorities.map((task) => <TaskCard key={task.id} task={task} />) : <EmptyState title="Choose today’s priorities" description="Mark tasks as next actions or add a due date of today." />}</div>
          </Card>
          <Card>
            <CardHeader><CardTitle>Other next actions</CardTitle></CardHeader>
            <div className="space-y-3">{data.todayTasks.slice(3).map((task) => <TaskCard key={task.id} task={task} compact />)}</div>
          </Card>
        </section>
        <section className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Waiting and follow-ups</CardTitle></CardHeader>
            <div className="space-y-3">{data.waiting.length ? data.waiting.map((task) => <TaskCard key={task.id} task={task} compact />) : <p className="text-sm text-[var(--muted)]">No waiting items need attention.</p>}</div>
          </Card>
          <Card>
            <CardHeader><CardTitle>End-of-day review</CardTitle></CardHeader>
            <ul className="space-y-2 text-sm leading-6 text-[var(--muted)]">
              <li>What did I complete?</li><li>What changed?</li><li>What is blocked?</li><li>What must move to tomorrow?</li><li>What should be delegated?</li><li>Was a decision made?</li>
            </ul>
          </Card>
        </section>
      </div>
    </>
  );
}
