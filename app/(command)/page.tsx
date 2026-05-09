import { getConfigPath } from "@/lib/config";
import { getSystemHealth, getServices } from "@/features/operations/system-health/server";
import { getConfig } from "@/lib/config";
import { discoverWorkspace } from "@/features/operations/workspace-discovery/server";
import { SystemDashboard } from "@/features/operations/system-health/components/system-dashboard";
import { getWeatherBrief } from "@/features/operations/weather-brief/server";

export const dynamic = "force-dynamic";

export default async function MissionControl() {
  const [health, services, workspace, weather] = await Promise.all([
    getSystemHealth(),
    getServices(getConfig().serviceNames),
    Promise.resolve(discoverWorkspace()),
    Promise.resolve(getWeatherBrief())
  ]);

  return (
    <SystemDashboard
      initialHealth={health}
      initialServices={services}
      initialWeather={weather}
      workspace={workspace}
      configPath={getConfigPath()}
    />
  );
}
