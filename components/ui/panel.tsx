import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export function Panel({
  children,
  className,
  tone = "blue",
  ...props
}: {
  children: ReactNode;
  className?: string;
  tone?: "blue" | "violet" | "mint" | "danger" | "amber";
} & HTMLAttributes<HTMLElement>) {
  const tones = {
    blue: "border-bridge-line/80 shadow-signal",
    violet: "border-bridge-violet/60 shadow-violet",
    mint: "border-bridge-mint/45",
    danger: "border-bridge-danger/55",
    amber: "border-bridge-amber/50"
  };

  return (
    <section
      className={cn(
        "min-w-0 rounded-md border bg-bridge-panel/82 p-5 backdrop-blur-sm",
        "before:pointer-events-none before:absolute",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.32em] text-bridge-violet">{children}</p>;
}

export function StatusPill({
  label,
  status
}: {
  label: string;
  status: "online" | "warning" | "critical" | "unknown" | string;
}) {
  const color =
    status === "online" || status === "active"
      ? "border-bridge-mint/50 text-bridge-mint"
      : status === "warning" || status === "unknown"
        ? "border-bridge-amber/50 text-bridge-amber"
        : "border-bridge-danger/60 text-bridge-danger";

  return (
    <span className={cn("inline-flex items-center gap-2 rounded border px-2.5 py-1 text-xs font-bold uppercase", color)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
      {label}
    </span>
  );
}

export function Metric({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded border border-white/8 bg-black/20 p-4">
      <div className="text-xs uppercase text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
      {detail ? <div className="mt-1 text-sm text-slate-400">{detail}</div> : null}
    </div>
  );
}
