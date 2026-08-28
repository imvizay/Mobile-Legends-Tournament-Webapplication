import TournamentDetails from "../../onboarding/components/TournamentDetail";
import { dummyTournamentDetail } from "../../../../utils/playerdashboard_links/dummydata";
import { useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query'
import { teamTournamentService } from "../../../../services/team_service";

export default function TournamentPage() {

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