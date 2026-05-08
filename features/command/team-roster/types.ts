export type TeamHealthStatus = "online" | "warning" | "critical" | "unknown";

export type TeamMember = {
  id: string;
  name: string;
  rank: string;
  branch: string;
  role: string;
  status: TeamHealthStatus;
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
