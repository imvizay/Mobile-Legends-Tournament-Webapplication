import { useEffect, useState } from "react";

import { Outlet, useOutlet } from "react-router-dom";

import { useOutletContext } from "react-router-dom";

import { teamService } from "../services/team_service";

// Team Components
import TeamMetaData from "../features/team/components/common/TeamMetaData";
import TeamNavbar from "../features/team/navigation/TeamNavbar";
import TeamPageSkeleton from "../skeletons/playerdash/my_team/TeamPageSkeleton";

// Icons
import { LayoutDashboard, Users, Trophy, Inbox, Activity, Wallet, Settings, } from "lucide-react";
import EmptyTeamState from "../pages/player/team/EmptyTeam";
import { useQuery } from "@tanstack/react-query";

const TEAM_NAVIGATION_LINKS = [
 
  { label: "Overview", path: "", icon: LayoutDashboard },
  { label: "Members", path: "members", icon: Users },
  { label: "Tournaments", path: "tournaments", icon: Trophy },
  { label: "Applications", path: "applications", icon: Inbox },
  { label: "Finances", path: "finances", icon: Wallet },
  { label: "Settings", path: "settings", icon: Settings },
]

function TeamLayout() {

  const team = useOutletContext()

  useEffect(()=>{
    console.log("Team Layout Mounting...")
    console.log("TEAAAAM : ",team)

    return () => {
      console.log("Team Layout Unmounting...")
    }
  },[])


  return (
     <div className="h-screen space-y-4  md:space-y-5 lg:space-y-6 ">

      <TeamMetaData team={team} />

      <TeamNavbar links={TEAM_NAVIGATION_LINKS} />

      <section className="min-h-[400px] md:min-h-[500px]">

        <Outlet context={team} />
      </section>

    </div>
  );
}

export default TeamLayout;