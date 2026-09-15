import { Trophy, Search, Plus, Download, Users, CalendarDays, Clock3, MoreVertical, ChevronDown, Globe, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

function TournamentRow({ tournament, onPublish, openMenu, setOpenMenu, setSelTournament }) {

    const {
        id,
        tournament_name,
        category,
        bracket_format,
        team_format,
        min_teams,
        max_teams,
        entry_fee,
        registration_opens_at,
        registration_closes_at,
        starts_at,
        ends_at,
        status,
        visibility_status,
    } = tournament;

    const formatDate = (value) => {
        if (!value) return null;

        return new Date(value).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (value) => {
        if (!value) return null;

        return new Date(value).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const reg_open_date = formatDate(registration_opens_at);
    const reg_open_time = formatTime(registration_opens_at);

    const reg_close_date = formatDate(registration_closes_at);
    const reg_close_time = formatTime(registration_closes_at);

    const tournament_start_date = formatDate(starts_at);
    const tournament_start_time = formatTime(starts_at);

    const tournament_end_date = formatDate(ends_at);
    const tournament_end_time = formatTime(ends_at);

    const state = status || "Upcoming";

    const stateColor =
        state === "Ongoing"
            ? "text-emerald-600"
            : state === "Upcoming"
                ? "text-blue-600"
                : state === "Completed"
                    ? "text-[var(--text-muted)]"
                    : "text-red-500";

    const stateDot =
        state === "Ongoing"
            ? "bg-emerald-500"
            : state === "Upcoming"
                ? "bg-blue-500"
                : state === "Completed"
                    ? "bg-gray-400"
                    : "bg-red-500";

    return (
        <tr className="border-b border-[var(--border-default)] last:border-0 transition hover:bg-[rgba(255,255,255,0.018)]">

            {/* Tournament */}
            <td className="px-3 py-3">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--border-default)] bg-[var(--surface-elevated)]">

                        {tournament?.banner_image_url ?
                            <img src={tournament?.banner_image_url} alt="no-img" /> :
                            <Trophy
                                size={13}
                                strokeWidth={1.5}
                                className="text-[var(--accent-gold)]"
                            />}

                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-[9px] font-semibold">
                            {tournament_name}
                        </p>

                        <p className="mt-0.5 truncate text-[7px] text-[var(--text-muted)]">
                            {category?.charAt(0).toUpperCase() + category?.slice(1)}
                        </p>
                    </div>
                </div>
            </td>

            {/* Format */}
            <td className="px-2 py-3">
                <p className="text-[9px] font-medium">
                    {team_format?.replace("vs", "v")}
                </p>

                <p className="mt-0.5 truncate text-[7px] text-[var(--text-muted)]">
                    {bracket_format?.replaceAll("_", " ")
                        ?.replace(/\b\w/g, (char) => char.toUpperCase())}
                </p>
            </td>

            {/* Teams */}
            <td className="px-2 py-3">
                <div className="flex items-center gap-1 text-[9px] font-medium">
                    <Users
                        size={10}
                        className="text-[var(--text-muted)]"
                    />

                    {min_teams}–{max_teams}
                </div>

                <p className="mt-0.5 text-[7px] text-[var(--text-muted)]">
                    Team Capacity
                </p>
            </td>

            {/* Entry Fee */}
            <td className="px-2 py-3">
                <p className="text-[9px] font-semibold">
                    ₹{entry_fee ?? 0}
                </p>

                <p className="mt-0.5 text-[7px] text-[var(--text-muted)]">
                    Entry Fee
                </p>
            </td>

            {/* Registration */}
            <td className="px-2 py-3">
                <div className="space-y-0.5">
                    <p className="flex items-center gap-1 text-[7px] text-[var(--text-muted)]">
                        <CalendarDays size={9} />
                        Opens
                        <span className="font-medium text-[var(--text-primary)]">
                            {formatDate(reg_open_date, reg_open_time)}
                        </span>
                    </p>

                    <p className="flex items-center gap-1 text-[7px] text-[var(--text-muted)]">
                        <Clock3 size={9} />
                        Closes
                        <span className="font-medium text-[var(--text-primary)]">
                            {formatDate(reg_close_date, reg_close_time)}
                        </span>
                    </p>
                </div>
            </td>

            {/* Tournament Schedule */}
            <td className="px-2 py-3">
                <div className="space-y-0.5">
                    <p className="text-[8px] font-medium">
                        Start · {formatDate(
                            tournament_start_date,
                            tournament_start_time
                        )}
                    </p>

                    <p className="text-[7px] text-[var(--text-muted)]">
                        End · {formatDate(
                            tournament_end_date,
                            tournament_end_time
                        )}
                    </p>
                </div>
            </td>

            {/* State */}
            <td className="px-2 py-3">
                <div className={`flex items-center gap-1.5 text-[8px] font-medium ${stateColor}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${stateDot}`} />
                    {state}
                </div>
            </td>

            {/* Visibility */}
            <td className="px-2 py-3">
                {visibility_status == "published" ? (
                    <div className="flex items-center gap-1.5 text-[8px] font-medium text-emerald-600">
                        <Globe size={10} />
                        Published
                    </div>
                ) : (
                    <button
                        onClick={() => onPublish(id)}
                        className="flex items-center gap-1.5 text-[8px] font-semibold text-[var(--accent-gold)] hover:underline"
                    >
                        <EyeOff size={10} />
                        Unpublished
                    </button>
                )}
            </td>

            {/* Action */}
            <td className="px-2 py-3 text-right">
                <div className="relative flex justify-end">
                    <button
                        onClick={() =>
                            setOpenMenu(openMenu === id ? null : id)
                        }
                        className={`flex h-7 w-7 items-center justify-center rounded-md border transition ${openMenu === id
                            ? "border-[var(--border-default)] bg-[var(--surface-elevated)] text-[var(--text-primary)]"
                            : "border-[var(--border-default)] text-[var(--text-muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        <MoreVertical size={13} strokeWidth={1.6} />
                    </button>

                    {openMenu === id && (
                        <div className="absolute right-7 top-1/2 z-50 w-[155px] -translate-y-1/2 rounded-lg border border-[var(--border-default)] bg-[var(--surface-base)] p-1 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">

                            <button

                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelTournament(tournament)
                                }}
                                className="flex items-center rounded-md px-2.5 py-2 text-[9px] font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-elevated)]"
                            >
                                See details
                            </button>

                            <Link
                                to={`/admin/tournaments/${id}/edit`}
                                onClick={() => setOpenMenu(null)}
                                className="flex items-center rounded-md px-2.5 py-2 text-[9px] font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-elevated)]"
                            >
                                Edit tournament
                            </Link>

                        </div>
                    )}
                </div>
            </td>

        </tr>
    );
}

export default TournamentRow