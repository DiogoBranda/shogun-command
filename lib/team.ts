import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import type { TeamManifest } from "@/lib/types";

const teamPath = join(process.cwd(), "config", "team.local.json");

const defaultTeam: Omit<TeamManifest, "source" | "checkedAt"> = {
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
  ]
};

export function getTeam(): TeamManifest {
  try {
    if (!existsSync(teamPath)) {
      mkdirSync(dirname(teamPath), { recursive: true });
      writeFileSync(teamPath, `${JSON.stringify(defaultTeam, null, 2)}\n`);
    }

    return {
      ...JSON.parse(readFileSync(teamPath, "utf8")),
      source: teamPath,
      checkedAt: new Date().toISOString()
    };
  } catch {
    return {
      ...defaultTeam,
      source: "built-in fallback",
      checkedAt: new Date().toISOString()
    };
  }
}
