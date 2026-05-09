import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { dirname, join } from "path";

export type ShogunConfig = {
  workspaceRoots: { label: string; path: string }[];
  candidateNames: string[];
  serviceNames: string[];
};

const appRoot = process.cwd();
const configPath = join(appRoot, "config", "shogun.local.json");
const homeRoot = homedir();

const defaultConfig: ShogunConfig = {
  workspaceRoots: [
    { label: "Home", path: homeRoot },
    { label: "Memory", path: join(homeRoot, "memory") },
    { label: "Workspace", path: join(homeRoot, "workspace") },
    { label: "Repos", path: join(homeRoot, "repos") }
  ],
  candidateNames: [
    "MEMORY.md",
    "USER.md",
    "AGENTS.md",
    "tasks.md",
    "TASKS.md",
    "schedule.md",
    "SCHEDULE.md"
  ],
  serviceNames: ["nginx", "cloudflared", "shogun-command"]
};

export function getConfig(): ShogunConfig {
  try {
    if (!existsSync(configPath)) {
      mkdirSync(dirname(configPath), { recursive: true });
      writeFileSync(configPath, `${JSON.stringify(defaultConfig, null, 2)}\n`);
      return defaultConfig;
    }

    return { ...defaultConfig, ...JSON.parse(readFileSync(configPath, "utf8")) };
  } catch {
    return defaultConfig;
  }
}

export function getConfigPath() {
  return configPath;
}
