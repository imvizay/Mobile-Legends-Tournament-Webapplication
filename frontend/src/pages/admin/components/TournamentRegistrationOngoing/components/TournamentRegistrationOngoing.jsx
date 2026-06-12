import { IndianRupee, LockKeyhole, ReceiptText, ShieldCheck } from "lucide-react";
import TournamentRegistrationBannerCard from "./TournamentRegistrationBannerCard";
import TournamentRegistrationRow from "./TournamentRegistrationRow";
import RosterPlayerRow from "./RosterPlayerRow";

const DEFAULT_PLAYERS = [
  { username: "example01", status: "PAID", amount: 100, paidAt: "18 minutes ago" },
  { username: "example02", status: "PAID", amount: 100, paidAt: "9 minutes ago" },
  { username: "example03", status: "PAID", amount: 100, paidAt: "7 minutes ago" },
  { username: "example04", status: "PAID", amount: 100, paidAt: "6 minutes ago" },
  { username: "example05", status: "PENDING", amount: 100, paidAt: "Awaiting payment" },
];

const TournamentRegistrationOngoing = ({ contribution = 400, totalContribution = 500, players = DEFAULT_PLAYERS }) => {
  const paidCount = players.filter((player) => player.status === "PAID").length;
  const totalCount = players.length;

  return <aside className="w-full max-w-[360px] overflow-hidden rounded-[18px] border bg-[var(--surface-base)]" style={{ borderColor: "var(--border-default)" }}>
    <div className="flex min-h-0 max-h-[calc(100dvh-24px)] flex-col">
      <div className="shrink-0 border-b px-3.5 pb-3 pt-3.5 sm:px-4" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-[7px] font-bold uppercase tracking-[0.13em] text-[var(--text-muted)]">Registration details</span>
          <span className="text-[7px] font-medium text-[var(--text-muted)]">{paidCount}/{totalCount} paid</span>
        </div>
        <TournamentRegistrationBannerCard contribution={contribution} total={totalContribution} />
      </div>

      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto overscroll-contain">
        <div className="min-w-[290px]">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-[var(--surface-base)] px-3 py-2 sm:px-3.5" style={{ borderColor: "var(--border-subtle)" }}>
            <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">Roster payment status</p>
            <p className="text-[7px] text-[var(--text-muted)]">{totalCount} players</p>
          </div>
          {players.map((player) => <RosterPlayerRow key={player.username} player={player} />)}
        </div>
      </div>

      <TournamentRegistrationRow icon={LockKeyhole} title="Payment reservation" subtitle="Paid contributions remain reserved until the registration is completed. If the team does not qualify, eligible contributions are returned according to the refund policy." right={<ShieldCheck size={13} className="text-[var(--text-muted)]" />} className="shrink-0 border-t py-3.5" />
    </div>
  </aside>;
};

export default TournamentRegistrationOngoing;
