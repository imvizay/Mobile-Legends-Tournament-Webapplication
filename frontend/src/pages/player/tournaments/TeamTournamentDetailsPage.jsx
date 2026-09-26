import TournamentDetails from "../../../features/tournaments/components/TournamentDetailModal";
import { dummyTournamentDetail } from "../../../features/player-dashboard/config/tournamentMockData";
import { useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query'
import { teamTournamentService } from "../../../services/teamService";

export default function TeamTournamentDetailsPage() {

    const { id } = useParams()
    if (!id) return

    const {
        data:detailedTournament, ispending, isError, error, refetch
    } = useQuery({
        queryKey: ['tournament-detail', id],
        queryFn: () => teamTournamentService.getTournamentDetails(id),
        enabled: !!id,
        refetchOnMount:false,
        refetchOnWindowFocus:false,
        refetchOnReconnect:false,
        staleTime:1000*60*10
    })


    return (
        <TournamentDetails 
            tournament={detailedTournament} 
            contributionStatus="open" 
            canContribute={true} 
            />
    );
}