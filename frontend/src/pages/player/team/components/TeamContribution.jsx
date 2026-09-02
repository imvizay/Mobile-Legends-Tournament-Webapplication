
import { useQuery } from "@tanstack/react-query";
import { Bell, Check, CircleAlert, CircleX, Clock3, RefreshCw, WalletCards } from "lucide-react";

import { teamTournamentService } from "../../../../services/team_service";
import TeamContributionSkeleton from "../skeletons/TeamContributionSkeletons";

import { useTeamContribution } from "../../../../hooks/tournament/contribution/useTeamContribution";

const paymentConfig = {
    PAID: {
        icon: Check,
        label: "Paid",
        statusClass: "text-emerald-500",
        iconClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-500",
    },
    PENDING: {
        icon: Clock3,
        label: "Pending",
        statusClass: "text-amber-500",
        iconClass: "border-amber-500/20 bg-amber-500/10 text-amber-500",
    },
    FAILED: {
        icon: CircleX,
        label: "Failed",
        statusClass: "text-red-500",
        iconClass: "border-red-500/20 bg-red-500/10 text-red-500",
    },
};

export default function TeamContribution({
    teamId,
    registrationId,
    onRemindPlayers,
    isCaptain = false
}) {

    const { data, isPending, isError, refetch, isFetching } = useTeamContribution({ teamId, registrationId })


    if (isPending) return <TeamContributionSkeleton rows={5} isCaptain={isCaptain} />;

    if (isError) return <ContributionError onRetry={refetch} isRetrying={isFetching} />;

    const rosterMembers = data?.data ?? [];

    console.log("ROSTER_MEM", rosterMembers)

    const contributionTotal = rosterMembers?.reduce((total, member) => {
        const status = member?.contribution_status?.toUpperCase();

        if (["UNPAID", "FAILED", "PENDING", "CANCELLED"].includes(status)) {
            return total + Number(member?.amount ?? 0);
        }

        return total;
    }, 0);

    const paidAmount = rosterMembers.reduce((total, member) => {
        const status = member.status?.toUpperCase();
        return status === "PAID" ? total + Number(member.amount ?? 0) : total;
    }, 0);

    const hasOutstandingPayments = rosterMembers.some((member) => {
        const status = member.status?.toUpperCase();
        return status === "PENDING" || status === "FAILED";
    });

    const allPaid = rosterMembers.length > 0 && !hasOutstandingPayments;

    return (
        <section className="w-full overflow-hidden rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-elevated)]">

            {/* Contribution Overview */}
            <div className="border-b border-[var(--border-subtle)] px-4 py-4 sm:px-5">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-base)] text-[var(--accent-gold)]">
                            <WalletCards size={14} />
                        </span>

                        <div className="min-w-0">
                            <h2 className="text-[9px] font-black uppercase tracking-[0.14em] text-[var(--text-primary)]">Roster Contribution</h2>
                            <p className="mt-1 text-[7px] text-[var(--text-muted)]">Tournament entry contribution</p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-baseline gap-1.5">
                        <span className="text-[22px] font-black leading-none tracking-[-0.04em] text-[var(--text-primary)] sm:text-[26px]">
                            ₹{paidAmount.toLocaleString("en-IN")}
                        </span>

                        <span className="text-[10px] font-bold text-[var(--text-muted)]">
                            / ₹{contributionTotal.toLocaleString("en-IN")}
                        </span>
                    </div>
                </div>
            </div>

            {/* Payment Records */}
            <div className="px-4 py-3 sm:px-5">
                <div className="mb-1 flex items-center justify-between gap-3">
                    <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">Roster Payment Status</p>
                    <span className="text-[7px] font-medium text-[var(--text-muted)]">{rosterMembers.length} Players</span>
                </div>

                <div>
                    {rosterMembers.map((member, index) => (
                        <PaymentRow key={member.id} member={member} isLast={index === rosterMembers.length - 1} />
                    ))}
                </div>

                {isCaptain && hasOutstandingPayments && (
                    <button type="button" onClick={onRemindPlayers} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface-base)] px-4 py-2.5 text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--text-primary)] transition-transform active:scale-[0.99]">
                        <Bell size={12} />
                        Remind Players to Contribute
                    </button>
                )}
            </div>

            {/* Payment Reservation */}
            <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-base)] px-4 py-3 sm:px-5">
                <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--accent-gold)]">
                        <CircleAlert size={12} />
                    </span>

                    <div className="min-w-0">
                        <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[var(--text-primary)]">Payment Reservation</p>

                        <p className="mt-1 text-[7px] leading-relaxed text-[var(--text-muted)]">
                            {allPaid
                                ? "All roster contributions are complete. The collected amount is reserved for this tournament and cannot be disbursed until the tournament is completed."
                                : "Once all required roster players complete their contributions, the collected amount will be reserved for the tournament and cannot be disbursed until the tournament is completed."}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}


