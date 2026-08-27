import React from "react";
import { BadgeCheck, CalendarCheck, Check, CircleAlert, Flag, Gift, LockKeyhole, Medal, ShieldCheck, Swords, Trophy, Users } from "lucide-react";

const tournamentStages = [
    { id: "registration", label: "REGISTRATION", shortLabel: "REGISTRATION", icon: CalendarCheck, description: "TEAM REGISTERED" },
    { id: "rosters", label: "ROSTERS", shortLabel: "ROSTERS", icon: Users, description: "ROSTER CONFIRMED" },
    { id: "checkin", label: "CHECK-IN", shortLabel: "CHECK-IN", icon: BadgeCheck, description: "ARRIVAL CONFIRMED" },
    { id: "round1", label: "ROUND 1", shortLabel: "R1", icon: Swords, description: "MATCH STAGE" },
    { id: "round2", label: "ROUND 2", shortLabel: "R2", icon: Swords, description: "MATCH STAGE" },
    { id: "round3", label: "ROUND 3", shortLabel: "R3", icon: Swords, description: "OPTIONAL STAGE", optional: true },
    { id: "quarterfinal", label: "QUARTER FINAL", shortLabel: "QF", icon: Medal, description: "OPTIONAL STAGE", optional: true },
    { id: "semifinal", label: "SEMI FINAL", shortLabel: "SF", icon: Trophy, description: "FINAL FOUR" },
    { id: "final", label: "FINAL", shortLabel: "FINAL", icon: Trophy, description: "BEST OF 5" },
    { id: "verification", label: "VERIFICATION", shortLabel: "VERIFY", icon: ShieldCheck, description: "RESULT VERIFIED" },
    { id: "rewards", label: "REWARDS", shortLabel: "REWARDS", icon: Gift, description: "REWARD DISTRIBUTION" },
];

const stageIndex = tournamentStages.reduce((acc, stage, index) => {
    acc[stage.id] = index;
    return acc;
}, {});

export default function TournamentRoadmap({ currentStage = "round2", disqualified = false, disqualifiedStage = null }) {
    const currentIndex = stageIndex[currentStage] ?? 0;
    const disqualifiedIndex = disqualified && disqualifiedStage ? stageIndex[disqualifiedStage] ?? currentIndex : -1;

    return (
        <section className="w-full">
            <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold uppercase tracking-[-0.02em]" style={{ color: "var(--headline-primary)" }}>Tournament Roadmap</h2>
                    <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.13em]" style={{ color: "var(--text-muted)" }}>Current Tournament Journey</p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 text-[7px] font-bold uppercase tracking-[0.12em]" style={{ color: disqualified ? "var(--status-danger, #ef4444)" : "var(--accent-gold)" }}>
                    <span className="size-1.5 rounded-full" style={{ background: disqualified ? "var(--status-danger, #ef4444)" : "var(--accent-gold)" }} />
                    {disqualified ? "TEAM DISQUALIFIED" : "TOURNAMENT IN PROGRESS"}
                </div>
            </div>

            <div className="overflow-hidden rounded-[16px] border" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)" }}>
                <div className="px-3.5 py-4 sm:px-5">
                    <div className="hidden md:block">
                        <DesktopRoadmap currentIndex={currentIndex} disqualifiedIndex={disqualifiedIndex} disqualified={disqualified} />
                    </div>

                    <div className="md:hidden">
                        <MobileRoadmap currentIndex={currentIndex} disqualifiedIndex={disqualifiedIndex} disqualified={disqualified} />
                    </div>
                </div>

                <RoadmapFooter currentStage={currentStage} disqualified={disqualified} />
            </div>
        </section>
    );
}

