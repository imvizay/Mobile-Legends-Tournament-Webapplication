import { EllipsisVertical, UserPlus, Circle } from "lucide-react";
import MobileTeamCard from "../components/team-member/mobile-team-member/MobileTeamCard";
import DesktopTeamCard from "../components/team-member/desktop-team-member/DesktopTeamCard";
import SubstituteCard from "../components/team-member/substitute-card/SubstituteCard";


// utlis
const players = [
    { id: 1, name: "IGN Lynx", role: "Captain", captain: true, mlbb: "123456789", server: "5009", country: "India", status: "Active" },
    { id: 2, name: "IGN Raze", role: "Player", captain: false, mlbb: "987654321", server: "5010", country: "India", status: "Offline • 2m ago" },
    { id: 3, name: "IGN Nova", role: "Player", captain: false, mlbb: "112233445", server: "5009", country: "India", status: "Active" },
    { id: 4, name: "IGN Kuro", role: "Player", captain: false, mlbb: "554433221", server: "5011", country: "India", status: "Active" },
    { id: 5, name: "IGN Zenn", role: "Player", captain: false, mlbb: "667788990", server: "5012", country: "India", status: "Active" }
];

const substitutes = [
    { id: 6, name: "IGN Shadow", avatar: "/avatar.png", role: "Flexible Player", mlbb: "778899001", server: "5013", country: "India", online: false, },
    { id: 7, name: "IGN Frost", avatar: "/avatar.png", role: "Roamer", mlbb: "667744220", server: "5008", country: "Bangladesh", online: true, },
];

import { useState } from "react";
import { useQuery } from '@tanstack/react-query'

function TeamMembers() {

    const [teamMembers, setMembers] = useState([])






    return (
        <section className="space-y-8">

            {/* Header */}

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-start justify-between gap-4">

                    <div>

                        <div className="flex items-center gap-3">

                            <h2 className="text-2xl font-bold text-[var(--headline-primary)] lg:text-3xl">
                                Team Roster
                            </h2>

                            <span className="rounded-full bg-[var(--surface-elevated)] px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)]">
                                7 Players
                            </span>

                        </div>

                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                            Manage members, roles and substitutes.
                        </p>

                    </div>

                </div>

                <button className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--action-primary-bg)] px-5 text-sm font-semibold text-[var(--action-primary-text)] transition-all duration-200 hover:opacity-90 active:scale-[0.98] sm:w-auto">

                    <UserPlus size={18} />

                    <span>Invite Player</span>

                </button>

            </div>

            {/* Active Roster */}

            <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-base)] shadow-sm overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-default)] px-6 py-4">
                    <div className="flex items-center gap-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--headline-primary)]">
                            Active Roster
                        </h4>
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                            5 / 5 Players
                        </span>
                    </div>
                </div>

                {/* Player */}
                {players.map((obj) => (
                    <div key={obj.id}>
                        {/* ================= Mobile ================= */}
                        <MobileTeamCard item={obj} />

                        {/* ================= Desktop ================= */}
                        <DesktopTeamCard item={obj} />
                    </div>
                ))}
            </div>

            {/* Substitute Players */}
            <div className="mt-8 rounded-3xl border border-[var(--border-default)] bg-[var(--surface-base)] shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-[var(--border-default)] px-6 py-4">
                    <div className="flex items-center gap-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-[var(--headline-primary)]">
                            Substitutes
                        </h4>

                        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-600">
                            2 Players
                        </span>
                    </div>
                </div>

                {[substitutes].map((item) => (

                    <SubstituteCard players={substitutes} />

                ))}
            </div>
        </section>
    )
}

export default TeamMembers