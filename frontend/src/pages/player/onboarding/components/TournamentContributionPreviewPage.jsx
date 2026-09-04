
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, LockKeyhole, ShieldCheck, Swords, Trophy, UserRound, Users, Wallet, AlertCircle, X, } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import { useRazorpayPayment } from "../../../../hooks/payments/useRazorpayPayment";

function TournamentContributionPreviewPage({
  tournament: tournamentProp,
  player: playerProp,
  team: teamProp,
  walletBalance = 450,
}) {
  const navigate = useNavigate();
  const { id:contributionId } = useParams();

  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [isProcessing, setIsProcessing] = useState(false);

  const { paymentState, networkStatus, startPayment, } = useRazorpayPayment();

  const tournament = {
    name:
      tournamentProp?.tournament_name ||
      tournamentProp?.name ||
      "Mobile Legends Champions Cup",

    logo:
      tournamentProp?.tournament_logo_url ||
      tournamentProp?.logo_url ||
      "",

    banner:
      tournamentProp?.tournament_banner_url ||
      tournamentProp?.banner_url ||
      "",

    format:
      tournamentProp?.tournament_format_type ||
      tournamentProp?.format ||
      "5V5",

    type:
      tournamentProp?.tournament_type ||
      tournamentProp?.type ||
      "Single Elimination",

    entryFee:
      tournamentProp?.tournament_entry_fees ??
      tournamentProp?.tournament_entry_fee ??
      tournamentProp?.entry_fee ??
      100,
  };

  const player = {
    name:
      playerProp?.name ||
      playerProp?.player_name ||
      playerProp?.full_name ||
      "Vijay",
  };

  const team = {
    name:
      teamProp?.team_name ||
      teamProp?.name ||
      "Team Phoenix",
  };

  const amount = Number(tournament.entryFee || 0);
  const balance = Number(walletBalance || 0);

  const hasSufficientWalletBalance = balance >= amount;

  const handleBack = () => {
    navigate(`/player/tournament/${contributionId}/detail`);
  };

  const handleWalletPayment = async () => {
    if (!hasSufficientWalletBalance) return;

    // Call your wallet contribution API here

    console.log("Wallet payment:", {
      contributionId: contributionId,
      amount,
      paymentMethod: "wallet",
    });
  };

  const handleRazorpayPayment = async (contributionId) => {
    await startPayment(contributionId);
  };

  const handlePayment = async () => {
    if (isProcessing) return;

    if (
      paymentMethod === "wallet" &&
      !hasSufficientWalletBalance
    ) {
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === "wallet") {
        await handleWalletPayment();
        return;
      }

      if (paymentMethod === "online") {
        await handleRazorpayPayment(contributionId);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentButtonDisabled =
    isProcessing ||
    (paymentMethod === "wallet" &&
      !hasSufficientWalletBalance);

  const paymentButtonText =
    paymentMethod === "wallet"
      ? `Pay ₹${amount.toLocaleString("en-IN")} from Wallet`
      : "Continue to Razorpay";


  return (
    <TournamentContributionOverlay onBack={handleBack} onClose={handleBack}>

      <div className="mx-auto flex w-full max-w-[1040px] flex-col px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">

        <div className="max-w-[620px]">

          <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-[var(--accent-gold)]">
            Contribution review
          </p>


          <h1 className="mt-2 text-[24px] font-black leading-[1.05] tracking-[-0.035em] text-[var(--text-primary)] sm:text-[30px]">
            Secure your participation
          </h1>


          <p className="mt-2.5 max-w-[560px] text-[9px] leading-[1.7] text-[var(--text-secondary)] sm:text-[10px]">
            Review your tournament contribution and choose how you would like to complete the payment.
          </p>

        </div>

        <div className="mt-6 grid gap-4 lg:mt-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(330px,.9fr)] lg:gap-5">

          <div className="min-w-0 space-y-4">

            {/* TOURNAMENT CARD */}

            <section className="overflow-hidden rounded-[14px] border" style={{ borderColor: "var(--border-default)", background: "var(--surface-elevated)" }}>

              <div className="relative h-[115px] overflow-hidden sm:h-[130px]">

                {tournament.banner ? (
                  <img src={tournament.banner} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--surface-floating), var(--surface-base))" }} />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />


                <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">

                  <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border sm:size-11" style={{ borderColor: "rgba(255,255,255,.16)", background: "rgba(0,0,0,.5)" }}>

                    {tournament.logo ? (
                      <img src={tournament.logo} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Trophy size={18} className="text-[var(--accent-gold)]" />
                    )}

                  </div>


                  <div className="min-w-0">

                    <p className="text-[6px] font-bold uppercase tracking-[0.12em] text-[var(--accent-gold)]">
                      Tournament
                    </p>


                    <h2 className="mt-1 line-clamp-2 text-[14px] font-black uppercase leading-[1.1] tracking-[-0.02em] text-white sm:text-[16px]">
                      {tournament.name}
                    </h2>

                  </div>

                </div>

              </div>


              <div className="grid grid-cols-2 divide-x" style={{ borderColor: "var(--border-subtle)" }}>

                <ReviewMeta icon={<Swords size={12} />} label="Format" value={tournament.format} />

                <ReviewMeta icon={<Trophy size={12} />} label="Tournament Type" value={tournament.type} />

              </div>

            </section>


            {/* PARTICIPATION */}

            <section className="rounded-[14px] border p-4" style={{ borderColor: "var(--border-subtle)", background: "var(--surface-elevated)" }}>

              <div className="flex items-center justify-between gap-3">

                <div>

                  <p className="text-[7px] font-bold uppercase tracking-[0.13em] text-[var(--accent-gold)]">
                    Participation
                  </p>

                  <h2 className="mt-1 text-[12px] font-black text-[var(--text-primary)] sm:text-[13px]">
                    Player & Team
                  </h2>

                </div>


                <div className="flex size-8 items-center justify-center rounded-full border" style={{ borderColor: "var(--border-subtle)" }}>
                  <Users size={13} className="text-[var(--accent-gold)]" />
                </div>

              </div>


              <div className="mt-4 grid gap-4 sm:grid-cols-2">

                <ParticipantRow icon={<UserRound size={13} />} label="Player" value={player.name} />

                <ParticipantRow icon={<Users size={13} />} label="Team" value={team.name} />

              </div>

            </section>


            {/* ELIGIBILITY */}

            <section className="rounded-[14px] border p-4" style={{ borderColor: "color-mix(in srgb, var(--accent-gold) 16%, var(--border-subtle))", background: "color-mix(in srgb, var(--accent-gold) 3%, var(--surface-elevated))" }}>

              <div className="flex items-start gap-3">

                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: "color-mix(in srgb, var(--accent-gold) 22%, transparent)" }}>
                  <ShieldCheck size={13} className="text-[var(--accent-gold)]" />
                </div>


                <div className="min-w-0">

                  <h3 className="text-[8px] font-black uppercase tracking-[0.08em] text-[var(--text-primary)]">
                    Before you continue
                  </h3>


                  <p className="mt-1.5 text-[8px] leading-[1.7] text-[var(--text-secondary)]">
                    Your contribution is individual to your player account. Payment records your contribution while tournament participation remains subject to roster and tournament eligibility requirements.
                  </p>


                  <div className="mt-3 space-y-2">

                    <EligibilityItem text="Individual contribution" />

                    <EligibilityItem text="Player participation recorded" />

                    <EligibilityItem text="Tournament rules apply" />

                  </div>

                </div>

              </div>

            </section>

          </div>

          {/* RIGHT COLUMN */}
          <aside className="min-w-0">

            <section className="overflow-hidden rounded-[14px] border lg:sticky lg:top-4" style={{ borderColor: "var(--border-default)", background: "var(--surface-elevated)" }}>


              {/* PAYMENT SUMMARY */}

              <div className="border-b px-4 py-4 sm:px-5" style={{ borderColor: "var(--border-subtle)" }}>

                <p className="text-[7px] font-bold uppercase tracking-[0.13em] text-[var(--accent-gold)]">
                  Payment summary
                </p>


                <h2 className="mt-1 text-[14px] font-black tracking-[-0.02em] text-[var(--text-primary)] sm:text-[15px]">
                  Individual Contribution
                </h2>

              </div>


              {/* TOTAL */}

              <div className="px-4 py-4 sm:px-5 sm:py-5">

                <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                  Total payable
                </p>


                <div className="mt-1.5 flex items-baseline gap-1.5">

                  <span className="text-[30px] font-black tracking-[-0.04em] text-[var(--accent-gold)] sm:text-[34px]">
                    ₹{amount.toLocaleString("en-IN")}
                  </span>

                </div>


                <p className="mt-1 text-[8px] leading-[1.6] text-[var(--text-muted)]">
                  One-time individual tournament contribution
                </p>

              </div>


              {/* PAYMENT METHOD */}

              <div className="border-t px-4 py-4 sm:px-5" style={{ borderColor: "var(--border-subtle)" }}>

                <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[var(--accent-gold)]">
                  Payment method
                </p>


                <h3 className="mt-1 text-[10px] font-black text-[var(--text-primary)]">
                  Choose how you want to pay
                </h3>


                <PaymentMethodCard
                  selected={paymentMethod === "wallet"}
                  onClick={() => setPaymentMethod("wallet")}
                  icon={<Wallet size={15} />}
                  title="Player Wallet"
                  description={hasSufficientWalletBalance ? "Use your available wallet balance" : "Insufficient wallet balance"}
                  rightContent={
                    <div className="text-right">
                      <p className="text-[6px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                        Balance
                      </p>

                      <p className={`mt-0.5 text-[9px] font-black ${hasSufficientWalletBalance ? "text-[var(--text-primary)]" : "text-red-500"}`}>
                        ₹{balance.toLocaleString("en-IN")}
                      </p>
                    </div>
                  }
                  disabled={!hasSufficientWalletBalance}
                />


                <PaymentMethodCard
                  selected={paymentMethod === "online"}
                  onClick={() => setPaymentMethod("online")}
                  icon={<CreditCard size={15} />}
                  title="Online Payment"
                  description="UPI, Cards & Net Banking"
                  rightContent={<span className="text-[7px] font-semibold text-[var(--text-muted)]">Razorpay</span>}
                />


                {!hasSufficientWalletBalance && (

                  <div className="mt-2.5 flex items-start gap-2 rounded-[9px] border px-3 py-2.5" style={{ borderColor: "color-mix(in srgb, #ef4444 18%, var(--border-subtle))", background: "color-mix(in srgb, #ef4444 4%, transparent)" }}>

                    <AlertCircle size={12} className="mt-0.5 shrink-0 text-red-500" />

                    <p className="text-[7px] leading-[1.6] text-[var(--text-secondary)]">
                      Your wallet balance is not enough to cover this contribution. Select Online Payment to continue.
                    </p>

                  </div>

                )}

              </div>


              {/* BREAKDOWN */}

              <div className="border-t px-4 py-4 sm:px-5" style={{ borderColor: "var(--border-subtle)" }}>

                <PaymentRow label="Individual contribution" value={`₹${amount.toLocaleString("en-IN")}`} />

                <PaymentRow label="Platform / processing fee" value="₹0" />


                <div className="my-3 border-t" style={{ borderColor: "var(--border-subtle)" }} />


                <PaymentRow label="Total" value={`₹${amount.toLocaleString("en-IN")}`} strong />

              </div>


              {/* SECURITY */}

              <div className="border-t px-4 py-3 sm:px-5" style={{ borderColor: "var(--border-subtle)" }}>

                <div className="flex items-center gap-2">

                  <LockKeyhole size={11} className="text-[var(--accent-gold)]" />

                  <p className="text-[7px] font-semibold text-[var(--text-muted)]">
                    {paymentMethod === "wallet" ? "Payment will be deducted securely from your wallet." : "Secure online payment powered by Razorpay."}
                  </p>

                </div>

              </div>


              {/* ACTION */}

              <div className="p-3 sm:p-4">

                <button type="button" onClick={handlePayment} disabled={paymentButtonDisabled} className="group relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-[9px] border text-[8px] font-black uppercase tracking-[0.1em] transition hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-45" style={{ color: "var(--bg-canvas)", background: "var(--accent-gold)", borderColor: "color-mix(in srgb, var(--accent-gold) 60%, transparent)" }}>

                  <span className="absolute inset-y-0 left-0 w-[3px] bg-black/10" />


                  {isProcessing ? (

                    <>
                      <span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing
                    </>

                  ) : (

                    <>
                      <span>{paymentButtonText}</span>

                      <ArrowRight size={13} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
                    </>

                  )}

                </button>


                <p className="mt-2 text-center text-[6px] leading-[1.6] text-[var(--text-muted)]">

                  {paymentMethod === "wallet"
                    ? "Your wallet balance will be updated after successful confirmation."
                    : "You will continue to Razorpay's secure payment checkout."}

                </p>

              </div>

            </section>

          </aside>

        </div>


        {/* FOOTNOTE */}

        <div className="mt-5 flex items-center justify-center gap-1.5 px-3 text-center sm:mt-6">

          <ShieldCheck size={10} className="shrink-0 text-[var(--accent-gold)]" />

          <p className="text-[7px] font-medium text-[var(--text-muted)]">
            Payment is securely processed and recorded against your tournament participation.
          </p>

        </div>

      </div>

    </TournamentContributionOverlay>
  );
}


