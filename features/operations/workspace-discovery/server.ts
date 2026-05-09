import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { getConfig } from "@/lib/config";
import { e2eWorkspace, useE2eFixtures } from "@/features/testing/e2e-fixtures";
import type { WorkspaceDiscovery, WorkspaceEntry } from "./types";

function safeEntry(label: string, path: string): WorkspaceEntry {
  try {
    if (!existsSync(path)) {
      return { label, path, exists: false, type: "missing", files: 0, bytes: 0, modifiedAt: null };
    }

    const stat = statSync(path);
    const type = stat.isDirectory() ? "directory" : stat.isFile() ? "file" : "other";
    let files = type === "file" ? 1 : 0;
    let bytes = stat.size;

    if (stat.isDirectory()) {
      for (const item of readdirSync(path, { withFileTypes: true }).slice(0, 500)) {
        try {
          const child = statSync(join(path, item.name));
          if (child.isFile()) files += 1;
          bytes += child.size;
        } catch {
          continue;
        }
      }
    }

    return {
      label,
      path,
      exists: true,
      type,
      files,
      bytes,
      modifiedAt: stat.mtime.toISOString()
    };
  } catch {
    return { label, path, exists: false, type: "missing", files: 0, bytes: 0, modifiedAt: null };
  }
}

export function discoverWorkspace(): WorkspaceDiscovery {
  if (useE2eFixtures()) {
    return e2eWorkspace;
  }

  const config = getConfig();
  const roots = config.workspaceRoots.map((root) => safeEntry(root.label, root.path));
  const candidates = roots.flatMap((root) => {
    if (!root.exists || root.type !== "directory") return [];
    return config.candidateNames.map((name) => safeEntry(name, join(root.path, name)));
  });

  const existingCandidates = candidates.filter((entry) => entry.exists);
  const summaries = {
    memoryFiles: existingCandidates.filter((entry) => /memory/i.test(entry.label) || /memory/i.test(entry.path)).length,
    agentFiles: existingCandidates.filter((entry) => /agent|user/i.test(entry.label)).length,
    projectDocs: existingCandidates.filter((entry) => /project|brief|doc/i.test(entry.label)).length,
    taskFiles: existingCandidates.filter((entry) => /task|schedule/i.test(entry.label)).length
  };

  return {
    roots,
    candidates,
    summaries,
    checkedAt: new Date().toISOString()
  };
}
