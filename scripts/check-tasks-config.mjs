import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cwd, exit } from "node:process";

const taskStatuses = ["todo", "in_progress", "blocked", "done", "idea"];
const taskPriorities = ["critical", "high", "medium", "low"];
const taskAreas = ["docs", "agents", "design", "frontend", "backend", "security", "operations", "research", "automation"];
const taskLanes = ["now", "next", "later", "ideas"];

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateLinks(value, path, errors) {
  if (value === undefined) return;

  if (!Array.isArray(value)) {
    errors.push(`${path} must be an array when present`);
    return;
  }

  value.forEach((link, index) => {
    const linkPath = `${path}[${index}]`;
    if (!isRecord(link)) {
      errors.push(`${linkPath} must be an object`);
      return;
    }

    if (!isString(link.label)) errors.push(`${linkPath}.label must be a non-empty string`);
    if (!isString(link.href)) errors.push(`${linkPath}.href must be a non-empty string`);
  });
}

function validateManifest(value) {
  const errors = [];

  if (!isRecord(value)) {
    return ["manifest must be an object"];
  }

  if (!Array.isArray(value.tasks)) {
    return ["tasks must be an array"];
  }

  const ids = new Set();

  value.tasks.forEach((task, index) => {
    const path = `tasks[${index}]`;
    if (!isRecord(task)) {
      errors.push(`${path} must be an object`);
      return;
    }

    if (!isString(task.id)) {
      errors.push(`${path}.id must be a non-empty string`);
    } else if (ids.has(task.id)) {
      errors.push(`${path}.id must be unique`);
    } else {
      ids.add(task.id);
    }

    if (!isString(task.title)) errors.push(`${path}.title must be a non-empty string`);
    if (!taskStatuses.includes(task.status)) errors.push(`${path}.status must be one of ${taskStatuses.join(", ")}`);
    if (!taskPriorities.includes(task.priority)) errors.push(`${path}.priority must be one of ${taskPriorities.join(", ")}`);
    if (!taskAreas.includes(task.area)) errors.push(`${path}.area must be one of ${taskAreas.join(", ")}`);
    if (!taskLanes.includes(task.lane)) errors.push(`${path}.lane must be one of ${taskLanes.join(", ")}`);
    if (!isString(task.summary)) errors.push(`${path}.summary must be a non-empty string`);
    if (!isString(task.nextAction)) errors.push(`${path}.nextAction must be a non-empty string`);
    validateLinks(task.links, `${path}.links`, errors);
  });

  return errors;
}

function checkFile(path, required) {
  if (!existsSync(path)) {
    if (required) return [`${path} is missing`];
    console.log(`Skipped optional task config: ${path}`);
    return [];
  }

  try {
    const parsed = JSON.parse(readFileSync(path, "utf8"));
    const errors = validateManifest(parsed);
    if (errors.length) return errors.map((error) => `${path}: ${error}`);

    console.log(`Validated task config: ${path}`);
    return [];
  } catch (error) {
    return [`${path}: ${(error && error.message) || "could not be parsed"}`];
  }
}

const root = cwd();
const errors = [
  ...checkFile(join(root, "config", "tasks.example.json"), true),
  ...checkFile(join(root, "config", "tasks.local.json"), false)
];

if (errors.length) {
  console.error(`Task config check failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  exit(1);
}

console.log("Task config check passed.");
