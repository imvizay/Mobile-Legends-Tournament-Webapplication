import React, { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Clock3,
  LockKeyhole,
  MoreVertical,
  Search,
  Shield,
  UserRound,
  X,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import TeamActionDrawer from "./TeamActionDrawer";
import { tournamentRegistrationservice } from "../../../../../services/admin/tourna_registration_service";

const MAX_ROSTER = 5;

/* ------------------------------------------------ */
/* STATUS HELPERS */
/* ------------------------------------------------ */

const registrationStatusMap = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-700",
    icon: Clock3,
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-500/10 text-emerald-700",
    icon: Check,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/10 text-red-600",
    icon: X,
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-600",
    icon: X,
  },
};

function getRegistrationStatus(status) {
  const value = String(status || "pending").toLowerCase();

  return (
    registrationStatusMap[value] || {
      label: status || "Unknown",
      className: "bg-zinc-500/10 text-zinc-600",
      icon: Clock3,
    }
  );
}

/* ------------------------------------------------ */
/* TEAM LOGO */
/* ------------------------------------------------ */

function TeamLogo({
  src,
  size = "size-9",
  iconSize = 17,
  rounded = "rounded-full",
}) {
  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden border border-[var(--border-subtle)] bg-[var(--surface-elevated)] ${rounded}`}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="size-full object-cover"
        />
      ) : (
        <Shield
          size={iconSize}
          strokeWidth={1.7}
          className="text-[var(--text-muted)]"
        />
      )}
    </div>
  );
}

/* ------------------------------------------------ */
/* CAPTAIN AVATAR */
/* ------------------------------------------------ */

function CaptainAvatar({
  src,
  size = "size-7",
  iconSize = 13,
}) {
  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)]`}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="size-full rounded-full object-cover"
        />
      ) : (
        <UserRound
          size={iconSize}
          strokeWidth={1.7}
          className="text-[var(--text-muted)]"
        />
      )}
    </div>
  );
}

/* ------------------------------------------------ */
/* PROGRESS DOTS */
/* ------------------------------------------------ */

