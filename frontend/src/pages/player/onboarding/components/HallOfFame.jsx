import React from "react";
import {
  UsersRound,
  Search,
  WalletCards,
  LockKeyhole,
  Clock3,
  Swords,
  Upload,
  Gift,
  ArrowRight,
  Trophy,
  Target,
  Activity,
} from "lucide-react";

const journeySteps = [
  {
    number: "01",
    title: "Build Your Squad",
    description: "Create your team or join an existing one.",
    icon: UsersRound,
  },
  {
    number: "02",
    title: "Choose a Tournament",
    description: "Find a tournament that matches your squad.",
    icon: Search,
  },
  {
    number: "03",
    title: "Register & Pay",
    description: "Register your team and complete the entry fee.",
    icon: WalletCards,
  },
  {
    number: "04",
    title: "Lock Your Roster",
    description: "Confirm your players before registration closes.",
    icon: LockKeyhole,
  },
  {
    number: "05",
    title: "Check In",
    description: "Be ready before your scheduled match begins.",
    icon: Clock3,
  },
  {
    number: "06",
    title: "Compete",
    description: "Join your assigned lobby and play your match.",
    icon: Swords,
  },
  {
    number: "07",
    title: "Submit Result",
    description: "Upload your match result for verification.",
    icon: Upload,
  },
  {
    number: "08",
    title: "Collect Rewards",
    description: "Verified winners receive their rewards.",
    icon: Gift,
  },
];

function NewPlayerJourney() {
  return (
    <section className="w-full py-14">

      {/* Heading */}
      <div className="mb-10">

        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-gold)]">
          Getting Started
        </p>

        <h2 className="text-[26px] font-semibold tracking-[-0.7px] text-[var(--text-primary)]">
          Your tournament journey
        </h2>

        <p className="mt-2 max-w-[620px] text-[12px] leading-5 text-[var(--text-secondary)]">
          From finding your squad to claiming your rewards, here's how a GAMIX
          tournament works.
        </p>

      </div>

      {/* Journey */}
      <div className="relative">

        {/* Connecting line */}
        <div className="absolute left-[5%] right-[5%] top-[24px] hidden h-px bg-[var(--border-subtle)] xl:block" />

        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">

          {journeySteps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative">

                {/* Icon */}
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-canvas)]">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(200,176,122,0.10)] text-[var(--accent-gold)] transition-transform duration-200 hover:translate-y-[-1px]">

                    <Icon size={18} strokeWidth={1.6} />

                  </div>

                </div>

                {/* Step */}
                <p className="mt-4 text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Step {step.number}
                </p>

                <h3 className="mt-1.5 text-[11px] font-semibold text-[var(--text-primary)]">
                  {step.title}
                </h3>

                <p className="mt-1.5 text-[10px] leading-[1.6] text-[var(--text-muted)]">
                  {step.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>

      {/* Bottom CTA */}
      <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-[var(--surface-elevated)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-[12px] font-semibold text-[var(--text-primary)]">
            Ready to compete?
          </p>

          <p className="mt-1 text-[10px] text-[var(--text-muted)]">
            Find your first tournament and start building your record.
          </p>
        </div>

        <button className="flex w-fit items-center gap-2 rounded-xl bg-[var(--action-primary-bg)] px-5 py-2.5 text-[10px] font-semibold text-[var(--action-primary-text)] transition-transform duration-200 hover:translate-y-[-1px]">
          Explore Tournaments
          <ArrowRight size={13} strokeWidth={1.7} />
        </button>

      </div>

    </section>
  );
}

