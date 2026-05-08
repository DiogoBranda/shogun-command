export type TaskStatus = "todo" | "in_progress" | "blocked" | "done" | "idea";

export type TaskPriority = "critical" | "high" | "medium" | "low";

export type TaskArea =
  | "docs"
  | "agents"
  | "design"
  | "frontend"
  | "backend"
  | "security"
  | "operations"
  | "research"
  | "automation";

export type TaskLane = "now" | "next" | "later" | "ideas";

export type CommandTask = {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  area: TaskArea;
  lane: TaskLane;
  summary: string;
  nextAction: string;
  links?: { label: string; href: string }[];
};

export type TaskManifest = {
  tasks: CommandTask[];
  source: string;
  checkedAt: string;
};
