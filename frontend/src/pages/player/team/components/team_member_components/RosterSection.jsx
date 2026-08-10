import { Check, CircleAlert, Clock3, LockKeyhole, ShieldCheck, Users } from "lucide-react";
import { getDisplayName } from "./SupportingComponent";

function RosterSection({
  selectedRoster = [],
  isRosterConfirmed = false,
  isCaptain = true,
  isConfirming = false,
  onConfirmRoster,
}) {
  const rosterCount = selectedRoster.length;
  const readyCount = selectedRoster.filter((member) => member.tournament_readiness === "ready").length;

  const isComplete = rosterCount === 5;
  const canConfirm = isCaptain && isComplete && !isRosterConfirmed && !isConfirming;

  const status = isRosterConfirmed
    ? { label: "Roster Confirmed", className: "text-emerald-600", dot: "bg-emerald-500" }
    : isComplete
      ? { label: "Ready for Confirmation", className: "text-[var(--accent-gold)]", dot: "bg-[var(--accent-gold)]" }
      : { label: "Selection in Progress", className: "text-[var(--text-muted)]", dot: "bg-[var(--text-muted)]" };

  return (
    <section className="overflow-hidden rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-base)]">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] px-3.5 py-3.5 sm:px-4 sm:py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-[var(--accent-gold)]" />
            <h2 className="text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--text-primary)]">
              Tournament Roster
            </h2>
          </div>

          <p className="mt-1 max-w-xl text-[7px] leading-relaxed text-[var(--text-muted)] sm:text-[8px]">
            Select the five players officially representing the team in this tournament.
          </p>
        </div>

        <div className={`flex shrink-0 items-center gap-1.5 pt-0.5 text-[6px] font-bold uppercase tracking-[0.1em] sm:text-[7px] ${status.className}`}>
          <span className={`size-1.5 rounded-full ${status.dot}`} />
          <span className="hidden xs:inline">{status.label}</span>
        </div>
      </div>

      {/* Roster Overview */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--surface-elevated)]/35 px-3.5 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-[19px] font-black tracking-[-0.05em] text-[var(--text-primary)] sm:text-[21px]">
              {String(rosterCount).padStart(2, "0")}
            </span>

            <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">
              of 05 selected
            </span>
          </div>

          <div className="text-right">
            <p className="text-[6px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Tournament Readiness
            </p>

            <p className="mt-0.5 text-[8px] font-bold text-[var(--text-primary)]">
              <span className={readyCount === rosterCount && rosterCount > 0 ? "text-emerald-600" : ""}>
                {readyCount}
              </span>
              <span className="text-[var(--text-muted)]"> / {rosterCount} Ready</span>
            </p>
          </div>
        </div>

        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--border-subtle)]">
          <div className={`h-full rounded-full transition-all duration-300 ${isRosterConfirmed ? "bg-emerald-500" : "bg-[var(--accent-gold)]"}`} style={{ width: `${Math.min((rosterCount / 5) * 100, 100)}%` }} />
        </div>
      </div>

      {/* Selected Players */}
      <div className="p-2.5 sm:p-3.5">
        <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => {
            const player = selectedRoster[index];
            const isReady = player?.tournament_readiness === "ready";

            return (
              <article key={index} className={`min-w-0 rounded-[11px] border px-2.5 py-2 ${player ? "bg-[var(--surface-elevated)]" : "border-dashed bg-[var(--surface-elevated)]/30"}`} style={{ borderColor: player && isRosterConfirmed ? "color-mix(in srgb, #10b981 22%, var(--border-default))" : "var(--border-subtle)" }}>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[6px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                    Player {String(index + 1).padStart(2, "0")}
                  </span>

                  {player && (
                    <span className={`flex size-4 shrink-0 items-center justify-center rounded-full ${isReady ? "bg-emerald-500/10 text-emerald-600" : "border border-[var(--border-subtle)] text-[var(--text-muted)]"}`}>
                      {isReady ? <Check size={8} strokeWidth={3} /> : <Clock3 size={8} />}
                    </span>
                  )}
                </div>

                {player ? (
                  <div className="mt-2 flex min-w-0 items-center gap-2">
                    <div className={`flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full border text-[8px] font-bold ${isRosterConfirmed ? "text-emerald-600" : "text-[var(--accent-gold)]"}`} style={{ background: "var(--surface-base)", borderColor: isRosterConfirmed ? "color-mix(in srgb, #10b981 20%, var(--border-default))" : "var(--border-default)" }}>
                      {player.avatar ? (
                        <img src={player.avatar} alt={getDisplayName(player)} className="h-full w-full object-cover" />
                      ) : (
                        getDisplayName(player).charAt(0).toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[8px] font-bold uppercase tracking-[-0.01em] text-[var(--text-primary)]">
                        {getDisplayName(player)}
                      </p>

                      <p className={`mt-0.5 truncate text-[6px] font-semibold uppercase tracking-[0.06em] ${isReady ? "text-emerald-600" : "text-[var(--text-muted)]"}`}>
                        {isReady ? "Ready" : "Awaiting"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-1.5">
                    <Users size={9} className="text-[var(--text-muted)]" />
                    <span className="text-[7px] text-[var(--text-muted)]">Not selected</span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {/* Action / Confirmation */}
      {!isRosterConfirmed && (
        <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-elevated)]/25 px-3.5 py-3 sm:px-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-2">
              {isComplete ? (
                <ShieldCheck size={12} className="mt-0.5 shrink-0 text-[var(--accent-gold)]" />
              ) : (
                <CircleAlert size={12} className="mt-0.5 shrink-0 text-[var(--text-muted)]" />
              )}

              <div className="min-w-0">
                <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)]">
                  {isComplete ? "Official roster selection" : "Roster incomplete"}
                </p>

                <p className="mt-1 max-w-2xl text-[7px] leading-[1.6] text-[var(--text-muted)] sm:text-[8px]">
                  {isComplete
                    ? "Confirm the selected players to establish the official tournament roster. Only confirmed players will be eligible to contribute the tournament entry fee and compete."
                    : `${5 - rosterCount} more player${5 - rosterCount === 1 ? "" : "s"} must be selected before the tournament roster can be confirmed.`}
                </p>
              </div>
            </div>

            {isCaptain && (
              <button type="button" disabled={!canConfirm} onClick={onConfirmRoster} className="inline-flex h-9 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--action-primary-bg)] px-4 text-[7px] font-bold uppercase tracking-[0.1em] text-[var(--action-primary-text)] transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto">
                <ShieldCheck size={11} />
                {isConfirming ? "Confirming..." : "Confirm Roster"}
              </button>
            )}
          </div>

          {!isCaptain && isComplete && (
            <div className="mt-2 flex items-center gap-1.5">
              <LockKeyhole size={9} className="text-[var(--text-muted)]" />
              <span className="text-[7px] text-[var(--text-muted)]">Roster confirmation is restricted to the team captain.</span>
            </div>
          )}
        </div>
      )}

      {/* Confirmed */}
      {isRosterConfirmed && (
        <div className="border-t border-[var(--border-subtle)] bg-emerald-500/[0.025] px-3.5 py-3 sm:px-4">
          <div className="flex items-start gap-2">
            <LockKeyhole size={12} className="mt-0.5 shrink-0 text-emerald-600" />

            <div className="min-w-0">
              <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-emerald-600">
                Tournament Roster Confirmed
              </p>

              <p className="mt-1 max-w-2xl text-[7px] leading-[1.6] text-[var(--text-muted)] sm:text-[8px]">
                The selected players are now the official tournament participants. Only these members may complete the required contribution and compete in the tournament.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default RosterSection;