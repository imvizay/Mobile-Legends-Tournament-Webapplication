import {
    Check,
    Copy,
    ExternalLink,
    Mail,
    RefreshCw,
    ShieldCheck,
    Trophy,
    X,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import { toast } from "react-toastify";

import { paymentService } from "../../../services/payments/paymentService";

export default function PaymentSuccess({ onClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { payment_reference: paymentReference } = useParams();

    const [copied, setCopied] = useState(false);

    const isAlreadyPaid = location.pathname.includes(
        "/player/payments/success/already_paid/"
    );

    const pageContent = isAlreadyPaid
        ? {
            title: "Payment already completed",
            description:
                "This tournament contribution has already been paid successfully. No additional payment is required.",
            badge: "Already paid",
            noteTitle: "No action required",
            noteMessage:
                "This payment has already been verified. You can safely continue to the platform.",
            footerMessage: "Your contribution is already recorded.",
        }
        : {
            title: "Payment successful",
            description:
                "Your tournament contribution has been successfully processed and verified.",
            badge: "Payment verified",
            noteTitle: "Keep this receipt for your records",
            noteMessage:
                "Use your payment reference whenever you need to identify this transaction.",
            footerMessage: "You're ready for the next match.",
        };

    const {
        data: paymentResponse,
        isPending,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["payment-success", paymentReference],
        queryFn: () =>
            paymentService.getPaymentByReference(paymentReference),
        enabled: Boolean(paymentReference),
        retry: 1,
        staleTime: 1000 * 60 * 2,
        refetchOnWindowFocus: false,
    });

    const payment = paymentResponse?.data;

    const formatAmount = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
        }).format(Number(amount || 0));

    const formatDate = (date) => {
        if (!date) return "—";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return "—";

        return new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(parsedDate);
    };

    const handleContinue = () => {
        if (onClose) {
            onClose();
            return;
        }

        navigate("/player", { replace: true });
    };

    const copyReference = async () => {
        if (!payment?.payment_reference) return;

        try {
            await navigator.clipboard.writeText(payment.payment_reference);
            setCopied(true);
            toast.success("Payment reference copied.");

            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            toast.error("Unable to copy payment reference.");
        }
    };

    if (isPending) {
        return <PaymentSuccessSkeleton />;
    }

    if (isError) {
        return (
            <PaymentStatusState
                title="Payment status unavailable"
                message={
                    error?.response?.data?.message ||
                    error?.message ||
                    "We could not retrieve your payment details."
                }
                onRetry={refetch}
                onClose={handleContinue}
            />
        );
    }

    if (!paymentResponse?.success || !payment) {
        return (
            <PaymentStatusState
                title="Receipt not found"
                message="No payment details were found for this payment reference."
                onRetry={refetch}
                onClose={handleContinue}
            />
        );
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-stretch justify-center p-0 backdrop-blur-sm sm:items-center sm:p-4"
            style={{
                backgroundColor:
                    "color-mix(in srgb, var(--bg-canvas) 82%, transparent)",
            }}
        >
            <section
                className="flex h-[100dvh] w-full flex-col overflow-hidden rounded-none border-0 bg-[var(--surface-base)] sm:h-auto sm:max-h-[calc(100dvh-32px)] sm:max-w-[500px] sm:rounded-[30px] sm:border"
                style={{
                    borderColor: "var(--border-subtle)",
                    boxShadow: "var(--shadow-md)",
                }}
            >
                {/* Header */}
                <header className="flex shrink-0 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-canvas-secondary)] px-4 py-3 sm:px-5 sm:py-4">
                    <div className="flex min-w-0 items-center gap-2.5">
                        <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black sm:h-9 sm:w-9"
                            style={{
                                backgroundColor: "var(--action-primary-bg)",
                                color: "var(--action-primary-text)",
                            }}
                        >
                            G
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-[11px] font-bold tracking-[0.18em] text-[var(--text-primary)] sm:text-sm">
                                GAMIX
                            </p>

                            <p className="truncate text-[10px] text-[var(--text-muted)]">
                                Payment receipt
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleContinue}
                        aria-label="Close payment receipt"
                        className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-default)] text-[var(--text-secondary)] transition hover:bg-[var(--surface-elevated)]"
                    >
                        <X size={16} />
                    </button>
                </header>

                {/* Mobile-friendly scrollable content */}
                <main className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[var(--bg-canvas)] px-3 py-4 sm:px-6 sm:py-6">
                    {/* Success mark */}
                    <div className="flex justify-center">
                        <div
                            className="flex h-14 w-14 items-center justify-center rounded-full border sm:h-[76px] sm:w-[76px]"
                            style={{
                                backgroundColor: isAlreadyPaid
                                    ? "var(--surface-elevated)"
                                    : "var(--action-primary-bg)",
                                borderColor: isAlreadyPaid
                                    ? "var(--border-default)"
                                    : "var(--action-primary-bg)",
                                color: isAlreadyPaid
                                    ? "var(--headline-accent)"
                                    : "var(--action-primary-text)",
                            }}
                        >
                            {isAlreadyPaid ? (
                                <ShieldCheck size={27} strokeWidth={2} />
                            ) : (
                                <Check size={28} strokeWidth={2.8} />
                            )}
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="mt-3 text-center sm:mt-4">
                        <div
                            className="inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] sm:text-[9px]"
                            style={{
                                borderColor: "var(--border-default)",
                                backgroundColor: "var(--surface-base)",
                                color: "var(--headline-accent)",
                            }}
                        >
                            {isAlreadyPaid ? (
                                <ShieldCheck size={11} />
                            ) : (
                                <Check size={11} />
                            )}

                            {pageContent.badge}
                        </div>

                        <h1 className="mt-3 text-[clamp(22px,7vw,34px)] font-semibold leading-[1.12] tracking-[-0.055em] text-[var(--headline-primary)]">
                            {pageContent.title}
                        </h1>

                        <p className="mx-auto mt-2 max-w-[310px] text-[11px] leading-[1.65] text-[var(--text-secondary)] sm:max-w-[340px] sm:text-xs">
                            {pageContent.description}
                        </p>
                    </div>

                    {/* Amount */}
                    <div
                        className="mt-4 rounded-2xl border px-3 py-4 text-center sm:mt-5 sm:px-5 sm:py-5"
                        style={{
                            backgroundColor: isAlreadyPaid
                                ? "var(--surface-elevated)"
                                : "var(--surface-base)",
                            borderColor: "var(--border-default)",
                        }}
                    >
                        <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] sm:text-[9px]">
                            Amount paid
                        </p>

                        <p className="mt-1 break-all text-[clamp(26px,8vw,42px)] font-semibold leading-tight tracking-[-0.06em] text-[var(--headline-primary)]">
                            {formatAmount(payment.amount)}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                            <span
                                className="rounded-full border px-2 py-1 text-[8px] font-bold uppercase tracking-wide sm:text-[9px]"
                                style={{
                                    backgroundColor: "var(--surface-base)",
                                    borderColor: "var(--border-default)",
                                    color: "var(--headline-accent)",
                                }}
                            >
                                {isAlreadyPaid ? "Already paid" : payment.status || "Paid"}
                            </span>

                            <span className="text-[9px] text-[var(--text-muted)] sm:text-[10px]">
                                Tournament contribution
                            </span>
                        </div>
                    </div>

                    {/* Transaction details */}
                    <section className="mt-3 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)]">
                        <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[var(--border-subtle)] px-3 py-3 sm:px-4">
                            <p className="text-[10px] font-semibold text-[var(--text-primary)] sm:text-xs">
                                Transaction details
                            </p>

                            <span className="max-w-full break-all text-[8px] text-[var(--text-muted)] sm:text-[9px]">
                                Receipt #{payment.id || payment.payment_id || "—"}
                            </span>
                        </div>

                        <div className="divide-y divide-[var(--border-subtle)]">
                            <DetailRow
                                label="Payment reference"
                                value={payment.payment_reference || "—"}
                                action={
                                    <button
                                        type="button"
                                        onClick={copyReference}
                                        aria-label="Copy payment reference"
                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--border-default)] text-[var(--text-secondary)] transition hover:bg-[var(--surface-elevated)]"
                                    >
                                        {copied ? <Check size={13} /> : <Copy size={13} />}
                                    </button>
                                }
                            />

                            <DetailRow
                                label="Payment type"
                                value="Tournament contribution"
                            />

                            <DetailRow
                                label="Paid on"
                                value={formatDate(payment.paid_at)}
                            />

                            <DetailRow
                                label="Contribution ID"
                                value={
                                    payment.contribution_id
                                        ? `#${payment.contribution_id}`
                                        : "—"
                                }
                            />

                            {payment.razorpay_payment_id && (
                                <DetailRow
                                    label="Gateway payment ID"
                                    value={payment.razorpay_payment_id}
                                />
                            )}
                        </div>
                    </section>

                    {/* Note */}
                    <section className="mt-3 flex items-start gap-2.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3 sm:p-3.5">
                        <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border"
                            style={{
                                backgroundColor: "var(--surface-base)",
                                borderColor: "var(--border-default)",
                                color: "var(--headline-accent)",
                            }}
                        >
                            {isAlreadyPaid ? (
                                <ShieldCheck size={15} />
                            ) : (
                                <Mail size={15} />
                            )}
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold text-[var(--text-primary)] sm:text-[11px]">
                                {pageContent.noteTitle}
                            </p>

                            <p className="mt-1 text-[10px] leading-4 text-[var(--text-secondary)]">
                                {pageContent.noteMessage}
                            </p>
                        </div>
                    </section>
                </main>

                {/* Always-visible mobile footer */}
                <footer className="flex shrink-0 flex-col gap-2.5 border-t border-[var(--border-subtle)] bg-[var(--surface-base)] px-3 py-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
                    <div className="flex items-center justify-center gap-2 text-[9px] text-[var(--text-muted)] sm:justify-start sm:text-[10px]">
                        {isAlreadyPaid ? (
                            <ShieldCheck size={13} />
                        ) : (
                            <Trophy size={13} />
                        )}

                        <span>{pageContent.footerMessage}</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleContinue}
                        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-[11px] font-bold transition hover:opacity-90 sm:h-10 sm:w-auto"
                        style={{
                            backgroundColor: "var(--action-primary-bg)",
                            color: "var(--action-primary-text)",
                        }}
                    >
                        Continue to platform
                        <ExternalLink size={14} />
                    </button>
                </footer>
            </section>
        </div>
    );
}

