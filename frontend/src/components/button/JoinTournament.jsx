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
      px-8
      py-4
      "
    >
      Join Tournament 
      <span className="inline"><ArrowRight/></span>
    </button>
  )
}