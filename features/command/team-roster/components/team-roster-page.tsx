import { Crown, Network, Shield, Sparkles, Users } from "lucide-react";
import { Panel, SectionLabel, StatusPill } from "@/components/ui/panel";
import { getTeam } from "@/features/command/team-roster/server";
import type { TeamMember } from "@/features/command/team-roster/types";

function Avatar({ member }: { member: TeamMember }) {
  const colors: Record<string, string> = {
    amber: "bg-bridge-amber",
    violet: "bg-bridge-violet",
    mint: "bg-bridge-mint",
    blue: "bg-bridge-bright",
    red: "bg-bridge-danger"
  };

  return (
    <div className="relative h-20 w-20 shrink-0 rounded border border-white/15 bg-black/40 p-2">
      <div className={`mx-auto h-10 w-10 rounded-sm ${colors[member.color] ?? "bg-bridge-bright"}`} />
      <div className={`mx-auto mt-1 h-4 w-12 rounded-sm ${colors[member.color] ?? "bg-bridge-bright"} opacity-80`} />
      <div className="absolute left-5 top-4 h-2 w-2 bg-white" />
      <div className="absolute right-5 top-4 h-2 w-2 bg-white" />
    </div>
  );
}

function MemberCard({ member, tone = "blue" }: { member: TeamMember; tone?: "blue" | "violet" | "mint" | "danger" | "amber" }) {
  return (
    <Panel tone={tone} className="flex gap-4">
      <Avatar member={member} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-2xl font-black text-white">{member.name}</h3>
          <StatusPill label={member.status} status={member.status} />
        </div>
        <p className="mt-1 text-sm font-bold uppercase tracking-[0.18em] text-bridge-violet">{member.rank}</p>
        <p className="mt-3 text-slate-300">{member.role}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded border border-white/10 bg-white/5 px-2.5 py-1 uppercase text-slate-300">{member.branch}</span>
          <span className="rounded border border-white/10 bg-white/5 px-2.5 py-1 uppercase text-slate-300">{member.callsign}</span>
          <span className="rounded border border-white/10 bg-white/5 px-2.5 py-1 uppercase text-slate-300">{member.cadence}</span>
          {member.model ? <span className="rounded border border-white/10 bg-white/5 px-2.5 py-1 uppercase text-slate-300">{member.model}</span> : null}
        </div>
      </div>
    </Panel>
  );
}

export function TeamRosterPage() {
  const team = getTeam();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="border-b border-bridge-line/70 pb-6">
        <SectionLabel>Chain Of Command</SectionLabel>
        <h1 className="mt-3 flex items-center gap-3 text-4xl font-black text-white md:text-5xl">
          <Users className="h-9 w-9 text-bridge-bright" />
          Team
        </h1>
      </header>

      <Panel tone="violet" className="space-y-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-bridge-violet" />
          <SectionLabel>Mission Statement</SectionLabel>
        </div>
        <p className="max-w-5xl text-2xl font-semibold italic leading-relaxed text-slate-100">&ldquo;{team.mission}&rdquo;</p>
      </Panel>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-bridge-line/60" />
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.32em] text-bridge-amber">
            <Crown className="h-4 w-4" />
            Supreme Commander
          </div>
          <div className="h-px flex-1 bg-bridge-line/60" />
        </div>
        <MemberCard member={team.commander} tone="amber" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-bridge-line/60" />
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.32em] text-bridge-violet">
            <Shield className="h-4 w-4" />
            Chief Of Staff
          </div>
          <div className="h-px flex-1 bg-bridge-line/60" />
        </div>
        <MemberCard member={team.chiefOfStaff} tone="violet" />
      </div>

      <Panel tone="blue">
        <div className="mb-5 flex items-center gap-3">
          <Network className="h-6 w-6 text-bridge-bright" />
          <div>
            <SectionLabel>Branch Units</SectionLabel>
            <h2 className="text-2xl font-black">Specialist Roster</h2>
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {team.branches.map((member) => (
            <MemberCard key={member.id} member={member} tone={member.color === "mint" ? "mint" : member.color === "amber" ? "amber" : "blue"} />
          ))}
        </div>
        <p className="mt-5 break-all text-xs text-slate-500">Roster source: {team.source}</p>
      </Panel>
    </div>
  );
}
