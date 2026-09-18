import React, { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  MoreVertical,
  Search,
  Shield,
  UserRound,
} from "lucide-react";
import TeamActionMenu from "./TeamActionMenu";


function AllTeamsSection({ registration = [], entryFee = 0, openMenu, setOpenMenu, actionRefs, onReview }) {

  const [search, setSearch] = useState("");


  const teams = useMemo(() => {

    const query = search.trim().toLowerCase();

    if (!query) return registration;


    return registration.filter((team) => {

      const captain =
        team.captain_username ||
        team.captain_email?.split("@")[0] ||
        "";


      return [
        team.team_name,
        team.team_tag,
        captain,
        team.captain_mlbb_id,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        );
    });

  }, [registration, search]);


  const getTeamStats = (team) => {

    const contributions = team.contribution || [];

    const rosterCount = contributions.length;

    const paidCount = contributions.filter(
      (item) => item.status === "paid"
    ).length;

    const amount =
      paidCount * Number(entryFee || 0);


    let status = "Incomplete";


    if (rosterCount >= 5 && paidCount === 5) {
      status = "Ready for Lock";
    } else if (rosterCount >= 5 && paidCount < 5) {
      status = "Pending Payment";
    }


    return {
      rosterCount,
      paidCount,
      amount,
      status,
    };
  };


  const getStatusStyle = (status) => {

    if (status === "Ready for Lock") {
      return "bg-emerald-500/10 text-emerald-700";
    }

    if (status === "Pending Payment") {
      return "bg-amber-500/10 text-amber-700";
    }

    return "bg-red-500/10 text-red-600";
  };


  return (
    <section className="min-w-0">


      {/* SEARCH + FILTERS */}

      <div className="flex min-w-0 gap-2">

        <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] px-2.5 sm:h-[38px] sm:px-3">

          <Search
            size={13}
            className="shrink-0 text-[var(--text-muted)]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team, captain, or tag..."
            className="min-w-0 flex-1 bg-transparent text-[8px] text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] sm:text-[9px]"
          />

        </div>


        <button
          type="button"
          className="hidden h-[38px] shrink-0 items-center gap-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] px-3 text-[9px] text-[var(--text-secondary)] sm:flex"
        >
          <span>All Status</span>
          <ChevronDown size={12} />
        </button>


        <button
          type="button"
          className="hidden h-[38px] shrink-0 items-center gap-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] px-3 text-[9px] text-[var(--text-secondary)] md:flex"
        >
          <span>All Payments</span>
          <ChevronDown size={12} />
        </button>

      </div>


      {/* MOBILE TEAM LIST */}

      <div className="mt-2 space-y-1.5 sm:hidden">

        {teams.length > 0 ? (

          teams.map((team, index) => {

            const {
              rosterCount,
              paidCount,
              amount,
              status,
            } = getTeamStats(team);


            const captainName =
              team.captain_username ||
              team.captain_email?.split("@")[0] ||
              "Unknown";


            return (
              <article
                key={team.id}
                className="overflow-hidden rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)]"
              >


                {/* TEAM HEADER */}

                <div className="flex items-center gap-2.5 px-2.5 py-2">

                  {/* INDEX */}

                  <span className="w-4 shrink-0 text-[6px] font-medium tabular-nums text-[var(--text-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>


                  {/* TEAM LOGO */}

                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">

                    {team.team_logo_url ? (
                      <img
                        src={team.team_logo_url}
                        alt=""
                        className="size-full rounded-lg object-cover"
                      />
                    ) : (
                      <Shield
                        size={15}
                        strokeWidth={1.7}
                        className="text-[var(--text-muted)]"
                      />
                    )}

                  </div>


                  {/* TEAM INFO */}

                  <div className="min-w-0 flex-1">

                    <div className="flex min-w-0 items-center gap-1.5">

                      <p className="truncate text-[9px] font-semibold text-[var(--text-primary)]">
                        {team.team_name || "Unnamed Team"}
                      </p>

                      <span className="shrink-0 text-[6px] text-[var(--text-muted)]">
                        #{team.team_tag || "—"}
                      </span>

                    </div>


                    <div className="mt-0.5 flex items-center gap-1">

                      {/* CAPTAIN LOGO */}

                      <div className="flex size-4 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">

                        {team.captain_avatar_url ? (
                          <img
                            src={team.captain_avatar_url}
                            alt=""
                            className="size-full rounded-full object-cover"
                          />
                        ) : (
                          <UserRound
                            size={8}
                            className="text-[var(--text-muted)]"
                          />
                        )}

                      </div>


                      <span className="truncate text-[6px] text-[var(--text-muted)]">
                        {captainName}
                      </span>

                    </div>

                  </div>


                  {/* ACTION */}
                  
                  <div className="flex justify-end">

                    <button ref={(node) => { actionRefs.current[team.id] = node; }} type="button" onClick={() => setOpenMenu((current) => current === team.id ? null : team.id)} className={`flex size-8 items-center justify-center rounded-[7px] transition-colors ${openMenu === team.id ? "bg-[var(--surface-elevated)] text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"}`} aria-label={`Actions for ${team.team_name || "team"}`}><MoreVertical size={15} /></button>

                  </div>

                  {openMenu === team.id &&
                    <TeamActionMenu
                      team={team}
                      anchorRef={{ current: actionRefs.current[team.id] }}
                      onClose={() => setOpenMenu(null)} onReview={onReview}
                    />
                  }

                </div>


                {/* TEAM STATS */}

                <div className="grid grid-cols-3 border-t border-[var(--border-subtle)]">


                  {/* ROSTER */}

                  <div className="px-2.5 py-1.5">

                    <p className="text-[5px] font-medium uppercase tracking-[0.07em] text-[var(--text-muted)]">
                      Roster
                    </p>

                    <div className="mt-1 flex items-center gap-1">

                      <div className="flex items-center gap-[2px]">

                        {Array.from({
                          length: 5,
                        }).map((_, i) => (
                          <span
                            key={i}
                            className={`size-[5px] rounded-full ${i < rosterCount
                              ? "bg-emerald-500"
                              : "bg-zinc-300"
                              }`}
                          />
                        ))}

                      </div>

                      <span className="text-[7px] font-semibold text-[var(--text-secondary)]">
                        {rosterCount}/5
                      </span>

                    </div>

                  </div>


                  {/* PAYMENT */}

                  <div className="border-l border-[var(--border-subtle)] px-2.5 py-1.5">

                    <p className="text-[5px] font-medium uppercase tracking-[0.07em] text-[var(--text-muted)]">
                      Payment
                    </p>

                    <div className="mt-1 flex items-center gap-1">

                      <div className="flex items-center gap-[2px]">

                        {Array.from({
                          length: 5,
                        }).map((_, i) => (
                          <span
                            key={i}
                            className={`size-[5px] rounded-full ${i < paidCount
                              ? "bg-emerald-500"
                              : "bg-red-400/70"
                              }`}
                          />
                        ))}

                      </div>

                      <span className="text-[7px] font-semibold text-[var(--text-secondary)]">
                        {paidCount}/5
                      </span>

                    </div>

                  </div>


                  {/* AMOUNT */}

                  <div className="border-l border-[var(--border-subtle)] px-2.5 py-1.5">

                    <p className="text-[5px] font-medium uppercase tracking-[0.07em] text-[var(--text-muted)]">
                      Paid Amount
                    </p>

                    <p className="mt-1 text-[7px] font-semibold text-[var(--text-primary)]">
                      ₹{amount.toLocaleString("en-IN")}
                    </p>

                  </div>

                </div>


                {/* STATUS */}

                <div className="flex items-center justify-between border-t border-[var(--border-subtle)] px-2.5 py-1.5">

                  <span className="text-[5.5px] text-[var(--text-muted)]">
                    ID: {team.captain_mlbb_id || team.captain_id || "—"}
                  </span>


                  <span
                    className={`inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-1 text-[5.5px] font-semibold ${getStatusStyle(status)}`}
                  >

                    <span className="flex size-3 items-center justify-center rounded-full bg-current/10">

                      <Check
                        size={7}
                        strokeWidth={3}
                      />

                    </span>

                    {status}

                  </span>

                </div>

              </article>
            );

          })

        ) : (

          <div className="flex min-h-[140px] items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] text-[8px] text-[var(--text-muted)]">
            No team registrations found.
          </div>

        )}

      </div>


      {/* DESKTOP TABLE */}

      <div className="mt-3 hidden overflow-hidden rounded-[10px] border border-[var(--border-subtle)] bg-[var(--surface-base)] sm:block">

        <div className="overflow-x-auto scrollbar-hide">


          {/* HEADER */}

          <div className="grid min-w-[900px] grid-cols-[40px_1.5fr_1.1fr_1fr_1fr_1fr_130px_45px] items-center gap-3 border-b border-[var(--border-subtle)] bg-[var(--surface-elevated)]/[0.35] px-4 py-3 text-[7px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">

            <span>#</span>
            <span>Team</span>
            <span>Captain</span>
            <span>Roster (5/5)</span>
            <span>Payments (5/5)</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Actions</span>

          </div>


          {/* ROWS */}

          {teams.length > 0 ? (

            teams.map((team, index) => {

              const {
                rosterCount,
                paidCount,
                amount,
                status,
              } = getTeamStats(team);


              const captainName =
                team.captain_username ||
                team.captain_email?.split("@")[0] ||
                "Unknown";


              return (
                <div
                  key={team.id}
                  className="grid min-w-[900px] grid-cols-[40px_1.5fr_1.1fr_1fr_1fr_1fr_130px_45px] items-center gap-3 border-b border-[var(--border-subtle)] px-4 py-2.5 transition-colors hover:bg-[var(--surface-elevated)]/[0.35]"
                >

                  {/* NUMBER */}

                  <span className="text-[9px] tabular-nums text-[var(--text-muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>


                  {/* TEAM */}

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">

                      {team.team_logo_url ? (
                        <img
                          src={team.team_logo_url}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <Shield
                          size={17}
                          strokeWidth={1.7}
                          className="text-[var(--text-muted)]"
                        />
                      )}

                    </div>


                    <div className="min-w-0">

                      <p className="truncate text-[10px] font-semibold text-[var(--text-primary)]">
                        {team.team_name || "Unnamed Team"}
                      </p>

                      <p className="mt-[2px] text-[8px] text-[var(--text-muted)]">
                        #{team.team_tag || "—"}
                      </p>

                    </div>

                  </div>


                  {/* CAPTAIN */}

                  <div className="flex min-w-0 items-center gap-2">

                    <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border-subtle)] bg-[var(--surface-elevated)]">

                      {team.captain_avatar_url ? (
                        <img
                          src={team.captain_avatar_url}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : (
                        <UserRound
                          size={13}
                          strokeWidth={1.7}
                          className="text-[var(--text-muted)]"
                        />
                      )}

                    </div>


                    <div className="min-w-0">

                      <p className="truncate text-[9px] font-medium text-[var(--text-primary)]">
                        {captainName}
                      </p>

                      <p className="mt-[2px] truncate text-[8px] text-[var(--text-muted)]">
                        ID: {team.captain_mlbb_id || team.captain_id || "—"}
                      </p>

                    </div>

                  </div>


                  {/* ROSTER */}

                  <div>

                    <div className="flex items-center gap-[4px]">

                      {Array.from({
                        length: 5,
                      }).map((_, i) => (
                        <span
                          key={i}
                          className={`size-[7px] rounded-full ${i < rosterCount
                            ? "bg-emerald-500"
                            : "bg-zinc-300"
                            }`}
                        />
                      ))}

                      <span className="ml-1 text-[9px] font-medium text-[var(--text-secondary)]">
                        {rosterCount}/5
                      </span>

                    </div>

                    <p className={`mt-[4px] text-[8px] ${rosterCount === 5
                      ? "text-emerald-600"
                      : "text-red-500"
                      }`}>
                      {rosterCount === 5
                        ? "Confirmed"
                        : "Not Confirmed"}
                    </p>

                  </div>


                  {/* PAYMENTS */}

                  <div>

                    {rosterCount > 0 ? (
                      <>

                        <div className="flex items-center gap-[4px]">

                          {Array.from({
                            length: 5,
                          }).map((_, i) => (
                            <span
                              key={i}
                              className={`size-[7px] rounded-full ${i < paidCount
                                ? "bg-emerald-500"
                                : "bg-red-400/80"
                                }`}
                            />
                          ))}

                          <span className="ml-1 text-[9px] font-medium text-[var(--text-secondary)]">
                            {paidCount}/5
                          </span>

                        </div>


                        <p className={`mt-[4px] text-[8px] ${paidCount === 5
                          ? "text-emerald-600"
                          : "text-amber-600"
                          }`}>
                          {paidCount === 5
                            ? "Fully Paid"
                            : "Pending"}
                        </p>

                      </>
                    ) : (

                      <span className="text-[8px] text-[var(--text-muted)]">
                        Not Available
                      </span>

                    )}

                  </div>


                  {/* AMOUNT */}

                  <div>

                    <p className="text-[10px] font-semibold text-[var(--text-primary)]">
                      ₹{amount.toLocaleString("en-IN")}
                    </p>

                    <p className="mt-[2px] text-[7px] text-[var(--text-muted)]">
                      {paidCount}/{rosterCount || 5} paid
                    </p>

                  </div>


                  {/* STATUS */}

                  <div>

                    <span
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-[6px] px-2.5 py-[6px] text-[8px] font-semibold ${getStatusStyle(status)}`}
                    >

                      <span className="flex size-[13px] items-center justify-center rounded-full bg-current/10">

                        <Check
                          size={8}
                          strokeWidth={3}
                        />

                      </span>

                      {status}

                    </span>

                  </div>


                  {/* ACTION */}

                  <div className="flex justify-end">

                    <button ref={(node) => { actionRefs.current[team.id] = node; }} type="button" onClick={() => setOpenMenu((current) => current === team.id ? null : team.id)} className={`flex size-8 items-center justify-center rounded-[7px] transition-colors ${openMenu === team.id ? "bg-[var(--surface-elevated)] text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]"}`} aria-label={`Actions for ${team.team_name || "team"}`}><MoreVertical size={15} /></button>

                  </div>

                  {openMenu === team.id &&
                    <TeamActionMenu
                      team={team}
                      anchorRef={{ current: actionRefs.current[team.id] }}
                      onClose={() => setOpenMenu(null)} onReview={onReview}
                    />
                  }

                </div>
              );

            })

          ) : (

            <div className="flex min-h-[180px] items-center justify-center text-[10px] text-[var(--text-muted)]">
              No team registrations found.
            </div>

          )}

        </div>

      </div>


      {/* FOOTER */}

      <div className="flex items-center justify-between py-2.5 sm:py-3">

        <span className="text-[7px] text-[var(--text-muted)] sm:text-[8px]">
          Showing {teams.length} of {registration.length} teams
        </span>

        <span className="text-[7px] text-[var(--text-muted)] sm:text-[8px]">
          {registration.length} registered
        </span>

      </div>

    </section>
  );
}


export default AllTeamsSection;