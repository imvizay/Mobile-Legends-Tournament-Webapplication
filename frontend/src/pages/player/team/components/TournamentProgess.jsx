import React from "react";
import { Check, Circle } from "lucide-react";

export default function TournamentProgress({ stages = [], currentStage }) {
    return (
        <section className="rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-elevated)] p-4 sm:p-5">
            <div className="mb-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--accent-gold)]">
                    Tournament Progress
                </p>

                <h2 className="mt-1 text-sm font-semibold">
                    Your competitive journey
                </h2>
            </div>

            <div className="flex overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex min-w-max flex-1 items-start">
                    {stages.map((stage, index) => {
                        const current = stage.id === currentStage;
                        const completed = stage.completed;

                        return (
                            <React.Fragment key={stage.id}>
                                <div className="flex min-w-[90px] flex-col items-center text-center">
                                    <div className={`flex size-8 items-center justify-center rounded-full border ${completed ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600" : current ? "border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]" : "border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-muted)]"}`}>
                                        {completed ? (
                                            <Check size={13} />
                                        ) : (
                                            <Circle size={11} />
                                        )}
                                    </div>

                                    <p className={`mt-2 text-[9px] font-semibold ${current ? "text-[var(--accent-gold)]" : "text-[var(--text-secondary)]"}`}>
                                        {stage.name}
                                    </p>

                                    <span className="mt-0.5 text-[7px] uppercase tracking-wider text-[var(--text-muted)]">
                                        {completed
                                            ? "Completed"
                                            : current
                                            ? "Current"
                                            : "Upcoming"}
                                    </span>
                                </div>

                                {index < stages.length - 1 && (
                                    <div className={`mt-4 h-px min-w-[40px] flex-1 ${completed ? "bg-emerald-400/50" : "bg-[var(--border-default)]"}`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}