import { Users, MapPin, CalendarDays, ArrowRight } from "lucide-react";
import { useState } from "react";

function DiscoverTeamCard({ team }) {
  const [loaded,setLoaded] = useState(false)
  const joinedDate = new Date(team.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <article
      className="group flex flex-col gap-4 rounded-2xl border p-3 md:flex-row md:items-center md:gap-5"
      style={{
        background: "var(--surface-base)",
        borderColor: "var(--border-default)",
      }}
    >
  
      <div className="relative h-40 w-full overflow-hidden rounded-xl md:h-24 md:w-44 md:shrink-0">
        <img 
        src={team.banner_url} 
        onLoad={()=>setLoaded(true)}
        alt={team.name} 
        className={`h-full w-full object-cover ${loaded ? "opacity-100" : "opacity-0"} `} />

        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />

        <span className="absolute left-3 top-2 text-3xl font-black tracking-widest text-white/15">
          {team.tag}
        </span>

        <div className="absolute bottom-3 right-3 rounded-xl border border-white/20 bg-white/10 p-1.5 backdrop-blur-md">
          <img src={team.logo_url} 
          onLoad={()=>setLoaded(true)} alt={team.name} 
          className={`h-12 w-12 rounded-lg object-cover ${loaded ? "opacity-100" : "opacity-0"}`} />
          
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-lg font-semibold" style={{ color: "var(--headline-primary)" }}>
          {team.name}
        </h2>

        <p className="mt-1 line-clamp-2 text-sm md:line-clamp-1" style={{ color: "var(--text-secondary)" }}>
          {team.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]" style={{ color: "var(--text-muted)" }}>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} />
            {team.country}
          </span>

          <span className="flex items-center gap-1.5">
            <Users size={14} />
            {team.members_count ?? 0}/{team.max_members}
          </span>

          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} />
            Since {joinedDate}
          </span>
        </div>
      </div>

      <div className="flex w-full gap-2 md:w-auto md:shrink-0">
        <button
          className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition hover:opacity-80 md:flex-none"
          style={{
            background: "var(--action-secondary-bg)",
            borderColor: "var(--border-default)",
            color: "var(--text-primary)",
          }}
        >
          View
        </button>

        <button
          className="group flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all hover:gap-3 md:flex-none"
          style={{
            background: "var(--action-primary-bg)",
            color: "var(--action-primary-text)",
          }}
        >
          Request
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </article>
  );
}

export default DiscoverTeamCard;