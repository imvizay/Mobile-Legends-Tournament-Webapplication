import React, { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

import FeaturedTournamentCard from "../../features/player-dashboard/components/FeaturedTournamentCard"
import UpcomingTournamentGrid from "../../features/player-dashboard/components/UpcomingTournamentGrid"
import Leaderboard from "../../features/player-dashboard/components/Leaderboard"
import CompetitionBanner from "../../features/player-dashboard/components/CompetitionBanner"
import TournamentRegistrationDrawer from "../../features/player-dashboard/components/registration/RegistrationDrawer"

import { playerService } from "../../services/player/playerService"

// Skeletons
import FeaturedTournamentCardSkeleton from "../../features/player-dashboard/components/skeletons/FeaturedTournamentSkeleton"
import UpcomingTournamentGridSkeleton from "../../features/player-dashboard/components/skeletons/UpcomingTournamentSkeleton"
import LeaderboardSkeleton from "../../features/player-dashboard/components/skeletons/LeaderboardSkeleton"

// States
import DashboardSectionError from "../../features/player-dashboard/components/error/DashboardError"
import DashboardSectionEmpty from "../../features/player-dashboard/components/empty/DashboardEmptySection"

import { useUserContext } from "../../contexts/UserContext"
import { useMutation } from "@tanstack/react-query"
import { teamService, teamTournamentService } from "../../services/teamService"
import TournamentBracket from "../../features/player-dashboard/components/TournamentBracketSection"

function PlayerDashboardPage() {
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
                <TournamentBracket tournament={featuredTournaments}/>
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

export default PlayerDashboardPage