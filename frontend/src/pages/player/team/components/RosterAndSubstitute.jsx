export default function TeamRoster({ roster = [], substitutes = [] }) {
    return (
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)]">
            <RosterList title="Active Roster" players={roster} />
            <RosterList title="Substitutes" players={substitutes} muted />
        </section>
    );
}

function RosterList({ title, players, muted }) {
    return (
        <div className="rounded-[16px] border border-[var(--border-default)] bg-[var(--surface-elevated)] p-4 sm:p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--accent-gold)]">
                        {title}
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                        {players.length} Players
                    </p>
                </div>

                <button className="text-[9px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                    Manage
                </button>
            </div>

            <div className="mt-4 divide-y divide-[var(--border-default)]">
                {players.map((player) => (
                    <div
                        key={player.id}
                        className="flex items-center gap-3 py-2.5"
                    >
                        <img
                            src={player.avatar}
                            alt=""
                            className="size-8 rounded-full object-cover"
                        />

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <p className="truncate text-[11px] font-semibold">
                                    {player.name}
                                </p>

                                {player.captain && (
                                    <span className="text-[7px] font-bold text-[var(--accent-gold)]">
                                        CAPTAIN
                                    </span>
                                )}
                            </div>

                            <p className="truncate text-[8px] text-[var(--text-muted)]">
                                {player.ign} · {player.role}
                            </p>
                        </div>

                        <span
                            className={`hidden text-[8px] font-semibold sm:block ${
                                muted
                                    ? "text-[var(--text-muted)]"
                                    : "text-emerald-600"
                            }`}
                        >
                            {player.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}