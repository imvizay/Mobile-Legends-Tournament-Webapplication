import React from "react";
import { ArrowRight, Plus, ShieldCheck, Swords, Users } from "lucide-react";

const CompetitionBanner = ({ userTeam = null, onCreateTeam, onJoinTeam, onExploreTournaments, onViewTeam }) => {
    
    const hasTeam = Boolean(userTeam);

    return (
        <section className="relative w-full overflow-hidden rounded-xl border border-black/[0.07] bg-[#111] text-white">
            <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-[#d8ad55]/10 blur-3xl" />

            <div className={`relative flex gap-4 px-4 sm:items-center sm:justify-between sm:px-5 ${hasTeam ? "min-h-[78px] py-3" : "min-h-[105px] flex-col py-4 sm:flex-row sm:py-3.5"}`}>
                {/* Content */}
                <div className="flex min-w-0 items-center gap-3">
                    <div className={`hidden shrink-0 items-center justify-center rounded-lg sm:flex ${hasTeam ? "h-9 w-9 bg-emerald-400/[0.07] text-emerald-400" : "h-9 w-9 bg-[#d8ad55]/[0.08] text-[#d8ad55]"}`}>{hasTeam ? <ShieldCheck size={16} /> : <Swords size={17} />}</div>

                    <div className="min-w-0">
                        <div className={`mb-0.5 flex items-center gap-1.5 whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.16em] ${hasTeam ? "text-emerald-400" : "text-[#d8ad55]"}`}>
                            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${hasTeam ? "bg-emerald-400" : "bg-[#d8ad55]"}`} />
                            {hasTeam ? "Squad ready" : "Ready to compete"}
                        </div>

                        <h3 className="truncate font-[GoogleSans] text-sm font-semibold tracking-tight sm:text-base">{hasTeam ? `${userTeam.team_name} is ready.` : "Build your squad."}</h3>

                        <p className="truncate text-[10px] text-white/35 sm:text-[11px]">{hasTeam ? "Find a tournament and take your squad to battle." : "Create or join a team to enter tournaments."}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className={`flex shrink-0 gap-2 ${hasTeam ? "items-center" : "flex-col sm:flex-row sm:items-center"}`}>
                    {hasTeam ? (
                        <>
                            <button onClick={onViewTeam} className="hidden px-2 py-2 text-[11px] text-white/40 transition-colors hover:text-white sm:block">View squad</button>
                            <button onClick={onExploreTournaments} className="flex items-center justify-center gap-1 rounded-lg bg-[#d8ad55] px-3 py-2 text-[10px] font-semibold text-black transition-transform hover:-translate-y-px sm:text-[11px]">Explore tournaments <ArrowRight size={12} /></button>
                        </>
                    ) : (
                        <>
                            <button onClick={onCreateTeam} className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#d8ad55] px-4 py-2.5 text-[10px] font-semibold text-black transition-transform hover:-translate-y-px sm:w-auto sm:px-3 sm:py-2 sm:text-[11px]"><Plus size={12} /> Create Team <ArrowRight size={12} /></button>
                            <button onClick={onJoinTeam} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 px-4 py-2.5 text-[10px] font-medium text-white/55 transition-transform hover:-translate-y-px hover:text-white sm:w-auto sm:px-3 sm:py-2 sm:text-[11px]"><Users size={12} /> Find a Team</button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CompetitionBanner;