import { Plus, UserPlus } from "lucide-react";

export function SectionHeader({ title, description, count }) {
    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-primary)]">
                    {title}
                </h3>

                <p className="mt-1 text-[8px] text-[var(--text-muted)]">
                    {description}
                </p>
            </div>

            <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                {count}
            </span>
        </div>
    );
}

export function HeaderStat({ label, value }) {
    return (
        <div className="text-right">
            <p className="text-[6px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                {label}
            </p>

            <p className="mt-1 text-[11px] font-bold text-[var(--text-primary)]">
                {value}
            </p>
        </div>
    );
}

export function PlayerMeta({ label, value, align = "left" }) {
    return (
        <div className={`min-w-0 ${align === "right" ? "text-right" : ""}`}>
            <p className="text-[6px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                {label}
            </p>

            <p className="mt-1 truncate text-[9px] font-semibold text-[var(--text-secondary)]">
                {value}
            </p>
        </div>
    );
}

export function StatusBadge({ icon, text, active = false }) {
    return (
        <span className={`flex items-center gap-1 text-[7px] font-bold uppercase tracking-[0.08em] ${active ? "text-emerald-500" : "text-[var(--text-muted)]"}`}>
            {icon}
            {text}
        </span>
    );
}

export function EmptyMemberCard({ number, isCaptain, onInvite }) {
    return (
        <div className="flex min-h-[150px] flex-col items-center justify-center rounded-xl border border-dashed px-4 text-center" style={{ background: "color-mix(in srgb, var(--surface-base) 70%, transparent)", borderColor: "var(--border-subtle)" }}>
            <span className="flex size-8 items-center justify-center rounded-full border border-[var(--border-subtle)]">
                <Plus size={14} className="text-[var(--text-muted)]" />
            </span>

            <span className="mt-2 text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Player Slot {String(number).padStart(2, "0")}
            </span>

            {isCaptain && (
                <button type="button" onClick={onInvite} className="mt-2 flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-[0.1em] text-[var(--accent-gold)]">
                    <UserPlus size={11} />
                    Invite Player
                </button>
            )}
        </div>
    );
}

export function getDisplayName(member) {
    if (!member) return "Player";
    if (member.username) return member.username;
    if (member.email) return member.email.split("@")[0];
    return "Player";
}


