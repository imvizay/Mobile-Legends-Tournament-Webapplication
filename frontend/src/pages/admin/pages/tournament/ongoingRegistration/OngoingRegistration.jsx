import {
    CalendarDays,
    ChevronRight,
    Clock3,
    Ellipsis,
    Globe2,
    MoreHorizontal,
    Trophy,
    UsersRound,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useUserContext } from "../../../../../contexts/UserContext";
import { tournamentService } from "../../../../../services/admin/tournament_service";
import { useNavigate } from "react-router-dom";

const STATUS_STYLES = {
    OPEN: {
        label: "Registration open",
        className:
            "bg-[color-mix(in_srgb,var(--accent-gold)_12%,var(--surface-base))] text-[var(--accent-gold)]",
    },
    ONGOING: {
        label: "Live",
        className:
            "bg-[color-mix(in_srgb,#3f9b72_14%,var(--surface-base))] text-[#4fa77f]",
    },
    UPCOMING: {
        label: "Upcoming",
        className:
            "bg-[var(--surface-elevated)] text-[var(--text-secondary)]",
    },
    COMPLETED: {
        label: "Completed",
        className:
            "bg-[var(--surface-elevated)] text-[var(--text-muted)]",
    },
    CANCELLED: {
        label: "Cancelled",
        className:
            "bg-[color-mix(in_srgb,#c94b42_12%,var(--surface-base))] text-[#c66a62]",
    },
};

