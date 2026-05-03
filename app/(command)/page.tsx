import { Activity, AlertTriangle, Database, HardDrive, RadioTower, Server } from "lucide-react";
import { Metric, Panel, SectionLabel, StatusPill } from "@/components/panel";
import { getConfigPath } from "@/lib/config";
import { getSystemHealth, getServices } from "@/lib/system";
import { getConfig } from "@/lib/config";
import { discoverWorkspace } from "@/lib/workspace";

export const dynamic = "force-dynamic";

function formatBytes(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  if (days) return `${days}d ${hours}h`;
  return `${hours}h`;
}

export default async function MissionControl() {
  const [health, services, workspace] = await Promise.all([
    getSystemHealth(),
    getServices(getConfig().serviceNames),
    Promise.resolve(discoverWorkspace())
  ]);
  const missingRoots = workspace.roots.filter((root) => !root.exists);
  const unhealthyServices = services.filter((service) => !service.active);
  const notices = [
    ...health.notices,
    ...unhealthyServices.map((service) => `${service.name} is ${service.state}.`),
    ...missingRoots.map((root) => `${root.label} source not found at ${root.path}.`)
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex flex-col gap-4 border-b border-bridge-line/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <SectionLabel>Operational Deck</SectionLabel>
          <h1 className="mt-3 flex items-center gap-3 text-4xl font-black text-white md:text-5xl">
            <RadioTower className="h-9 w-9 text-bridge-bright" />
            Mission Control
          </h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Live Pi state, local source discovery, and command readiness for Shogun Command.
          </p>
        </div>
        <StatusPill label={health.status} status={health.status} />
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Host" value={health.hostname} detail={`${health.platform}/${health.arch}`} />
        <Metric label="Uptime" value={formatUptime(health.uptimeSeconds)} detail={`${health.cpuCount} CPU threads`} />
        <Metric label="Memory" value={`${health.memory.usedPercent}%`} detail={`${formatBytes(health.memory.used)} used`} />
        <Metric
          label="Thermal"
          value={health.temperatureC === null ? "N/A" : `${health.temperatureC}C`}
          detail={`Load ${health.loadAverage.join(" / ")}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Panel tone={notices.length ? "amber" : "mint"} className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <SectionLabel>Critical Updates</SectionLabel>
              <h2 className="mt-2 text-2xl font-black">Command Notices</h2>
            </div>
            <AlertTriangle className="h-7 w-7 text-bridge-amber" />
          </div>
          {notices.length ? (
            <div className="space-y-3">
              {notices.map((notice) => (
                <div key={notice} className="rounded border border-bridge-amber/30 bg-bridge-amber/8 px-4 py-3 text-sm text-bridge-amber">
                  {notice}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded border border-bridge-mint/30 bg-bridge-mint/8 px-4 py-3 text-sm text-bridge-mint">
              No active alarms. The bridge is steady.
            </div>
          )}
        </Panel>

        <Panel tone="blue" className="space-y-4">
          <div className="flex items-center gap-3">
            <HardDrive className="h-6 w-6 text-bridge-bright" />
            <div>
              <SectionLabel>Root Disk</SectionLabel>
              <h2 className="text-2xl font-black">{health.disk ? `${health.disk.usedPercent}% used` : "Unavailable"}</h2>
            </div>
          </div>
          {health.disk ? (
            <div className="space-y-2 text-sm text-slate-300">
              <div className="h-3 overflow-hidden rounded bg-white/8">
                <div className="h-full bg-bridge-bright" style={{ width: `${Math.min(100, health.disk.usedPercent)}%` }} />
              </div>
              <p>
                {health.disk.used} of {health.disk.size} used. {health.disk.available} available on {health.disk.mount}.
              </p>
            </div>
          ) : null}
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel tone="violet" className="lg:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <Database className="h-6 w-6 text-bridge-violet" />
            <div>
              <SectionLabel>Real Source Scan</SectionLabel>
              <h2 className="text-2xl font-black">Operational Filesystem</h2>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {workspace.roots.map((root) => (
              <div key={root.path} className="rounded border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-bold">{root.label}</div>
                  <StatusPill label={root.exists ? root.type : "missing"} status={root.exists ? "online" : "unknown"} />
                </div>
                <div className="mt-2 break-all font-mono text-xs text-slate-400">{root.path}</div>
                <div className="mt-3 text-sm text-slate-300">{root.files} files scanned at top level</div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">Config source: {getConfigPath()}</p>
        </Panel>

        <Panel tone="blue">
          <div className="mb-5 flex items-center gap-3">
            <Server className="h-6 w-6 text-bridge-bright" />
            <div>
              <SectionLabel>Service Watch</SectionLabel>
              <h2 className="text-2xl font-black">Pi Daemons</h2>
            </div>
          </div>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.name} className="rounded border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold">{service.name}</span>
                  <StatusPill label={service.state} status={service.active ? "online" : "critical"} />
                </div>
                <p className="mt-2 text-sm text-slate-400">{service.detail}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel tone="mint" className="overflow-hidden">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-bridge-mint" />
          <SectionLabel>Workspace Signal</SectionLabel>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <Metric label="Memory files" value={String(workspace.summaries.memoryFiles)} />
          <Metric label="Agent files" value={String(workspace.summaries.agentFiles)} />
          <Metric label="Project docs" value={String(workspace.summaries.projectDocs)} />
          <Metric label="Task files" value={String(workspace.summaries.taskFiles)} />
        </div>
      </Panel>
    </div>
  );
}
