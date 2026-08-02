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

    return (
        <article className={`relative min-w-0 rounded-xl border p-3 ${isRoster ? "bg-emerald-500/[0.035]" : "bg-[var(--surface-base)]"}`} style={{ borderColor: isRoster ? "color-mix(in srgb, #10b981 28%, var(--border-default))" : "var(--border-default)" }}>
            {isRoster && <span className="absolute inset-y-0 left-0 w-[2px] bg-emerald-500" />}

            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                    <div className={`flex size-9 shrink-0 items-center justify-center rounded-full border ${isRoster ? "border-emerald-500/20 bg-emerald-500/[0.06]" : "bg-[var(--surface-elevated)]"}`}>
                        <span className={`text-[10px] font-bold ${isRoster ? "text-emerald-500" : "text-[var(--text-muted)]"}`}>
                            {getDisplayName(member).charAt(0)}
                        </span>
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                            <h3 className="truncate text-[11px] font-bold text-[var(--text-primary)]">
                                {getDisplayName(member)}
                            </h3>

                            {isTeamCaptain && <Crown size={11} className="shrink-0 text-[var(--accent-gold)]" />}
                        </div>

                        <p className="mt-0.5 truncate text-[8px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
                            {member.email}
                        </p>
                    </div>
                </div>

                <div className="relative flex items-center gap-1">
                    <span className="text-[8px] font-bold text-[var(--text-muted)]">
                        {String(number).padStart(2, "0")}
                    </span>

                    {isCaptain && (
                        <>
                            <button type="button" onClick={onToggleMenu} className="flex size-7 items-center justify-center rounded-md text-[var(--text-muted)] transition hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]">
                                <MoreHorizontal size={15} />
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

            <div className="mt-3 grid grid-cols-2 gap-3 border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
                <PlayerMeta label="MLBB ID" value={member.mlbb_id || "Not set"} />

                <PlayerMeta label="Server" value={member.mlbb_server || "Not set"} align="right" />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
                {isRoster && (
                    <StatusBadge icon={<Check size={8} />} text="Active Roster" active />
                )}

                {substitute && (
                    <StatusBadge icon={<UserRoundPlus size={8} />} text="Substitute" />
                )}

                {isRoster && (
                    <StatusBadge icon={isReady ? <Check size={8} /> : <Clock3 size={8} />} text={isReady ? "Ready" : "Not Ready"} active={isReady} />
                )}
            </div>
        </article>
    );
}


export default PlayerCard