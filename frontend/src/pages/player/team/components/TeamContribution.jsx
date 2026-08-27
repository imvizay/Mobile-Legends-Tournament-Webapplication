import React from "react";
import { Check, Clock3, LockKeyhole, ShieldCheck, Users, WalletCards } from "lucide-react";

const teamMembers = [
    { id: 1, name: "Vijay Meena", role: "CAPTAIN", amount: 100, paidAt: "2 hours ago" },
    { id: 2, name: "Arjun Sharma", role: "PLAYER", amount: 100, paidAt: "3 hours ago" },
    { id: 3, name: "Rahul Verma", role: "PLAYER", amount: 100, paidAt: "5 hours ago" },
    { id: 4, name: "Aman Khan", role: "PLAYER", amount: 100, paidAt: "7 hours ago" },
    { id: 5, name: "Karan Singh", role: "PLAYER", amount: 0, paidAt: null },
];

const CONTRIBUTION_PER_PLAYER = 100;

export default function TeamContribution() {
    const paidMembers = teamMembers.filter((member) => member.amount >= CONTRIBUTION_PER_PLAYER);
    const remainingMembers = teamMembers.filter((member) => member.amount < CONTRIBUTION_PER_PLAYER);

    const totalContribution = teamMembers.length * CONTRIBUTION_PER_PLAYER;

    const paidAmount = paidMembers.reduce((total, member) => total + member.amount, 0);
    
    const remainingAmount = Math.max(totalContribution - paidAmount, 0);
    const allPaid = remainingMembers.length === 0;
    const progress = totalContribution > 0 ? Math.round((paidAmount / totalContribution) * 100) : 0;

    return (
        <section className="w-full min-w-0">
            <div className="mb-3">
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-bold uppercase leading-none tracking-[-0.02em]" style={{ color: "var(--headline-primary)" }}>
                        TEAM CONTRIBUTION
                    </h2>

                    <span className="text-[7px] font-bold uppercase tracking-[0.12em]" style={{ color: allPaid ? "var(--accent-gold)" : "var(--text-muted)" }}>
                        {allPaid ? "RESERVED" : "IN PROGRESS"}
                    </span>
                </div>

                <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.13em]" style={{ color: "var(--text-muted)" }}>
                    TOURNAMENT ENTRY CONTRIBUTION
                </p>
            </div>

            <div className="min-w-0 overflow-hidden rounded-[16px] border" style={{ background: "var(--surface-elevated)", borderColor: "var(--border-default)" }}>
                <ContributionOverview
                    paidAmount={paidAmount}
                    totalContribution={totalContribution}
                    remainingAmount={remainingAmount}
                    remainingMembers={remainingMembers.length}
                    progress={progress}
                    allPaid={allPaid}
                />

                <ContributionList members={teamMembers} />

                <ContributionPolicy allPaid={allPaid} />
            </div>
        </section>
    );
}

