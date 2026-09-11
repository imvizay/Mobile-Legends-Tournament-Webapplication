
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
    const tournamentStartDateTime = tournament.starts_at;

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
            <article className="group relative isolate overflow-hidden rounded-[16px] border border-[var(--border-default)] bg-[#090909] text-white sm:rounded-[19px] lg:rounded-[20px]">
                <div className="absolute inset-0">
                    {tournament.background_image_url && <img src={tournament.background_image_url} alt="" className="h-full w-full object-cover object-[65%_center] opacity-[0.42] transition-transform duration-1000 ease-out sm:object-center sm:opacity-[0.52] lg:opacity-[0.58] lg:group-hover:scale-[1.02]" />}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,.72)_0%,rgba(7,7,7,.84)_42%,rgba(7,7,7,.97)_100%)] sm:bg-[linear-gradient(100deg,rgba(6,6,6,.96)_0%,rgba(6,6,6,.82)_42%,rgba(6,6,6,.42)_100%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,.04),transparent_35%)]" />
                </div>

                <div className="pointer-events-none absolute -right-24 top-[32%] size-[220px] rounded-full bg-[var(--accent-gold)]/[0.08] blur-[90px] sm:-right-16 sm:size-[300px] lg:size-[380px]" />
                <div className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:30px_30px] sm:opacity-[0.025] sm:[background-size:36px_36px]" />

                <div className="relative flex min-h-[350px] flex-col px-3.5 py-3 sm:min-h-[365px] sm:p-4.5 md:min-h-[350px] md:p-5 lg:min-h-[360px] lg:p-5.5">
                    <div className="flex items-center justify-between gap-2">
                        <div className={`inline-flex min-w-0 items-center gap-1.5 rounded-md border px-2 py-1 backdrop-blur-xl sm:gap-2 sm:px-2.5 sm:py-1.5 ${registrationOpen ? "border-[var(--accent-gold)]/25 bg-[var(--accent-gold)]/[0.08]" : "border-white/[0.12] bg-black/20"}`}>
                            <span className={`size-1.5 shrink-0 rounded-full ${registrationOpen ? "bg-[var(--accent-gold)]" : "bg-white/30"}`} />
                            <span className={`truncate text-[6px] font-bold uppercase tracking-[0.13em] sm:text-[7px] sm:tracking-[0.16em] ${registrationOpen ? "text-[var(--accent-gold)]" : "text-white/50"}`}>
                                {registrationOpen ? "Registration Open" : "Registration Closed"}
                            </span>
                        </div>

                        <div className="flex shrink-0 items-center gap-1 text-[6px] font-bold uppercase tracking-[0.1em] text-white/40 sm:gap-1.5 sm:text-[7px] sm:tracking-[0.15em]">
                            <ShieldCheck size={10} className="sm:size-3" />
                            <span className="hidden xs:inline">{tournament.game_name || "MLBB"} · 5V5</span>
                            <span className="xs:hidden">5V5</span>
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-center py-5 sm:py-5 md:py-4">
                        <div className="mb-2 flex items-center gap-2 sm:mb-2.5">
                            <span className="h-px w-5 bg-[var(--accent-gold)] sm:w-7" />
                            <span className="text-[6px] font-bold uppercase tracking-[0.18em] text-[var(--accent-gold)] sm:text-[7px] sm:tracking-[0.22em]">
                                Featured Championship
                            </span>
                        </div>

                        <h1 className="max-w-[720px] break-words font-['Rajdhani'] text-[clamp(30px,7vw,54px)] font-bold uppercase leading-[0.88] tracking-[-0.04em]">
                            {tournament.tournament_name}
                        </h1>

                        <div className="mt-2.5 flex flex-nowrap items-center gap-x-2.5 overflow-hidden whitespace-nowrap text-[6px] font-semibold uppercase tracking-[0.1em] text-white/50 sm:mt-3 sm:gap-x-3 sm:text-[8px] sm:tracking-[0.13em]">
                            <span className="shrink-0">{tournament.server?.toUpperCase() || "INDIA"} SERVER</span>
                            <span className="size-1 shrink-0 rounded-full bg-[var(--accent-gold)]/70" />
                            <span className="shrink-0">{tournament.tournament_type || "Competitive Event"}</span>
                            <span className="size-1 shrink-0 rounded-full bg-[var(--accent-gold)]/70" />
                            <span className="shrink-0">Season 01</span>
                        </div>

                        <p className="mt-2.5 max-w-[500px] text-[8px] leading-[1.6] text-white/55 sm:mt-3 sm:text-[10px] sm:leading-5">
                            Compete against skilled teams, progress through the tournament bracket, and fight for championship rewards.
                        </p>

                        <div className="mt-4 flex flex-row gap-2 sm:mt-4.5 sm:gap-2.5">
                            <button type="button" disabled={!registrationOpen} onClick={() => onRegister?.(tournament.id)} className={`group/btn relative flex h-9 min-w-0 items-center justify-center gap-1.5 overflow-hidden rounded-lg px-3 text-[6.5px] font-bold uppercase tracking-[0.1em] transition-transform active:scale-[0.98] sm:h-10 sm:px-4.5 sm:text-[8px] sm:tracking-[0.14em] sm:hover:-translate-y-px ${registrationOpen ? "bg-[var(--accent-gold)] text-white" : "cursor-not-allowed bg-white/[0.08] text-white/35"}`}>
                                {registrationOpen && <span className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 opacity-0 transition-all duration-500 group-hover/btn:left-[120%] group-hover/btn:opacity-100" />}
                                <Zap size={10} className="shrink-0 sm:size-[12px]" fill="currentColor" />
                                <span className="truncate">{registrationOpen ? "Join Now" : "Closed"}</span>
                            </button>

                            <button type="button" onClick={() => navigate(`/player/tournament/${tournament.id}/detail`)} className="flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-lg border border-white/[0.14] bg-black/[0.22] px-3 text-[6.5px] font-bold uppercase tracking-[0.1em] text-white/70 backdrop-blur-xl transition-transform active:scale-[0.98] sm:h-10 sm:px-4.5 sm:text-[8px] sm:tracking-[0.14em] sm:hover:-translate-y-px">
                                <span className="truncate">Details</span>
                                <ArrowUpRight size={10} className="shrink-0 sm:size-[12px]" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[10px] border border-white/[0.10] bg-black/[0.32] backdrop-blur-xl sm:rounded-xl">
                        <div className="grid grid-cols-2 sm:grid-cols-3">
                            <div className="col-span-2 border-b border-white/[0.10] px-3 py-2.5 sm:col-span-1 sm:border-b-0 sm:border-r sm:px-3.5 sm:py-3">
                                <div className="flex items-center gap-1.5 text-white/45 sm:gap-2">
                                    <CalendarClock size={10} className="text-[var(--accent-gold)] sm:size-3" />
                                    <span className="text-[6px] font-bold uppercase tracking-[0.13em] sm:text-[7px] sm:tracking-[0.15em]">Starts In</span>
                                </div>

                                <div className="mt-1.5 flex items-end justify-between gap-0.5 overflow-hidden sm:justify-start sm:gap-1">
                                    <FlipUnit value={timeLeft?.days ?? 0} label="D" />
                                    <span className="mb-2.5 text-[9px] text-white/25 sm:mb-3.5">:</span>
                                    <FlipUnit value={timeLeft?.hours ?? 0} label="H" />
                                    <span className="mb-2.5 text-[9px] text-white/25 sm:mb-3.5">:</span>
                                    <FlipUnit value={timeLeft?.minutes ?? 0} label="M" />
                                    <span className="mb-2.5 text-[9px] text-white/25 sm:mb-3.5">:</span>
                                    <FlipUnit value={timeLeft?.seconds ?? 0} label="S" />
                                </div>
                            </div>

                            <div className="border-r border-white/[0.10] px-3 py-2.5 sm:px-3.5 sm:py-3">
                                <div className="flex items-center gap-1.5 text-white/45 sm:gap-2">
                                    <Trophy size={10} className="text-[var(--accent-gold)] sm:size-3" />
                                    <span className="text-[6px] font-bold uppercase tracking-[0.12em] sm:text-[7px] sm:tracking-[0.15em]">Prize</span>
                                </div>

                                <p className="mt-1.5 font-['Rajdhani'] text-[20px] font-bold leading-none tracking-tight text-[var(--accent-gold)] sm:text-[27px]">
                                    ₹{Number(prizePool).toLocaleString("en-IN")}
                                </p>
                            </div>

                            <div className="px-3 py-2.5 sm:px-3.5 sm:py-3">
                                <div className="flex items-center gap-1.5 text-white/45 sm:gap-2">
                                    <Users size={10} className="sm:size-3" />
                                    <span className="text-[6px] font-bold uppercase tracking-[0.12em] sm:text-[7px] sm:tracking-[0.15em]">Teams</span>
                                </div>

                                <div className="mt-1.5 flex items-end gap-1">
                                    <p className="font-['Rajdhani'] text-[20px] font-bold leading-none tracking-tight sm:text-[27px]">
                                        {registeredTeams}
                                    </p>
                                    <span className="mb-0.5 text-[7px] text-white/35 sm:mb-1 sm:text-[8px]">
                                        / {tournament.max_teams}
                                    </span>
                                </div>

                                <div className="mt-1.5 h-[2px] w-full overflow-hidden bg-white/[0.08]">
                                    <div className="h-full bg-[var(--accent-gold)] transition-all duration-700" style={{ width: `${teamPercentage}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 h-px w-[55%] bg-gradient-to-r from-[var(--accent-gold)] via-[var(--accent-gold)]/45 to-transparent sm:h-[2px] sm:w-[42%]" />
            </article>
        </section>
    );
}

