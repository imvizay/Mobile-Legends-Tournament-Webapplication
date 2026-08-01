import React, { useEffect, useState } from "react";
import { ArrowUpRight, CalendarClock, ShieldCheck, Trophy, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FlipUnit from "./countdown/FlipUnit";

function getTimeLeft(targetDate) {
    const difference = new Date(targetDate).getTime() - Date.now();

    if (difference <= 0) return null;

    return {
        days: Math.floor(difference / 86400000),
        hours: Math.floor((difference / 3600000) % 24),
        minutes: Math.floor((difference / 60000) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    };
}

export default function FeaturedTournamentCard({ tournament, onRegister }) {
    const navigate = useNavigate();

    const registeredTeams = tournament.joined_teams ?? 0;
    const prizePool = tournament.prize_pool ?? 2000;

    const tournamentStartDateTime = `${tournament.tournament_start_date}T${tournament.tournament_start_time}`;

    const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(tournamentStartDateTime));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft(tournamentStartDateTime));
        }, 1000);

        return () => clearInterval(timer);
    }, [tournamentStartDateTime]);

    const registrationOpen = tournament.registration_status === "upcoming";

    const teamPercentage = tournament.max_teams > 0 ? Math.min((registeredTeams / tournament.max_teams) * 100, 100) : 0;

    return (
        <section className="w-full">
            <article className="group relative isolate overflow-hidden rounded-[18px] border border-[var(--border-default)] bg-[#090909] text-white sm:rounded-[22px] lg:rounded-[24px]">

                {/* Background */}
                <div className="absolute inset-0">
                    {tournament.background_image_url && <img src={tournament.background_image_url} alt="" className="h-full w-full object-cover object-[65%_center] opacity-[0.38] transition-transform duration-1000 ease-out sm:object-center sm:opacity-[0.52] lg:opacity-[0.62] lg:group-hover:scale-[1.02]" />}

                    {/* Mobile overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,.78)_0%,rgba(7,7,7,.88)_45%,rgba(7,7,7,.98)_100%)] sm:bg-[linear-gradient(100deg,rgba(6,6,6,.97)_0%,rgba(6,6,6,.88)_40%,rgba(6,6,6,.48)_100%)]" />

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,.04),transparent_35%)]" />
                </div>

                {/* Ambient */}
                <div className="pointer-events-none absolute -right-28 top-[35%] size-[260px] rounded-full bg-[var(--accent-gold)]/[0.08] blur-[100px] sm:-right-20 sm:size-[380px] lg:size-[480px]" />

                {/* Grid */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:32px_32px] sm:opacity-[0.03] sm:[background-size:38px_38px]" />

                <div className="relative flex min-h-[390px] flex-col px-3.5 py-3.5 sm:min-h-[440px] sm:p-5 md:min-h-[420px] md:p-6 lg:min-h-[430px] lg:p-7">

                    {/* Top Row */}
                    <div className="flex items-center justify-between gap-2">
                        <div className={`inline-flex min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 backdrop-blur-xl sm:gap-2 sm:px-2.5 ${registrationOpen ? "border-[var(--accent-gold)]/25 bg-[var(--accent-gold)]/[0.08]" : "border-white/[0.12] bg-black/20"}`}>
                            <span className={`size-1.5 shrink-0 rounded-full ${registrationOpen ? "bg-[var(--accent-gold)]" : "bg-white/30"}`} />

                            <span className={`truncate text-[6px] font-bold uppercase tracking-[0.13em] sm:text-[8px] sm:tracking-[0.16em] ${registrationOpen ? "text-[var(--accent-gold)]" : "text-white/50"}`}>
                                {registrationOpen ? "Registration Open" : "Registration Closed"}
                            </span>
                        </div>

                        <div className="flex shrink-0 items-center gap-1 text-[6px] font-bold uppercase tracking-[0.1em] text-white/40 sm:gap-1.5 sm:text-[8px] sm:tracking-[0.15em]">
                            <ShieldCheck size={10} className="sm:size-3" />
                            <span className="hidden xs:inline">{tournament.game_name || "MLBB"} · 5V5</span>
                            <span className="xs:hidden">5V5</span>
                        </div>
                    </div>

                    {/* Hero */}
                    <div className="flex flex-1 flex-col justify-center py-6 sm:py-7 md:py-5">

                        <div className="mb-2.5 flex items-center gap-2 sm:mb-3">
                            <span className="h-px w-5 bg-[var(--accent-gold)] sm:w-8" />

                            <span className="text-[6px] font-bold uppercase tracking-[0.18em] text-[var(--accent-gold)] sm:text-[8px] sm:tracking-[0.22em]">
                                Featured Championship
                            </span>
                        </div>

                        <h1 className="max-w-[820px] break-words font-['Rajdhani'] text-[clamp(32px,10vw,68px)] font-bold uppercase leading-[0.88] tracking-[-0.04em] sm:tracking-[-0.035em]">
                            {tournament.tournament_name}
                        </h1>

                        {/* Metadata */}
                        <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[7px] font-semibold uppercase tracking-[0.1em] text-white/50 sm:mt-4 sm:gap-x-3 sm:text-[9px] sm:tracking-[0.13em]">
                            <span>{tournament.server?.toUpperCase() || "INDIA"} SERVER</span>

                            <span className="size-1 rounded-full bg-[var(--accent-gold)]/70" />

                            <span>{tournament.tournament_type || "Competitive Event"}</span>

                            <span className="hidden size-1 rounded-full bg-[var(--accent-gold)]/70 xs:block" />

                            <span className="hidden xs:inline">Season 01</span>
                        </div>

                        <p className="mt-3 max-w-[560px] text-[9px] leading-[1.65] text-white/55 sm:mt-4 sm:text-[11px] sm:leading-6">
                            Compete against skilled teams, progress through the tournament bracket, and fight for championship rewards.
                        </p>

                        {/* Actions */}
                        <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:flex-row sm:gap-2.5">

                            <button type="button" disabled={!registrationOpen} onClick={() => onRegister?.(tournament.id)} className={`group/btn relative flex h-10 min-w-0 items-center justify-center gap-1.5 overflow-hidden rounded-lg px-3 text-[7px] font-bold uppercase tracking-[0.1em] transition-transform active:scale-[0.98] sm:h-11 sm:px-5 sm:text-[9px] sm:tracking-[0.14em] sm:hover:-translate-y-px ${registrationOpen ? "bg-[var(--accent-gold)] text-white" : "cursor-not-allowed bg-white/[0.08] text-white/35"}`}>
                                {registrationOpen && <span className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 opacity-0 transition-all duration-500 group-hover/btn:left-[120%] group-hover/btn:opacity-100" />}

                                <Zap size={11} className="shrink-0 sm:size-[13px]" fill="currentColor" />

                                <span className="truncate">{registrationOpen ? "Join Now" : "Closed"}</span>
                            </button>

                            <button type="button" onClick={() => navigate(`/player/tournament/${tournament.id}/detail`)} className="flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-white/[0.14] bg-black/[0.22] px-3 text-[7px] font-bold uppercase tracking-[0.1em] text-white/70 backdrop-blur-xl transition-transform active:scale-[0.98] sm:h-11 sm:px-5 sm:text-[9px] sm:tracking-[0.14em] sm:hover:-translate-y-px">
                                <span className="truncate">Details</span>
                                <ArrowUpRight size={11} className="shrink-0 sm:size-[13px]" />
                            </button>

                        </div>
                    </div>

                    {/* Intelligence */}
                    <div className="overflow-hidden rounded-xl border border-white/[0.10] bg-black/[0.32] backdrop-blur-xl">

                        {/* Mobile + Desktop Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-3">

                            {/* Countdown */}
                            <div className="col-span-2 border-b border-white/[0.10] px-3 py-3 sm:col-span-1 sm:border-b-0 sm:border-r sm:px-4 sm:py-3.5">

                                <div className="flex items-center gap-1.5 text-white/45 sm:gap-2">
                                    <CalendarClock size={11} className="text-[var(--accent-gold)] sm:size-3" />

                                    <span className="text-[6px] font-bold uppercase tracking-[0.13em] sm:text-[7px] sm:tracking-[0.15em]">
                                        Starts In
                                    </span>
                                </div>

                                <div className="mt-2 flex items-end justify-between gap-0.5 overflow-hidden sm:justify-start sm:gap-1">
                                    <FlipUnit value={timeLeft?.days ?? 0} label="D" />

                                    <span className="mb-3 text-[10px] text-white/25 sm:mb-4">:</span>

                                    <FlipUnit value={timeLeft?.hours ?? 0} label="H" />

                                    <span className="mb-3 text-[10px] text-white/25 sm:mb-4">:</span>

                                    <FlipUnit value={timeLeft?.minutes ?? 0} label="M" />

                                    <span className="mb-3 text-[10px] text-white/25 sm:mb-4">:</span>

                                    <FlipUnit value={timeLeft?.seconds ?? 0} label="S" />
                                </div>

                            </div>

                            {/* Prize */}
                            <div className="border-r border-white/[0.10] px-3 py-3 sm:border-r sm:px-4 sm:py-3.5">

                                <div className="flex items-center gap-1.5 text-white/45 sm:gap-2">
                                    <Trophy size={11} className="text-[var(--accent-gold)] sm:size-3" />

                                    <span className="text-[6px] font-bold uppercase tracking-[0.12em] sm:text-[7px] sm:tracking-[0.15em]">
                                        Prize
                                    </span>
                                </div>

                                <p className="mt-2 font-['Rajdhani'] text-[22px] font-bold leading-none tracking-tight text-[var(--accent-gold)] sm:text-[30px]">
                                    ₹{Number(prizePool).toLocaleString("en-IN")}
                                </p>

                            </div>

                            {/* Teams */}
                            <div className="px-3 py-3 sm:px-4 sm:py-3.5">

                                <div className="flex items-center gap-1.5 text-white/45 sm:gap-2">
                                    <Users size={11} className="sm:size-3" />

                                    <span className="text-[6px] font-bold uppercase tracking-[0.12em] sm:text-[7px] sm:tracking-[0.15em]">
                                        Teams
                                    </span>
                                </div>

                                <div className="mt-2 flex items-end gap-1">
                                    <p className="font-['Rajdhani'] text-[22px] font-bold leading-none tracking-tight sm:text-[30px]">
                                        {registeredTeams}
                                    </p>

                                    <span className="mb-0.5 text-[7px] text-white/35 sm:mb-1 sm:text-[9px]">
                                        / {tournament.max_teams}
                                    </span>
                                </div>

                                <div className="mt-2 h-[2px] w-full overflow-hidden bg-white/[0.08]">
                                    <div className="h-full bg-[var(--accent-gold)] transition-all duration-700" style={{ width: `${teamPercentage}%` }} />
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

                {/* Accent */}
                <div className="absolute bottom-0 left-0 h-px w-[55%] bg-gradient-to-r from-[var(--accent-gold)] via-[var(--accent-gold)]/45 to-transparent sm:h-[2px] sm:w-[42%]" />

            </article>
        </section>
    );
}