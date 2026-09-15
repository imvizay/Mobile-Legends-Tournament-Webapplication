import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Gamepad2,
  Info,
  Layers3,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";

import PaymentNetworkStatus from "../../../../features/payments/components/NetworkWarning";
import { useRazorpayPayment } from "../../../../hooks/payments/useRazorpayPayment";
import { teamTournamentService } from "../../../../services/team_service";
import PaymentVerification from "./PaymentVerification";

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex min-w-0 items-center gap-2 text-[10px]">
    <Icon
      size={13}
      className="shrink-0 text-[var(--text-muted)]"
    />

    <span className="shrink-0 text-[9px] text-[var(--text-muted)]">
      {label}
    </span>

    <span className="min-w-0 truncate font-medium text-[var(--text-secondary)]">
      {value}
    </span>
  </div>
);

const SectionLabel = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2">
    <div className="flex size-7 shrink-0 items-center justify-center rounded-[9px] bg-[var(--surface-elevated)] text-[var(--text-secondary)]">
      <Icon size={13} />
    </div>

    <span className="text-[10px] font-bold tracking-[-0.01em] text-[var(--text-primary)]">
      {children}
    </span>
  </div>
);

const PaymentMethod = ({
  icon: Icon,
  title,
  description,
  selected = false,
  disabled = false,
  badge,
}) => (
  <div
    className={`flex min-w-0 items-center gap-3 rounded-[14px] border p-3 transition-colors ${disabled ? "cursor-not-allowed opacity-40" : ""
      }`}
    style={{
      borderColor: selected
        ? "color-mix(in srgb, var(--accent-gold) 35%, var(--border-default))"
        : "var(--border-subtle)",
      background: selected
        ? "color-mix(in srgb, var(--accent-gold) 5%, var(--surface-base))"
        : "var(--surface-base)",
    }}
  >
    <div className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-[var(--surface-elevated)] text-[var(--text-secondary)]">
      <Icon size={16} />
    </div>

    <div className="min-w-0 flex-1">
      <div className="flex min-w-0 items-center gap-2">
        <span className="whitespace-nowrap text-[10px] font-semibold text-[var(--text-primary)]">
          {title}
        </span>

        {badge && (
          <span className="whitespace-nowrap rounded-full bg-[var(--surface-elevated)] px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
            {badge}
          </span>
        )}
      </div>

      <p className="mt-0.5 truncate text-[8px] text-[var(--text-muted)]">
        {description}
      </p>
    </div>

    {selected && (
      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-gold)] text-[#15120c]">
        <Check
          size={11}
          strokeWidth={3}
        />
      </div>
    )}
  </div>
);

