import React, { useMemo } from "react";
import {Crown, ArrowLeft, LayoutDashboard, Trophy, Swords, Users, Wallet, History, Settings, Globe2, CalendarDays, ShieldCheck, Pencil, ChevronRight } from "lucide-react";
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";

const teamNavigation = [
  { label: "Overview", path: "", icon: LayoutDashboard },
  { label: "Tournaments", path: "tournaments", icon: Trophy },
  { label: "Matches", path: "matches", icon: Swords },
  { label: "Members", path: "members", icon: Users },
  { label: "History", path: "history", icon: History },
  { label: "Settings", path: "settings", icon: Settings },
];

export default function TeamLayout() {
  const { team } = useOutletContext();
  const navigate = useNavigate();
  const location = useLocation();

  const captain = useMemo(
    () => team?.team_members?.find((member) => member.player_role?.toLowerCase() === "captain"),
    [team?.team_members]
  );

  const memberCount = team?.team_members?.length ?? 0;
  const maxMembers = team?.team_max_members ?? 7;

  const createdDate = useMemo(() => {
    if (!team?.team_created_at) return null;
    return new Date(team.team_created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
  }, [team?.team_created_at]);

  const isActive = (path) => {
    const basePath = "/player/team";
    if (!path) return location.pathname === basePath;
    return location.pathname.startsWith(`${basePath}/${path}`);
  };

  if (!team) {
    return (
      <section className="border rounded-2xl flex min-h-screen items-center justify-center bg-[var(--surface-base)]">
        <div className="text-center">
          <p className="text-sm font-semibold text-[var(--text-primary)]">TEAM NOT FOUND</p>
          <button type="button" onClick={() => navigate("/player/team")} className="mt-2 text-xs font-medium text-[var(--accent-gold)]">
            BACK TO TEAMS
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen border-none rounded-2xl bg-[var(--surface-base)] text-[var(--text-primary)]">
      <div className=" mx-auto w-full max-w-[1480px] px-3 py-3 sm:px-4 lg:px-6">

        <button type="button" onClick={() => navigate("/player", { replace: true })} className="mb-3 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] transition-transform hover:-translate-y-px hover:text-[var(--text-primary)]">
          <ArrowLeft size={13} strokeWidth={2} />
          BACK TO PLAYER
        </button>

        <TeamHeader team={team} captain={captain} memberCount={memberCount} maxMembers={maxMembers} createdDate={createdDate} />

        <nav className="mt-4 border-b border-[var(--border-default)]">
          <div className="flex min-w-max items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {teamNavigation.map(({ label, path, icon: Icon }) => {
              const active = isActive(path);

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => navigate(path ? `/player/team/${path}` : "/player/team")}
                  className={`relative flex h-11 shrink-0 items-center gap-2 px-3 text-[9px] font-bold uppercase tracking-[0.13em] transition-transform hover:-translate-y-px ${active ? "text-[var(--accent-gold)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
                >
                  <Icon size={13} strokeWidth={1.8} />
                  {label}
                  {active && <span className="absolute inset-x-2 bottom-[-1px] h-[2px] rounded-full bg-[var(--accent-gold)]" />}
                </button>
              );
            })}
          </div>
        </nav>

        <main className="pt-2 sm:pt-3">
          <Outlet context={{ team }} />
        </main>
      </div>
    </section>
  );
}

function TeamHeader({ team, captain, memberCount, maxMembers, createdDate }) {
  const rosterPercent = maxMembers > 0 ? Math.min((memberCount / maxMembers) * 100, 100) : 0;

  return (
    <header className="relative isolate overflow-hidden rounded-[16px] border border-[var(--border-default)] sm:rounded-[20px]">
      {team.team_banner_url ? (
        <img src={team.team_banner_url} alt="" aria-hidden="true" className="absolute inset-0 -z-30 h-full w-full object-cover object-center opacity-[0.30] saturate-[0.65] sm:opacity-[0.36]" />
      ) : (
        <div className="absolute inset-0 -z-30" style={{ background: "radial-gradient(circle at 75% 20%, color-mix(in srgb, var(--accent-gold) 10%, transparent), var(--surface-elevated) 55%)" }} />
      )}

      <div className="absolute inset-0 -z-20" style={{ background: "linear-gradient(180deg, color-mix(in srgb, var(--surface-elevated) 18%, transparent), color-mix(in srgb, var(--surface-elevated) 88%, transparent) 100%)" }} />

      <div className="relative px-3 py-3 sm:px-5 sm:py-4 lg:px-6">

        {/* Main identity */}

        <div className="flex items-center gap-2.5 sm:gap-4">

          <div className="relative size-[48px] shrink-0 sm:size-[68px]">
            <div className="absolute -inset-1 rounded-[15px] opacity-20" style={{ background: "var(--accent-gold)" }} />

            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[13px] border border-[var(--border-default)] bg-[var(--surface-base)] p-1 sm:rounded-[15px]">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[9px] sm:rounded-[11px]" style={{ background: "var(--surface-elevated)" }}>
                {team.team_logo_url ? (
                  <img src={team.team_logo_url} alt={`${team.team_name} logo`} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-base font-black uppercase text-[var(--accent-gold)] sm:text-xl">
                    {team.team_tag || team.team_name?.charAt(0)}
                  </span>
                )}
              </div>
            </div>
          </div>


          <div className="min-w-0 flex-1">

            {/* Status */}

            <div className="flex min-w-0 items-center gap-1.5">
              <span className="flex items-center gap-1 text-[6px] font-bold uppercase tracking-[0.15em] text-emerald-500 sm:text-[7px]">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                ACTIVE
              </span>

              <span className="h-3 w-px bg-[var(--border-default)]" />

              {team.team_tag && (
                <>
                  <span className="text-[6px] font-bold uppercase tracking-[0.13em] text-[var(--text-muted)] sm:text-[7px]">
                    #{team.team_tag}
                  </span>

                  <span className="h-3 w-px bg-[var(--border-default)]" />
                </>
              )}

              <span className="flex items-center gap-1 text-[6px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] sm:text-[7px]">
                <Globe2 size={8} />
                {team.team_visibility || "PUBLIC"}
              </span>
            </div>


            {/* Team name */}

            <h1 className="mt-1 truncate text-[22px] font-black uppercase leading-none tracking-[-0.04em] sm:text-4xl lg:text-[40px]" style={{ fontFamily: "Google Sans" }}>
              {team.team_name}
            </h1>


            {/* Bio */}

            {team.team_bio && (
              <p className="mt-1 truncate text-[8px] leading-3.5 text-[var(--text-secondary)] sm:mt-1.5 sm:line-clamp-1 sm:max-w-[580px] sm:text-[11px] sm:leading-4">
                {team.team_bio}
              </p>
            )}

          </div>


          {/* Desktop roster */}

          <div className="hidden w-[200px] shrink-0 lg:block">

            <div className="mb-1.5 flex items-end justify-between">
              <div>
                <p className="text-[7px] font-bold uppercase tracking-[0.17em] text-[var(--text-muted)]">
                  ACTIVE ROSTER
                </p>

                <p className="mt-0.5 text-[22px] font-black leading-none tracking-tight">
                  {memberCount}
                  <span className="ml-1 text-[11px] font-medium text-[var(--text-muted)]">/ {maxMembers}</span>
                </p>
              </div>

              <Users size={14} style={{ color: "var(--accent-gold)" }} />
            </div>

            <div className="h-[2px] overflow-hidden rounded-full bg-[var(--border-default)]">
              <div className="h-full rounded-full" style={{ width: `${rosterPercent}%`, background: "var(--accent-gold)" }} />
            </div>

            <div className="mt-1 flex justify-between text-[7px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              <span>{memberCount >= maxMembers ? "ROSTER COMPLETE" : "ROSTER CAPACITY"}</span>
              <span>{Math.round(rosterPercent)}%</span>
            </div>

          </div>

        </div>


        {/* Mobile roster */}

        <div className="mt-2.5 border-t border-[var(--border-default)] pt-2.5 lg:hidden">

          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-2">
              <Users size={12} style={{ color: "var(--accent-gold)" }} />

              <div className="flex items-baseline gap-1">
                <span className="text-[15px] font-black leading-none">
                  {memberCount}
                </span>

                <span className="text-[8px] font-medium text-[var(--text-muted)]">
                  / {maxMembers} members
                </span>
              </div>

            </div>

            <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              {Math.round(rosterPercent)}% capacity
            </span>

          </div>

          <div className="mt-1.5 h-[2px] overflow-hidden rounded-full bg-[var(--border-default)]">
            <div className="h-full rounded-full" style={{ width: `${rosterPercent}%`, background: "var(--accent-gold)" }} />
          </div>

        </div>


        {/* Metadata */}

        <div className="mt-3 grid grid-cols-4 border-t border-[var(--border-default)] pt-2.5 sm:mt-4 sm:pt-3">

          <TeamMeta icon={<Crown size={10} />} label="CAPTAIN" value={captain?.player_name || "NOT ASSIGNED"} />

          <TeamMeta icon={<Users size={10} />} label="MEMBERS" value={`${memberCount} / ${maxMembers}`} />

          <TeamMeta icon={<Globe2 size={10} />} label="COUNTRY" value={team.team_country || "NOT SET"} />

          <TeamMeta icon={<CalendarDays size={10} />} label="JOINED" value={createdDate || "NOT SET"} />

        </div>

      </div>
    </header>
  );
}

function TeamMeta({ icon, label, value }) {
  return (
    <div className="min-w-0 border-r border-[var(--border-default)] px-3 first:pl-0 last:border-r-0 sm:px-4">
      <div className="flex items-center gap-1.5">
        <span style={{ color: "var(--accent-gold)" }}>{icon}</span>
        <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">{label}</span>
      </div>

      <p className="mt-1.5 truncate text-[9px] font-bold uppercase text-[var(--text-primary)] sm:text-[10px]">
        {value}
      </p>
    </div>
  );
}