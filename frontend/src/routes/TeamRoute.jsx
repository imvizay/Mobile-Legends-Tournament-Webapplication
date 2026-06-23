import React from 'react'
import { useOutletContext } from 'react-router-dom'
import EmptyTeamState from '../pages/player/team/EmptyTeam'
import TeamLayout from '../layouts/TeamLayout'
import TeamPageSkeleton from '../skeletons/playerdash/my_team/TeamPageSkeleton'
function TeamRoute() {
    const teamQuery = useOutletContext()
  
    if(!teamQuery){
        return <EmptyTeamState/>
    }

  return (
    <TeamLayout/>
  )
}

export default TeamRoute