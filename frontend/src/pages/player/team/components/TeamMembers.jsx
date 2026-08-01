import React, { useState } from "react";
import EmptySubstituteCard from "../empty_states/EmptySubstituteCard";
import PlayerCard from "./team_member_components/PlayerCard";
import { EmptyMemberCard, HeaderStat, SectionHeader } from "./team_member_components/SupportingComponent";
import RosterSection from "./team_member_components/RosterSection";
import { LockKeyhole, ShieldCheck } from "lucide-react";

// const dummyMembers = [
//     { id: 1, username: "VIZAY", email: "vijay.meena@example.com", role: "captain", status: "active", tournament_role: "roster", tournament_ready: true, mlbb_id: "812345678", mlbb_server: "2314" },
//     { id: 2, username: "ARJUN", email: "arjun.sharma@example.com", role: "player", status: "active", tournament_role:null, tournament_ready: true, mlbb_id: "823456789", mlbb_server: "2314" },
//     { id: 3, username: "RAHUL", email: "rahul.verma@example.com", role: "player", status: "active", tournament_role: null, tournament_ready: true, mlbb_id: "834567890", mlbb_server: "2314" },
//     { id: 4, username: "AMAN", email: "aman.khan@example.com", role: "player", status: "active", tournament_role: null, tournament_ready: false, mlbb_id: "845678901", mlbb_server: "2314" },
//     { id: 5, username: "KARAN", email: "karan.singh@example.com", role: "player", status: "active", tournament_role: null, tournament_ready: false, mlbb_id: "856789012", mlbb_server: "2314" },
//     { id: 6, username: "ROHIT", email: "rohit.yadav@example.com", role: "player", status: "active", tournament_role: null, tournament_ready: false, mlbb_id: "867890123", mlbb_server: "2314" },
// ];

