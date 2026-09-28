
import { Crown, Gift, GlobeIcon, Headset, Home, Medal, Newspaper, Receipt,LucideBadgePlus, Shield, Trophy, Users, Wallet, History, MessageSquare, TicketPlus } from 'lucide-react';

export const PLAYER_DASHBOARD_NAVIGATION_LINKS = [
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