/* =====================================================
   PAYMENT ROW
===================================================== */

function PaymentRow({ member, isLast }) {
    const status = member.contribution_status?.toUpperCase() ?? "PENDING";
    const config = paymentConfig[status] ?? paymentConfig.PENDING;
    const StatusIcon = config.icon;

    const detail = getPaymentDetail(status, member.paid_at);

    return (
        <div className={`flex min-w-0 items-center gap-3 py-2.5 ${!isLast ? "border-b border-[var(--border-subtle)]" : ""}`}>
            <span className={`flex size-7 shrink-0 items-center justify-center rounded-full border ${config.iconClass}`}>
                <StatusIcon size={11} />
            </span>

            <div className="min-w-0 flex-1">
                <p className="truncate text-[9px] font-bold text-[var(--text-primary)]">{member.username}</p>

                <div className="mt-0.5 flex min-w-0 items-center gap-1">
                    <span className={`shrink-0 text-[7px] font-bold uppercase tracking-[0.08em] ${config.statusClass}`}>{config.label}</span>
                    <span className="shrink-0 text-[var(--text-muted)]">·</span>
                    <span className="truncate text-[7px] text-[var(--text-muted)]">{detail}</span>
                </div>
            </div>

            <div className="shrink-0 text-right">
                <p className="text-[10px] font-black text-[var(--text-primary)]">
                    ₹{Number(member.amount ?? 0).toLocaleString("en-IN")}
                </p>
            </div>
        </div>
    );
}


/* =====================================================
   PAYMENT STATUS DETAIL
===================================================== */

function getPaymentDetail(status, paidAt) {
    if (status === "PAID") return paidAt ? formatRelativeTime(paidAt) : "Payment received";

    if (status === "FAILED") return "Payment failed";

    return "Due";
}


/* =====================================================
   RELATIVE TIME FORMATTER
===================================================== */

function formatRelativeTime(dateValue) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "Payment received";

    const difference = Date.now() - date.getTime();

    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}


/* =====================================================
   API ERROR STATE
===================================================== */

function ContributionError({ onRetry, isRetrying }) {
    return (
        <section className="flex min-h-[300px] w-full items-center justify-center rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-elevated)] px-5 py-8">
            <div className="flex max-w-[320px] flex-col items-center text-center">
                <span className="flex size-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-500">
                    <CircleX size={18} />
                </span>

                <h3 className="mt-3 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-primary)]">
                    Contribution Details Unavailable
                </h3>

                <p className="mt-2 text-[8px] leading-relaxed text-[var(--text-muted)]">
                    We couldn't load your team's contribution details right now. Please try again. If the issue continues, raise a support ticket with a screenshot.
                </p>

                <button type="button" onClick={onRetry} disabled={isRetrying} className="mt-4 flex min-w-[120px] items-center justify-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface-base)] px-4 py-2.5 text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-60">
                    <RefreshCw size={12} className={isRetrying ? "animate-spin" : ""} />
                    {isRetrying ? "Retrying..." : "Try Again"}
                </button>
            </div>
        </section>
    );
}

