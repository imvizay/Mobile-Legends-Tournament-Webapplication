import { api } from "../api/client/request"
import { ADMIN_USER_ENDPOINTS } from "../api/endpoints/adminEndpoints"
export const userService = {
    getUsers(){
        return api.get(ADMIN_USER_ENDPOINTS.GET_USER)
    }
}