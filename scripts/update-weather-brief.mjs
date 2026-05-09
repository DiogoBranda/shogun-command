#!/usr/bin/env node
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runCloudmancer } from "../features/agents/research/cloudmancer/run.mjs";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

runCloudmancer({ rootDir }).catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
