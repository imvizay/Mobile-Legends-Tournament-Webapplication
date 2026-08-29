import { BellRing, Eye, ShieldCheck, UserRoundPlus, UserRoundX } from "lucide-react";

function PlayerActionMenu({
    member,
    isRoster,
    onViewProfile,
    onMakeRoster,
    onRemoveRoster,
    onMakeSubstitute,
    onRemindPayment
}) {
    return (
        <div className="absolute right-0 top-8 z-30 w-44 overflow-hidden rounded-xl border bg-[var(--surface-base)] p-1.5" style={{ borderColor: "var(--border-default)", boxShadow: "var(--shadow-md)" }}>
            <ActionButton icon={<Eye size={13} />} label="View Profile" onClick={() => onViewProfile?.(member)} />

            <ActionButton
                icon={isRoster ? <UserRoundX size={13} /> : <ShieldCheck size={13} />}
                label={isRoster ? "Remove from Roster" : "Make Roster"}
                onClick={() => isRoster ? onRemoveRoster?.(member) : onMakeRoster?.(member)}
            />

            <ActionButton
                icon={<UserRoundPlus
                    size={13} />}
                label="Make Substitute"
                onClick={() => onMakeSubstitute?.(member)}
            />

            <div className="my-1 border-t border-[var(--border-subtle)]" />

            <ActionButton
                icon={<BellRing size={13} />}
                label="Remind to Pay Fees"
                onClick={() => onRemindPayment?.(member)}
            />
        </div>
    );
}

function ActionButton({ icon, label, onClick }) {
    return (
        <button type="button" onClick={onClick} className="flex h-8 w-full items-center gap-2 rounded-lg px-2 text-left text-[8px] font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]">
            <span className="text-[var(--text-muted)]">{icon}</span>
            <span>{label}</span>
        </button>
    );
}


export default PlayerActionMenu