// hooks and state
import React from 'react'
import { Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';

// icons
import { Crown, Gift, GlobeIcon, Headset, Home, Medal, Newspaper, Receipt,LucideBadgePlus, Shield, Trophy, Users, Wallet, History, MessageSquare, TicketPlus } from 'lucide-react';

// Desktop Navbar
import AsideSidebar from '../components/playerLayout/Sidebar';
import TopbarHeader from '../components/playerLayout/Topbar';

// Mobile Navbar
import MobileNavbar from '../components/navigations/MobileNavbar';
import { teamService } from '../services/team_service';

const PLAYER_DASHBOARD_NAVIGATION_LINKS = [
  {
    section: "Compete",
    links: [
      {icon:Trophy , name: "Tournaments", path: "/player/tournaments" },
      {icon:Medal , name: "Leaderboards", path: "/player/leaderboards" },
      {icon:Crown , name: "Rankings", path: "/player/rankings" },
      {icon:History , name: "Match History", path: "/player/match-history" }

    ]
  },
  {
    section: "Squad",
    links: [
      {icon:Users, name: "Friends", path: "/player/friends" },
      {icon:Shield, name: "Team", path: "/player/team" }
    ]
  },
  {
    section: "Finance",
    links: [
      {icon:Wallet, name: "Wallet", path: "/player/wallet" },
      {icon:Receipt, name: "Transactions", path: "/player/transactions" },
      {icon:Gift ,name:'Rewards',path:'/player/rewards'}
    ]
  },

  {
    section:"Discover",
    links:[
      {icon:LucideBadgePlus,name:'Membership',path:'player/membership'},
      {icon:GlobeIcon,name:"Community",path:'player/community'},
      {icon:Newspaper,name:"News & Updates",path:'player/news-updates'},
    ]
  },
  {
    section:"More",
    links:[
      {icon:Headset,name:"Support",path:'player/support'},
      {icon:MessageSquare,name:"Feedback",path:'player/feedback'},
      {icon:TicketPlus,name:"Raise Ticket",path:'player/raise-ticket'},
    ]
  }
];


function PlayerLayout() {
  

  return (
    <section className="h-fit lg:h-screen overflow-hidden bg-[var(--bg-canvas)] lg:grid lg:grid-cols-[220px_1fr]">

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">
            <AsideSidebar dashboardLinks={PLAYER_DASHBOARD_NAVIGATION_LINKS}/>
        </aside>

        {/* Right */}
        <div className="min-h-screen flex flex-col">

            {/* Desktop Header */}
            <div className="hidden lg:block">
                <TopbarHeader/>
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden">
                <MobileNavbar/>
            </div>

            <main
              className="flex-1 overflow-y-auto px-4 pt-20 pb-6 md:px-6 lg:px-8 lg:pt-6 ">
                <Outlet />
            </main>

        </div>

    </section>
  )
  
}

export default PlayerLayout

