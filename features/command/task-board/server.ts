import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import type { CommandTask, TaskManifest } from "./types";

const tasksPath = join(process.cwd(), "config", "tasks.local.json");

const defaultTasks: CommandTask[] = [
  {
    id: "task-schema-process",
    title: "Define the task schema and upkeep process",
    status: "in_progress",
    priority: "critical",
    area: "operations",
    lane: "now",
    summary: "Make this task page the private source of truth for the work queue without exposing private notes in the public repo.",
    nextAction: "Use config/tasks.local.json for real tasks and keep config/tasks.example.json as the public shape.",
    links: []
  }
];

function sanitizeTask(task: CommandTask): CommandTask {
  return {
    ...task,
    links: task.links ?? []
  };
}

export function getTasks(): TaskManifest {
  try {
    if (!existsSync(tasksPath)) {
      mkdirSync(dirname(tasksPath), { recursive: true });
      writeFileSync(tasksPath, `${JSON.stringify({ tasks: defaultTasks }, null, 2)}\n`);
    }

    const parsed = JSON.parse(readFileSync(tasksPath, "utf8")) as { tasks?: CommandTask[] };
    const tasks = Array.isArray(parsed.tasks) ? parsed.tasks.map(sanitizeTask) : defaultTasks;

    return {
      tasks,
      source: tasksPath,
      checkedAt: new Date().toISOString()
    };
  } catch {
    return {
      tasks: defaultTasks,
      source: tasksPath,
      checkedAt: new Date().toISOString()
    };
  }
}

export function getTasksPath() {
  return tasksPath;
}
