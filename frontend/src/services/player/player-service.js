import { api } from "../../api/client/request"
import {
    PLAYER_DASHBOARD_ENDPOINTS as PENDP,
    TOURNAMENT_ENDPOINTS,
} from "../../api/endpoints/userEndpoints"

export const playerService = {
    getDashboard() {
        return api.get(PENDP.GET_DASHBOARD)
    },

    getProfile() {
        return api.get(PENDP.PLAYER_PROFILE)
    },

    getNotifications() {
        return api.get(PENDP.PLAYER_NOTIFICATION)
    },

    getFeaturedTournaments() {
        return api.get(PENDP.FEATURED_TOURNAMENTS)
    },

    getUpcomingTournaments() {
        return api.get(PENDP.UPCOMING_TOURNAMENTS)
    },

    getRecentMatches() {
        return api.get(PENDP.RECENT_MATCHES)
    },

    getRecentWinners() {
        return api.get(PENDP.RECENT_WINNERS)
    },

    getLeaderboard() {
        return api.get(PENDP.LEADERBOARD)
    },
}


// Tournament Service

export const tournamentService = {
    registerTournament(tournament_id){
        return api.post(TOURNAMENT_ENDPOINTS.REGISTER,{
            tournament_id
        })
    }
}