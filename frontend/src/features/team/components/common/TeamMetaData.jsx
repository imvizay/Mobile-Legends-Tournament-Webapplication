import {
  Users,
  CalendarDays,
  MapPin,
  Pencil,
  BadgeCheck,
} from "lucide-react";

export default function TeamMetaData({ team }) {
  return (
    <section
      className="group relative isolate overflow-hidden rounded-3xl border"
      style={{
        background: "var(--surface-base)",
        borderColor: "var(--border-default)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Banner */}
      <img
        src={team.team_banner_url}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center transition duration-700 group-hover:scale-[1.02]"
      />

      {/* Atmospheric overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/[.92] via-black/[.68] to-black/[.18] dark:from-black/[.94] dark:via-black/[.72] dark:to-black/[.20]" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/[.72] via-transparent to-black/[.08]" />

      {/* Accent glow */}
      <div
        className="absolute -left-16 -top-20 h-56 w-56 rounded-full blur-3xl opacity-20"
        style={{
          background: "var(--accent-gold)",
        }}
      />

      {/* Edit button */}
      <button
        type="button"
        className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-xl border backdrop-blur-xl transition duration-200 hover:scale-105 active:scale-95"
        style={{
          background: "var(--glass-surface)",
          borderColor: "var(--glass-border)",
        }}
      >
        <Pencil
          size={15}
          strokeWidth={2}
          color="var(--text-primary)"
        />
      </button>

      {/* Main content */}
      <div className="relative z-10 flex min-h-[250px] flex-col justify-between p-4 sm:p-6 lg:p-7">
        
        {/* Team identity */}
        <div className="flex items-start gap-4 pr-12 sm:gap-5">
          
          {/* Logo */}
          <div
            className="relative h-[76px] w-[76px] shrink-0 rounded-2xl p-[2px] sm:h-24 sm:w-24 sm:rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, var(--accent-gold), var(--surface-base))",
              boxShadow: "0 12px 35px rgba(0,0,0,.28)",
            }}
          >
            <div
              className="h-full w-full overflow-hidden rounded-[14px] sm:rounded-[22px]"
              style={{
                background: "var(--surface-base)",
              }}
            >
              <img
                src={team.team_logo_url}
                alt={team.team_name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Team information */}
          <div className="min-w-0 pt-1">
            
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1
                className="truncate text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl"
                style={{
                  fontFamily: "Google Sans",
                }}
              >
                {team.team_name}
              </h1>

              <BadgeCheck
                size={20}
                fill="var(--accent-gold)"
                color="var(--accent-gold)"
                className="shrink-0"
              />
            </div>

            {team.team_bio && (
              <p className="line-clamp-2 max-w-2xl text-xs leading-5 text-white/65 sm:text-sm">
                {team.team_bio}
              </p>
            )}
          </div>
        </div>

        {/* Bottom metadata */}
        <div className="mt-8">
          <div
            className="inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-2xl border p-1.5 backdrop-blur-xl"
            style={{
              background: "rgba(0,0,0,.25)",
              borderColor: "rgba(255,255,255,.12)",
            }}
          >
            <InfoPill
              icon={<Users size={14} />}
              value={`${team.team_max_members} Players`}
            />

            <InfoPill
              icon={<CalendarDays size={14} />}
              value={formatDate(team.team_created_at)}
            />

            <InfoPill
              icon={<MapPin size={14} />}
              value={team.team_country}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoPill({ icon, value }) {
  return (
    <div className="flex items-center gap-2 rounded-xl px-3 py-2">
      <span
        className="shrink-0"
        style={{
          color: "var(--accent-gold)",
        }}
      >
        {icon}
      </span>

      <span className="whitespace-nowrap text-xs font-medium text-white/75 sm:text-sm">
        {value}
      </span>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}