import React, { useMemo } from "react";
import {
  ArrowLeft,
  LayoutDashboard,
  Trophy,
  Swords,
  Users,
  Wallet,
  History,
  Settings,
  Globe2,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";

const teamNavigation = [
  { label: "Overview", path: "", icon: LayoutDashboard },
  { label: "Tournaments", path: "tournaments", icon: Trophy },
  { label: "Matches", path: "matches", icon: Swords },
  { label: "Roster", path: "roster", icon: Users },
  { label: "Wallet", path: "wallet", icon: Wallet },
  { label: "History", path: "history", icon: History },
  { label: "Settings", path: "settings", icon: Settings },
];

export default function TeamLayout() {
  const { team } = useOutletContext();

  const navigate = useNavigate();
  const location = useLocation();

  const captain = useMemo(() => {
    return team?.team_members?.find(
      (member) => member.player_role?.toLowerCase() === "captain"
    );
  }, [team?.team_members]);

  const memberCount = team?.team_members?.length ?? 0;

  const maxMembers = team?.team_max_members ?? 7;

  const createdDate = useMemo(() => {
    if (!team?.team_created_at) return null;

    return new Date(team.team_created_at).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [team?.team_created_at]);


  const isActive = (path) => {
    const basePath = "/teams";

    if (!path) {
      return location.pathname === basePath;
    }

    return location.pathname.startsWith(`${basePath}/${path}`);
  };


  if (!team) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[var(--surface-base)]">
        <div className="text-center">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            Team not found
          </p>

          <button
            type="button"
            onClick={() => navigate("/player/team")}
            className="mt-2 text-xs font-medium text-[var(--accent-gold)]"
          >
            Back to Teams
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl min-h-screen bg-[var(--surface-base)] text-[var(--text-primary)]">
      <div className="mx-auto w-full max-w-[1440px] px-3 py-3 sm:px-3 lg:px-6">

        <button
          type="button"
          onClick={() => navigate("/player")}
          className="mb-3 flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft size={13} strokeWidth={1.8} />
          Back
        </button>

        <TeamHeader
          team={team}
          captain={captain}
          memberCount={memberCount}
          maxMembers={maxMembers}
          createdDate={createdDate}
        />

        <nav className="mt-3 overflow-x-auto border-b border-[var(--border-default)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-1">
            {teamNavigation.map(({ label, path, icon: Icon }) => {
              const active = isActive(path);

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    navigate(path ? `/teams/${path}` : "/teams")
                  }
                  className={`
                    relative flex h-10 shrink-0 items-center gap-1.5
                    whitespace-nowrap px-3
                    text-[11px] font-medium
                    transition-colors
                    ${active
                      ? "text-[var(--accent-gold)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }
                  `}
                >
                  <Icon size={13} strokeWidth={1.7} />

                  <span className="whitespace-nowrap">
                    {label}
                  </span>

                  {active && (
                    <span className="absolute inset-x-2 bottom-0 h-[2px] rounded-full bg-[var(--accent-gold)]" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>


        <main className="pt-4 sm:pt-5">
          <Outlet context={{ team }} />
        </main>
      </div>
    </section>
  );
}



function TeamHeader({
  team,
  captain,
  memberCount,
  maxMembers,
  createdDate,
}) {
  return (
    <header className="relative overflow-hidden rounded-[18px] border border-[var(--border-default)] bg-[var(--surface-elevated)]">

      {/* Background */}
      {team.team_banner_url && (
        <img
          src={team.team_banner_url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface-elevated)] via-[var(--surface-elevated)]/95 to-[var(--surface-elevated)]/45" />

      {/* Soft Gold Ambient */}
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-[var(--accent-gold)]/[0.08] blur-3xl" />

      <div className="relative flex min-h-[210px] flex-col gap-4 p-4 sm:p-5 md:flex-row md:items-center md:gap-5">

        <div className="flex size-[88px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-base)] shadow-sm sm:size-[105px]">
          {team.team_logo_url ? (
            <img
              src={team.team_logo_url}
              alt={`${team.team_name} logo`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-['Rajdhani'] text-3xl font-bold text-[var(--accent-gold)]">
              {team.team_tag || team.team_name?.charAt(0)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">

          {/* Status + Tag */}
          <div className="mb-2 flex min-w-0 items-center gap-2 overflow-hidden">

            <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-600">
              <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
              Active
            </span>

            <span className="h-3 w-px shrink-0 bg-[var(--border-default)]" />

            <span className="shrink-0 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              #{team.team_tag}
            </span>

            <span className="h-3 w-px shrink-0 bg-[var(--border-default)]" />

            <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              <Globe2 size={10} />
              {team.team_visibility}
            </span>
          </div>

          {/* Team Name */}
          <h1 className="truncate font-['Rajdhani'] text-3xl font-bold uppercase leading-none tracking-tight sm:text-4xl">
            {team.team_name}
          </h1>

          {/* Bio */}
          {team.team_bio && (
            <p className="mt-2 line-clamp-2 max-w-[560px] text-xs leading-5 text-[var(--text-secondary)]">
              {team.team_bio}
            </p>
          )}


          <div className="mt-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max gap-2">

              <TeamMeta
                label="Captain"
                value={captain?.player_name || "Not assigned"}
              />

              <TeamMeta
                label="Country"
                value={team.team_country}
              />

              <TeamMeta
                label="Members"
                value={`${memberCount} / ${maxMembers}`}
              />

              <TeamMeta
                label="Created"
                value={createdDate}
              />
            </div>
          </div>
        </div>


        <div className="flex shrink-0 gap-2 md:self-start">

          <button
            type="button"
            className="h-9 whitespace-nowrap rounded-lg bg-[var(--accent-gold)] px-4 text-[10px] font-bold uppercase tracking-[0.08em] text-white transition-transform hover:-translate-y-px"
          >
            Edit Team
          </button>

          <button
            type="button"
            className="h-9 whitespace-nowrap rounded-lg border border-[var(--border-default)] bg-[var(--surface-base)]/70 px-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-primary)] backdrop-blur-xl transition-transform hover:-translate-y-px"
          >
            Manage Team
          </button>
        </div>
      </div>
    </header>
  );
}



function TeamMeta({ label, value }) {
  if (!value) return null;

  return (
    <div className="shrink-0 rounded-lg border border-white/70 bg-[var(--surface-base)]/65 px-3 py-2 backdrop-blur-xl">

      <p className="whitespace-nowrap text-[7px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-0.5 max-w-[150px] truncate whitespace-nowrap text-[10px] font-semibold text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}