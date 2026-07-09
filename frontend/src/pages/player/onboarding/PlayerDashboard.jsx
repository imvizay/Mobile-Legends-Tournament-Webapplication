import React from "react"
import FeaturedTournamentCard from "./components/FeaturedTournamentCard"
import UpcomingTournamentGrid from "./components/UpcomingTournamentGrid"
import TournamentBracket from "./components/TournamentBracket"
import RecentWinnerHistory from "./components/RecentWinnerHistory"
import Leaderboard from "./components/Leaderboard"
import CompetitionBanner from "./components/CompetetionBanner"

import { useQuery } from "@tanstack/react-query"
import { playerService } from "../../../services/player/player-service"

// Skeletons
import TournamentBracketSkeleton from "./components/skeletons/TournamentBracketSkeleton"
import RecentWinnerSkeleton from "./components/skeletons/RecentWinnerSkeleton"
import LeaderboardSkeleton from "./components/skeletons/LeaderboardSkeleton"
import FeaturedTournamentCardSkeleton from "./components/skeletons/FeatureTournamentSkeleton"
import UpcomingTournamentGridSkeleton from "./components/skeletons/UpcomingTournamentSkeleton"

// States
import DashboardSectionError from "./components/error/DashboardError"
import DashboardSectionEmpty from "./components/empty/DashboardEmptySection"

function PlayerDashboard() {
    const {
        data: featuredTournaments,
        isLoading: isFeaturedLoading,
        isError: isFeaturedError,
        refetch: refetchFeatured,
    } = useQuery({
        queryKey: ["player-dashboard", "featured-tournaments"],
        queryFn: playerService.getFeaturedTournaments,
    })

    const {
        data: upcomingTournaments,
        isLoading: isUpcomingLoading,
        isError: isUpcomingError,
        refetch: refetchUpcoming,
    } = useQuery({
        queryKey: ["player-dashboard", "upcoming-tournaments"],
        queryFn: playerService.getUpcomingTournaments,
    })

    const {
        data: tournamentBracket,
        isLoading: isBracketLoading,
        isError: isBracketError,
        refetch: refetchBracket,
    } = useQuery({
        queryKey: ["player-dashboard", "tournament-bracket"],
        queryFn: playerService.getRecentTournamentBracket,
    })

    const {
        data: recentWinners,
        isLoading: isWinnersLoading,
        isError: isWinnersError,
        refetch: refetchWinners,
    } = useQuery({
        queryKey: ["player-dashboard", "recent-winners"],
        queryFn: playerService.getRecentWinners,
    })

    const {
        data: leaderboard,
        isLoading: isLeaderboardLoading,
        isError: isLeaderboardError,
        refetch: refetchLeaderboard,
    } = useQuery({
        queryKey: ["player-dashboard", "leaderboard"],
        queryFn: playerService.getLeaderboard,
    })

    return (
        <main className="w-full min-w-0 space-y-7">

            {/* Featured Tournament */}
            <section>
                {isFeaturedLoading ? (
                    <FeaturedTournamentCardSkeleton />
                ) : isFeaturedError ? (
                    <DashboardSectionError onRetry={refetchFeatured} />
                ) : !featuredTournaments ? (
                    <DashboardSectionEmpty
                        title="No featured tournament yet"
                        description="Featured tournaments will appear here once the next competition is announced."
                    />
                ) : (
                    <FeaturedTournamentCard
                        tournament={featuredTournaments}
                    />
                )}
            </section>

            {/* Upcoming Tournaments */}
            <section className="w-full min-w-0">
                {isUpcomingLoading ? (
                    <UpcomingTournamentGridSkeleton />
                ) : isUpcomingError ? (
                    <DashboardSectionError onRetry={refetchUpcoming} />
                ) : !upcomingTournaments?.length ? (
                    <DashboardSectionEmpty
                        title="No upcoming tournaments"
                        description="There are no upcoming tournaments available right now. Check back soon."
                    />
                ) : (
                    <UpcomingTournamentGrid
                        tournaments={upcomingTournaments}
                    />
                )}
            </section>

            {/* Tournament Bracket */}
            <section>
                {isBracketLoading ? (
                    <TournamentBracketSkeleton />
                ) : isBracketError ? (
                    <DashboardSectionError onRetry={refetchBracket} />
                ) : !tournamentBracket ? (
                    <DashboardSectionEmpty
                        title="No active tournament bracket"
                        description="A tournament bracket will appear here once you are participating in an active tournament."
                    />
                ) : (
                    <TournamentBracket
                        tournament={tournamentBracket}
                    />
                )}
            </section>

            {/* Tournament Legacy */}
            <section className="px-1 py-2">

                {/* Section Header */}
                <div className="mb-5 flex items-end justify-between sm:mb-6">
                    <div className="min-w-0">

                        <div className="mb-2 flex items-center gap-2">
                            <span className="h-px w-5 shrink-0 bg-[var(--accent-gold)]" />

                            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-gold)]">
                                Tournament Legacy
                            </p>
                        </div>

                        <h2 className="max-w-2xl text-[18px] font-semibold leading-snug tracking-[-0.02em] text-[var(--text-primary)] sm:text-[20px] md:text-[21px]">
                            Remember the battles. Celebrate the champions.
                        </h2>

                        <p className="mt-1.5 max-w-xl text-[11px] leading-relaxed text-[var(--text-muted)] sm:text-xs">
                            A look back at recent champions and the players leading the competition.
                        </p>

                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.35fr_1fr]">

                    {/* Recent Winners */}
                    <div className="min-w-0">

                        <div className="mb-3 flex items-center justify-between px-1">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                                Recent Champions
                            </p>

                            <span className="text-[10px] text-[var(--text-muted)]">
                                Latest results
                            </span>
                        </div>

                        <div className="min-w-0 overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--surface-base)] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

                            {isWinnersLoading ? (
                                <RecentWinnerSkeleton />
                            ) : isWinnersError ? (
                                <DashboardSectionError
                                    onRetry={refetchWinners}
                                />
                            ) : !recentWinners?.length ? (
                                <DashboardSectionEmpty
                                    title="No champions yet"
                                    description="Tournament champions will appear here after the first competitions are completed."
                                />
                            ) : (
                                <RecentWinnerHistory
                                    tournaments={recentWinners}
                                />
                            )}

                        </div>

                    </div>

                    {/* Leaderboard */}
                    <div className="min-w-0">

                        <div className="mb-3 flex items-center justify-between px-1">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                                Leaderboard
                            </p>

                            <span className="text-[10px] text-[var(--text-muted)]">
                                Current season
                            </span>
                        </div>

                        <div className="min-w-0 overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--surface-base)] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

                            {isLeaderboardLoading ? (
                                <LeaderboardSkeleton />
                            ) : isLeaderboardError ? (
                                <DashboardSectionError
                                    onRetry={refetchLeaderboard}
                                />
                            ) : !leaderboard?.length ? (
                                <DashboardSectionEmpty
                                    title="Leaderboard is waiting"
                                    description="Player rankings will appear here once the competition begins."
                                />
                            ) : (
                                <Leaderboard
                                    players={leaderboard}
                                />
                            )}

                        </div>

                    </div>

                </div>

            </section>

            {/* Competition Banner */}
            <section>
                <CompetitionBanner
                    userTeam={null}
                    onCreateTeam={() => navigate("/teams/create")}
                    onJoinTeam={() => navigate("/teams/discover")}
                />
            </section>

        </main>
    )
}

export default PlayerDashboard