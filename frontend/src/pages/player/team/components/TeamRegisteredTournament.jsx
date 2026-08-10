import React from "react"
import { ArrowRight, CalendarDays, ChevronRight, CircleCheck, Clock3, DoorOpen, Globe2, IndianRupee, IndianRupeeIcon, LockKeyhole, LockKeyholeIcon, RadioIcon, ShieldCheck, Swords, Trophy, Users, } from "lucide-react"

import RegistrationNotice from "./RegistrationNotice"
import { replace, useNavigate } from "react-router-dom"

const CONTRIBUTION_PER_PLAYER = 100

const dummyTournament = {
  id: 1,
  tournament_name: "Mobile Legends Champions Cup",
  background_image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1800&q=85",
  team_format: "5V5",
  tournament_type: "Single Elimination",
  joined_teams: 12,
  total_teams: 20,
  prize_pool: 50000,
  entry_fee: 500,
  country: "India",
  tournament_date: "Sep 18, 2026",
}

export default function RegisteredTournament({
  tournament = dummyTournament,
  isRosterLocked = true,
  isCurrentUserInRoster = false,
  isPlayerPaid = false,
  isCheckInOpen = false,
  isPlayerCheckIn = false,
  isTournamentLive = false,
  isPlayerInRoster = false,
  isPlayerSubstitute = false,
  roomDetails = null,
  onPayment,
  onCheckIn,
  onRoomDetails,
  onTournamentDetails,
}) {
  return (
    <section className="w-full">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="mb-1 text-[8px] font-bold uppercase tracking-[0.18em] text-[var(--accent-gold)]">
            Your Tournament
          </p>

          <h2 className="text-lg font-black uppercase leading-none tracking-[-0.03em]" style={{ color: "var(--headline-primary)" }}>
            Active Registration
          </h2>

          <p className="mt-1.5 max-w-[420px] text-[9px] leading-[1.5] text-[var(--text-muted)]">
            View your team&apos;s tournament registration and participation status.
          </p>
        </div>

        <span className="hidden shrink-0 text-[8px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)] sm:block">
          1 Active Registration
        </span>
      </div>

      <div className="w-full">
        <TournamentCard
          tournament={dummyTournament}
          isRosterLocked={isRosterLocked}
          isCurrentUserInRoster={isCurrentUserInRoster}
          isPlayerPaid={isPlayerPaid}
          isCheckInOpen={isCheckInOpen}
          isPlayerCheckIn={isPlayerCheckIn}
          isTournamentLive={isTournamentLive}
          isPlayerInRoster={isPlayerInRoster}
          isPlayerSubstitute={isPlayerSubstitute}
          roomDetails={roomDetails}
          onPayment={onPayment}
          onCheckIn={onCheckIn}
          onRoomDetails={onRoomDetails}
          onTournamentDetails={onTournamentDetails}
        />

        <RegistrationNotice />
      </div>
    </section>
  )
}

