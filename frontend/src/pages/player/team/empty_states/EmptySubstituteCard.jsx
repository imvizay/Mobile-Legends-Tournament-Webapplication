import { ShieldPlus, Users } from "lucide-react";

export default function EmptySubstituteCard() {
    return (
        <div className="relative overflow-hidden rounded-[15px] border border-dashed border-[var(--border-default)] bg-[var(--surface-base)] p-4">
            <div className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-muted)]">
                    <Users size={13} />
                </span>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--text-primary)]">
                                Reserve Slot Available
                            </p>

                            <p className="mt-1 text-[7px] leading-relaxed text-[var(--text-muted)]">
                                No substitute player has been assigned to this tournament.
                            </p>
                        </div>

                        <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] text-[var(--text-muted)]">
                            <ShieldPlus size={11} />
                        </span>
                    </div>

                    <div className="mt-3 flex items-center gap-2 border-t border-[var(--border-subtle)] pt-2.5">
                        <span className="size-1.5 rounded-full bg-[var(--text-muted)]" />

                        <p className="text-[6px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                            Optional Tournament Reserve
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}