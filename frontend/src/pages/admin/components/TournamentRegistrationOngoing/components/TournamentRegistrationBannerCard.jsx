import { IndianRupee, ReceiptText } from "lucide-react";

const TournamentRegistrationBannerCard = ({ contribution = 0, total = 0, label = "ROSTER CONTRIBUTION", description = "Tournament entry contribution", icon: Icon = ReceiptText }) => {
  const formattedContribution = `₹${Number(contribution).toLocaleString("en-IN")}`;
  const formattedTotal = `₹${Number(total).toLocaleString("en-IN")}`;

  return <section className="overflow-hidden rounded-[16px] border bg-[var(--surface-base)]" style={{ borderColor: "var(--border-subtle)" }}>
    <div className="flex min-w-0 items-center gap-3 px-3.5 py-3.5 sm:px-4 sm:py-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border bg-[var(--surface-elevated)] text-[var(--text-secondary)]" style={{ borderColor: "var(--border-subtle)" }}><Icon size={15} /></div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-bold tracking-[0.08em] text-[var(--text-primary)]">{label}</p>
        <p className="mt-0.5 truncate text-[7px] text-[var(--text-muted)]">{description}</p>
      </div>
      <div className="flex shrink-0 items-baseline gap-1">
        <IndianRupee size={12} className="text-[var(--text-muted)]" />
        <span className="text-[22px] font-extrabold leading-none tracking-[-0.05em] text-[var(--text-primary)] sm:text-[24px]">{formattedContribution.replace("₹", "")}</span>
        <span className="text-[9px] font-medium text-[var(--text-muted)]">/ {formattedTotal.replace("₹", "")}</span>
      </div>
    </div>
  </section>;
};

export default TournamentRegistrationBannerCard;
