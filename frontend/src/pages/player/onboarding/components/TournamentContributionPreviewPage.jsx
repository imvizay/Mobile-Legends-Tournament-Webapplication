
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Swords,
  Trophy,
  UserRound,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useRazorpayPayment } from "../../../../hooks/payments/useRazorpayPayment";
import PaymentNetworkStatus from "../../../../features/payments/components/NetworkWarning";
import { teamTournamentService } from "../../../../services/team_service";

function TournamentContributionPreviewPage({ onWalletPayment }) {
  const navigate = useNavigate();
  const { id: tournamentId } = useParams();

  const idempotencyKey = useRef(crypto.randomUUID());

  const {
    data: paymentReview,
    isPending: paymentReviewPending,
    isError: paymentReviewError,
    error,
    refetch: paymentReviewRefetch,
  } = useQuery({
    queryKey: ["payment-review", tournamentId],
    queryFn: () => teamTournamentService.getPaymentReview(tournamentId),
    enabled: !!tournamentId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 3,
  });

  const goBack = () => navigate(`/player/tournament/${tournamentId}/detail`);

  if (!tournamentId) return null;

  if (paymentReviewPending) {
    return (
      <TournamentContributionOverlay onBack={goBack} onClose={goBack}>
        <PaymentReviewSkeleton />
      </TournamentContributionOverlay>
    );
  }

  if (paymentReviewError || !paymentReview) {
    return (
      <TournamentContributionOverlay onBack={goBack} onClose={goBack}>
        <PaymentReviewError message={error?.message} onRetry={paymentReviewRefetch} />
      </TournamentContributionOverlay>
    );
  }

  return (
    <PaymentReviewContent
      tournamentId={tournamentId}
      paymentReview={paymentReview}
      onWalletPayment={onWalletPayment}
      idempotencyKey={idempotencyKey}
      goBack={goBack}
    />
  );
}

