/* 
This file contain backend API endpoints 
Account Creation,
Login
Logout
CurrentUser
*/

import { api } from "../api/client/request"
import { AUTH_ENDPOINTS } from "../api/endpoints/authEndpoints"
export const authService = {

    // LOGIN
    login(credentials){
        return api.post(
            AUTH_ENDPOINTS.LOGIN,
            credentials
        )
    },

    // REGISTER
    register(payload){
        return api.post(
            AUTH_ENDPOINTS.REGISTER,
            payload
        )
    },

    // CURRENT USER
    currentUser(){
        return api.get(
            AUTH_ENDPOINTS.ME,
            token
        )
    },

    // LOGOUT
    logoutUser(){
        return api.post(
            AUTH_ENDPOINTS.LOGOUT
        )
    }

}