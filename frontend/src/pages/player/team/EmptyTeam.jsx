import { ArrowRight, Shield, Users, Trophy, BarChart3, UserPlus, Search } from "lucide-react";

export default function EmptyTeamState() {
  return (
    <section className="h-[75vh]">

      <div className="h-full bg-[var(--surface-base)] border border-[var(--border-default)] rounded-3xl p-8 flex flex-col">

        {/* Hero */}
        <div className="flex flex-col items-center text-center">

          <div className="relative mb-5">

            <div className="size-20 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center">
              <Shield className="size-10 text-[var(--accent-gold)]" />
            </div>

            <div className="absolute -top-1 left-1/2 -translate-x-1/2">
              <div className="size-6 rounded-full bg-[var(--accent-gold)] flex items-center justify-center">
                <Trophy className="size-3 text-white" />
              </div>
            </div>

          </div>

          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            No Team Found
          </h2>

          <p className="max-w-md mt-2 text-sm text-[var(--text-secondary)]">
            Create your own squad or join an existing team to participate in tournaments.
          </p>

        </div>

        {/* CTA */}
        <div className="grid grid-cols-2 gap-4 mt-8">

          <button className="group p-5 rounded-2xl border border-[var(--accent-gold)]/30 bg-[var(--surface-base)] hover:shadow-[var(--shadow-sm)] transition-all">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="size-10 rounded-xl bg-[var(--accent-gold)]/10 flex items-center justify-center">
                  <UserPlus className="size-5 text-[var(--accent-gold)]" />
                </div>

                <div className="text-left">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    Create Team
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)]">
                    Start your own squad.
                  </p>
                </div>

              </div>

              <ArrowRight className="size-4 text-[var(--accent-gold)] group-hover:translate-x-1 transition-transform" />

            </div>

          </button>

          <button className="group p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-base)] hover:shadow-[var(--shadow-sm)] transition-all">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Search className="size-5 text-blue-500" />
                </div>

                <div className="text-left">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    Find Team
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)]">
                    Browse open squads.
                  </p>
                </div>

              </div>

              <ArrowRight className="size-4 text-blue-500 group-hover:translate-x-1 transition-transform" />

            </div>

          </button>

        </div>

        {/* Benefits */}
        <div className="mt-auto pt-8">

          <div className="grid grid-cols-4 gap-4">

            <div className="rounded-2xl bg-[var(--surface-elevated)] p-4">
              <Users className="size-4 text-[var(--accent-gold)] mb-2" />
              <h4 className="text-sm font-medium text-[var(--text-primary)]">
                Team Play
              </h4>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Coordinate with teammates.
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--surface-elevated)] p-4">
              <Trophy className="size-4 text-green-500 mb-2" />
              <h4 className="text-sm font-medium text-[var(--text-primary)]">
                Win More
              </h4>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Compete for prizes.
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--surface-elevated)] p-4">
              <Shield className="size-4 text-purple-500 mb-2" />
              <h4 className="text-sm font-medium text-[var(--text-primary)]">
                Secure Roster
              </h4>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Manage your squad.
              </p>
            </div>

            <div className="rounded-2xl bg-[var(--surface-elevated)] p-4">
              <BarChart3 className="size-4 text-blue-500 mb-2" />
              <h4 className="text-sm font-medium text-[var(--text-primary)]">
                Rankings
              </h4>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Track performance.
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>
  )
}