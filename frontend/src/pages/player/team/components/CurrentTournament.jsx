import React from "react";
import { CalendarDays, Check, Trophy, Users, Zap } from "lucide-react";

export default function CurrentTournament({ tournament }) {
    if (!tournament) {
        return (
            <section className="flex min-h-[260px] items-center justify-center rounded-[16px] border border-dashed border-[var(--border-default)] bg-[var(--surface-elevated)]">
                <div className="text-center">
                    <Trophy className="mx-auto mb-2 size-5 text-[var(--text-muted)]" />
                    <p className="text-sm font-semibold">No active tournament</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                        Your next competition will appear here.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="relative min-h-[270px] overflow-hidden rounded-[16px] border border-[var(--border-default)] bg-[#171717] text-white">
            {tournament.banner && (
                <img
                    src={tournament.banner}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-35"
                />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />

            <div className="relative flex h-full min-h-[270px] flex-col p-4 sm:p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--accent-gold)]">
                        <Trophy size={12} />
                        Current Tournament
                    </div>

                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wider text-emerald-400">
                        {tournament.status}
                    </span>
                </div>

                <div className="mt-7">
                    <h2 className="font-['Rajdhani'] text-2xl font-bold uppercase tracking-tight sm:text-3xl">
                        {tournament.name}
                    </h2>

                    <div className="mt-2 flex flex-wrap gap-3 text-[9px] uppercase tracking-wider text-white/55">
                        <span>{tournament.format}</span>
                        <span>•</span>
                        <span>{tournament.server}</span>
                        <span>•</span>
                        <span>{tournament.bracket}</span>
                    </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2 border-t border-white/10 pt-4 sm:grid-cols-4">
                    <Metric label="Current Stage" value={tournament.stage} />
                    <Metric label="Round" value={tournament.round} />
                    <Metric label="Next Match" value={tournament.nextMatch} />
                    <Metric label="Prize Pool" value={tournament.prizePool} />
                </div>

                <div className="mt-3 flex gap-2">
                    <button className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/20 text-[9px] font-bold uppercase tracking-wider transition-transform hover:-translate-y-px">
                        View Tournament
                    </button>

                    <button className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--accent-gold)] text-[9px] font-bold uppercase tracking-wider text-white transition-transform hover:-translate-y-px">
                        <Check size={12} />
                        {tournament.paid ? "Paid · View Tournament" : "Pay Tournament Fee"}
                    </button>
                </div>
            </div>
        </section>
    );
}

function Metric({ label, value }) {
    return (
        <div>
            <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-white/40">
                {label}
            </p>

            <p className="mt-1 truncate text-[11px] font-semibold text-white">
                {value || "—"}
            </p>
        </div>
    );
}