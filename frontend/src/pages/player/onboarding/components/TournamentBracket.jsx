import React from "react";
import { Trophy } from "lucide-react";

function TournamentBracket({ tournament }) {
    return (
        <section className="w-full min-w-0">
            <BracketHeading tournament={tournament} />
            <NoTournamentState />
        </section>
    );
}

function BracketHeading({ tournament }) {
    return (
        <div className="mb-4 min-w-0 sm:mb-5">
            <div className="flex items-center gap-2">
                <span className="h-px w-5 shrink-0 bg-[var(--accent-gold)] sm:w-6" />

                <p className="max-w-[220px] truncate font-['Barlow_Condensed'] text-[7px] font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)] sm:text-[8px] sm:tracking-[0.22em]">
                    {tournament?.name || "Competition"}
                </p>
            </div>

            <div className="mt-1 flex min-w-0 items-center gap-2">
                <h2 className="truncate font-['Rajdhani'] text-[18px] font-bold uppercase leading-none tracking-[-0.01em] text-[var(--text-primary)] sm:text-[21px]">
                    Tournament Bracket
                </h2>

                <span className="hidden h-4 w-px shrink-0 bg-[var(--border-default)] sm:block" />

                <span className="hidden whitespace-nowrap font-['Barlow_Condensed'] text-[7px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] sm:block">
                    Championship Path
                </span>
            </div>
        </div>
    );
}

function NoTournamentState() {
    return (
        <div className="relative min-h-[300px] overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-white/55 shadow-[0_14px_50px_rgba(50,40,20,0.055)] backdrop-blur-2xl sm:min-h-[340px]">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/75 via-white/30 to-transparent" />

            <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(80,65,35,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(80,65,35,.8)_1px,transparent_1px)] [background-size:30px_30px]" />

            <div className="pointer-events-none absolute -right-24 top-1/2 size-[300px] -translate-y-1/2 rounded-full bg-[var(--accent-gold)]/[0.06] blur-[90px]" />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <img
                    src="/bracket_images/tournament_bracket.png"
                    alt=""
                    className="h-full w-full object-contain opacity-[0.12]"
                />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--surface-base)]/90 via-transparent to-[var(--surface-base)]/90" />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--surface-base)] via-transparent to-[var(--surface-base)]/70" />

            <div className="relative z-10 flex min-h-[300px] items-center justify-center px-5 py-10 sm:min-h-[340px] sm:px-8">
                <div className="max-w-[430px] text-center">
                    <div className="relative mx-auto mb-5 flex size-[68px] items-center justify-center rounded-full border border-[var(--accent-gold)]/25 bg-white/75 shadow-[0_12px_35px_rgba(150,110,30,0.08)] backdrop-blur-xl sm:size-[72px]">
                        <div className="absolute inset-[-9px] rounded-full border border-[var(--accent-gold)]/[0.08]" />

                        <Trophy
                            className="size-6 text-[var(--accent-gold)]"
                            strokeWidth={1.5}
                        />
                    </div>

                    <p className="font-['Barlow_Condensed'] text-[7px] font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)] sm:text-[8px]">
                        Championship Path
                    </p>

                    <h3 className="mt-1.5 font-['Rajdhani'] text-[19px] font-bold uppercase leading-none tracking-[-0.01em] text-[var(--text-primary)] sm:text-[21px]">
                        The Championship Awaits
                    </h3>

                    <p className="mx-auto mt-2 max-w-[380px] text-[9px] leading-[1.7] text-[var(--text-muted)] sm:text-[10px]">
                        The tournament bracket will appear here once the next competition is ready.
                    </p>

                    <div className="mt-5 flex items-center justify-center gap-2">
                        <span className="h-px w-8 bg-[var(--border-default)]" />

                        <span className="font-['Barlow_Condensed'] text-[6px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                            Stay Ready
                        </span>

                        <span className="h-px w-8 bg-[var(--border-default)]" />
                    </div>
                </div>
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-40 bg-gradient-to-r from-[var(--accent-gold)] to-transparent" />
        </div>
    );
}

export default TournamentBracket;