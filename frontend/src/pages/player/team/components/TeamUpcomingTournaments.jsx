import React, { useMemo } from "react";
import {
    ArrowUpRight,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Globe2,
    IndianRupee,
    ShieldAlert,
    Trophy,
    Users,
} from "lucide-react";

const tournamentFallbacks = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=700&q=85",
    "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=700&q=85",
    "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=700&q=85",
];

const dummyUpcomingTournaments = [
    {
        tournament_id: 1042,
        tournament_name: "Battle Arena Masters",
        background_image: tournamentFallbacks[0],
        team_format: "5v5",
        tournament_type: "Single Elimination",
        server: "India",
        status: "confirmed",
        entry_fee: 600,
        prize_pool: 25000,
        tournament_start_date: "2026-08-29T18:00:00",
        tournament_end_date: "2026-08-30T22:00:00",
    },
    {
        tournament_id: 1043,
        tournament_name: "Ignite Invitational",
        background_image: tournamentFallbacks[1],
        team_format: "5v5",
        tournament_type: "Double Elimination",
        server: "India",
        status: "approved",
        entry_fee: 750,
        prize_pool: 50000,
        tournament_start_date: "2026-09-03T17:00:00",
        tournament_end_date: "2026-09-04T22:00:00",
    },
    {
        tournament_id: 1044,
        tournament_name: "Summer Showdown",
        background_image: tournamentFallbacks[2],
        team_format: "5v5",
        tournament_type: "Single Elimination",
        server: "India",
        status: "pending",
        entry_fee: 500,
        prize_pool: 15000,
        tournament_start_date: "2026-09-13T18:00:00",
        tournament_end_date: "2026-09-14T22:00:00",
    },
];

export default function TeamUpcomingTournaments({ tournaments = [] }) {
    const upcomingTournaments = useMemo(() => {
        const source = Array.isArray(tournaments) && tournaments.length > 0 ? tournaments : dummyUpcomingTournaments;

        return [...source].sort((a, b) => new Date(a.tournament_start_date).getTime() - new Date(b.tournament_start_date).getTime()).slice(0, 3);
    }, [tournaments]);

    return (
        <section className="min-w-0">
            <div className="mb-4 flex items-end justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="h-4 w-[2px]" style={{ background: "var(--accent-gold)" }} />

                        <div className="min-w-0">
                            <p className="text-[7px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>
                                Competitive Schedule
                            </p>

                            <h2 className="mt-0.5 text-[13px] font-bold uppercase tracking-[-0.02em]" style={{ color: "var(--headline-primary)" }}>
                                Upcoming Tournaments
                            </h2>
                        </div>
                    </div>
                </div>

                <button type="button" className="group flex shrink-0 items-center gap-1 text-[7px] font-bold uppercase tracking-[0.1em] transition-colors" style={{ color: "var(--text-muted)" }}>
                    All Events
                    <ArrowUpRight size={10} strokeWidth={2} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </button>
            </div>

            {upcomingTournaments.length > 0 ? (
                <div>
                    {upcomingTournaments.map((tournament, index) => (
                        <UpcomingTournamentItem key={tournament.tournament_id ?? index} tournament={tournament} index={index} isNearest={index === 0} isLast={index === upcomingTournaments.length - 1} />
                    ))}
                </div>
            ) : (
                <EmptyState />
            )}

            {upcomingTournaments.length > 0 && (
                <div className="mt-1 flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
                    <div className="flex items-center gap-1.5">
                        <CalendarDays size={10} strokeWidth={1.8} style={{ color: "var(--accent-gold)" }} />

                        <span className="text-[6.5px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
                            Team Event Calendar
                        </span>
                    </div>

                    <span className="text-[6.5px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
                        {upcomingTournaments.length} Registered
                    </span>
                </div>
            )}
        </section>
    );
}

