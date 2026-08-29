import React from "react";
import {
  ArrowRight,
  Crown,
  Globe2,
  Lock,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";


const dummyTeam = {
  id: 101,

  name: "Shadow Reapers",
  tag: "SRX",

  description:
    "Competitive Mobile Legends team looking for skilled and committed players to dominate upcoming tournaments.",

  country: "India",
  visibility: "Public",

  logo_url:
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop",

  banner_url:
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=500&fit=crop",

  max_members: 7,
  member_count: 5,

  captain_name: "Arjun",

  team_members: [
    {
      id: 1,
      player_name: "Arjun",
      player_role: "Captain",
      avatar:
        "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 2,
      player_name: "Rohan",
      player_role: "Player",
      avatar:
        "https://i.pravatar.cc/150?img=11",
    },
    {
      id: 3,
      player_name: "Vikram",
      player_role: "Player",
      avatar:
        "https://i.pravatar.cc/150?img=13",
    },
    {
      id: 4,
      player_name: "Karan",
      player_role: "Player",
      avatar:
        "https://i.pravatar.cc/150?img=14",
    },
    {
      id: 5,
      player_name: "Rahul",
      player_role: "Player",
      avatar:
        "https://i.pravatar.cc/150?img=15",
    },
  ],
};

export default function DiscoverTeamCard({
  team,
  onJoin,
  isJoining = false,
  myTeamId,
}) {
  const members = team.team_members ?? [];

  const memberCount =
    team.member_count ??
    team.members_count ??
    members.length;

  const maxMembers =
    team.team_max_members ?? 7;

  const captain =
    team.captain ??
    members.find(
      (member) =>
        member.player_role?.toLowerCase() === "captain" ||
        member.role?.toLowerCase() === "captain"
    );

  const displayedMembers =
    members.slice(0, 4);

  const remainingMembers =
    Math.max(memberCount - displayedMembers.length, 0);

  const availableSlots =
    Math.max(maxMembers - memberCount, 0);

  const isOwnTeam =
    myTeamId === team.id;

  const isFull =
    memberCount >= maxMembers;


  return (
    <article className="group relative overflow-hidden rounded-xl border border-[var(--border-default)] bg-[#101010] transition-colors hover:border-[var(--accent-gold)]/25">

      {/* BACKGROUND IMAGE */}

      {team?.banner_url && (
        <img
          src={team?.banner_url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.14] grayscale-[0.25]"
        />
      )}


      {/* DARK OVERLAY */}

      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0b] via-[#0d0d0d]/95 to-[#101010]/85" />


      {/* GOLD ACCENT */}

      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-px"
        style={{
          background:
            "linear-gradient(180deg, transparent, var(--accent-gold), transparent)",
        }}
      />


      <div className="relative flex flex-col gap-4 p-3.5 sm:p-4 lg:flex-row lg:items-center lg:gap-5">


        {/* =====================================================
                    TEAM LOGO
                ===================================================== */}

        <div className="flex shrink-0 items-center gap-3 lg:block">


          <div className="relative">

            <div className="flex size-[58px] items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black/40 sm:size-[66px]">

              {team?.logo_url ? (

                <img
                  src={team?.logo_url}
                  alt={`${team?.name} logo`}
                  className="h-full w-full object-cover"
                />

              ) : (

                <span className="font-['Rajdhani'] text-lg font-bold uppercase text-[var(--accent-gold)] sm:text-xl">

                  {team?.tag ||
                    team?.name?.charAt(0)}

                </span>

              )}

            </div>


            <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full border border-[#101010] bg-[var(--accent-gold)]">

              <ShieldCheck
                size={8}
                strokeWidth={3}
                className="text-black"
              />

            </span>

          </div>


          {/* MOBILE STATUS */}

          <div className="lg:hidden">

            <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-[var(--accent-gold)]">
              Recruiting
            </p>

            <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.1em] text-white/40">
              {memberCount}/{maxMembers} Members
            </p>

          </div>

        </div>


        {/* =====================================================
                    TEAM INFORMATION
                ===================================================== */}

        <div className="min-w-0 flex-1">


          {/* STATUS */}

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">

            <span className="hidden items-center gap-1.5 text-[7px] font-bold uppercase tracking-[0.16em] text-[var(--accent-gold)] lg:inline-flex">

              <span className="size-1 rounded-full bg-[var(--accent-gold)]" />

              Recruiting

            </span>


            <span className="hidden h-3 w-px bg-white/10 lg:block" />


            <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/45">

              #{team?.tag}

            </span>


            {team?.country && (
              <>
                <span className="size-1 rounded-full bg-white/20" />

                <span className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-white/45">

                  <Globe2 size={9} />

                  {team?.country}

                </span>
              </>
            )}


            <span className="size-1 rounded-full bg-white/20" />


            <span className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.1em] text-white/45">

              {team?.visibility?.toLowerCase() === "private" ? (
                <Lock size={9} />
              ) : (
                <Globe2 size={9} />
              )}

              {team?.visibility ?? "Public"}

            </span>

          </div>


          {/* TEAM NAME */}

          <h2 className="mt-1.5 truncate font-['Rajdhani'] text-[23px] font-bold uppercase leading-none tracking-tight text-white sm:text-[27px]">

            {team?.name}

          </h2>


          {/* BIO */}

          {team?.description && (

            <p className="mt-2 max-w-2xl line-clamp-2 text-[9px] leading-4 text-white/45 sm:text-[10px]">

              {team?.description}

            </p>

          )}

        </div>


        {/* =====================================================
                    TEAM STATS
                ===================================================== */}

        <div className="flex items-center gap-4 border-t border-white/[0.07] pt-3 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">


          {/* CAPTAIN */}

          <div className="min-w-0">

            <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-white/35">
              Captain
            </p>

            <div className="mt-1 flex items-center gap-1.5">

              <Crown
                size={10}
                fill="var(--accent-gold)"
                className="shrink-0 text-[var(--accent-gold)]"
              />

              <span className="max-w-[90px] truncate text-[9px] font-semibold uppercase text-white/75">

                {captain?.player_name ??
                  captain?.name ??
                  team.captain_name ??
                  "Unassigned"}

              </span>

            </div>

          </div>


          {/* ROSTER */}

          <div>

            <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-white/35">
              Roster
            </p>

            <p className="mt-1 text-[10px] font-bold text-white">

              {memberCount}

              <span className="mx-1 text-white/30">
                /
              </span>

              <span className="text-white/55">
                {maxMembers}
              </span>

            </p>

          </div>


          {/* OPEN */}

          <div>

            <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-white/35">
              Open
            </p>

            <p className="mt-1 text-[10px] font-bold text-[var(--accent-gold)]">

              {availableSlots}

            </p>

          </div>

        </div>


        {/* =====================================================
                    CTA
                ===================================================== */}

        <div className="flex shrink-0 items-center gap-2">


          {/* MEMBERS */}

          <MemberStack
            members={displayedMembers}
            remaining={remainingMembers}
          />


          {isOwnTeam ? (

            <span className="flex h-8 items-center px-3 text-[8px] font-bold uppercase tracking-[0.1em] text-white/45">

              Your Team

            </span>

          ) : isFull ? (

            <span className="flex h-8 items-center px-3 text-[8px] font-bold uppercase tracking-[0.1em] text-white/35">

              Roster Full

            </span>

          ) : (

            <button
              type="button"
              disabled={isJoining}
              onClick={() => onJoin?.(team.id)}
              className="flex h-8 items-center justify-center gap-1.5 rounded-md bg-[var(--accent-gold)] px-3 text-[8px] font-bold uppercase tracking-[0.1em] text-black transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
            >

              <UserPlus size={11} />

              {isJoining
                ? "Joining..."
                : "Join"}

              <ArrowRight size={10} />

            </button>

          )}

        </div>

      </div>

    </article>
  );
}


function MemberStack({
  members = [],
  remaining = 0,
}) {
  return (
    <div className="flex items-center">

      {members.map((member, index) => (

        <div
          key={member.id ?? index}
          className="relative flex size-6 items-center justify-center overflow-hidden rounded-full border-2 border-[#101010] bg-[#1b1b1b]"
          style={{
            marginLeft:
              index === 0
                ? 0
                : -8,
            zIndex:
              members.length - index,
          }}
        >

          {member.avatar ||
            member.profile_picture ? (

            <img
              src={
                member.avatar ??
                member.profile_picture
              }
              alt=""
              className="h-full w-full object-cover"
            />

          ) : (

            <span className="text-[7px] font-bold uppercase text-white/60">

              {(
                member.player_name ??
                member.name ??
                "?"
              ).charAt(0)}

            </span>

          )}

        </div>

      ))}


      {remaining > 0 && (

        <div className="relative -ml-2 flex size-6 items-center justify-center rounded-full border-2 border-[#101010] bg-[var(--surface-elevated)]">

          <span className="text-[7px] font-bold text-[var(--accent-gold)]">

            +{remaining}

          </span>

        </div>

      )}

    </div>
  );
}