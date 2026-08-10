import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import EmptySubstituteCard from "../empty_states/EmptySubstituteCard";
import PlayerCard from "./team_member_components/PlayerCard";
// roster section
import RosterSection from "./team_member_components/RosterSection";

import { EmptyMemberCard, HeaderStat } from "./team_member_components/SupportingComponent";


export default function TeamMembers({
    members = [],
    selectedRosters = [],
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
        const roster = selectedRosters ?? [];

        const substitutes = active
            .filter((member) => member.tournament_role === "substitute")
            .slice(0, 2);

        const regular = active.filter((member) => member.tournament_role !== "substitute");

        const readyCount = roster.filter(
            (member) => member.tournament_readiness === "ready"
        ).length;

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
    }, [members, selectedRosters]);

    const handleToggleMenu = (memberId) => {
        setActiveMenu((current) =>
            current === memberId ? null : memberId
        );
    };

    return (
        <section className="w-full min-w-0">

            {/* Page Header */}
            <header className="mb-5 border-b border-[var(--border-subtle)] pb-4 sm:mb-6 sm:pb-5">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-2">
                        <span className="size-1 rounded-full bg-[var(--accent-gold)]" />

                        <span className="text-[7px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)] sm:text-[8px]">
                            Team Management
                        </span>
                    </div>

                    <h2 className="mt-2 text-[20px] font-bold tracking-[-0.035em] text-[var(--headline-primary)] sm:text-[23px]">
                        Team Members
                    </h2>

                    <p className="mt-1.5 max-w-xl text-[8px] leading-[1.7] text-[var(--text-muted)] sm:text-[9px]">
                        Manage your squad and organize eligible players for tournament participation.
                    </p>
                </div>
            </header>


            <div className="space-y-5 sm:space-y-6">

                {/* Tournament Roster */}
                {!isRosterLocked && (
                    <section className="overflow-hidden rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-elevated)]">
                        <RosterSection
                            selectedRoster={rosterMembers}
                            isLocked={isRosterLocked}
                            onConfirmRoster={onConfirmRoster}
                        />
                    </section>
                )}


                {/* Squad */}
                <section className="overflow-hidden rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-elevated)]">

                    {/* Section Header */}
                    <div className="flex items-end justify-between gap-4 border-b border-[var(--border-subtle)] px-4 py-3.5 sm:px-5 sm:py-4">

                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="size-1 rounded-full bg-[var(--accent-gold)]" />

                                <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                                    Team Squad
                                </span>
                            </div>

                            <h3 className="mt-1.5 text-[14px] font-bold tracking-[-0.025em] text-[var(--headline-primary)] sm:text-[16px]">
                                Players
                            </h3>

                            <p className="mt-1 text-[7px] leading-relaxed text-[var(--text-muted)] sm:text-[8px]">
                                Active team members and tournament reserves.
                            </p>
                        </div>


                        <div className="flex shrink-0 items-center gap-4 text-right">
                            <div>
                                <p className="text-[6px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                                    Active
                                </p>

                                <p className="mt-1 text-[11px] font-bold text-[var(--text-primary)]">
                                    {activeMembers.length}
                                </p>
                            </div>

                            <div className="h-7 w-px bg-[var(--border-subtle)]" />

                            <div>
                                <p className="text-[6px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                                    Reserves
                                </p>

                                <p className="mt-1 text-[11px] font-bold text-[var(--accent-gold)]">
                                    {substituteMembers.length}/2
                                </p>
                            </div>
                        </div>

                    </div>


                    {/* Main Squad */}
                    <div className="p-3 sm:p-4">

                        {regularMembers.length > 0 || activeMembers.length < 5 ? (

                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">

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


                                {activeMembers.length < 5 &&
                                    Array.from({
                                        length: Math.max(5 - activeMembers.length, 0)
                                    }).map((_, index) => (
                                        <EmptyMemberCard
                                            key={`empty-member-${index}`}
                                            number={activeMembers.length + index + 1}
                                            isCaptain={isCaptain}
                                            onInvite={onInvite}
                                        />
                                    ))
                                }

                            </div>

                        ) : (

                            <div className="flex items-center justify-center py-8">
                                <p className="text-[8px] text-[var(--text-muted)]">
                                    All active team members have been assigned.
                                </p>
                            </div>

                        )}

                    </div>


                    {/* Substitutes */}
                    <div className="border-t border-[var(--border-subtle)]">

                        {/* Substitute Label */}
                        <div className="flex items-center gap-3 px-4 py-3 sm:px-5">

                            <div className="h-px flex-1 bg-[var(--border-subtle)]" />

                            <div className="flex shrink-0 items-center gap-2">
                                <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-[var(--text-secondary)]">
                                    Tournament Substitutes
                                </span>

                                <span className="text-[7px] font-bold text-[var(--accent-gold)]">
                                    {substituteMembers.length}/2
                                </span>
                            </div>

                            <div className="h-px flex-1 bg-[var(--border-subtle)]" />

                        </div>


                        <div className="px-3 pb-3 sm:px-4 sm:pb-4">

                            {substituteMembers.length > 0 ? (

                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

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

                        </div>


                        {/* Reserve Information */}
                        <div className="border-t border-[var(--border-subtle)] px-4 py-2.5 sm:px-5">

                            <p className="text-[7px] leading-relaxed text-[var(--text-muted)]">
                                Substitute players remain outside the primary roster and may participate only when tournament replacement rules permit.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </section>
    );
}