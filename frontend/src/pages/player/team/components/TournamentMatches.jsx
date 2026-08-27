import React, { useMemo } from "react";
import {
    CalendarDays,
    ChevronRight,
    Clock3,
    Crosshair,
    Radio,
    ShieldCheck,
    Swords,
    Trophy,
} from "lucide-react";

const dummyMatches = [
    {
        id: 1,
        round: "ROUND 2",
        status: "UPCOMING",
        date: "TODAY",
        time: "8:30 PM",
        currentTeam: {
            name: "EXILE ESPORTS",
            tag: "EXILE",
            logo: null,
        },
        opponent: {
            name: "NIGHT FURY",
            tag: "NF",
            logo: null,
        },
        format: "BEST OF 3",
        isToday: true,
        isCurrentRound: true,
    },
    {
        id: 2,
        round: "ROUND 3",
        status: "SCHEDULED",
        date: "SEP 20, 2026",
        time: "7:00 PM",
        currentTeam: {
            name: "EXILE ESPORTS",
            tag: "EXILE",
            logo: null,
        },
        opponent: {
            name: "TEAM PHANTOM",
            tag: "PH",
            logo: null,
        },
        format: "BEST OF 3",
    },
    {
        id: 3,
        round: "QUARTER FINAL",
        status: "PENDING",
        date: "TBD",
        time: "AWAITING RESULT",
        currentTeam: {
            name: "EXILE ESPORTS",
            tag: "EXILE",
            logo: null,
        },
        opponent: null,
        format: "BEST OF 3",
    },
];

export default function TournamentMatches({
    matches = dummyMatches,
    currentTeamName = "EXILE ESPORTS",
    currentRound = "ROUND 2",
    tournamentName = "Mobile Legends Champions Cup",
}) {
    const priorityMatch = useMemo(() => {
        return matches.find((match) => match.isToday) || matches.find((match) => match.isCurrentRound) || matches[0];
    }, [matches]);

    const otherMatches = useMemo(() => {
        if (!priorityMatch) return [];

        return matches.filter((match) => match.id !== priorityMatch.id);
    }, [matches, priorityMatch]);

    if (!priorityMatch && matches.length === 0) {
        return (
            <section className="w-full rounded-xl border p-5 text-center" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>
                <Swords size={20} className="mx-auto" style={{ color: "var(--text-muted)" }} />
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-primary)" }}>No tournament matches</p>
                <p className="mt-1 text-[9px]" style={{ color: "var(--text-muted)" }}>Your upcoming tournament fixtures will appear here.</p>
            </section>
        );
    }

    return (
        <section className="w-full">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                   
                    <h2 className="mt-1 text-lg font-bold tracking-[-0.03em] sm:text-xl" style={{ color: "var(--headline-primary)" }}>
                        Tournament Matches
                    </h2>

                    <p className="mt-1 text-[9px] sm:text-[10px]" style={{ color: "var(--text-muted)" }}>
                        Follow your team's current competitive schedule and upcoming tournament fixtures.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-secondary)", background: "var(--surface-elevated)", borderColor: "var(--border-default)" }}>
                        <Radio size={10} style={{ color: "var(--accent-gold)" }} />
                        Current Round
                    </span>

                    <span className="text-[8px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>
                        {currentRound}
                    </span>
                </div>
            </div>

            <div className="overflow-hidden rounded-[18px] border" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>
                <PriorityMatchBanner match={priorityMatch} tournamentName={tournamentName} currentTeamName={currentTeamName} />

                {otherMatches.length > 0 && (
                    <div className="border-t p-3 sm:p-4" style={{ borderColor: "var(--border-subtle)" }}>
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: "var(--text-secondary)" }}>
                                    Upcoming Tournament Path
                                </p>

                                <p className="mt-0.5 text-[8px]" style={{ color: "var(--text-muted)" }}>
                                    Scheduled and conditional matches in your competitive journey.
                                </p>
                            </div>

                            <span className="text-[8px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>
                                {otherMatches.length} Matches
                            </span>
                        </div>

                        <div className="space-y-2">
                            {otherMatches.map((match) => (
                                <TournamentMatchRow key={match.id} match={match} currentTeamName={currentTeamName} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

function PriorityMatchBanner({ match, tournamentName, currentTeamName }) {
    const isToday = match.date === "TODAY";
    const isCurrentTeamLeft = match.currentTeam?.name === currentTeamName;

    return (
        <article className="relative isolate overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,color-mix(in_srgb,var(--accent-gold)_10%,transparent),transparent_35%)]" />

            <div className="relative border-b px-3 py-3 sm:px-4 sm:py-4 lg:px-5" style={{ borderColor: "var(--border-subtle)", background: "color-mix(in srgb, var(--surface-elevated) 70%, var(--surface-base))" }}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="flex size-7 items-center justify-center rounded-lg border" style={{ background: "color-mix(in srgb, var(--accent-gold) 7%, transparent)", borderColor: "color-mix(in srgb, var(--accent-gold) 16%, var(--border-subtle))" }}>
                            <Crosshair size={13} style={{ color: "var(--accent-gold)" }} />
                        </span>

                        <div>
                            <p className="text-[7px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
                                {isToday ? "Today's Team Match" : "Next Scheduled Match"}
                            </p>

                            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.04em]" style={{ color: "var(--text-primary)" }}>
                                {match.round}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                    
                        <span className="rounded-md border px-2 py-1 text-[7px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)", background: "var(--surface-base)", borderColor: "var(--border-default)" }}>
                            {match.format}
                        </span>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
                    <TeamMatchIdentity team={match.currentTeam} align="right" highlighted={isCurrentTeamLeft} currentTeamName={currentTeamName} />

                    <div className="flex flex-col items-center justify-center gap-1.5">
                        <span className="font-['Rajdhani'] text-xl font-bold italic sm:text-2xl" style={{ color: "var(--accent-gold)" }}>
                            VS
                        </span>

                        <span className="h-5 w-px" style={{ background: "var(--border-default)" }} />
                    </div>

                    <TeamMatchIdentity team={match.opponent} align="left" highlighted={!isCurrentTeamLeft} currentTeamName={currentTeamName} />
                </div>

                <div className="mt-5 flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--border-subtle)" }}>
                    <div className="flex items-center gap-2">
                        <div className="flex size-7 items-center justify-center rounded-md" style={{ background: "var(--surface-base)" }}>
                            <Clock3 size={12} style={{ color: "var(--text-muted)" }} />
                        </div>

                        <div>
                            <p className="text-[7px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>
                                Match Schedule
                            </p>

                            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.04em]" style={{ color: "var(--text-primary)" }}>
                                {match.date} · {match.time}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[8px]" style={{ color: "var(--text-muted)" }}>
                        <Trophy size={10} style={{ color: "var(--accent-gold)" }} />
                        <span>{tournamentName}</span>
                    </div>
                </div>
            </div>
        </article>
    );
}