function UpcomingTournamentItem({ tournament, index, isNearest, isLast }) {
    const date = getTournamentDate(tournament.tournament_start_date);
    const status = getTournamentStatus(tournament.status);
    const relativeTime = getRelativeTournamentTime(tournament.tournament_start_date);

    return (
        <article className={`group relative flex gap-3 ${isLast ? "pb-3" : "pb-5"}`}>
            <TimelineDateChip date={date} isNearest={isNearest} isLast={isLast} />

            <div className="min-w-0 flex-1 pb-1">
                <div className="flex min-w-0 gap-2">
                    <div className="min-w-0 flex-1">
                        <div className="mb-1.5 flex items-center gap-1.5">
                            <StatusIcon status={status} />

                            <span className="truncate text-[6px] font-bold uppercase tracking-[0.12em]" style={{ color: status.color }}>
                                {status.label}
                            </span>
                        </div>

                        <h3 className={`line-clamp-2 font-['Rajdhani'] font-bold uppercase leading-[0.95] tracking-[-0.025em] ${isNearest ? "text-[17px]" : "text-[14px]"}`} style={{ color: "var(--text-primary)" }}>
                            {tournament.tournament_name}
                        </h3>
                    </div>

                    <TournamentVisual image={tournament.background_image || tournamentFallbacks[index % tournamentFallbacks.length]} active={isNearest} />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[6px] font-bold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1">
                        <Users size={8} />
                        {tournament.team_format || "5v5"}
                    </span>

                    <span className="size-0.5 rounded-full" style={{ background: "var(--border-default)" }} />

                    <span>{tournament.tournament_type || "Tournament"}</span>

                    <span className="size-0.5 rounded-full" style={{ background: "var(--border-default)" }} />

                    <span className="flex items-center gap-1">
                        <Globe2 size={8} />
                        {tournament.server || "India"}
                    </span>
                </div>

                <div className="mt-3 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[7px] font-bold uppercase tracking-[0.08em]" style={{ color: isNearest ? "var(--accent-gold)" : "var(--text-secondary)" }}>
                            {relativeTime}
                        </p>

                        <p className="mt-1 text-[6px] font-medium" style={{ color: "var(--text-muted)" }}>
                            {formatTournamentPeriod(tournament.tournament_start_date, tournament.tournament_end_date)}
                        </p>
                    </div>

                    <div className="shrink-0 text-right">
                        <p className="text-[5.5px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
                            Entry Fee
                        </p>

                        <p className="mt-0.5 flex items-center justify-end gap-0.5 text-[9px] font-bold" style={{ color: "var(--text-primary)" }}>
                            <IndianRupee size={8} strokeWidth={2.2} />
                            {formatCurrency(tournament.entry_fee)}
                        </p>
                    </div>
                </div>

                {isNearest && (
                    <div className="mt-3 flex items-center gap-2 border-t pt-2.5" style={{ borderColor: "color-mix(in srgb, var(--accent-gold) 15%, var(--border-subtle))" }}>
                        <span className="size-1.5 shrink-0 rounded-full" style={{ background: "var(--accent-gold)" }} />

                        <span className="text-[6px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>
                            Nearest registered competition
                        </span>
                    </div>
                )}
            </div>
        </article>
    );
}

function TimelineDateChip({ date, isNearest, isLast }) {
    return (
        <div className="relative flex w-[50px] shrink-0 justify-center">
            {!isLast && (
                <span className="absolute left-1/2 top-[66px] bottom-[-2px] w-px -translate-x-1/2" style={{ background: "var(--border-subtle)" }} />
            )}

            <div className={`relative z-10 w-[44px] overflow-hidden rounded-[9px] border shadow-[var(--shadow-sm)] ${isNearest ? "scale-[1.02]" : ""}`} style={{ background: "var(--surface-elevated)", borderColor: isNearest ? "color-mix(in srgb, var(--accent-gold) 42%, var(--border-default))" : "var(--border-default)" }}>
                <div className="flex h-[13px] items-center justify-center" style={{ background: isNearest ? "var(--accent-gold)" : "var(--surface-base)" }}>
                    <span className="text-[5px] font-black uppercase tracking-[0.12em]" style={{ color: isNearest ? "var(--bg-canvas)" : "var(--text-muted)" }}>
                        {date.month}
                    </span>
                </div>

                <div className="flex flex-col items-center px-1 py-1.5">
                    <span className="text-[16px] font-black leading-none tracking-[-0.04em]" style={{ color: isNearest ? "var(--accent-gold)" : "var(--text-primary)" }}>
                        {date.day}
                    </span>

                    <span className="mt-1 text-[5px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
                        {date.weekday}
                    </span>

                    <span className="mt-0.5 text-[4.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>
                        {date.year}
                    </span>
                </div>

                {isNearest && <span className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background: "var(--accent-gold)" }} />}
            </div>
        </div>
    );
}

