import {
    Check,
    CircleAlert,
    Clock3,
    LockKeyhole,
    ShieldCheck,
    Users,
} from "lucide-react";
import { getDisplayName } from "./SupportingComponent";

function RosterSection({
    selectedRoster = [],
    isRosterConfirmed = false,
    isCaptain = true,
    isConfirming = false,
    onConfirmRoster,
}) {
    const rosterCount = selectedRoster.length;
    const readyCount = selectedRoster.filter(
        (member) => member.tournament_readiness
    ).length;

    const isComplete = rosterCount === 5;
    const allReady = isComplete && readyCount === 5;
    const canConfirm = isCaptain && isComplete && !isRosterConfirmed && !isConfirming;

    const status = isRosterConfirmed
        ? {
              label: "Roster Confirmed",
              className: "text-emerald-500",
              dot: "bg-emerald-500",
          }
        : isComplete
          ? {
                label: "Ready to Confirm",
                className: "text-[var(--accent-gold)]",
                dot: "bg-[var(--accent-gold)]",
            }
          : rosterCount > 0
            ? {
                  label: "Selection In Progress",
                  className: "text-[var(--text-secondary)]",
                  dot: "bg-[var(--text-secondary)]",
              }
            : {
                  label: "Roster Pending",
                  className: "text-[var(--text-muted)]",
                  dot: "bg-[var(--text-muted)]",
              };

    
    
    

    return (
        <section
            className="border-b bg-[var(--surface-base)]"
            style={{ borderColor: "var(--border-subtle)" }}
        >
            {/* Header */}
            <div className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 lg:px-5">
                <div className="flex shrink-0 items-center gap-3">
                    <div
                        className={`flex items-center gap-1.5 text-[7px] font-bold uppercase tracking-[0.1em] ${status.className}`}
                    >
                        <span
                            className={`size-1.5 rounded-full ${status.dot}`}
                        />
                        {status.label}
                    </div>

                    {!isRosterConfirmed && isCaptain && (
                        <button
                            type="button"
                            disabled={!canConfirm}
                            onClick={onConfirmRoster}
                            className="inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-[var(--action-primary-bg)] px-3 text-[7px] font-bold uppercase tracking-[0.09em] text-[var(--action-primary-text)] transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ShieldCheck size={11} />

                            {isConfirming
                                ? "Confirming..."
                                : "Confirm Roster"}
                        </button>
                    )}
                </div>
            </div>

            {/* Roster Slots */}
            <div className="px-3 pb-3 sm:px-4 lg:px-5">
                <div className="grid grid-cols-1 gap-1.5 xs:grid-cols-2 sm:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, index) => {
                        const player = selectedRoster[index];
                        const isReady = player?.tournament_readiness == 'ready' ? true : false
                        

                        return (
                            <article
                                key={index}
                                className={`relative min-w-0 overflow-hidden rounded-lg border px-2.5 py-2 transition-colors ${
                                    player
                                        ? isRosterConfirmed
                                            ? "border-emerald-500/30 bg-emerald-500/[0.045]"
                                            : "border-purple-500/30 bg-purple-500/[0.045]"
                                        : "border-dashed border-[var(--border-subtle)] bg-[var(--surface-elevated)]/40"
                                }`}
                            >
                                {/* Player Number + Readiness */}
                                <div className="flex items-center justify-between gap-2">
                                    <span
                                        className={`text-[6px] font-bold uppercase tracking-[0.13em] ${
                                            player
                                                ? isRosterConfirmed
                                                    ? "text-emerald-500"
                                                    : "text-purple-400"
                                                : "text-[var(--text-muted)]"
                                        }`}
                                    >
                                        Player{" "}
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    {player && (
                                        <span
                                            className={`flex size-4 shrink-0 items-center justify-center rounded-full ${
                                                isReady
                                                    ? "bg-emerald-500 text-white"
                                                    : "border border-[var(--border-subtle)] bg-[var(--surface-base)] text-[var(--text-muted)]"
                                            }`}
                                        >
                                            {isReady ? (
                                                <Check
                                                    size={8}
                                                    strokeWidth={3}
                                                />
                                            ) : (
                                                <Clock3 size={8} />
                                            )}
                                        </span>
                                    )}
                                </div>

                                {/* Player */}
                                {player ? (
                                    <div className="mt-2 flex min-w-0 items-center gap-2">
                                        <div
                                            className={`flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full border text-[8px] font-bold ${
                                                isRosterConfirmed
                                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                                                    : "border-purple-500/30 bg-purple-500/10 text-purple-400"
                                            }`}
                                        >
                                            {player.avatar ? (
                                                <img
                                                    src={player.avatar}
                                                    alt={getDisplayName(player)}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                getDisplayName(player).charAt(0)
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-[8px] font-bold uppercase tracking-[-0.01em] text-[var(--text-primary)]">
                                                {getDisplayName(player)}
                                            </p>

                                            <p
                                                className={`mt-0.5 truncate text-[6px] font-semibold uppercase tracking-[0.08em] ${
                                                    isReady
                                                        ? "text-emerald-500"
                                                        : "text-[var(--text-muted)]"
                                                }`}
                                            >
                                                {isReady
                                                    ? "Tournament Ready"
                                                    : "Awaiting Readiness"}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-2">
                                        <p className="text-[8px] font-medium text-[var(--text-muted)]">
                                            Awaiting selection
                                        </p>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>

                {/* Confirmation Guidance */}
                {!isRosterConfirmed && (
                    <div
                        className={`mt-3 flex items-start gap-2 rounded-lg border px-3 py-2.5 ${
                            isComplete
                                ? "bg-[var(--accent-gold)]/[0.035]"
                                : "bg-[var(--surface-elevated)]"
                        }`}
                        style={{
                            borderColor: isComplete
                                ? "color-mix(in srgb, var(--accent-gold) 20%, var(--border-default))"
                                : "var(--border-subtle)",
                        }}
                    >
                        {isComplete ? (
                            <Users
                                size={11}
                                className="mt-0.5 shrink-0 text-[var(--accent-gold)]"
                            />
                        ) : (
                            <CircleAlert
                                size={11}
                                className="mt-0.5 shrink-0 text-[var(--text-muted)]"
                            />
                        )}

                        <div className="min-w-0">
                            <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)]">
                                {isComplete
                                    ? "Ready for roster confirmation"
                                    : "Roster requirement"}
                            </p>

                            <p className="mt-1 text-[7px] leading-[1.65] text-[var(--text-muted)]">
                                {isComplete
                                    ? "Confirm this selection to establish the participating tournament roster. The confirmed players will become eligible for tournament participation."
                                    : "A complete roster of five players is required before the tournament roster can be confirmed. Select players from the team list below."}
                            </p>
                        </div>
                    </div>
                )}

                {/* Confirmed State */}
                {isRosterConfirmed && (
                    <div
                        className="mt-3 flex items-start gap-2 rounded-lg border bg-emerald-500/[0.035] px-3 py-2.5"
                        style={{
                            borderColor:
                                "color-mix(in srgb, #10b981 22%, var(--border-default))",
                        }}
                    >
                        <LockKeyhole
                            size={11}
                            className="mt-0.5 shrink-0 text-emerald-500"
                        />

                        <div className="min-w-0">
                            <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-emerald-500">
                                Tournament roster confirmed
                            </p>

                            <p className="mt-1 text-[7px] leading-[1.65] text-[var(--text-muted)]">
                                This roster has been confirmed and can no
                                longer be changed. Selected players are now
                                registered for this tournament.
                            </p>
                        </div>
                    </div>
                )}

                {/* Captain Restriction */}
                {!isCaptain && !isRosterConfirmed && isComplete && (
                    <div className="mt-2 flex items-center gap-1.5 px-1">
                        <LockKeyhole
                            size={9}
                            className="text-[var(--text-muted)]"
                        />

                        <span className="text-[7px] text-[var(--text-muted)]">
                            Only the team captain can confirm the tournament
                            roster.
                        </span>
                    </div>
                )}
            </div>
        </section>
    );
}

export default RosterSection;