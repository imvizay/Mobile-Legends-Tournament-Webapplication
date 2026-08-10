import { Check, Clock3, Crown, MoreHorizontal, UserRoundPlus } from "lucide-react";
import { getDisplayName, PlayerMeta, StatusBadge } from "./SupportingComponent";
import PlayerActionMenu from "./PlayerActionMenu";

function PlayerCard({
    member,
    number,
    substitute = false,
    isCaptain,
    menuOpen,
    onToggleMenu,
    onViewProfile,
    onMakeRoster,
    onRemoveRoster,
    onMakeSubstitute,
    onRemindPayment
}) {
    const isRoster = member.tournament_role === "roster";
    const isReady = Boolean(member.tournament_ready);
    const isTeamCaptain = member.role?.toLowerCase() === "captain";
    const displayName = getDisplayName(member);
    const playerStatus = substitute ? "Substitute" : isRoster ? "Tournament Roster" : "Team Member";

    return (
        <article className={`relative min-w-0 overflow-visible rounded-[14px] border bg-[var(--surface-base)] ${isRoster ? "border-emerald-500/25" : "border-[var(--border-default)]"}`}>
            {isRoster && <span className="absolute inset-y-3 left-0 w-[2px] rounded-r-full bg-emerald-500" />}

            <div className="p-2.5 sm:p-3">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <div className={`flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border text-[9px] font-bold ${isRoster ? "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-600" : substitute ? "border-[var(--accent-gold)]/20 bg-[var(--accent-gold)]/[0.05] text-[var(--accent-gold)]" : "border-[var(--border-default)] bg-[var(--surface-elevated)] text-[var(--text-secondary)]"}`}>
                            {member.avatar ? <img src={member.avatar} alt={displayName} className="h-full w-full object-cover" /> : displayName.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                            <div className="flex min-w-0 items-center gap-1.5">
                                <h3 className="truncate text-[9px] font-bold text-[var(--text-primary)] sm:text-[10px]">
                                    {displayName}
                                </h3>

                                {isTeamCaptain && <Crown size={10} className="shrink-0 text-[var(--accent-gold)]" />}
                            </div>

                            <p className={`mt-0.5 truncate text-[6px] font-bold uppercase tracking-[0.09em] ${isRoster ? "text-emerald-600" : substitute ? "text-[var(--accent-gold)]" : "text-[var(--text-muted)]"}`}>
                                {playerStatus}
                            </p>
                        </div>
                    </div>

                    <div className="relative flex shrink-0 items-center gap-1">
                        <span className="text-[7px] font-bold tracking-[0.08em] text-[var(--text-muted)]">
                            {String(number).padStart(2, "0")}
                        </span>

                        {isCaptain && (
                            <>
                                <button type="button" onClick={onToggleMenu} className="flex size-6 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]">
                                    <MoreHorizontal size={14} />
                                </button>

                                {menuOpen && (
                                    <PlayerActionMenu
                                        member={member}
                                        isRoster={isRoster}
                                        onViewProfile={onViewProfile}
                                        onMakeRoster={onMakeRoster}
                                        onRemoveRoster={onRemoveRoster}
                                        onMakeSubstitute={onMakeSubstitute}
                                        onRemindPayment={onRemindPayment}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-2 border-t border-[var(--border-subtle)] pt-2.5">
                    <PlayerMeta label="MLBB ID" value={member.mlbb_id || "Not set"} />

                    <PlayerMeta label="Server" value={member.mlbb_server || "Not set"} align="right" />
                </div>

                {(isRoster || substitute) && (
                    <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-1.5">
                            {substitute && <StatusBadge icon={<UserRoundPlus size={8} />} text="Reserve" />}
                        </div>

                        {isRoster && (
                            <StatusBadge
                                icon={isReady ? <Check size={8} strokeWidth={3} /> : <Clock3 size={8} />}
                                text={isReady ? "Ready" : "Pending"}
                                active={isReady}
                            />
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}

export default PlayerCard;