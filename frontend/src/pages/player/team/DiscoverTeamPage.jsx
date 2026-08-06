import React, { useEffect, useRef } from "react"
import { Search, ChevronDown, Gamepad } from "lucide-react"
import { useInfiniteQuery,useMutation } from "@tanstack/react-query"

import Loader from "../../../components/Loader"
import DiscoverTeamCard from "../../../features/team/components/common/DiscoverTeamCard"
import { teamService } from "../../../services/team_service"


const DiscoverTeamPage = () => {

  const loaderRef = useRef(null)
  
  const joinTeamMutation  = useMutation({
    mutationKey:['join-team'],
    mutationFn: (teamId) => teamService.joinTeam(teamId)
  })

  const handleTeamJoin = (teamId) => {
    joinTeamMutation.mutate(teamId)
  }

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

    queryFn: ({ pageParam }) => {
        console.log("React Query calling");

        return teamService.loadTeam({
            cursor: pageParam,
            limit: 10,
        });
    },

    getNextPageParam: (lastPage) =>
      lastPage.has_next ? lastPage.cursor : undefined,
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage()
        }
      },
      { threshold: 0.5 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (isPending) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (isError) {
    console.error(error)
    return (
      <p className="text-center" style={{ color: "var(--text-secondary)" }} >
        Failed to load teams.
      </p>
    )
  }

  const teams = data?.pages.flatMap((page) => page.items) ?? [];
  const myTeamId = data?.pages?.[0]?.my_team_id

  console.log("DATA",data)

  return (
    <section className="mx-auto max-w-6xl space-y-6">

      {/* Header */}

      <div className="flex items-end justify-between">

        <div>
          <h1 
          className="text-2xl font-bold" 
          style={{ color: "var(--headline-primary)" }}> Discover Teams </h1>

          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }} >
            Find active teams looking for new players.
          </p>

        </div>

        <span className="text-sm" style={{ color: "var(--text-muted)" }} > {teams.length} Teams </span>

      </div>

      {/* Search */}

      <div className="flex gap-3">

        <div className="flex h-11 flex-1 items-center rounded-xl border px-4"
          style={{background: "var(--surface-base)",borderColor: "var(--border-default)",}}>

          <Search size={17} color="var(--text-muted)" />

          <input placeholder="Search teams..." className="ml-3 w-full bg-transparent text-sm outline-none" />

        </div>

        <button
          className="flex h-11 items-center gap-2 rounded-xl border px-4 text-sm"
          style={{ background: "var(--surface-base)", borderColor: "var(--border-default)", }} >
 
          <Gamepad size={16} /> Mobile Legends <ChevronDown size={16} />

        </button>

      </div>

      {/* Team List */}

      <div className="space-y-3">

        {teams.length === 0 ? (
          <div
            className="rounded-xl border py-12 text-center"
            style={{ background: "var(--surface-base)", borderColor: "var(--border-default)", }} >

            <h2 className="font-semibold"> No teams found </h2>

            <p
              className="mt-1 text-sm"
              style={{ color: "var(--text-secondary)", }} > Try adjusting your search. </p>

          </div>
        ) : (
          teams.map((team) => (
            <DiscoverTeamCard
              key={team.id}
              team={team}
              onJoin = { handleTeamJoin }
              isJoining={joinTeamMutation.isPending}
              myTeamId={myTeamId}
            />
          ))
        )}
        
        {/* Loader Ref */}
        <div ref={loaderRef} />

        {isFetchingNextPage && (
          <div className="py-4 text-center text-sm" style={{color: "var(--text-muted)",}}>
            Loading more teams...
          </div>
        )}

      </div>

    </section>
  )
}

export default DiscoverTeamPage