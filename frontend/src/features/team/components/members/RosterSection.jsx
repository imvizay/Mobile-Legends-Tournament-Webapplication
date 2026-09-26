import {
  Check,
  LockKeyhole,
  Users,
  X,
} from "lucide-react";
import { getDisplayName } from "./SupportingComponent";

const ROSTER_SIZE = 5;

const RosterSection = ({
  selectedRoster = [],
  isRosterConfirmed = false,
  isCaptain = false,
  teamCaptain = {},
  isConfirming = false,
  onConfirmRoster,
  onRemoveRoster,
}) => {
  const rosterCount = selectedRoster.length;

  console.log("selectedRoster",selectedRoster)

  const readyCount = selectedRoster.filter(
    (member) => member.tournament_readiness === "ready"
  ).length;

  const isComplete = rosterCount === ROSTER_SIZE;

  const canConfirm =
    isCaptain &&
    isComplete &&
    !isRosterConfirmed &&
    !isConfirming;

  const remainingPlayers = Math.max(
    ROSTER_SIZE - rosterCount,
    0
  );

  /*
   * teamCaptain can be either:
   *
   * { id: 13, ... }
   *
   * or:
   *
   * [{ id: 13, ... }]
   */
  const captain = Array.isArray(teamCaptain)
    ? teamCaptain[0]
    : teamCaptain;

  const captainId = captain?.id ?? null;

  /*
   * Find the captain from the actual teamCaptain object.
   *
   * We do not depend on member.role because roster
   * members may not contain the captain role.
   */
  const captainIndex = selectedRoster.findIndex(
    (member) =>
      member &&
      captainId !== null &&
      String(member.id) === String(captainId)
  );

  const captainInRoster = captainIndex !== -1;

  /*
   * Normal rendering order:
   *
   * Captain exists:
   * [Captain, Player, Player, Player, Player]
   *
   * Captain doesn't exist:
   * [Player, Player, Player, Player, Player]
   *
   * No center-position manipulation or translate-x.
   */
  const orderedRoster = captainInRoster
    ? [
      selectedRoster[captainIndex],
      ...selectedRoster.filter(
        (_, index) => index !== captainIndex
      ),
    ]
    : selectedRoster;

  const slots = Array.from(
    { length: ROSTER_SIZE },
    (_, index) => orderedRoster[index] || null
  );

  return (
    <section className="overflow-hidden rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-base)]">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-3.5 py-2.5 sm:px-4 sm:py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
            <Users
              size={15}
              strokeWidth={1.9}
              className="text-[var(--accent-gold)]"
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--headline-primary)] sm:text-[13px]">
              Tournament Roster
            </h3>

            <p className="mt-0.5 truncate text-[9px] text-[var(--text-muted)] sm:text-[10px]">
              Select five players for this tournament
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-baseline gap-0.5">
          <span className="text-[17px] font-bold leading-none tabular-nums text-[var(--text-primary)]">
            {String(rosterCount).padStart(2, "0")}
          </span>

          <span className="text-[9px] font-medium text-[var(--text-muted)]">
            /05
          </span>
        </div>
      </div>

      {/* Roster Players */}
      <div className="px-3 py-3 sm:px-4 sm:py-3.5">
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex min-w-max items-center justify-center gap-1.5 sm:gap-2">
            {slots.map((member, index) => {
              const isEmpty = !member;

              const isReady =
                member?.tournament_readiness === "ready";

              /*
               * Because the captain has already been moved
               * to slot 01, this simply checks the actual ID.
               */
              const isCaptainCard = !isEmpty && captainId !== null && String(member.id) === String(captainId);

              return (
                <div
                  key={member?.id ?? `empty-${index}`}
                  className={`relative shrink-0 overflow-visible rounded-[12px] border transition-all ${isCaptainCard
                      ? "w-[96px] border-[var(--text-primary)] bg-[var(--surface-elevated)] shadow-[0_8px_24px_rgba(0,0,0,0.18)] sm:w-[116px]"
                      : "w-[78px] border-[var(--border-subtle)] bg-[var(--surface-elevated)] sm:w-[96px]"
                    }`}
                >
                 

                  {/* Mobile Remove */}
                  {!isEmpty &&
                    !isRosterConfirmed &&
                    isCaptain && (
                      <button
                        type="button"
                        onClick={() =>
                          onRemoveRoster?.(member.id)
                        }
                        className="absolute -right-1.5 -top-1.5 z-30 flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-muted)] shadow-md transition-colors hover:text-[var(--text-primary)] md:hidden"
                        aria-label={`Remove ${getDisplayName(
                          member
                        )} from roster`}
                      >
                        <X
                          size={10}
                          strokeWidth={2}
                        />
                      </button>
                    )}

                  {/* Slot Header */}
                  <div
                    className={`flex items-center justify-between px-2 ${isCaptainCard ? "h-7" : "h-6"
                      }`}
                  >
                    <span className="text-[8px] font-medium tabular-nums text-[var(--text-muted)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {isCaptainCard && (
                      <span className="text-[7px] font-semibold uppercase tracking-[0.08em] text-[var(--accent-gold)]">
                        Captain
                      </span>
                    )}

                    {/* Desktop Remove */}
                    {!isEmpty &&
                      !isRosterConfirmed &&
                      isCaptain && (
                        <button
                          type="button"
                          onClick={() =>
                            onRemoveRoster?.(member.id)
                          }
                          className="hidden h-5 w-5 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-base)] hover:text-[var(--text-primary)] md:flex"
                          aria-label={`Remove ${getDisplayName(
                            member
                          )} from roster`}
                        >
                          <X
                            size={10}
                            strokeWidth={1.8}
                          />
                        </button>
                      )}

                    {isRosterConfirmed && !isEmpty && (
                      <LockKeyhole
                        size={10}
                        strokeWidth={1.8}
                        className="text-[var(--text-muted)]"
                      />
                    )}
                  </div>

                  {/* Empty Slot */}
                  {isEmpty ? (
                    <div className="flex h-[76px] flex-col items-center justify-center sm:h-[82px]">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-[var(--border-default)]">
                        <span className="text-[15px] font-light text-[var(--text-muted)]">
                          +
                        </span>
                      </div>

                      <span className="mt-1.5 text-[8px] text-[var(--text-muted)]">
                        Empty
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`px-1.5 pb-2.5 ${isCaptainCard
                          ? "sm:px-2"
                          : "sm:px-1.5"
                        }`}
                    >
                      {/* Avatar */}
                      <div className="flex justify-center">
                        <div
                          className={`relative overflow-visible ${isCaptainCard
                              ? "h-11 w-11 sm:h-12 sm:w-12"
                              : "h-9 w-9 sm:h-10 sm:w-10"
                            }`}
                        >
                          <div className="h-full w-full overflow-hidden rounded-full border border-[var(--border-default)] bg-[var(--surface-base)]">
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={getDisplayName(member)}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-[var(--text-secondary)]">
                                {getDisplayName(member)
                                  ?.charAt(0)
                                  ?.toUpperCase()}
                              </div>
                            )}
                          </div>

                          {isReady && (
                            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-[var(--surface-elevated)] bg-[var(--accent-gold)]">
                              <Check
                                size={8}
                                strokeWidth={2.5}
                                className="text-[var(--surface-base)]"
                              />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Player */}
                      <p
                        className={`mt-1.5 truncate text-center font-semibold text-[var(--text-primary)] ${isCaptainCard
                            ? "text-[10px]"
                            : "text-[9px]"
                          }`}
                        title={getDisplayName(member)}
                      >
                        {getDisplayName(member)}
                      </p>

                      {member.mlbb_id && (
                        <p
                          className="mt-0.5 truncate text-center text-[8px] tabular-nums text-[var(--text-muted)]"
                          title={member.mlbb_id}
                        >
                          ID {member.mlbb_id}
                        </p>
                      )}

                      {isReady && (
                        <div className="mt-1.5 flex justify-center">
                          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-base)] px-1.5 py-0.5 text-[7px] font-medium uppercase tracking-[0.05em] text-[var(--text-secondary)]">
                            Ready
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-1.5 text-center text-[8px] text-[var(--text-muted)] sm:hidden">
          Swipe to view all players
        </p>
      </div>

      {/* Confirmation */}
      {!isRosterConfirmed ? (
        <div className="border-t border-[var(--border-subtle)] px-3.5 py-3 sm:px-4 sm:py-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold text-[var(--text-primary)]">
                {isComplete
                  ? "Roster is ready"
                  : `${remainingPlayers} more player${remainingPlayers > 1 ? "s" : ""
                  } required`}
              </p>

              <p className="mt-0.5 hidden text-[8px] text-[var(--text-muted)] sm:block">
                Confirmation permanently locks the tournament roster.
              </p>
            </div>

            <button
              type="button"
              disabled={!canConfirm}
              onClick={onConfirmRoster}
              className={`shrink-0 rounded-[8px] border px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[0.04em] transition-all sm:px-4 ${canConfirm
                  ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--surface-base)] hover:-translate-y-px hover:opacity-90"
                  : "border-[var(--border-default)] bg-[var(--surface-elevated)] text-[var(--text-muted)]"
                } disabled:cursor-not-allowed disabled:opacity-45`}
            >
              {isConfirming
                ? "Confirming..."
                : "Confirm Roster"}
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-[var(--border-subtle)] px-3.5 py-3 sm:px-4">
          <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
              <LockKeyhole
                size={12}
                strokeWidth={1.8}
                className="text-[var(--accent-gold)]"
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-[var(--text-primary)]">
                Roster Locked
              </p>

              <p className="mt-0.5 text-[8px] leading-relaxed text-[var(--text-muted)] sm:text-[9px]">
                Your tournament roster is permanently locked.
                Selected teammates cannot be removed or kicked
                from the team, and no new teammates can be added
                until the tournament ends or your team is eliminated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Important Confirmation Notice */}
      {!isRosterConfirmed && (
        <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-elevated)]/40 px-3.5 py-2.5 sm:px-4">
          <div className="flex items-start gap-2">
            <LockKeyhole
              size={11}
              strokeWidth={1.9}
              className="mt-0.5 shrink-0 text-[var(--text-secondary)]"
            />

            <p className="text-[8px] leading-relaxed text-[var(--text-muted)] sm:text-[9px]">
              <span className="font-semibold text-[var(--text-secondary)]">
                Important:
              </span>{" "}
              Once confirmed, these five players become your
              official tournament roster. They cannot be kicked
              or removed from the team, and additional teammates
              cannot be added until the tournament ends or your
              team is eliminated.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default RosterSection;