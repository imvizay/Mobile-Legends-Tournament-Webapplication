import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useUserContext } from '../../../../../contexts/UserContext'
import { tournamentService } from '../../../../../services/admin/tournament_service'

function PublishedTournament() {
    const { user } = useUserContext()
    const { data: publishedTournament } = useQuery({
        queryKey:['published-tournament',user.id],
        queryFn: tournamentService.publishTournament
    })
    

    return (
        <div>PublishedTournament</div>
    )
}

export default PublishedTournament