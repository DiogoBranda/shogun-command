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

export type WorkspaceEntry = {
  label: string;
  path: string;
  exists: boolean;
  type: "directory" | "file" | "missing" | "other";
  files: number;
  bytes: number;
  modifiedAt: string | null;
};

export type WorkspaceDiscovery = {
  roots: WorkspaceEntry[];
  candidates: WorkspaceEntry[];
  summaries: {
    memoryFiles: number;
    agentFiles: number;
    projectDocs: number;
    taskFiles: number;
  };
  checkedAt: string;
};

export type TeamMember = {
  id: string;
  name: string;
  rank: string;
  branch: string;
  role: string;
  status: HealthStatus;
  cadence: string;
  model?: string;
  callsign: string;
  color: string;
};

export type TeamManifest = {
  mission: string;
  commander: TeamMember;
  chiefOfStaff: TeamMember;
  branches: TeamMember[];
  source: string;
  checkedAt: string;
};