const getStatus = (tournament) =>
    String(
        tournament.status ??
            tournament.registration_status ??
            "OPEN",
    ).toUpperCase();

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatTime = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const StatusBadge = ({ status }) => {
    const style = STATUS_STYLES[status] ?? STATUS_STYLES.UPCOMING;

    return (
        <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold tracking-[-0.01em] ${style.className}`}
        >
            <span className="size-1.5 rounded-full bg-current opacity-70" />
            {style.label}
        </span>
    );
};

const TournamentRow = ({ tournament,navigate }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const status = getStatus(tournament);
    const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.UPCOMING;

    const tournamentName =
        tournament.tournament_name ?? tournament.name ?? "Untitled tournament";

    const registered = Number(tournament.registration_count ?? 0);
    const capacity = Number(
        tournament.capacity ?? tournament.max_teams ?? 0,
    );

    const percentage =
        capacity > 0
            ? Math.min(Math.round((registered / capacity) * 100), 100)
            : 0;

    const scheduleDate =
        status === "ONGOING" || status === "COMPLETED"
            ? tournament.starts_at
            : tournament.registration_closes_at;

    const scheduleLabel =
        status === "ONGOING"
            ? "Started"
            : status === "COMPLETED"
              ? "Started"
              : "Registration closes";

    return (
        <article className="relative rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-base)] transition-colors hover:border-[var(--border-default)]">
            <div className="grid gap-4 p-4 sm:grid-cols-[minmax(220px,1.6fr)_minmax(150px,1fr)_minmax(140px,0.9fr)_auto] sm:items-center sm:px-5 sm:py-4">
                {/* Tournament identity */}
                <div className="min-w-0">
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
                            {tournament.background_image_url ? (
                                <img
                                    src={tournament.background_image_url}
                                    alt=""
                                    className="size-full object-cover"
                                />
                            ) : (
                                <Trophy
                                    size={17}
                                    className="text-[var(--text-muted)]"
                                />
                            )}
                        </div>

                        <div className="min-w-0">
                            <h3 className="truncate text-[13px] font-semibold tracking-[-0.025em] text-[var(--text-primary)] sm:text-[14px]">
                                {tournamentName}
                            </h3>

                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-[var(--text-muted)]">
                                <span>
                                    {tournament.team_format ??
                                        tournament.format ??
                                        "Team format unavailable"}
                                </span>

                                <span className="text-[var(--border-default)]">
                                    /
                                </span>

                                <span className="flex items-center gap-1">
                                    <Globe2 size={11} />
                                    {tournament.server ??
                                        tournament.region ??
                                        "India"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registration operations */}
                <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-[9px] font-medium uppercase tracking-[0.09em] text-[var(--text-muted)]">
                                Applications
                            </p>

                            <p className="mt-1 text-[18px] font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                                {registered}
                                <span className="ml-1 text-[11px] font-normal tracking-normal text-[var(--text-muted)]">
                                    / {capacity || "—"}
                                </span>
                            </p>
                        </div>

                        <div className="flex size-8 items-center justify-center rounded-lg bg-[var(--surface-elevated)] text-[var(--text-secondary)]">
                            <UsersRound size={14} />
                        </div>
                    </div>

                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--surface-elevated)]">
                        <div
                            className="h-full rounded-full bg-[var(--accent-gold)] transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    <p className="mt-1 text-[9px] text-[var(--text-muted)]">
                        {percentage}% capacity reached
                    </p>
                </div>

                {/* Schedule and status */}
                <div className="min-w-0">
                    <StatusBadge status={status} />

                    <div className="mt-2 flex items-start gap-2">
                        <CalendarDays
                            size={13}
                            className="mt-0.5 shrink-0 text-[var(--text-muted)]"
                        />

                        <div className="min-w-0">
                            <p className="text-[9px] text-[var(--text-muted)]">
                                {scheduleLabel}
                            </p>

                            <p className="truncate text-[11px] font-medium text-[var(--text-primary)]">
                                {formatDate(scheduleDate)}
                            </p>

                            {formatTime(scheduleDate) && (
                                <p className="mt-0.5 flex items-center gap-1 text-[9px] text-[var(--text-muted)]">
                                    <Clock3 size={10} />
                                    {formatTime(scheduleDate)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-3 sm:justify-end sm:border-0 sm:pt-0">
                    <div className="sm:hidden">
                        <p className="text-[9px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
                            Entry fee
                        </p>

                        <p className="mt-1 text-[12px] font-semibold text-[var(--text-primary)]">
                            ₹{tournament.entry_fee ?? 0}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={ () => navigate(`/admin/tournaments/ongoing-registration/${tournament.id}`)}
                            className="group inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--action-primary-bg)] px-3 text-[10px] font-semibold text-[var(--action-primary-text)] transition-opacity hover:opacity-85"
                        >
                            View
                            <ChevronRight
                                size={13}
                                className="transition-transform group-hover:translate-x-0.5"
                            />
                        </button>

                        <div className="relative">
                            <button
                                type="button"
                                aria-label={`More options for ${tournamentName}`}
                                aria-expanded={menuOpen}
                                onClick={() => setMenuOpen((current) => !current)}
                                className="flex size-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                            >
                                <Ellipsis size={16} />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-1.5 shadow-lg">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMenuOpen(false);
                                           
                                        }}
                                        className="w-full rounded-lg px-3 py-2 text-left text-[11px] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                                    >
                                        View tournament
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMenuOpen(false);
                                            
                                        }}
                                        className="w-full rounded-lg px-3 py-2 text-left text-[11px] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                                    >
                                        Manage registrations
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop-only secondary information */}
            <div className="hidden items-center justify-between border-t border-[var(--border-subtle)] px-5 py-2.5 text-[9px] text-[var(--text-muted)] sm:flex">
                <div className="flex items-center gap-4">
                    <span>
                        Entry fee:{" "}
                        <strong className="font-medium text-[var(--text-secondary)]">
                            ₹{tournament.entry_fee ?? 0}
                        </strong>
                    </span>

                    <span>
                        Bracket:{" "}
                        <strong className="font-medium text-[var(--text-secondary)]">
                            {tournament.bracket_format ?? "—"}
                        </strong>
                    </span>
                </div>

                <span className="flex items-center gap-1">
                    <span
                        className={`size-1.5 rounded-full ${
                            status === "ONGOING"
                                ? "bg-[#4fa77f]"
                                : "bg-[var(--text-muted)]"
                        }`}
                    />
                    {statusStyle.label}
                </span>
            </div>
        </article>
    );
};

const LoadingState = () => (
    <div className="space-y-3">
        {[1, 2, 3].map((item) => (
            <div
                key={item}
                className="h-[190px] animate-pulse rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-base)] sm:h-[145px]"
            />
        ))}
    </div>
);

const EmptyState = () => (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-subtle)] px-6 text-center">
        <div className="flex size-11 items-center justify-center rounded-xl bg-[var(--surface-elevated)] text-[var(--text-muted)]">
            <Trophy size={18} />
        </div>

        <h3 className="mt-4 text-[14px] font-semibold text-[var(--text-primary)]">
            No tournaments found
        </h3>

        <p className="mt-1 max-w-[300px] text-[11px] leading-relaxed text-[var(--text-muted)]">
            There are no tournament records available for this operational
            view.
        </p>
    </div>
);

const OngoingTournamentRegistration = ({ tournaments = [],  }) => {
    const { user } = useUserContext();

    const navigate = useNavigate()

    const {
        data: ongoingTournament,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ["ongoing-tournament", user?.id],
        queryFn: tournamentService.ongoingTournamentRegistration,
        enabled: Boolean(user?.id),
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60 * 5,
    });

    if (isPending) {
        return (
            <section className="flex h-full min-h-0 w-full flex-col">
                <header className="shrink-0 border-b border-[var(--border-subtle)] pb-5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-gold)]">
                        Operations
                    </p>

                    <h1 className="mt-1 text-[25px] font-semibold tracking-[-0.045em] text-[var(--text-primary)] sm:text-[30px]">
                        Tournament registrations
                    </h1>

                    <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                        Monitor applications, capacity, and tournament status.
                    </p>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto pt-4">
                    <LoadingState />
                </div>
            </section>
        );
    }

    if (isError) {
        console.error(error);

        return (
            <section className="flex h-full min-h-0 w-full flex-col">
                <header className="border-b border-[var(--border-subtle)] pb-5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-gold)]">
                        Operations
                    </p>

                    <h1 className="mt-1 text-[25px] font-semibold tracking-[-0.045em] text-[var(--text-primary)] sm:text-[30px]">
                        Tournament registrations
                    </h1>

                    <p className="mt-2 text-[11px] text-[#c66a62]">
                        Unable to load tournament registrations.
                    </p>
                </header>
            </section>
        );
    }

    const response = ongoingTournament?.data ?? ongoingTournament;

    const apiTournaments = Array.isArray(response)
        ? response
        : response?.tournaments ??
          response?.registrations ??
          response?.results ??
          [];

    const registrationList =
        apiTournaments.length > 0 ? apiTournaments : tournaments;

    return (
        <section className="flex h-full min-h-0 w-full flex-col">
            <header className="shrink-0 border-b border-[var(--border-subtle)] pb-5">
                <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-gold)]">
                            Operations
                        </p>

                        <h1 className="mt-1 text-[25px] font-semibold tracking-[-0.045em] text-[var(--text-primary)] sm:text-[30px]">
                            Tournament registrations
                        </h1>

                        <p className="mt-1 max-w-[560px] text-[11px] leading-relaxed text-[var(--text-muted)]">
                            Review tournament applications, capacity, and
                            operational status.
                        </p>
                    </div>

                    <span className="hidden shrink-0 rounded-full bg-[var(--surface-elevated)] px-3 py-1.5 text-[10px] font-medium text-[var(--text-secondary)] sm:inline-flex">
                        {registrationList.length} tournaments
                    </span>
                </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
                <div className="space-y-3 pb-6 pt-4">
                    {registrationList.length > 0 ? (
                        registrationList.map((tournament) => (
                            <TournamentRow
                                key={tournament.id}
                                tournament={tournament}
                                navigate={navigate}
                            />
                        ))
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </div>
        </section>
    );
};

export default OngoingTournamentRegistration;