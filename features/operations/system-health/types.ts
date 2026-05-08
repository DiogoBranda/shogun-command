export type HealthStatus = "online" | "warning" | "critical" | "unknown";

export type SystemHealth = {
  hostname: string;
  platform: string;
  arch: string;
  uptimeSeconds: number;
  loadAverage: number[];
  cpuCount: number;
  memory: {
    total: number;
    free: number;
    used: number;
    usedPercent: number;
  };
  disk: {
    filesystem: string;
    size: string;
    used: string;
    available: string;
    usedPercent: number;
    mount: string;
  } | null;
  temperatureC: number | null;
  status: HealthStatus;
  notices: string[];
  checkedAt: string;
};

export type ServiceState = {
  name: string;
  active: boolean;
  state: string;
  detail: string;
};
