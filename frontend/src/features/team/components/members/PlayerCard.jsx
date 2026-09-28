import { MoreVertical } from "lucide-react";
import { useRef } from "react";

import { getDisplayName } from "./SupportingComponent";
import PlayerActionMenu from "./PlayerActionDrawer";
import PlayerActionDrawer from "./PlayerActionDrawer";

function PlayerCard({
    member,
    number,
    isCaptain = false,
    isRoster = false,
    isSubstitute = false,
    isRosterLocked = false,
    menuOpen,

    onToggleMenu,
    onCloseMenu,
    onViewProfile,
    onSendMessage,
    onAddNote,
    onMakeRoster,
    onRemoveRoster,
    onMakeSubstitute,
    onRemindPayment,
    onKickPlayer,
}) {
    const actionRef = useRef(null);

    const displayName = getDisplayName(member);
    const isMemberCaptain =
        member.role?.toLowerCase() === "captain";

    return (
        <article className="group relative min-w-0 overflow-visible rounded-[12px] border border-[var(--border-subtle)] bg-[var(--surface-base)] transition-colors hover:border-[var(--border-default)]">
            <div className="relative flex min-h-[78px] items-center gap-2.5 px-2.5 py-2.5 sm:px-3">
                {/* Number */}
                <div className="flex w-5 shrink-0 flex-col items-center">
                    <span className="text-[6px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                        #
                    </span>

                    <span className="mt-0.5 text-[9px] font-bold text-[var(--accent-gold)]">
                        {String(number).padStart(2, "0")}
                    </span>
                </div>

                {/* Player */}
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <div className="relative shrink-0">
                        <div className="flex size-10 items-center justify-center overflow-hidden rounded-[10px] border border-[var(--border-default)] bg-[var(--surface-elevated)] text-[10px] font-bold text-[var(--text-secondary)] sm:size-11">
                            {member.avatar ? (
                                <img
                                    src={member.avatar}
                                    alt={displayName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                displayName.charAt(0).toUpperCase()
                            )}
                        </div>

                        {member.status?.toLowerCase() === "active" && (
                            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[var(--surface-base)] bg-emerald-500" />
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                            <h3 className="truncate text-[9px] font-bold text-[var(--text-primary)] sm:text-[10px]">
                                {displayName}
                            </h3>

                            {isMemberCaptain && (
                                <span className="shrink-0 text-[6px] font-bold uppercase tracking-[0.06em] text-[var(--accent-gold)]">
                                    Captain
                                </span>
                            )}
                        </div>

                        <p className="mt-0.5 truncate text-[6px] text-[var(--text-muted)] sm:text-[7px]">
                            {member.username
                                ? `@${member.username}`
                                : member.email || "Team Member"}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                            <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-1.5 py-1">
                                <span className="text-[5px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                                    ID
                                </span>

                                <span className="ml-1 text-[6px] font-semibold text-[var(--text-secondary)]">
                                    {member.mlbb_id || "—"}
                                </span>
                            </div>

                            <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-1.5 py-1">
                                <span className="text-[5px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                                    Server
                                </span>

                                <span className="ml-1 text-[6px] font-semibold text-[var(--text-secondary)]">
                                    {member.mlbb_server || "—"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ALWAYS VISIBLE */}
                <div className="relative flex shrink-0 items-center">
                    <button
                        ref={actionRef}
                        type="button"
                        aria-label={`Actions for ${displayName}`}
                        aria-expanded={menuOpen}
                        onClick={onToggleMenu}
                        className={`flex size-7 items-center justify-center rounded-lg border transition-all ${menuOpen
                            ? "border-[var(--border-default)] bg-[var(--surface-elevated)] text-[var(--text-primary)]"
                            : "border-transparent text-[var(--text-muted)] hover:border-[var(--border-subtle)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        <MoreVertical
                            size={13}
                            strokeWidth={1.8}
                        />
                    </button>

                    
                </div>
            </div>
        </article>
    );
}

export default PlayerCard;