import { getConfigPath } from "@/lib/config";
import { getSystemHealth, getServices } from "@/lib/system";
import { getConfig } from "@/lib/config";
import { discoverWorkspace } from "@/lib/workspace";
import { SystemDashboard } from "./system-dashboard";

export const dynamic = "force-dynamic";

export default async function MissionControl() {
  const [health, services, workspace] = await Promise.all([
    getSystemHealth(),
    getServices(getConfig().serviceNames),
    Promise.resolve(discoverWorkspace())
  ]);

  return (
    <SystemDashboard initialHealth={health} initialServices={services} workspace={workspace} configPath={getConfigPath()} />
  );
}
