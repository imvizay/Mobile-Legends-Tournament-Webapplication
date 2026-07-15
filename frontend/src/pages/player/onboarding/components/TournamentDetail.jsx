import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { tournamentService } from '../../../../services/admin/tournament_service'

function TournamentDetail() {

    const { id } = useParams()

    const tournamentId = Number(id);
    const isValidId = Number.isInteger(tournamentId) && tournamentId > 0;
   
    const {
        data
    } = useQuery({
        queryKey: ['tournamentdetail', tournamentId],
        queryFn: tournamentService.getTournament(tournamentId),
        enabled:isValidId,
        staleTime: 1000 * 60 * 3, // 3 min ,
        refetchOnWindowFocus: false,
    })

    return (
        <div>
            
        </div>
    )
}

export default TournamentDetail