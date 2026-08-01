import React from "react";
import { CalendarDays, ChevronRight, CircleCheck, Globe2, IndianRupee, Trophy, ArrowRight, Users, Swords } from "lucide-react";
import RegistrationNotice from "./RegistrationNotice";

const dummyTournament = {
  id: 1,
  tournament_name: "Mobile Legends Champions Cup",
  background_image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1800&q=85",
  team_format: "5V5",
  tournament_type: "Single Elimination",
  joined_teams: 12,
  total_teams: 20,
  prize_pool: 50000,
  entry_fee: 500,
  country: "India",
  tournament_date: "Sep 18, 2026",
  registration_status: "Payment Required",
};

export default function RegisteredTournament() {
  return (
    <section className="w-full">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-[-0.02em]" style={{ color: "var(--headline-primary)" }}>
            Registered Tournament
          </h2>
        </div>

        <span className="hidden text-[9px] font-semibold uppercase tracking-[0.14em] sm:block" style={{ color: "var(--text-muted)" }}>
          1 Active Registration
        </span>
      </div>

      <div className="w-full">
        <TournamentCard tournament={dummyTournament} />
        <RegistrationNotice />
      </div>
    </section>
  );
}

function TournamentCard({ tournament }) {
  const registeredTeams = Number(tournament.joined_teams ?? 0);
  const totalTeams = Number(tournament.total_teams ?? 0);
  const percentage = totalTeams > 0 ? Math.min((registeredTeams / totalTeams) * 100, 100) : 0;

  return (
    <article className="relative isolate min-h-[300px] overflow-hidden rounded-[20px] border" style={{ borderColor: "var(--border-default)" }}>
      {tournament.background_image ? (
        <img src={tournament.background_image} alt="" aria-hidden="true" className="absolute inset-0 -z-30 h-full w-full object-cover object-center opacity-[0.3] saturate-[0.65]" />
      ) : (
        <div className="absolute inset-0 -z-30" style={{ background: "radial-gradient(circle at 78% 20%, color-mix(in srgb, var(--accent-gold) 9%, transparent), #090909 60%)" }} />
      )}

      <div className="absolute inset-0 -z-20" style={{ background: "linear-gradient(90deg, rgba(7,7,7,.98) 0%, rgba(7,7,7,.88) 42%, rgba(7,7,7,.5) 100%)" }} />
      <div className="absolute inset-0 -z-20" style={{ background: "linear-gradient(180deg, rgba(7,7,7,.2) 0%, rgba(7,7,7,.35) 48%, rgba(7,7,7,.96) 100%)" }} />
      <div className="absolute inset-0 -z-10" style={{ background: "radial-gradient(circle at 76% 15%, color-mix(in srgb, var(--accent-gold) 7%, transparent), transparent 30%)" }} />

      <div className="relative flex min-h-[00px] flex-col justify-between px-4 py-4 sm:px-5 sm:py-5">
        <div>
          <div className="select-none flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--accent-gold)" }}>
                <CircleCheck size={11} />
                {tournament.registration_status}
              </span>

              <span className="h-3 w-px bg-white/15" />

              <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/45">
                REGISTERED EVENT
              </span>
            </div>

            <span className="hidden items-center gap-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-white/45 sm:flex">
              <Globe2 size={10} />
              {tournament.country}
            </span>
          </div>

          <div className="select-none mt-10 sm:mt-12">
            <div className="mb-2 flex items-center gap-1.5 text-white/40">
              <Trophy size={11} />
              <span className="text-[8px] font-bold uppercase tracking-[0.2em]">
                Tournament
              </span>
            </div>

            <h3 className="max-w-[680px] text-[28px] font-black uppercase leading-[0.95] tracking-[-0.04em] text-white sm:text-4xl lg:text-[42px]" style={{ fontFamily: "Google Sans" }}>
              {tournament.tournament_name}
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/50">
              <span className="flex items-center gap-1.5">
                <Users size={10} />
                {tournament.team_format}
              </span>

              <span className="size-1 rounded-full bg-white/20" />

              <span className="flex items-center gap-1.5">
                <Swords size={10} />
                {tournament.tournament_type}
              </span>

              <span className="size-1 rounded-full bg-white/20" />

              <span className="flex items-center gap-1.5">
                <Globe2 size={10} />
                {tournament.country}
              </span>
            </div>
          </div>
        </div>

        <div className="select-none mt-8">
          <div className="grid grid-cols-2 border-y border-white/10 sm:grid-cols-4">
            <TournamentStat icon={<CalendarDays size={12} />} label="DATE" value={tournament.tournament_date} />
            <TournamentStat icon={<Users size={12} />} label="TEAMS" value={`${registeredTeams}/${totalTeams}`} progress={percentage} />
            <TournamentStat icon={<Trophy size={12} />} label="PRIZE POOL" value={`₹${Number(tournament.prize_pool).toLocaleString("en-IN")}`} accent />
            <TournamentStat icon={<IndianRupee size={12} />} label="ENTRY FEE" value={`₹${Number(tournament.entry_fee).toLocaleString("en-IN")}`} />
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full" style={{ background: "var(--accent-gold)" }} />
              <span className="select-none text-[9px] font-medium text-white/45">
                PAYMENT REQUIRED TO CONFIRM PARTICIPATION
              </span>
            </div>

            <div className="flex w-full gap-2 sm:w-auto">
              <button type="button" className=" select-none flex h-8 flex-1 items-center justify-center gap-1.5 border border-white/10 bg-black/20 px-3 text-[9px] font-bold uppercase tracking-[0.08em] text-white/60 transition-transform hover:-translate-y-px hover:text-white sm:flex-none">
                DETAILS
                <ChevronRight size={11} />
              </button>

              <button type="button" className="select-none flex h-8 flex-1 items-center justify-center gap-1.5 px-4 text-[9px] font-bold uppercase tracking-[0.08em] transition-transform hover:-translate-y-px sm:flex-none" style={{ color: "var(--bg-canvas)", background: "var(--accent-gold)" }}>
                PAY ₹{Number(tournament.entry_fee).toLocaleString("en-IN")}
                <ArrowRight size={11} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function TournamentStat({ icon, label, value, accent = false, progress }) {
  return (
    <div className="min-w-0 border-r border-white/10 px-2.5 py-2.5 first:pl-0 last:border-r-0 sm:px-3">
      <div className="flex items-center gap-1.5">
        <span style={{ color: accent ? "var(--accent-gold)" : "rgba(255,255,255,.4)" }}>
          {icon}
        </span>

        <span className="truncate text-[7px] font-bold uppercase tracking-[0.15em] text-white/40">
          {label}
        </span>
      </div>

      <p className="mt-1.5 truncate text-[10px] font-bold uppercase sm:text-[11px]" style={{ color: accent ? "var(--accent-gold)" : "rgba(255,255,255,.85)" }}>
        {value}
      </p>

      {typeof progress === "number" && (
        <div className="mt-1.5 h-[2px] overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "var(--accent-gold)" }} />
        </div>
      )}
    </div>
  );
}