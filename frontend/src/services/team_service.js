import { api } from "../api/client/request"
import { USER_TEAM_ENDPOINTS } from "../api/endpoints/userEndpoints"

export const teamService = {

    getTeamDashboard(){
        return api.get('/player/team/dashboard')
    },
    
    getMyTeamSummary(){
        return api.get(USER_TEAM_ENDPOINTS.TEAM_SUMMARY)
    },

    createTeam(data){
        return api.post(
            USER_TEAM_ENDPOINTS.CREATE_TEAM,
            data,
            {
                withCredentials:true,
                timeout:15000
            }
        )
    },

    getMyTeam(){
        return api.get(
            USER_TEAM_ENDPOINTS.GET_MY_TEAM
        )
    },

    loadTeam(){
        return api.get(
            USER_TEAM_ENDPOINTS.DISCOVER_TEAMS
        )
    },
    
    joinTeam(teamId){
        return api.post(
            USER_TEAM_ENDPOINTS.JOIN_TEAM(teamId),
        )
    },

    leaveTeam(teamId){
        return api.post(
            USER_TEAM_ENDPOINTS.LEAVE_TEAM(teamId)
        )
    },

    loadTeamMembers(teamId){
        return api.get(
            USER_TEAM_ENDPOINTS.JOIN_TEAM
        )
    }

}

export const teamTournamentService = {
    teamTournamentRegistration(tournament_id){
        return api.post(
            `/player/team/tournament/${tournament_id}/register`
        )
    }
}