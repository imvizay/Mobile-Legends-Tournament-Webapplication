import React from "react";
import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { teamService } from "../../../../services/team_service";

import RegisteredTournament from "../components/TeamRegisteredTournament";
import EmptyRegisteredTournament from "../empty_states/EmptyRegisteredTournament";
import TeamContribution from "../components/TeamContribution";
import EmptyTeamContribution from "../empty_states/EmptyTeamContribution";
import TournamentRoadmap from "../components/TournamentRoadmap";
import TeamMembers from "../components/TeamMembers";
import TeamMatches from "../components/TournamentMatches";
import MatchProofUploads from "../components/MatchProofUploads";

import TeamPageSkeleton from "../../../../skeletons/playerdash/my_team/TeamPageSkeleton";

export default function TeamDashboard() {
    const { team } = useOutletContext();

    const teamId = team?.id;
    console.group("TEAM DASHBOARD")
    console.log("[1]-TeamID",teamId)
    const {
        data:dashboard,
        isPending,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["teamdashboard", teamId],
        queryFn: () => teamService.getTeamDashboard(teamId),
        enabled: !!teamId,
        staleTime: 1000 * 60 * 5,
    });

    if (isPending) {
        return <TeamPageSkeleton />;
    }

    if (isError) {
        console.error("TEAM DASHBOARD ERROR:", error);

        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <p className="text-[var(--text-primary)]">Failed to load team dashboard.</p>
                    <button onClick={() => refetch()} className="mt-3">
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    if (!dashboard?.data) {
        return null;
    }

    console.log("[2]- DATA",dashboard?.data)
    
    const currentTournament = dashboard?.data?.current_tournament ?? null;
    const feeContribution = dashboard?.data?.fee_contribution ?? null;
    const teamMembers = dashboard?.data?.team_members ?? [];
    const scheduledMatches = dashboard?.data?.scheduled_matches ?? [];

    const hasRegisteredTournament = !!currentTournament;

    const hasContribution = !!feeContribution;

    const hasScheduledMatch = scheduledMatches.length > 0;

    console.group('[3]- Registered Tournament',currentTournament)

    console.groupEnd()

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
                <TeamMembers members={teamMembers} />
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
    );
}