import { ArrowRight } from "lucide-react";

export default function JoinTournamentButton() {
 return(
  <button className="group relative bg-white backdrop-blur-[20px] px-8 py-3 flex items-center justify-center gap-5 border border-gray-400">

    <span>Join Tournament</span>
    <span className="group-hover:translate-x-1 duration-200 transition-all"><ArrowRight/></span>

  </button>
 )
}