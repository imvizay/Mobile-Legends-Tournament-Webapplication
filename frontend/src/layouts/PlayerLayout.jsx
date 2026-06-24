import { Crown, Gift, GlobeIcon, Headset, Home, Medal, Newspaper, Receipt,LucideBadgePlus, Shield, Trophy, Users, Wallet, History, MessageSquare, TicketPlus } from 'lucide-react';


import React from 'react'
import { Outlet } from 'react-router-dom'

import AsideSidebar from '../components/playerLayout/Sidebar';
import TopbarHeader from '../components/playerLayout/Topbar';



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
      <section className="select-none bg-[var(--bg-canvas)] grid grid-cols-[230px_1fr] h-screen">
        <AsideSidebar dashboardLinks = {PLAYER_DASHBOARD_NAVIGATION_LINKS}/>
      
        
      {/* Right Content Area */}
      <div className="grid grid-rows-[88px_1fr]">
        
        {/* Topbar */}
      
       <TopbarHeader/>
    
        {/* Page Content */}
        <main className="overflow-y-auto p-8">
          <Outlet />
        </main>
        
      </div>
        
    </section>
)
  
}

export default PlayerLayout