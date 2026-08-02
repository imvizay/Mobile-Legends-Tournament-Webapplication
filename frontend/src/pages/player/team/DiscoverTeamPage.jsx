import React, { useEffect, useRef } from "react";
import { Search, ChevronDown, Gamepad2, Users, Radar, ShieldCheck, X, Crosshair, Radio, } from "lucide-react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


import Loader from "../../../components/Loader";
import DiscoverTeamCard from "../../../features/team/components/common/DiscoverTeamCard";
import { teamService } from "../../../services/team_service";

const DiscoverTeamPage = () => {

  const queryClient = useQueryClient()
  const loaderRef = useRef(null);

  const joinTeamMutation = useMutation({
    mutationKey: ["join-team"],
    mutationFn: (teamId) => teamService.joinTeam(teamId),
  });

  const handleTeamJoin = async (teamId) => {
    try {
      await joinTeamMutation.mutateAsync(teamId);
      await queryClient.invalidateQueries(['discover-team'])
    }
    catch (error) {
      console.log("ERROR JOINING TEAM:", error)
    }
  };

  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["discover-team"],
    initialPageParam: null,
    queryFn: ({ pageParam }) => teamService.loadTeam({ cursor: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => lastPage.has_next ? lastPage.cursor : undefined,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, { threshold: 0.4, rootMargin: "120px" });

    const currentLoader = loaderRef.current;

    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </section>
    );
  }

  if (isError) {
    console.error(error)
    return (
      <section className="flex min-h-[55vh] items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)]">
            <ShieldCheck size={20} className="text-[var(--accent-gold)]" />
          </div>

          <h2 className="mt-4 font-['Rajdhani'] text-xl font-bold uppercase tracking-wide text-[var(--text-primary)]">
            Directory Unavailable
          </h2>

          <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
            The competitive team directory could not be loaded. Please try again.
          </p>
        </div>
      </section>
    );
  }

  const teams = data?.pages.flatMap((page) => page.items) ?? [];
  const myTeamId = data?.pages?.[0]?.my_team_id;

  return (
    <section className="mx-auto w-full max-w-[1440px] pb-8">

      <header className="relative mb-5 overflow-hidden border-b border-[var(--border-default)] pb-4 sm:mb-6 sm:pb-5">
        <div className="pointer-events-none absolute -left-16 -top-24 size-48 rounded-full bg-[var(--accent-gold)]/[0.035] blur-3xl" />

        <div className="relative flex items-end justify-between gap-4">

          {/* Header Identity */}
          <div className="min-w-0">

            {/* Quiet contextual label */}
            <div className="mb-1.5 flex items-center gap-2">
              <span className="h-px w-4 bg-[var(--accent-gold)]/60" />

              <span className="text-[7px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Team Discovery
              </span>
            </div>

            {/* Primary title */}
            <div className="flex min-w-0 items-baseline gap-2.5">
              <h1 className="truncate font-['Rajdhani'] text-[27px] font-bold uppercase leading-none tracking-tight text-[var(--headline-primary)] sm:text-[31px]">
                Discover Teams
              </h1>

              <span className="hidden shrink-0 text-[7px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] sm:inline">
                MLBB
              </span>
            </div>

            {/* Supporting information — intentionally quiet */}
            <p className="mt-1.5 max-w-lg text-[9px] leading-4 text-[var(--text-muted)] sm:text-[10px]">
              Explore competitive squads currently looking for players.
            </p>
          </div>


          {/* Discovery Status */}
          <div className="hidden shrink-0 items-center gap-4 sm:flex">

            {/* Team count */}
            <div className="flex items-center gap-2">
              <Users
                size={13}
                strokeWidth={1.8}
                className="text-[var(--text-muted)]"
              />

              <div className="leading-none">
                <span className="font-['Rajdhani'] text-base font-semibold text-[var(--text-primary)]">
                  {teams.length}
                </span>

                <span className="ml-1.5 text-[6px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                  Teams
                </span>
              </div>
            </div>

            {/* Divider */}
            <span className="h-5 w-px bg-[var(--border-default)]" />

            {/* Network status */}
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />

              <span className="text-[7px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                Live
              </span>
            </div>
          </div>
        </div>
      </header>


      <section className="mb-5 sm:mb-6">

        {/* Search + Game Filter */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">

          {/* Search */}
          <label className="group relative flex h-12 min-w-0 flex-1 items-center rounded-lg border border-[var(--border-default)] bg-[var(--surface-base)] transition-colors focus-within:border-[var(--accent-gold)]/50 focus-within:bg-[var(--surface-elevated)] sm:h-[50px] sm:rounded-xl">

            <span className="flex size-12 shrink-0 items-center justify-center sm:size-[50px]">
              <Search
                size={17}
                strokeWidth={1.8}
                className="text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--accent-gold)]"
              />
            </span>

            <input
              type="search"
              placeholder="Search teams, tags, or regions..."
              className="h-full min-w-0 flex-1 bg-transparent pr-3 text-[11px] font-medium text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] sm:text-xs"
            />

            {/* Desktop search indicator */}
            <span className="mr-2 hidden h-7 items-center border-l border-[var(--border-default)] pl-3 text-[7px] font-semibold uppercase tracking-[0.15em] text-[var(--text-muted)] md:flex">
              Search
            </span>
          </label>


          {/* Game Filter */}
          <button
            type="button"
            className="flex h-12 items-center justify-between rounded-lg border border-[var(--border-default)] bg-[var(--surface-base)] px-3.5 text-left transition-colors hover:border-[var(--accent-gold)]/35 hover:bg-[var(--surface-elevated)] sm:h-[50px] sm:min-w-[210px] sm:rounded-xl"
          >
            <span className="flex min-w-0 items-center gap-3">

              <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-[var(--border-default)] bg-[var(--surface-elevated)]">
                <Gamepad2
                  size={14}
                  strokeWidth={1.8}
                  className="text-[var(--accent-gold)]"
                />
              </span>

              <span className="min-w-0">
                <span className="hidden text-[7px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)] sm:block">
                  Game
                </span>

                <span className="block truncate text-[10px] font-semibold text-[var(--text-primary)] sm:mt-0.5 sm:text-[11px]">
                  Mobile Legends
                </span>
              </span>
            </span>

            <ChevronDown
              size={15}
              strokeWidth={1.8}
              className="ml-3 shrink-0 text-[var(--text-muted)]"
            />
          </button>
        </div>


        {/* Results Context */}
        <div className="mt-5 flex items-center justify-between gap-4 sm:mt-6">

          <div className="flex min-w-0 items-center gap-2.5">

            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--surface-elevated)]">
              <Radar
                size={14}
                strokeWidth={1.8}
                className="text-[var(--accent-gold)]"
              />
            </span>

            <div className="min-w-0">
              <h2 className="font-['Rajdhani'] text-[15px] font-bold uppercase leading-none tracking-[0.04em] text-[var(--text-primary)] sm:text-base">
                Available Teams
              </h2>

              <p className="mt-1 hidden text-[8px] leading-none text-[var(--text-muted)] sm:block">
                Squads currently accepting competitive players.
              </p>
            </div>
          </div>


          {/* Result Count */}
          <div className="flex shrink-0 items-center gap-1.5">
            <Crosshair
              size={11}
              strokeWidth={1.8}
              className="text-[var(--text-muted)]"
            />

            <span className="font-['Rajdhani'] text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-secondary)]">
              {teams.length}
            </span>

            <span className="text-[7px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Results
            </span>
          </div>
        </div>

      </section>

      <div className="space-y-3">
        {teams.length === 0 ? (
          <EmptyTeamState />
        ) : (
          teams.map((team) => (
            <DiscoverTeamCard key={team.id} team={team} onJoin={handleTeamJoin} isJoining={joinTeamMutation.isPending && joinTeamMutation.variables === team.id} myTeamId={myTeamId} />
          ))
        )}
      </div>

      <div ref={loaderRef} className="h-8" />

      {isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2 py-6">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--accent-gold)] opacity-50" />
            <span className="relative inline-flex size-2 rounded-full bg-[var(--accent-gold)]" />
          </span>

          <span className="font-['Rajdhani'] text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            Loading More Teams
          </span>
        </div>
      )}

      {!hasNextPage && teams.length > 0 && (
        <div className="flex items-center justify-center gap-3 py-8">
          <span className="h-px w-10 bg-[var(--border-default)]" />
          <span className="font-['Rajdhani'] text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">Directory Complete</span>
          <span className="h-px w-10 bg-[var(--border-default)]" />
        </div>
      )}
    </section>
  );
};

function EmptyTeamState() {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-[var(--border-default)] bg-[var(--surface-base)] px-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-elevated)]">
        <Users size={20} className="text-[var(--accent-gold)]" />
      </div>

      <h2 className="mt-4 font-['Rajdhani'] text-xl font-bold uppercase tracking-wide text-[var(--text-primary)]">
        No Teams Found
      </h2>

      <p className="mt-2 max-w-sm text-[10px] leading-5 text-[var(--text-muted)]">
        No teams currently match your search criteria. New competitive squads will appear here when they enter the recruitment network.
      </p>
    </div>
  );
}

export default DiscoverTeamPage;