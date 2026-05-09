import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { e2eTasks, useE2eFixtures } from "@/features/testing/e2e-fixtures";
import { validateTaskManifest } from "./schema";
import type { CommandTask, TaskManifest } from "./types";

const tasksPath = join(process.cwd(), "config", "tasks.local.json");

const defaultTasks: CommandTask[] = [
  {
    id: "create-local-task-list",
    title: "Create the private local task list",
    status: "todo",
    priority: "high",
    area: "operations",
    lane: "now",
    summary: "Use the local task file as the private source of truth while keeping only the public example shape committed.",
    nextAction: "Copy the shape from config/tasks.example.json into config/tasks.local.json and replace the sample task with real private work.",
    links: []
  }
];

export function getTasks(): TaskManifest {
  if (useE2eFixtures()) {
    return e2eTasks;
  }

  try {
    if (!existsSync(tasksPath)) {
      mkdirSync(dirname(tasksPath), { recursive: true });
      writeFileSync(tasksPath, `${JSON.stringify({ tasks: defaultTasks }, null, 2)}\n`);
    }

    const parsed = JSON.parse(readFileSync(tasksPath, "utf8"));
    const validation = validateTaskManifest(parsed);
    const tasks = validation.ok ? validation.tasks : defaultTasks;

    if (!validation.ok) {
      console.warn(`Task config validation failed for ${tasksPath}: ${validation.errors.length} error(s)`);
    }

    return {
      tasks,
      source: tasksPath,
      checkedAt: new Date().toISOString()
    };
  } catch (error) {
    console.warn(`Task config could not be loaded from ${tasksPath}:`, error);

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
