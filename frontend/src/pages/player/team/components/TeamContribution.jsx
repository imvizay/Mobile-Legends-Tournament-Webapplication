import {
    Bell,
    Check,
    CircleAlert,
    CircleX,
    Clock3,
    RefreshCw,
    WalletCards,
} from "lucide-react"

import TeamContributionSkeleton from "../skeletons/TeamContributionSkeletons"
import { useTeamContribution } from "../../../../hooks/tournament/contribution/useTeamContribution"


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
}


export default function TeamContribution({
    teamId,
    registrationId,
    onRemindPlayers,
    isCaptain = false,
}) {

    const {
        data: contribution,
        isPending: contributionPending,
        isError: contributionError,
        refetch: contributionRefetch,
        isFetching: contributionRefetching,
    } = useTeamContribution({
        teamId,
        registrationId,
    })


    if (contributionPending) {
        return (
            <TeamContributionSkeleton
                rows={5}
                isCaptain={isCaptain}
            />
        )
    }


    if (contributionError) {
        return (
            <ContributionError
                onRetry={contributionRefetch}
                isRetrying={contributionRefetching}
            />
        )
    }


    const rosterMembers = contribution?.data ?? []


    const contributionTotal = rosterMembers.reduce(
        (total, member) => total + Number(member.amount ?? 0),
        0
    )


    const paidAmount = rosterMembers.reduce((total, member) => {
        const status = member.contribution_status?.toUpperCase()

        return status === "PAID"
            ? total + Number(member.amount ?? 0)
            : total
    }, 0)


    const hasOutstandingPayments = rosterMembers.some((member) => {
        const status = member.contribution_status?.toUpperCase()

        return [
            "PENDING",
            "FAILED",
            "UNPAID",
            "CANCELLED",
        ].includes(status)
    })


    const allPaid =
        rosterMembers.length > 0 &&
        rosterMembers.every(
            (member) =>
                member.contribution_status?.toUpperCase() === "PAID"
        )


    return (
        <section className="w-full overflow-hidden rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-elevated)] sm:rounded-[16px]">

            {/* =====================================================
                CONTRIBUTION OVERVIEW
            ===================================================== */}

            <div className="border-b border-[var(--border-subtle)] px-3 py-2.5 sm:px-5 sm:py-4">

                <div className="flex items-center justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-2">

                        <span className="flex size-7 shrink-0 items-center justify-center rounded-[8px] border border-[var(--border-subtle)] bg-[var(--surface-base)] text-[var(--accent-gold)] sm:size-8 sm:rounded-lg">
                            <WalletCards
                                size={12}
                                className="sm:size-[14px]"
                            />
                        </span>

                        <div className="min-w-0">

                            <h2 className="truncate text-[8px] font-black uppercase tracking-[0.13em] text-[var(--text-primary)] sm:text-[9px] sm:tracking-[0.14em]">
                                Roster Contribution
                            </h2>

                            <p className="mt-0.5 truncate text-[6px] text-[var(--text-muted)] sm:mt-1 sm:text-[7px]">
                                Tournament entry contribution
                            </p>

                        </div>

                    </div>


                    <div className="flex shrink-0 items-baseline gap-1">

                        <span className="text-[18px] font-black leading-none tracking-[-0.04em] text-[var(--text-primary)] sm:text-[26px]">
                            ₹{paidAmount.toLocaleString("en-IN")}
                        </span>

                        <span className="text-[8px] font-bold text-[var(--text-muted)] sm:text-[10px]">
                            / ₹{contributionTotal.toLocaleString("en-IN")}
                        </span>

                    </div>

                </div>

            </div>


            {/* =====================================================
                PAYMENT RECORDS
            ===================================================== */}

            <div className="px-3 py-2 sm:px-5 sm:py-3">

                {/* Section Heading */}

                <div className="mb-1 flex items-center justify-between gap-3 sm:mb-1">

                    <p className="text-[6px] font-bold uppercase tracking-[0.13em] text-[var(--text-muted)] sm:text-[7px] sm:tracking-[0.14em]">
                        Roster Payment Status
                    </p>

                    <span className="text-[6px] font-medium text-[var(--text-muted)] sm:text-[7px]">
                        {rosterMembers.length} Players
                    </span>

                </div>


                {/* =================================================
                    MOBILE CONTRIBUTION RAIL
                ================================================= */}

                <div className="md:hidden">

                    <div className="overflow-x-auto scrollbar-none">

                        <div className="flex w-max gap-2 pb-1">

                            {rosterMembers.map((member) => (
                                <MobilePaymentCard
                                    key={member.id}
                                    member={member}
                                />
                            ))}

                        </div>

                    </div>

                </div>


                {/* =================================================
                    DESKTOP ORIGINAL PAYMENT LIST
                ================================================= */}

                <div className="hidden md:block">

                    {rosterMembers.map((member, index) => (
                        <PaymentRow
                            key={member.id}
                            member={member}
                            isLast={
                                index === rosterMembers.length - 1
                            }
                        />
                    ))}

                </div>


                {/* =================================================
                    REMINDER
                ================================================= */}

                {isCaptain && hasOutstandingPayments && (
                    <button
                        type="button"
                        onClick={onRemindPlayers}
                        className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-[8px] border border-[var(--border-default)] bg-[var(--surface-base)] px-3 py-2 text-[7px] font-bold uppercase tracking-[0.09em] text-[var(--text-primary)] transition-transform active:scale-[0.99] sm:mt-3 sm:gap-2 sm:rounded-lg sm:px-4 sm:py-2.5 sm:text-[8px] sm:tracking-[0.1em]"
                    >
                        <Bell
                            size={10}
                            className="sm:size-[12px]"
                        />

                        Remind Players to Contribute
                    </button>
                )}

            </div>


            {/* =====================================================
                PAYMENT RESERVATION
            ===================================================== */}

            <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-base)] px-3 py-2.5 sm:px-5 sm:py-3">

                <div className="flex flex-col items-center text-center">

                    <span className="flex size-6 items-center justify-center rounded-[7px] border border-[var(--border-subtle)] text-[var(--accent-gold)] sm:size-7 sm:rounded-lg">
                        <CircleAlert
                            size={10}
                            className="sm:size-[12px]"
                        />
                    </span>


                    <p className="mt-1.5 text-[6px] font-bold uppercase tracking-[0.1em] text-[var(--text-primary)] sm:mt-2 sm:text-[7px] sm:tracking-[0.12em]">
                        Payment Reservation
                    </p>


                    <p className="mt-0.5 max-w-2xl text-[6px] leading-[1.45] text-[var(--text-muted)] sm:mt-1 sm:text-[7px] sm:leading-relaxed">
                        {allPaid
                            ? "All roster contributions are complete. The collected amount is reserved for this tournament and cannot be disbursed until the tournament is completed."
                            : "Once all required roster players complete their contributions, the collected amount will be reserved for the tournament and cannot be disbursed until the tournament is completed."
                        }
                    </p>

                </div>

            </div>

        </section>
    )
}


