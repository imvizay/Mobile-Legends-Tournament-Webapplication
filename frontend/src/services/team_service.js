import { api } from "../api/client/request"
import { USER_TEAM_ENDPOINTS } from "../api/endpoints/userEndpoints"

export const teamService = {

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
        console.log("Load team is called.")
        return api.get(
            USER_TEAM_ENDPOINTS.DISCOVER_TEAMS
        )
    }
}