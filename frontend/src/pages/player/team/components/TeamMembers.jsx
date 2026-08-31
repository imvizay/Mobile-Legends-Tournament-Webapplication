import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import EmptySubstituteCard from "../empty_states/EmptySubstituteCard";
import PlayerCard from "./team_member_components/PlayerCard";
// roster section
import RosterSection from "./team_member_components/RosterSection";

import { EmptyMemberCard, HeaderStat } from "./team_member_components/SupportingComponent";


export default function TeamMembers({
    members = [],
    selected_rosters = [],
    isCaptain = false,
    isRosterLocked = false,
    onConfirmRoster,
    onInvite,
    onViewProfile,
    onMakeRoster,
    onRemoveRoster,
    onMakeSubstitute,
    onRemindPayment
}) {
    const [activeMenu, setActiveMenu] = useState(null);

    const {
        activeMembers,
        rosterMembers,
        substituteMembers,
        regularMembers,
        readyRosterCount,
        rosterComplete,
        allRosterReady,
        remainingRosterSlots
    } = useMemo(() => {
        const active = members.filter((member) => member.status === "active");
        const roster = selected_rosters ?? [];
        const substitutes = active.filter((member) => member.tournament_role === "substitute").slice(0, 2);
        const regular = active.filter((member) => !member.tournament_role);
        const readyCount = roster.filter((member) => member.tournament_readiness === "ready").length;
        const complete = roster.length === 5;
        const allReady = roster.length > 0 && readyCount === roster.length;

        return {
            activeMembers: active,
            rosterMembers: roster,
            substituteMembers: substitutes,
            regularMembers: regular,
            readyRosterCount: readyCount,
            rosterComplete: complete,
            allRosterReady: allReady,
            remainingRosterSlots: Math.max(5 - roster.length, 0)
        };
    }, [members, selected_rosters]);

    console.log("SELECTED ROSTER",rosterMembers)

    const readinessMessage = allRosterReady
        ? "The complete tournament roster is confirmed and ready for competition."
        : rosterMembers.length === 0
            ? "Select players to begin building the tournament roster."
            : `${Math.max(rosterMembers.length - readyRosterCount, 0)} roster member${rosterMembers.length - readyRosterCount === 1 ? "" : "s"} still require readiness confirmation.`;

    const handleToggleMenu = (memberId) => {
        setActiveMenu((current) => current === memberId ? null : memberId);
    };
    return (
        <section className="w-full min-w-0">
            <header className="mb-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-[var(--accent-gold)]" />
                            <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">Competition Management</span>
                        </div>

                        <h2 className="mt-2 text-[22px] font-bold tracking-[-0.04em] text-[var(--headline-primary)] sm:text-[25px]">
                            Team Members
                        </h2>

                        <p className="mt-1.5 max-w-2xl text-[9px] leading-relaxed text-[var(--text-muted)] sm:text-[10px]">
                            Organize your competitive squad, manage tournament roles, and prepare your players for the upcoming competition.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-5 sm:gap-7">
                        <HeaderStat label="Active" value={activeMembers.length} />
                        <HeaderStat label="Roster" value={`${rosterMembers.length}/5`} />
                        <HeaderStat label="Ready" value={`${readyRosterCount}/5`} />
                    </div>
                </div>
            </header>

            <div className="space-y-6">
                <section className="overflow-hidden rounded-[20px] border border-[var(--border-default)] bg-[var(--surface-elevated)]">
                    <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                        <div className="flex min-w-0 items-start gap-3">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-base)] text-[var(--accent-gold)]">
                                <ShieldCheck size={15} />
                            </span>

                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-primary)]">
                                        Tournament Roster
                                    </h3>

                                    <span className="size-1 rounded-full bg-[var(--accent-gold)]" />
                                </div>

                                <p className="mt-1 text-[8px] leading-relaxed text-[var(--text-muted)]">
                                    Select the five players representing your team in this tournament.
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                            {isRosterLocked && (
                                <span className="inline-flex items-center gap-1.5 text-[7px] font-bold uppercase tracking-[0.1em] text-[var(--accent-gold)]">
                                    <LockKeyhole size={11} />
                                    Locked
                                </span>
                            )}

                            <div className="border-l border-[var(--border-subtle)] pl-3">
                                <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">Selected</p>
                                <p className="mt-0.5 text-[13px] font-bold text-[var(--accent-gold)]">{rosterMembers.length}<span className="text-[9px] text-[var(--text-muted)]">/5</span></p>
                            </div>
                        </div>
                    </div>
                    <RosterSection 
                    selectedRoster={rosterMembers} 
                    isLocked={isRosterLocked}
                    onConfirmRoster={onConfirmRoster}
                    />
                </section>

                <section className="rounded-[20px] bg-[var(--surface-elevated)]">
                    <div className="flex flex-col gap-2 px-1 pb-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <span className="text-[7px] font-bold uppercase tracking-[0.16em] text-[var(--accent-gold)]">
                                Team Management
                            </span>

                            <h3 className="mt-1 text-[17px] font-bold tracking-[-0.025em] text-[var(--headline-primary)]">
                                Players & Reserves
                            </h3>

                            <p className="mt-1 text-[8px] text-[var(--text-muted)]">
                                Manage available members and maintain tournament replacement options.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                        <div className="min-w-0 rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-elevated)]">
                            <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] px-4 py-3 sm:px-5">
                                <div className="min-w-0">
                                    <h4 className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--text-primary)]">
                                        Available Members
                                    </h4>

                                    <p className="mt-1 text-[7px] leading-relaxed text-[var(--text-muted)]">
                                        Players currently available for tournament assignment.
                                    </p>
                                </div>

                                <span className="shrink-0 text-[10px] font-bold text-[var(--accent-gold)]">
                                    {regularMembers.length}
                                </span>
                            </div>

                            <div className="p-3 sm:p-4">
                                {regularMembers.length > 0 || activeMembers.length < 5 ? (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                                        {regularMembers.map((member, index) => (
                                            <PlayerCard
                                                key={member.id}
                                                member={member}
                                                number={index + 1}
                                                isCaptain={isCaptain}
                                                isRosterLocked={isRosterLocked}
                                                menuOpen={activeMenu === member.id}
                                                onToggleMenu={() => handleToggleMenu(member.id)}
                                                onViewProfile={() => onViewProfile?.(member)}
                                                onMakeRoster={() => onMakeRoster?.(member)}
                                                onRemoveRoster={() => onRemoveRoster?.(member)}
                                                onMakeSubstitute={() => onMakeSubstitute?.(member)}
                                                onRemindPayment={() => onRemindPayment?.(member)}
                                            />
                                        ))}

                                        {activeMembers.length < 5 && Array.from({ length: 5 - activeMembers.length }).map((_, index) => (
                                            <EmptyMemberCard
                                                key={`empty-member-${index}`}
                                                number={activeMembers.length + index + 1}
                                                isCaptain={isCaptain}
                                                onInvite={onInvite}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 rounded-xl bg-[var(--surface-base)] px-4 py-4">
                                        <CheckCircle2 size={15} className="shrink-0 text-[var(--accent-gold)]" />

                                        <p className="text-[8px] leading-relaxed text-[var(--text-muted)]">
                                            Every active member currently has a tournament role.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <aside className="min-w-0 rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-base)]">
                            <div className="border-b border-[var(--border-subtle)] px-4 py-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h4 className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--text-primary)]">
                                            Tournament Reserves
                                        </h4>

                                        <p className="mt-1 text-[7px] leading-relaxed text-[var(--text-muted)]">
                                            Optional replacement players.
                                        </p>
                                    </div>

                                    <span className="text-[9px] font-bold text-[var(--accent-gold)]">
                                        {substituteMembers.length}/2
                                    </span>
                                </div>
                            </div>

                            <div className="p-3">
                                {substituteMembers.length > 0 ? (
                                    <div className="space-y-3">
                                        {substituteMembers.map((member, index) => (
                                            <PlayerCard
                                                key={member.id}
                                                member={member}
                                                number={index + 1}
                                                substitute
                                                isCaptain={isCaptain}
                                                isRosterLocked={isRosterLocked}
                                                menuOpen={activeMenu === member.id}
                                                onToggleMenu={() => handleToggleMenu(member.id)}
                                                onViewProfile={() => onViewProfile?.(member)}
                                                onMakeRoster={() => onMakeRoster?.(member)}
                                                onRemoveRoster={() => onRemoveRoster?.(member)}
                                                onMakeSubstitute={() => onMakeSubstitute?.(member)}
                                                onRemindPayment={() => onRemindPayment?.(member)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptySubstituteCard />
                                )}

                                <p className="mt-4 border-t border-[var(--border-subtle)] pt-3 text-[7px] leading-[1.7] text-[var(--text-muted)]">
                                    Reserve players remain outside the primary roster and may only replace a player under approved tournament conditions.
                                </p>
                            </div>
                        </aside>
                    </div>
                </section>

            </div>
        </section>
    );
}