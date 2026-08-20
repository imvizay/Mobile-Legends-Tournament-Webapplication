import React, { useEffect, useState } from "react";
import { ArrowUpRight, Eye, Shield, Trophy, Users, Zap, Timer } from "lucide-react";

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

export default function FeaturedTournamentCard({ tournament, onRegister, onViewDetails }) {
    const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(tournament.registrationEndsAt));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft(tournament.registrationEndsAt));
        }, 1000);

        return () => clearInterval(timer);
    }, [tournament.registrationEndsAt]);

    const registrationOpen = Boolean(timeLeft);

    const teamPercentage = tournament.teamCapacity > 0 ? Math.min(100, (tournament.registeredTeams / tournament.teamCapacity) * 100) : 0;

    return (
        <section className="w-full">

            {/* Section Heading */}
            <div className="hidden sm:flex mb-4 flex items-end justify-between gap-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="h-px w-6 shrink-0 bg-[var(--accent-gold)]" />
                        <p className="whitespace-nowrap font-['Barlow_Condensed'] text-[8px] font-bold uppercase tracking-[0.22em] text-[var(--accent-gold)]">
                            Featured
                        </p>
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                        <h2 className="truncate font-['Rajdhani'] text-[20px] font-bold uppercase leading-none tracking-[-0.01em] text-[var(--text-primary)]">
                            Featured Tournament
                        </h2>

                        <span className="hidden h-4 w-px bg-[var(--border-default)] sm:block" />

                        <span className="hidden whitespace-nowrap font-['Barlow_Condensed'] text-[7px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] sm:block">
                            Live Opportunity
                        </span>
                    </div>
                </div>

                <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
                    <Eye className="size-3 text-[var(--text-muted)]" strokeWidth={1.7} />
                    <span className="font-['Barlow_Condensed'] text-[7px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                        Featured Event
                    </span>
                </div>
            </div>

            {/* Featured Card */}
            <article className="relative isolate min-h-fit sm:min-h-[600px] overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-white/60 text-[var(--text-primary)] shadow-[0_18px_60px_rgba(40,30,10,0.08)] backdrop-blur-2xl sm:min-h-[570px] md:h-[360px] md:min-h-0 md:rounded-[24px]">

                {/* Background */}
                <img src={tournament.backgroundImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[0.42]" />

                {/* Soft Light Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(255,255,255,.98)_0%,rgba(255,255,255,.94)_30%,rgba(255,255,255,.72)_56%,rgba(255,255,255,.34)_100%)]" />

                {/* Bottom Fade */}
                <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-white/95 via-white/45 to-transparent" />

                {/* Gold Ambient Light */}
                <div className="absolute -right-28 top-1/2 size-[360px] -translate-y-1/2 rounded-full bg-[var(--accent-gold)]/[0.12] blur-[100px] sm:size-[400px]" />

                {/* Decorative Grid */}
                <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(80,65,35,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(80,65,35,.8)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

                {/* Decorative Corner */}
                <div className="pointer-events-none absolute right-[-80px] top-[-100px] size-[250px] rotate-45 border border-[var(--accent-gold)]/[0.10] sm:size-[280px]" />

                <div className="relative flex h-full flex-col p-4 sm:p-6 md:p-7">

                    {/* Top Row */}
                    <div className="flex items-center justify-between gap-2.5">

                        <div className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[7px] font-semibold uppercase tracking-[0.14em] backdrop-blur-xl sm:gap-2 sm:px-3 sm:text-[8px] ${registrationOpen ? "border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/[0.10] text-[var(--accent-gold)]" : "border-[var(--border-default)] bg-white/55 text-[var(--text-muted)]"}`}>
                            {registrationOpen && <span className="size-1.5 rounded-full bg-[var(--accent-gold)]" />}
                            {registrationOpen ? "Registration Open" : "Registration Closed"}
                        </div>

                        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-white/55 px-2.5 py-1.5 text-[7px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] backdrop-blur-xl sm:gap-2 sm:px-3 sm:text-[8px]">
                            <Shield className="size-3 text-[var(--accent-gold)]" strokeWidth={1.8} />
                            MLBB 5V5
                        </div>

                    </div>

                    {/* Main Content */}
                    <div className="mt-9 max-w-[650px] md:mt-5 md:flex md:flex-1 md:flex-col md:justify-center">

                        <div className="mb-2.5 flex items-center gap-2 sm:mb-3">
                            <span className="h-px w-6 bg-[var(--accent-gold)] sm:w-7" />

                            <p className="text-[7px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-gold)] sm:text-[8px] sm:tracking-[0.25em]">
                                Tactix Presents · Season 01
                            </p>
                        </div>

                        <h2 className="max-w-[650px] text-[31px] font-semibold uppercase leading-[0.92] tracking-[-0.035em] text-[var(--text-primary)] sm:text-[42px] md:text-[52px]">
                            {tournament.name}
                        </h2>

                        <p className="mt-3 max-w-[500px] text-[10px] leading-[1.6] text-[var(--text-secondary)] sm:mt-4 sm:text-[12px]">
                            {tournament.description}
                        </p>

                    </div>

                    {/* Mobile Stats */}
                    <div className="mt-7 grid grid-cols-2 gap-2 sm:mt-8 md:hidden">

                        <GlassMetric className="col-span-2">
                            <MetricIcon>
                                <Timer className="size-4 text-[var(--accent-gold)]" strokeWidth={1.8} />
                            </MetricIcon>

                            <div className="min-w-0">
                                <MetricLabel>Registration Ends</MetricLabel>

                                <div className="mt-1 flex items-end gap-0.5 overflow-hidden sm:gap-1">
                                    <FlipUnit value={timeLeft?.days ?? 0} label="Days" />
                                    <span className="mb-4 text-[var(--text-muted)]">:</span>
                                    <FlipUnit value={timeLeft?.hours ?? 0} label="Hrs" />
                                    <span className="mb-4 text-[var(--text-muted)]">:</span>
                                    <FlipUnit value={timeLeft?.minutes ?? 0} label="Min" />
                                    <span className="mb-4 text-[var(--text-muted)]">:</span>
                                    <FlipUnit value={timeLeft?.seconds ?? 0} label="Sec" />
                                </div>
                            </div>
                        </GlassMetric>

                        <GlassMetric>
                            <MetricIcon>
                                <Trophy className="size-4 text-[var(--accent-gold)]" strokeWidth={1.8} />
                            </MetricIcon>

                            <div className="min-w-0">
                                <MetricLabel>Prize Pool</MetricLabel>

                                <p className="mt-1 truncate text-[18px] font-semibold leading-none text-[var(--text-primary)] sm:text-[20px]">
                                    {tournament.prizePool}
                                </p>
                            </div>
                        </GlassMetric>

                        <GlassMetric>
                            <MetricIcon>
                                <Users className="size-4 text-[var(--text-secondary)]" strokeWidth={1.8} />
                            </MetricIcon>

                            <div className="min-w-0">
                                <MetricLabel>Teams</MetricLabel>

                                <p className="mt-1 text-[18px] font-semibold leading-none text-[var(--text-primary)] sm:text-[20px]">
                                    {tournament.registeredTeams}
                                    <span className="text-[10px] text-[var(--text-muted)] sm:text-[11px]">/{tournament.teamCapacity}</span>
                                </p>

                                <div className="mt-2 h-[2px] w-full max-w-[75px] overflow-hidden rounded-full bg-black/[0.07]">
                                    <div className="h-full rounded-full bg-[var(--accent-gold)]" style={{ width: `${teamPercentage}%` }} />
                                </div>
                            </div>
                        </GlassMetric>

                    </div>

                    {/* Mobile Actions */}
                    <div className="mt-3 grid grid-cols-2 gap-2 md:hidden">

                        <button type="button" disabled={!registrationOpen} onClick={onRegister} className={`group relative flex h-11 items-center justify-center gap-2 overflow-hidden rounded-xl text-[8px] font-semibold uppercase tracking-[0.12em] sm:text-[9px] sm:tracking-[0.14em] ${registrationOpen ? "bg-[var(--accent-gold)] text-white" : "cursor-not-allowed bg-black/[0.05] text-[var(--text-muted)]"}`}>
                            {registrationOpen && <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 opacity-0 transition-all duration-500 group-hover:left-[120%] group-hover:opacity-100" />}
                            <Zap className="relative size-3.5" fill="currentColor" />
                            <span className="relative">{registrationOpen ? "Join Battle" : "Closed"}</span>
                        </button>

                        <button type="button" onClick={onViewDetails} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-white/55 text-[8px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)] backdrop-blur-xl sm:text-[9px] sm:tracking-[0.14em]">
                            Details
                            <ArrowUpRight className="size-3.5" strokeWidth={1.8} />
                        </button>

                    </div>

                    {/* Desktop Bottom Strip */}
                    <div className="mt-auto hidden items-end justify-between gap-5 md:flex">

                        <div className="flex items-center gap-2">

                            <button type="button" disabled={!registrationOpen} onClick={onRegister} className={`group relative inline-flex h-10 items-center gap-2 overflow-hidden rounded-xl px-5 text-[9px] font-semibold uppercase tracking-[0.14em] ${registrationOpen ? "bg-[var(--accent-gold)] text-white" : "cursor-not-allowed bg-black/[0.05] text-[var(--text-muted)]"}`}>
                                {registrationOpen && <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 opacity-0 transition-all duration-500 group-hover:left-[120%] group-hover:opacity-100" />}
                                <Zap className="relative size-3.5" fill="currentColor" />
                                <span className="relative">{registrationOpen ? "Join Battle" : "Closed"}</span>
                            </button>

                            <button type="button" onClick={onViewDetails} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border-default)] bg-white/55 px-5 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)] backdrop-blur-xl">
                                View Details
                                <ArrowUpRight className="size-3.5" strokeWidth={1.8} />
                            </button>

                        </div>

                        {/* Glass Information Strip */}
                        <div className="flex h-[74px] overflow-hidden rounded-2xl border border-white/80 bg-white/55 shadow-[0_12px_40px_rgba(50,40,20,0.08)] backdrop-blur-2xl">

                            <div className="flex min-w-[245px] items-center gap-3 px-4">
                                <MetricIcon>
                                    <Timer className="size-4 text-[var(--accent-gold)]" strokeWidth={1.8} />
                                </MetricIcon>

                                <div>
                                    <MetricLabel>Registration Ends</MetricLabel>

                                    <div className="mt-1 flex items-end gap-1.5">
                                        <FlipUnit value={timeLeft?.days ?? 0} label="Days" />
                                        <span className="mb-4 text-[var(--text-muted)]">:</span>
                                        <FlipUnit value={timeLeft?.hours ?? 0} label="Hours" />
                                        <span className="mb-4 text-[var(--text-muted)]">:</span>
                                        <FlipUnit value={timeLeft?.minutes ?? 0} label="Minutes" />
                                        <span className="mb-4 text-[var(--text-muted)]">:</span>
                                        <FlipUnit value={timeLeft?.seconds ?? 0} label="Seconds" />
                                    </div>
                                </div>
                            </div>

                            <StatDivider />

                            <div className="flex min-w-[145px] items-center gap-3 px-4">
                                <MetricIcon>
                                    <Trophy className="size-4 text-[var(--accent-gold)]" strokeWidth={1.8} />
                                </MetricIcon>

                                <div>
                                    <MetricLabel>Prize Pool</MetricLabel>

                                    <p className="mt-1 text-[21px] font-semibold leading-none text-[var(--text-primary)]">
                                        {tournament.prizePool}
                                    </p>
                                </div>
                            </div>

                            <StatDivider />

                            <div className="flex min-w-[140px] items-center gap-3 px-4">
                                <MetricIcon>
                                    <Users className="size-4 text-[var(--text-secondary)]" strokeWidth={1.8} />
                                </MetricIcon>

                                <div>
                                    <MetricLabel>Teams</MetricLabel>

                                    <p className="mt-1 text-[21px] font-semibold leading-none text-[var(--text-primary)]">
                                        {tournament.registeredTeams}
                                        <span className="text-[11px] text-[var(--text-muted)]">/{tournament.teamCapacity}</span>
                                    </p>

                                    <div className="mt-2 h-[2px] w-[78px] overflow-hidden rounded-full bg-black/[0.07]">
                                        <div className="h-full rounded-full bg-[var(--accent-gold)]" style={{ width: `${teamPercentage}%` }} />
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

                {/* Accent Line */}
                <div className="absolute bottom-0 left-0 h-[2px] w-[38%] bg-gradient-to-r from-[var(--accent-gold)] to-transparent" />

            </article>
        </section>
    );
}

function GlassMetric({ children, className = "" }) {
    return (
        <div className={`relative overflow-hidden rounded-xl border border-white/80 bg-white/50 px-3 py-3 backdrop-blur-xl ${className}`}>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-transparent" />
            <div className="relative flex items-center gap-3">
                {children}
            </div>
        </div>
    );
}

function MetricIcon({ children }) {
    return (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-default)] bg-white/60">
            {children}
        </div>
    );
}

function MetricLabel({ children }) {
    return (
        <p className="text-[7px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {children}
        </p>
    );
}

function StatDivider() {
    return (
        <div className="my-4 w-px bg-gradient-to-b from-transparent via-[var(--border-default)] to-transparent" />
    );
}