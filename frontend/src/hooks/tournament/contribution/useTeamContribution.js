import { useQuery } from "@tanstack/react-query";
import { teamTournamentService } from "../../../services/team_service";

export function useTeamContribution({ teamId, registrationId }) {
    return useQuery({
        queryKey: ["team-contribution", teamId, registrationId],
        queryFn: () => teamTournamentService.getTeamContribution({ teamId, registrationId }),
        enabled: Boolean(teamId && registrationId),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
    });
}