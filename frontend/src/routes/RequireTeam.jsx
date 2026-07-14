import React from "react"
import { useQuery } from "@tanstack/react-query"
import { Outlet } from "react-router-dom"

import { teamService } from "../services/team_service"

import EmptyTeamState from "../pages/player/team/EmptyTeam"
import TeamPageSkeleton from "../skeletons/playerdash/my_team/TeamPageSkeleton"

const RequireTeam = () => {
    const {
        data,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ["my-team"],
        queryFn: teamService.getMyTeam,
        staleTime: 1000 * 60 * 10,
    })

    if (isPending) {
        return <TeamPageSkeleton />
    }

    if (isError) {
        console.error("ERROR LOADING TEAM:", error)
        return <div>Failed to load team.</div>
    }

    const team = data?.team

    if (!team) {
        return <EmptyTeamState />
    }

    return <Outlet context={{ team }} />
}

export default RequireTeam