import React from "react";
import { ArrowRight, Compass, Plus, ShieldCheck, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyTeamState() {
    const navigate = useNavigate();

    return (
        <section className="relative isolate min-h-[560px] overflow-hidden rounded-[20px] border" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)" }}>
            {/* Subtle competitive atmosphere */}
            <div className="pointer-events-none absolute inset-0 -z-20" style={{ background: "radial-gradient(circle at 88% 15%, color-mix(in srgb, var(--accent-gold) 7%, transparent), transparent 32%)" }} />

            <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

            <div className="relative flex min-h-[560px] flex-col">
                {/* Main Content */}
                <div className="flex flex-1 items-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
                    <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)] lg:gap-14 xl:gap-20">

                        {/* Left Content */}
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-[var(--accent-gold)]" />

                                <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                                    Competitive Access
                                </span>
                            </div>

                            <h1 className="mt-4 max-w-[620px] text-[30px] font-black uppercase leading-[0.95] tracking-[-0.04em] text-[var(--headline-primary)] sm:text-[38px] lg:text-[46px]">
                                Build your team
                                <br />
                                <span className="text-[var(--text-secondary)]">
                                    before you compete.
                                </span>
                            </h1>

                            <p className="mt-5 max-w-[590px] text-[11px] leading-[1.75] text-[var(--text-secondary)] sm:text-[12px]">
                                Tournament participation is team-based. Join an existing squad or create your own team to build a roster, select competitive players, and register for upcoming tournaments.
                            </p>

                            {/* Requirement Notice */}
                            <div className="mt-6 flex max-w-[600px] items-start gap-3 border-l-2 pl-3.5" style={{ borderColor: "var(--accent-gold)" }}>
                                <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[var(--accent-gold)]" />

                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-primary)]">
                                        Team membership required
                                    </p>

                                    <p className="mt-1 text-[8px] leading-[1.6] text-[var(--text-muted)]">
                                        Players must belong to a team before they can participate in team-based tournaments, manage a tournament roster, or contribute toward tournament entry fees.
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-7 flex flex-col gap-2.5 xs:flex-row xs:flex-wrap sm:mt-8">
                                <button type="button" onClick={() => navigate("/player/team/create")} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-5 text-[9px] font-bold uppercase tracking-[0.1em] transition duration-200 hover:-translate-y-px hover:brightness-105 active:translate-y-0" style={{ background: "var(--accent-gold)", color: "var(--bg-canvas)" }}>
                                    <Plus size={14} strokeWidth={2.4} />
                                    Create Team
                                </button>

                                <button type="button" onClick={() => navigate("/player/team/discover")} className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-5 text-[9px] font-bold uppercase tracking-[0.1em] transition-colors duration-200 hover:bg-[var(--surface-elevated)]" style={{ background: "var(--surface-base)", borderColor: "var(--border-default)", color: "var(--text-primary)" }}>
                                    <Compass size={14} strokeWidth={2} />
                                    Discover Teams
                                    <ArrowRight size={12} />
                                </button>
                            </div>
                        </div>

                        {/* Right Competitive Structure */}
                        <div className="hidden lg:block">
                            <div className="relative ml-auto max-w-[360px] overflow-hidden rounded-[16px] border p-5" style={{ background: "color-mix(in srgb, var(--surface-elevated) 82%, transparent)", borderColor: "var(--border-default)" }}>

                                {/* Header */}
                                <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--border-subtle)" }}>
                                    <div>
                                        <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                                            Competition Path
                                        </p>

                                        <h3 className="mt-1 text-[13px] font-bold uppercase tracking-[-0.02em] text-[var(--text-primary)]">
                                            From team to tournament
                                        </h3>
                                    </div>

                                    <Trophy size={18} strokeWidth={1.7} className="text-[var(--accent-gold)]" />
                                </div>

                                {/* Steps */}
                                <div className="divide-y divide-[var(--border-subtle)]">
                                    <CompetitionStep number="01" icon={<Users size={13} />} title="Join or create a team" description="Become part of an active competitive squad." />

                                    <CompetitionStep number="02" icon={<ShieldCheck size={13} />} title="Build the tournament roster" description="Select eligible players for tournament participation." />

                                    <CompetitionStep number="03" icon={<Trophy size={13} />} title="Register and compete" description="Complete tournament requirements and enter competition." />
                                </div>

                                {/* Footer */}
                                <div className="mt-4 border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
                                    <div className="flex items-center gap-2">
                                        <span className="size-1.5 rounded-full bg-[var(--text-muted)]" />

                                        <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                                            Current status
                                        </span>
                                    </div>

                                    <p className="mt-1.5 text-[9px] font-semibold text-[var(--text-secondary)]">
                                        Not assigned to a team
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom status strip */}
                <div className="border-t px-5 py-3 sm:px-8 lg:px-10" style={{ borderColor: "var(--border-subtle)", background: "color-mix(in srgb, var(--surface-elevated) 55%, transparent)" }}>
                    <div className="flex flex-col gap-2 text-[7px] font-medium uppercase tracking-[0.11em] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
                        <span>Team workspace unavailable</span>

                        <span className="hidden items-center gap-2 sm:flex">
                            <span className="size-1 rounded-full bg-[var(--accent-gold)]" />
                            Join a team to unlock competitive features
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

function CompetitionStep({ number, icon, title, description }) {
    return (
        <div className="flex gap-3 py-4">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border" style={{ background: "var(--surface-base)", borderColor: "var(--border-subtle)", color: "var(--accent-gold)" }}>
                {icon}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <span className="text-[7px] font-bold tracking-[0.12em] text-[var(--accent-gold)]">
                        {number}
                    </span>

                    <h4 className="text-[9px] font-bold uppercase tracking-[0.03em] text-[var(--text-primary)]">
                        {title}
                    </h4>
                </div>

                <p className="mt-1 text-[8px] leading-[1.55] text-[var(--text-muted)]">
                    {description}
                </p>
            </div>
        </div>
    );
}