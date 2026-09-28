import {
    ArrowLeft,
    CalendarDays,
    ChevronRight,
    Clock3,
    Ellipsis,
    Globe2,
    Trophy,
    UsersRound,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { replace, useNavigate } from "react-router-dom";

import { useUserContext } from "../../../../contexts/UserContext";
import { tournamentService } from "../../../../services/admin/tournamentService";

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

const isRegistrationClosed = (tournament) => {
    if (!tournament.registration_closes_at) return false;

    const closeTime = new Date(
        tournament.registration_closes_at,
    ).getTime();

    if (Number.isNaN(closeTime)) return false;

    return Date.now() >= closeTime;
};

const canGenerateBracket = (tournament, status) => {
    const registrationClosed =
        isRegistrationClosed(tournament);

    const tournamentClosed =
        status === "COMPLETED" ||
        status === "CANCELLED";

    return registrationClosed && !tournamentClosed;
};

const StatusBadge = ({ status }) => {
    const style =
        STATUS_STYLES[status] ?? STATUS_STYLES.UPCOMING;

    return (
        <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-semibold ${style.className}`}>
            <span className="size-1.5 rounded-full bg-current opacity-70" />
            {style.label}
        </span>
    );
};

const TournamentRow = ({ tournament, navigate }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const status = getStatus(tournament);

    const tournamentName =
        tournament.tournament_name ??
        tournament.name ??
        "Untitled tournament";

    const registered = Number(
        tournament.registration_count ?? 0,
    );

    const capacity = Number(
        tournament.capacity ??
        tournament.max_teams ??
        0,
    );

    const percentage =
        capacity > 0
            ? Math.min(
                Math.round((registered / capacity) * 100),
                100,
            )
            : 0;

    const registrationClosed =
        isRegistrationClosed(tournament);

    const bracketAvailable =
        canGenerateBracket(tournament, status);

    const scheduleDate =
        status === "ONGOING" ||
            status === "COMPLETED"
            ? tournament.starts_at
            : tournament.registration_closes_at;

    const scheduleLabel =
        status === "ONGOING"
            ? "Started"
            : status === "COMPLETED"
                ? "Started"
                : registrationClosed
                    ? "Registration closed"
                    : "Registration closes";

    const handleView = () => {
        navigate(
            `/admin/tournaments/ongoing-registration/${tournament.id}`,
        );
    };

    const handleBracket = () => {
        navigate(
            `/admin/bracket/${tournament.id}/create`, { replace: true }
        );
    };

    return (
        <article className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-base)] transition-colors hover:border-[var(--border-default)]">
            <div className="grid gap-4 px-4 py-4 sm:grid-cols-[minmax(250px,1.6fr)_minmax(150px,0.9fr)_minmax(160px,0.9fr)_auto] sm:items-center sm:px-5 sm:py-4">

                {/* Tournament identity */}
                <div className="min-w-0">
                    <div className="flex items-center gap-3">
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
                            <div className="flex min-w-0 items-center gap-2">
                                <h3 className="truncate text-[13px] font-semibold tracking-[-0.025em] text-[var(--text-primary)] sm:text-[14px]">
                                    {tournamentName}
                                </h3>

                                <StatusBadge status={status} />
                            </div>

                            <div className="mt-1 flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                                <span>
                                    {tournament.team_format ??
                                        tournament.format ??
                                        "Team format unavailable"}
                                </span>

                                <span className="text-[var(--border-default)]">
                                    /
                                </span>

                                <span className="flex items-center gap-1">
                                    <Globe2 size={10} />
                                    {tournament.server ??
                                        tournament.region ??
                                        "India"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registration */}
                <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-[9px] font-medium uppercase tracking-[0.08em] text-[var(--text-muted)]">
                                Applications
                            </p>

                            <p className="mt-0.5 text-[17px] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                                {registered}
                                <span className="ml-1 text-[10px] font-normal tracking-normal text-[var(--text-muted)]">
                                    / {capacity || "—"}
                                </span>
                            </p>
                        </div>

                        <UsersRound
                            size={14}
                            className="text-[var(--text-muted)]"
                        />
                    </div>

                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[var(--surface-elevated)]">
                        <div
                            className="h-full rounded-full bg-[var(--accent-gold)] transition-all duration-300"
                            style={{
                                width: `${percentage}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Schedule */}
                <div className="flex min-w-0 items-start gap-2">
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
                                <Clock3 size={9} />
                                {formatTime(scheduleDate)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 border-t border-[var(--border-subtle)] pt-3 sm:border-0 sm:pt-0">
                    <button
                        type="button"
                        onClick={handleView}
                        className="group inline-flex h-8 items-center gap-1.5 rounded-lg bg-[var(--action-primary-bg)] px-3 text-[10px] font-semibold text-[var(--action-primary-text)] transition-opacity hover:opacity-85"
                    >
                        View
                        <ChevronRight
                            size={12}
                            className="transition-transform group-hover:translate-x-0.5"
                        />
                    </button>

                    {bracketAvailable && (
                        <button
                            type="button"
                            onClick={handleBracket}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[color-mix(in_srgb,var(--accent-gold)_28%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--accent-gold)_7%,var(--surface-base))] px-3 text-[10px] font-semibold text-[var(--accent-gold)] transition-colors hover:bg-[color-mix(in_srgb,var(--accent-gold)_12%,var(--surface-base))]"
                        >
                            Bracket
                            <ChevronRight size={12} />
                        </button>
                    )}

                    <div className="relative">
                        <button
                            type="button"
                            aria-label={`More options for ${tournamentName}`}
                            aria-expanded={menuOpen}
                            onClick={() =>
                                setMenuOpen(
                                    (current) => !current,
                                )
                            }
                            className="flex size-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                        >
                            <Ellipsis size={15} />
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 top-10 z-20 w-44 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-1.5 shadow-lg">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        handleView();
                                    }}
                                    className="w-full rounded-lg px-3 py-2 text-left text-[11px] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                                >
                                    View tournament
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        handleView();
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

            {/* Additional tournament information */}
            <div className="hidden items-center justify-between border-t border-[var(--border-subtle)] px-5 py-2.5 text-[9px] text-[var(--text-muted)] sm:flex">
                <div className="flex items-center gap-5">
                    <span>
                        Entry fee{" "}
                        <strong className="font-medium text-[var(--text-secondary)]">
                            ₹{tournament.entry_fee ?? 0}
                        </strong>
                    </span>

                    <span>
                        Bracket{" "}
                        <strong className="font-medium text-[var(--text-secondary)]">
                            {tournament.bracket_format ?? "—"}
                        </strong>
                    </span>

                    <span>
                        Teams{" "}
                        <strong className="font-medium text-[var(--text-secondary)]">
                            {capacity || "—"}
                        </strong>
                    </span>
                </div>

                {registrationClosed &&
                    status !== "COMPLETED" &&
                    status !== "CANCELLED" && (
                        <span className="flex items-center gap-1.5 text-[var(--accent-gold)]">
                            <span className="size-1.5 rounded-full bg-[var(--accent-gold)]" />
                            Ready for bracket
                        </span>
                    )}
            </div>
        </article>
    );
};

