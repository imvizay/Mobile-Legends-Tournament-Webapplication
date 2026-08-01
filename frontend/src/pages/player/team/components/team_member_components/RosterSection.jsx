import { Check, Clock3, LockKeyhole, ShieldCheck, UsersRound } from "lucide-react";
import { getDisplayName } from "./SupportingComponent";

function RosterSection({ members = [], isCaptain = false, isLocked = false, onLockRoster }) {
    const readyCount = members.filter((member) => member.tournament_ready).length;
    const rosterActive = members.length > 0;
    const rosterComplete = members.length === 5;
    const allReady = rosterComplete && readyCount === 5;
    const canLockRoster = rosterComplete && !isLocked;

    const handleLockRoster = () => {
        if (!canLockRoster) return;
        onLockRoster?.();
    };

    return (
        <section className="relative border-b px-3 py-3.5 sm:px-4 sm:py-4 lg:px-5" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent-gold) 35%, transparent), transparent)" }} />

            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="flex items-start gap-2.5">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border" style={{ background: "color-mix(in srgb, var(--accent-gold) 7%, transparent)", borderColor: "color-mix(in srgb, var(--accent-gold) 18%, var(--border-subtle))" }}>
                            {isLocked ? <LockKeyhole size={13} style={{ color: "var(--accent-gold)" }} /> : <ShieldCheck size={13} style={{ color: "var(--accent-gold)" }} />}
                        </span>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-primary)]">
                                    Tournament Roster
                                </h3>

                                <span className="hidden size-1 rounded-full bg-[var(--border-default)] sm:block" />

                                <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                                    {members.length}/5 Selected
                                </span>

                                {isLocked && (
                                    <>
                                        <span className="hidden size-1 rounded-full bg-[var(--border-default)] sm:block" />

                                        <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--accent-gold)]">
                                            Roster Locked
                                        </span>
                                    </>
                                )}
                            </div>

                            <p className="mt-1 max-w-2xl text-[8px] leading-relaxed text-[var(--text-muted)]">
                                {isLocked ? "The tournament roster has been confirmed and is now protected from team membership changes." : members.length === 0 ? "Select five eligible team members to form the official tournament roster." : rosterComplete ? "Roster requirement completed. Review the selected players before locking the tournament roster." : `${5 - members.length} more player${5 - members.length === 1 ? "" : "s"} required to complete the tournament roster.`}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 self-start">
                    <span className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[7px] font-bold uppercase tracking-[0.1em] ${allReady ? "text-emerald-500" : rosterActive ? "text-[var(--accent-gold)]" : "text-[var(--text-muted)]"}`} style={{ background: allReady ? "rgba(16,185,129,.045)" : rosterActive ? "color-mix(in srgb, var(--accent-gold) 5%, transparent)" : "var(--surface-base)", borderColor: allReady ? "rgba(16,185,129,.16)" : rosterActive ? "color-mix(in srgb, var(--accent-gold) 14%, var(--border-subtle))" : "var(--border-subtle)" }}>
                        <span className={`size-1.5 rounded-full ${allReady ? "bg-emerald-500" : rosterActive ? "bg-[var(--accent-gold)]" : "bg-[var(--text-muted)]"}`} />

                        {allReady ? "All Ready" : rosterActive ? `${readyCount}/${members.length} Ready` : "Selection Pending"}
                    </span>
                </div>
            </div>

            {/* Roster Slots */}
            <div className="mt-4 grid grid-cols-1 gap-2 xs:grid-cols-2 sm:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => {
                    const player = members[index];
                    const isReady = Boolean(player?.tournament_ready);

                    return (
                        <article key={index} className={`relative min-w-0 overflow-hidden rounded-xl border px-2.5 py-2.5 ${player ? "bg-emerald-500/[0.025]" : "border-dashed bg-[var(--surface-base)]"}`} style={{ borderColor: player ? "color-mix(in srgb, #10b981 26%, var(--border-default))" : "var(--border-subtle)" }}>
                            {player && <div className="absolute inset-x-0 top-0 h-px bg-emerald-500/25" />}

                            <div className="flex items-center justify-between gap-2">
                                <span className={`text-[6px] font-bold uppercase tracking-[0.14em] ${player ? "text-emerald-500" : "text-[var(--text-muted)]"}`}>
                                    Player {String(index + 1).padStart(2, "0")}
                                </span>

                                {player ? (
                                    <span className={`flex size-4 shrink-0 items-center justify-center rounded-full ${isReady ? "bg-emerald-500 text-white" : "border bg-[var(--surface-elevated)] text-[var(--text-muted)]"}`} style={!isReady ? { borderColor: "var(--border-subtle)" } : undefined}>
                                        {isReady ? <Check size={8} strokeWidth={3} /> : <Clock3 size={8} />}
                                    </span>
                                ) : (
                                    <span className="text-[6px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                                        Empty
                                    </span>
                                )}
                            </div>

                            {player ? (
                                <div className="mt-2 flex min-w-0 items-center gap-2">
                                    <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full border text-[8px] font-bold" style={{ background: "var(--surface-elevated)", borderColor: isReady ? "rgba(16,185,129,.3)" : "var(--border-subtle)", color: isReady ? "#10b981" : "var(--text-muted)" }}>
                                        {player.avatar ? <img src={player.avatar} alt={getDisplayName(player)} className="h-full w-full object-cover" /> : getDisplayName(player).charAt(0)}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-[8px] font-bold uppercase tracking-[-0.01em] text-[var(--text-primary)]">
                                            {getDisplayName(player)}
                                        </p>

                                        <div className="mt-0.5 flex items-center gap-1">
                                            {isReady ? <Check size={7} className="shrink-0 text-emerald-500" /> : <Clock3 size={7} className="shrink-0 text-[var(--text-muted)]" />}

                                            <span className={`truncate text-[6px] font-semibold uppercase tracking-[0.08em] ${isReady ? "text-emerald-500" : "text-[var(--text-muted)]"}`}>
                                                {isReady ? "Tournament Ready" : "Readiness Pending"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-3 flex items-center gap-1.5 text-[var(--text-muted)]">
                                    <UsersRound size={10} strokeWidth={1.7} />

                                    <span className="text-[7px] font-medium">
                                        Awaiting selection
                                    </span>
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>

            {/* Action Zone */}
            {rosterActive && !isLocked && (
                <div className="mt-3 border-t pt-3" style={{ borderColor: "var(--border-subtle)" }}>
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-start gap-2">
                            <ShieldCheck size={12} className="mt-0.5 shrink-0 text-[var(--accent-gold)]" />

                            <div className="min-w-0">
                                <p className="text-[7px] font-bold uppercase tracking-[0.13em] text-[var(--text-secondary)]">
                                    Roster Lock Restriction
                                </p>

                                <p className="mt-1 max-w-3xl text-[7px] leading-[1.65] text-[var(--text-muted)] sm:text-[8px]">
                                    Locking the tournament roster confirms the selected players for competition. Once locked, roster members cannot leave the team, the captain cannot remove them, and roster assignments cannot be changed until the tournament concludes, the team is eliminated, disqualified, or tournament administration releases the roster.
                                </p>
                            </div>
                        </div>

                        {isCaptain && (
                            <button type="button" onClick={handleLockRoster} disabled={!canLockRoster} className="flex h-9 w-full shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-[8px] font-bold uppercase tracking-[0.11em] transition duration-200 hover:-translate-y-px hover:brightness-105 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:brightness-100 sm:w-auto" style={{ color: "var(--bg-canvas)", background: canLockRoster ? "var(--accent-gold)" : "var(--surface-base)", border: canLockRoster ? "1px solid transparent" : "1px solid var(--border-subtle)" }}>
                                <LockKeyhole size={12} strokeWidth={2.2} />

                                {rosterComplete ? "Lock Tournament Roster" : `Select ${5 - members.length} More Player${5 - members.length === 1 ? "" : "s"}`}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Locked State */}
            {isLocked && (
                <div className="mt-3 flex items-start gap-2.5 rounded-lg border px-3 py-2.5" style={{ background: "color-mix(in srgb, var(--accent-gold) 5%, var(--surface-base))", borderColor: "color-mix(in srgb, var(--accent-gold) 16%, var(--border-subtle))" }}>
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md" style={{ background: "color-mix(in srgb, var(--accent-gold) 8%, transparent)" }}>
                        <LockKeyhole size={11} style={{ color: "var(--accent-gold)" }} />
                    </span>

                    <div className="min-w-0">
                        <p className="text-[7px] font-bold uppercase tracking-[0.13em] text-[var(--text-secondary)]">
                            Tournament Roster Locked
                        </p>

                        <p className="mt-1 text-[7px] leading-[1.6] text-[var(--text-muted)] sm:text-[8px]">
                            This competitive lineup is now protected. Selected roster members remain assigned to the team and cannot be removed or leave while tournament restrictions are active.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
}

export default RosterSection;