import React, { useRef } from "react";
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Trophy,
    Users,
} from "lucide-react";


function UpcomingTournamentGrid({
    tournaments = [],
    onViewDetails,
    onRegister,
}) {
    const sliderRef = useRef(null);

    const scroll = (direction) => {
        const slider = sliderRef.current;

        if (!slider) return;

        slider.scrollBy({
            left: direction === "next" ? 300 : -300,
            behavior: "smooth",
        });
    };


    if (!tournaments.length) return null;


    return (
        <section className="w-full min-w-0">

            {/* Section Header */}
            <div className="mb-4 flex items-end justify-between gap-3">

                <div className="min-w-0">

                    <div className="flex items-center gap-2">
                        <span className="h-px w-5 shrink-0 bg-[var(--accent-gold)]" />

                        <p className="font-['Barlow_Condensed'] text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)]">
                            What's Next
                        </p>
                    </div>


                    <div className="mt-1 flex items-center gap-2">

                        <h2 className="truncate font-['Rajdhani'] text-[20px] font-bold uppercase leading-none tracking-tight text-[var(--text-primary)]">
                            Upcoming Tournaments
                        </h2>

                        <span className="hidden h-4 w-px bg-[var(--border-default)] sm:block" />

                        <span className="hidden font-['Barlow_Condensed'] text-[7px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)] sm:block">
                            {tournaments.length} Events
                        </span>

                    </div>
                </div>


                {/* Slider Controls */}
                <div className="flex shrink-0 items-center gap-1.5">

                    <button
                        type="button"
                        onClick={() => scroll("prev")}
                        aria-label="Previous tournaments"
                        className="flex size-8 items-center justify-center border border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-muted)] transition hover:border-[var(--accent-gold)]/40 hover:text-[var(--accent-gold)] active:scale-95"
                    >
                        <ChevronLeft className="size-3.5" />
                    </button>


                    <button
                        type="button"
                        onClick={() => scroll("next")}
                        aria-label="Next tournaments"
                        className="flex size-8 items-center justify-center bg-[var(--accent-gold)] text-black transition hover:-translate-y-0.5 active:scale-95"
                    >
                        <ChevronRight className="size-3.5" />
                    </button>

                </div>

            </div>


            {/* Slider */}
            <div
                ref={sliderRef}
                className="w-full min-w-0 overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >

                <div className="flex w-max gap-3 pb-1">

                    {tournaments.map((tournament) => {

                        /*
                         * API does not provide registered teams.
                         * Use 0 as the current default.
                         */
                        const registeredTeams = 0;

                        /*
                         * API does not provide prize pool.
                         * Entry fee IS available, so use it directly.
                         */
                        const entryFee = tournament.entry_fee ?? 0;


                        /*
                         * Registration status comes directly
                         * from the API.
                         */
                        const isComingSoon =
                            tournament.registration_status === "upcoming";


                        /*
                         * Team capacity comes directly
                         * from the API.
                         */
                        const teamPercentage =
                            tournament.max_teams > 0
                                ? Math.min(
                                      100,
                                      (registeredTeams /
                                          tournament.max_teams) *
                                          100
                                  )
                                : 0;


                        /*
                         * Format is not provided by API.
                         * Static default.
                         */
                        const format = "MLBB 5V5";


                        /*
                         * Category is not provided by API.
                         * Static default.
                         */
                        const category = "Mobile Legends";


                        /*
                         * Starts In is not provided by API.
                         * Display the actual tournament date instead.
                         */
                        const startsIn =
                            tournament.tournament_start_date;


                        return (
                            <article
                                key={tournament.id}
                                className="group relative w-[270px] shrink-0 overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--surface-base)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-gold)]/25 hover:shadow-[0_18px_45px_rgba(0,0,0,.2)] sm:w-[285px]"
                            >

                                {/* Image */}
                                <div className="relative h-[165px] overflow-hidden">

                                    <img
                                        src={tournament.background_image_url}
                                        alt={tournament.tournament_name}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                    />


                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-black/20" />


                                    {/* Top Badges */}
                                    <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">

                                        {/* Registration Status */}
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 font-['Barlow_Condensed'] text-[7px] font-bold uppercase tracking-[0.12em] backdrop-blur-md ${
                                                isComingSoon
                                                    ? "border-white/15 bg-black/40 text-white/65"
                                                    : "border-[var(--accent-gold)]/30 bg-black/45 text-[var(--accent-gold)]"
                                            }`}
                                        >
                                            {!isComingSoon && (
                                                <span className="size-1.5 rounded-full bg-[var(--accent-gold)] shadow-[0_0_7px_var(--accent-gold)]" />
                                            )}

                                            {tournament.registration_status}
                                        </span>


                                        {/* Format */}
                                        <span className="rounded-sm border border-white/10 bg-black/40 px-2 py-1 font-['Barlow_Condensed'] text-[7px] font-bold uppercase tracking-[0.1em] text-white/65 backdrop-blur-md">
                                            {format}
                                        </span>

                                    </div>


                                    {/* Tournament Title */}
                                    <div className="absolute inset-x-3 bottom-3">

                                        <p className="mb-1 font-['Barlow_Condensed'] text-[7px] font-bold uppercase tracking-[0.17em] text-[var(--accent-gold)]">
                                            {category}
                                        </p>


                                        <h3 className="truncate font-['Rajdhani'] text-[21px] font-bold uppercase leading-none tracking-tight text-white">
                                            {tournament.tournament_name}
                                        </h3>


                                        <p className="mt-1 truncate text-[8px] text-white/50">
                                            {tournament.game_name} ·{" "}
                                            {tournament.server?.toUpperCase()} Server
                                        </p>

                                    </div>

                                </div>


                                {/* Content */}
                                <div className="px-3 pb-3 pt-3">

                                    {/* Stats */}
                                    <div className="grid grid-cols-3">

                                        {/* Entry Fee */}
                                        <Stat
                                            icon={<Trophy />}
                                            label="Entry Fee"
                                            value={`₹${entryFee}`}
                                        />


                                        {/* Teams */}
                                        <Stat
                                            icon={<Users />}
                                            label="Teams"
                                            value={
                                                <>
                                                    {registeredTeams}

                                                    <span className="text-[8px] font-medium text-[var(--text-muted)]">
                                                        /{tournament.max_teams}
                                                    </span>
                                                </>
                                            }
                                        />


                                        {/* Starts */}
                                        <Stat
                                            icon={<Clock3 />}
                                            label="Starts"
                                            value={startsIn}
                                        />

                                    </div>


                                    {/* Divider */}
                                    <div className="my-3 h-px bg-[var(--border-default)]" />


                                    {/* Registration */}
                                    <div className="mb-3 flex items-center justify-between gap-2">

                                        <div>

                                            <p className="font-['Barlow_Condensed'] text-[7px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                                                Registration
                                            </p>


                                            <p className="mt-0.5 text-[9px] text-[var(--text-secondary)]">
                                                {registeredTeams} of{" "}
                                                {tournament.max_teams} teams
                                            </p>

                                        </div>


                                        <span className="font-['Rajdhani'] text-[12px] font-bold text-[var(--text-primary)]">
                                            {Math.round(teamPercentage)}%
                                        </span>

                                    </div>


                                    {/* Progress */}
                                    <div className="h-1 overflow-hidden rounded-full bg-[var(--surface-elevated)]">

                                        <div
                                            className="h-full rounded-full bg-[var(--accent-gold)] transition-all duration-500"
                                            style={{
                                                width: `${teamPercentage}%`,
                                            }}
                                        />

                                    </div>


                                    {/* Actions */}
                                    <div className="mt-3 flex items-center justify-between gap-3">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onViewDetails?.(tournament)
                                            }
                                            className="group/details inline-flex min-w-0 items-center gap-1 font-['Barlow_Condensed'] text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
                                        >
                                            <span className="truncate">
                                                View Details
                                            </span>

                                            <ArrowRight className="size-2.5 transition-transform group-hover/details:translate-x-0.5" />
                                        </button>


                                        <button
                                            type="button"
                                            disabled={isComingSoon}
                                            onClick={() =>
                                                onRegister?.(tournament)
                                            }
                                            className={`inline-flex h-8 items-center gap-1.5 rounded-sm px-3 font-['Barlow_Condensed'] text-[8px] font-black uppercase tracking-[0.09em] transition ${
                                                isComingSoon
                                                    ? "cursor-not-allowed bg-[var(--surface-elevated)] text-[var(--text-muted)]"
                                                    : "bg-[var(--accent-gold)] text-black hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(0,0,0,.22)] active:scale-95"
                                            }`}
                                        >
                                            {isComingSoon
                                                ? "Coming Soon"
                                                : "Join Now"}

                                            {!isComingSoon && (
                                                <ArrowRight className="size-2.5" />
                                            )}

                                        </button>

                                    </div>

                                </div>

                            </article>
                        );
                    })}

                </div>

            </div>

        </section>
    );
}


function Stat({ icon, label, value }) {
    return (
        <div className="min-w-0 border-r border-[var(--border-default)] px-2 first:pl-0 last:border-0 last:pr-0">

            <div className="flex items-center gap-1 text-[var(--text-muted)]">

                {React.cloneElement(icon, {
                    className:
                        "size-2.5 text-[var(--accent-gold)]",
                })}

                <span className="truncate font-['Barlow_Condensed'] text-[6px] font-semibold uppercase tracking-[0.1em]">
                    {label}
                </span>

            </div>


            <p className="mt-1 truncate font-['Rajdhani'] text-[13px] font-bold leading-none text-[var(--text-primary)]">
                {value}
            </p>

        </div>
    );
}


export default UpcomingTournamentGrid;