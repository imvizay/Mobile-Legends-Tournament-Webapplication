import React, { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

import { teamService } from "../services/team_service"

import TeamLayout from "../pages/player/layouts/TeamLayout"
import EmptyTeamState from "../pages/player/team/EmptyTeam"
import TeamPageSkeleton from "../skeletons/playerdash/my_team/TeamPageSkeleton"

import { Outlet } from "react-router-dom"

const RequireTeam = () => {
  // Fetch the logged-in user's team
  const {
    data,
    isPending,
    isError,
    error,
    isSuccess
  } = useQuery({
    queryKey: ["my-team"],
    queryFn: teamService.getMyTeam,
    staleTime: 1000 * 60 * 10, // Cache data for 10 minutes
  })

  // Show loading state while fetching
  if (isPending) {
    return <TeamPageSkeleton />
  }

  // Show error page if the request fails
  if (isError) {
    console.log("ERROR LOADING TEAM :",error)
    return 
  }

  if(isSuccess){
    console.log("Data is success",data)
  }

  // User doesn't belong to any team yet
  if (!data.team) {
    return <EmptyTeamState />
  }

  // User has a team
  return <Outlet context={data.team} />
}

export default RequireTeam