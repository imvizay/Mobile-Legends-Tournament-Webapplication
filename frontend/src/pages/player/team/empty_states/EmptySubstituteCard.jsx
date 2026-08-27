import { Users } from "lucide-react";

export default function EmptySubstituteCard() {
    return (
        <div className="mt-3 flex flex-col gap-4 rounded-xl border border-dashed p-4 sm:flex-row sm:items-center sm:justify-between" style={{ background: "color-mix(in srgb, var(--surface-base) 70%, transparent)", borderColor: "var(--border-subtle)" }}>
            <div className="flex min-w-0 items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-[var(--surface-base)]" style={{ borderColor: "var(--border-subtle)" }}>
                    <Users size={15} className="text-[var(--text-muted)]" />
                </div>

                <div className="min-w-0">
                    <p className="text-[10px] font-bold text-[var(--text-primary)]">
                        No substitute players assigned
                    </p>

                    <p className="mt-1 max-w-2xl text-[8px] leading-relaxed text-[var(--text-muted)]">
                        Add substitute players who can participate if an active roster member becomes unavailable during the tournament.
                    </p>
                </div>
            </div>

            <span className="shrink-0 text-[7px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Optional Reserve
            </span>
        </div>
    );
}