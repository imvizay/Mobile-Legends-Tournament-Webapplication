import { api } from "../../../../api/client/request"

export const bracketService = {
    getTournamentDetail: async (tournamentId) => {
        const res = await api.get(`/tournament/bracket/${tournamentId}/initialize-bracket`)
        return res
    },
    
    createRound: (tournamentId, payload) => {
        return api.post(`/tournament/bracket/${tournamentId}/round`, payload )
    }
}