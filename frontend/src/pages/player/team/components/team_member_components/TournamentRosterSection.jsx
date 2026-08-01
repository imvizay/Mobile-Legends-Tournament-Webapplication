function RosterSection({ members }) {
    return (
        <div className="p-3 sm:p-4 lg:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={13} className="text-[var(--accent-gold)]" />

                        <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                            Tournament Roster
                        </span>
                    </div>

                    <p className="mt-1 text-[10px] font-medium text-[var(--text-secondary)]">
                        {members.length === 0 ? "Tournament roster selection has not started." : `${members.length} of 5 players selected for competition.`}
                    </p>
                </div>

                <span className={`flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.1em] ${members.length > 0 ? "text-emerald-500" : "text-[var(--text-muted)]"}`}>
                    <span className={`size-1.5 rounded-full ${members.length > 0 ? "bg-emerald-500" : "bg-[var(--text-muted)]"}`} />
                    {members.length > 0 ? "Roster Active" : "Roster Pending"}
                </span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => {
                    const player = members[index];

                    return (
                        <div key={index} className={`relative min-h-[72px] overflow-hidden rounded-xl border p-3 ${player ? "bg-emerald-500/[0.035]" : "border-dashed bg-[var(--surface-base)]"}`} style={{ borderColor: player ? "color-mix(in srgb, #10b981 28%, var(--border-default))" : "var(--border-subtle)" }}>
                            <span className={`text-[7px] font-bold tracking-[0.12em] ${player ? "text-emerald-500" : "text-[var(--text-muted)]"}`}>
                                SLOT {String(index + 1).padStart(2, "0")}
                            </span>

                            {player ? (
                                <div className="mt-2 flex min-w-0 items-center gap-2">
                                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 text-[8px] font-bold text-emerald-500">
                                        {getDisplayName(player).charAt(0)}
                                    </div>

                                    <span className="truncate text-[9px] font-bold text-[var(--text-primary)]">
                                        {getDisplayName(player)}
                                    </span>
                                </div>
                            ) : (
                                <p className="mt-2 text-[8px] text-[var(--text-muted)]">
                                    Available
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}