function TournamentEntryCheckoutOverlay() {
  const navigate = useNavigate();
  const { id: registrationId } = useParams();

  const idempotencyKey = useRef(crypto.randomUUID());
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    networkStatus,
    startPayment,
    retryPayment,
    paymentState,
  } = useRazorpayPayment();

  const {
    data: paymentReview,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["payment-review", registrationId],
    queryFn: () =>
      teamTournamentService.getPaymentReview(registrationId),
    enabled: Boolean(registrationId),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 3,
  });

  const goBack = () => {
    navigate(`/player/tournament/${registrationId}/detail`, {
      replace: true,
    });
  };

  const rosterId =
    paymentReview?.team?.roster_id ??
    paymentReview?.roster_id ??
    null;

  const handleCheckout = async () => {
    if (isProcessing) return;

    if (!registrationId || !rosterId) {
      console.error("[Checkout] Missing payment identifiers:", {
        registrationId,
        rosterId,
      });

      return;
    }

    setIsProcessing(true);

    try {
      await startPayment({
        registrationId,
        rosterId,
        idempotencyKey: idempotencyKey.current,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = async () => {
    if (!registrationId || !rosterId) {
      console.error("[Checkout] Missing retry identifiers:", {
        registrationId,
        rosterId,
      });

      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);

    try {
      await retryPayment(
        registrationId,
        rosterId,
        idempotencyKey.current
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!registrationId) {
    return null;
  }

  if (isPending) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xl">
        <div
          className="w-full max-w-[720px] rounded-[24px] border bg-[var(--surface-base)] p-5 sm:p-7"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div className="h-3 w-28 animate-pulse rounded-full bg-[var(--surface-elevated)]" />
          <div className="mt-3 h-7 w-56 animate-pulse rounded-lg bg-[var(--surface-elevated)]" />
          <div className="mt-7 h-32 animate-pulse rounded-[16px] bg-[var(--surface-elevated)]" />
          <div className="mt-3 h-32 animate-pulse rounded-[16px] bg-[var(--surface-elevated)]" />
          <div className="mt-3 h-48 animate-pulse rounded-[16px] bg-[var(--surface-elevated)]" />
        </div>
      </div>
    );
  }

  if (isError || !paymentReview) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xl">
        <div
          className="w-full max-w-[420px] rounded-[22px] border bg-[var(--surface-base)] p-6 text-center"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <Info size={19} />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
            Payment details unavailable
          </h2>

          <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
            {error?.message ||
              "Unable to load the payment details."}
          </p>

          <div className="mt-5 flex justify-center gap-2">
            <button
              type="button"
              onClick={goBack}
              className="h-10 rounded-xl border px-4 text-xs font-medium text-[var(--text-primary)]"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              Go back
            </button>

            <button
              type="button"
              onClick={refetch}
              className="flex h-10 items-center gap-2 rounded-xl bg-[var(--action-primary-bg)] px-4 text-xs font-semibold text-[var(--action-primary-text)]"
            >
              <RefreshCw size={13} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tournament = paymentReview?.tournament ?? {};
  const player = paymentReview?.player ?? {};
  const team = paymentReview?.team ?? {};

  const tournamentName =
    tournament.tournament_name ||
    tournament.name ||
    "Tournament";

  const game =
    tournament.game_name ||
    tournament.game ||
    "Mobile Legends: Bang Bang";

  const format =
    tournament.format ||
    tournament.tournament_format ||
    "5v5";

  const username =
    player.username ||
    player.name ||
    player.player_name ||
    "Player";

  const mlbbId =
    player.mlbb_id ||
    paymentReview?.mlbb_id ||
    "Not available";

  const teamName =
    team.team_name ||
    team.name ||
    "Not assigned";

  const amount = Number(
    paymentReview?.amount ??
    paymentReview?.contribution_amount ??
    tournament.entry_fee ??
    0
  );

  const formattedAmount = `₹${amount.toLocaleString("en-IN")}`;

  const isOffline = networkStatus?.status === "OFFLINE";

  const showReview = !["VERIFYING", "SUCCESS"].includes(
    paymentState
  );

  const paymentErrorMessage = {
    NETWORK_ERROR:
      "You’re offline. Reconnect to continue with payment.",

    NETWORK_POOR:
      "Your connection is unstable. Payment may take longer.",

    RAZORPAY_LOAD_ERROR:
      "The payment gateway could not be loaded. Please try again.",

    PAYMENT_ERROR:
      "Something went wrong while preparing your payment.",

    PAYMENT_FAILED:
      "The payment could not be completed. You can try again.",

    VERIFICATION_FAILED:
      "We could not verify the payment. Please try again or contact support.",
  }[paymentState];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#080d18]/70 backdrop-blur-xl sm:flex sm:items-center sm:justify-center sm:p-5">
      <section
        className="mx-auto flex h-dvh min-h-screen w-full flex-col overflow-hidden bg-[var(--surface-base)] sm:min-h-0 sm:max-h-[calc(100vh-40px)] sm:max-w-[760px] sm:rounded-[25px] sm:border"
        style={{ borderColor: "var(--border-default)" }}
      >
        {!["VERIFYING", "SUCCESS"].includes(paymentState) && (
          <header
            className="flex h-[54px] shrink-0 items-center justify-between border-b px-4 sm:h-[58px] sm:px-6"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <button
              type="button"
              onClick={goBack}
              className="group flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-secondary)]"
            >
              <ArrowLeft
                size={15}
                className="transition-transform group-hover:-translate-x-0.5"
              />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              <LockKeyhole size={11} />
              <span>Secure checkout</span>
            </div>

            <button
              type="button"
              onClick={goBack}
              aria-label="Close checkout"
              className="flex size-8 items-center justify-center rounded-full border text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-elevated)]"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <X size={14} />
            </button>
          </header>
        )}

        {paymentState === "VERIFYING" && (
          <div className="flex min-h-0 flex-1 items-center justify-center p-5">
            <PaymentVerification />
          </div>
        )}

        {showReview && (
          <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <div className="mx-auto w-full max-w-[680px] px-4 pb-[170px] pt-5 sm:px-6 sm:pb-7 sm:pt-7">
              <section
                className="border-b pb-5 sm:pb-6"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[var(--accent-gold)]">
                  Tournament entry
                </p>

                <h1 className="mt-1 text-[22px] font-bold leading-tight tracking-[-0.035em] text-[var(--headline-primary)] sm:text-[26px]">
                  Review your payment
                </h1>
              </section>

              <section
                className="border-b py-5 sm:py-6"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <SectionLabel icon={Gamepad2}>
                  Tournament
                </SectionLabel>

                <h2 className="mt-3 line-clamp-2 text-[14px] font-semibold leading-snug tracking-[-0.02em] text-[var(--text-primary)] sm:text-[15px]">
                  {tournamentName}
                </h2>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  <DetailRow
                    icon={Gamepad2}
                    label="Game"
                    value={game}
                  />

                  <DetailRow
                    icon={Layers3}
                    label="Format"
                    value={format}
                  />
                </div>
              </section>

              <section
                className="border-b py-5 sm:py-6"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <SectionLabel icon={UserRound}>
                  Player
                </SectionLabel>

                <h2 className="mt-3 text-[14px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[15px]">
                  {username}
                </h2>

                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <DetailRow
                    icon={UserRound}
                    label="MLBB ID"
                    value={mlbbId}
                  />

                  <DetailRow
                    icon={Users}
                    label="Team"
                    value={teamName}
                  />
                </div>
              </section>

              <section className="py-5 sm:py-6">
                <SectionLabel icon={CreditCard}>
                  Payment
                </SectionLabel>

                <div
                  className="mt-4 rounded-[17px] border bg-[var(--surface-elevated)]/40 p-4 sm:p-5"
                  style={{ borderColor: "var(--border-default)" }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-[var(--text-primary)]">
                        Tournament contribution
                      </p>

                      <p className="mt-0.5 text-[8px] text-[var(--text-muted)]">
                        Individual player contribution
                      </p>
                    </div>

                    <span className="shrink-0 text-[13px] font-semibold text-[var(--text-primary)]">
                      {formattedAmount}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-4">
                    <span className="text-[10px] text-[var(--text-secondary)]">
                      Platform fee
                    </span>

                    <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                      ₹0.00
                    </span>
                  </div>

                  <div
                    className="my-4 h-px"
                    style={{
                      backgroundColor: "var(--border-default)",
                    }}
                  />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                      Total payable
                    </span>

                    <span className="text-[20px] font-bold tracking-[-0.04em] text-[var(--text-primary)]">
                      {formattedAmount}
                    </span>
                  </div>

                  <div
                    className="mt-4 flex items-start gap-2.5 rounded-[12px] border bg-[var(--surface-base)] p-3"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <Info
                      size={14}
                      className="mt-0.5 shrink-0 text-[var(--text-muted)]"
                    />

                    <p className="text-[8px] leading-[1.55] text-[var(--text-secondary)]">
                      This payment is your individual contribution.
                      Tournament registration is completed only after
                      all required roster members have paid.
                    </p>
                  </div>
                </div>
              </section>

              <section
                className="border-t pt-5 sm:pt-6"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                    Payment method
                  </p>

                  <span className="text-[8px] text-[var(--text-muted)]">
                    Choose how to pay
                  </span>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <PaymentMethod
                    icon={CreditCard}
                    title="UPI"
                    description="Google Pay · PhonePe · Paytm"
                    selected
                  />

                  <PaymentMethod
                    icon={WalletCards}
                    title="Wallet"
                    description="Wallet payments are unavailable"
                    badge="Coming soon"
                    disabled
                  />
                </div>
              </section>

              <div className="mt-4">
                <PaymentNetworkStatus
                  status={networkStatus?.status}
                  onRetry={handleRetry}
                />
              </div>

              {paymentErrorMessage && (
                <div
                  className="mt-3 rounded-[13px] border p-3"
                  role="alert"
                  style={{
                    borderColor: "var(--border-default)",
                    background: "var(--surface-elevated)",
                  }}
                >
                  <p className="text-[10px] font-semibold text-[var(--text-primary)]">
                    Payment issue
                  </p>

                  <p className="mt-1 text-[9px] leading-relaxed text-[var(--text-secondary)]">
                    {paymentErrorMessage}
                  </p>

                  {paymentState !== "NETWORK_ERROR" && (
                    <button
                      type="button"
                      onClick={handleCheckout}
                      disabled={
                        isProcessing ||
                        amount <= 0 ||
                        isOffline
                      }
                      className="mt-3 inline-flex items-center gap-1.5 rounded-[9px] border px-3 py-2 text-[9px] font-semibold text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                      style={{
                        borderColor: "var(--border-default)",
                      }}
                    >
                      <RefreshCw size={11} />
                      Try again
                    </button>
                  )}
                </div>
              )}

              <div className="mt-5 hidden items-center justify-center gap-6 text-[8px] text-[var(--text-muted)] sm:flex">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={11} />
                  Secure payment
                </span>

                <span className="flex items-center gap-1.5">
                  <LockKeyhole size={10} />
                  Razorpay protected
                </span>

                <span className="flex items-center gap-1.5">
                  <Check size={10} />
                  Verified processing
                </span>
              </div>
            </div>
          </main>
        )}

        {showReview && (
          <footer
            className="fixed bottom-0 left-0 right-0 z-30 border-t bg-[var(--surface-base)]/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:static sm:shrink-0 sm:px-6 sm:pb-4"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div className="mx-auto flex w-full max-w-[680px] items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Total payable
                </p>

                <p className="mt-1 text-[19px] font-bold leading-none tracking-[-0.04em] text-[var(--text-primary)] sm:text-[21px]">
                  {formattedAmount}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={
                  isProcessing ||
                  amount <= 0 ||
                  isOffline
                }
                className="group flex h-[45px] shrink-0 items-center justify-center gap-2 rounded-[13px] bg-[var(--action-primary-bg)] px-4 text-[10px] font-bold text-[var(--action-primary-text)] transition-all hover:brightness-105 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 sm:h-[47px] sm:min-w-[205px]"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw
                      size={13}
                      className="animate-spin"
                    />
                    <span>Preparing payment</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to pay</span>

                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </div>

            <div className="mt-2 flex items-center justify-center gap-1.5 text-[7px] text-[var(--text-muted)] sm:hidden">
              <LockKeyhole size={8} />
              <span>Securely processed through Razorpay</span>
            </div>
          </footer>
        )}
      </section>
    </div>
  );
}

export default TournamentEntryCheckoutOverlay;