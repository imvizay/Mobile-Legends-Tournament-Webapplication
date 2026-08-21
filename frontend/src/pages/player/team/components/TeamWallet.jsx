import React from "react";
import {
    ArrowUpRight,
    CheckCircle2,
    Plus,
    Wallet,
} from "lucide-react";

export default function TeamWallet({
    wallet = {
        available_balance: 2450,
        locked_balance: 1250,
        pending_fees: 99,

        tournament_fee: 99,
        tournament_name: "MLBB Legends Cup S4",
        tournament_paid: true,

        recent_transactions: [
            {
                id: 1,
                label: "Added Funds",
                amount: 1000,
                type: "credit",
                date: "May 14, 2024",
            },
            {
                id: 2,
                label: "Tournament Fee Paid",
                amount: 99,
                type: "debit",
                date: "May 12, 2024",
            },
            {
                id: 3,
                label: "Added Funds",
                amount: 500,
                type: "credit",
                date: "May 10, 2024",
            },
            {
                id: 4,
                label: "Withdrawn",
                amount: 200,
                type: "debit",
                date: "May 8, 2024",
            },
        ],
    },

    onAddFunds,
    onPayTournamentFee,
    onViewTransactions,
}) {
    const {
        available_balance = 0,
        locked_balance = 0,
        pending_fees = 0,
        tournament_fee = 0,
        tournament_name,
        tournament_paid,
        recent_transactions = [],
    } = wallet;

    const canPayTournamentFee =
        !tournament_paid && available_balance >= tournament_fee;

    return (
        <section className="overflow-hidden rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-elevated)]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-default)] px-4 py-4 sm:px-5">
                <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-[var(--accent-gold)]/[0.08] text-[var(--accent-gold)]">
                        <Wallet size={14} strokeWidth={1.8} />
                    </div>

                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--text-primary)]">
                            Team Wallet
                        </p>

                        <p className="mt-0.5 text-[8px] text-[var(--text-muted)]">
                            Manage team funds
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onAddFunds}
                    className="flex h-8 items-center gap-1.5 rounded-lg bg-[var(--accent-gold)] px-3 text-[8px] font-bold uppercase tracking-[0.08em] text-white transition-transform hover:-translate-y-px"
                >
                    <Plus size={12} />
                    Add Funds
                </button>
            </div>

            {/* Balance */}
            <div className="px-4 pt-4 sm:px-5">
                <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    Available Balance
                </p>

                <p className="mt-1 text-[27px] font-semibold leading-none tracking-tight text-[var(--text-primary)]">
                    ₹{formatAmount(available_balance)}
                </p>
            </div>

            {/* Balance Breakdown */}
            <div className="mt-4 grid grid-cols-2 divide-x divide-[var(--border-default)] border-y border-[var(--border-default)]">
                <BalanceItem
                    label="Locked / Reserved"
                    value={locked_balance}
                />

                <BalanceItem
                    label="Pending Fees"
                    value={pending_fees}
                    danger={pending_fees > 0}
                />
            </div>

            {/* Tournament Payment */}
            {tournament_name && (
                <div className="px-4 pt-4 sm:px-5">
                    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-base)] p-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-[8px] font-semibold text-[var(--text-muted)]">
                                    Tournament Fee
                                </p>

                                <p className="mt-1 truncate text-[10px] font-semibold text-[var(--text-primary)]">
                                    {tournament_name}
                                </p>
                            </div>

                            <p className="shrink-0 text-[11px] font-bold text-[var(--text-primary)]">
                                ₹{formatAmount(tournament_fee)}
                            </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                            {tournament_paid ? (
                                <div className="flex items-center gap-1.5 text-[8px] font-semibold text-emerald-600">
                                    <CheckCircle2 size={12} />
                                    Tournament Fee Paid
                                </div>
                            ) : (
                                <p className="text-[8px] text-[var(--text-muted)]">
                                    {available_balance >= tournament_fee
                                        ? "Funds available for payment"
                                        : `₹${formatAmount(
                                              tournament_fee -
                                                  available_balance
                                          )} more required`}
                                </p>
                            )}

                            {!tournament_paid && (
                                <button
                                    type="button"
                                    disabled={!canPayTournamentFee}
                                    onClick={onPayTournamentFee}
                                    className="h-8 shrink-0 rounded-lg bg-[var(--accent-gold)] px-3 text-[8px] font-bold uppercase tracking-[0.08em] text-white transition-transform hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Pay Fee
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Transactions */}
            <div className="px-4 pb-4 pt-4 sm:px-5">
                <div className="mb-2.5 flex items-center justify-between">
                    <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-[var(--text-primary)]">
                        Recent Transactions
                    </p>

                    <button
                        type="button"
                        onClick={onViewTransactions}
                        className="flex items-center gap-1 text-[8px] font-semibold text-[var(--accent-gold)]"
                    >
                        View All
                        <ArrowUpRight size={10} />
                    </button>
                </div>

                <div className="divide-y divide-[var(--border-default)]">
                    {recent_transactions.length > 0 ? (
                        recent_transactions.slice(0, 4).map((transaction) => (
                            <TransactionRow
                                key={transaction.id}
                                transaction={transaction}
                            />
                        ))
                    ) : (
                        <div className="py-5 text-center text-[9px] text-[var(--text-muted)]">
                            No recent transactions
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function BalanceItem({ label, value, danger = false }) {
    return (
        <div className="px-4 py-3">
            <p className="text-[7px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                {label}
            </p>

            <p
                className={`mt-1 text-[14px] font-semibold ${
                    danger
                        ? "text-red-500"
                        : "text-[var(--text-primary)]"
                }`}
            >
                ₹{formatAmount(value)}
            </p>
        </div>
    );
}

function TransactionRow({ transaction }) {
    const isCredit = transaction.type === "credit";

    return (
        <div className="flex items-center justify-between gap-3 py-2.5">
            <div className="min-w-0">
                <p className="truncate text-[9px] font-medium text-[var(--text-secondary)]">
                    {transaction.label}
                </p>

                <p className="mt-0.5 text-[7px] text-[var(--text-muted)]">
                    {transaction.date}
                </p>
            </div>

            <p
                className={`shrink-0 text-[9px] font-semibold ${
                    isCredit
                        ? "text-emerald-600"
                        : "text-red-500"
                }`}
            >
                {isCredit ? "+" : "-"} ₹
                {formatAmount(transaction.amount)}
            </p>
        </div>
    );
}

function formatAmount(value) {
    return Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}