function TournamentContributionOverlay({ children, onBack, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-0 backdrop-blur-md sm:p-4 lg:p-6">

      <section className="relative flex h-[100dvh] w-full flex-col overflow-hidden border bg-[var(--surface-base)] sm:h-[92dvh] sm:max-w-[1120px] sm:rounded-[20px]" style={{ borderColor: "var(--border-default)" }}>


        <header className="flex h-12 shrink-0 items-center justify-between border-b px-3.5 sm:h-13 sm:px-6" style={{ borderColor: "var(--border-subtle)" }}>


          {/* LEFT SIDE */}

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">


            {/* BACK */}

            <button type="button" onClick={onBack} className="group flex shrink-0 items-center gap-1.5 rounded-md px-1 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] transition hover:text-[var(--text-primary)] sm:text-[9px]">

              <span className="flex size-7 items-center justify-center rounded-md border transition-colors group-hover:border-[var(--accent-gold)]" style={{ borderColor: "var(--border-subtle)" }}>
                <ArrowLeft size={13} strokeWidth={1.8} className="transition-transform group-hover:-translate-x-0.5" />
              </span>


              <span className="hidden sm:inline">
                Back to tournament
              </span>

            </button>


            {/* DIVIDER */}

            <span className="hidden h-4 w-px sm:block" style={{ background: "var(--border-subtle)" }} />


            {/* PAGE CONTEXT */}

            <div className="hidden items-center gap-1.5 sm:flex">

              <span className="size-1.5 rounded-full bg-[var(--accent-gold)]" />

              <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Tournament Contribution
              </span>

            </div>

          </div>


          {/* RIGHT SIDE */}

          <div className="flex items-center gap-2 sm:gap-3">


            {/* SECURE STATUS */}

            <div className="hidden items-center gap-1.5 sm:flex">

              <LockKeyhole size={10} className="text-[var(--accent-gold)]" />

              <span className="text-[7px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                Secure contribution
              </span>

            </div>


            <span className="hidden h-4 w-px sm:block" style={{ background: "var(--border-subtle)" }} />


            {/* CLOSE */}

            <button type="button" onClick={onClose} aria-label="Close contribution" className="flex size-7 shrink-0 items-center justify-center rounded-md border text-[var(--text-secondary)] transition hover:border-red-400/30 hover:text-[var(--text-primary)] sm:size-8" style={{ borderColor: "var(--border-subtle)" }}>

              <X size={14} strokeWidth={1.8} />

            </button>

          </div>

        </header>


        <div className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>

      </section>

    </div>
  );
}