function DetailRow({ label, value, action }) {
    return (
        <div className="flex items-start justify-between gap-3 px-3.5 py-3 sm:px-4">
            <span className="shrink-0 text-[10px] text-[var(--text-muted)] sm:text-[11px]">
                {label}
            </span>

            <div className="flex min-w-0 items-center justify-end gap-2">
                <span className="max-w-[190px] break-all text-right text-[10px] font-medium leading-4 text-[var(--text-primary)] sm:max-w-[280px] sm:text-[11px]">
                    {value}
                </span>

                {action}
            </div>
        </div>
    );
}

function PaymentSuccessSkeleton() {
    return (
        <div
            className="fixed inset-0 z-[100] flex min-h-[100dvh] items-end justify-center p-2 backdrop-blur-sm sm:items-center sm:p-5"
            style={{
                backgroundColor:
                    "color-mix(in srgb, var(--bg-canvas) 82%, transparent)",
            }}
        >
            <section className="flex max-h-[calc(100dvh-16px)] w-full max-w-[500px] animate-pulse flex-col overflow-hidden rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-base)] sm:max-h-[calc(100dvh-40px)] sm:rounded-[30px]">
                <header className="flex shrink-0 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-canvas-secondary)] px-3.5 py-3.5 sm:px-5 sm:py-4">
                    <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-xl bg-[var(--surface-elevated)]" />

                        <div className="space-y-2">
                            <div className="h-3 w-16 rounded bg-[var(--surface-elevated)]" />
                            <div className="h-2 w-28 rounded bg-[var(--surface-elevated)]" />
                        </div>
                    </div>

                    <div className="h-8 w-8 rounded-full bg-[var(--surface-elevated)]" />
                </header>

                <main className="scrollbar-hide min-h-0 overflow-y-auto bg-[var(--bg-canvas)] px-3.5 py-5 sm:px-6 sm:py-6">
                    <div className="mx-auto h-16 w-16 rounded-full bg-[var(--surface-elevated)] sm:h-[74px] sm:w-[74px]" />

                    <div className="mt-4 flex flex-col items-center gap-3">
                        <div className="h-5 w-32 rounded-full bg-[var(--surface-elevated)]" />
                        <div className="h-8 w-60 max-w-full rounded-lg bg-[var(--surface-elevated)]" />
                        <div className="h-3 w-72 max-w-full rounded bg-[var(--surface-elevated)]" />
                    </div>

                    <div className="mt-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-5">
                        <div className="mx-auto h-2.5 w-20 rounded bg-[var(--surface-elevated)]" />
                        <div className="mx-auto mt-4 h-10 w-40 rounded-lg bg-[var(--surface-elevated)]" />
                        <div className="mx-auto mt-3 h-4 w-40 rounded-full bg-[var(--surface-elevated)]" />
                    </div>

                    <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)]">
                        <div className="border-b border-[var(--border-subtle)] px-3.5 py-3 sm:px-4">
                            <div className="h-3 w-36 rounded bg-[var(--surface-elevated)]" />
                        </div>

                        <div className="divide-y divide-[var(--border-subtle)]">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center justify-between gap-3 px-3.5 py-4 sm:px-4"
                                >
                                    <div className="h-3 w-24 rounded bg-[var(--surface-elevated)]" />
                                    <div className="h-3 w-32 max-w-[55%] rounded bg-[var(--surface-elevated)]" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-3 flex gap-2.5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-base)] p-3">
                        <div className="h-8 w-8 shrink-0 rounded-xl bg-[var(--surface-elevated)]" />

                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-52 max-w-full rounded bg-[var(--surface-elevated)]" />
                            <div className="h-3 w-full rounded bg-[var(--surface-elevated)]" />
                            <div className="h-3 w-4/5 rounded bg-[var(--surface-elevated)]" />
                        </div>
                    </div>
                </main>

                <footer className="flex shrink-0 flex-col gap-3 border-t border-[var(--border-subtle)] bg-[var(--surface-base)] px-3.5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <div className="h-3 w-40 rounded bg-[var(--surface-elevated)]" />
                    <div className="h-10 w-full rounded-xl bg-[var(--surface-elevated)] sm:w-48" />
                </footer>
            </section>
        </div>
    );
}


