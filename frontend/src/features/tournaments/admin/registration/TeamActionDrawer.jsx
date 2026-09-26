import React, { useState } from "react";
import { Check, Lock, X } from "lucide-react";

function TeamActionDrawer({
  open,
  team,
  tournamentId,
  action,
  onClose,
  onSelectAction,
  onApprove,
  onReject,
  onRosterLock,
  approveLoading = false,
  rejectLoading = false,
  lockLoading = false,
}) {
  const [rejectReason, setRejectReason] = useState(
    "Registration rejected by admin"
  );

  if (!open || !team) return null;

  const registrationStatus = String(team.registration_status || "").toLowerCase();

  const rosterStatus = String(team.roster_status || "").toLowerCase();

  const isApproved = registrationStatus === "approved";

  const isRejected =
    registrationStatus === "failed" ||
    registrationStatus === "rejected";

  const isRosterConfirmed = rosterStatus === "confirmed"
  const isRosterLocked = rosterStatus === "locked";

  const loading =
    approveLoading || rejectLoading || lockLoading;

  const handleConfirm = async () => {

    if (action === "approve") {
      await onApprove(team.team_id, team.registration_id);
      return;
    }

    if (action === "reject") {
      if (!rejectReason.trim()) return;

      await onReject(
        team.team_id,
        team.registration_id,
        rejectReason.trim()
      );

      return;
    }

    if (action === "lock") {
      await onRosterLock(team.team_id, team.registration_id);
    }
  };

  const actionTitle =
    action === "approve"
      ? "Approve Registration"
      : action === "reject"
        ? "Reject Registration"
        : "Lock Final Roster";

  const actionMessage =
    action === "approve"
      ? `Approve ${team.team_name || "this team"} for this tournament?`
      : action === "reject"
        ? `Reject ${team.team_name || "this team"} from this tournament?`
        : `Lock ${team.team_name || "this team"}'s final roster?`;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 z-[110] flex h-full w-[80%] max-w-[340px] flex-col border-l border-[var(--border-subtle)] bg-[var(--surface-base)] shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3">
          <div className="min-w-0">
            <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {action ? "Confirm Action" : "Team Actions"}
            </p>

            <p className="mt-1 truncate text-[11px] font-semibold text-[var(--text-primary)]">
              {team.team_name || "Unnamed Team"}
            </p>

            <p className="mt-0.5 text-[7px] text-[var(--text-muted)]">
              #{team.team_tag || "—"} · Registration #{team.id}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-7 shrink-0 items-center justify-center rounded-[6px] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {!action ? (
            <div className="space-y-2">
              {/* Approve */}
              <button
                type="button"
                disabled={isApproved || isRejected}
                onClick={() => onSelectAction("approve")}
                className="flex w-full items-center justify-between rounded-[8px] border border-[var(--border-subtle)] px-3 py-3 text-left transition-colors hover:bg-[var(--surface-elevated)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold text-[var(--text-primary)]">
                    {isApproved
                      ? "Registration Approved"
                      : "Approve Registration"}
                  </p>

                  <p className="mt-0.5 text-[7px] text-[var(--text-muted)]">
                    {isApproved
                      ? "Already approved"
                      : "Approve this team"}
                  </p>
                </div>

                {isApproved && (
                  <Check
                    size={14}
                    className="shrink-0 text-emerald-600"
                  />
                )}
              </button>

              {/* Lock */}
              <button
                type="button"
                disabled={!isApproved || !isRosterConfirmed || isRosterLocked}
                onClick={() => onSelectAction("lock")}
                className="flex w-full items-center justify-between rounded-[8px] border border-[var(--border-subtle)] px-3 py-3 text-left transition-colors hover:bg-[var(--surface-elevated)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold text-[var(--text-primary)]">
                    {isRosterLocked ? "Roster Locked" : "Lock Final Roster"}
                  </p>

                  <p className="mt-0.5 text-[7px] text-[var(--text-muted)]">
                    {isRosterLocked
                      ? "Already locked"
                      : !isApproved
                        ? "Approve registration first"
                        : !isRosterConfirmed
                          ? "Captain must confirm roster first"
                          : "Prevent further roster changes"}
                  </p>
                </div>

                {isRosterLocked ? (
                  <Check
                    size={14}
                    className="shrink-0 text-emerald-600"
                  />
                ) : (
                  <Lock
                    size={13}
                    className="shrink-0 text-[var(--text-muted)]"
                  />
                )}
              </button>

              {/* Reject */}
              <button
                type="button"
                disabled={isApproved || isRejected}
                onClick={() => onSelectAction("reject")}
                className="flex w-full items-center justify-between rounded-[8px] border border-red-500/15 px-3 py-3 text-left transition-colors hover:bg-red-500/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold text-red-600">
                    {isRejected
                      ? "Registration Rejected"
                      : "Reject Registration"}
                  </p>

                  <p className="mt-0.5 text-[7px] text-red-500/70">
                    {isRejected
                      ? "Already rejected"
                      : "Reject this team"}
                  </p>
                </div>

                {isRejected && (
                  <Check
                    size={14}
                    className="shrink-0 text-red-600"
                  />
                )}
              </button>
            </div>
          ) : (
            /* Confirmation */
            <div>
              <p className="text-[11px] font-semibold text-[var(--text-primary)]">
                {actionTitle}
              </p>

              <p className="mt-2 text-[8px] leading-4 text-[var(--text-muted)]">
                {actionMessage}
              </p>

              {/* Reject reason */}
              {action === "reject" && (
                <div className="mt-4">
                  <label className="mb-1.5 block text-[8px] font-medium text-[var(--text-secondary)]">
                    Reason
                  </label>

                  <textarea
                    value={rejectReason}
                    onChange={(e) =>
                      setRejectReason(e.target.value)
                    }
                    disabled={loading}
                    rows={3}
                    className="w-full resize-none rounded-[7px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] px-3 py-2 text-[8px] leading-4 text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--border-default)] disabled:opacity-60"
                    placeholder="Enter rejection reason..."
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border-subtle)] p-3">
          {!action ? (
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-full rounded-[7px] border border-[var(--border-subtle)] text-[8px] font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-elevated)]"
            >
              Close
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                disabled={loading}
                onClick={() => onSelectAction(null)}
                className="h-8 flex-1 rounded-[7px] border border-[var(--border-subtle)] text-[8px] font-semibold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-elevated)] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  loading ||
                  (action === "reject" &&
                    !rejectReason.trim())
                }
                onClick={handleConfirm}
                className={`h-8 flex-1 rounded-[7px] text-[8px] font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50 ${action === "reject"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-[var(--text-primary)] hover:opacity-90"
                  }`}
              >
                {loading
                  ? "Processing..."
                  : action === "approve"
                    ? "Approve"
                    : action === "lock"
                      ? "Lock Roster"
                      : "Reject"}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

export default TeamActionDrawer;