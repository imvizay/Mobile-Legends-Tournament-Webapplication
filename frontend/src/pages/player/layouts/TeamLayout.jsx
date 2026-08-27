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
      <section className="flex min-h-screen items-center justify-center bg-[var(--surface-base)]">
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
    <section className="min-h-screen bg-[var(--surface-base)] text-[var(--text-primary)]">
      <div className="mx-auto w-full max-w-[1480px] px-3 py-3 sm:px-4 lg:px-6">
        <button type="button" onClick={() => navigate("/player", { replace: true })} className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)] transition-transform hover:-translate-y-px hover:text-[var(--text-primary)]">
          <ArrowLeft size={13} strokeWidth={1.8} />
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

        <main className="pt-5 sm:pt-6">
          <Outlet context={{ team }} />
        </main>
      </div>
    </section>
  );
}

function TeamHeader({ team, captain, memberCount, maxMembers, createdDate }) {
  const rosterPercent = maxMembers > 0 ? Math.min((memberCount / maxMembers) * 100, 100) : 0;

  return (
    <header className="relative isolate overflow-hidden rounded-[20px] border border-[var(--border-default)]">
      {team.team_banner_url ? (
        <img src={team.team_banner_url} alt="" aria-hidden="true" className="absolute inset-0 -z-30 h-full w-full object-cover object-center opacity-[0.36] saturate-[0.7]" />
      ) : (
        <div className="absolute inset-0 -z-30" style={{ background: "radial-gradient(circle at 75% 20%, color-mix(in srgb, var(--accent-gold) 10%, transparent), var(--surface-elevated) 55%)" }} />
      )}

      {/* <div className="absolute inset-0 -z-20" style={{ background: "linear-gradient(90deg, var(--surface-elevated) 0%, color-mix(in srgb, var(--surface-elevated) 88%, transparent) 42%, color-mix(in srgb, var(--surface-elevated) 45%, transparent) 100%)" }} /> */}
      <div className="absolute inset-0 -z-20" style={{ background: "linear-gradient(180deg, color-mix(in srgb, var(--surface-elevated) 12%, transparent), color-mix(in srgb, var(--surface-elevated) 90%, transparent) 100%)" }} />

      <div className="relative px-4 py-3.5 sm:px-5 sm:py-4 lg:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3.5 sm:gap-4">
            <div className="relative size-[58px] shrink-0 sm:size-[68px]">
              <div className="absolute -inset-1 rounded-[17px] opacity-20" style={{ background: "var(--accent-gold)" }} />

              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[15px] border border-[var(--border-default)] bg-[var(--surface-base)] p-1">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[11px]" style={{ background: "var(--surface-elevated)" }}>
                  {team.team_logo_url ? (
                    <img src={team.team_logo_url} alt={`${team.team_name} logo`} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xl font-black uppercase text-[var(--accent-gold)]">
                      {team.team_tag || team.team_name?.charAt(0)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-1.5">
                <span className="flex items-center gap-1 text-[7px] font-bold uppercase tracking-[0.17em] text-emerald-500">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  ACTIVE
                </span>

                <span className="h-3 w-px bg-[var(--border-default)]" />

                {team.team_tag && (
                  <>
                    <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                      #{team.team_tag}
                    </span>
                    <span className="h-3 w-px bg-[var(--border-default)]" />
                  </>
                )}

                <span className="flex items-center gap-1 text-[7px] font-bold uppercase tracking-[0.13em] text-[var(--text-muted)]">
                  <Globe2 size={9} />
                  {team.team_visibility || "PUBLIC"}
                </span>
              </div>

              <h1 className="truncate text-[28px] font-black uppercase leading-none tracking-[-0.045em] sm:text-4xl lg:text-[40px]" style={{ fontFamily: "Google Sans" }}>
                {team.team_name}
              </h1>

              {team.team_bio && (
                <p className="mt-1.5 line-clamp-1 max-w-[580px] text-[10px] leading-4 text-[var(--text-secondary)] sm:text-[11px]">
                  {team.team_bio}
                </p>
              )}
            </div>
          </div>

          <div className="w-full shrink-0 lg:w-[200px]">
            <div className="mb-1.5 flex items-end justify-between">
              <div>
                <p className="text-[7px] font-bold uppercase tracking-[0.17em] text-[var(--text-muted)]">
                  ACTIVE ROSTER
                </p>

                <p className="mt-0.5 text-[22px] font-black leading-none tracking-tight">
                  {memberCount}
                  <span className="ml-1 text-[11px] font-medium text-[var(--text-muted)]">
                    / {maxMembers}
                  </span>
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

        <div className="mt-4 grid grid-cols-2 gap-y-2.5 border-t border-[var(--border-default)] pt-3 sm:grid-cols-4 sm:gap-y-0">
          <TeamMeta icon={<Crown size={11} />} label="CAPTAIN" value={captain?.player_name || "NOT ASSIGNED"} />
          <TeamMeta icon={<Globe2 size={11} />} label="COUNTRY" value={team.team_country || "NOT SET"} />
          <TeamMeta icon={<Users size={11} />} label="MEMBERS" value={`${memberCount} / ${maxMembers}`} />
          <TeamMeta icon={<CalendarDays size={11} />} label="ESTABLISHED" value={createdDate || "NOT SET"} />
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