import {
  ArrowRight,
  Users,
  Trophy,
  Shield,
  BarChart3,
  Plus,
  Compass,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function EmptyTeamState() {

  const navigate = useNavigate()

  return (
    <section className="relative  overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[var(--surface-base)]">

      <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-[var(--accent-gold)]/10 blur-[120px]" />
      <div className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-[var(--accent-gold)]/5 blur-[120px]" />

      <div className="relative flex h-full flex-col">

        <div className="grid flex-1 items-center gap-10 px-10 py-6 lg:grid-cols-2">

          <div>

            <span className="inline-flex rounded-full border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--headline-accent)]">
              TEAM WORKSPACE
            </span>

            <h1 className="mt-6 max-w-lg font-['CormorantGaramond'] text-3xl lg:text-5xl leading-none text-[var(--headline-primary)]">
              You're not in a team yet
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-5 lg:text-lg lg:leading-8 text-[var(--text-secondary)]">
              Create your own squad or discover existing teams competing in
              tournaments. Find teammates, build chemistry and climb the
              leaderboards together.
            </p>

            {/* CTA */}

            <div className="mt-8 lg:mt-10 flex flex-wrap gap-4">

              <button  
                onClick={() => navigate('/player/create')}
                className="inline-flex items-center rounded-2xl bg-[var(--action-primary-bg)] px-7 py-4 text-sm font-semibold text-[var(--action-primary-text)] shadow-[var(--shadow-md)] transition hover:scale-[1.02]">

                <Plus className="mr-2 h-5 w-5" />
                Create Team
              </button>

              <button
                onClick={() => navigate("/player/discover")} 
                className="inline-flex items-center rounded-2xl border border-[var(--action-secondary-border)] bg-[var(--action-secondary-bg)] px-7 py-4 text-sm font-semibold text-[var(--action-secondary-text)] transition hover:border-[var(--accent-gold)]">

                <Compass className="mr-2 h-5 w-5" />
                Discover Teams
              </button>

            </div>

            {/* <button className="mt-6 inline-flex items-center text-sm font-medium text-[var(--headline-accent)]">
              Have an invite code?
              <ArrowRight className="ml-2 h-4 w-4" />
            </button> */}

          </div>

          {/* RIGHT */}

          <div className="hidden lg:relative lg:flex items-center justify-center">

            <img
              src="/images/team_image.png"
              alt=""
              className="rounded-3xl max-h-[420px] w-auto object-contain"
            />

          </div>

        </div>

        {/* FEATURE STRIP  */}

        <div className="border-t border-[var(--border-default)] bg-[var(--surface-elevated)]">

          <div className="hidden lg:grid grid-cols-4">

            <Feature
              icon={<Users className="h-5 w-5 text-[var(--accent-gold)]" />}
              title="Team Play"
              subtitle="Coordinate strategies"
            />

            <Feature
              icon={<Trophy className="h-5 w-5 text-green-500" />}
              title="Tournaments"
              subtitle="Win rewards"
            />

            <Feature
              icon={<Shield className="h-5 w-5 text-purple-500" />}
              title="Roster"
              subtitle="Manage members"
            />

            <Feature
              icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
              title="Rankings"
              subtitle="Track progress"
            />

          </div>

        </div>

      </div>

    </section>
  );
}

function Feature({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-4 p-6">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface-base)] shadow-[var(--shadow-sm)]">

        {icon}

      </div>

      <div>

        <div className="font-semibold text-[var(--text-primary)]">
          {title}
        </div>

        <div className="text-sm text-[var(--text-secondary)]">
          {subtitle}
        </div>

      </div>

    </div>
  );
}