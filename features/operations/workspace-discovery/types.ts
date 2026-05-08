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