function PaymentReviewContent({ tournamentId, paymentReview, onWalletPayment, idempotencyKey, goBack }) {
  const tournamentData = paymentReview?.tournament ?? {};
  const playerData = paymentReview?.player ?? {};
  const teamData = paymentReview?.team ?? {};

  const tournament = {
    name: tournamentData.tournament_name || tournamentData.name || "Untitled tournament",
    game: tournamentData.game_name || tournamentData.game || "",
    logo: tournamentData.tournament_logo_url || tournamentData.logo_url || "",
    banner: tournamentData.background_image_url || "",
    format: tournamentData.team_format || "5V5",
    type: tournamentData.bracket_format || "Single elimination",
    entryFee: Number(tournamentData.tournament_entry_fees ?? tournamentData.tournament_entry_fee ?? tournamentData.entry_fee ?? 0),
  };

  const playerName = playerData.name || playerData.player_name || playerData.full_name || "Player";
  const teamName = teamData.team_name || teamData.name || "Unassigned team";
  const balance = Number(paymentReview?.wallet_balance ?? paymentReview?.wallet?.balance ?? 0);
  const walletAvailable = balance >= tournament.entryFee;

  const [paymentMethod, setPaymentMethod] = useState(walletAvailable ? "wallet" : "online");
  const [isProcessing, setIsProcessing] = useState(false);

  const { networkStatus, startPayment, retryPayment } = useRazorpayPayment();

  const payWithWallet = async () => {
    if (!walletAvailable) return;
    if (onWalletPayment) return onWalletPayment(tournamentId);
    console.log("Wallet payment:", { tournamentId, amount: tournament.entryFee, paymentMethod: "wallet" });
  };

  const payOnline = () => startPayment(tournamentId, idempotencyKey.current);

  const handlePayment = async () => {
    if (isProcessing) return;

    if (paymentMethod === "wallet" && !walletAvailable) {
      setPaymentMethod("online");
      return;
    }

    setIsProcessing(true);

    try {
      await (paymentMethod === "wallet" ? payWithWallet() : payOnline());
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => retryPayment(tournamentId, idempotencyKey.current);

  return (
    <TournamentContributionOverlay onBack={goBack} onClose={goBack}>
      <PaymentNetworkStatus status={networkStatus?.status} onRetry={handleRetry} />

      <div className="mx-auto w-full max-w-[1120px] px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-5 lg:px-8 lg:pb-9 lg:pt-5">
        <header className="flex items-end justify-between gap-5 border-b pb-3.5 sm:pb-4" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-px w-5 bg-[var(--accent-gold)]" />
              <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-[var(--accent-gold)] sm:text-[8px]">Contribution review</p>
            </div>
            <h1 className="mt-1.5 text-[21px] font-black tracking-[-0.045em] text-[var(--headline-primary)] sm:text-[25px] lg:text-[27px]">Secure your participation</h1>
            <p className="mt-1.5 max-w-[580px] text-[8px] leading-4 text-[var(--text-secondary)] sm:text-[9px] sm:leading-5">Review your tournament identity and choose how you would like to complete your contribution.</p>
          </div>

          <div className="hidden shrink-0 items-center gap-1.5 pb-0.5 lg:flex">
            <ShieldCheck size={12} className="text-[var(--text-muted)]" />
            <span className="text-[7px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">Secure checkout</span>
          </div>
        </header>

        <div className="mt-4 grid gap-4 lg:mt-5 lg:grid-cols-[minmax(0,1fr)_350px] lg:items-start lg:gap-5">
          <main className=" min-w-0 space-y-4  lg:space-y-5">
            <TournamentIdentity tournament={tournament} />
            <IdentitySection playerName={playerName} teamName={teamName} />
            <ParticipationNotice />
          </main>

          <PaymentRail amount={tournament.entryFee} balance={balance} walletAvailable={walletAvailable} paymentMethod={paymentMethod} onMethodChange={setPaymentMethod} isProcessing={isProcessing} onPayment={handlePayment} />
        </div>
      </div>
    </TournamentContributionOverlay>
  );
}

function TournamentIdentity({ tournament }) {
  return (
    <section className="overflow-hidden rounded-[13px] border sm:rounded-[15px]" style={{ borderColor: "var(--border-default)", background: "var(--surface-elevated)", boxShadow: "var(--shadow-sm)" }}>
      <div className="relative h-[135px] overflow-hidden sm:h-[155px] lg:h-[160px]">
        {tournament.banner ? <img src={tournament.banner} alt="" className="absolute inset-0 size-full object-cover" /> : <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--surface-floating), var(--surface-base))" }} />}
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,.88), rgba(0,0,0,.45) 65%, rgba(0,0,0,.12))" }} />

        <div className="relative flex h-full items-end p-3.5 sm:p-5">
          <div className="flex min-w-0 items-end gap-3 sm:gap-3.5">
            <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border sm:size-12 sm:rounded-[10px]" style={{ borderColor: "rgba(255,255,255,.18)", background: "rgba(0,0,0,.42)" }}>
              {tournament.logo ? <img src={tournament.logo} alt="" className="size-full object-cover" /> : <Trophy size={17} className="text-[var(--accent-gold)] sm:size-[19px]" />}
            </div>

            <div className="min-w-0 pb-0.5">
              <p className="text-[6px] font-bold uppercase tracking-[0.16em] text-[var(--accent-gold)] sm:text-[7px]">Official competition</p>
              <h2 className="mt-1 line-clamp-2 text-[14px] font-black uppercase leading-[1.12] tracking-[-0.025em] text-white sm:text-[19px] lg:text-[20px]">{tournament.name}</h2>
              {tournament.game && <p className="mt-1 truncate text-[7px] font-semibold text-white/70 sm:text-[8px]">{tournament.game}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        {[
          [Swords, "Format", tournament.format],
          [Trophy, "Tournament type", tournament.type],
        ].map(([Icon, label, value]) => (
          <div key={label} className="flex min-w-0 items-center gap-2 border-t px-3 py-2.5 sm:gap-2.5 sm:px-4 sm:py-3" style={{ borderColor: "var(--border-subtle)" }}>
            <Icon size={11} className="shrink-0 text-[var(--text-muted)] sm:size-3" />
            <div className="min-w-0">
              <p className="text-[6px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] sm:text-[7px]">{label}</p>
              <p className="mt-0.5 truncate text-[8px] font-black text-[var(--text-primary)] sm:text-[9px]">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function IdentitySection({ playerName, teamName }) {
  return (
    <section>
      <SectionLabel>Participation</SectionLabel>

      <div className="mt-2 overflow-hidden rounded-[12px] border sm:mt-2.5 sm:grid sm:grid-cols-2 sm:rounded-[13px]" style={{ borderColor: "var(--border-subtle)", background: "var(--surface-elevated)" }}>
        <IdentityItem icon={<UserRound size={13} strokeWidth={1.7} />} label="Player" value={playerName} />
        <IdentityItem icon={<Users size={13} strokeWidth={1.7} />} label="Team" value={teamName} bordered />
      </div>
    </section>
  );
}

function IdentityItem({ icon, label, value, bordered }) {
  return (
    <div className={`flex items-center gap-2.5 px-3 py-3 sm:p-4 ${bordered ? "border-t sm:border-l sm:border-t-0" : ""}`} style={{ borderColor: "var(--border-subtle)" }}>
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: "var(--border-subtle)", background: "var(--surface-base)", color: "var(--accent-gold)" }}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[6px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] sm:text-[7px]">{label}</p>
        <p className="mt-0.5 truncate text-[9px] font-black text-[var(--text-primary)] sm:text-[10px]">{value}</p>
      </div>
    </div>
  );
}

function ParticipationNotice() {
  const participationItems = ["Individual contribution", "Player participation recorded", "Tournament rules apply"];

  return (
    <section className="rounded-[12px] border p-3 sm:rounded-[13px] sm:p-4" style={{ borderColor: "var(--border-subtle)", background: "var(--surface-elevated)" }}>
      <div className="flex gap-2.5">
        <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[var(--text-muted)]" />

        <div className="min-w-0 flex-1">
          <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] sm:text-[8px]">Participation</p>
          <p className="mt-1 text-[8px] font-bold text-[var(--text-primary)] sm:text-[9px]">Your contribution is linked to this tournament entry.</p>
          <p className="mt-1 text-[7px] leading-4 text-[var(--text-secondary)] sm:text-[8px] sm:leading-5">Participation remains subject to roster eligibility and tournament rules.</p>

          <div className="mt-2.5 flex max-w-full flex-nowrap gap-4 overflow-x-auto scrollbar-hide sm:gap-5">
            {participationItems.map((item) => (
              <div key={item} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
                <CheckCircle2 size={9} className="shrink-0 text-[var(--text-muted)]" />
                <span className="text-[6.5px] font-semibold text-[var(--text-secondary)] sm:text-[7px]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PaymentRail({ amount, balance, walletAvailable, paymentMethod, onMethodChange, isProcessing, onPayment }) {
  const formattedAmount = `₹${amount.toLocaleString("en-IN")}`;

  return (
    <aside className="order-1 min-w-0 lg:order-2">
      <section className="overflow-hidden rounded-[15px] border sm:rounded-[17px] lg:sticky lg:top-4" style={{ borderColor: "color-mix(in srgb, #6366f1 24%, var(--border-default))", background: "var(--surface-elevated)", boxShadow: "var(--shadow-md)" }}>
        <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-4" style={{ background: "linear-gradient(145deg, color-mix(in srgb, #6366f1 8%, var(--surface-elevated)), var(--surface-elevated) 65%)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-[7px]" style={{ background: "color-mix(in srgb, #6366f1 12%, var(--surface-base))", color: "#6366f1" }}>
                <CreditCard size={12} />
              </span>
              <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)] sm:text-[8px]">Contribution</span>
            </div>
            <LockKeyhole size={11} className="text-[var(--text-muted)]" />
          </div>

          <div className="mt-4 flex items-end justify-between gap-4 sm:mt-5 sm:block">
            <div>
              <p className="text-[6px] font-bold uppercase tracking-[0.13em] text-[var(--text-muted)] sm:text-[7px]">Total payable</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-[30px] font-black leading-none tracking-[-0.06em] text-[var(--headline-primary)] sm:text-[40px]">{formattedAmount}</span>
                <span className="text-[6px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] sm:text-[7px]">INR</span>
              </div>
            </div>

            <span className="mb-0.5 rounded-full border px-2 py-1 text-[6px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)] sm:hidden" style={{ borderColor: "var(--border-subtle)" }}>One-time</span>
          </div>
        </div>

        <div className="border-t px-4 py-4 sm:px-5 sm:py-4" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="flex items-center justify-between">
            <span className="text-[7px] font-bold uppercase tracking-[0.13em] text-[var(--text-primary)] sm:text-[8px]">Payment method</span>
            <ShieldCheck size={11} className="text-[var(--text-muted)]" />
          </div>

          <div className="mt-2.5 space-y-2">
            <PaymentMethod selected={paymentMethod === "wallet"} disabled={!walletAvailable} onClick={() => onMethodChange("wallet")} icon={<Wallet size={14} strokeWidth={1.8} />} title="Player wallet" description={walletAvailable ? "Available balance" : "Insufficient balance"} value={`₹${balance.toLocaleString("en-IN")}`} />
            <PaymentMethod selected={paymentMethod === "online"} onClick={() => onMethodChange("online")} icon={<CreditCard size={14} strokeWidth={1.8} />} title="Online payment" description="UPI, cards & net banking" value="Razorpay" />
          </div>

          {!walletAvailable && (
            <div className="mt-2.5 flex gap-2 rounded-[9px] border px-2.5 py-2" style={{ borderColor: "color-mix(in srgb, #6366f1 20%, var(--border-subtle))", background: "color-mix(in srgb, #6366f1 5%, var(--surface-base))" }}>
              <AlertCircle size={11} className="mt-0.5 shrink-0" style={{ color: "#6366f1" }} />
              <p className="text-[6.5px] leading-[1.6] text-[var(--text-secondary)] sm:text-[7px]">Wallet balance is below the required amount. Online payment is available instead.</p>
            </div>
          )}
        </div>

        <div className="border-t px-4 py-4 sm:px-5 sm:py-4" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="space-y-2">
            <SummaryRow label="Contribution" value={formattedAmount} />
            <SummaryRow label="Processing fee" value="₹0" />
          </div>

          <div className="my-3 border-t" style={{ borderColor: "var(--border-subtle)" }} />

          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black text-[var(--text-primary)] sm:text-[9px]">Total</span>
            <span className="text-[14px] font-black tracking-[-0.02em] sm:text-[15px]" style={{ color: "#6366f1" }}>{formattedAmount}</span>
          </div>
        </div>

        <div className="border-t p-3 sm:p-4" style={{ borderColor: "var(--border-subtle)", background: "color-mix(in srgb, var(--surface-base) 45%, var(--surface-elevated))" }}>
          <button type="button" onClick={onPayment} disabled={isProcessing || (paymentMethod === "wallet" && !walletAvailable)} className="group flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border px-4 text-[7px] font-black uppercase tracking-[0.1em] transition-all duration-200 hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45 sm:h-[48px] sm:text-[8px]" style={{ color: "var(--action-primary-text)", background: "var(--action-primary-bg)", borderColor: "var(--action-primary-border)", boxShadow: "var(--shadow-sm)" }}>
            {isProcessing ? (
              <>
                <span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing
              </>
            ) : (
              <>
                <span>{paymentMethod === "wallet" ? `Pay ${formattedAmount}` : "Continue to secure checkout"}</span>
                <ArrowRight size={12} strokeWidth={2.4} className="transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          <p className="mt-2.5 text-center text-[6.5px] font-medium text-[var(--text-muted)] sm:text-[7px]">Securely processed {paymentMethod === "online" ? "by Razorpay" : "from your wallet"}</p>
        </div>
      </section>
    </aside>
  );
}

function PaymentMethod({ selected, disabled, onClick, icon, title, description, value }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-pressed={selected} className="relative flex min-h-[56px] w-full items-center gap-2.5 overflow-hidden rounded-[10px] border p-2.5 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-[60px] sm:gap-3 sm:rounded-[11px] sm:p-3" style={{ borderColor: selected ? "color-mix(in srgb, #6366f1 50%, var(--border-default))" : "var(--border-subtle)", background: selected ? "color-mix(in srgb, #6366f1 6%, var(--surface-base))" : "var(--surface-base)", boxShadow: selected ? "var(--shadow-sm)" : "none" }}>
      {selected && <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: "#6366f1" }} />}

      <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full border sm:size-5" style={{ borderColor: selected ? "#6366f1" : "var(--border-default)" }}>
        {selected && <span className="size-1.5 rounded-full sm:size-2" style={{ background: "#6366f1" }} />}
      </span>

      <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] border sm:size-9" style={{ borderColor: selected ? "color-mix(in srgb, #6366f1 24%, var(--border-subtle))" : "var(--border-subtle)", background: selected ? "color-mix(in srgb, #6366f1 6%, var(--surface-base))" : "var(--surface-base)", color: selected ? "#6366f1" : "var(--text-muted)" }}>
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[8px] font-black text-[var(--text-primary)] sm:text-[9px]">{title}</span>
        <span className="mt-0.5 block truncate text-[6.5px] leading-4 text-[var(--text-muted)] sm:text-[7px]">{description}</span>
      </span>

      <span className="shrink-0 text-right text-[7px] font-black text-[var(--text-primary)] sm:text-[8px]">{value}</span>
    </button>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[7px] text-[var(--text-secondary)] sm:text-[8px]">{label}</span>
      <span className="text-[7px] font-bold text-[var(--text-primary)] sm:text-[8px]">{value}</span>
    </div>
  );
}

function SectionLabel({ children }) {
  return <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)] sm:text-[8px]">{children}</p>;
}

function PaymentReviewSkeleton() {
  const pulse = "animate-pulse rounded-[8px]";

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-5 lg:px-8 lg:pb-9 lg:pt-5">
      <div className={`h-2 w-24 ${pulse}`} style={{ background: "var(--surface-floating)" }} />
      <div className={`mt-2.5 h-6 w-64 ${pulse}`} style={{ background: "var(--surface-floating)" }} />
      <div className={`mt-2 h-3 w-96 max-w-full ${pulse}`} style={{ background: "var(--surface-floating)" }} />

      <div className="mt-4 grid gap-4 lg:mt-5 lg:grid-cols-[minmax(0,1fr)_350px] lg:gap-5">
        <main className="order-2 min-w-0 space-y-4 lg:order-1 lg:space-y-5">
          <div className={`h-[135px] w-full rounded-[13px] sm:h-[155px] sm:rounded-[15px] lg:h-[160px] ${pulse}`} style={{ background: "var(--surface-elevated)" }} />
          <div className={`h-[88px] w-full rounded-[12px] sm:h-[92px] sm:rounded-[13px] ${pulse}`} style={{ background: "var(--surface-elevated)" }} />
          <div className={`h-[104px] w-full rounded-[12px] sm:rounded-[13px] ${pulse}`} style={{ background: "var(--surface-elevated)" }} />
        </main>

        <aside className="order-1 lg:order-2">
          <div className={`h-[390px] w-full rounded-[15px] sm:rounded-[17px] ${pulse}`} style={{ background: "var(--surface-elevated)" }} />
        </aside>
      </div>
    </div>
  );
}

function PaymentReviewError({ message, onRetry }) {
  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-col items-center px-5 py-16 text-center sm:py-24">
      <div className="flex size-12 items-center justify-center rounded-full border sm:size-14" style={{ borderColor: "var(--border-subtle)", background: "var(--surface-elevated)", color: "#ef4444" }}>
        <AlertCircle size={20} />
      </div>

      <h2 className="mt-4 text-[13px] font-black tracking-[-0.02em] text-[var(--headline-primary)] sm:text-[15px]">Couldn't load your contribution details</h2>
      <p className="mt-2 text-[9px] leading-5 text-[var(--text-secondary)] sm:text-[10px]">{message || "Something went wrong while fetching this tournament's payment review. Check your connection and try again."}</p>

      <button type="button" onClick={onRetry} className="mt-5 flex h-10 items-center gap-2 rounded-[10px] border px-5 text-[8px] font-black uppercase tracking-[0.1em] transition-all duration-200 hover:-translate-y-px sm:h-11 sm:text-[9px]" style={{ color: "var(--action-primary-text)", background: "var(--action-primary-bg)", borderColor: "var(--action-primary-border)", boxShadow: "var(--shadow-sm)" }}>
        <RefreshCw size={12} />
        Try again
      </button>
    </div>
  );
}

function TournamentContributionOverlay({ children, onBack, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md sm:p-4 lg:p-6" style={{ background: "rgba(0,0,0,.68)" }}>
      <section className="relative flex h-[100dvh] w-full flex-col overflow-hidden border bg-[var(--surface-base)] sm:h-[92dvh] sm:max-w-[1120px] sm:rounded-[20px]" style={{ borderColor: "var(--border-default)", boxShadow: "var(--shadow-md)" }}>
        <header className="flex h-12 shrink-0 items-center justify-between border-b px-3 sm:h-13 sm:px-6" style={{ borderColor: "var(--border-subtle)" }}>
          <button type="button" onClick={onBack} className="group flex items-center gap-2 text-[7px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)] sm:text-[9px]">
            <span className="flex size-7 items-center justify-center rounded-md border" style={{ borderColor: "var(--border-subtle)" }}>
              <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
            </span>
            <span className="hidden sm:inline">Back to tournament</span>
          </button>

          <button type="button" onClick={onClose} aria-label="Close contribution" className="flex size-7 items-center justify-center rounded-md border text-[var(--text-secondary)] transition-colors hover:border-[var(--border-default)] hover:text-[var(--text-primary)] sm:size-8" style={{ borderColor: "var(--border-subtle)" }}>
            <X size={14} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">{children}</div>
      </section>
    </div>
  );
}

export default TournamentContributionPreviewPage;

