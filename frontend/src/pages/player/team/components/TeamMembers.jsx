import { Users } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyMemberCard } from "./team_member_components/SupportingComponent";
import PlayerCard from "./team_member_components/PlayerCard";
import RosterSection from "./team_member_components/RosterSection";
import PlayerActionDrawer from "./team_member_components/PlayerActionDrawer";
import KickOutConfirmationDialog from "./team_member_components/KickOutConfirmationDialog";

export default function TeamMembers({
    members = [],
    selectedRosters = [],
    isCaptain = false,
    teamCaptain = {},
    isRosterLocked = false,
    onConfirmRoster,
    onInvite,
    onMakeRoster,
    onRemoveRoster,
    onRemindPayment,
    onKickPlayer,
    onAddNote
}) {
    const [actionMember, setActionMember] = useState(null);
    const [kickMember, setKickMember] = useState(null);
    const [isKicking, setIsKicking] = useState(false);

    const { activeMembers, rosterMembers, regularMembers } = useMemo(() => {
        const active = members.filter(member => member.status === "active");
        const roster = selectedRosters ?? [];
        const regular = active.filter(member => member.tournament_role !== "substitute");
        return { activeMembers: active, rosterMembers: roster, regularMembers: regular };
    }, [members, selectedRosters]);

    const handleOpenActions = member => setActionMember(member);
    const handleCloseActions = () => setActionMember(null);
    const handleOpenKickConfirmation = () => actionMember && setKickMember(actionMember);
    const handleCloseKickConfirmation = () => !isKicking && setKickMember(null);

    const handleConfirmKickOut = async () => {
        if (!kickMember || isKicking) return;
        try {
            setIsKicking(true);
            await onKickPlayer?.(kickMember);
            setKickMember(null);
            setActionMember(null);
        } finally {
            setIsKicking(false);
        }
    };

    return (
        <section className="w-full min-w-0">
            <header className="mb-4 border-b border-[var(--border-subtle)] pb-3 sm:mb-5 sm:pb-4">
                <div className="max-w-2xl">
                    <div className="mb-1.5 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-gold)]" />
                        <span className="text-[7px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)] sm:text-[8px]">Squad Management</span>
                    </div>
                    <h2 className="text-[19px] font-bold tracking-[-0.035em] text-[var(--headline-primary)] sm:text-[22px]">Team Members</h2>
                    <p className="mt-1 max-w-xl text-[8px] leading-[1.65] text-[var(--text-muted)] sm:text-[9px]">Manage your squad and tournament roster.</p>
                </div>
            </header>

            <div className="space-y-4 sm:space-y-5">
                {!isRosterLocked && (
                    <section className="overflow-hidden rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-elevated)] shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                        <RosterSection selectedRoster={rosterMembers} isCaptain={isCaptain} teamCaptain={teamCaptain} isLocked={isRosterLocked} onRemoveRoster={onRemoveRoster} onConfirmRoster={onConfirmRoster} />
                    </section>
                )}

                <section className="overflow-hidden rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-elevated)] shadow-[0_8px_30px_rgba(0,0,0,0.07)]">
                    <div className="border-b border-[var(--border-subtle)] px-3.5 py-3 sm:px-4 sm:py-3.5">
                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <div className="flex size-6 shrink-0 items-center justify-center rounded-[7px] border border-[var(--border-subtle)] bg-[var(--surface-base)]">
                                        <Users size={11} strokeWidth={1.8} className="text-[var(--accent-gold)]" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-[12px] font-bold tracking-[-0.02em] text-[var(--headline-primary)] sm:text-[14px]">Team Squad</h3>
                                        <p className="mt-0.5 truncate text-[7px] text-[var(--text-muted)] sm:text-[8px]">Active team members</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center rounded-[9px] border border-[var(--border-subtle)] bg-[var(--surface-base)]">
                                <div className="min-w-[52px] px-2.5 py-1.5 text-center">
                                    <p className="text-[6px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">Active</p>
                                    <p className="mt-0.5 text-[10px] font-bold text-[var(--text-primary)] sm:text-[11px]">{activeMembers.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-2.5 sm:p-3.5">
                        {regularMembers.length > 0 || activeMembers.length < 5 ? (
                            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3 2xl:grid-cols-4">
                                {regularMembers.map((member, index) => (
                                    <PlayerCard
                                        key={member.id}
                                        member={member}
                                        number={index + 1}
                                        isCaptain={isCaptain}
                                        isRosterLocked={isRosterLocked}
                                        menuOpen={actionMember?.id === member.id}
                                        onToggleMenu={() => handleOpenActions(member)}
                                        onMakeRoster={() => onMakeRoster?.(member)}
                                        onRemoveRoster={() => onRemoveRoster?.(member.id)}
                                        onRemindPayment={() => onRemindPayment?.(member)}
                                    />
                                ))}

                                {activeMembers.length < 5 && Array.from({ length: Math.max(5 - activeMembers.length, 0) }).map((_, index) => (
                                    <EmptyMemberCard key={`empty-member-${index}`} number={activeMembers.length + index + 1} isCaptain={isCaptain} onInvite={onInvite} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex min-h-[120px] items-center justify-center rounded-[12px] border border-dashed border-[var(--border-subtle)] bg-[var(--surface-base)] px-4">
                                <div className="text-center">
                                    <p className="text-[9px] font-medium text-[var(--text-secondary)]">Squad is fully occupied</p>
                                    <p className="mt-1 text-[7px] text-[var(--text-muted)]">All active team members are currently assigned.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <PlayerActionDrawer
                member={actionMember}
                isOpen={!!actionMember}
                isCaptain={isCaptain}
                isRoster={actionMember?.tournament_role === "roster"}
                isRosterLocked={isRosterLocked}
                isContributionPaid={actionMember?.fee_status === "paid"}
                onClose={handleCloseActions}
                onMakeRoster={() => {
                    onMakeRoster?.(actionMember);
                    setActionMember(null);
                }}
                onRemoveRoster={() => {
                    onRemoveRoster?.(actionMember?.id);
                    setActionMember(null);
                }}
                onRemindContribution={() => onRemindPayment?.(actionMember)}
                onAddNote={() => onAddNote?.(actionMember)}
                onKickOut={handleOpenKickConfirmation}
            />

            <KickOutConfirmationDialog
                player={kickMember}
                isOpen={!!kickMember}
                isLoading={isKicking}
                onCancel={handleCloseKickConfirmation}
                onConfirm={handleConfirmKickOut}
            />
        </section>
    );
}