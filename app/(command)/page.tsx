import { getConfigPath } from "@/lib/config";
import { getSystemHealth, getServices } from "@/features/operations/system-health/server";
import { getConfig } from "@/lib/config";
import { discoverWorkspace } from "@/features/operations/workspace-discovery/server";
import { SystemDashboard } from "@/features/operations/system-health/components/system-dashboard";

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
