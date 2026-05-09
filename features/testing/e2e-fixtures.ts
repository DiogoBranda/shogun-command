import type { TeamManifest } from "@/features/command/team-roster/types";
import type { TaskManifest } from "@/features/command/task-board/types";
import type { ServiceState, SystemHealth } from "@/features/operations/system-health/types";
import type { WorkspaceDiscovery } from "@/features/operations/workspace-discovery/types";

export function useE2eFixtures() {
  return process.env.E2E_UI_FIXTURES === "true";
}

export const e2eSystemHealth: SystemHealth = {
  hostname: "homelab",
  platform: "linux",
  arch: "arm64",
  uptimeSeconds: 583200,
  loadAverage: [0, 0, 0],
  cpuCount: 4,
  memory: {
    total: 4_000_000_000,
    free: 3_384_000_000,
    used: 616_000_000,
    usedPercent: 15.4
  },
  disk: {
    filesystem: "/dev/root",
    size: "15G",
    used: "4.4G",
    available: "9.1G",
    usedPercent: 33,
    mount: "/"
  },
  temperatureC: 43.3,
  status: "online",
  notices: [],
  checkedAt: "2026-05-08T20:49:05.000Z"
};

export const e2eServices: ServiceState[] = [
  { name: "nginx", active: true, state: "active", detail: "Service is running" },
  { name: "cloudflared", active: true, state: "active", detail: "Service is running" },
  { name: "shogun-command", active: true, state: "active", detail: "Service is running" }
];

export const e2eWorkspace: WorkspaceDiscovery = {
  roots: [
    {
      label: "Home",
      path: "/home/homelab",
      exists: true,
      type: "directory",
      files: 7,
      bytes: 21504,
      modifiedAt: "2026-05-08T20:00:00.000Z"
    },
    {
      label: "OpenClaw",
      path: "/home/homelab/.openclaw",
      exists: false,
      type: "missing",
      files: 0,
      bytes: 0,
      modifiedAt: null
    },
    {
      label: "Memory",
      path: "/home/homelab/memory",
      exists: false,
      type: "missing",
      files: 0,
      bytes: 0,
      modifiedAt: null
    },
    {
      label: "Workspace",
      path: "/home/homelab/workspace",
      exists: false,
      type: "missing",
      files: 0,
      bytes: 0,
      modifiedAt: null
    },
    {
      label: "Repos",
      path: "/home/homelab/repos",
      exists: false,
      type: "missing",
      files: 0,
      bytes: 0,
      modifiedAt: null
    }
  ],
  candidates: [],
  summaries: {
    memoryFiles: 0,
    agentFiles: 0,
    projectDocs: 0,
    taskFiles: 1
  },
  checkedAt: "2026-05-08T20:49:05.000Z"
};

export const e2eTeam: TeamManifest = {
  mission:
    "Build a personal command system that keeps Diogo informed, organized, and operational by coordinating specialist agents over real local files and machine state.",
  commander: {
    id: "supreme-commander",
    name: "Diogo",
    rank: "Supreme Commander",
    branch: "Command",
    role: "Final intent, approval, and mission direction.",
    status: "online",
    cadence: "Human command",
    callsign: "SHOGUN",
    color: "amber"
  },
  chiefOfStaff: {
    id: "chief-of-staff",
    name: "Inky",
    rank: "Chief of Staff",
    branch: "Command",
    role: "Coordinates branches, routes requests, consolidates state, and keeps the operation coherent.",
    status: "online",
    cadence: "Always on",
    model: "Codex target pending discovery",
    callsign: "INKY",
    color: "violet"
  },
  branches: [
    {
      id: "intel",
      name: "Scout",
      rank: "Intelligence Officer",
      branch: "Intelligence",
      role: "Watches news, markets, and external signals.",
      status: "unknown",
      cadence: "Source discovery pending",
      callsign: "EYES",
      color: "blue"
    },
    {
      id: "engineering",
      name: "Forge",
      rank: "Engineering Lead",
      branch: "Engineering",
      role: "Maintains code, deploys tools, and coordinates coding work.",
      status: "unknown",
      cadence: "On demand",
      callsign: "FORGE",
      color: "mint"
    },
    {
      id: "logistics",
      name: "Quartermaster",
      rank: "Logistics Officer",
      branch: "Logistics",
      role: "Tracks schedules, tasks, docs, and operational inventory.",
      status: "unknown",
      cadence: "Source discovery pending",
      callsign: "SUPPLY",
      color: "amber"
    },
    {
      id: "home-ops",
      name: "Lantern",
      rank: "Home-Ops Specialist",
      branch: "Home-Ops",
      role: "Prepares home automation and machine health workflows.",
      status: "unknown",
      cadence: "On demand",
      callsign: "BASE",
      color: "red"
    }
  ],
  source: "e2e fixture",
  checkedAt: "2026-05-08T20:49:05.000Z"
};

export const e2eTasks: TaskManifest = {
  tasks: [
    {
      id: "e2e-task-now",
      title: "Validate task board schema",
      status: "in_progress",
      priority: "critical",
      area: "operations",
      lane: "now",
      summary: "Exercise the private task-board manifest shape with deterministic UI data.",
      nextAction: "Run the task config check before deploying.",
      links: [
        {
          label: "Task docs",
          href: "/docs/features/command/task-board/"
        }
      ]
    },
    {
      id: "e2e-task-next",
      title: "Review public task example",
      status: "todo",
      priority: "high",
      area: "docs",
      lane: "next",
      summary: "Confirm the public example remains sanitized and useful.",
      nextAction: "Compare the example file with the documented schema.",
      links: []
    },
    {
      id: "e2e-task-blocked",
      title: "Resolve deployment credentials",
      status: "blocked",
      priority: "medium",
      area: "automation",
      lane: "later",
      summary: "A blocked fixture task keeps the blocked counter and warning state covered.",
      nextAction: "Provide the missing deploy target before retrying.",
      links: []
    },
    {
      id: "e2e-task-done",
      title: "Document task upkeep",
      status: "done",
      priority: "low",
      area: "docs",
      lane: "ideas",
      summary: "A completed fixture task keeps the done counter covered.",
      nextAction: "Keep completed work out of the active lane.",
      links: []
    }
  ],
  source: "e2e fixture",
  checkedAt: "2026-05-08T20:49:05.000Z"
};
