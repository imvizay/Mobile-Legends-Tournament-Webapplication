import { CheckCircle2, Clock3, CircleAlert, ShieldCheck } from "lucide-react";

const STATUS_CONFIG = {
  PAID: { icon: CheckCircle2, label: "PAID", className: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  PENDING: { icon: Clock3, label: "PENDING", className: "bg-amber-50 text-amber-600 border-amber-100" },
  FAILED: { icon: CircleAlert, label: "FAILED", className: "bg-red-50 text-red-500 border-red-100" },
  CONFIRMED: { icon: ShieldCheck, label: "CONFIRMED", className: "bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--border-subtle)]" },
};

const TournamentStatusChip = ({ status = "PENDING", size = "sm" }) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  const Icon = config.icon;

  return <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border font-semibold tracking-[0.04em] ${size === "xs" ? "px-1.5 py-[3px] text-[7px]" : "px-2 py-1 text-[8px]"} ${config.className}`}><Icon size={size === "xs" ? 9 : 10} strokeWidth={2.4} />{config.label}</span>;
};

export default TournamentStatusChip;