function DesktopRoadmap({ currentIndex, disqualifiedIndex, disqualified }) {
    return (
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-[920px] items-start">
                {tournamentStages.map((stage, index) => {
                    const isCompleted = index < currentIndex && !(disqualified && index >= disqualifiedIndex);
                    const isCurrent = !disqualified && index === currentIndex;
                    const isDisqualified = disqualified && index === disqualifiedIndex;
                    const isLocked = disqualified ? index > disqualifiedIndex : index > currentIndex;

                    return (
                        <React.Fragment key={stage.id}>
                            <RoadmapNode stage={stage} isCompleted={isCompleted} isCurrent={isCurrent} isDisqualified={isDisqualified} isLocked={isLocked} />
                            {index < tournamentStages.length - 1 && <RoadmapConnector completed={isCompleted || isCurrent || (disqualified && index < disqualifiedIndex)} disqualified={disqualified && index === disqualifiedIndex} />}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

function MobileRoadmap({ currentIndex, disqualifiedIndex, disqualified }) {
    return (
        <div className="relative">
            <div className="absolute bottom-5 left-[11px] top-5 w-px" style={{ background: "var(--border-subtle)" }} />

            <div className="space-y-0">
                {tournamentStages.map((stage, index) => {
                    const isCompleted = index < currentIndex && !(disqualified && index >= disqualifiedIndex);
                    const isCurrent = !disqualified && index === currentIndex;
                    const isDisqualified = disqualified && index === disqualifiedIndex;
                    const isLocked = disqualified ? index > disqualifiedIndex : index > currentIndex;

                    return <MobileRoadmapNode key={stage.id} stage={stage} isCompleted={isCompleted} isCurrent={isCurrent} isDisqualified={isDisqualified} isLocked={isLocked} />;
                })}
            </div>
        </div>
    );
}

function RoadmapNode({ stage, isCompleted, isCurrent, isDisqualified, isLocked }) {
    const Icon = isDisqualified ? CircleAlert : isLocked ? LockKeyhole : stage.icon;

    const accentColor = isDisqualified
        ? "var(--status-danger, #ef4444)"
        : isCurrent
          ? "var(--accent-gold)"
          : isCompleted
            ? "var(--text-secondary)"
            : "var(--text-muted)";

    const backgroundColor = isCurrent
        ? "color-mix(in srgb, var(--accent-gold) 9%, var(--surface-base))"
        : isDisqualified
          ? "color-mix(in srgb, var(--status-danger, #ef4444) 8%, var(--surface-base))"
          : "var(--surface-base)";

    const borderColor = isDisqualified
        ? "color-mix(in srgb, var(--status-danger, #ef4444) 35%, var(--border-default))"
        : isCurrent
          ? "color-mix(in srgb, var(--accent-gold) 35%, var(--border-default))"
          : "var(--border-subtle)";

    return (
        <div className="flex w-[76px] shrink-0 flex-col items-center text-center">
            <div className="relative flex size-[27px] items-center justify-center rounded-full border" style={{ background: backgroundColor, borderColor }}>
                <Icon size={11} strokeWidth={isCurrent || isDisqualified ? 2 : 1.7} style={{ color: accentColor }} />
                {isCompleted && <span className="absolute -right-0.5 -top-0.5 flex size-3 items-center justify-center rounded-full" style={{ background: "var(--accent-gold)" }}><Check size={7} color="var(--bg-canvas)" strokeWidth={3} /></span>}
            </div>

            <p className="mt-2 text-[7px] font-bold uppercase leading-tight tracking-[0.08em]" style={{ color: accentColor }}>{stage.shortLabel}</p>

            <p className="mt-1 text-[6px] font-medium uppercase leading-tight tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
                {isDisqualified ? "DISQUALIFIED" : isCurrent ? "CURRENT STAGE" : stage.description}
            </p>

            {stage.optional && !isCurrent && !isDisqualified && <span className="mt-1 text-[5px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>OPTIONAL</span>}
        </div>
    );
}

function RoadmapConnector({ completed, disqualified }) {
    return <div className="mt-[13px] h-px min-w-[18px] flex-1" style={{ background: disqualified ? "var(--status-danger, #ef4444)" : completed ? "var(--accent-gold)" : "var(--border-subtle)" }} />;
}

function MobileRoadmapNode({ stage, isCompleted, isCurrent, isDisqualified, isLocked }) {
    const Icon = isDisqualified ? CircleAlert : isLocked ? LockKeyhole : stage.icon;

    const accentColor = isDisqualified
        ? "var(--status-danger, #ef4444)"
        : isCurrent
          ? "var(--accent-gold)"
          : isCompleted
            ? "var(--text-primary)"
            : "var(--text-muted)";

    const borderColor = isDisqualified
        ? "color-mix(in srgb, var(--status-danger, #ef4444) 35%, var(--border-default))"
        : isCurrent
          ? "color-mix(in srgb, var(--accent-gold) 35%, var(--border-default))"
          : "var(--border-subtle)";

    const backgroundColor = isDisqualified
        ? "color-mix(in srgb, var(--status-danger, #ef4444) 7%, var(--surface-elevated))"
        : "var(--surface-elevated)";

    return (
        <div className="relative flex min-h-[48px] items-center gap-3">
            <div className="relative z-10 flex size-[23px] shrink-0 items-center justify-center rounded-full border" style={{ background: backgroundColor, borderColor }}>
                <Icon size={10} style={{ color: accentColor }} />
                {isCompleted && <span className="absolute -right-0.5 -top-0.5 flex size-2.5 items-center justify-center rounded-full" style={{ background: "var(--accent-gold)" }}><Check size={6} color="var(--bg-canvas)" strokeWidth={3} /></span>}
            </div>

            <div className="min-w-0 flex-1 py-1">
                <div className="flex items-center gap-2">
                    <p className="text-[8px] font-bold uppercase tracking-[0.12em]" style={{ color: accentColor }}>{stage.label}</p>
                    {stage.optional && <span className="text-[6px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>OPTIONAL</span>}
                </div>

                <p className="mt-0.5 text-[7px] font-medium uppercase tracking-[0.06em]" style={{ color: isDisqualified ? "var(--status-danger, #ef4444)" : "var(--text-muted)" }}>
                    {isDisqualified ? "TEAM DISQUALIFIED AT THIS STAGE" : isCurrent ? "CURRENT STAGE" : isCompleted ? "COMPLETED" : stage.description}
                </p>
            </div>

            {isCurrent && !isDisqualified && <span className="shrink-0 text-[6px] font-bold uppercase tracking-[0.1em]" style={{ color: "var(--accent-gold)" }}>NOW</span>}
        </div>
    );
}

function RoadmapFooter({ currentStage, disqualified }) {
    const stage = tournamentStages.find((item) => item.id === currentStage);

    return (
        <div className="border-t px-3.5 py-2.5 sm:px-5" style={{ background: disqualified ? "color-mix(in srgb, var(--status-danger, #ef4444) 3%, transparent)" : "color-mix(in srgb, var(--accent-gold) 2.5%, transparent)", borderColor: "var(--border-subtle)" }}>
            <div className="flex items-start gap-2">
                {disqualified ? <CircleAlert size={11} className="mt-0.5 shrink-0" style={{ color: "var(--status-danger, #ef4444)" }} /> : <Flag size={11} className="mt-0.5 shrink-0" style={{ color: "var(--accent-gold)" }} />}

                <p className="text-[7px] leading-[1.55]" style={{ color: disqualified ? "var(--text-secondary)" : "var(--text-muted)" }}>
                    {disqualified ? "THIS TEAM IS NO LONGER ELIGIBLE TO PROGRESS THROUGH THE TOURNAMENT. THE DISQUALIFICATION WAS RECORDED AT THE INDICATED STAGE." : `CURRENT STAGE: ${stage?.label || "TOURNAMENT"}. COMPLETED STAGES ARE MARKED WITH A CHECK, WHILE UPCOMING STAGES REMAIN LOCKED UNTIL THE TEAM ADVANCES.`}
                </p>
            </div>
        </div>
    );
}