/* =====================================================
   DESKTOP PAYMENT ROW
   Original appearance
===================================================== */

function PaymentRow({ member, isLast }) {

    const status =
        member.contribution_status?.toUpperCase() ?? "PENDING"

    const config =
        paymentConfig[status] ?? paymentConfig.PENDING

    const StatusIcon = config.icon

    const detail = getPaymentDetail(
        status,
        member.paid_at
    )


    return (
        <div
            className={`flex min-w-0 items-center gap-2 py-2 sm:gap-3 sm:py-2.5 ${
                !isLast
                    ? "border-b border-[var(--border-subtle)]"
                    : ""
            }`}
        >

            <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full border sm:size-7 ${config.iconClass}`}
            >
                <StatusIcon
                    size={9}
                    className="sm:size-[11px]"
                />
            </span>


            <div className="min-w-0 flex-1">

                <p className="truncate text-[8px] font-bold text-[var(--text-primary)] sm:text-[9px]">
                    {member.username}
                </p>


                <div className="mt-px flex min-w-0 items-center gap-1">

                    <span
                        className={`shrink-0 text-[6px] font-bold uppercase tracking-[0.07em] sm:text-[7px] sm:tracking-[0.08em] ${config.statusClass}`}
                    >
                        {config.label}
                    </span>

                    <span className="shrink-0 text-[var(--text-muted)]">
                        ·
                    </span>

                    <span className="truncate text-[6px] text-[var(--text-muted)] sm:text-[7px]">
                        {detail}
                    </span>

                </div>

            </div>


            <div className="shrink-0 text-right">

                <p className="text-[9px] font-black text-[var(--text-primary)] sm:text-[10px]">
                    ₹{Number(member.amount ?? 0).toLocaleString("en-IN")}
                </p>

            </div>

        </div>
    )
}


/* =====================================================
   MOBILE PAYMENT CARD
===================================================== */

function MobilePaymentCard({ member }) {

    const status =
        member.contribution_status?.toUpperCase() ?? "PENDING"

    const config =
        paymentConfig[status] ?? paymentConfig.PENDING

    const StatusIcon = config.icon

    const detail = getPaymentDetail(
        status,
        member.paid_at
    )


    return (
        <article className="w-[155px] shrink-0 rounded-[10px] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-2.5">

            {/* Player */}

            <div className="flex items-center gap-1.5">

                <span
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${config.iconClass}`}
                >
                    <StatusIcon size={9} />
                </span>


                <div className="min-w-0">

                    <p className="truncate text-[8px] font-bold text-[var(--text-primary)]">
                        {member.username}
                    </p>

                    <p className="mt-px text-[6px] text-[var(--text-muted)]">
                        Roster Player
                    </p>

                </div>

            </div>


            {/* Payment */}

            <div className="mt-2 border-t border-[var(--border-subtle)] pt-2">

                <div className="flex items-center justify-between gap-2">

                    <span
                        className={`text-[6px] font-bold uppercase tracking-[0.07em] ${config.statusClass}`}
                    >
                        {config.label}
                    </span>

                    <span className="text-[9px] font-black text-[var(--text-primary)]">
                        ₹{Number(member.amount ?? 0).toLocaleString("en-IN")}
                    </span>

                </div>


                <p className="mt-1 truncate text-[6px] text-[var(--text-muted)]">
                    {detail}
                </p>

            </div>

        </article>
    )
}


