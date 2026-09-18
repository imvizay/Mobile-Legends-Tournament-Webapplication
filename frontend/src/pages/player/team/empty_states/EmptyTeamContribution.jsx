import React from "react";
import {
    Check,
    IndianRupee,
    LockKeyhole,
    ShieldCheck,
    UsersRound,
} from "lucide-react";

export default function EmptyTeamContribution({
    rosterCount = 0,
    rosterRequired = 5,
    rosterLocked = false,
    registrationClosingAt,
}) {
    const rosterComplete = rosterCount >= rosterRequired;
    const contributionAvailable = rosterComplete && rosterLocked;

    const steps = [
        {
            number: "01",
            title: "Select Roster",
            description: `Select ${rosterRequired} eligible players.`,
            completed: rosterComplete,
            active: !rosterComplete,
            icon: <UsersRound size={12} />,
        },
        {
            number: "02",
            title: "Lock Roster",
            description: "Confirm your selected roster.",
            completed: rosterLocked,
            active: rosterComplete && !rosterLocked,
            icon: <LockKeyhole size={12} />,
        },
        {
            number: "03",
            title: "Contribute",
            description: "Roster members complete their contribution.",
            completed: false,
            active: contributionAvailable,
            icon: <IndianRupee size={12} />,
        },
    ];

    return (
        <section className="min-w-0">
            {/* Header */}
            <div className="mb-2.5 flex items-end justify-between gap-3 sm:mb-3">
                <div className="min-w-0">
                    <h2
                        className="text-[14px] font-bold uppercase leading-none tracking-[-0.02em] sm:text-[16px]"
                        style={{ color: "var(--headline-primary)" }}
                    >
                        Team Contribution
                    </h2>

                    <p
                        className="mt-1 text-[6px] font-semibold uppercase tracking-[0.12em] sm:text-[7px] sm:tracking-[0.14em]"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Tournament Entry Requirement
                    </p>
                </div>
            </div>

            <article
                className="relative overflow-hidden rounded-[14px] border sm:rounded-[18px]"
                style={{
                    background: "var(--surface-elevated)",
                    borderColor: "var(--border-default)",
                }}
            >
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-px"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent-gold) 35%, transparent), transparent)",
                    }}
                />

                <div className="p-3 sm:p-5">

                    {/* Status */}
                    <div className="flex items-center gap-2.5 sm:items-start sm:gap-3">
                        <div
                            className="flex size-8 shrink-0 items-center justify-center rounded-[9px] border sm:size-9 sm:rounded-xl"
                            style={{
                                background:
                                    "color-mix(in srgb, var(--accent-gold) 6%, var(--surface-base))",
                                borderColor:
                                    "color-mix(in srgb, var(--accent-gold) 16%, var(--border-default))",
                            }}
                        >
                            <IndianRupee
                                size={14}
                                strokeWidth={1.8}
                                style={{ color: "var(--accent-gold)" }}
                            />
                        </div>

                        <div className="min-w-0">
                            <h3
                                className="text-[11px] font-bold leading-[1.3] tracking-[-0.01em] sm:mt-1 sm:text-[14px]"
                                style={{ color: "var(--text-primary)" }}
                            >
                                {contributionAvailable
                                    ? "Your roster is ready for contribution."
                                    : "Complete the roster requirements first."}
                            </h3>

                            <p
                                className="mt-1 text-[7px] leading-[1.45] sm:mt-1.5 sm:text-[8px] sm:leading-[1.65]"
                                style={{ color: "var(--text-muted)" }}
                            >
                                Contributions become available after the required
                                roster is selected and locked.
                            </p>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="mt-3.5 space-y-1.5 sm:mt-5 sm:space-y-2.5">
                        {steps.map((step, index) => (
                            <ContributionStep
                                key={step.number}
                                step={step}
                                isLast={index === steps.length - 1}
                            />
                        ))}
                    </div>

                    {/* Roster Progress */}
                    <div
                        className="mt-3.5 rounded-[10px] border p-2.5 sm:mt-5 sm:rounded-xl sm:p-3"
                        style={{
                            background: "var(--surface-base)",
                            borderColor: "var(--border-subtle)",
                        }}
                    >
                        <div className="flex items-center justify-between gap-2.5">
                            <div className="min-w-0">
                                <p
                                    className="text-[6px] font-bold uppercase tracking-[0.12em] sm:text-[7px] sm:tracking-[0.14em]"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    Roster Requirement
                                </p>

                                <p
                                    className="mt-0.5 text-[10px] font-bold sm:mt-1 sm:text-[11px]"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    {rosterCount}
                                    <span style={{ color: "var(--text-muted)" }}>
                                        {" "}
                                        / {rosterRequired}
                                    </span>{" "}
                                    Players Selected
                                </p>
                            </div>

                            <div
                                className="flex size-7 shrink-0 items-center justify-center rounded-[8px] border sm:size-8 sm:rounded-lg"
                                style={{
                                    background: rosterComplete
                                        ? "color-mix(in srgb, var(--accent-gold) 7%, transparent)"
                                        : "var(--surface-elevated)",
                                    borderColor: rosterComplete
                                        ? "color-mix(in srgb, var(--accent-gold) 18%, var(--border-default))"
                                        : "var(--border-subtle)",
                                }}
                            >
                                {rosterComplete ? (
                                    <Check
                                        size={12}
                                        strokeWidth={2.5}
                                        style={{ color: "var(--accent-gold)" }}
                                    />
                                ) : (
                                    <UsersRound
                                        size={12}
                                        style={{ color: "var(--text-muted)" }}
                                    />
                                )}
                            </div>
                        </div>

                        <div
                            className="mt-2 h-[3px] overflow-hidden rounded-full sm:mt-3 sm:h-1"
                            style={{
                                background: "var(--surface-elevated)",
                            }}
                        >
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${Math.min(
                                        (rosterCount / rosterRequired) * 100,
                                        100
                                    )}%`,
                                    background: "var(--accent-gold)",
                                }}
                            />
                        </div>
                    </div>

                    {/* Notice */}
                    <div
                        className="mt-3 flex items-start gap-2 border-t pt-3 sm:mt-4 sm:gap-2.5 sm:pt-4"
                        style={{ borderColor: "var(--border-subtle)" }}
                    >
                        <ShieldCheck
                            size={11}
                            className="mt-0.5 shrink-0 sm:size-3"
                            style={{ color: "var(--accent-gold)" }}
                        />

                        <div className="min-w-0">
                            <p
                                className="text-[6px] font-bold uppercase tracking-[0.11em] sm:text-[7px] sm:tracking-[0.13em]"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                Tournament Eligibility
                            </p>

                            <p
                                className="mt-0.5 text-[6px] leading-[1.5] sm:mt-1 sm:text-[7px] sm:leading-[1.65]"
                                style={{ color: "var(--text-muted)" }}
                            >
                                Only completed roster members are eligible for
                                contribution. Once locked, roster membership
                                cannot be changed.
                            </p>

                            {registrationClosingAt && (
                                <p
                                    className="mt-1.5 text-[6px] font-semibold sm:mt-2 sm:text-[7px]"
                                    style={{ color: "var(--text-secondary)" }}
                                >
                                    Complete contribution before registration closes.
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
    const active = step.completed || step.active;

    return (
        <div className="relative flex gap-2 sm:gap-3">
            <div className="relative flex w-6 shrink-0 flex-col items-center sm:w-7">
                <div
                    className="flex size-6 shrink-0 items-center justify-center rounded-[7px] border sm:size-7 sm:rounded-lg"
                    style={{
                        background: active
                            ? "color-mix(in srgb, var(--accent-gold) 8%, var(--surface-base))"
                            : "var(--surface-base)",
                        borderColor: active
                            ? "color-mix(in srgb, var(--accent-gold) 22%, var(--border-default))"
                            : "var(--border-subtle)",
                        color: active
                            ? "var(--accent-gold)"
                            : "var(--text-muted)",
                    }}
                >
                    {step.completed ? (
                        <Check size={11} strokeWidth={2.5} />
                    ) : (
                        step.icon
                    )}
                </div>

                {!isLast && (
                    <span
                        className="mt-0.5 h-3 w-px sm:mt-1 sm:h-4"
                        style={{
                            background: step.completed
                                ? "color-mix(in srgb, var(--accent-gold) 25%, var(--border-subtle))"
                                : "var(--border-subtle)",
                        }}
                    />
                )}
            </div>

            <div className="min-w-0 flex-1 pb-1.5 sm:pb-2">
                <div className="flex min-w-0 items-center gap-1.5">
                    <span
                        className="text-[6px] font-black tracking-[0.1em] sm:text-[7px] sm:tracking-[0.12em]"
                        style={{
                            color: active
                                ? "var(--accent-gold)"
                                : "var(--text-muted)",
                        }}
                    >
                        {step.number}
                    </span>

                    <p
                        className="truncate text-[8px] font-bold uppercase tracking-[0.06em] sm:text-[9px] sm:tracking-[0.08em]"
                        style={{
                            color: active
                                ? "var(--text-primary)"
                                : "var(--text-secondary)",
                        }}
                    >
                        {step.title}
                    </p>

                    {step.completed && (
                        <span
                            className="hidden text-[6px] font-bold uppercase tracking-[0.1em] sm:inline"
                            style={{ color: "var(--accent-gold)" }}
                        >
                            Complete
                        </span>
                    )}
                </div>

                <p
                    className="mt-0.5 text-[6px] leading-[1.4] sm:mt-1 sm:text-[7px] sm:leading-[1.55]"
                    style={{ color: "var(--text-muted)" }}
                >
                    {step.description}
                </p>
            </div>
        </div>
    );
}