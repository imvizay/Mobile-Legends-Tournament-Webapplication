import React from "react";
import { BadgeCheck, CalendarDays, Crown, Globe2, LockKeyhole, Pencil, Server, ShieldCheck, Users, UsersRound } from "lucide-react";

export default function TeamProfile({ team, onEdit }) {
  if (!team) return null;

  const currentMembers = Number(team.team_current_members ?? 0);
  const maxMembers = Number(team.team_max_members ?? 0);
  const rosterPercentage = maxMembers > 0 ? Math.min((currentMembers / maxMembers) * 100, 100) : 0;
  const isPrivate = Boolean(team.team_is_private);
  const isFull = maxMembers > 0 && currentMembers >= maxMembers;

  return (
    <section className="relative isolate overflow-hidden rounded-[30px] border" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>
      <div className="absolute inset-0 -z-30 bg-[#080808]">
        {team.team_banner_url ? <img src={team.team_banner_url} alt="" className="h-full w-full object-cover object-center opacity-[0.38] saturate-[0.7]" /> : <div className="h-full w-full" style={{ background: "radial-gradient(circle at 75% 20%, color-mix(in srgb, var(--accent-gold) 12%, transparent), #080808 58%)" }} />}
      </div>

      <div className="absolute inset-0 -z-20" style={{ background: "linear-gradient(90deg, rgba(5,5,5,.98) 0%, rgba(5,5,5,.88) 38%, rgba(5,5,5,.5) 72%, rgba(5,5,5,.78) 100%)" }} />
      <div className="absolute inset-0 -z-20" style={{ background: "linear-gradient(180deg, rgba(5,5,5,.15) 0%, rgba(5,5,5,.25) 48%, rgba(5,5,5,.96) 100%)" }} />
      <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(circle at 72% 15%, color-mix(in srgb, var(--accent-gold) 8%, transparent), transparent 28%)" }} />

      <div className="relative flex items-center justify-between border-b px-5 py-4 sm:px-7" style={{ borderColor: "color-mix(in srgb, var(--border-default) 55%, transparent)" }}>
        <div className="flex items-center gap-2.5">
          <span className="size-1.5 rounded-full" style={{ background: "var(--accent-gold)" }} />
          <span className="text-[9px] font-bold uppercase tracking-[0.24em]" style={{ color: "var(--text-muted)" }}>TEAM PROFILE</span>
        </div>

        {onEdit && (
          <button type="button" onClick={onEdit} aria-label="Edit team profile" className="flex size-8 items-center justify-center rounded-full border transition-transform hover:-translate-y-px" style={{ color: "var(--text-secondary)", background: "rgba(255,255,255,.04)", borderColor: "var(--border-subtle)" }}>
            <Pencil size={13} strokeWidth={2} />
          </button>
        )}
      </div>

      <div className="relative px-5 pb-6 pt-7 sm:px-7 sm:pb-8 sm:pt-9">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-5">
              <div className="relative size-[82px] shrink-0 sm:size-[104px]">
                <div className="absolute -inset-1 rounded-[25px] opacity-40" style={{ background: "var(--accent-gold)" }} />
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[22px] border p-1.5" style={{ background: "#0b0b0b", borderColor: "color-mix(in srgb, var(--accent-gold) 35%, var(--border-default))" }}>
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[17px]" style={{ background: "var(--surface-elevated)" }}>
                    {team.team_logo_url ? <img src={team.team_logo_url} alt={team.team_name ? `${team.team_name} logo` : "Team logo"} className="h-full w-full object-cover" /> : <UsersRound size={30} style={{ color: "var(--text-muted)" }} />}
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--accent-gold)" }}>ESPORTS TEAM</span>
                  <span className="size-1 rounded-full" style={{ background: "var(--text-muted)" }} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>{isPrivate ? "PRIVATE" : "PUBLIC"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <h1 className="max-w-full break-words text-3xl font-black uppercase leading-none tracking-[-0.045em] sm:text-5xl lg:text-[54px]" style={{ color: "var(--text-primary)", fontFamily: "Google Sans" }}>
                    {team.team_name || "UNNAMED TEAM"}
                  </h1>
                  <BadgeCheck className="mt-1 shrink-0" size={20} fill="var(--accent-gold)" color="var(--accent-gold)" />
                </div>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  {team.team_server && <TeamMeta icon={<Server size={12} />} value={team.team_server} />}
                  {team.team_country && <TeamMeta icon={<Globe2 size={12} />} value={team.team_country} />}
                  <TeamMeta icon={isPrivate ? <LockKeyhole size={12} /> : <Globe2 size={12} />} value={isPrivate ? "PRIVATE TEAM" : "PUBLIC TEAM"} />
                </div>
              </div>
            </div>

            {team.team_bio && <p className="mt-6 max-w-2xl text-[13px] leading-6 sm:text-sm" style={{ color: "var(--text-secondary)" }}>{team.team_bio}</p>}
          </div>

          <div className="w-full shrink-0 lg:w-[260px]">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>ACTIVE ROSTER</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-4xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>{currentMembers}</span>
                  <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>/ {maxMembers || "—"}</span>
                </div>
              </div>

              <Users size={18} style={{ color: "var(--accent-gold)" }} />
            </div>

            <div className="mt-4 h-[3px] overflow-hidden rounded-full" style={{ background: "var(--border-subtle)" }}>
              <div className="h-full rounded-full" style={{ width: `${rosterPercentage}%`, background: "var(--accent-gold)" }} />
            </div>

            <div className="mt-2 flex justify-between text-[8px] font-bold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
              <span>{isFull ? "ROSTER COMPLETE" : "ROSTER CAPACITY"}</span>
              <span>{maxMembers > 0 ? `${Math.round(rosterPercentage)}%` : "—"}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-5" style={{ borderColor: "color-mix(in srgb, var(--border-default) 55%, transparent)" }}>
          <div className="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:gap-0">
            <TeamInfoItem icon={<Crown size={13} />} label="CAPTAIN" value={team.team_captain || "NOT ASSIGNED"} />
            <TeamInfoItem icon={<Server size={13} />} label="SERVER" value={team.team_server || "NOT SET"} />
            <TeamInfoItem icon={<Globe2 size={13} />} label="REGION" value={team.team_country || "NOT SET"} />
            <TeamInfoItem icon={<CalendarDays size={13} />} label="ESTABLISHED" value={formatDate(team.team_created_at)} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4" style={{ borderColor: "color-mix(in srgb, var(--border-default) 45%, transparent)" }}>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} style={{ color: "var(--accent-gold)" }} />
            <span className="text-[9px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>ROSTER PROTECTED</span>
          </div>

          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: isFull ? "var(--text-muted)" : "var(--accent-gold)" }}>
            <span className="size-1.5 rounded-full" style={{ background: isFull ? "var(--text-muted)" : "var(--accent-gold)" }} />
            {isFull ? "ROSTER COMPLETE" : "RECRUITING"}
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamMeta({ icon, value }) {
  return (
    <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] sm:text-[10px]" style={{ color: "var(--text-muted)" }}>
      <span style={{ color: "var(--accent-gold)" }}>{icon}</span>
      {value}
    </span>
  );
}

function TeamInfoItem({ icon, label, value }) {
  return (
    <div className="min-w-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0" style={{ borderColor: "var(--border-subtle)" }}>
      <div className="flex items-center gap-2">
        <span style={{ color: "var(--accent-gold)" }}>{icon}</span>
        <span className="text-[8px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>{label}</span>
      </div>
      <p className="mt-2 truncate text-xs font-bold uppercase sm:text-sm" style={{ color: "var(--text-primary)" }}>{value}</p>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "NOT SET";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "NOT SET";

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  }).toUpperCase();
}