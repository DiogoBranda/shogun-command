import { ArrowUpRight, CheckCircle2, CircleDot, ListChecks, PauseCircle, ShieldAlert } from "lucide-react";
import { Panel, SectionLabel, StatusPill } from "@/components/ui/panel";
import { getTasks } from "@/features/command/task-board/server";
import type { CommandTask, TaskLane, TaskPriority, TaskStatus } from "@/features/command/task-board/types";

const lanes: { id: TaskLane; label: string; description: string }[] = [
  { id: "now", label: "Now", description: "The active queue that should shape the next few sessions." },
  { id: "next", label: "Next", description: "Important work that becomes active after the current queue moves." },
  { id: "later", label: "Later", description: "Useful project hardening that should not interrupt the current flow." },
  { id: "ideas", label: "Ideas", description: "Promising directions that still need shaping before execution." }
];

const priorityTone: Record<TaskPriority, "danger" | "amber" | "blue" | "mint"> = {
  critical: "danger",
  high: "amber",
  medium: "blue",
  low: "mint"
};

const statusIcon: Record<TaskStatus, typeof CircleDot> = {
  todo: CircleDot,
  in_progress: ListChecks,
  blocked: ShieldAlert,
  done: CheckCircle2,
  idea: PauseCircle
};

function niceLabel(value: string) {
  return value.replaceAll("_", " ");
}

function formatCheckedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date(value));
}

function TaskCard({ task }: { task: CommandTask }) {
  const Icon = statusIcon[task.status];

  return (
    <Panel tone={priorityTone[task.priority]} className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-slate-400">
            <Icon className="h-4 w-4 text-bridge-bright" />
            {niceLabel(task.area)}
          </div>
          <h3 className="mt-2 text-2xl font-black text-white">{task.title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={niceLabel(task.status)} status={task.status === "blocked" ? "critical" : task.status === "done" ? "online" : "unknown"} />
          <StatusPill label={task.priority} status={task.priority === "critical" ? "critical" : task.priority === "high" ? "warning" : "online"} />
        </div>
      </div>

      <p className="text-sm leading-6 text-slate-300">{task.summary}</p>

      <div className="rounded border border-white/10 bg-black/20 px-4 py-3">
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-bridge-violet">Next Action</div>
        <p className="mt-2 text-sm text-slate-200">{task.nextAction}</p>
      </div>

      {task.links?.length ? (
        <div className="flex flex-wrap gap-2">
          {task.links.map((link) => (
            <a
              href={link.href}
              key={`${task.id}-${link.href}`}
              rel="noreferrer"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded border border-bridge-line bg-white/5 px-3 py-1.5 text-xs font-bold uppercase text-slate-300 transition hover:border-bridge-bright hover:text-white"
            >
              {link.label}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ))}
        </div>
      ) : null}
    </Panel>
  );
}

export function TaskBoardPage() {
  const manifest = getTasks();
  const counts = {
    total: manifest.tasks.length,
    active: manifest.tasks.filter((task) => task.lane === "now").length,
    blocked: manifest.tasks.filter((task) => task.status === "blocked").length,
    done: manifest.tasks.filter((task) => task.status === "done").length
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-4 border-b border-bridge-line/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <SectionLabel>Work Queue</SectionLabel>
          <h1 className="mt-3 flex items-center gap-3 text-4xl font-black text-white md:text-5xl">
            <ListChecks className="h-9 w-9 text-bridge-bright" />
            Tasks
          </h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Private roadmap for Shogun Command, Pi agents, documentation, and remote operations.
          </p>
          <p className="mt-2 text-xs uppercase text-slate-500">Updated {formatCheckedAt(manifest.checkedAt)}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
          <div className="rounded border border-white/10 bg-black/20 px-4 py-3">
            <div className="text-2xl font-black text-white">{counts.total}</div>
            <div className="text-xs uppercase text-slate-400">Total</div>
          </div>
          <div className="rounded border border-white/10 bg-black/20 px-4 py-3">
            <div className="text-2xl font-black text-bridge-mint">{counts.active}</div>
            <div className="text-xs uppercase text-slate-400">Now</div>
          </div>
          <div className="rounded border border-white/10 bg-black/20 px-4 py-3">
            <div className="text-2xl font-black text-bridge-amber">{counts.blocked}</div>
            <div className="text-xs uppercase text-slate-400">Blocked</div>
          </div>
          <div className="rounded border border-white/10 bg-black/20 px-4 py-3">
            <div className="text-2xl font-black text-bridge-bright">{counts.done}</div>
            <div className="text-xs uppercase text-slate-400">Done</div>
          </div>
        </div>
      </header>

      {lanes.map((lane) => {
        const tasks = manifest.tasks.filter((task) => task.lane === lane.id);

        return (
          <section key={lane.id} className="space-y-4">
            <div className="flex flex-col gap-2 border-b border-bridge-line/40 pb-3 md:flex-row md:items-end md:justify-between">
              <div>
                <SectionLabel>{lane.label}</SectionLabel>
                <p className="mt-1 text-sm text-slate-400">{lane.description}</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{tasks.length} tasks</span>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </section>
        );
      })}

      <p className="break-all text-xs text-slate-500">Task source: {manifest.source}</p>
    </div>
  );
}
