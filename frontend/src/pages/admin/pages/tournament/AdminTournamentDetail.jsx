import React from "react";
import { Link } from "react-router-dom";
import {
    X, Pencil, Send, Trash2, Trophy, Users, Globe, Gamepad2,
    CalendarDays, Clock3, ShieldCheck, GitBranch, Crown,
    WalletCards, CircleCheck, AlertTriangle, MapPin, UserRound
} from "lucide-react";

const TournamentDetailsModal = ({ tournament, onClose, onPublish, onRemove }) => {
    if (!tournament) return null;

    const {
        id,
        tournament_name,
        game_name,
        team_format,
        tournament_type,
        bracket_format,
        category,
        competition_type,
        server,
        minimum_rank,
        minimum_account_level,
        min_teams,
        max_teams,
        entry_fee,
        entry_type,
        registration_access,
        registration_approval,
        seeding_method,
        platform_fee,
        winner_share,
        runner_up_share,
        description,
        reg_open_date,
        reg_open_time,
        reg_close_date,
        reg_close_time,
        tournament_start_date,
        tournament_start_time,
        tournament_end_date,
        tournament_end_time,
        check_in,
        grace_period,
        banner_image_url,
        background_image_url,
        status,
        visibility_status
    } = tournament;

    const formatDate = (date) => {
        if (!date) return "--";
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatTime = (time) => {
        if (!time) return "--";

        const [hours, minutes] = time.split(":");
        const date = new Date();
        date.setHours(hours, minutes);

        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const formatDateTime = (date, time) => (
        <div>
            <p className="text-[10px] font-semibold text-[var(--text-primary)]">
                {formatDate(date)}
            </p>
            <p className="mt-0.5 text-[8px] text-[var(--text-muted)]">
                {formatTime(time)}
            </p>
        </div>
    );

    const pretty = (value) => {
        if (!value) return "--";

        return value
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const currentStatus = status || "Upcoming";

    const statusClass =
        currentStatus === "Ongoing"
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
            : currentStatus === "Completed"
                ? "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
                : "border-blue-500/20 bg-blue-500/10 text-blue-500";

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
        >
            <section
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[92vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-2xl border bg-[var(--surface-base)] shadow-[0_30px_100px_rgba(0,0,0,0.45)]"
                style={{ borderColor: "var(--border-default)" }}
            >
                {/* Header */}
                <header className="flex shrink-0 items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--border-subtle)" }}>
                    <div className="flex items-center gap-2">
                        <Trophy size={14} className="text-[var(--accent-gold)]" />
                        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                            Tournament Preview
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border text-[var(--text-muted)] transition hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                        style={{ borderColor: "var(--border-default)" }}
                        aria-label="Close"
                    >
                        <X size={15} strokeWidth={1.8} />
                    </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto">
                    {/* Hero */}
                    <div className="relative h-[300px] overflow-hidden">
                        {banner_image_url || background_image_url ? (
                            <img
                                src={banner_image_url || background_image_url}
                                alt={tournament_name}
                                className="absolute inset-0 h-full w-full object-cover "
                            />
                        ) : (
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(200,176,122,0.20),transparent_35%),linear-gradient(135deg,var(--surface-elevated),var(--surface-base))]" />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                        <div className="absolute inset-x-0 bottom-0 p-7">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`rounded-full border px-2.5 py-1 text-[8px] font-semibold uppercase tracking-wide ${statusClass}`}>
                                    {currentStatus}
                                </span>

                                <span className="rounded-full border border-white/15 bg-black/20 px-2.5 py-1 text-[8px] font-medium text-white/75 backdrop-blur-sm">
                                    {visibility_status == "published" ? "Published" : "Unpublished"}
                                </span>
                            </div>

                            <div className="mt-3 flex items-end justify-between gap-5">
                                <div className="min-w-0">
                                    <h1 className="truncate text-[28px] font-semibold tracking-[-0.9px] text-white">
                                        {tournament_name}
                                    </h1>

                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[9px] text-white/65">
                                        <span>{game_name || "Game"}</span>
                                        <span>•</span>
                                        <span>{pretty(category)}</span>
                                        <span>•</span>
                                        <span>{pretty(competition_type)}</span>
                                        <span>•</span>
                                        <span>{pretty(bracket_format || tournament_type)}</span>
                                    </div>
                                </div>

                                <div className="hidden shrink-0 text-right sm:block">
                                    <p className="text-[8px] uppercase tracking-[0.12em] text-white/45">
                                        Organized by
                                    </p>
                                    <p className="mt-1 text-[10px] font-semibold text-white">
                                        Gamix Esports
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4" style={{ borderColor: "var(--border-subtle)" }}>
                        <div>
                            <p className="text-[9px] font-medium text-[var(--text-muted)]">
                                Tournament controls
                            </p>
                            <p className="mt-0.5 text-[8px] text-[var(--text-muted)]">
                                Manage visibility and tournament configuration.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {visibility_status ? <></> : <>
                                <Link
                                    to={`/admin/tournaments/${id}/edit`}
                                    onClick={onClose}
                                    className="flex h-8 items-center gap-1.5 rounded-md border px-3 text-[9px] font-semibold transition hover:bg-[var(--surface-elevated)]"
                                    style={{ borderColor: "var(--border-default)" }}
                                >
                                    <Pencil size={11} />
                                    Edit
                                </Link>

                                <button
                                    onClick={() => onRemove?.(id)}
                                    className="flex h-8 items-center gap-1.5 rounded-md border border-red-500/20 px-3 text-[9px] font-semibold text-red-500 transition hover:bg-red-500/10"
                                >
                                    <Trash2 size={11} />
                                    Remove
                                </button>
                            </>}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-5 p-6">
                        {/* Primary Stats */}
                        <div className="grid grid-cols-2 overflow-hidden rounded-xl border sm:grid-cols-4" style={{ borderColor: "var(--border-default)" }}>
                            <Metric
                                icon={WalletCards}
                                label="Entry Fee"
                                value={entry_type === "paid" ? `₹${entry_fee || 0}` : "Free"}
                            />

                            <Metric
                                icon={Trophy}
                                label="Prize Pool"
                                value="₹0"
                            />

                            <Metric
                                icon={Users}
                                label="Team Capacity"
                                value={`${min_teams || 0} – ${max_teams || 0}`}
                            />

                            <Metric
                                icon={Globe}
                                label="Server"
                                value={server || "--"}
                            />
                        </div>

                        {/* Main Information */}
                        <div className="grid gap-5 lg:grid-cols-[1.35fr_.85fr]">
                            {/* Left */}
                            <div className="space-y-5">
                                <Section title="Tournament information">
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
                                        <Info label="Game" value={game_name} icon={Gamepad2} />
                                        <Info label="Team format" value={pretty(team_format)} icon={Users} />
                                        <Info label="Bracket" value={pretty(bracket_format)} icon={GitBranch} />
                                        <Info label="Category" value={pretty(category)} icon={Trophy} />
                                        <Info label="Competition" value={pretty(competition_type)} icon={Crown} />
                                        <Info label="Seeding" value={pretty(seeding_method)} icon={GitBranch} />
                                    </div>
                                </Section>

                                <Section title="Eligibility">
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
                                        <Info label="Minimum rank" value={minimum_rank} icon={Crown} />
                                        <Info label="Account level" value={minimum_account_level} icon={ShieldCheck} />
                                        <Info label="Registration" value={pretty(registration_access)} icon={Globe} />
                                        <Info label="Approval" value={pretty(registration_approval)} icon={CircleCheck} />
                                        <Info label="Minimum teams" value={min_teams} icon={Users} />
                                        <Info label="Maximum teams" value={max_teams} icon={Users} />
                                    </div>
                                </Section>

                                <Section title="Description">
                                    <p className="whitespace-pre-line text-[9px] leading-[1.8] text-[var(--text-secondary)]">
                                        {description || "No tournament description has been added."}
                                    </p>
                                </Section>
                            </div>

                            {/* Right */}
                            <div className="space-y-5">
                                <Section title="Schedule">
                                    <Timeline
                                        title="Registration opens"
                                        date={reg_open_date}
                                        time={reg_open_time}
                                        color="bg-emerald-500"
                                    />

                                    <Timeline
                                        title="Registration closes"
                                        date={reg_close_date}
                                        time={reg_close_time}
                                        color="bg-amber-500"
                                    />

                                    <Timeline
                                        title="Tournament starts"
                                        date={tournament_start_date}
                                        time={tournament_start_time}
                                        color="bg-blue-500"
                                    />

                                    <Timeline
                                        title="Tournament ends"
                                        date={tournament_end_date}
                                        time={tournament_end_time}
                                        color="bg-[var(--accent-gold)]"
                                        last
                                    />

                                    <div className="mt-5 rounded-lg border px-3 py-3" style={{ borderColor: "var(--border-subtle)" }}>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[8px] text-[var(--text-muted)]">
                                                Check-in
                                            </span>
                                            <span className="text-[9px] font-semibold text-[var(--text-primary)]">
                                                {check_in || "--"}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-[8px] text-[var(--text-muted)]">
                                                Grace period
                                            </span>
                                            <span className="text-[9px] font-semibold text-[var(--text-primary)]">
                                                {grace_period ? `${grace_period} min` : "--"}
                                            </span>
                                        </div>
                                    </div>
                                </Section>

                                <Section title="Financials">
                                    <Row label="Entry type" value={pretty(entry_type)} />
                                    <Row label="Entry fee" value={entry_type === "paid" ? `₹${entry_fee || 0}` : "Free"} />
                                    <Row label="Platform fee" value={platform_fee ? `${platform_fee}%` : "--"} />
                                    <Row label="Winner share" value={winner_share ? `${winner_share}%` : "--"} />
                                    <Row label="Runner-up share" value={runner_up_share ? `${runner_up_share}%` : "--"} />
                                </Section>
                            </div>
                        </div>

                        {/* Bottom Notice */}
                        {!visibility_status && (
                            <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3.5">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle size={14} className="mt-0.5 shrink-0 text-[var(--accent-gold)]" />

                                    <div>
                                        <p className="text-[9px] font-semibold text-[var(--text-primary)]">
                                            This tournament is unpublished
                                        </p>
                                        <p className="mt-1 text-[8px] text-[var(--text-muted)]">
                                            Players and teams cannot discover this tournament until it is published.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => onPublish?.(id)}
                                    className="hidden h-8 shrink-0 items-center gap-1.5 rounded-md bg-[var(--accent-gold)] px-3 text-[9px] font-semibold text-black transition hover:brightness-95 sm:flex"
                                >
                                    <Send size={11} />
                                    Publish
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

const Metric = ({ icon: Icon, label, value }) => (
    <div className="border-b border-r px-4 py-3.5" style={{ borderColor: "var(--border-default)" }}>
        <div className="flex items-center justify-between">
            <span className="text-[8px] text-[var(--text-muted)]">{label}</span>
            <Icon size={12} className="text-[var(--text-muted)]" />
        </div>

        <p className="mt-2 text-[14px] font-semibold tracking-[-0.2px] text-[var(--text-primary)]">
            {value || "--"}
        </p>
    </div>
);

const Section = ({ title, children }) => (
    <section className="rounded-xl border p-4" style={{ borderColor: "var(--border-default)" }}>
        <h2 className="mb-4 text-[10px] font-semibold text-[var(--text-primary)]">
            {title}
        </h2>

        {children}
    </section>
);

const Info = ({ label, value, icon: Icon }) => (
    <div>
        <div className="flex items-center gap-1.5">
            <Icon size={11} className="text-[var(--text-muted)]" />
            <span className="text-[8px] text-[var(--text-muted)]">{label}</span>
        </div>

        <p className="mt-1.5 truncate text-[9px] font-semibold capitalize text-[var(--text-primary)]">
            {value || "--"}
        </p>
    </div>
);

const Row = ({ label, value }) => (
    <div className="flex items-center justify-between border-b py-2.5 last:border-0" style={{ borderColor: "var(--border-subtle)" }}>
        <span className="text-[8px] text-[var(--text-muted)]">{label}</span>
        <span className="text-[9px] font-semibold capitalize text-[var(--text-primary)]">{value || "--"}</span>
    </div>
);

const Timeline = ({ title, date, time, color, last }) => (
    <div className="relative flex gap-3 pb-5">
        {!last && (
            <span className="absolute left-[4px] top-3 h-full w-px bg-[var(--border-default)]" />
        )}

        <span className={`relative mt-1 h-2 w-2 shrink-0 rounded-full ${color}`} />

        <div>
            <p className="text-[9px] font-semibold text-[var(--text-primary)]">
                {title}
            </p>

            <div className="mt-1 flex items-center gap-1.5">
                <CalendarDays size={9} className="text-[var(--text-muted)]" />
                <span className="text-[8px] text-[var(--text-muted)]">
                    {date ? new Date(date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }) : "--"}
                </span>

                <Clock3 size={9} className="ml-1 text-[var(--text-muted)]" />
                <span className="text-[8px] text-[var(--text-muted)]">
                    {time || "--"}
                </span>
            </div>
        </div>
    </div>
);

export default TournamentDetailsModal;