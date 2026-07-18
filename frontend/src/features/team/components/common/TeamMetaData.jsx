import { Users, Calendar, MapPin, Pencil, BadgeCheck, } from "lucide-react";

export default function TeamMetaData({ team }) {
  
  return (
    <section
      className="relative overflow-hidden rounded-3xl border"
      style={{
        background: "var(--surface-base)",
        borderColor: "var(--border-default)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Banner */}

      <img
        src={team.team_banner_url}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Overlay */}

      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(246,244,241,.94)] via-[rgba(246,244,241,.72)] to-[rgba(246,244,241,.18)] dark:from-[rgba(5,5,5,.92)] dark:via-[rgba(5,5,5,.70)] dark:to-[rgba(5,5,5,.15)]" />

      {/* Edit */}

      <button
        className="absolute right-4 top-4 z-20 rounded-xl border p-2 backdrop-blur-md transition hover:scale-105"
        style={{
          background: "var(--glass-surface)",
          borderColor: "var(--glass-border)",
        }}
      >
        <Pencil
          size={16}
          color="var(--text-primary)"
        />
      </button>

      {/* Content */}

      <div
        className=" relative z-10 flex items-center gap-4 p-4 sm:p-5 lg:gap-6 lg:p-6 " >
        {/* Logo */}

        <div
          className=" h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 sm:h-24 sm:w-24 "
          style={{
            borderColor: "var(--surface-base)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <img
            src={team.team_logo_url}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        {/* Team Info */}

        <div className="min-w-0 flex-1">

          {/* Title */}

          <div className="flex flex-wrap items-center gap-2">

            <h1
              className=" truncate text-xl font-bold sm:text-2xl lg:text-3xl "
              style={{
                color: "var(--headline-primary)",
                fontFamily: "Google Sans",
              }}
            >
              {team.team_name}
            </h1>

            <BadgeCheck
              size={18}
              color="var(--accent-gold)"
            />

          </div>

          {/* Bio */}

          {team.team_bio && (
            <p
              className=" mt-2 line-clamp-2 text-xs leading-5 sm:text-sm "
              style={{
                color: "var(--text-secondary)",
              }}
            >
              {team.team_bio}
            </p>
          )}

          {/* Stats */}

          <div
            className=" mt-4 flex flex-wrap gap-2 sm:gap-3 lg:gap-4 " >
            <InfoPill
              icon={<Users size={14} />}
              value={`${team.team_max_members} Players`}
            />

            <InfoPill
              icon={<Calendar size={14} />}
              value={team.team_created_at.split("T")[0]}
            />

            <InfoPill
              icon={<MapPin size={14} />}
              value={team.team_country}
            />
          </div>

        </div>

      </div>
    </section>
  )
}


function InfoPill({ icon, value }) {
  return (
    <div
      className=" flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm "
      style={{
        background: "var(--glass-surface)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(14px)",
      }}
    >
      <span
        style={{
          color: "var(--accent-gold)",
        }}
      >
        {icon}
      </span>

      <span
        style={{
          color: "var(--text-secondary)",
        }}
      >
        {value}
      </span>
    </div>
  )
}