/* =====================================================
   PAYMENT STATUS DETAIL
===================================================== */

function getPaymentDetail(status, paidAt) {

    if (status === "PAID") {
        return paidAt
            ? formatRelativeTime(paidAt)
            : "Payment received"
    }

    if (status === "FAILED") {
        return "Payment failed"
    }

    return "Due"
}


/* =====================================================
   RELATIVE TIME FORMATTER
===================================================== */

function formatRelativeTime(dateValue) {

    const date = new Date(dateValue)

    if (Number.isNaN(date.getTime())) {
        return "Payment received"
    }


    const difference = Date.now() - date.getTime()

    const minutes = Math.floor(
        difference / (1000 * 60)
    )

    const hours = Math.floor(
        difference / (1000 * 60 * 60)
    )

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    )


    if (minutes < 1) {
        return "Just now"
    }

    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
    }

    if (hours < 24) {
        return `${hours} hour${hours === 1 ? "" : "s"} ago`
    }

    if (days < 7) {
        return `${days} day${days === 1 ? "" : "s"} ago`
    }


    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })
}


/* =====================================================
   API ERROR STATE
===================================================== */

function ContributionError({
    onRetry,
    isRetrying,
}) {

    return (
        <section className="flex min-h-[220px] w-full items-center justify-center rounded-[14px] border border-[var(--border-default)] bg-[var(--surface-elevated)] px-4 py-6 sm:min-h-[300px] sm:rounded-[16px] sm:px-5 sm:py-8">

            <div className="flex max-w-[280px] flex-col items-center text-center sm:max-w-[320px]">

                <span className="flex size-9 items-center justify-center rounded-[10px] border border-red-500/20 bg-red-500/10 text-red-500 sm:size-10 sm:rounded-xl">
                    <CircleX
                        size={16}
                        className="sm:size-[18px]"
                    />
                </span>


                <h3 className="mt-2.5 text-[9px] font-black uppercase tracking-[0.11em] text-[var(--text-primary)] sm:mt-3 sm:text-[10px] sm:tracking-[0.12em]">
                    Contribution Details Unavailable
                </h3>


                <p className="mt-1.5 text-[7px] leading-relaxed text-[var(--text-muted)] sm:mt-2 sm:text-[8px]">
                    We couldn't load your team's contribution details right now. Please try again. If the issue continues, raise a support ticket with a screenshot.
                </p>


                <button
                    type="button"
                    onClick={onRetry}
                    disabled={isRetrying}
                    className="mt-3 flex min-w-[110px] items-center justify-center gap-1.5 rounded-[8px] border border-[var(--border-default)] bg-[var(--surface-base)] px-3 py-2 text-[7px] font-bold uppercase tracking-[0.09em] text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-60 sm:mt-4 sm:min-w-[120px] sm:gap-2 sm:rounded-lg sm:px-4 sm:py-2.5 sm:text-[8px] sm:tracking-[0.1em]"
                >

                    <RefreshCw
                        size={10}
                        className={
                            isRetrying
                                ? "animate-spin"
                                : ""
                        }
                    />

                    {isRetrying
                        ? "Retrying..."
                        : "Try Again"
                    }

                </button>

            </div>

        </section>
    )
}