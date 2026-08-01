import React, { useRef } from "react";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Trophy, Users, Zap } from "lucide-react";

function UpcomingTournamentGrid({ tournaments = [], onViewDetails, onRegister }) {
    const sliderRef = useRef(null);

    const scroll = (direction) => {
        const slider = sliderRef.current;

        if (!slider) return;

        const amount = window.innerWidth < 640 ? window.innerWidth * 0.78 : 320;

        slider.scrollBy({
            left: direction === "next" ? amount : -amount,
            behavior: "smooth",
        });
    };

    if (!tournaments.length) return null;

    return (
        <section className="w-full min-w-0">
            {/* Section Header */}
            <div className="mb-3 flex items-end justify-between gap-3 sm:mb-4">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="h-px w-5 shrink-0 bg-[var(--accent-gold)] sm:w-6" />
                        <p className="font-['Barlow_Condensed'] text-[7px] font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)] sm:text-[8px] sm:tracking-[0.22em]">Next On The Line</p>
                    </div>

                    <div className="mt-1.5 flex min-w-0 items-center gap-2 sm:gap-2.5">
                        <h2 className="truncate font-['Rajdhani'] text-[20px] font-bold uppercase leading-none tracking-tight text-[var(--text-primary)] xs:text-[22px] sm:text-[24px]">Upcoming Tournaments</h2>

                        <span className="hidden h-4 w-px shrink-0 bg-[var(--border-default)] sm:block" />

                        <span className="hidden font-['Barlow_Condensed'] text-[8px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] sm:block">{tournaments.length} Scheduled Events</span>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex shrink-0 items-center gap-1.5">
                    <button type="button" onClick={() => scroll("prev")} aria-label="Previous tournaments" className="flex size-9 items-center justify-center border border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-muted)] transition-colors hover:border-[var(--accent-gold)]/40 hover:text-[var(--accent-gold)] active:scale-95 sm:size-8">
                        <ChevronLeft className="size-4 sm:size-3.5" />
                    </button>

                    <button type="button" onClick={() => scroll("next")} aria-label="Next tournaments" className="flex size-9 items-center justify-center bg-[var(--accent-gold)] text-black transition-transform hover:-translate-y-px active:scale-95 sm:size-8">
                        <ChevronRight className="size-4 sm:size-3.5" />
                    </button>
                </div>
            </div>

            {/* Tournament Rail */}
            <div ref={sliderRef} className="-mx-1 w-[calc(100%+0.5rem)] min-w-0 overflow-x-auto overflow-y-hidden overscroll-x-contain px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:w-full sm:px-0">

                <div className="flex w-max gap-3 sm:gap-4">
                    {tournaments.map((tournament) => {
                        const registeredTeams = tournament.joined_teams ?? 0;
                        const entryFee = tournament.entry_fee ?? 0;
                        const isComingSoon = tournament.registration_status === "upcoming";

                        const teamPercentage = tournament.max_teams > 0 ? Math.min(100, (registeredTeams / tournament.max_teams) * 100) : 0;

                        const format = "MLBB 5V5";
                        const category = "Mobile Legends";
                        const tournamentDate = tournament.tournament_start_date;

                        return (
                            <article key={tournament.id} className="group relative w-[82vw] max-w-[330px] shrink-0 overflow-hidden rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-base)] transition-transform duration-300 sm:w-[300px] sm:rounded-[14px] md:w-[320px]">

                                {/* Tournament Visual */}
                                <div className="relative h-[210px] overflow-hidden bg-black xs:h-[220px] sm:h-[205px] md:h-[220px]">
                                    <img src={tournament.background_image_url} alt={tournament.tournament_name} className="h-full w-full object-cover transition-transform duration-700 ease-out sm:group-hover:scale-[1.035]" />

                                    {/* Cinematic overlays */}
                                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.25)_0%,rgba(0,0,0,.08)_35%,rgba(0,0,0,.94)_100%)]" />
                                    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.58)_0%,transparent_70%)]" />

                                    {/* Status */}
                                    <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
                                        <div className={`inline-flex max-w-[60%] items-center gap-1.5 border px-2 py-1 backdrop-blur-xl ${isComingSoon ? "border-white/[0.12] bg-black/[0.35] text-white/55" : "border-[var(--accent-gold)]/30 bg-black/[0.45] text-[var(--accent-gold)]"}`}>
                                            {!isComingSoon && <span className="size-1.5 shrink-0 rounded-full bg-[var(--accent-gold)] shadow-[0_0_8px_var(--accent-gold)]" />}
                                            <span className="truncate font-['Barlow_Condensed'] text-[7px] font-bold uppercase tracking-[0.14em]">{isComingSoon ? "Coming Soon" : "Registration Open"}</span>
                                        </div>

                                        <span className="shrink-0 border border-white/[0.12] bg-black/[0.35] px-2 py-1 font-['Barlow_Condensed'] text-[7px] font-bold uppercase tracking-[0.12em] text-white/65 backdrop-blur-xl">{format}</span>
                                    </div>

                                    {/* Tournament Identity */}
                                    <div className="absolute inset-x-3 bottom-3">
                                        <div className="mb-1 flex items-center gap-2">
                                            <span className="h-px w-4 bg-[var(--accent-gold)]" />
                                            <span className="truncate font-['Barlow_Condensed'] text-[7px] font-bold uppercase tracking-[0.18em] text-[var(--accent-gold)]">{category}</span>
                                        </div>

                                        <h3 className="line-clamp-2 font-['Rajdhani'] text-[26px] font-bold uppercase leading-[0.9] tracking-tight text-white sm:text-[25px] md:text-[27px]">{tournament.tournament_name}</h3>

                                        <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[8px] font-medium uppercase tracking-[0.08em] text-white/45">
                                            <span>{tournament.server?.toUpperCase() || "INDIA"} Server</span>
                                            <span className="size-1 rounded-full bg-white/30" />
                                            <span>{tournament.game_name || "MLBB"}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Tournament Intelligence */}
                                <div className="px-3 py-3.5 sm:py-3">
                                    <div className="grid grid-cols-3 border-y border-[var(--border-default)]">
                                        <TournamentStat icon={<Trophy />} label="Entry" value={`₹${Number(entryFee).toLocaleString("en-IN")}`} />
                                        <TournamentStat icon={<Users />} label="Capacity" value={`${registeredTeams}/${tournament.max_teams}`} />
                                        <TournamentStat icon={<CalendarDays />} label="Starts" value={formatTournamentDate(tournamentDate)} />
                                    </div>

                                    {/* Capacity */}
                                    <div className="pt-3">
                                        <div className="flex items-end justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="size-1.5 shrink-0 rounded-full bg-[var(--accent-gold)]" />
                                                    <span className="font-['Barlow_Condensed'] text-[7px] font-bold uppercase tracking-[0.13em] text-[var(--text-muted)]">Tournament Capacity</span>
                                                </div>

                                                <p className="mt-1 truncate font-['Barlow_Condensed'] text-[9px] font-semibold text-[var(--text-secondary)]">{registeredTeams} teams currently registered</p>
                                            </div>

                                            <span className="shrink-0 font-['Rajdhani'] text-[18px] font-bold leading-none text-[var(--text-primary)]">{Math.round(teamPercentage)}%</span>
                                        </div>

                                        <div className="mt-2 h-[2px] overflow-hidden bg-[var(--surface-elevated)]">
                                            <div className="h-full bg-[var(--accent-gold)] transition-all duration-700" style={{ width: `${teamPercentage}%` }} />
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-3 flex items-center justify-between gap-3">
                                        <button type="button" onClick={() => onViewDetails?.(tournament)} className="group/details inline-flex min-w-0 flex-1 items-center gap-1.5 font-['Barlow_Condensed'] text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]">
                                            <span className="truncate">Event Details</span>
                                            <ArrowRight className="size-3 shrink-0 transition-transform group-hover/details:translate-x-0.5" />
                                        </button>

                                        <button type="button" disabled={isComingSoon} onClick={() => onRegister?.(tournament)} className={`inline-flex h-9 shrink-0 items-center gap-1.5 px-3 font-['Barlow_Condensed'] text-[8px] font-black uppercase tracking-[0.11em] transition-transform sm:h-8 ${isComingSoon ? "cursor-not-allowed bg-[var(--surface-elevated)] text-[var(--text-muted)]" : "bg-[var(--accent-gold)] text-black hover:-translate-y-px active:scale-95"}`}>
                                            {!isComingSoon && <Zap className="size-3" fill="currentColor" />}
                                            <span>{isComingSoon ? "Unavailable" : "Join Event"}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Accent */}
                                <div className="absolute bottom-0 left-0 h-px w-[45%] bg-gradient-to-r from-[var(--accent-gold)] to-transparent" />
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function TournamentStat({ icon, label, value }) {
    return (
        <div className="min-w-0 border-r border-[var(--border-default)] px-2 py-2.5 first:pl-0 last:border-r-0 last:pr-0 sm:px-2.5">
            <div className="flex min-w-0 items-center gap-1 text-[var(--text-muted)]">
                {React.cloneElement(icon, { className: "size-2.5 shrink-0 text-[var(--accent-gold)]" })}
                <span className="truncate font-['Barlow_Condensed'] text-[6px] font-bold uppercase tracking-[0.09em] sm:tracking-[0.11em]">{label}</span>
            </div>

            <p className="mt-1 truncate font-['Rajdhani'] text-[13px] font-bold leading-none text-[var(--text-primary)] xs:text-[14px]">{value}</p>
        </div>
    );
}

function formatTournamentDate(date) {
    if (!date) return "TBA";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
    });
}

export default UpcomingTournamentGrid;