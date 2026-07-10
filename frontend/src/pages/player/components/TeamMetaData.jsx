import {
  Users,
  Calendar,
  MapPin,
  Pencil,
  BadgeCheck,
} from "lucide-react";

export default function TeamMetaData({team}) {
    console.log("TEAM DATA",team)
  return (
    <section className="relative h-[150px] overflow-hidden rounded-3xl border bg-white shadow-sm">

        {/* Banner */}
        <img
          src={team.team_banner_url}
          alt="banner_image"
          className="absolute inset-0 h-full w-full object-cover object-[center_20%]"/>

        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />


        {/* Edit button */}
        <button
          className="absolute top-4 right-4 z-20 rounded-xl border bg-white/80 backdrop-blur-md p-2 shadow-lg transition hover:scale-105 ">
          <Pencil size={12} />
        </button>

        {/* Content */}
        <div className="relative z-10 flex h-full items-end gap-5 px-6 pb-5">

          {/* Logo */}
          <div
            className="
              mb-1
              h-24 w-24
              shrink-0
              overflow-hidden
              rounded-2xl
              border-4
              border-white
              bg-white
              shadow-lg
            "
          >
            <img
              src={team.team_logo_url}
              alt="logo_image"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Right Side */}
          <div className="flex-1">

            <div className="flex items-center gap-2">

              <h1 className="text-3xl font-bold tracking-tight">
                {team.team_name || ""}
              </h1>

              <BadgeCheck
                size={16}
                className="text-sky-500"
              />

            </div>

            <p className="mt-1 max-w-xl text-sm leading-6 text-zinc-600">
              {team.team_bio || ""}
            </p>

            <div className="mt-3 flex gap-6 text-sm text-zinc-600">

              <div className="flex items-center gap-2">
                <Users size={15} />
                <span>{team.team_max_members || 0}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={15} />
                <span>{team.team_created_at.split("T")[0]}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={15} />
                <span>{team.team_country || "India"}</span>
              </div>

            </div>

          </div>

        </div>

    </section>
  )
}