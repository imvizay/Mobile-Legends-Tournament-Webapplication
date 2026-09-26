import React from "react";
import { Medal, Trophy } from "lucide-react";

function Leaderboard({ tournament = {
    name: "MLBB Strongest "
}, players = [], currentPlayerId }) {

    if (!tournament) {
        return (
            <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-base)]">
                <div className="text-center">
                    <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-[var(--surface-elevated)]">
                        <Trophy className="size-5 text-[var(--text-muted)]" strokeWidth={1.6} />
                    </div>

                    <p className="text-[13px] font-medium text-[var(--text-primary)]">
                        No leaderboard available
                    </p>

                    <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                        Tournament rankings will appear here.
                    </p>
                </div>
            </div>
        );
    }

    const rankedPlayers = [...players]
        .sort((a, b) => a.rank - b.rank);

    const currentPlayer = rankedPlayers.find(
        (player) => player.id === currentPlayerId
    );

    const visiblePlayers = rankedPlayers

    return (

        <div className="flex h-[500px] min-h-0 flex-col overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--surface-base)]">

            {/* Header */}
            <div className="border-b border-[var(--border-default)] px-5 py-4">

                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-gold)]">
                            {tournament.season || "Tournament"}
                        </p>

                        <h3 className="mt-1 text-[16px] font-semibold tracking-[-0.015em] text-[var(--text-primary)]">
                            Leaderboard
                        </h3>
                    </div>

                    <div className="flex size-8 items-center justify-center rounded-md bg-[var(--surface-elevated)]">
                        <Medal className="size-4 text-[var(--accent-gold)]" strokeWidth={1.7} />
                    </div>
                </div>

                <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                    Top players from {tournament.name}
                </p>

            </div>

            {/* Column Labels */}
            <div className="grid grid-cols-[34px_minmax(0,1fr)_52px] items-center gap-3 border-b border-[var(--border-default)] px-5 py-2.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                <span>Rank</span>
                <span>Player</span>
                <span className="text-right">Score</span>
            </div>

            {/* Players */}
            <div className="sidebar-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-2">

                {visiblePlayers.length > 0 ? (
                    <div className="space-y-0.5">
                        {visiblePlayers.map((player) => (
                            <LeaderboardRow
                                key={player.id}
                                player={player}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-[180px] items-center justify-center text-center">
                        <div>
                            <p className="text-[12px] font-medium text-[var(--text-primary)]">
                                No rankings yet
                            </p>

                            <p className="mt-1 text-[10px] text-[var(--text-muted)]">
                                Player rankings will appear after matches are recorded.
                            </p>
                        </div>
                    </div>
                )}

            </div>

            {/* Current Player */}
            <div className="border-t border-[var(--border-default)] p-3">

                {currentPlayer ? (
                    <LeaderboardRow
                        player={currentPlayer}
                        isCurrentPlayer
                    />
                ) : (
                    <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] bg-[var(--surface-elevated)] px-3 py-2.5">
                        <div>
                            <p className="text-[10px] font-medium text-[var(--text-primary)]">
                                You're not ranked
                            </p>

                            <p className="mt-0.5 text-[9px] text-[var(--text-muted)]">
                                Participate in this tournament to appear here.
                            </p>
                        </div>

                        <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                            —
                        </span>
                    </div>
                )}

            </div>

        </div>
    );
}

function LeaderboardRow({ player, isCurrentPlayer = false }) {
    const isFirst = player.rank === 1;
    const isSecond = player.rank === 2;
    const isThird = player.rank === 3;

    return (
        <div className={`group grid grid-cols-[34px_minmax(0,1fr)_52px] items-center gap-3 rounded-md px-2 py-2.5 transition-colors duration-150 ${isCurrentPlayer ? "border border-[var(--accent-gold)]/35 bg-[var(--accent-gold)]/8" : "hover:bg-[var(--surface-elevated)]"}`}>

            {/* Rank */}
            <div className="flex items-center">
                <span className={`text-[11px] font-semibold ${isCurrentPlayer || isFirst ? "text-[var(--accent-gold)]" : isSecond || isThird ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]"}`}>
                    {String(player.rank).padStart(2, "0")}
                </span>
            </div>

            {/* Player */}
            <div className="flex min-w-0 items-center gap-2.5">

                <div className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--surface-elevated)]">
                    {player.avatar ? (
                        <img
                            src={player.avatar}
                            alt=""
                            className="size-full object-cover"
                        />
                    ) : (
                        <span className="text-[9px] font-semibold text-[var(--text-muted)]">
                            {player.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                    )}
                </div>

                <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-1.5">
                        <p className={`truncate text-[11px] font-medium ${isCurrentPlayer ? "text-[var(--accent-gold)]" : "text-[var(--text-primary)]"}`}>
                            {player.name}
                        </p>

                        {isCurrentPlayer && (
                            <span className="shrink-0 rounded-sm bg-[var(--accent-gold)] px-1 py-0.5 text-[7px] font-bold uppercase tracking-[0.06em] text-[var(--text-primary)]">
                                You
                            </span>
                        )}
                    </div>

                    <p className="mt-0.5 truncate text-[8px] text-[var(--text-muted)]">
                        ID {player.mlbbId} · Server {player.server}
                    </p>
                </div>

            </div>

            {/* Score */}
            <div className="text-right">
                <p className={`text-[11px] font-semibold ${isCurrentPlayer ? "text-[var(--accent-gold)]" : "text-[var(--text-primary)]"}`}>
                    {player.score ?? "-"}
                </p>

                <p className="mt-0.5 text-[7px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
                    Points
                </p>
            </div>

        </div>
    );
}

export default Leaderboard;