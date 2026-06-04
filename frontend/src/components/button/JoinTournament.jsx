import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function JoinTournamentButton() {
 
  return (
    <button
      className="
      group
      flex 
      gap-2
      relative
      overflow-hidden
      rounded-2xl
      border
      tracking-wide
      bg-[var(--action-primary-bg)]
      text-[var(--action-primary-text)]
      border-[var(--action-primary-border)]
      md:px-8 px-6
      md:py-4 py-2
      "
    >
      Join Tournament 
      <span className="inline"><ArrowRight/></span>
    </button>
  )
}