export default function TeamMembers({ members = [], isCaptain = true, isRosterLocked = false, onInvite, onViewProfile, onMakeRoster, onRemoveRoster, onMakeSubstitute, onRemindPayment }) {
    const [activeMenu, setActiveMenu] = useState(null);

    const activeMembers = members.filter((member) => member.status === "active");

    const rosterMembers = activeMembers.filter((member) => member.tournament_role === "roster").slice(0, 5);

    const substituteMembers = activeMembers.filter((member) => member.tournament_role === "substitute").slice(0, 2);

    const regularMembers = activeMembers.filter((member) => !member.tournament_role);

    const readyRosterCount = rosterMembers.filter((member) => member.tournament_ready).length;

    const rosterComplete = rosterMembers.length === 5;

    const allRosterReady = rosterMembers.length > 0 && readyRosterCount === rosterMembers.length;

    return (
        <section className="w-full min-w-0">
            <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-[var(--accent-gold)]" />
                        <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">Team Competition Management</span>
                    </div>

                    <h2 className="mt-2 text-[21px] font-bold tracking-[-0.035em] text-[var(--headline-primary)] sm:text-[24px]">Team Members</h2>

                    <p className="mt-1 max-w-2xl text-[9px] leading-relaxed text-[var(--text-muted)] sm:text-[10px]">Manage the active team, assign tournament roster positions, maintain substitutes, and track player readiness for competition.</p>
                </div>

                <div className="grid shrink-0 grid-cols-3 gap-5 border-t pt-3 sm:flex sm:border-t-0 sm:pt-0">
                    <HeaderStat label="Members" value={activeMembers.length} />
                    <HeaderStat label="Roster" value={`${rosterMembers.length}/5`} />
                    <HeaderStat label="Ready" value={`${readyRosterCount}/${rosterMembers.length || 0}`} />
                </div>
            </div>

            <div className="overflow-hidden rounded-[18px] border bg-[var(--surface-elevated)] sm:rounded-[20px]" style={{ borderColor: "var(--border-default)" }}>

                {/* Tournament Roster */}
                <div className="relative">
                    <RosterSection members={rosterMembers} isLocked={isRosterLocked} />
                </div>

                {/* Active Members */}
                <div className="border-t p-3 sm:p-4 lg:p-5" style={{ borderColor: "var(--border-subtle)" }}>
                    <SectionHeader title="Active Team Members" description={rosterComplete ? "Players currently active within the team outside the confirmed tournament roster." : "Available players can be assigned to the tournament roster when the captain is ready."} count={activeMembers.length} />

                    {regularMembers.length > 0 || activeMembers.length < 5 ? (
                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {regularMembers.map((member, index) => (
                                <PlayerCard key={member.id} member={member} number={index + 1} isCaptain={isCaptain} isRosterLocked={isRosterLocked} menuOpen={activeMenu === member.id} onToggleMenu={() => setActiveMenu(activeMenu === member.id ? null : member.id)} onViewProfile={() => onViewProfile?.(member)} onMakeRoster={() => onMakeRoster?.(member)} onRemoveRoster={() => onRemoveRoster?.(member)} onMakeSubstitute={() => onMakeSubstitute?.(member)} onRemindPayment={() => onRemindPayment?.(member)} />
                            ))}

                            {activeMembers.length < 5 && Array.from({ length: 5 - activeMembers.length }).map((_, index) => (
                                <EmptyMemberCard key={`empty-member-${index}`} number={activeMembers.length + index + 1} isCaptain={isCaptain} onInvite={onInvite} />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-3 flex items-center gap-3 rounded-xl border px-4 py-3" style={{ background: "var(--surface-base)", borderColor: "var(--border-subtle)" }}>
                            <ShieldCheck size={14} className="shrink-0" style={{ color: "var(--accent-gold)" }} />
                            <p className="text-[8px] leading-relaxed text-[var(--text-muted)] sm:text-[9px]">All current team members have already been assigned to a competitive role for this tournament.</p>
                        </div>
                    )}
                </div>

                {/* Substitutes */}
                <div className="border-t p-3 sm:p-4 lg:p-5" style={{ borderColor: "var(--border-subtle)" }}>
                    <SectionHeader title="Tournament Substitutes" description="Reserve players may be called upon when a confirmed roster member becomes unavailable during the competition." count={`${substituteMembers.length}/2`} />

                    <div className="mt-3">
                        {substituteMembers.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                {substituteMembers.map((member, index) => (
                                    <PlayerCard key={member.id} member={member} number={index + 1} substitute isCaptain={isCaptain} isRosterLocked={isRosterLocked} menuOpen={activeMenu === member.id} onToggleMenu={() => setActiveMenu(activeMenu === member.id ? null : member.id)} onViewProfile={() => onViewProfile?.(member)} onMakeRoster={() => onMakeRoster?.(member)} onRemoveRoster={() => onRemoveRoster?.(member)} onMakeSubstitute={() => onMakeSubstitute?.(member)} onRemindPayment={() => onRemindPayment?.(member)} />
                                ))}
                            </div>
                        ) : (
                            <EmptySubstituteCard />
                        )}
                    </div>

                    <div className="mt-3 flex items-start gap-2 border-t pt-3 sm:mt-4 sm:pt-4" style={{ borderColor: "var(--border-subtle)" }}>
                        <ShieldCheck size={11} className="mt-0.5 shrink-0" style={{ color: "var(--text-muted)" }} />

                        <p className="text-[7px] leading-[1.65] text-[var(--text-muted)] sm:text-[8px]">
                            Substitute players are maintained separately from the five-player competitive roster. Their purpose is to provide a verified replacement option when a roster player cannot participate due to an approved emergency or tournament-related eligibility issue.
                        </p>
                    </div>
                </div>

                {/* Competition Status */}
                <div className="border-t px-3 py-3 sm:px-4 sm:py-4 lg:px-5" style={{ borderColor: "var(--border-subtle)" }}>
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-2">
                            <span className="size-1.5 shrink-0 rounded-full" style={{ background: allRosterReady ? "var(--accent-gold)" : "var(--text-muted)" }} />

                            <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] sm:text-[8px]">
                                {allRosterReady ? "Tournament roster fully confirmed and ready for competition." : `${Math.max(rosterMembers.length - readyRosterCount, 0)} roster member${rosterMembers.length - readyRosterCount === 1 ? "" : "s"} still require readiness confirmation.`}
                            </p>
                        </div>

                        <span className="shrink-0 text-[7px] font-bold uppercase tracking-[0.12em]" style={{ color: rosterComplete ? "var(--accent-gold)" : "var(--text-muted)" }}>
                            {rosterComplete ? "Roster Complete" : `${5 - rosterMembers.length} Slot${5 - rosterMembers.length === 1 ? "" : "s"} Remaining`}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}