import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

import FeaturedTournamentCard from "./components/FeaturedTournamentCard"
import UpcomingTournamentGrid from "./components/UpcomingTournamentGrid"
import Leaderboard from "./components/Leaderboard"
import CompetitionBanner from "./components/CompetetionBanner"
import TournamentRegistrationDrawer from "./components/registration/RegistrationDrawer"

import { playerService } from "../../../services/player/player-service"

// Skeletons
import FeaturedTournamentCardSkeleton from "./components/skeletons/FeatureTournamentSkeleton"
import UpcomingTournamentGridSkeleton from "./components/skeletons/UpcomingTournamentSkeleton"
import LeaderboardSkeleton from "./components/skeletons/LeaderboardSkeleton"

// States
import DashboardSectionError from "./components/error/DashboardError"
import DashboardSectionEmpty from "./components/empty/DashboardEmptySection"

import { useUserContext } from "../../../contexts/UserContext"
import { useMutation } from "@tanstack/react-query"
import { teamService, teamTournamentService } from "../../../services/team_service"

function PlayerDashboard() {
    const [registrationDrawer, setRegistrationDrawer] = useState({
        open: false,
        type: null,
        tournament: null
    })

    const navigate = useNavigate()


    const { user } = useUserContext()
    const userId = user?.id

    const {
        data: teamSummary,
        isLoading: isTeamLoading,
        isError: isTeamError
    } = useQuery({
        queryKey: ["team-summary", userId],
        queryFn: teamService.getMyTeamSummary,
        staleTime: 5 * 60 * 1000,
        enabled: !!userId
    })

    const {
        data: playerDashboard,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["player-dashboard"],
        queryFn: playerService.getDashboard,
    })

    const tournamentRegisterMutation = useMutation({
        mutationKey: ['tournament-registration'],
        mutationFn: teamTournamentService.teamTournamentRegistration
    })

    const featuredTournaments =
        playerDashboard?.data?.featured_tournaments ?? []

    const upcomingTournaments =
        playerDashboard?.data?.upcoming_tournaments ?? []

    const onRegisterTournament = (tournament) => {
        if (isTeamLoading || isTeamError) return
        if (!teamSummary?.has_team) return setRegistrationDrawer({
            open: true,
            type: "NO_TEAM",
            tournament: featuredTournaments
        })
        const isCaptain = teamSummary.team.captain.id === userId
        setRegistrationDrawer({ open: true, type: isCaptain ? "TEAM_CAPTAIN" : "TEAM_MEMBER", tournament: featuredTournaments })
    }

    const handleTeamRegister = async (tournament_id) => {
        console.log(">>>>>>>>")
        console.log("Registation function running...")
        try {
            if (tournamentRegisterMutation.isPending) return
            const res = await tournamentRegisterMutation.mutateAsync(tournament_id)
            console.log(res)
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <main className="w-full min-w-0 space-y-7">

            {/* Featured Tournament */}
            <section>
                {isLoading ? (
                    <FeaturedTournamentCardSkeleton />
                ) : isError ? (
                    <DashboardSectionError onRetry={refetch} />
                ) : !featuredTournaments.length ? (
                    <DashboardSectionEmpty
                        title="No featured tournament yet"
                        description="Featured tournaments will appear here once the next competition is announced."
                    />
                ) : (
                    <FeaturedTournamentCard
                        tournament={featuredTournaments[0]}
                        onRegister={onRegisterTournament}
                    />
                )}
            </section>

            {/* Upcoming Tournaments */}
            <section className="w-full min-w-0">
                {isLoading ? (
                    <UpcomingTournamentGridSkeleton />
                ) : isError ? (
                    <DashboardSectionError onRetry={refetch} />
                ) : !upcomingTournaments.length ? (
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
                <DashboardSectionEmpty
                    title="Brackets coming soon"
                    description="Tournament brackets will appear here once you participate in an active competition."
                />
            </section>

            {/* Tournament Legacy */}
            <section className="px-1 py-2">

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

                            <DashboardSectionEmpty
                                title="No champions yet"
                                description="Tournament champions will appear here after the first competitions are completed."
                            />

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

                            <DashboardSectionEmpty
                                title="Leaderboard is waiting"
                                description="Player rankings will appear here once the competition begins."
                            />

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

            {/* Tournament Drawer */}
            {registrationDrawer.open && (
                <TournamentRegistrationDrawer
                    type={registrationDrawer.type}
                    team={teamSummary?.team}
                    tournament={registrationDrawer?.tournament}
                    onClose={() => setRegistrationDrawer({ open: false, type: null, tournament: null })}
                    onExploreTeams={() => navigate("/player/team/discover")}
                    onCreateTeam={() => navigate("/player/team/create")}
                    onViewTeam={() => navigate("/player/team")}
                    onRegister={handleTeamRegister}
                />
            )}

        </main>
    )
}

export default PlayerDashboard