function TournamentVisual({ image, active }) {
    return (
        <div className="relative h-[54px] w-[62px] shrink-0 overflow-hidden" style={{ clipPath: "polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%)", border: "1px solid var(--border-subtle)" }}>
            <img src={image} alt="" className="h-full w-full object-cover grayscale-[20%] transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

            {active && <span className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background: "var(--accent-gold)" }} />}
        </div>
    );
}

function StatusIcon({ status }) {
    const Icon = status.type === "pending" ? Clock3 : status.type === "danger" ? ShieldAlert : CheckCircle2;

    return <Icon size={9} strokeWidth={2} style={{ color: status.color }} />;
}

function EmptyState() {
    return (
        <div className="border-y py-10 text-center" style={{ borderColor: "var(--border-subtle)" }}>
            <Trophy size={18} strokeWidth={1.5} className="mx-auto" style={{ color: "var(--accent-gold)" }} />

            <p className="mt-3 text-[8px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-primary)" }}>
                No Registered Events
            </p>

            <p className="mx-auto mt-1.5 max-w-[220px] text-[7px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Upcoming competitions registered by the team will appear here.
            </p>
        </div>
    );
}

function getTournamentDate(value) {
    if (!value) return { day: "--", month: "---", weekday: "---", year: "----" };

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return { day: "--", month: "---", weekday: "---", year: "----" };

    return {
        day: date.toLocaleDateString("en-IN", { day: "2-digit" }),
        month: date.toLocaleDateString("en-IN", { month: "short" }),
        weekday: date.toLocaleDateString("en-IN", { weekday: "short" }),
        year: date.toLocaleDateString("en-IN", { year: "numeric" }),
    };
}

function getRelativeTournamentTime(value) {
    if (!value) return "DATE TBA";

    const target = new Date(value);

    if (Number.isNaN(target.getTime())) return "DATE TBA";

    const difference = target.getTime() - Date.now();
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    if (days < 0) return "IN PROGRESS";
    if (days === 0) return "STARTS TODAY";
    if (days === 1) return "STARTS TOMORROW";

    return `STARTS IN ${days} DAYS`;
}

function formatTournamentPeriod(startValue, endValue) {
    if (!startValue) return "Schedule TBA";

    const start = new Date(startValue);
    const end = endValue ? new Date(endValue) : null;

    if (Number.isNaN(start.getTime())) return "Schedule TBA";

    const startDate = start.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

    if (!end || Number.isNaN(end.getTime())) return startDate;

    const endDate = end.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

    return `${startDate} — ${endDate}`;
}

function getTournamentStatus(status) {
    const normalized = status?.toLowerCase()?.trim();

    const statuses = {
        pending: { type: "pending", label: "Registration Pending", color: "var(--accent-gold)" },
        approved: { type: "confirmed", label: "Registration Approved", color: "var(--accent-gold)" },
        confirmed: { type: "confirmed", label: "Registration Confirmed", color: "var(--accent-gold)" },
        rejected: { type: "danger", label: "Registration Rejected", color: "var(--status-danger, #ef4444)" },
        cancelled: { type: "danger", label: "Tournament Cancelled", color: "var(--status-danger, #ef4444)" },
    };

    return statuses[normalized] || { type: "pending", label: "Registration Pending", color: "var(--accent-gold)" };
}

function formatCurrency(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return "0";

    return Number(value).toLocaleString("en-IN");
}