const LoadingState = () => (
    <div className="space-y-3">
        {[1, 2, 3].map((item) => (
            <div
                key={item}
                className="h-[170px] animate-pulse rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-base)] sm:h-[140px]"
            />
        ))}
    </div>
);

const EmptyState = () => (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-subtle)] px-6 text-center">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--surface-elevated)] text-[var(--text-muted)]">
            <Trophy size={17} />
        </div>

        <h3 className="mt-3 text-[13px] font-semibold text-[var(--text-primary)]">
            No tournaments found
        </h3>

        <p className="mt-1 max-w-[280px] text-[10px] leading-relaxed text-[var(--text-muted)]">
            There are no tournament records available right now.
        </p>
    </div>
);

const OngoingRegistrationPage = () => {
    const { user } = useUserContext();
    const navigate = useNavigate();

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
                <header className="shrink-0 border-b border-[var(--border-subtle)] pb-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                    >
                        <ArrowLeft size={12} />
                        Back
                    </button>

                    <h1 className="text-[24px] font-bold tracking-[-0.045em] text-[var(--text-primary)] sm:text-[26px]">
                        Tournament registrations
                    </h1>

                    <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                        Review applications and tournament registration activity.
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
                <header className="shrink-0 border-b border-[var(--border-subtle)] pb-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                    >
                        <ArrowLeft size={12} />
                        Back
                    </button>

                    <h1 className="text-[24px] font-bold tracking-[-0.045em] text-[var(--text-primary)] sm:text-[26px]">
                        Tournament registrations
                    </h1>

                    <p className="mt-1 text-[10px] text-[#c66a62]">
                        Unable to load tournament registrations.
                    </p>
                </header>
            </section>
        );
    }

    const response =
        ongoingTournament?.data ??
        ongoingTournament;

    const registrationList = Array.isArray(response)
        ? response
        : response?.tournaments ??
        response?.registrations ??
        response?.results ??
        [];

    return (
        <section className="flex h-full min-h-0 w-full flex-col">
            <header className="shrink-0 border-b border-[var(--border-subtle)] pb-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                >
                    <ArrowLeft size={12} />
                    Back
                </button>

                <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0">
                        <h1 className="text-[24px] font-bold tracking-[-0.045em] text-[var(--text-primary)] sm:text-[26px]">
                            Tournament registrations
                        </h1>

                        <p className="mt-1 max-w-[620px] text-[10px] leading-relaxed text-[var(--text-muted)]">
                            Review applications, registration capacity, and tournament activity.
                        </p>
                    </div>

                    <span className="hidden shrink-0 rounded-full bg-[var(--surface-elevated)] px-3 py-1.5 text-[10px] font-medium text-[var(--text-secondary)] sm:inline-flex">
                        {registrationList.length} tournaments
                    </span>
                </div>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
                <div className="space-y-3 pb-2 pt-4">
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

                    {registrationList.length > 0 && (
                        <div className="flex items-center gap-3 py-5">
                            <div className="h-px flex-1 bg-[var(--border-subtle)]" />

                            <span className="shrink-0 text-[8px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
                                End of records
                            </span>

                            <div className="h-px flex-1 bg-[var(--border-subtle)]" />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default OngoingRegistrationPage;