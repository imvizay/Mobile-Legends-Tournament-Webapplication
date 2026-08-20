import React, { useState } from "react";
import {
    ArrowRight,
    CalendarDays,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Play,
    Trophy,
    Users,
} from "lucide-react";

function RecentWinnerHistory({ tournaments = [], onViewTournament }) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!tournaments.length) {
        return (
            <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-base)] px-5 sm:min-h-[300px]">
                <div className="text-center">
                    <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-[var(--surface-elevated)] sm:size-12">
                        <Trophy
                            className="size-5 text-[var(--text-muted)]"
                            strokeWidth={1.6}
                        />
                    </div>

                    <p className="text-[12px] font-medium text-[var(--text-primary)] sm:text-[13px]">
                        No tournament history yet
                    </p>

                    <p className="mt-1 text-[10px] text-[var(--text-muted)] sm:text-[11px]">
                        Championship moments will appear here.
                    </p>
                </div>
            </div>
        );
    }

    const selectedTournament = tournaments[selectedIndex];

    const selectPrevious = () => {
        setSelectedIndex((current) =>
            current === 0 ? tournaments.length - 1 : current - 1
        );
    };

    const selectNext = () => {
        setSelectedIndex((current) =>
            current === tournaments.length - 1 ? 0 : current + 1
        );
    };

    return (
        <div className="overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--surface-base)]">

            {/* =========================================================
                FEATURED TOURNAMENT
            ========================================================= */}
            <div className="relative h-[220px] overflow-hidden xs:h-[230px] sm:h-[260px] md:h-[290px] lg:h-[310px]">

                <img
                    src={selectedTournament.videoThumbnail}
                    alt={selectedTournament.name}
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />

                {/* Tournament Label */}
                <div className="absolute left-3 top-3 sm:left-5 sm:top-5">
                    <span className="inline-flex max-w-[170px] items-center gap-1.5 truncate rounded-md border border-white/20 bg-black/35 px-2 py-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md sm:max-w-none sm:px-2.5 sm:py-1.5 sm:text-[8px] sm:tracking-[0.14em]">
                        <Trophy
                            className="size-2.5 shrink-0 text-[var(--accent-gold)] sm:size-3"
                            strokeWidth={1.7}
                        />

                        <span className="truncate">
                            {selectedTournament.label || "Recent Final"}
                        </span>
                    </span>
                </div>

                {/* Navigation */}
                {tournaments.length > 1 && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 sm:right-5 sm:top-5 sm:gap-1.5">
                        <button
                            type="button"
                            onClick={selectPrevious}
                            aria-label="Previous tournament"
                            className="group flex size-7 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-all duration-200 hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] sm:size-8"
                        >
                            <ChevronLeft
                                className="size-3.5 sm:size-4"
                                strokeWidth={1.7}
                            />
                        </button>

                        <button
                            type="button"
                            onClick={selectNext}
                            aria-label="Next tournament"
                            className="group flex size-7 items-center justify-center rounded-full border border-[var(--accent-gold)] bg-[var(--accent-gold)] text-[var(--text-primary)] transition-all duration-200 sm:size-8"
                        >
                            <ChevronRight
                                className="size-3.5 sm:size-4"
                                strokeWidth={1.8}
                            />
                        </button>
                    </div>
                )}

                {/* Play Button */}
                <button
                    type="button"
                    onClick={() => onViewTournament?.(selectedTournament)}
                    aria-label={`Watch ${selectedTournament.name}`}
                    className="group absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/30 text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-[var(--text-primary)] sm:size-14 md:size-16"
                >
                    <Play
                        className="ml-0.5 size-4 fill-current sm:ml-1 sm:size-5 md:size-6"
                        strokeWidth={1.5}
                    />
                </button>

                {/* Bottom Content */}
                <div className="absolute inset-x-3 bottom-3 sm:inset-x-5 sm:bottom-5">
                    <div className="flex items-end justify-between gap-3">

                        <div className="min-w-0 flex-1">
                            <p className="text-[8px] font-medium uppercase tracking-[0.14em] text-[var(--accent-gold)] sm:text-[9px] sm:tracking-[0.16em]">
                                {selectedTournament.season || "Season"}
                            </p>

                            <h3 className="mt-0.5 line-clamp-2 text-[17px] font-semibold uppercase leading-tight tracking-[-0.02em] text-white sm:mt-1 sm:text-[21px] md:text-[23px]">
                                {selectedTournament.name}
                            </h3>

                            <p className="mt-1 truncate text-[9px] text-white/65 sm:text-[11px]">
                                {selectedTournament.subtitle || "Grand Finals"}
                            </p>
                        </div>

                        {selectedTournament.videoDuration && (
                            <span className="shrink-0 rounded-md border border-white/15 bg-black/40 px-1.5 py-1 text-[8px] font-medium text-white/80 backdrop-blur-md sm:px-2 sm:text-[9px]">
                                {selectedTournament.videoDuration}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* =========================================================
                WINNER RESULT
            ========================================================= */}
            <div className="border-b border-[var(--border-default)] px-3 py-3 sm:px-5 sm:py-4">

                {/* Teams + Score */}
                <div className="flex items-center justify-between gap-2 sm:gap-4">

                    {/* Winner */}
                    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">

                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[var(--accent-gold)]/40 bg-[var(--surface-elevated)] sm:size-11">
                            {selectedTournament.winner?.logo ? (
                                <img
                                    src={selectedTournament.winner.logo}
                                    alt=""
                                    className="size-6 rounded-full object-contain sm:size-8"
                                />
                            ) : (
                                <Trophy
                                    className="size-4 text-[var(--accent-gold)] sm:size-5"
                                    strokeWidth={1.6}
                                />
                            )}
                        </div>

                        <div className="min-w-0">
                            <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-gold)] sm:text-[8px] sm:tracking-[0.14em]">
                                Champions
                            </p>

                            <p className="mt-0.5 truncate text-[11px] font-semibold text-[var(--text-primary)] sm:text-[13px]">
                                {selectedTournament.winner?.name || "Team Phoenix"}
                            </p>
                        </div>
                    </div>

                    {/* Score */}
                    <div className="shrink-0 px-1 text-center sm:px-2">
                        <p className="text-[15px] font-semibold tracking-[0.06em] text-[var(--text-primary)] sm:text-[18px] sm:tracking-[0.08em]">
                            {selectedTournament.score || "3 — 1"}
                        </p>

                        <p className="mt-0.5 whitespace-nowrap text-[7px] uppercase tracking-[0.1em] text-[var(--text-muted)] sm:text-[8px] sm:tracking-[0.12em]">
                            {selectedTournament.series || "Best of 5"}
                        </p>
                    </div>

                    {/* Runner Up */}
                    <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right sm:gap-3">

                        <div className="min-w-0">
                            <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] sm:text-[8px] sm:tracking-[0.14em]">
                                Runner Up
                            </p>

                            <p className="mt-0.5 truncate text-[11px] font-semibold text-[var(--text-primary)] sm:text-[13px]">
                                {selectedTournament.runnerUp?.name || "Shadow Squad"}
                            </p>
                        </div>

                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-elevated)] sm:size-11">
                            {selectedTournament.runnerUp?.logo ? (
                                <img
                                    src={selectedTournament.runnerUp.logo}
                                    alt=""
                                    className="size-6 rounded-full object-contain sm:size-8"
                                />
                            ) : (
                                <Users
                                    className="size-4 text-[var(--text-muted)] sm:size-5"
                                    strokeWidth={1.6}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Tournament Meta */}
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[8px] text-[var(--text-muted)] sm:mt-4 sm:gap-4 sm:text-[9px]">

                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <CalendarDays
                            className="size-3 sm:size-3.5"
                            strokeWidth={1.6}
                        />

                        {selectedTournament.date || "12 May 2024"}
                    </span>

                    <span className="hidden size-1 rounded-full bg-[var(--border-default)] sm:block" />

                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <Users
                            className="size-3 sm:size-3.5"
                            strokeWidth={1.6}
                        />

                        {selectedTournament.teamCount || 128} Teams
                    </span>

                    <span className="hidden size-1 rounded-full bg-[var(--border-default)] sm:block" />

                    <button
                        type="button"
                        onClick={() => onViewTournament?.(selectedTournament)}
                        className="group ml-auto flex items-center gap-1.5 whitespace-nowrap font-medium text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--accent-gold)]"
                    >
                        Watch Match

                        <ArrowRight
                            className="size-3 transition-transform duration-200 group-hover:translate-x-0.5"
                            strokeWidth={1.8}
                        />
                    </button>
                </div>
            </div>

            {/* =========================================================
                TOURNAMENT HISTORY
            ========================================================= */}
            <div className="px-3 py-3 sm:px-4 sm:py-3">

                <div className="mb-2 flex items-center justify-between px-0.5 sm:px-1">
                    <p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)] sm:text-[8px] sm:tracking-[0.16em]">
                        Tournament History
                    </p>

                    <span className="text-[7px] text-[var(--text-muted)] sm:text-[8px]">
                        {selectedIndex + 1} / {tournaments.length}
                    </span>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2">

                    {tournaments.map((tournament, index) => (
                        <button
                            key={tournament.id}
                            type="button"
                            onClick={() => setSelectedIndex(index)}
                            className={`group flex min-w-[145px] shrink-0 items-center gap-2 rounded-md border px-2 py-1.5 text-left transition-all duration-200 sm:min-w-[170px] sm:gap-2.5 sm:px-2.5 sm:py-2 ${
                                selectedIndex === index
                                    ? "border-[var(--accent-gold)]/50 bg-[var(--accent-gold)]/8"
                                    : "border-[var(--border-default)] bg-[var(--surface-base)] hover:bg-[var(--surface-elevated)]"
                            }`}
                        >
                            <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[var(--surface-elevated)] sm:size-8">
                                {tournament.winner?.logo ? (
                                    <img
                                        src={tournament.winner.logo}
                                        alt=""
                                        className="size-full object-contain"
                                    />
                                ) : (
                                    <Trophy
                                        className="size-3 text-[var(--text-muted)] sm:size-3.5"
                                        strokeWidth={1.6}
                                    />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p
                                    className={`truncate text-[9px] font-medium sm:text-[10px] ${
                                        selectedIndex === index
                                            ? "text-[var(--text-primary)]"
                                            : "text-[var(--text-secondary)]"
                                    }`}
                                >
                                    {tournament.name}
                                </p>

                                <p className="mt-0.5 truncate text-[7px] uppercase tracking-[0.07em] text-[var(--text-muted)] sm:text-[8px] sm:tracking-[0.08em]">
                                    {tournament.season || "Tournament"}
                                </p>
                            </div>

                            {selectedIndex === index && (
                                <ChevronDown
                                    className="size-3 shrink-0 rotate-[-90deg] text-[var(--accent-gold)]"
                                    strokeWidth={1.8}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RecentWinnerHistory;