// PAYMENT METHOD
function PaymentMethodCard({ selected, onClick, icon, title, description, rightContent, disabled = false }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`mt-2.5 flex w-full items-center gap-2.5 rounded-[9px] border p-3 text-left transition ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-[color-mix(in_srgb,var(--accent-gold)_30%,var(--border-subtle))]"}`} style={{ borderColor: selected ? "color-mix(in srgb, var(--accent-gold) 48%, var(--border-default))" : "var(--border-subtle)", background: selected ? "color-mix(in srgb, var(--accent-gold) 6%, var(--surface-base))" : "var(--surface-base)" }}>

      <div className="flex size-4 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: selected ? "var(--accent-gold)" : "var(--border-default)" }}>
        {selected && <span className="size-1.5 rounded-full bg-[var(--accent-gold)]" />}
      </div>


      <div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] border" style={{ borderColor: "var(--border-subtle)", color: selected ? "var(--accent-gold)" : "var(--text-muted)" }}>
        {icon}
      </div>


      <div className="min-w-0 flex-1">

        <p className="text-[8px] font-black text-[var(--text-primary)]">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[6px] font-medium text-[var(--text-muted)]">
          {description}
        </p>

      </div>


      {rightContent}

    </button>
  );
}

// REVIEW META
function ReviewMeta({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3">

      <span className="shrink-0 text-[var(--text-muted)]">
        {icon}
      </span>


      <div className="min-w-0">

        <p className="text-[6px] font-bold uppercase tracking-[0.09em] text-[var(--text-muted)]">
          {label}
        </p>

        <p className="mt-0.5 truncate text-[9px] font-black text-[var(--text-primary)]">
          {value}
        </p>

      </div>

    </div>
  );
}


/* PARTICIPANT ROW */

function ParticipantRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5">

      <div className="flex size-8 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
        {icon}
      </div>


      <div className="min-w-0">

        <p className="text-[6px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">
          {label}
        </p>

        <p className="mt-0.5 truncate text-[9px] font-black text-[var(--text-primary)]">
          {value}
        </p>

      </div>

    </div>
  );
}


/*  ELIGIBILITY ITEM */

function EligibilityItem({ text }) {
  return (
    <div className="flex items-center gap-2">

      <CheckCircle2 size={11} className="shrink-0 text-[var(--accent-gold)]" />

      <span className="text-[7px] font-semibold text-[var(--text-secondary)]">
        {text}
      </span>

    </div>
  );
}


/* PAYMENT ROW  */

function PaymentRow({ label, value, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-3">

      <span className={`text-[8px] ${strong ? "font-black text-[var(--text-primary)]" : "font-medium text-[var(--text-secondary)]"}`}>
        {label}
      </span>


      <span className={`shrink-0 text-[8px] ${strong ? "font-black text-[var(--accent-gold)]" : "font-bold text-[var(--text-primary)]"}`}>
        {value}
      </span>

    </div>
  );
}


export default TournamentContributionPreviewPage;

