import { api } from "../api/client/request"
import { USER_TEAM_ENDPOINTS } from "../api/endpoints/userEndpoints"
export const teamService = {
    createTeam(data){
        return api.post(
            USER_TEAM_ENDPOINTS.CREATE_TEAM,
            data
        )
    }
}