function ProgressDots({
  count,
  total = MAX_ROSTER,
  size = "size-[7px]",
  emptyColor = "bg-zinc-300",
}) {
  return (
    <div className="flex items-center gap-[4px]">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={`rounded-full ${size} ${index < count ? "bg-emerald-500" : emptyColor
            }`}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------ */
/* REGISTRATION STATUS */
/* ------------------------------------------------ */

function RegistrationStatus({ status, mobile = false }) {
  const config = getRegistrationStatus(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-[6px] font-semibold ${config.className} ${mobile
          ? "px-1.5 py-1 text-[5.5px]"
          : "px-2.5 py-[6px] text-[8px]"
        }`}
    >
      <Icon
        size={mobile ? 7 : 8}
        strokeWidth={2.7}
      />

      {config.label}
    </span>
  );
}

/* ------------------------------------------------ */
/* ROSTER STATUS */
/* ------------------------------------------------ */

function RosterStatus({ status, mobile = false }) {
  const value = String(status || "").toLowerCase();

  const locked = value === "locked";
  const confirmed = value === "confirmed";

  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-[6px] font-semibold ${locked
          ? "bg-indigo-500/10 text-indigo-700"
          : confirmed
            ? "bg-emerald-500/10 text-emerald-700"
            : "bg-zinc-500/10 text-zinc-500"
        } ${mobile
          ? "px-1.5 py-1 text-[5.5px]"
          : "px-2 py-[5px] text-[7px]"
        }`}
    >
      {locked ? (
        <LockKeyhole
          size={mobile ? 7 : 8}
          strokeWidth={2.5}
        />
      ) : (
        <Check
          size={mobile ? 7 : 8}
          strokeWidth={2.7}
        />
      )}

      {locked
        ? "Locked"
        : confirmed
          ? "Confirmed"
          : "Not Confirmed"}
    </span>
  );
}

/* ------------------------------------------------ */
/* ACTION BUTTON */
/* ------------------------------------------------ */

function ActionButton({
  team,
  isOpen,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex size-8 items-center justify-center rounded-[7px] transition-colors ${isOpen
          ? "bg-[var(--surface-elevated)] text-[var(--text-primary)]"
          : "text-[var(--text-muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"
        }`}
      aria-label={`Actions for ${team.team_name || "team"}`}
    >
      <MoreVertical size={15} />
    </button>
  );
}

/* ------------------------------------------------ */
/* MAIN COMPONENT */
/* ------------------------------------------------ */

function AllTeamsSection({
  registration = [],
  tournamentId,
  entryFee = 0,
  openMenu,
  setOpenMenu,
}) {
  const [search, setSearch] = useState("");

  const [drawerTeam, setDrawerTeam] = useState(null);
  const [drawerAction, setDrawerAction] = useState(null);

  /* ------------------------------------------------ */
  /* DRAWER */
  /* ------------------------------------------------ */

  const openDrawer = (team) => {
    setDrawerTeam(team);
    setDrawerAction(null);
    setOpenMenu(null);
  };

  const closeDrawer = () => {
    setDrawerTeam(null);
    setDrawerAction(null);
    setOpenMenu(null);
  };

  /* ------------------------------------------------ */
  /* TEAM STATS */
  /* ------------------------------------------------ */

  const getTeamStats = (team) => {
    const contributions = team.contribution || [];

    const rosterCount = contributions.length;

    const paidCount = contributions.filter(
      (item) =>
        String(item.status || "").toLowerCase() === "paid"
    ).length;

    const amount =
      paidCount * Number(entryFee || 0);

    return {
      rosterCount,
      paidCount,
      amount,
    };
  };

  /* ------------------------------------------------ */
  /* SEARCH */
  /* ------------------------------------------------ */

  const teams = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return registration;

    return registration.filter((team) => {
      const captain =
        team.captain_username ||
        team.captain_email?.split("@")[0] ||
        "";

      return [
        team.team_name,
        team.team_tag,
        captain,
        team.captain_mlbb_id,
        team.registration_status,
        team.roster_status,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        );
    });
  }, [registration, search]);

  /* ------------------------------------------------ */
  /* MUTATIONS */
  /* ------------------------------------------------ */

  const markRegistrationApproved = useMutation({
    mutationKey: ["team-registration-approved"],

    mutationFn: ({
      teamId,
      registrationId,
    }) =>
      tournamentRegistrationservice.markRegistrationApproved(
        teamId,
        registrationId
      ),
  });

  const markRegistrationFailed = useMutation({
    mutationKey: ["team-registration-failed"],

    mutationFn: ({
      teamId,
      registrationId,
      reason,
    }) =>
      tournamentRegistrationservice.markRegistrationFailed(
        teamId,
        registrationId,
        reason
      ),
  });

  const teamRegRosterLockMutation = useMutation({
    mutationKey: ["lock-roster"],

    mutationFn: ({
      teamId,
      registrationId,
    }) =>
      tournamentRegistrationservice.lockFinalRoster(
        teamId,
        registrationId
      ),
  });

  /* ------------------------------------------------ */
  /* HANDLERS */
  /* ------------------------------------------------ */

  const handleRegistrationApprove = async (
    teamId,
    registrationId
  ) => {
    if (!teamId || !registrationId) return;

    try {
      const response =
        await markRegistrationApproved.mutateAsync({
          teamId,
          registrationId,
        });

      console.log("approved response", response);
      closeDrawer();
    } catch (error) {
      console.log(
        "team approved axios error",
        error
      );
    }
  };

  const handleRegistrationFailed = async (
    teamId,
    registrationId,
    reason = ""
  ) => {
    if (!teamId || !registrationId) return;
    if (!reason.trim()) return;

    try {
      const response =
        await markRegistrationFailed.mutateAsync({
          teamId,
          registrationId,
          reason,
        });

      console.log("failed response", response);
      closeDrawer();
    } catch (error) {
      console.log(
        "failed mutation error",
        error
      );
    }
  };

  const handleRosterLock = async (
    teamId,
    registrationId
  ) => {
    if (!teamId || !registrationId) return;

    try {
      const response =
        await teamRegRosterLockMutation.mutateAsync({
          teamId,
          registrationId,
        });

      console.log(
        "roster lock response",
        response
      );

      closeDrawer();
    } catch (error) {
      console.log(
        "roster lock error",
        error
      );
    }
  };

  return (
    <section className="min-w-0">

      {/* SEARCH */}

      <div className="flex min-w-0 gap-2">
        <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] px-2.5 sm:h-[38px] sm:px-3">
          <Search
            size={13}
            className="shrink-0 text-[var(--text-muted)]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search team, captain, or tag..."
            className="min-w-0 flex-1 bg-transparent text-[8px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] sm:text-[9px]"
          />
        </div>

        <button
          type="button"
          className="hidden h-[38px] shrink-0 items-center gap-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] px-3 text-[9px] text-[var(--text-secondary)] sm:flex"
        >
          <span>All Status</span>
          <ChevronDown size={12} />
        </button>

        <button
          type="button"
          className="hidden h-[38px] shrink-0 items-center gap-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] px-3 text-[9px] text-[var(--text-secondary)] md:flex"
        >
          <span>All Payments</span>
          <ChevronDown size={12} />
        </button>
      </div>

      {/* ================================================= */}
      {/* MOBILE */}
      {/* ================================================= */}

      <div className="mt-2 space-y-1.5 sm:hidden">
        {teams.length > 0 ? (
          teams.map((team, index) => {
            const {
              rosterCount,
              paidCount,
              amount,
            } = getTeamStats(team);

            const captainName =
              team.captain_username ||
              team.captain_email?.split("@")[0] ||
              "Unknown";

            return (
              <article
                key={team.id}
                className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)]"
              >
                {/* TEAM HEADER */}

                <div className="flex items-center gap-2.5 px-2.5 py-2">
                  <span className="w-4 shrink-0 text-[6px] font-medium tabular-nums text-[var(--text-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <TeamLogo
                    src={team.team_logo_url}
                    size="size-8"
                    iconSize={15}
                    rounded="rounded-lg"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <p className="truncate text-[9px] font-semibold text-[var(--text-primary)]">
                        {team.team_name ||
                          "Unnamed Team"}
                      </p>

                      <span className="shrink-0 text-[6px] text-[var(--text-muted)]">
                        #{team.team_tag || "—"}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center gap-1">
                      <CaptainAvatar
                        src={team.captain_avatar_url}
                        size="size-4"
                        iconSize={8}
                      />

                      <span className="truncate text-[6px] text-[var(--text-muted)]">
                        {captainName}
                      </span>
                    </div>
                  </div>

                  <ActionButton
                    team={team}
                    isOpen={
                      drawerTeam?.id === team.id
                    }
                    onClick={() =>
                      openDrawer(team)
                    }
                  />
                </div>

                {/* STATUS ROW */}

                <div className="flex items-center justify-between border-t border-[var(--border-subtle)] px-2.5 py-1.5">
                  <RegistrationStatus
                    status={
                      team.registration_status
                    }
                    mobile
                  />

                  <RosterStatus
                    status={team.roster_status}
                    mobile
                  />
                </div>

                {/* STATS */}

                <div className="grid grid-cols-3 border-t border-[var(--border-subtle)]">
                  <div className="px-2.5 py-1.5">
                    <p className="text-[5px] font-medium uppercase tracking-[0.07em] text-[var(--text-muted)]">
                      Roster
                    </p>

                    <div className="mt-1 flex items-center gap-1">
                      <ProgressDots
                        count={rosterCount}
                        size="size-[5px]"
                      />

                      <span className="text-[7px] font-semibold text-[var(--text-secondary)]">
                        {rosterCount}/5
                      </span>
                    </div>
                  </div>

                  <div className="border-l border-[var(--border-subtle)] px-2.5 py-1.5">
                    <p className="text-[5px] font-medium uppercase tracking-[0.07em] text-[var(--text-muted)]">
                      Payment
                    </p>

                    <div className="mt-1 flex items-center gap-1">
                      <ProgressDots
                        count={paidCount}
                        size="size-[5px]"
                        emptyColor="bg-red-400/70"
                      />

                      <span className="text-[7px] font-semibold text-[var(--text-secondary)]">
                        {paidCount}/5
                      </span>
                    </div>
                  </div>

                  <div className="border-l border-[var(--border-subtle)] px-2.5 py-1.5">
                    <p className="text-[5px] font-medium uppercase tracking-[0.07em] text-[var(--text-muted)]">
                      Paid
                    </p>

                    <p className="mt-1 text-[7px] font-semibold text-[var(--text-primary)]">
                      ₹{amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* ID */}

                <div className="border-t border-[var(--border-subtle)] px-2.5 py-1.5">
                  <span className="text-[5.5px] text-[var(--text-muted)]">
                    ID:{" "}
                    {team.captain_mlbb_id ||
                      team.captain_id ||
                      "—"}
                  </span>
                </div>
              </article>
            );
          })
        ) : (
          <EmptyState message="No team registrations found." />
        )}
      </div>

      {/* ================================================= */}
      {/* DESKTOP */}
      {/* ================================================= */}

      <div className="mt-3 hidden overflow-hidden rounded-[10px] border border-[var(--border-subtle)] bg-[var(--surface-base)] sm:block">
        <div className="overflow-x-auto scrollbar-hide">

          {/* HEADER */}

          <div className="grid min-w-[980px] grid-cols-[40px_1.5fr_1.1fr_1fr_1fr_1fr_150px_45px] items-center gap-3 border-b border-[var(--border-subtle)] bg-[var(--surface-elevated)]/[0.35] px-4 py-3 text-[7px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            <span>#</span>
            <span>Team</span>
            <span>Captain</span>
            <span>Roster</span>
            <span>Payments</span>
            <span>Amount</span>
            <span>Registration / Roster</span>
            <span>Actions</span>
          </div>

          {teams.length > 0 ? (
            teams.map((team, index) => {
              const {
                rosterCount,
                paidCount,
                amount,
              } = getTeamStats(team);

              const captainName =
                team.captain_username ||
                team.captain_email?.split("@")[0] ||
                "Unknown";

              return (
                <div
                  key={team.id}
                  className="grid min-w-[980px] grid-cols-[40px_1.5fr_1.1fr_1fr_1fr_1fr_150px_45px] items-center gap-3 border-b border-[var(--border-subtle)] px-4 py-2.5 transition-colors hover:bg-[var(--surface-elevated)]/[0.35]"
                >
                  {/* INDEX */}

                  <span className="text-[9px] tabular-nums text-[var(--text-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* TEAM */}

                  <div className="flex min-w-0 items-center gap-3">
                    <TeamLogo
                      src={team.team_logo_url}
                    />

                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-semibold text-[var(--text-primary)]">
                        {team.team_name ||
                          "Unnamed Team"}
                      </p>

                      <p className="mt-[2px] text-[8px] text-[var(--text-muted)]">
                        #{team.team_tag || "—"}
                      </p>
                    </div>
                  </div>

                  {/* CAPTAIN */}

                  <div className="flex min-w-0 items-center gap-2">
                    <CaptainAvatar
                      src={team.captain_avatar_url}
                    />

                    <div className="min-w-0">
                      <p className="truncate text-[9px] font-medium text-[var(--text-primary)]">
                        {captainName}
                      </p>

                      <p className="mt-[2px] truncate text-[8px] text-[var(--text-muted)]">
                        ID:{" "}
                        {team.captain_mlbb_id ||
                          team.captain_id ||
                          "—"}
                      </p>
                    </div>
                  </div>

                  {/* ROSTER */}

                  <div>
                    <div className="flex items-center gap-[4px]">
                      <ProgressDots
                        count={rosterCount}
                      />

                      <span className="ml-1 text-[9px] font-medium text-[var(--text-secondary)]">
                        {rosterCount}/5
                      </span>
                    </div>

                    <p
                      className={`mt-[4px] text-[8px] ${rosterCount === MAX_ROSTER
                          ? "text-emerald-600"
                          : "text-amber-600"
                        }`}
                    >
                      {rosterCount === MAX_ROSTER
                        ? "Complete"
                        : "Incomplete"}
                    </p>
                  </div>

                  {/* PAYMENTS */}

                  <div>
                    <div className="flex items-center gap-[4px]">
                      <ProgressDots
                        count={paidCount}
                        emptyColor="bg-red-400/80"
                      />

                      <span className="ml-1 text-[9px] font-medium text-[var(--text-secondary)]">
                        {paidCount}/5
                      </span>
                    </div>

                    <p
                      className={`mt-[4px] text-[8px] ${paidCount === MAX_ROSTER
                          ? "text-emerald-600"
                          : "text-amber-600"
                        }`}
                    >
                      {paidCount === MAX_ROSTER
                        ? "Fully Paid"
                        : "Pending"}
                    </p>
                  </div>

                  {/* AMOUNT */}

                  <div>
                    <p className="text-[10px] font-semibold text-[var(--text-primary)]">
                      ₹{amount.toLocaleString("en-IN")}
                    </p>

                    <p className="mt-[2px] text-[7px] text-[var(--text-muted)]">
                      {paidCount}/{rosterCount || 5} paid
                    </p>
                  </div>

                  {/* REAL BACKEND STATUS */}

                  <div className="flex flex-col items-start gap-1">
                    <RegistrationStatus
                      status={
                        team.registration_status
                      }
                    />

                    <RosterStatus
                      status={team.roster_status}
                    />
                  </div>

                  {/* ACTION */}

                  <div className="flex justify-end">
                    <ActionButton
                      team={team}
                      isOpen={
                        drawerTeam?.id === team.id
                      }
                      onClick={() =>
                        openDrawer(team)
                      }
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <EmptyState
              message="No team registrations found."
              desktop
            />
          )}
        </div>
      </div>

      {/* FOOTER */}

      <div className="flex items-center justify-between py-2.5 sm:py-3">
        <span className="text-[7px] text-[var(--text-muted)] sm:text-[8px]">
          Showing {teams.length} of{" "}
          {registration.length} teams
        </span>

        <span className="text-[7px] text-[var(--text-muted)] sm:text-[8px]">
          {registration.length} registered
        </span>
      </div>

      {/* DRAWER */}

      <TeamActionDrawer
        open={!!drawerTeam}
        team={drawerTeam}
        tournamentId={tournamentId}
        action={drawerAction}
        onClose={closeDrawer}
        onSelectAction={setDrawerAction}
        onApprove={handleRegistrationApprove}
        onReject={handleRegistrationFailed}
        onRosterLock={handleRosterLock}
        approveLoading={
          markRegistrationApproved.isPending
        }
        rejectLoading={
          markRegistrationFailed.isPending
        }
        lockLoading={
          teamRegRosterLockMutation.isPending
        }
      />
    </section>
  );
}

/* ------------------------------------------------ */
/* EMPTY STATE */
/* ------------------------------------------------ */

function EmptyState({
  message,
  desktop = false,
}) {
  return (
    <div
      className={`flex items-center justify-center text-[var(--text-muted)] ${desktop
          ? "min-h-[180px] text-[10px]"
          : "min-h-[140px] rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] text-[8px]"
        }`}
    >
      {message}
    </div>
  );
}

export default AllTeamsSection;