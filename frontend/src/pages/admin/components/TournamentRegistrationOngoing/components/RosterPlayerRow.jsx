import { UserRound } from "lucide-react";
import TournamentRegistrationRow from "./TournamentRegistrationRow";
import TournamentStatusChip from "./TournamentStatusChip";

const RosterPlayerRow = ({ player }) => {
  const { username, status = "PENDING", amount = 0, paidAt = "Awaiting payment" } = player;

  return <TournamentRegistrationRow icon={UserRound} title={username} subtitle={<><span className={status === "PAID" ? "font-semibold text-emerald-600" : "font-semibold text-amber-600"}>{status}</span><span className="mx-1">·</span>{paidAt} </>} status={<TournamentStatusChip status={status} size="xs" />} right={<span className="text-[9px] font-bold text-[var(--text-primary)]">₹{Number(amount).toLocaleString("en-IN")}</span>} />;
};

export default RosterPlayerRow;