function TournamentCard({
  tournament,
  isCurrentUserInRoster,
  isRosterLocked,
  isPlayerPaid,
  isCheckInOpen,
  isPlayerCheckIn,
  isTournamentLive,
  isPlayerInRoster,
  isPlayerSubstitute,
  roomDetails,
  onPayment,
  onCheckIn,
  onRoomDetails,
  onTournamentDetails,
}) {

  const navigate = useNavigate()
  const registeredTeams = Number(tournament.joined_teams ?? 0)
  const totalTeams = Number(tournament.total_teams ?? 0)

  const percentage = totalTeams > 0
    ? Math.min((registeredTeams / totalTeams) * 100, 100)
    : 0

  /*
   * This is the main permission variable.
   *
   * A player can perform tournament actions only when:
   *
   * 1. They are in the active roster
   * OR
   * 2. They are an approved substitute.
   */
  const canOperateTournament =
    isCurrentUserInRoster || isPlayerSubstitute

  const action = getTournamentAction({
    isRosterLocked,
    isPlayerPaid,
    isCheckInOpen,
    isPlayerCheckIn,
    isTournamentLive,
    canOperateTournament,
  })

  return (
    <article className="relative isolate min-h-[300px] overflow-hidden rounded-[20px] border" style={{ borderColor: "var(--border-default)" }}>
      {tournament.background_image ? (
        <img src={tournament.background_image} alt="" aria-hidden="true" className="absolute inset-0 -z-30 h-full w-full object-cover object-center opacity-[0.3] saturate-[0.65]" />
      ) : (
        <div className="absolute inset-0 -z-30" style={{ background: "radial-gradient(circle at 78% 20%, color-mix(in srgb, var(--accent-gold) 9%, transparent), #090909 60%)" }} />
      )}

      <div className="absolute inset-0 -z-20" style={{ background: "linear-gradient(90deg, rgba(7,7,7,.98) 0%, rgba(7,7,7,.88) 42%, rgba(7,7,7,.5) 100%)" }} />

      <div className="absolute inset-0 -z-20" style={{ background: "linear-gradient(180deg, rgba(7,7,7,.2) 0%, rgba(7,7,7,.35) 48%, rgba(7,7,7,.96) 100%)" }} />

      <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(circle at 76% 15%, color-mix(in srgb, var(--accent-gold) 7%, transparent), transparent 30%)" }} />

      <div className="relative flex min-h-[300px] flex-col justify-between px-4 py-4 sm:px-5 sm:py-5">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.18em]" style={{ color: action.accent }}>
                {action.statusIcon}
                {action.statusLabel}
              </span>

              <span className="h-3 w-px shrink-0 bg-white/15" />

              <span className="truncate text-[8px] font-bold uppercase tracking-[0.16em] text-white/40">
                Registered Event
              </span>
            </div>

            <span className="hidden shrink-0 items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-white/45 sm:flex">
              <Globe2 size={10} />
              {tournament.country}
            </span>
          </div>

          <div className="mt-10 sm:mt-12">
            <div className="mb-2 flex items-center gap-1.5 text-white/40">
              <Trophy size={11} />

              <span className="text-[8px] font-bold uppercase tracking-[0.2em]">
                Tournament
              </span>
            </div>

            <h3 className="max-w-[680px] text-[28px] font-black uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-4xl lg:text-[42px]" style={{ fontFamily: "Google Sans" }}>
              {tournament.tournament_name}
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/50">
              <span className="flex items-center gap-1.5">
                <Users size={10} />
                {tournament.team_format}
              </span>

              <span className="size-1 rounded-full bg-white/20" />

              <span className="flex items-center gap-1.5">
                <Swords size={10} />
                {tournament.tournament_type}
              </span>

              <span className="size-1 rounded-full bg-white/20" />

              <span className="flex items-center gap-1.5">
                <Globe2 size={10} />
                {tournament.country}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-2 border-y border-white/10 sm:grid-cols-4">
            <TournamentStat icon={<CalendarDays size={12} />} label="DATE" value={tournament.tournament_date} />

            <TournamentStat icon={<Users size={12} />} label="TEAMS" value={`${registeredTeams}/${totalTeams}`} progress={percentage} />

            <TournamentStat icon={<Trophy size={12} />} label="PRIZE POOL" value={`₹${Number(tournament.prize_pool ?? 0).toLocaleString("en-IN")}`} accent />

            <TournamentStat icon={<IndianRupee size={12} />} label="ENTRY FEE" value={`₹${Number(tournament.entry_fee ?? 0).toLocaleString("en-IN")}`} />
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <span className="size-1.5 shrink-0 rounded-full" style={{ background: action.accent }} />

              <span className="truncate text-[9px] font-medium text-white/45">
                {action.message}
              </span>
            </div>

            <div className="flex w-full gap-2 sm:w-auto">
              {action.type === "DETAILS_ONLY" ? (
                <TournamentActionButton
                  action={action}
                  onNavigate={navigate}
                  tournamentId={tournament?.id}
                  onTournamentDetails={onTournamentDetails}
                />
              ) : (
                <>
                  <button type="button" className="flex h-8 flex-1 items-center justify-center gap-1.5 border border-white/10 bg-black/20 px-3 text-[9px] font-bold uppercase tracking-[0.08em] text-white/60 transition-all hover:-translate-y-px hover:text-white sm:flex-none" onClick={onTournamentDetails}>
                    DETAILS
                    <ChevronRight size={11} />
                  </button>

                  <TournamentActionButton
                    onNavigate={navigate}
                    action={action}
                    tournamentId={tournament?.id}
                    onPayment={onPayment}
                    onCheckIn={onCheckIn}
                    onRoomDetails={onRoomDetails}
                    roomDetails={roomDetails}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function getTournamentAction({
  isRosterLocked,
  isPlayerPaid,
  isCheckInOpen,
  isPlayerCheckIn,
  isTournamentLive,
  canOperateTournament,
}) {
  /*
   * PLAYER IS NOT IN ACTIVE ROSTER
   *
   * Do this FIRST.
   *
   * This prevents the player from ever receiving
   * PAYMENT / CHECK-IN / ROOM DETAILS actions.
   */
  if (!canOperateTournament) {
    return {
      type: "DETAILS_ONLY",
      statusLabel: "Team Registered",
      message: "Your team is registered, but you are not part of the active roster.",
      buttonLabel: "TOURNAMENT DETAILS",
      disabled: false,
      accent: "rgba(255,255,255,.45)",
      statusIcon: <ShieldCheck size={11} />,
    }
  }

  /*
   * TOURNAMENT LIVE
   */
  if (isTournamentLive && isPlayerCheckIn) {
    return {
      type: "ROOM_DETAILS",
      statusLabel: "Match Live",
      message: "Your match room is ready.",
      buttonLabel: "ROOM DETAILS",
      disabled: false,
      accent: "var(--accent-gold)",
      statusIcon: <RadioIcon size={11} />,
    }
  }

  /*
   * CHECKED IN BUT TOURNAMENT HAS NOT STARTED
   */
  if (isPlayerCheckIn) {
    return {
      type: "CHECKED_IN",
      statusLabel: "Checked In",
      message: "You're checked in. Match room opens when your match starts.",
      buttonLabel: "ROOM DETAILS",
      disabled: true,
      accent: "var(--accent-gold)",
      statusIcon: <CircleCheck size={11} />,
    }
  }

  /*
   * PAYMENT COMPLETE BUT CHECK-IN IS NOT OPEN
   */
  if (isPlayerPaid && !isCheckInOpen) {
    return {
      type: "CHECK_IN_LOCKED",
      statusLabel: "Payment Complete",
      message: "Check-in opens 1 hour before tournament start.",
      buttonLabel: "CHECK-IN",
      disabled: true,
      accent: "rgba(255,255,255,.45)",
      statusIcon: <Clock3 size={11} />,
    }
  }

  /*
   * PAYMENT COMPLETE + CHECK-IN OPEN
   */
  if (isPlayerPaid && isCheckInOpen) {
    return {
      type: "CHECK_IN",
      statusLabel: "Check-In Open",
      message: "Check-in is now open for this tournament.",
      buttonLabel: "CHECK-IN",
      disabled: false,
      accent: "var(--accent-gold)",
      statusIcon: <Clock3 size={11} />,
    }
  }

  /*
   * ROSTER LOCKED
   *
   * Player can now make their ₹100 contribution.
   */
  if (isRosterLocked) {
    return {
      type: "PAYMENT",
      statusLabel: "Contribution Required",
      message: `Pay your ₹${CONTRIBUTION_PER_PLAYER} contribution to confirm participation.`,
      buttonLabel: `PAY ₹${CONTRIBUTION_PER_PLAYER}`,
      disabled: false,
      accent: "var(--accent-gold)",
      statusIcon: <IndianRupeeIcon size={11} />,
    }
  }

  /*
   * ROSTER NOT LOCKED
   */
  return {
    type: "PAYMENT_LOCKED",
    statusLabel: "Roster Awaiting Confirmation",
    message: "Captain must confirm the roster before contributions can be made.",
    buttonLabel: `PAY ₹${CONTRIBUTION_PER_PLAYER}`,
    disabled: true,
    accent: "rgba(255,255,255,.35)",
    statusIcon: <LockKeyhole size={11} />,
  }
}

function TournamentActionButton({
  action,
  onNavigate,
  tournamentId,
  onPayment,
  onCheckIn,
  onRoomDetails,
  onTournamentDetails,
  roomDetails,
}) {
  const isDetailsOnly = action.type === "DETAILS_ONLY"
  const isRoomDetails = action.type === "ROOM_DETAILS"
  const isPayment = action.type === "PAYMENT"
  const isCheckIn = action.type === "CHECK_IN"

  const handleClick = () => {
    if (isDetailsOnly) {
      onTournamentDetails?.()
      return
    }

    if (isPayment) {
      onNavigate(`/player/tournament/${tournamentId}/detail`,{
        replace:true
      })
      onPayment?.()
      return
    }

    if (isCheckIn) {
      onCheckIn?.()
      return
    }

    if (isRoomDetails) {
      onRoomDetails?.(roomDetails)
    }
  }

  return (
    <button
      type="button"
      disabled={action.disabled}
      onClick={handleClick}
      className={`flex h-8 flex-1 items-center justify-center gap-1.5 px-4 text-[9px] font-bold uppercase tracking-[0.08em] transition-all sm:flex-none ${action.disabled ? "cursor-not-allowed opacity-45" : "hover:-translate-y-px active:translate-y-0"}`}
      style={{
        color: isDetailsOnly || isRoomDetails ? "rgba(255,255,255,.75)" : "var(--bg-canvas)",
        background: isDetailsOnly || isRoomDetails ? "rgba(255,255,255,.08)" : "var(--accent-gold)",
        border: isDetailsOnly || isRoomDetails ? "1px solid rgba(255,255,255,.12)" : "none",
      }}
    >
      {isDetailsOnly && <ShieldCheck size={11} />}

      {isRoomDetails && <DoorOpen size={11} />}

      {action.buttonLabel}

      {!action.disabled && !isRoomDetails && !isDetailsOnly && (
        <ArrowRight size={11} strokeWidth={2.5} />
      )}

      {!action.disabled && isRoomDetails && (
        <ChevronRight size={11} strokeWidth={2.5} />
      )}
    </button>
  )
}

function TournamentStat({
  icon,
  label,
  value,
  accent = false,
  progress,
}) {
  return (
    <div className="min-w-0 border-r border-white/10 px-2.5 py-2.5 first:pl-0 last:border-r-0 sm:px-3">
      <div className="flex items-center gap-1.5">
        <span style={{ color: accent ? "var(--accent-gold)" : "rgba(255,255,255,.4)" }}>
          {icon}
        </span>

        <span className="truncate text-[7px] font-bold uppercase tracking-[0.15em] text-white/40">
          {label}
        </span>
      </div>

      <p className="mt-1.5 truncate text-[10px] font-bold uppercase sm:text-[11px]" style={{ color: accent ? "var(--accent-gold)" : "rgba(255,255,255,.85)" }}>
        {value}
      </p>

      {typeof progress === "number" && (
        <div className="mt-1.5 h-[2px] overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "var(--accent-gold)" }} />
        </div>
      )}
    </div>
  )
}