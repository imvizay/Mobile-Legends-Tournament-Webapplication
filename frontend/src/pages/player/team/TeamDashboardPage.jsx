import React, { useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"

// contexts
import { useUserContext } from "../../../contexts/UserContext"
// service
import { teamService, teamTournamentService } from "../../../services/teamService"

// componenets
import RegisteredTournament from "../../../features/team/components/TeamRegisteredTournament"
import EmptyRegisteredTournament from "../../../features/team/components/empty/EmptyRegisteredTournament"
import TeamContribution from "../../../features/team/components/TeamContribution"
import EmptyTeamContribution from "../../../features/team/components/empty/EmptyTeamContribution"
import TeamMembers from "../../../features/team/components/TeamMembers"
import TeamMatches from "../../../features/team/components/TournamentMatches"
import MatchProofUploads from "../../../features/team/components/MatchProofUploads"

// skeletons
import TeamPageSkeleton from "../../../features/team/components/skeletons/TeamPageSkeleton"
import { getRegistrationRoadmap } from "../../../features/tournaments/config/roadmap"
import TeamTournamentRoadmap from "../../../features/team/components/TournamentRoadmap"



export default function TeamDashboardPage() {
    const { team } = useOutletContext()
    const { user } = useUserContext()
    const queryClient = useQueryClient()

    const teamId = team?.id

    const addRosterMutation = useMutation({
        mutationKey: ['tournament-addRoster', team?.id],
        mutationFn: ({ tournamentId, playerId }) =>
            teamTournamentService.addPlayerToRoster(
                tournamentId, playerId
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["teamdashboard", teamId],
            })
        },
    })

    const removeRosterMutation = useMutation({
        mutationKey: ['tournament-removeRoster', team?.id],
        mutationFn: ({ tournamentId, playerId }) =>
            teamTournamentService.removePlayerFromRoster(
                tournamentId, playerId
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["teamdashboard", teamId],
            })
        },
    })

    const confirmRosterMutation = useMutation({
        mutationKey: ['confirm-roster', teamId],
        mutationFn: (registrationId) => teamTournamentService.lockRoster(registrationId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["teamdashboard", teamId],
            })
        },
    })

    // REGISTERED TOURNAMENT & TEAM MEMBERS
    const {
        data: dashboard,
        isPending,
        isError,
        error,
        isSuccess,
        refetch,
    } = useQuery({
        queryKey: ["teamdashboard", teamId],
        queryFn: () => teamService.getTeamDashboardPage(teamId),
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

    // selected/confirmed roster player
    const roster = dashboard?.data?.current_tournament?.roster ?? null

    // actual members in a team.
    const teamMembers = dashboard?.data?.team_members ?? []

    const scheduledMatches = dashboard?.data?.scheduled_matches ?? []

    const isLoggedUserCaptain = teamMembers?.some((el) => (el.id == user?.id && el.role.toLowerCase() == "captain"))

    const hasRegisteredTournament = !!currentTournament

    const hasContribution = !!feeContribution

    const hasScheduledMatch = scheduledMatches.length > 0

    const tournamentId = currentTournament?.tournament_id
    const isRosterLocked = currentTournament?.roster?.is_roster_locked
    const isCurrentUserInRoster = roster?.roster_players?.some(el => el.id == user.id)

    const isPlayerPaid = roster?.roster_players?.find(u => u.id == user.id)?.fee_status === "paid"
    const teamCaptain = teamMembers?.filter(member => member.role == "captain")
    
    const registrationRoadmap = getRegistrationRoadmap({
        tournament: currentTournament,
        roster,
    });
   

    const addRoster = async (member) => {

        const playerId = member?.id

        if (isNaN(playerId) || !tournamentId) return;

        try {
            const res = await addRosterMutation.mutateAsync({ tournamentId, playerId })

        } catch (error) {
            console.error("ADD ROSTER ERROR:", error);
            alert("Try Again! Adding Player To Roster Gets Failed.")
        }
    }

    const removeRoster = async (rosterPlayerId) => {
        const playerId = Number(rosterPlayerId)


        if (isNaN(playerId) && !tournamentId) return
        try {
            await removeRosterMutation.mutateAsync({ tournamentId, playerId })
        }
        catch (error) {
            console.error("REMOVE ROSTER ERROR:", error);
            alert(`Failed Removing Player Id ${playerId} From Roster , Try Again!.`)
        }
    }

    const handleConfirmRoster = async () => {
        const registrationId = currentTournament?.tournament_id
        try {
            await confirmRosterMutation.mutateAsync(registrationId)

        } catch (error) {
            console.log("ERROR CONFIRMING ROSTER", error)
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
                        <RegisteredTournament
                            tournament={currentTournament}
                            isRosterLocked={isRosterLocked}
                            isCurrentUserInRoster={isCurrentUserInRoster}
                            isPlayerPaid={isPlayerPaid}
                        // isCheckInOpen={isCheckInOpen}
                        // isPlayerCheckIn={isPlayerCheckIn}
                        // isTournamentLive={isTournamentLive}
                        // isPlayerInRoster={isPlayerInRoster}
                        // isPlayerSubstitute={isPlayerSubstitute}
                        // roomDetails={roomDetails}
                        // onPayment={onPayment}
                        // onCheckIn={onCheckIn}
                        // onRoomDetails={onRoomDetails}
                        />
                    ) : (
                        <EmptyRegisteredTournament />
                    )}
                </div>

                {hasRegisteredTournament && (
                    <div className="min-w-0">
                        {isRosterLocked ? (
                            <TeamContribution registrationId={tournamentId} teamId={teamId} />
                        ) : (
                            <EmptyTeamContribution
                                rosterCount={roster?.roster_players?.length}
                                rosterLocked={currentTournament?.roster?.is_roster_locked}

                            />
                        )}
                    </div>
                )}
            </section>


            {/* =========================================================
                TOURNAMENT JOURNEY
                Only exists when there is a registered tournament.
            ========================================================== */}

            {hasRegisteredTournament && (
                <TeamTournamentRoadmap
                    currentStage={registrationRoadmap.currentStage}
                    rosterSelected={registrationRoadmap.roster.selected}
                    rosterRequired={registrationRoadmap.roster.required}
                    paymentsPaid={registrationRoadmap.payments.paid}
                    paymentsRequired={registrationRoadmap.payments.required}
                    registrationStatus={registrationRoadmap.registrationStatus}
                />
            )}


            {/* =========================================================
                TEAM ROSTER
                Always visible.
                Backend should return all 7 members including bench.
            ========================================================== */}

            <section className="min-w-0">

                <TeamMembers
                    members={teamMembers}
                    selectedRosters={roster?.roster_players}
                    isCaptain={isLoggedUserCaptain}
                    teamCaptain={teamCaptain}
                    isRosterLocked={isRosterLocked}
                    onConfirmRoster={handleConfirmRoster}
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