function ContributionOverview({
    paidAmount,
    totalContribution,
    remainingAmount,
    remainingMembers,
    progress,
    allPaid,
}) {
    return (
        <div className="border-b px-3.5 py-3.5" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex items-center gap-2.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full border" style={{ background: "color-mix(in srgb, var(--accent-gold) 7%, transparent)", borderColor: "color-mix(in srgb, var(--accent-gold) 18%, transparent)" }}>
                    {allPaid ? (
                        <LockKeyhole size={12} style={{ color: "var(--accent-gold)" }} />
                    ) : (
                        <WalletCards size={12} style={{ color: "var(--accent-gold)" }} />
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1">
                        <span className="text-[21px] font-black leading-none tracking-tight" style={{ color: "var(--text-primary)" }}>
                            ₹{paidAmount.toLocaleString("en-IN")}
                        </span>

                        <span className="text-[9px] font-semibold" style={{ color: "var(--text-muted)" }}>
                            / ₹{totalContribution.toLocaleString("en-IN")}
                        </span>
                    </div>

                    <p className="mt-1 text-[7px] font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>
                        {allPaid ? "TOTAL CONTRIBUTION RESERVED" : "CONTRIBUTION RECEIVED"}
                    </p>
                </div>

                <span className="shrink-0 text-[9px] font-bold" style={{ color: allPaid ? "var(--accent-gold)" : "var(--text-secondary)" }}>
                    {progress}%
                </span>
            </div>

            <div className="mt-3 h-[3px] overflow-hidden rounded-full" style={{ background: "var(--border-subtle)" }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: "var(--accent-gold)" }} />
            </div>

            <div className="mt-2 flex min-w-0 items-center justify-between gap-2">
                <span className="truncate text-[7px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>
                    {allPaid ? "ALL MEMBERS PAID" : `${remainingMembers} MEMBER${remainingMembers === 1 ? "" : "S"} REMAINING`}
                </span>

                <span className="shrink-0 text-[7px] font-bold uppercase tracking-[0.08em]" style={{ color: allPaid ? "var(--accent-gold)" : "var(--text-secondary)" }}>
                    {allPaid ? "FUND RESERVED" : `₹${remainingAmount.toLocaleString("en-IN")} DUE`}
                </span>
            </div>
        </div>
    );
}

function ContributionList({ members }) {
    return (
        <div className="px-3.5 py-3">
            <div className="mb-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Users size={11} style={{ color: "var(--accent-gold)" }} />

                    <span className="text-[7px] font-bold uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
                        MEMBER CONTRIBUTIONS
                    </span>
                </div>

                <span className="text-[7px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text-muted)" }}>
                    {members.length} MEMBERS
                </span>
            </div>

            <div>
                {members.map((member, index) => {
                    const hasPaid = member.amount >= CONTRIBUTION_PER_PLAYER;

                    return (
                        <div key={member.id} className={`flex min-w-0 items-center gap-2.5 py-2 ${index !== members.length - 1 ? "border-b" : ""}`} style={{ borderColor: "var(--border-subtle)" }}>
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full border text-[8px] font-bold uppercase" style={{ background: "var(--surface-base)", borderColor: hasPaid ? "color-mix(in srgb, var(--accent-gold) 22%, var(--border-default))" : "var(--border-subtle)", color: hasPaid ? "var(--accent-gold)" : "var(--text-muted)" }}>
                                {member.name.charAt(0)}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex min-w-0 items-center gap-1.5">
                                    <p className="truncate text-[9px] font-bold uppercase" style={{ color: "var(--text-primary)" }}>
                                        {member.name}
                                    </p>

                                    {member.role === "CAPTAIN" && (
                                        <span className="shrink-0 text-[6px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--accent-gold)" }}>
                                            CAPTAIN
                                        </span>
                                    )}
                                </div>

                                <div className="mt-0.5 flex items-center gap-1">
                                    {hasPaid ? (
                                        <>
                                            <Check size={8} style={{ color: "var(--accent-gold)" }} />
                                            <span className="text-[7px] font-medium" style={{ color: "var(--text-muted)" }}>
                                                PAID · {member.paidAt}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <Clock3 size={8} style={{ color: "var(--text-muted)" }} />
                                            <span className="text-[7px] font-bold uppercase" style={{ color: "var(--text-muted)" }}>
                                                CONTRIBUTION PENDING
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="shrink-0 text-right">
                                <p className="text-[9px] font-bold" style={{ color: hasPaid ? "var(--text-primary)" : "var(--text-muted)" }}>
                                    ₹{member.amount.toLocaleString("en-IN")}
                                </p>

                                <p className="mt-0.5 text-[6px] font-bold uppercase tracking-[0.08em]" style={{ color: hasPaid ? "var(--accent-gold)" : "var(--text-muted)" }}>
                                    {hasPaid ? "RECEIVED" : "DUE"}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ContributionPolicy({ allPaid }) {
    return (
        <div className="border-t px-3.5 py-2.5" style={{ background: "color-mix(in srgb, var(--accent-gold) 3%, transparent)", borderColor: "var(--border-subtle)" }}>
            <div className="flex items-start gap-2">
                <ShieldCheck size={11} className="mt-0.5 shrink-0" style={{ color: "var(--accent-gold)" }} />

                <p className="text-[7px] leading-[1.5]" style={{ color: "var(--text-muted)" }}>
                    {allPaid
                        ? "FUNDS ARE RESERVED. RESERVED CONTRIBUTIONS ARE NON-REFUNDABLE UNLESS THE TOURNAMENT IS CANCELLED UNDER TOURNAMENT POLICY."
                        : "ONCE ALL MEMBERS PAY, THE CONTRIBUTION WILL BE RESERVED. RESERVED FUNDS ARE NON-REFUNDABLE UNLESS THE TOURNAMENT IS CANCELLED UNDER TOURNAMENT POLICY."}
                </p>
            </div>
        </div>
    );
}