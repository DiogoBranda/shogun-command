import { execFile } from "child_process";
import { existsSync, readFileSync } from "fs";
import os from "os";
import { promisify } from "util";
import { e2eServices, e2eSystemHealth, useE2eFixtures } from "@/features/testing/e2e-fixtures";
import type { HealthStatus, ServiceState, SystemHealth } from "./types";

const execFileAsync = promisify(execFile);

function percent(value: number) {
  return Math.round(value * 10) / 10;
}

async function diskUsage() {
  try {
    const { stdout } = await execFileAsync("df", ["-h", "/"]);
    const [, line] = stdout.trim().split("\n");
    if (!line) return null;
    const parts = line.trim().split(/\s+/);
    return {
      filesystem: parts[0],
      size: parts[1],
      used: parts[2],
      available: parts[3],
      usedPercent: Number(parts[4]?.replace("%", "") ?? 0),
      mount: parts[5] ?? "/"
    };
  } catch {
    return null;
  }
}

function temperature() {
  const paths = [
    "/sys/class/thermal/thermal_zone0/temp",
    "/sys/class/hwmon/hwmon0/temp1_input"
  ];

  for (const path of paths) {
    try {
      if (!existsSync(path)) continue;
      const raw = Number(readFileSync(path, "utf8").trim());
      if (Number.isFinite(raw)) return raw > 1000 ? percent(raw / 1000) : raw;
    } catch {
      continue;
    }
  }

  return null;
}

export async function getSystemHealth(): Promise<SystemHealth> {
  if (useE2eFixtures()) {
    return e2eSystemHealth;
  }

  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  const usedPercent = percent((used / total) * 100);
  const disk = await diskUsage();
  const temperatureC = temperature();
  const loadAverage = os.loadavg().map(percent);
  const notices: string[] = [];

  if (usedPercent >= 85) notices.push("Memory pressure is high.");
  if ((disk?.usedPercent ?? 0) >= 85) notices.push("Root disk usage is high.");
  if ((temperatureC ?? 0) >= 75) notices.push("CPU temperature is elevated.");
  if (loadAverage[0] >= Math.max(4, os.cpus().length * 1.5)) {
    notices.push("One-minute load average is unusually high.");
  }

  let status: HealthStatus = "online";
  if (notices.length) status = "warning";
  if (usedPercent >= 95 || (disk?.usedPercent ?? 0) >= 95 || (temperatureC ?? 0) >= 85) {
    status = "critical";
  }

  return {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    uptimeSeconds: os.uptime(),
    loadAverage,
    cpuCount: os.cpus().length,
    memory: { total, free, used, usedPercent },
    disk,
    temperatureC,
    status,
    notices,
    checkedAt: new Date().toISOString()
  };
}

export async function getServices(names: string[]): Promise<ServiceState[]> {
  if (useE2eFixtures()) {
    return e2eServices;
  }

  return Promise.all(
    names.map(async (name) => {
      try {
        const { stdout } = await execFileAsync("systemctl", ["is-active", name]);
        const state = stdout.trim();
        return {
          name,
          active: state === "active",
          state,
          detail: state === "active" ? "Service is running" : "Service is not active"
        };
      } catch (error) {
        const detail = error instanceof Error ? error.message : "Unable to read service state";
        return { name, active: false, state: "inactive", detail };
      }
    })
  );
}
