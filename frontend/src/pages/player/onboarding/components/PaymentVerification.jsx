
import { useEffect, useState } from "react";
import {
    CheckCircle2,
    Clock3,
    LockKeyhole,
    ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const WAIT_DURATION = 30;
const TIMER_KEY = "payment_verification_expires_at";

function getRemainingSeconds() {

    const storedExpiry = sessionStorage.getItem(TIMER_KEY);

    if (!storedExpiry) {
        return 0;
    }

    const expiresAt = Number(storedExpiry);

    if (!Number.isFinite(expiresAt)) {
        sessionStorage.removeItem(TIMER_KEY);
        return 0;
    }

    return Math.max(
        0,
        Math.ceil((expiresAt - Date.now()) / 1000)
    );
}

function PaymentVerification() {
    const navigate = useNavigate();

    const [elapsedSeconds, setElapsedSeconds] = useState(() => {
        
        const storedExpiry = sessionStorage.getItem(TIMER_KEY);

        if (!storedExpiry) {
            const expiresAt = Date.now() + WAIT_DURATION * 1000;

            sessionStorage.setItem(
                TIMER_KEY,
                String(expiresAt)
            );

            return 0;
        }

        return Math.min(
            WAIT_DURATION - getRemainingSeconds(),
            WAIT_DURATION
        );
    });

    useEffect(() => {
        const updateTimer = () => {
            const remaining = getRemainingSeconds();

            const elapsed = Math.min(
                WAIT_DURATION - remaining,
                WAIT_DURATION
            );

            setElapsedSeconds(elapsed);

            if (remaining <= 0) {
                window.clearInterval(intervalId);
                sessionStorage.removeItem(TIMER_KEY);
            }
        };

        const intervalId = window.setInterval(updateTimer, 1000);

        updateTimer();

        return () => {
            window.clearInterval(intervalId);
        };
    }, []);

    const canLeave = elapsedSeconds >= WAIT_DURATION;

    return (
        <div className="fixed inset-0 z-[100] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-[#f8f8f6] px-4 py-5 sm:px-6">
            <section className="w-full max-w-[380px] rounded-[24px] border border-[#e5e2dc] bg-white px-6 py-7 text-center sm:px-8 sm:py-8">

                {/* Verification loader */}
                <div className="relative mx-auto flex size-[72px] items-center justify-center sm:size-[78px]">
                    <span className="absolute inset-0 rounded-full border border-[#b88a3b]/10" />

                    <span className="absolute inset-[5px] animate-spin rounded-full border-[5px] border-[#eeeae3] border-t-[#b88a3b]" />

                    <span className="flex size-[42px] items-center justify-center rounded-full border border-[#eeeae3] bg-[#fffdf9] sm:size-[46px]">
                        <ShieldCheck
                            size={19}
                            strokeWidth={1.7}
                            className="text-[#a17a3c]"
                        />
                    </span>
                </div>

                {/* Heading */}
                <div className="mt-5">
                    <div className="flex items-center justify-center gap-1.5">
                        <span className="size-1.5 animate-pulse rounded-full bg-[#b88a3b]" />

                        <p className="text-[9px] font-semibold uppercase tracking-[0.19em] text-[#a17a3c]">
                            Secure verification
                        </p>
                    </div>

                    <h1 className="mt-2 text-[22px] font-semibold tracking-[-0.035em] text-[#171b24] sm:text-[24px]">
                        Verifying your payment
                    </h1>

                    <p className="mx-auto mt-2 max-w-[290px] text-[11px] leading-[1.6] text-[#737984] sm:text-[12px]">
                        We're securely confirming your payment. This usually takes only a few moments.
                    </p>
                </div>

                {/* Status and elapsed time */}
                <div className="mt-5 grid grid-cols-2 divide-x divide-[#ece8e1] rounded-[14px] border border-[#ebe7df] bg-[#fcfbf8] py-3">
                    <div className="flex items-center justify-center gap-2">
                        <LockKeyhole
                            size={13}
                            strokeWidth={1.7}
                            className="text-[#a17a3c]"
                        />

                        <div className="text-left">
                            <p className="text-[8px] font-semibold uppercase tracking-[0.08em] text-[#9a9da3]">
                                Status
                            </p>

                            <p className="mt-0.5 text-[10px] font-medium text-[#555b65]">
                                In progress
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <Clock3
                            size={13}
                            strokeWidth={1.7}
                            className="text-[#a17a3c]"
                        />

                        <div className="text-left">
                            <p className="text-[8px] font-semibold uppercase tracking-[0.08em] text-[#9a9da3]">
                                Elapsed
                            </p>

                            <p className="mt-0.5 text-[10px] font-medium tabular-nums text-[#555b65]">
                                {elapsedSeconds}s
                            </p>
                        </div>
                    </div>
                </div>

                {/* Waiting message */}
                {!canLeave && (
                    <div className="mt-4 flex items-start gap-3 rounded-[14px] border border-[#eee5d5] bg-[#fffcf6] px-3.5 py-3 text-left">
                        <ShieldCheck
                            size={14}
                            strokeWidth={1.7}
                            className="mt-0.5 shrink-0 text-[#a17a3c]"
                        />

                        <p className="text-[10px] leading-[1.5] text-[#6f747d] sm:text-[11px]">
                            <span className="font-semibold text-[#505660]">
                                Please don't close this browser while verification is in progress.
                            </span>{" "}
                            You don't need to refresh or retry your payment.
                        </p>
                    </div>
                )}

                {/* Exit message */}
                <div
                    className={`overflow-hidden transition-all duration-500 ${
                        canLeave
                            ? "mt-4 max-h-[140px] opacity-100"
                            : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="rounded-[14px] border border-[#e4e5e3] bg-[#f8faf8] px-3.5 py-3 text-left">
                        <div className="flex items-start gap-3">
                            <CheckCircle2
                                size={14}
                                strokeWidth={1.8}
                                className="mt-0.5 shrink-0 text-[#68756b]"
                            />

                            <p className="text-[10px] leading-[1.5] text-[#666d68] sm:text-[11px]">
                                <span className="font-semibold text-[#454b47]">
                                    You can safely leave this screen.
                                </span>{" "}
                                Verification will continue automatically, and we'll update you by email once your payment status is confirmed.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/player", { replace: true })}
                        className="mt-3 h-10 w-full rounded-[12px] border border-[#dddcd7] bg-white text-[10px] font-semibold text-[#3f444c] transition-colors hover:bg-[#f8f8f6] active:translate-y-px"
                    >
                        Back to home
                    </button>
                </div>
            </section>
        </div>
    );
}

export default PaymentVerification;