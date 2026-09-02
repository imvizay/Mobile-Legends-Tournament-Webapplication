import React from "react";
import { Check, IndianRupee, LockKeyhole, ShieldCheck, UsersRound } from "lucide-react";

export default function EmptyTeamContribution({
    rosterCount = 0,
    rosterRequired = 5,
    rosterLocked = false,
    registrationClosingAt
}) {
    const rosterComplete = rosterCount >= rosterRequired;
    const contributionAvailable = rosterComplete && rosterLocked;

    console.log()

    const steps = [
        {
            number: "01",
            title: "Select Roster",
            description: `Select ${rosterRequired} eligible players for the tournament.`,
            completed: rosterComplete,
            active: !rosterComplete,
            icon: <UsersRound size={13} />,
        },
        {
            number: "02",
            title: "Lock Roster",
            description: "Confirm the selected roster before contribution begins.",
            completed: rosterLocked,
            active: rosterComplete && !rosterLocked,
            icon: <LockKeyhole size={13} />,
        },
        {
            number: "03",
            title: "Contribute",
            description: "Roster members pay their required entry contribution before registration closes.",
            completed: false,
            active: contributionAvailable,
            icon: <IndianRupee size={13} />,
        },
    ];

    return (
        <section className="min-w-0">
            <div className="mb-3 flex items-end justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="text-[16px] font-bold uppercase leading-none tracking-[-0.025em]" style={{ color: "var(--headline-primary)" }}>
                        Team Contribution
                    </h2>

                    <p className="mt-1 text-[7px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                        Tournament Entry Requirement
                    </p>
                </div>

                
            </div>

            <article className="relative overflow-hidden rounded-[18px] border" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)" }}>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent-gold) 35%, transparent), transparent)" }} />

                <div className="p-4 sm:p-5">
                    {/* Status */}
                    <div className="flex items-start gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border" style={{ background: "color-mix(in srgb, var(--accent-gold) 6%, var(--surface-base))", borderColor: "color-mix(in srgb, var(--accent-gold) 16%, var(--border-default))" }}>
                            <IndianRupee size={15} strokeWidth={1.8} style={{ color: "var(--accent-gold)" }} />
                        </div>

                        <div className="min-w-0">
                    
                            <h3 className="mt-1 text-[14px] font-bold tracking-[-0.02em]" style={{ color: "var(--text-primary)" }}>
                                {contributionAvailable ? "Your roster is ready for contribution." : "Complete the roster requirements first."}
                            </h3>

                            <p className="mt-1.5 text-[8px] leading-[1.65]" style={{ color: "var(--text-muted)" }}>
                                Tournament entry contributions become available only after the required competitive roster has been selected and officially locked.
                            </p>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-5 space-y-2.5">
                        {steps.map((step, index) => (
                            <ContributionStep key={step.number} step={step} isLast={index === steps.length - 1} />
                        ))}
                    </div>

                    {/* Roster Progress */}
                    <div className="mt-5 rounded-xl border p-3" style={{ background: "var(--surface-base)", borderColor: "var(--border-subtle)" }}>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[7px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                                    Roster Requirement
                                </p>

                                <p className="mt-1 text-[11px] font-bold" style={{ color: "var(--text-primary)" }}>
                                    {rosterCount} <span style={{ color: "var(--text-muted)" }}>/ {rosterRequired}</span> Players Selected
                                </p>
                            </div>

                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border" style={{ background: rosterComplete ? "color-mix(in srgb, var(--accent-gold) 7%, transparent)" : "var(--surface-elevated)", borderColor: rosterComplete ? "color-mix(in srgb, var(--accent-gold) 18%, var(--border-default))" : "var(--border-subtle)" }}>
                                {rosterComplete ? <Check size={13} strokeWidth={2.5} style={{ color: "var(--accent-gold)" }} /> : <UsersRound size={13} style={{ color: "var(--text-muted)" }} />}
                            </div>
                        </div>

                        <div className="mt-3 h-1 overflow-hidden rounded-full" style={{ background: "var(--surface-elevated)" }}>
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((rosterCount / rosterRequired) * 100, 100)}%`, background: "var(--accent-gold)" }} />
                        </div>
                    </div>

                    {/* Important Notice */}
                    <div className="mt-4 flex items-start gap-2.5 border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
                        <ShieldCheck size={12} className="mt-0.5 shrink-0" style={{ color: "var(--accent-gold)" }} />

                        <div className="min-w-0">
                            <p className="text-[7px] font-bold uppercase tracking-[0.13em]" style={{ color: "var(--text-secondary)" }}>
                                Tournament Eligibility
                            </p>

                            <p className="mt-1 text-[7px] leading-[1.65]" style={{ color: "var(--text-muted)" }}>
                                Only players included in the completed tournament roster are eligible to pay their contribution. After the roster is locked, roster membership cannot be changed according to tournament restrictions.
                            </p>

                            {registrationClosingAt && (
                                <p className="mt-2 text-[7px] font-semibold" style={{ color: "var(--text-secondary)" }}>
                                    Complete contribution before tournament registration closes.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </article>
        </section>
    );
}

function ContributionStep({ step, isLast }) {
    return (
        <div className="relative flex gap-3">
            <div className="relative flex flex-col items-center">
                <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg border ${step.completed || step.active ? "" : ""}`} style={{ background: step.completed ? "color-mix(in srgb, var(--accent-gold) 10%, var(--surface-base))" : step.active ? "var(--surface-base)" : "var(--surface-base)", borderColor: step.completed || step.active ? "color-mix(in srgb, var(--accent-gold) 22%, var(--border-default))" : "var(--border-subtle)", color: step.completed || step.active ? "var(--accent-gold)" : "var(--text-muted)" }}>
                    {step.completed ? <Check size={12} strokeWidth={2.5} /> : step.icon}
                </div>

                {!isLast && <span className="mt-1 h-4 w-px" style={{ background: step.completed ? "color-mix(in srgb, var(--accent-gold) 25%, var(--border-subtle))" : "var(--border-subtle)" }} />}
            </div>

            <div className="min-w-0 pb-2">
                <div className="flex items-center gap-2">
                    <span className="text-[7px] font-black tracking-[0.12em]" style={{ color: step.completed || step.active ? "var(--accent-gold)" : "var(--text-muted)" }}>
                        {step.number}
                    </span>

                    <p className="text-[9px] font-bold uppercase tracking-[0.08em]" style={{ color: step.completed || step.active ? "var(--text-primary)" : "var(--text-secondary)" }}>
                        {step.title}
                    </p>

                    {step.completed && <span className="text-[6px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--accent-gold)" }}>Complete</span>}
                </div>

                <p className="mt-1 text-[7px] leading-[1.55]" style={{ color: "var(--text-muted)" }}>
                    {step.description}
                </p>
            </div>
        </div>
    );
}