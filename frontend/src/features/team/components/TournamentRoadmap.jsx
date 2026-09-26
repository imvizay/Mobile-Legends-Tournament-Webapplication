import React from "react";
import {
    BadgeCheck,
    Check,
    ClipboardCheck,
    CreditCard,
    ShieldCheck,
    Users,
} from "lucide-react";

const registrationStages = [
    {
        id: "team_registered",
        label: "Team Registered",
        description: "Application submitted",
        info: "Application received",
        icon: ClipboardCheck,
    },
    {
        id: "roster_selected",
        label: "Roster Selected",
        description: "Players selected",
        icon: Users,
    },
    {
        id: "roster_confirmed",
        label: "Roster Confirmed",
        description: "Roster approved",
        icon: BadgeCheck,
    },
    {
        id: "player_payments",
        label: "Player Payments",
        description: "Contributions verified",
        icon: CreditCard,
    },
    {
        id: "registration_confirmed",
        label: "Registration",
        description: "Tournament entry",
        icon: ShieldCheck,
    },
];

const stageIndex = registrationStages.reduce((acc, stage, index) => {
    acc[stage.id] = index;
    return acc;
}, {});

export default function TeamTournamentRoadmap({
    currentStage = "registration_confirmed",
    rosterSelected = 0,
    rosterRequired = 5,
    paymentsPaid = 0,
    paymentsRequired = 5,
    registrationStatus = null,
}) {

    const currentIndex = stageIndex[currentStage] ?? 0;

    const stageInfo = {
        team_registered: {
            value: "Submitted",
        },

        roster_selected: {
            value: `${rosterSelected}/${rosterRequired} selected`,
        },

        roster_confirmed: {
            value: registrationStatus === "confirmed"
                ? "Confirmed"
                : "Pending confirmation",
        },

        player_payments: {
            value: `${paymentsPaid}/${paymentsRequired} paid`,
        },

        registration_confirmed: {
            value:
                registrationStatus === "confirmed"
                    ? "Confirmed"
                    : "Under review",
        },
    };

    return (
        <section className="w-full">
            {/* Heading stays outside the main container */}
            <div className="mb-2.5 flex items-end justify-between gap-3 px-0.5">
                <div className="min-w-0">
                    <h2
                        className="text-[14px] font-semibold tracking-[-0.025em] sm:text-[15px]"
                        style={{ color: "var(--headline-primary)" }}
                    >
                        Registration Progress
                    </h2>

                    <p
                        className="mt-0.5 text-[7px] font-medium uppercase tracking-[0.13em] sm:text-[8px]"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Team application journey
                    </p>
                </div>

                <div
                    className="flex shrink-0 items-center gap-1.5 text-[6px] font-bold uppercase tracking-[0.12em] sm:text-[7px]"
                    style={{ color: "var(--accent-gold)" }}
                >
                    <span
                        className="size-1.5 rounded-full"
                        style={{
                            background: "var(--accent-gold)",
                        }}
                    />
                    In progress
                </div>
            </div>

            {/* Main roadmap container */}
            <div
                className="overflow-hidden rounded-[14px] border sm:rounded-[16px]"
                style={{
                    background: "var(--surface-elevated)",
                    borderColor: "var(--border-default)",
                }}
            >
                <div className="px-3.5 py-3.5 sm:px-5 sm:py-4">
                    {/* Desktop */}
                    <div className="hidden md:block">
                        <DesktopRoadmap
                            currentIndex={currentIndex}
                            stageInfo={stageInfo}
                        />
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden">
                        <MobileRoadmap
                            currentIndex={currentIndex}
                            stageInfo={stageInfo}
                        />
                    </div>
                </div>

                <div
                    className="border-t px-3.5 py-2 sm:px-5"
                    style={{
                        borderColor: "var(--border-subtle)",
                        background:
                            "color-mix(in srgb, var(--accent-gold) 2%, transparent)",
                    }}
                >
                    <div className="flex items-center gap-2">
                        <ShieldCheck
                            size={10}
                            className="shrink-0"
                            style={{
                                color: "var(--accent-gold)",
                            }}
                        />

                        <p
                            className="text-[6.5px] font-medium leading-4 sm:text-[7px]"
                            style={{
                                color: "var(--text-muted)",
                            }}
                        >
                            Your registration status updates automatically as
                            each requirement is completed and verified.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function DesktopRoadmap({ currentIndex, stageInfo }) {
    return (
        <div className="flex items-start">
            {registrationStages.map((stage, index) => {
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;

                return (
                    <React.Fragment key={stage.id}>
                        <DesktopNode
                            stage={stage}
                            index={index}
                            isCompleted={isCompleted}
                            isCurrent={isCurrent}
                            info={stageInfo[stage.id]}
                        />

                        {index < registrationStages.length - 1 && (
                            <DesktopConnector completed={index < currentIndex} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

function DesktopNode({
    stage,
    index,
    isCompleted,
    isCurrent,
    info,
}) {
    const Icon = stage.icon;

    const accentColor = isCurrent
        ? "var(--accent-gold)"
        : isCompleted
            ? "var(--text-primary)"
            : "var(--text-muted)";

    const nodeBackground = isCurrent
        ? "color-mix(in srgb, var(--accent-gold) 9%, var(--surface-base))"
        : "var(--surface-base)";

    const nodeBorder = isCurrent
        ? "color-mix(in srgb, var(--accent-gold) 40%, var(--border-default))"
        : "var(--border-subtle)";

    return (
        <div className="flex w-[112px] shrink-0 flex-col items-center text-center">
            <div
                className="relative flex size-[28px] items-center justify-center rounded-full border"
                style={{
                    background: nodeBackground,
                    borderColor: nodeBorder,
                }}
            >
                <Icon
                    size={11}
                    strokeWidth={isCurrent ? 2 : 1.7}
                    style={{
                        color: accentColor,
                    }}
                />

                {isCompleted && (
                    <span
                        className="absolute -right-1 -top-1 flex size-3 items-center justify-center rounded-full"
                        style={{
                            background: "var(--accent-gold)",
                        }}
                    >
                        <Check
                            size={7}
                            strokeWidth={3}
                            style={{
                                color: "var(--bg-canvas)",
                            }}
                        />
                    </span>
                )}
            </div>

            <p
                className="mt-2 text-[7px] font-bold uppercase leading-tight tracking-[0.08em]"
                style={{
                    color: accentColor,
                }}
            >
                {stage.label}
            </p>

            <p
                className="mt-1 text-[6.5px] font-medium leading-tight"
                style={{
                    color: isCurrent
                        ? "var(--accent-gold)"
                        : "var(--text-secondary)",
                }}
            >
                {info.value}
            </p>

            <p
                className="mt-0.5 text-[5.5px] leading-tight"
                style={{
                    color: "var(--text-muted)",
                }}
            >
                {isCurrent ? "Current stage" : stage.description}
            </p>
        </div>
    );
}

function DesktopConnector({ completed }) {
    return (
        <div className="mt-[14px] h-px min-w-[12px] flex-1">
            <div
                className="h-px w-full"
                style={{
                    background: completed
                        ? "var(--accent-gold)"
                        : "var(--border-subtle)",
                }}
            />
        </div>
    );
}

function MobileRoadmap({ currentIndex, stageInfo }) {
    return (
        <div className="relative">
            <div
                className="absolute bottom-4 left-[12px] top-4 w-px"
                style={{
                    background: "var(--border-subtle)",
                }}
            />

            <div className="space-y-0">
                {registrationStages.map((stage, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <MobileNode
                            key={stage.id}
                            stage={stage}
                            isCompleted={isCompleted}
                            isCurrent={isCurrent}
                            info={stageInfo[stage.id]}
                        />
                    );
                })}
            </div>
        </div>
    );
}

function MobileNode({
    stage,
    isCompleted,
    isCurrent,
    info,
}) {
    const Icon = stage.icon;

    const accentColor = isCurrent
        ? "var(--accent-gold)"
        : isCompleted
            ? "var(--text-primary)"
            : "var(--text-muted)";

    const background = isCurrent
        ? "color-mix(in srgb, var(--accent-gold) 8%, var(--surface-elevated))"
        : "var(--surface-elevated)";

    const border = isCurrent
        ? "color-mix(in srgb, var(--accent-gold) 40%, var(--border-default))"
        : "var(--border-subtle)";

    return (
        <div className="relative flex min-h-[49px] items-center gap-3">
            <div
                className="relative z-10 flex size-[25px] shrink-0 items-center justify-center rounded-full border"
                style={{
                    background,
                    borderColor: border,
                }}
            >
                <Icon
                    size={10}
                    strokeWidth={isCurrent ? 2 : 1.7}
                    style={{
                        color: accentColor,
                    }}
                />

                {isCompleted && (
                    <span
                        className="absolute -right-1 -top-1 flex size-2.5 items-center justify-center rounded-full"
                        style={{
                            background: "var(--accent-gold)",
                        }}
                    >
                        <Check
                            size={6}
                            strokeWidth={3}
                            style={{
                                color: "var(--bg-canvas)",
                            }}
                        />
                    </span>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p
                        className="text-[7.5px] font-bold uppercase tracking-[0.08em]"
                        style={{
                            color: accentColor,
                        }}
                    >
                        {stage.label}
                    </p>

                    {isCurrent && (
                        <span
                            className="rounded-full px-1.5 py-0.5 text-[5px] font-bold uppercase tracking-[0.08em]"
                            style={{
                                color: "var(--accent-gold)",
                                background:
                                    "color-mix(in srgb, var(--accent-gold) 9%, transparent)",
                            }}
                        >
                            Current
                        </span>
                    )}
                </div>

                <div className="mt-0.5 flex items-center gap-2">
                    <span
                        className="text-[7px] font-semibold"
                        style={{
                            color: isCurrent
                                ? "var(--accent-gold)"
                                : "var(--text-secondary)",
                        }}
                    >
                        {info.value}
                    </span>

                    <span
                        className="text-[6px]"
                        style={{
                            color: "var(--text-muted)",
                        }}
                    >
                        {stage.description}
                    </span>
                </div>
            </div>
        </div>
    );
}