function ReturningPlayerJourney({ player }) {
  return (
    <section className="w-full py-14">

      {/* Header */}
      <div className="mb-8 flex items-end justify-between">

        <div>

          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-gold)]">
            Your Progress
          </p>

          <h2 className="text-[26px] font-semibold tracking-[-0.7px] text-[var(--text-primary)]">
            Your competitive journey
          </h2>

          <p className="mt-2 text-[12px] text-[var(--text-secondary)]">
            Keep playing, keep improving, keep climbing.
          </p>

        </div>

        <button className="hidden items-center gap-2 text-[10px] font-semibold text-[var(--text-secondary)] transition-transform duration-200 hover:translate-y-[-1px] hover:text-[var(--text-primary)] sm:flex">
          View Profile
          <ArrowRight size={13} />
        </button>

      </div>

      {/* Current Tournament */}
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">

        {/* Current Tournament */}
        <div className="relative overflow-hidden rounded-2xl bg-[var(--surface-elevated)] p-6">

          <div className="absolute right-5 top-5 rounded-full bg-[rgba(200,176,122,0.10)] px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-[var(--accent-gold)]">
            In Progress
          </div>

          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Current Tournament
          </p>

          <h3 className="mt-3 text-[20px] font-semibold tracking-[-0.4px] text-[var(--text-primary)]">
            {player?.tournamentName || "GAMIX Championship S4"}
          </h3>

          <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
            {player?.stage || "Quarter Finals"} · {player?.teamName || "Your Team"}
          </p>

          {/* Progress */}
          <div className="mt-7">

            <div className="mb-2 flex items-center justify-between">
              <span className="text-[9px] text-[var(--text-muted)]">
                Tournament Progress
              </span>

              <span className="text-[9px] font-semibold text-[var(--accent-gold)]">
                {player?.progress || "62%"}
              </span>
            </div>

            <div className="h-1 overflow-hidden rounded-full bg-[var(--border-subtle)]">
              <div className="h-full w-[62%] rounded-full bg-[var(--accent-gold)]" />
            </div>

          </div>

          {/* Next Action */}
          <div className="mt-6 flex items-center justify-between">

            <div>
              <p className="text-[9px] uppercase tracking-[0.15em] text-[var(--text-muted)]">
                Next Action
              </p>

              <p className="mt-1 text-[11px] font-semibold text-[var(--text-primary)]">
                {player?.nextAction || "Check in for your next match"}
              </p>
            </div>

            <button className="flex items-center gap-2 rounded-xl bg-[var(--action-primary-bg)] px-4 py-2.5 text-[10px] font-semibold text-[var(--action-primary-text)] transition-transform duration-200 hover:translate-y-[-1px]">
              Open Tournament
              <ArrowRight size={13} />
            </button>

          </div>

        </div>

        {/* Player Stats */}
        <div className="grid grid-cols-2 gap-3">

          <Stat
            icon={Trophy}
            label="Tournaments"
            value={player?.tournaments || "12"}
          />

          <Stat
            icon={Swords}
            label="Matches"
            value={player?.matches || "28"}
          />

          <Stat
            icon={Target}
            label="Total Kills"
            value={player?.kills || "1,284"}
          />

          <Stat
            icon={Activity}
            label="K/D Ratio"
            value={player?.kd || "4.21"}
          />

        </div>

      </div>

      {/* Recent Progress */}
      <div className="mt-4 flex flex-col gap-4 rounded-2xl bg-[var(--surface-elevated)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(200,176,122,0.10)] text-[var(--accent-gold)]">
            <Trophy size={17} strokeWidth={1.6} />
          </div>

          <div>
            <p className="text-[11px] font-semibold text-[var(--text-primary)]">
              Last Tournament
            </p>

            <p className="mt-1 text-[10px] text-[var(--text-muted)]">
              {player?.lastTournament || "GAMIX Weekly Showdown"} ·
              {player?.lastResult || " Semi Final"}
            </p>
          </div>

        </div>

        <button className="flex items-center gap-2 text-[10px] font-semibold text-[var(--text-secondary)] transition-transform duration-200 hover:translate-y-[-1px] hover:text-[var(--text-primary)]">
          View Match History
          <ArrowRight size={13} />
        </button>

      </div>

    </section>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-[var(--surface-elevated)] p-5">

      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(200,176,122,0.10)] text-[var(--accent-gold)]">
        <Icon size={15} strokeWidth={1.6} />
      </div>

      <div className="mt-5">

        <p className="text-[22px] font-semibold tracking-[-0.5px] text-[var(--text-primary)]">
          {value}
        </p>

        <p className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
          {label}
        </p>

      </div>

    </div>
  );
}

export default function PlayerJourney({ hasParticipated = false, player }) {
  if (hasParticipated) {
    return <ReturningPlayerJourney player={player} />;
  }

  return <NewPlayerJourney />;
}

