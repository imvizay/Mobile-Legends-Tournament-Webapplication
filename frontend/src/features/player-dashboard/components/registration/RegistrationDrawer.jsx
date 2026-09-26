import React from "react"
import { X, Users, Plus, ArrowUpRight, LockKeyhole, ShieldCheck, Crown, CheckCircle2 } from "lucide-react"

function TournamentRegistrationModal({ type, team, tournament, onClose, onExploreTeams, onCreateTeam, onViewTeam, onRegister }) {

    const isNoTeam = type === "NO_TEAM"
    const isMember = type === "TEAM_MEMBER"
    const isCaptain = type === "TEAM_CAPTAIN"
    const members = team?.members ?? []

    return (
        <div className="fixed inset-0 z-50 bg-black/15 backdrop-blur-[2px]" onClick={onClose}>
            <aside className="absolute right-0 top-0 flex h-full w-[calc(100%-50px)] max-w-[430px] flex-col overflow-hidden border-l border-[var(--border-default)] bg-[var(--surface-base)] shadow-[-18px_0_50px_rgba(0,0,0,0.12)]" onClick={(event) => event.stopPropagation()}>
                <div className="flex shrink-0 items-start justify-between border-b border-[var(--border-default)] px-5 py-5 sm:px-6">
                    <div className="min-w-0 pr-4">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-gold)]">Tournament Registration</p>
                        <h2 className="mt-1.5 truncate text-[17px] font-semibold tracking-[-0.02em] text-[var(--text-primary)]">{isNoTeam ? "Team required" : isMember ? "Captain registration required" : "Register your team"}</h2>
                    </div>
                    <button type="button" onClick={onClose} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-default)] text-[var(--text-muted)] transition-transform hover:-translate-y-px hover:text-[var(--text-primary)]"><X size={15} /></button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
                    {isNoTeam && (
                        <div className="flex min-h-[70vh] flex-col justify-between">
                            <div className="pt-8 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--accent-gold)]/20 bg-[var(--accent-gold)]/8 text-[var(--accent-gold)] shadow-sm"><Users size={25} strokeWidth={1.6} /></div>
                                <p className="mt-6 text-[15px] font-semibold text-[var(--text-primary)]">You're not in a team yet</p>
                                <p className="mx-auto mt-2 max-w-[290px] text-[11px] leading-relaxed text-[var(--text-muted)]">This tournament is team-based. Join an existing squad or create your own before registration.</p>
                            </div>

                            <div className="space-y-2.5 pb-2">
                                <button type="button" onClick={onExploreTeams} className="flex w-full items-center justify-between rounded-xl bg-[var(--accent-gold)] px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-transform hover:-translate-y-px"><span>Explore Teams</span><ArrowUpRight size={15} /></button>
                                <button type="button" onClick={onCreateTeam} className="flex w-full items-center justify-between rounded-xl border border-[var(--border-default)] px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)] transition-transform hover:-translate-y-px"><span className="flex items-center gap-2"><Plus size={14} /> Create Team</span><ArrowUpRight size={15} /></button>
                            </div>
                        </div>
                    )}

                    {(isMember || isCaptain) && (
                        <div className="space-y-5">
                            <div className="relative overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--surface-secondary)]/35 p-5">
                                <div className="absolute right-[-35px] top-[-35px] h-24 w-24 rounded-full bg-[var(--accent-gold)]/8 blur-2xl" />
                                <div className="relative flex items-center gap-3.5">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--accent-gold)]/20 bg-[var(--accent-gold)]/10 text-[11px] font-bold tracking-wider text-[var(--accent-gold)]">{team?.tag ?? "TM"}</div>
                                    <div className="min-w-0">
                                        <p className="truncate text-[14px] font-semibold text-[var(--text-primary)]">{team?.name}</p>
                                        <p className="mt-1 text-[10px] text-[var(--text-muted)]">{team?.country ?? "India"} <span className="mx-1">·</span> {team?.members_count ?? members.length} members</p>
                                    </div>
                                    {isCaptain && <div className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]"><Crown size={13} /></div>}
                                </div>
                            </div>

                            <div className={`rounded-xl border p-4 ${isCaptain ? "border-green-500/20 bg-green-500/[0.035]" : "border-[var(--accent-gold)]/20 bg-[var(--accent-gold)]/[0.035]"}`}>
                                <div className="flex items-start gap-3">
                                    {isCaptain ? <ShieldCheck size={17} className="mt-0.5 shrink-0 text-green-600" /> : <LockKeyhole size={17} className="mt-0.5 shrink-0 text-[var(--accent-gold)]" />}
                                    <div>
                                        <p className="text-xs font-semibold text-[var(--text-primary)]">{isCaptain ? "You're the team captain" : "Captain registration required"}</p>
                                        <p className="mt-1 text-[10px] leading-relaxed text-[var(--text-muted)]">{isCaptain ? `You're registering ${team?.name ?? "your team"} for this tournament.` : `Ask ${team?.captain?.captain_name ?? "your captain"} to register the team.`}</p>
                                    </div>
                                </div>
                            </div>

                            {isCaptain && (
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users size={14} className="text-[var(--accent-gold)]" />
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">Team Roster</p>
                                        </div>
                                        <span className="text-[9px] text-[var(--text-muted)]">{team?.members_count ?? members.length} members</span>
                                    </div>

                                    <div className="overflow-hidden rounded-xl border border-[var(--border-default)]">
                                        {members.length > 0 ? members.map((member, index) => (
                                            <div key={member.id ?? index} className="flex items-center gap-3 border-b border-[var(--border-default)] px-4 py-3 last:border-b-0">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-secondary)] text-[10px] font-semibold text-[var(--text-secondary)]">{member.name?.slice(0, 1)?.toUpperCase() ?? "P"}</div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-[11px] font-medium text-[var(--text-primary)]">{member.name ?? member.username ?? "Player"}</p>
                                                    <p className="mt-0.5 text-[9px] uppercase tracking-[0.08em] text-[var(--text-muted)]">{member.role ?? "PLAYER"}</p>
                                                </div>
                                                <CheckCircle2 size={14} className="shrink-0 text-green-600" />
                                            </div>
                                        )) : (
                                            <div className="px-4 py-5 text-center">
                                                <p className="text-[10px] text-[var(--text-muted)]">No roster members available.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {isMember && (
                                <button type="button" onClick={onViewTeam} className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)] transition-transform hover:-translate-y-px">View Team <ArrowUpRight size={14} /></button>
                            )}
                        </div>
                    )}
                </div>

                {isCaptain && (
                    <div className="shrink-0 border-t border-[var(--border-default)] bg-[var(--surface-base)] px-5 py-4 sm:px-6">

                        <button type="button" onClick={() => {
                            const tournamentID = tournament?.[0]?.id
                            if (!tournamentID) return
                            onRegister(tournamentID)
                        }}

                            className="flex w-full items-center justify-between rounded-xl bg-[var(--accent-gold)] px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition-transform hover:-translate-y-px"><span>Register Team</span><ArrowUpRight size={16} /></button>
                    </div>
                )}

                {tournament[0] && (
                    <div className="shrink-0 px-5 pb-4 text-center sm:px-6">
                        <p className="truncate text-[9px] text-[var(--text-muted)]">{tournament?.[0].tournament_name}</p>
                    </div>
                )}
            </aside>
        </div>
    )
}

export default TournamentRegistrationModal