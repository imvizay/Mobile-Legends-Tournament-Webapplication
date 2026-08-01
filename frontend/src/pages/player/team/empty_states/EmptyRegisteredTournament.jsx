import React from "react";
import { ArrowUpRight, CalendarDays, Search, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const tournamentFallbacks = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=1200&q=85",
];

export default function EmptyRegisteredTournament() {
    const navigate = useNavigate();

    return (
        <section className="min-w-0">
            <div className="mb-3 flex items-end justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="text-[17px] font-bold uppercase leading-none tracking-[-0.025em]" style={{ color: "var(--headline-primary)" }}>
                        Registered Tournament
                    </h2>

                    <p className="mt-1 text-[7px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                        Tournament participation
                    </p>
                </div>

                <span className="shrink-0 text-[7px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
                    No Active Registration
                </span>
            </div>

            <article className="group relative isolate min-h-[310px] overflow-hidden rounded-[18px] border sm:min-h-[340px]" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)" }}>
                <div className="absolute inset-0 -z-30 overflow-hidden">
                    <img src={tournamentFallbacks[0]} alt="" className="h-full w-full object-cover opacity-[0.13] grayscale transition duration-700 group-hover:scale-[1.025] group-hover:opacity-[0.18]" />
                </div>

                <div className="absolute inset-0 -z-20" style={{ background: "linear-gradient(115deg, var(--surface-elevated) 0%, color-mix(in srgb, var(--surface-elevated) 94%, transparent) 42%, color-mix(in srgb, var(--surface-elevated) 72%, transparent) 100%)" }} />

                <div className="absolute -right-16 -top-16 -z-10 size-52 rounded-full border" style={{ borderColor: "color-mix(in srgb, var(--accent-gold) 8%, transparent)" }} />

                <div className="absolute -bottom-24 -right-10 -z-10 size-64 rounded-full border" style={{ borderColor: "color-mix(in srgb, var(--accent-gold) 5%, transparent)" }} />

                <div className="flex min-h-[310px] flex-col justify-between p-5 sm:min-h-[340px] sm:p-7 lg:p-8">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-lg border" style={{ background: "color-mix(in srgb, var(--accent-gold) 7%, transparent)", borderColor: "color-mix(in srgb, var(--accent-gold) 18%, var(--border-default))" }}>
                                <Search size={12} strokeWidth={1.8} style={{ color: "var(--accent-gold)" }} />
                            </span>

                            <span className="text-[7px] font-bold uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>
                                Open Competition
                            </span>
                        </div>

                        <span className="flex items-center gap-1.5 text-[6px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
                            <span className="size-1.5 rounded-full" style={{ background: "var(--accent-gold)" }} />
                            Registration Available
                        </span>
                    </div>

                    <div className="max-w-[560px]">
                        <p className="mb-2 text-[7px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--accent-gold)" }}>
                            Your next competition starts here
                        </p>

                        <h3 className="max-w-[600px] text-[31px] font-black uppercase leading-[0.92] tracking-[-0.045em] sm:text-[40px] lg:text-[48px]" style={{ color: "var(--text-primary)" }}>
                            Find your next
                            <br />
                            <span style={{ color: "var(--accent-gold)" }}>tournament.</span>
                        </h3>

                        <p className="mt-3 max-w-[430px] text-[8px] font-medium leading-[1.6] sm:text-[9px]" style={{ color: "var(--text-muted)" }}>
                            Your team is ready for competition, but there are no active tournament registrations yet. Explore upcoming events, compare prize pools, and register your team for the next battle.
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-2.5">
                            <button type="button" onClick={() => navigate("/player/tournaments")} className="group/button flex h-9 items-center gap-2 rounded-lg px-4 text-[7px] font-bold uppercase tracking-[0.1em] transition-transform hover:-translate-y-px sm:h-10 sm:px-5" style={{ background: "var(--accent-gold)", color: "var(--bg-canvas)" }}>
                                Explore Tournaments

                                <ArrowUpRight size={12} strokeWidth={2.2} className="transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" />
                            </button>

                            <button type="button" onClick={() => navigate("/player/tournaments")} className="flex h-9 items-center gap-2 rounded-lg border px-4 text-[7px] font-bold uppercase tracking-[0.1em] transition-colors hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] sm:h-10 sm:px-5" style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)", background: "color-mix(in srgb, var(--surface-base) 45%, transparent)" }}>
                                <CalendarDays size={11} />
                                View Schedule
                            </button>
                        </div>
                    </div>

                    <div className="mt-7 grid max-w-[560px] grid-cols-3 border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
                        <EmptyMeta icon={<Trophy size={10} />} label="Upcoming Events" value="Explore" />

                        <EmptyMeta icon={<Users size={10} />} label="Team Format" value="5v5" />

                        <EmptyMeta icon={<CalendarDays size={10} />} label="Registration" value="Open" />
                    </div>
                </div>
            </article>
        </section>
    );
}

function EmptyMeta({ icon, label, value }) {
    return (
        <div className="min-w-0 border-r px-3 first:pl-0 last:border-r-0 sm:px-4">
            <div className="flex items-center gap-1.5">
                <span style={{ color: "var(--accent-gold)" }}>{icon}</span>

                <span className="truncate text-[6px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>
                    {label}
                </span>
            </div>

            <p className="mt-1 text-[8px] font-bold uppercase" style={{ color: "var(--text-secondary)" }}>
                {value}
            </p>
        </div>
    );
}