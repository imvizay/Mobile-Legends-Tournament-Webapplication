import { api } from "../../api/client/request"
import { TOURNAMENT_ENDPOINT } from "../../api/endpoints/tournamentEndpoints"

export const tournamentService = {

    createTournament: async (payload) => {
        const response = await api.post(
            TOURNAMENT_ENDPOINT.CREATE_TOURNAMENT,
            payload
        )

        return response.data
    },

    getTournaments: async () => {
        const response = await api.get(
            TOURNAMENT_ENDPOINT.GET_TOURNAMENTS
        )

        return response.data
    },

    getTournament: async (tournamentId) => {
        const response = await api.get(
            TOURNAMENT_ENDPOINT.GET_TOURNAMENT(tournamentId)
        )

        return response.data
    },

    updateTournament: async (tournamentId, payload) => {
        const response = await api.patch(
            TOURNAMENT_ENDPOINT.UPDATE_TOURNAMENT(tournamentId),
            payload
        )

        return response.data
    },

    publishTournament: async (tournamentId) => {
        const response = await api.post(
            TOURNAMENT_ENDPOINT.PUBLISH_TOURNAMENT(tournamentId)
        )

        return response.data
    },

    cancelTournament: async (tournamentId) => {
        const response = await api.post(
            TOURNAMENT_ENDPOINT.CANCEL_TOURNAMENT(tournamentId)
        )

        return response.data
    },

}