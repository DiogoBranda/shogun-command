"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Session } from "next-auth";
import { Activity, ListChecks, LogOut, RadioTower, Shield, Users } from "lucide-react";
import { signOutOfGoogle } from "@/features/security/google-authentication/actions";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Mission", icon: RadioTower },
  { href: "/tasks", label: "Tasks", icon: ListChecks },
  { href: "/team", label: "Team", icon: Users }
];

type ShellUser = NonNullable<Session["user"]>;

function UserBadge({ user, compact = false }: { user: ShellUser; compact?: boolean }) {
  const label = user.name || user.email || "Commander";
  const initial = label.slice(0, 1).toUpperCase();

  return (
    <div className={cn("flex min-w-0 items-center gap-3", compact ? "text-right" : "")}>
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded border border-bridge-mint/40 bg-bridge-mint/10 text-sm font-black text-bridge-mint">
        {initial}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-black text-white">{label}</div>
        {!compact && user.email ? <div className="truncate text-xs text-slate-400">{user.email}</div> : null}
      </div>
    </div>
  );
}

export function Sidebar({ user }: { user: ShellUser }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-bridge-line/70 bg-bridge-hull/95 px-5 py-8 shadow-signal md:block">
      <div className="mx-auto mb-8 grid h-16 w-16 place-items-center rounded border border-bridge-violet/40 bg-bridge-panel text-2xl font-black shadow-violet">
        SC
      </div>
      <div className="rounded-md border border-bridge-line bg-black/20 px-5 py-5 text-center">
        <div className="text-xl font-black uppercase tracking-[0.28em] text-white">Mission</div>
        <div className="mt-1 text-xl font-black uppercase tracking-[0.28em] text-white">Control</div>
      </div>
      <div className="mt-5 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.24em] text-slate-300">
        <span className="h-2 w-2 rounded-full bg-bridge-mint shadow-[0_0_12px_#22f5c8]" />
        Inky Online
      </div>
      <nav className="mt-10 space-y-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              href={item.href}
              key={item.href}
              className={cn(
                "flex items-center gap-4 rounded-md border px-4 py-4 text-lg font-bold text-slate-300 transition",
                active
                  ? "border-bridge-bright bg-bridge-bright/12 text-white shadow-signal"
                  : "border-transparent hover:border-bridge-line hover:bg-white/5"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
              {active ? <span className="ml-auto h-2 w-2 rounded-full bg-bridge-mint" /> : null}
            </Link>
          );
        })}
      </nav>
      <div className="absolute bottom-6 left-5 right-5 space-y-4 rounded border border-bridge-line/60 bg-black/25 p-4 text-xs text-slate-400">
        <UserBadge user={user} />
        <form action={signOutOfGoogle}>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded border border-bridge-line bg-white/5 px-3 py-2 font-bold uppercase tracking-[0.16em] text-slate-200 transition hover:border-bridge-bright hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
        <div className="flex items-center gap-2 font-bold uppercase tracking-[0.18em] text-bridge-bright">
          <Shield className="h-4 w-4" />
          Google Guard
        </div>
        <p className="leading-relaxed">Command pages and APIs require an allowed Google account.</p>
      </div>
    </aside>
  );
}

export function MobileHeader({ user }: { user: ShellUser }) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-30 border-b border-bridge-line bg-bridge-hull/95 px-4 py-3 md:hidden">
      <div className="flex items-center justify-between">
        <div className="font-black uppercase tracking-[0.22em]">Shogun Command</div>
        <div className="flex items-center gap-3">
          <UserBadge user={user} compact />
          <form action={signOutOfGoogle}>
            <button
              type="submit"
              aria-label="Sign out"
              className="grid h-9 w-9 place-items-center rounded border border-bridge-line bg-white/5 text-slate-200"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
          <Activity className="h-5 w-5 text-bridge-mint" />
        </div>
      </div>
      <nav className="mt-3 grid grid-cols-3 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              href={item.href}
              key={item.href}
              className={cn(
                "flex items-center justify-center gap-2 rounded border px-2 py-2 text-xs font-bold uppercase text-slate-300",
                active ? "border-bridge-bright bg-bridge-bright/12 text-white" : "border-bridge-line/60 bg-white/5"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
