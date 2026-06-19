import { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import { teamService } from "../services/team_service";

// Team Components
import TeamMetaData from "../pages/player/components/TeamMetaData";
import TeamNavbar from "../pages/player/components/TeamNavbar";
import TeamPageSkeleton from "../skeletons/playerdash/my_team/TeamPageSkeleton";

// Icons
import { LayoutDashboard, Users, Trophy, Inbox, Activity, Wallet, Settings, } from "lucide-react";

const TEAM_NAVIGATION_LINKS = [
  {label: "Overview",path: "",icon: LayoutDashboard,},
  {label: "Roster",path: "roster",icon: Users,},
  {label: "Tournaments",path: "tournaments",icon: Trophy,},
  {label: "Applications",path: "applications",icon: Inbox,},
  {label: "Activity",path: "activity",icon: Activity,},
  {label: "Finances",path: "finances",icon: Wallet,},
  {label: "Settings",path: "settings",icon: Settings,},
]

function TeamLayout() {
    
    const {
        data:myTeamData,
        isPending,
        isError
    } = useQuery({
        queryKey:['my-team'],
        queryFn:teamService.getMyTeam,
        staleTime:1000*60*5, // no refetch for 5 minutes
        gcTime:1000*60*10,   // cache for 10 minutes
        refetchOnWindowFocus:false
    })

    if(isPending){
        return <TeamPageSkeleton/>
    }

    if (isError) {
        return (
            <div className="rounded-xl border bg-red-50 p-6 text-red-600">
                Failed to load team.
            </div>
        )
    }


  return (
    <div className="flex flex-col gap-3">
      <TeamMetaData team = {myTeamData.team} />

      <TeamNavbar links={TEAM_NAVIGATION_LINKS} />

      <section className="min-h-[500px]">
        <Outlet />
      </section>
    </div>
  );
}

export default TeamLayout;