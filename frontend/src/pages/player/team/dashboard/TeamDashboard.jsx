import React, { useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import { teamService, teamTournamentService } from "../../../../services/team_service"

import RegisteredTournament from "../components/TeamRegisteredTournament"
import EmptyRegisteredTournament from "../empty_states/EmptyRegisteredTournament"
import TeamContribution from "../components/TeamContribution"
import EmptyTeamContribution from "../empty_states/EmptyTeamContribution"
import TournamentRoadmap from "../components/TournamentRoadmap"
import TeamMembers from "../components/TeamMembers"
import TeamMatches from "../components/TournamentMatches"
import MatchProofUploads from "../components/MatchProofUploads"

import TeamPageSkeleton from "../../../../skeletons/playerdash/my_team/TeamPageSkeleton"

import { useMutation } from "@tanstack/react-query"
import { useUserContext } from "../../../../contexts/UserContext"

export default function TeamDashboard() {
    const { team } = useOutletContext()
    const { user } = useUserContext()

    const teamId = team?.id


    const addRosterMutation = useMutation({
        mutationKey: ['tournament-addRoster', team?.id],
        mutationFn: ({ tournamentId, playerId }) =>
            teamTournamentService.addPlayerToRoster(
                tournamentId, playerId
            )
    })

    const removeRosterMutation = useMutation({
        mutationKey: ['tournament-removeRoster', team?.id],
        mutationFn: ({ tournamentId, playerId }) =>
            teamTournamentService.removePlayerFromRoster(
                tournamentId, playerId
            )
    })

    const {
        data: dashboard,
        isPending,
        isError,
        error,
        isSuccess,
        refetch,
    } = useQuery({
        queryKey: ["teamdashboard", teamId],
        queryFn: () => teamService.getTeamDashboard(teamId),
        enabled: !!teamId,
        staleTime: 1000 * 60 * 5,
    })

    if (isPending) {
        return <TeamPageSkeleton />
    }

    if (isError) {
        console.error("TEAM DASHBOARD ERROR:", error)

        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <p className="text-[var(--text-primary)]">Failed to load team dashboard.</p>
                    <button onClick={() => refetch()} className="mt-3">
                        Try again
                    </button>
                </div>
            </div>
        )
    }

    if (!dashboard?.data) {
        return null
    }


    const currentTournament = dashboard?.data?.current_tournament ?? null
    const feeContribution = dashboard?.data?.fee_contribution ?? null
    const teamMembers = dashboard?.data?.team_members ?? []
    const scheduledMatches = dashboard?.data?.scheduled_matches ?? []
    const isLoggedUserCaptain = teamMembers?.some((el) => (el.id == user?.id && el.role.toLowerCase() == "captain"))

    const hasRegisteredTournament = !!currentTournament

    const hasContribution = !!feeContribution

    const hasScheduledMatch = scheduledMatches.length > 0

    const tournamentId = currentTournament?.tournament_id




    const addRoster = async (member) => {

        const playerId = member?.id

        if (isNaN(playerId) || !tournamentId) return;

        try {
            const res = await addRosterMutation.mutateAsync({ tournamentId, playerId })
        } catch (error) {
            console.log(`Adding Player ID:${playerId} To Roster Failed Due To : ${error} `)
            alert("Try Again! Adding Player To Roster Gets Failed.")
        }
    }

    const removeRoster = async (member) => {
        const playerId = Number(member?.id)
        if (isNaN(playerId)) return
        try {
            const res = await removeRosterMutation.mutateAsync({ tournamentId, playerId })
            console.log("Removed Roster")
        }
        catch (error) {
            console.log(`Removing Player ID:${playerId} From Roster Failed,Try Again!.`)
            alert(`Failed Removing Player Id ${playerId} From Roster , Try Again!.`)
        }
    }

    return (
        <section className="w-full space-y-8 pb-8">

            {/* =========================================================
                REGISTERED TOURNAMENT / EMPTY TOURNAMENT
            ========================================================== */}

            <section className={`grid min-w-0 gap-5 ${hasRegisteredTournament ? "lg:grid-cols-[minmax(0,1.7fr)_300px] xl:grid-cols-[minmax(0,1.7fr)_320px]" : "grid-cols-1"}`}>
                <div className="min-w-0">
                    {hasRegisteredTournament ? (
                        <RegisteredTournament tournament={currentTournament} />
                    ) : (
                        <EmptyRegisteredTournament />
                    )}
                </div>

                {hasRegisteredTournament && (
                    <div className="min-w-0">
                        {hasContribution ? (
                            <TeamContribution data={feeContribution} />
                        ) : (
                            <EmptyTeamContribution />
                        )}
                    </div>
                )}
            </section>


            {/* =========================================================
                TOURNAMENT JOURNEY
                Only exists when there is a registered tournament.
            ========================================================== */}

            {hasRegisteredTournament && (
                <TournamentRoadmap tournament={currentTournament} />
            )}


            {/* =========================================================
                TEAM ROSTER
                Always visible.
                Backend should return all 7 members including bench.
            ========================================================== */}

            <section className="min-w-0">

                <TeamMembers
                    members={teamMembers}
                    isCaptain={isLoggedUserCaptain}
                    isRosterLocked={false}
                    onMakeRoster={addRoster}
                    onRemoveRoster={removeRoster}
                />
                {/* <TeamMembers  /> */}

            </section>


            {/* =========================================================
                MATCH CENTER
                Don't show until at least one match is scheduled.
            ========================================================== */}

            {hasScheduledMatch && (
                <section className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,1fr)]">
                    <TeamMatches matches={scheduledMatches} />

                    <MatchProofUploads matches={scheduledMatches} />
                </section>
            )}

        </section>
    )
}