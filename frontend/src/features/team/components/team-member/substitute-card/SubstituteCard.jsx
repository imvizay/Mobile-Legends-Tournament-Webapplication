import { EllipsisVertical, Users } from "lucide-react";
import MobileTeamCard from "../mobile-team-member/MobileTeamCard";

function SubstituteCard({ players = [] }) {

    if (players.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center px-8 py-16 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                    <Users size={30} className="text-slate-400" />
                </div>

                <h4 className="mt-5 text-lg font-semibold text-[var(--headline-primary)]">
                    No Substitute Players
                </h4>

                <p className="mt-2 max-w-sm text-sm text-[var(--text-secondary)]">
                    Your team currently has no substitute players. Invite one to
                    strengthen your roster and prepare for unexpected changes.
                </p>

            </div>
        );
    }

    return (
        <>
            {players.map((player) => (
                <>
                <MobileTeamCard item={player}/>

                <div
                    key={player.id}
                    className="
                    hidden 
                    lg:grid grid-cols-[55px_1fr_150px_90px_110px_95px_40px] items-center gap-4 border-b border-[var(--border-default)] px-6 py-3 transition hover:bg-slate-50 last:border-0"
                >

                    {/* Number */}

                    <div className="flex justify-center">

                        <span className="select-none text-[32px] font-black leading-none tracking-tight text-slate-300">
                            {String(player.id).padStart(2, "0")}
                        </span>

                    </div>

                    {/* Player */}

                    <div className="flex items-center gap-3 min-w-0">

                        <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shrink-0">
                            <img
                                src={player.avatar}
                                alt={player.name}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="min-w-0">

                            <div className="flex items-center gap-2">

                                <h5 className="truncate text-[15px] font-semibold text-[var(--headline-primary)]">
                                    {player.name}
                                </h5>

                                <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                                    Substitute
                                </span>

                            </div>

                            <p className="text-[11px] text-[var(--text-secondary)]">
                                {player.role || "Flexible Player"}
                            </p>

                        </div>

                    </div>

                    {/* MLBB */}

                    <div className="hidden md:flex flex-col">

                        <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                            MLBB ID
                        </span>

                        <span className="text-sm font-medium">
                            {player.mlbb}
                        </span>

                    </div>

                    {/* Server */}

                    <div className="hidden lg:flex flex-col">

                        <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                            Server
                        </span>

                        <span className="text-sm font-medium">
                            {player.server}
                        </span>

                    </div>

                    {/* Country */}

                    <div className="hidden xl:flex flex-col">

                        <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                            Country
                        </span>

                        <span className="text-sm font-medium">
                            {player.country}
                        </span>

                    </div>

                    {/* Status */}

                    <div className="flex items-center gap-2">

                        <span className={`h-2.5 w-2.5 rounded-full ${player.online ? "bg-emerald-500" : "bg-slate-400"}`} />

                        <span className="text-xs font-medium text-slate-600">
                            {player.online ? "Standby" : "Offline"}
                        </span>

                    </div>

                    {/* Menu */}

                    <button className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-slate-100">

                        <EllipsisVertical size={16} />

                    </button>

                </div>
                </>

            ))}
        </>
    );

}

export default SubstituteCard;