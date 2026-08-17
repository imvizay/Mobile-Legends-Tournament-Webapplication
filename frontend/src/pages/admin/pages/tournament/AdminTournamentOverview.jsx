import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Search, Plus, Download, Users, CalendarDays, Clock3, MoreVertical, ChevronDown, Globe, EyeOff } from "lucide-react";

// tanstack query
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../../../../contexts/UserContext";
import { tournamentService } from "../../../../services/admin/tournament_service";

import { useOutletContext } from "react-router-dom";
import TournamentDetailsModal from "./AdminTournamentDetail";

function AdminTournamentOverview() {

    const [openMenu, setOpenMenu] = useState(false)
    const { user } = useUserContext()
    const { isSelTournament, setSelTournament } = useOutletContext()

    const {
        data: tournaments,
        isSuccess,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["tournaments", user?.id],
        queryFn: tournamentService.getTournaments,
        enabled: !!user?.id,
    })

    const publishTournament = (id) => {
        setTournaments((current) => current.map((tournament) => tournament.id === id ? { ...tournament, published: true } : tournament));
    }


    return (
        <div className="min-h-screen bg-[var(--surface-base)] px-6 py-5 text-[var(--text-primary)]">

            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <p className="mb-1.5 text-[8px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">Tournament Management</p>
                    <div className="flex items-center gap-2">
                        <h1 className="text-[23px] font-semibold tracking-[-0.7px]">Tournaments</h1>
                        <Trophy size={17} strokeWidth={1.6} className="text-[var(--accent-gold)]" />
                    </div>
                    <p className="mt-1 text-[10px] text-[var(--text-muted)]">Manage tournaments, registrations, schedules and platform visibility.</p>
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex h-8 items-center gap-1.5 rounded-md border border-[var(--border-default)] px-3 text-[9px] font-medium hover:bg-[var(--surface-elevated)]"><Download size={13} strokeWidth={1.5} /> Export</button>
                    <Link to="/admin/tournaments/create" className="flex h-8 items-center gap-1.5 rounded-md bg-[var(--accent-gold)] px-3.5 text-[9px] font-semibold text-white hover:brightness-95"><Plus size={13} strokeWidth={1.8} /> Create Tournament</Link>
                </div>
            </div>

            {/* Tournament List */}
            <div className="mt-6">

                {/* Filters */}
                <div className="mb-3 flex items-center gap-1.5">
                    <div className="flex h-8 w-[220px] items-center gap-2 rounded-md border border-[var(--border-default)] px-2.5">
                        <Search size={13} strokeWidth={1.5} className="shrink-0 text-[var(--text-muted)]" />
                        <input type="text" placeholder="Search tournaments..." className="w-full bg-transparent text-[9px] outline-none placeholder:text-[var(--text-muted)]" />
                    </div>

                    <FilterButton text="Game" />
                    <FilterButton text="Tournament Type" />
                    <FilterButton text="State" />
                    <FilterButton text="Visibility" />
                    <FilterButton text="Date" />

                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-lg border border-[var(--border-default)]">
                    <table className="w-full table-fixed border-collapse">

                        <thead>
                            <tr className="border-b border-[var(--border-default)] bg-[var(--surface-elevated)]">
                                <th className="w-[21%] px-3 py-2.5 text-left text-[7px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">Tournament</th>
                                <th className="w-[10%] px-2 py-2.5 text-left text-[7px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">Format</th>
                                <th className="w-[8%] px-2 py-2.5 text-left text-[7px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">Teams</th>
                                <th className="w-[9%] px-2 py-2.5 text-left text-[7px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">Prize</th>
                                <th className="w-[16%] px-2 py-2.5 text-left text-[7px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">Registration</th>
                                <th className="w-[16%] px-2 py-2.5 text-left text-[7px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">Tournament</th>
                                <th className="w-[7%] px-2 py-2.5 text-left text-[7px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">State</th>
                                <th className="w-[8%] px-2 py-2.5 text-left text-[7px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]">Visibility</th>
                                <th className="w-[5%] px-2 py-2.5 text-right text-[7px] font-semibold uppercase tracking-[0.06em] text-[var(--text-muted)]"></th>
                            </tr>
                        </thead>

                        <tbody>
                            {tournaments?.tournament?.map((tournament) => (
                                <TournamentRow
                                    key={tournament.id}
                                    tournament={tournament}
                                    openMenu={openMenu}
                                    setOpenMenu={setOpenMenu}
                                    onPublish={publishTournament}
                                    setSelTournament={setSelTournament}
                                />
                            ))}
                        </tbody>

                    </table>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-[var(--border-default)] px-3 py-2.5">
                        <p className="text-[8px] text-[var(--text-muted)]">Showing 1–7 of 156 tournaments</p>
                        <div className="flex items-center gap-1">
                            <button className="flex h-6 w-6 items-center justify-center rounded border border-[var(--border-default)] text-[8px] hover:bg-[var(--surface-elevated)]">1</button>
                            <button className="flex h-6 w-6 items-center justify-center rounded border border-[var(--border-default)] text-[8px] hover:bg-[var(--surface-elevated)]">2</button>
                            <button className="flex h-6 w-6 items-center justify-center rounded border border-[var(--border-default)] text-[8px] hover:bg-[var(--surface-elevated)]">3</button>
                            <span className="px-1 text-[8px] text-[var(--text-muted)]">...</span>
                            <button className="flex h-6 w-6 items-center justify-center rounded border border-[var(--border-default)] text-[8px] hover:bg-[var(--surface-elevated)]">16</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}


function FilterButton({ text }) {

    return <button className="flex h-8 items-center gap-2 rounded-md border border-[var(--border-default)] px-2.5 text-[8px] font-medium hover:bg-[var(--surface-elevated)]">{text}<ChevronDown size={11} /></button>;
}

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
        reg_open_date,
        reg_open_time,
        reg_close_date,
        reg_close_time,
        tournament_start_date,
        tournament_start_time,
        tournament_end_date,
        tournament_end_time,
        status,
        visibility_status,
    } = tournament;


    const formatDate = (date, time) => {
        if (!date || !time) return "--";

        const value = new Date(`${date}T${time}`);

        return value.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }) + ", " + value.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

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


export default AdminTournamentOverview;

