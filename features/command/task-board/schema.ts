import type { CommandTask, TaskArea, TaskLane, TaskPriority, TaskStatus } from "./types";

export const taskStatuses = ["todo", "in_progress", "blocked", "done", "idea"] as const satisfies readonly TaskStatus[];
export const taskPriorities = ["critical", "high", "medium", "low"] as const satisfies readonly TaskPriority[];
export const taskAreas = ["docs", "agents", "design", "frontend", "backend", "security", "operations", "research", "automation"] as const satisfies readonly TaskArea[];
export const taskLanes = ["now", "next", "later", "ideas"] as const satisfies readonly TaskLane[];

type ValidationResult =
  | {
      ok: true;
      tasks: CommandTask[];
    }
  | {
      ok: false;
      errors: string[];
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function isOneOf<T extends readonly string[]>(value: unknown, allowed: T): value is T[number] {
  return typeof value === "string" && allowed.includes(value as T[number]);
}

function validateLinks(value: unknown, path: string, errors: string[]): { label: string; href: string }[] {
  if (value === undefined) return [];

  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array when present`);
    return [];
  }

  return value.flatMap((link, index) => {
    const linkPath = `${path}[${index}]`;
    if (!isRecord(link)) {
      errors.push(`${linkPath} must be an object`);
      return [];
    }

    if (!isString(link.label)) errors.push(`${linkPath}.label must be a non-empty string`);
    if (!isString(link.href)) errors.push(`${linkPath}.href must be a non-empty string`);

    if (!isString(link.label) || !isString(link.href)) return [];
    return [{ label: link.label as string, href: link.href as string }];
  });
}

export function validateTaskManifest(value: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return { ok: false, errors: ["manifest must be an object"] };
  }

  if (!Array.isArray(value.tasks)) {
    return { ok: false, errors: ["tasks must be an array"] };
  }

  const tasks = value.tasks.flatMap((task, index) => {
    const path = `tasks[${index}]`;
    if (!isRecord(task)) {
      errors.push(`${path} must be an object`);
      return [];
    }

    if (!isString(task.id)) errors.push(`${path}.id must be a non-empty string`);
    if (!isString(task.title)) errors.push(`${path}.title must be a non-empty string`);
    if (!isOneOf(task.status, taskStatuses)) errors.push(`${path}.status must be one of ${taskStatuses.join(", ")}`);
    if (!isOneOf(task.priority, taskPriorities)) errors.push(`${path}.priority must be one of ${taskPriorities.join(", ")}`);
    if (!isOneOf(task.area, taskAreas)) errors.push(`${path}.area must be one of ${taskAreas.join(", ")}`);
    if (!isOneOf(task.lane, taskLanes)) errors.push(`${path}.lane must be one of ${taskLanes.join(", ")}`);
    if (!isString(task.summary)) errors.push(`${path}.summary must be a non-empty string`);
    if (!isString(task.nextAction)) errors.push(`${path}.nextAction must be a non-empty string`);

    const links = validateLinks(task.links, `${path}.links`, errors);

    if (
      !isString(task.id) ||
      !isString(task.title) ||
      !isOneOf(task.status, taskStatuses) ||
      !isOneOf(task.priority, taskPriorities) ||
      !isOneOf(task.area, taskAreas) ||
      !isOneOf(task.lane, taskLanes) ||
      !isString(task.summary) ||
      !isString(task.nextAction)
    ) {
      return [];
    }

    const id = task.id as string;
    const title = task.title as string;
    const status = task.status;
    const priority = task.priority;
    const area = task.area;
    const lane = task.lane;
    const summary = task.summary as string;
    const nextAction = task.nextAction as string;

    return [
      {
        id,
        title,
        status,
        priority,
        area,
        lane,
        summary,
        nextAction,
        links
      }
    ];
  });

  if (errors.length) {
    return { ok: false, errors };
  }

  return { ok: true, tasks };
}