function PaymentStatusState({ title, message, onRetry, onClose }) {
    return (
        <div
            className="fixed inset-0 z-[100] flex min-h-[100dvh] items-end justify-center p-3 backdrop-blur-sm sm:items-center"
            style={{
                backgroundColor:
                    "color-mix(in srgb, var(--bg-canvas) 82%, transparent)",
            }}
        >
            <section className="w-full max-w-[420px] rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-5 shadow-[var(--shadow-md)] sm:rounded-[30px] sm:p-7">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--surface-elevated)] text-[var(--headline-accent)]">
                    <RefreshCw size={23} strokeWidth={1.8} />
                </div>

                <h1 className="mt-5 text-center text-xl font-semibold tracking-[-0.04em] text-[var(--headline-primary)]">
                    {title || "Payment status unavailable"}
                </h1>

                <p className="mt-2 text-center text-xs leading-5 text-[var(--text-secondary)]">
                    {message ||
                        "We couldn't retrieve your payment details at the moment. Your payment status could not be confirmed."}
                </p>

                <div
                    className="mt-5 rounded-xl border px-3 py-3"
                    style={{
                        borderColor: "var(--border-subtle)",
                        backgroundColor: "var(--surface-elevated)",
                    }}
                >
                    <p className="text-center text-[11px] leading-5 text-[var(--text-secondary)]">
                        If you have any questions or concerns, please raise a
                        support ticket or contact customer assistance for help
                        with your payment.
                    </p>
                </div>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <button
                        type="button"
                        onClick={onRetry}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition hover:opacity-90"
                        style={{
                            backgroundColor: "var(--action-primary-bg)",
                            color: "var(--action-primary-text)",
                        }}
                    >
                        <RefreshCw size={14} />
                        Try again
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-semibold transition hover:bg-[var(--surface-elevated)]"
                        style={{
                            borderColor: "var(--border-default)",
                            color: "var(--text-primary)",
                        }}
                    >
                        <X size={14} />
                        Close
                    </button>
                </div>
            </section>
        </div>
    );
}