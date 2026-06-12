import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Search, Plus, Download, Users, CalendarDays, Clock3, MoreVertical, ChevronDown, Globe, EyeOff } from "lucide-react";

// tanstack query
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../../../../contexts/UserContext";
import { tournamentService } from "../../../../services/admin/tournament_service";

import { useOutletContext } from "react-router-dom";
import TournamentDetailsModal from "./AdminTournamentDetail";
import TournamentRow from "../../components/TournamentRow";

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




export default AdminTournamentOverview;