function TeamMatchIdentity({ team, align = "left", highlighted, currentTeamName }) {
    const isCurrentTeam = team?.name === currentTeamName;

    if (!team) {
        return (
            <div className={`min-w-0 ${align === "right" ? "text-right" : "text-left"}`}>
                <p className="text-[7px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                    Opponent
                </p>

                <p className="mt-1 text-sm font-bold uppercase sm:text-base" style={{ color: "var(--text-muted)" }}>
                    To Be Decided
                </p>

                <p className="mt-1 text-[8px]" style={{ color: "var(--text-muted)" }}>
                    Awaiting previous match result
                </p>
            </div>
        );
    }

    return (
        <div className={`min-w-0 ${align === "right" ? "text-right" : "text-left"}`}>
            <div className={`flex items-center gap-2 ${align === "right" ? "justify-end" : "justify-start"}`}>
                {align !== "right" && <TeamLogo team={team} highlighted={highlighted} />}

                <div className="min-w-0">
                    <div className={`flex items-center gap-1.5 ${align === "right" ? "justify-end" : "justify-start"}`}>
                        {isCurrentTeam && (
                            <span className="text-[6px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--accent-gold)" }}>
                                Your Team
                            </span>
                        )}

                        {!isCurrentTeam && (
                            <span className="text-[6px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                                Opponent
                            </span>
                        )}
                    </div>

                    <h3 className="mt-1 truncate font-['Rajdhani'] text-sm font-bold uppercase leading-none sm:text-lg" style={{ color: highlighted ? "var(--text-primary)" : "var(--text-secondary)" }}>
                        {team.name}
                    </h3>

                    <p className="mt-1 text-[7px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                        #{team.tag}
                    </p>
                </div>

                {align === "right" && <TeamLogo team={team} highlighted={highlighted} />}
            </div>
        </div>
    );
}

function TeamLogo({ team, highlighted }) {
    return (
        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border sm:size-10" style={{ background: highlighted ? "color-mix(in srgb, var(--accent-gold) 8%, var(--surface-base))" : "var(--surface-base)", borderColor: highlighted ? "color-mix(in srgb, var(--accent-gold) 20%, var(--border-default))" : "var(--border-default)" }}>
            {team.logo ? (
                <img src={team.logo} alt={team.name} className="h-full w-full object-cover" />
            ) : (
                <span className="font-['Rajdhani'] text-xs font-bold uppercase" style={{ color: highlighted ? "var(--accent-gold)" : "var(--text-secondary)" }}>
                    {team.tag?.slice(0, 2)}
                </span>
            )}
        </div>
    );
}

function TournamentMatchRow({ match, currentTeamName }) {
    const opponent = match.currentTeam?.name === currentTeamName ? match.opponent : match.currentTeam;
    const isPendingOpponent = !opponent;

    return (
        <article className="group flex flex-col gap-3 rounded-xl border p-3 transition-transform hover:-translate-y-px sm:flex-row sm:items-center sm:justify-between" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-subtle)" }}>
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>
                    <Swords size={13} style={{ color: "var(--text-muted)" }} />
                </div>

                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-[7px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--accent-gold)" }}>
                            {match.round}
                        </span>

                        <span className="size-1 rounded-full" style={{ background: "var(--border-default)" }} />

                        <span className="text-[7px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>
                            {match.format}
                        </span>
                    </div>

                    <p className="mt-1 truncate text-[10px] font-bold uppercase sm:text-[11px]" style={{ color: "var(--text-primary)" }}>
                        {currentTeamName} <span style={{ color: "var(--text-muted)" }}>vs</span> {isPendingOpponent ? "TO BE DECIDED" : opponent.name}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
                <div className="flex items-center gap-2">
                    <CalendarDays size={11} style={{ color: "var(--text-muted)" }} />

                    <span className="text-[8px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text-secondary)" }}>
                        {match.date} · {match.time}
                    </span>
                </div>

                <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" style={{ color: "var(--text-muted)" }} />
            </div>
        </article>
    );
}